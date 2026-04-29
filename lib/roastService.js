import { supabase, getSupabase } from './supabaseClient'

// ─── BATCHES ──────────────────────────────────────────────────────────────────

export async function loadBatches() {
  const client = getSupabase()
  if (!client) return []
  const { data, error } = await client
    .from('batches')
    .select('*, batch_readings(*), batch_events(*)')
    .order('created_at', { ascending: false })
  if (error) { console.error('loadBatches error:', error); return [] }
  return data.map(b => ({
    ...b,
    batchNum:    b.batch_num,
    poids_vert:  b.poids_vert,
    poids_final: b.poids_final,
    notes_debut: b.notes_debut,
    notes_fin:   b.notes_fin,
    duree_total: b.duree_total,
    degustation: b.degustation || null,
    readings: (b.batch_readings || []).map(r => ({
      id:      r.id,
      t:       r.temps_min,
      et:      r.et_temp,
      airflow: r.airflow,
      power:   r.power,
    })),
    events: Object.fromEntries(
      (b.batch_events || []).map(e => [e.event_type, e.temps_min])
    ),
  }))
}

export async function saveBatch(batch, readings, events) {
  const authResult = await supabase.auth.getUser()
  const user = authResult?.data?.user
  if (!user) throw new Error('Non connecté')

  const { data: b, error } = await supabase
    .from('batches')
    .upsert({
      id:          batch.id,
      user_id:     user.id,
      batch_num:   batch.batchNum,
      date:        batch.date,
      origine:     batch.origine,
      poids_vert:  batch.poids_vert,
      poids_final: batch.poids_final,
      couleur:     batch.couleur,
      notes_debut: batch.notes_debut,
      notes_fin:   batch.notes_fin,
      duree_total: batch.duree_total,
      statut:      batch.statut,
      degustation: batch.degustation || null,
    })
    .select()
    .single()
  if (error) throw error

  await supabase.from('batch_readings').delete().eq('batch_id', b.id)
  await supabase.from('batch_events').delete().eq('batch_id', b.id)

  if (readings.length)
    await supabase.from('batch_readings').insert(
      readings.map(r => ({
        batch_id:  b.id,
        temps_min: r.t,
        et_temp:   r.et,
        airflow:   r.airflow,
        power:     r.power,
      }))
    )

  const eventRows = Object.entries(events).map(([type, t]) => ({
    batch_id:   b.id,
    event_type: type,
    temps_min:  t,
  }))
  if (eventRows.length)
    await supabase.from('batch_events').insert(eventRows)

  return b
}

export async function saveDegustation(batchId, degustation) {
  const { error } = await supabase
    .from('batches')
    .update({ degustation })
    .eq('id', batchId)
  if (error) throw error
}

// ─── COURBE DE RÉFÉRENCE ──────────────────────────────────────────────────────

export async function loadRefCurve() {
  const client = getSupabase()
  if (!client) return null
  const authResult = await client.auth.getUser()
  const user = authResult?.data?.user
  if (!user) return null
  const { data, error } = await client
    .from('reference_curve')
    .select('temps_min, ref_temp')
    .eq('user_id', user.id)
    .order('sort_order')
  if (error || !data?.length) return null
  return data.map(p => ({ t: p.temps_min, ref: p.ref_temp }))
}

export async function saveRefCurve(curve) {
  const authResult = await supabase.auth.getUser()
  const user = authResult?.data?.user
  if (!user) return
  await supabase.from('reference_curve').delete().eq('user_id', user.id)
  await supabase.from('reference_curve').insert(
    curve.map((p, i) => ({
      user_id:    user.id,
      temps_min:  p.t,
      ref_temp:   p.ref,
      sort_order: i,
    }))
  )
}