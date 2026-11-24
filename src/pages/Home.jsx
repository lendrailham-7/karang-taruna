import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  HandHeart,
  Leaf,
  Sparkles,
  Target,
  Trophy,
  Users,
  CheckCircle2,
} from 'lucide-react'
import { site } from '../config/site'
import { getKegiatan, getStats } from '../lib/api'
import { useAsync } from '../hooks/useAsync'
import { useInView } from '../hooks/useInView'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import KegiatanCard from '../components/KegiatanCard'
import Logo from '../components/Logo'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { KegiatanGridSkeleton } from '../components/Skeleton'

const BIDANG = [
  { icon: HandHeart, title: 'Sosial', text: 'Santunan, bakti sosial, dan aksi kepedulian warga.' },
  { icon: Trophy, title: 'Olahraga', text: 'Turnamen dan kegiatan olahraga rutin pemuda.' },
  { icon: Sparkles, title: 'Seni & Budaya', text: 'Pentas seni, kreativitas, dan pelestarian budaya.' },
  { icon: Leaf, title: 'Lingkungan', text: 'Kerja bakti, penghijauan, dan pengelolaan sampah.' },
]

function useCountUp(target, start) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start || !target) {
      setValue(0)
      return undefined
    }
    let raf
    const duration = 1200
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start])
  return value
}

function StatItem({ icon: Icon, value, suffix = '', label, start, loading }) {
  const n = useCountUp(value ?? 0, start)
  return (
    <div className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10 sm:p-5">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent-300 to-accent-500 text-primary-950 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-white sm:text-3xl">
          {loading ? (
            <span className="inline-block h-7 w-10 animate-pulse rounded bg-white/20" />
          ) : (
            `${n}${suffix}`
          )}
        </p>
        <p className="text-xs font-medium uppercase tracking-wider text-primary-200">{label}</p>
      </div>
    </div>
  )
}

function Hero() {
  const stats = useAsync(() => getStats(), [])
  const [statsRef, statsVisible] = useInView({ threshold: 0.3 })
  const heroRef = useRef(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const onMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    })
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={onMove}
      className="relative isolate overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 pb-20 pt-28 sm:pb-28 sm:pt-36"
    >
      <div className="bg-batik absolute inset-0 -z-10 opacity-60" />
      <div
        className="absolute -right-32 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent-500/20 blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mouse.x * -40}px, ${mouse.y * -40}px)` }}
      />
      <div
        className="absolute -bottom-40 -left-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-primary-500/30 blur-3xl transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mouse.x * 40}px, ${mouse.y * 40}px)` }}
      />

      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-200 ring-1 ring-accent-300/30 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
              </span>
              Organisasi Kepemudaan RW 14
            </p>

            <h1 className="mt-6 animate-fade-up font-display text-4xl font-extrabold leading-[1.1] text-white [animation-delay:100ms] sm:text-5xl lg:text-6xl">
              Karang Taruna <span className="text-gradient-gold">14</span>
              <br />
              Antapani Kidul
            </h1>

            <p className="mt-5 animate-fade-up text-lg font-medium text-accent-200 [animation-delay:200ms] sm:text-xl">
              “{site.tagline}”
            </p>
            <p className="mt-4 max-w-2xl animate-fade-up text-base leading-relaxed text-primary-100/90 [animation-delay:300ms]">
              {site.description}
            </p>

            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:400ms]">
              <Link to="/kegiatan" className="btn-accent group !px-6 !py-3">
                Lihat Kegiatan
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/anggota" className="btn-ghost-light !px-6 !py-3">
                <Users className="h-4 w-4" /> Kenali Pengurus
              </Link>
            </div>
          </div>

          <div className="flex animate-fade-up justify-center [animation-delay:250ms] lg:col-span-5 lg:justify-end">
            <div
              className="relative flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `translate(${mouse.x * -18}px, ${mouse.y * -18}px)` }}
            >
              <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-accent-500/25 via-accent-300/15 to-primary-500/20 blur-2xl" />
              <div className="absolute -inset-3 rounded-full ring-1 ring-accent-300/25" />
              <Logo className="relative h-48 w-48 animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] sm:h-56 sm:w-56 lg:h-72 lg:w-72 xl:h-80 xl:w-80" />
            </div>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-14 grid max-w-3xl animate-fade-up grid-cols-1 gap-3 [animation-delay:500ms] sm:grid-cols-3 sm:gap-4"
        >
          <StatItem
            icon={CalendarDays}
            value={stats.data?.kegiatan}
            label="Kegiatan"
            start={statsVisible}
            loading={stats.loading}
          />
          <StatItem
            icon={Users}
            value={stats.data?.anggota}
            label="Anggota"
            start={statsVisible}
            loading={stats.loading}
          />
          <StatItem
            icon={HandHeart}
            value={100}
            suffix="%"
            label="Semangat"
            start={statsVisible}
            loading={false}
          />
        </div>
      </div>

      <a
        href="#profil"
        aria-label="Gulir ke profil"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce rounded-full p-2 text-accent-300/80 transition hover:text-accent-200 sm:block"
      >
        <ChevronDown className="h-7 w-7" />
      </a>
    </section>
  )
}

