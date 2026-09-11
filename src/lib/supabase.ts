import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export let supabase: SupabaseClient | null = null

if (isSupabaseConfigured) {
  supabase = createClient(url!, anonKey!)
}

// Helpers
export function hasSupabase(): boolean {
  return isSupabaseConfigured && supabase !== null
}
