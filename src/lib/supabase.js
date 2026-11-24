import { createClient } from '@supabase/supabase-js'

/**
 * Klien Supabase untuk frontend.
 *
 * KEAMANAN: hanya memakai ANON key (aman untuk publik karena dibatasi RLS).
 * JANGAN PERNAH menaruh service_role key di sini / di file .env frontend.
 */
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
// Bersihkan bila pengguna tidak sengaja menyalin URL dengan akhiran /rest/v1/
const supabaseUrl = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '') : ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

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
