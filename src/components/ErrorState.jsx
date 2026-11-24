import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({ error, onRetry, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl bg-primary-50/70 px-6 py-12 text-center ring-1 ring-primary-100 ${className}`}
    >
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-100 text-primary-700">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-primary-900">Gagal memuat data</h3>
      <p className="mt-1 max-w-md text-sm text-primary-800/80">
        {error?.message || 'Terjadi kesalahan. Periksa koneksi internet Anda.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">
          <RefreshCw className="h-4 w-4" /> Coba lagi
        </button>
      )}
    </div>
  )
}
