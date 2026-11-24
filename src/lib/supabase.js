import { createClient } from '@supabase/supabase-js'

/**
 * Klien Supabase untuk frontend.
 *
 * KEAMANAN: hanya memakai ANON key (aman untuk publik karena dibatasi RLS).
 * JANGAN PERNAH menaruh service_role key di sini / di file .env frontend.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diisi. ' +
      'Salin .env.example menjadi .env lalu isi nilainya.',
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

export const BUCKET_FOTO = 'foto'