function Profil() {
  const { profil } = site
  return (
    <section id="profil" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow="Profil Singkat" title={profil.judul} align="left" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600">
            {profil.paragraf.map((p, i) => (
              <Reveal key={i} delay={i * 100} as="p">
                {p}
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary-50 transition-transform duration-500 group-hover:scale-[3]" />
              <div className="relative">
                <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-lg bg-primary-700 text-accent-300">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-primary-900">Visi</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">{profil.visi}</p>
              </div>
            </div>
            <div className="card group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent-50 transition-transform duration-500 group-hover:scale-[3]" />
              <div className="relative">
                <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-lg bg-accent-400 text-primary-950">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-primary-900">Misi</h3>
                <ul className="mt-1 space-y-1 text-sm text-stone-600">
                  {profil.misi.map((m) => (
                    <li key={m} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {BIDANG.map(({ icon: Icon, title, text }, i) => (
            <Reveal
              key={title}
              delay={i * 100}
              className={`group relative overflow-hidden rounded-2xl p-6 transition duration-300 hover:-translate-y-1.5 ${
                i % 3 === 0
                  ? 'bg-gradient-to-br from-primary-700 to-primary-900 text-white shadow-soft'
                  : 'card hover:shadow-soft'
              } ${i % 2 === 1 ? 'lg:translate-y-8' : ''}`}
            >
              <div
                className={`mb-4 grid h-12 w-12 place-items-center rounded-xl transition duration-300 group-hover:rotate-12 group-hover:scale-110 ${
                  i % 3 === 0 ? 'bg-accent-400 text-primary-950' : 'bg-primary-50 text-primary-700'
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className={`font-bold ${i % 3 === 0 ? 'text-accent-200' : 'text-primary-900'}`}>{title}</h3>
              <p className={`mt-1 text-sm leading-relaxed ${i % 3 === 0 ? 'text-primary-100' : 'text-stone-600'}`}>
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function KegiatanTerbaru() {
  const { data, loading, error, reload } = useAsync(() => getKegiatan({ limit: 3 }), [])

  return (
    <section className="relative bg-gradient-to-b from-white to-primary-50/40 py-20 sm:py-24">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Kabar Terkini"
            title="Kegiatan Terbaru"
            description="Dokumentasi aksi dan kegiatan yang telah maupun akan kami laksanakan."
            align="left"
          />
          <Reveal>
            <Link to="/kegiatan" className="btn-outline group">
              Semua Kegiatan <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10">
          {loading ? (
            <KegiatanGridSkeleton count={3} />
          ) : error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : !data?.length ? (
            <EmptyState
              icon={CalendarDays}
              title="Belum ada kegiatan"
              description="Kegiatan terbaru akan segera ditampilkan di sini. Nantikan ya!"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((item, i) => (
                <Reveal key={item.id} delay={i * 120} className="h-full">
                  <KegiatanCard item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useDocumentTitle()
  return (
    <>
      <Hero />
      <Profil />
      <KegiatanTerbaru />
    </>
  )
}
