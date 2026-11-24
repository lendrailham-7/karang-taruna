import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, CalendarPlus, Clock, UserPlus, Users } from 'lucide-react'
import { getKegiatan, getStats } from '../../lib/api'
import { formatTanggal, isUpcoming } from '../../lib/format'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Skeleton, TableRowSkeleton } from '../../components/Skeleton'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'

function salam() {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export default function Dashboard() {
  useDocumentTitle('Dasbor Admin')
  const { user } = useAuth()
  const stats = useAsync(() => getStats(), [])
  const terbaru = useAsync(() => getKegiatan({ limit: 5 }), [])
  const upcoming = (terbaru.data ?? []).filter((k) => isUpcoming(k.tanggal)).length

  const cards = [
    { label: 'Total Kegiatan', value: stats.data?.kegiatan, icon: CalendarDays, to: '/admin/kegiatan', color: 'from-primary-600 to-primary-800' },
    { label: 'Total Anggota', value: stats.data?.anggota, icon: Users, to: '/admin/anggota', color: 'from-accent-400 to-accent-600' },
    { label: 'Akan Datang', value: terbaru.loading ? undefined : upcoming, icon: Clock, to: '/admin/kegiatan', color: 'from-stone-600 to-stone-800' },
  ]

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 to-primary-950 p-6 text-white shadow-soft sm:p-8">
        <div className="bg-batik absolute inset-0 opacity-40" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-400/20 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-medium text-accent-300">{salam()} 👋</p>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Dasbor Admin</h1>
          <p className="mt-1 truncate text-sm text-primary-200">{user?.email}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/admin/kegiatan?baru=1" className="btn-accent">
              <CalendarPlus className="h-4 w-4" /> Tambah Kegiatan
            </Link>
            <Link to="/admin/anggota?baru=1" className="btn-ghost-light">
              <UserPlus className="h-4 w-4" /> Tambah Anggota
            </Link>
          </div>
        </div>
      </div>

      {stats.error ? (
        <ErrorState error={stats.error} onRetry={stats.reload} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map(({ label, value, icon: Icon, to, color }) => (
            <Link
              key={label}
              to={to}
              className="group card flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md transition group-hover:rotate-6 group-hover:scale-110`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
                {value === undefined ? (
                  <Skeleton className="mt-1 h-7 w-12" />
                ) : (
                  <p className="text-2xl font-extrabold text-stone-900">{value}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 p-5">
          <h2 className="font-bold text-stone-900">Kegiatan Terbaru</h2>
          <Link
            to="/admin/kegiatan"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primary-700"
          >
            Kelola <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        {terbaru.loading ? (
          <TableRowSkeleton rows={3} />
        ) : terbaru.error ? (
          <div className="p-5">
            <ErrorState error={terbaru.error} onRetry={terbaru.reload} />
          </div>
        ) : !terbaru.data?.length ? (
          <div className="p-5">
            <EmptyState
              icon={CalendarDays}
              title="Belum ada kegiatan"
              description="Tambahkan kegiatan pertama Anda."
              action={
                <Link to="/admin/kegiatan?baru=1" className="btn-primary">
                  <CalendarPlus className="h-4 w-4" /> Tambah Kegiatan
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {terbaru.data.map((k) => (
              <li key={k.id} className="flex items-center gap-4 p-4 transition hover:bg-stone-50">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-primary-100">
                  {k.foto_url && <img src={k.foto_url} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-stone-800">{k.judul}</p>
                  <p className="text-xs text-stone-500">{formatTanggal(k.tanggal)}</p>
                </div>
                {isUpcoming(k.tanggal) && (
                  <span className="hidden rounded-full bg-accent-100 px-2.5 py-1 text-[11px] font-bold text-accent-800 sm:inline">
                    Akan datang
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
