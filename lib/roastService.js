import { supabase } from './supabaseClient'

export async function saveBatch(batch, readings, events) {
  const { data: b, error } = await supabase
    .from('batches')
    .upsert({
      id: batch.id, batch_num: batch.batchNum, date: batch.date,
      origine: batch.origine, poids_vert: batch.poids_vert,
      poids_final: batch.poids_final, couleur: batch.couleur,
      notes_debut: batch.notes_debut, notes_fin: batch.notes_fin,
      duree_total: batch.duree_total, statut: batch.statut,
    })
    .select().single()
  if (error) throw error

  // Supprimer et réécrire les lectures/événements
  await supabase.from('batch_readings').delete().eq('batch_id', b.id)
  await supabase.from('batch_events').delete().eq('batch_id', b.id)

  if (readings.length)
    await supabase.from('batch_readings').insert(
      readings.map(r => ({ batch_id: b.id, temps_min: r.t, et_temp: r.et, airflow: r.airflow, power: r.power }))
    )

  const eventRows = Object.entries(events).map(([type, t]) => ({ batch_id: b.id, event_type: type, temps_min: t }))
  if (eventRows.length) await supabase.from('batch_events').insert(eventRows)

  return b
}

export async function loadBatches() {
  const { data, error } = await supabase
    .from('batches')
    .select('*, batch_readings(*), batch_events(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(b => ({
    ...b, batchNum: b.batch_num,
    readings: (b.batch_readings || []).map(r => ({ id: r.id, t: r.temps_min, et: r.et_temp, airflow: r.airflow, power: r.power })),
    events: Object.fromEntries((b.batch_events || []).map(e => [e.event_type, e.temps_min])),
  }))
}

export async function saveRefCurve(curve) {
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('reference_curve').delete().eq('user_id', user.id)
  await supabase.from('reference_curve').insert(
    curve.map((p, i) => ({ user_id: user.id, temps_min: p.t, ref_temp: p.ref, sort_order: i }))
  )
}