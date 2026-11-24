import { AlertTriangle } from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabase'

/** Banner peringatan bila env Supabase belum diisi. */
export default function ConfigNotice({ className = '' }) {
  if (isSupabaseConfigured) return null
  return (
    <div
      className={`fixed bottom-5 left-5 right-20 z-40 mx-auto max-w-lg animate-fade-up rounded-xl bg-amber-50 p-4 text-sm text-amber-900 shadow-soft ring-1 ring-amber-200 sm:right-auto ${className}`}
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p>
          <strong>Supabase belum dikonfigurasi.</strong> Isi <code className="font-mono">VITE_SUPABASE_URL</code> dan{' '}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> di file <code className="font-mono">.env</code>{' '}
          (lokal) atau Environment Variables (Vercel).
        </p>
      </div>
    </div>
  )
}
