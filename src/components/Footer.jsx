import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Youtube, Music2, Lock } from 'lucide-react'
import Logo from './Logo'
import { site } from '../config/site'

const SOSIAL = [
  { key: 'instagram', icon: Instagram, label: 'Instagram' },
  { key: 'facebook', icon: Facebook, label: 'Facebook' },
  { key: 'youtube', icon: Youtube, label: 'YouTube' },
  { key: 'tiktok', icon: Music2, label: 'TikTok' },
]

export default function Footer() {
  const { kontak, sosial } = site
  const year = new Date().getFullYear()

  return (
    <footer id="kontak" className="relative overflow-hidden bg-primary-950 text-primary-100">
      <div className="bg-batik absolute inset-0 opacity-40" />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary-600/30 blur-3xl" />

      <div className="container-page relative">
        <div className="-mb-px flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Mari bergabung & <span className="text-gradient-gold">berkontribusi</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-primary-200">
              Punya ide kegiatan atau ingin menjadi bagian dari kami? Sampaikan langsung melalui WhatsApp.
            </p>
          </div>
          <a
            href={`https://wa.me/${kontak.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="btn-accent shrink-0 !px-6 !py-3"
          >
            <MessageCircle className="h-5 w-5" /> Chat WhatsApp
          </a>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <Logo className="h-12 w-12" />
              <div>
                <p className="font-display text-lg font-bold text-white">{site.name}</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">{site.wilayah}</p>
              </div>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-200">{site.description}</p>
            <div className="mt-6 flex gap-3">
              {SOSIAL.filter((s) => sosial[s.key]).map(({ key, icon: Icon, label }) => (
                <a
                  key={key}
                  href={sosial[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-primary-100 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-accent-400 hover:text-primary-950"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-300">Navigasi</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['/', 'Beranda'],
                ['/kegiatan', 'Kegiatan'],
                ['/anggota', 'Anggota'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 text-primary-200 transition hover:translate-x-1 hover:text-accent-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent-400" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-accent-300">Kontak</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={kontak.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex gap-3 text-primary-200 transition hover:text-accent-300"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                  {kontak.alamat}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${kontak.email}`}
                  className="flex gap-3 break-all text-primary-200 transition hover:text-accent-300"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                  {kontak.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${kontak.telepon.replace(/[^\d+]/g, '')}`}
                  className="flex gap-3 text-primary-200 transition hover:text-accent-300"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                  {kontak.telepon}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-primary-300 sm:flex-row">
          <p>
            © {year} {site.fullName}. Semua hak dilindungi.
          </p>
          <Link to="/admin" className="inline-flex items-center gap-1.5 transition hover:text-accent-300">
            <Lock className="h-3.5 w-3.5" /> Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
