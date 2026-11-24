import { Link } from 'react-router-dom'
import { Home, Compass } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Halaman tidak ditemukan')
  return (
    <section className="relative isolate grid min-h-[80vh] place-items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4 pt-20 text-center">
      <div className="bg-batik absolute inset-0 -z-10 opacity-60" />
      <div>
        <Compass className="mx-auto h-14 w-14 animate-float text-accent-400" />
        <p className="mt-4 font-display text-7xl font-extrabold text-gradient-gold sm:text-8xl">404</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-2 max-w-md text-primary-200">
          Sepertinya Anda tersesat. Halaman yang dicari tidak ada atau sudah dipindahkan.
        </p>
        <Link to="/" className="btn-accent mt-8 !px-6 !py-3">
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
