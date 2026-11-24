import { Link } from 'react-router-dom'
import { ArrowUpRight, CalendarDays, ImageOff, MapPin } from 'lucide-react'
import { formatTanggal, isUpcoming, tanggalParts, truncate } from '../lib/format'

export default function KegiatanCard({ item }) {
  const { day, month, year } = tanggalParts(item.tanggal)
  const upcoming = isUpcoming(item.tanggal)

  return (
    <Link
      to={`/kegiatan/${item.id}`}
      className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-soft hover:ring-accent-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-800 to-primary-950">
        {item.foto_url ? (
          <img
            src={item.foto_url}
            alt={item.judul}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="bg-batik grid h-full w-full place-items-center text-accent-300/70">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />

        {/* Badge tanggal */}
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-white/95 px-3 py-1.5 text-center shadow-lg backdrop-blur transition group-hover:bg-accent-400">
          <span className="text-xl font-extrabold leading-none text-primary-800">{day}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
            {month} {String(year).slice(-2)}
          </span>
        </div>

        {upcoming && (
          <span className="absolute right-4 top-4 rounded-full bg-accent-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-950 shadow">
            Akan Datang
          </span>
        )}

        <span className="absolute bottom-4 right-4 grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-accent-400 text-primary-950 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-accent-600" />
            {formatTanggal(item.tanggal)}
          </span>
          {item.lokasi && (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-600" />
              <span className="truncate">{item.lokasi}</span>
            </span>
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-stone-900 transition group-hover:text-primary-700">
          {item.judul}
        </h3>
        {item.deskripsi && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
            {truncate(item.deskripsi, 160)}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
          Selengkapnya
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
