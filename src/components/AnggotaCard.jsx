import { Crown } from 'lucide-react'
import Avatar from './Avatar'
import { parseJabatan } from '../config/struktur'

export default function AnggotaCard({ item, onClick, compactDivision = false }) {
  const info = item._struktur ?? parseJabatan(item.jabatan)
  const highlighted = info.isInti || info.isKoordinator

  const badgeText =
    compactDivision && info.kategori === 'divisi'
      ? info.peranDivisi
      : info.label

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group card relative flex h-full w-full flex-col items-center overflow-hidden px-4 pb-6 pt-8 text-center transition duration-300 hover:-translate-y-1.5 hover:shadow-soft hover:ring-accent-300 ${
        info.isKoordinator ? 'ring-2 ring-accent-300/90' : ''
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-primary-700 to-primary-900 transition-all duration-500 group-hover:h-full" />
      <div className="bg-batik absolute inset-x-0 top-0 h-20 opacity-60 transition-all duration-500 group-hover:h-full" />

      {info.isKoordinator && (
        <span className="absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-accent-400 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-950 shadow">
          <Crown className="h-3 w-3" /> Koor
        </span>
      )}

      <div className="relative">
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-br from-accent-200 via-accent-400 to-accent-600 transition duration-500 group-hover:rotate-180 group-hover:scale-105 ${
            highlighted ? 'opacity-100' : 'opacity-70'
          }`}
        />
        <Avatar src={item.foto_url} name={item.nama} size="lg" className="relative ring-4 ring-white" />
      </div>

      <h3 className="relative mt-4 line-clamp-2 text-base font-bold text-stone-900 transition-colors duration-300 group-hover:text-white sm:text-lg">
        {item.nama}
      </h3>

      <span
        className={`relative mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
          highlighted
            ? 'bg-accent-100 text-accent-800 group-hover:bg-accent-400 group-hover:text-primary-950'
            : 'bg-primary-50 text-primary-700 group-hover:bg-white/15 group-hover:text-accent-200'
        }`}
      >
        {info.isKoordinator && <Crown className="h-3 w-3 shrink-0" />}
        {badgeText}
      </span>

      {compactDivision && info.divisi && (
        <span className="relative mt-1.5 text-[11px] font-medium text-stone-400 transition-colors duration-300 group-hover:text-primary-200">
          Divisi {info.divisi}
        </span>
      )}
    </button>
  )
}
