import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, Clock, ImageOff, MapPin, Share2, ZoomIn } from 'lucide-react'
import { getKegiatan, getKegiatanById } from '../lib/api'
import { formatTanggal, isUpcoming } from '../lib/format'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useToast } from '../context/ToastContext'
import PageHeader from '../components/PageHeader'
import KegiatanCard from '../components/KegiatanCard'
import Reveal from '../components/Reveal'
import Lightbox from '../components/Lightbox'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { Skeleton } from '../components/Skeleton'

function DetailSkeleton() {
  return (
    <div className="container-page grid gap-10 py-28 sm:py-36 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  )
}

export default function KegiatanDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { data: item, loading, error, reload } = useAsync(() => getKegiatanById(id), [id])
  const lainnya = useAsync(() => getKegiatan({ limit: 4 }), [])
  const [zoom, setZoom] = useState(false)
  const [copied, setCopied] = useState(false)
  useDocumentTitle(item?.judul ?? 'Detail Kegiatan')

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: item.judul, text: item.judul, url })
      } catch {
        /* dibatalkan pengguna */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Tautan disalin ke clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin tautan')
    }
  }

  if (loading) return <DetailSkeleton />

  if (error || !item) {
    return (
      <>
        <PageHeader title="Detail Kegiatan" crumbs={[{ label: 'Kegiatan', to: '/kegiatan' }, { label: 'Detail' }]} />
        <div className="container-page py-16">
          {error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Kegiatan tidak ditemukan"
              description="Kegiatan mungkin sudah dihapus atau tautan tidak valid."
              action={
                <Link to="/kegiatan" className="btn-primary">
                  <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
                </Link>
              }
            />
          )}
        </div>
      </>
    )
  }

  const upcoming = isUpcoming(item.tanggal)
  const others = (lainnya.data ?? []).filter((k) => k.id !== item.id).slice(0, 3)

  return (
    <>
      <PageHeader
        title={item.judul}
        crumbs={[{ label: 'Kegiatan', to: '/kegiatan' }, { label: 'Detail' }]}
      />

      <article className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal>
            {item.foto_url ? (
              <button
                onClick={() => setZoom(true)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-primary-950 shadow-soft"
                aria-label="Perbesar foto"
              >
                <img
                  src={item.foto_url}
                  alt={item.judul}
                  className="max-h-[520px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-primary-950/0 transition group-hover:bg-primary-950/40">
                  <span className="flex scale-75 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-primary-800 opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" /> Perbesar
                  </span>
                </span>
              </button>
            ) : (
              <div className="bg-batik grid aspect-[16/9] place-items-center rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950 text-accent-300/70">
                <ImageOff className="h-12 w-12" />
              </div>
            )}
          </Reveal>

          <Reveal delay={100} className="mt-8">
            <h2 className="text-xl font-bold text-primary-900">Deskripsi Kegiatan</h2>
            <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-stone-700">
              {item.deskripsi || <span className="italic text-stone-400">Belum ada deskripsi.</span>}
            </div>
          </Reveal>

          <Link
            to="/kegiatan"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /> Kembali ke semua kegiatan
          </Link>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="card overflow-hidden">
            <div className="bg-gradient-to-br from-primary-700 to-primary-900 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-300">Informasi</p>
              {upcoming && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-400 px-3 py-1 text-xs font-bold text-primary-950">
                  <Clock className="h-3.5 w-3.5" /> Akan Datang
                </span>
              )}
            </div>
            <dl className="space-y-4 p-5">
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-stone-400">Tanggal</dt>
                  <dd className="font-semibold text-stone-800">{formatTanggal(item.tanggal, { withDay: true })}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-100 text-accent-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-stone-400">Lokasi</dt>
                  <dd className="break-words font-semibold text-stone-800">{item.lokasi || '-'}</dd>
                  {item.lokasi && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(item.lokasi)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs font-semibold text-primary-600 hover:underline"
                    >
                      Buka di Google Maps →
                    </a>
                  )}
                </div>
              </div>
            </dl>
            <div className="border-t border-stone-100 p-5">
              <button onClick={share} className="btn-accent w-full">
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Tersalin!' : 'Bagikan Kegiatan'}
              </button>
            </div>
          </Reveal>
        </aside>
      </article>

      {others.length > 0 && (
        <section className="bg-gradient-to-b from-white to-primary-50/40 py-14 sm:py-16">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold text-primary-900 sm:text-3xl">Kegiatan Lainnya</h2>
            <span className="mt-3 block h-1 w-14 rounded-full bg-gradient-to-r from-accent-400 to-accent-600" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((k, i) => (
                <Reveal key={k.id} delay={i * 100} className="h-full">
                  <KegiatanCard item={k} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox src={item.foto_url} alt={item.judul} open={zoom} onClose={() => setZoom(false)} />
    </>
  )
}
