import { createClient } from '@supabase/supabase-js'

let _client = null

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    _client = createClient(url, key)
  }
  return _client
}

export const supabase = {
  from: (...a)  => getSupabase()?.from(...a),
  auth: {
  getUser:               ()     => getSupabase()?.auth.getUser(),
  onAuthStateChange:     (...a) => getSupabase()?.auth.onAuthStateChange(...a),
  signInWithPassword:    (...a) => getSupabase()?.auth.signInWithPassword(...a),
  signOut:               ()     => getSupabase()?.auth.signOut(),
}
}