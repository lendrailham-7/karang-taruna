import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { CalendarDays, ExternalLink, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { site } from '../../config/site'
import Logo from '../Logo'
import ConfigNotice from '../ConfigNotice'

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/kegiatan', label: 'Kegiatan', icon: CalendarDays },
  { to: '/admin/anggota', label: 'Anggota', icon: Users },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const logout = async () => {
    setLoggingOut(true)
    try {
      await signOut()
      toast.info('Anda telah keluar.')
      navigate('/admin/login', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100/70 pb-20 lg:pb-0 lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-primary-950 text-primary-100 lg:flex">
        <div className="bg-batik absolute inset-0 opacity-30" />
        <div className="relative flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <Logo className="h-10 w-10" />
          <div className="leading-tight">
            <p className="font-display font-bold text-white">{site.name}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-300">Panel Admin</p>
          </div>
        </div>
        <nav className="relative flex-1 space-y-1 p-4">
          {MENU.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-accent-400 to-accent-500 text-primary-950 shadow-lg shadow-accent-900/30'
                    : 'text-primary-100 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 transition group-hover:scale-110" />
              {label}
            </NavLink>
          ))}
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-primary-200 transition hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-5 w-5" /> Lihat Situs
          </Link>
        </nav>
        <div className="relative border-t border-white/10 p-4">
          <p className="truncate px-2 text-xs text-primary-300" title={user?.email}>
            Masuk sebagai
            <br />
            <span className="font-semibold text-white">{user?.email}</span>
          </p>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-100 ring-1 ring-white/10 transition hover:bg-red-500/20 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> {loggingOut ? 'Keluar…' : 'Keluar'}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-primary-950 px-4 text-white shadow-lg lg:hidden">
        <div className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" />
          <div className="leading-tight">
            <p className="font-display text-sm font-bold">{site.name}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-300">Panel Admin</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/" target="_blank" className="rounded-lg p-2 transition hover:bg-white/10" aria-label="Lihat situs">
            <ExternalLink className="h-5 w-5" />
          </Link>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="rounded-lg p-2 transition hover:bg-white/10"
            aria-label="Keluar"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-stone-200 bg-white/95 backdrop-blur lg:hidden">
        {MENU.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition ${
                isActive ? 'text-primary-700' : 'text-stone-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute top-0 h-0.5 w-10 rounded-full bg-accent-500 transition ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
                <Icon className={`h-5 w-5 transition ${isActive ? 'scale-110' : ''}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <ConfigNotice className="!bottom-20 lg:!bottom-5 lg:!left-72" />
    </div>
  )
}
