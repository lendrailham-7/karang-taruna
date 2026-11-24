import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Home, CalendarDays, Users, Phone } from 'lucide-react'
import Logo from './Logo'
import { site } from '../config/site'

const LINKS = [
  { to: '/', label: 'Beranda', icon: Home, end: true },
  { to: '/kegiatan', label: 'Kegiatan', icon: CalendarDays },
  { to: '/anggota', label: 'Anggota', icon: Users },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const solid = scrolled || !isHome || open

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-primary-950/90 shadow-lg shadow-primary-950/20 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="group flex items-center gap-3" aria-label="Beranda">
          <Logo className="h-10 w-10 transition duration-500 group-hover:rotate-[360deg] sm:h-11 sm:w-11" />
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-white sm:text-lg">{site.name}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-300">{site.wilayah}</p>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'text-accent-300' : 'text-white/85 hover:text-white'
                } after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent-400 after:transition-transform after:duration-300 ${
                  isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <a href="#kontak" className="btn-accent ml-3 !py-2">
            <Phone className="h-4 w-4" /> Kontak
          </a>
        </div>

        {/* Tombol mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative grid h-11 w-11 place-items-center rounded-xl text-white transition hover:bg-white/10 md:hidden"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
        >
          <Menu className={`absolute h-6 w-6 transition duration-300 ${open ? 'rotate-90 scale-0' : ''}`} />
          <X className={`absolute h-6 w-6 transition duration-300 ${open ? '' : '-rotate-90 scale-0'}`} />
        </button>
      </nav>

      {/* Progress scroll */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-accent-300 to-accent-600 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />

      {/* Menu mobile */}
      <div
        className={`grid overflow-hidden transition-all duration-300 md:hidden ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <div className="container-page space-y-1 border-t border-white/10 pb-6 pt-3">
            {LINKS.map(({ to, label, icon: Icon, end }, i) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition duration-300 ${
                    open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  } ${isActive ? 'bg-white/10 text-accent-300' : 'text-white/90 hover:bg-white/5'}`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
            <a href="#kontak" onClick={() => setOpen(false)} className="btn-accent mt-3 w-full !py-3">
              <Phone className="h-4 w-4" /> Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
