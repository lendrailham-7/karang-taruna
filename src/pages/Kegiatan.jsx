import { useMemo, useState } from 'react'
import { CalendarDays, Search, SearchX, X } from 'lucide-react'
import { getKegiatan } from '../lib/api'
import { parseDate, isUpcoming } from '../lib/format'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import PageHeader from '../components/PageHeader'
import KegiatanCard from '../components/KegiatanCard'
import Reveal from '../components/Reveal'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import { KegiatanGridSkeleton } from '../components/Skeleton'

const PAGE_SIZE = 9

export default function Kegiatan() {
  useDocumentTitle('Kegiatan')
  const { data, loading, error, reload } = useAsync(() => getKegiatan(), [])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('semua')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const years = useMemo(() => {
    const set = new Set((data ?? []).map((k) => parseDate(k.tanggal)?.getFullYear()).filter(Boolean))
    return [...set].sort((a, b) => b - a)
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter((k) => {
      const matchQ =
        !q ||
        k.judul?.toLowerCase().includes(q) ||
        k.lokasi?.toLowerCase().includes(q) ||
        k.deskripsi?.toLowerCase().includes(q)
      let matchF = true
      if (filter === 'akan-datang') matchF = isUpcoming(k.tanggal)
      else if (filter !== 'semua') matchF = String(parseDate(k.tanggal)?.getFullYear()) === filter
      return matchQ && matchF
    })
  }, [data, query, filter])

  const chips = [
    { value: 'semua', label: 'Semua' },
    { value: 'akan-datang', label: 'Akan Datang' },
    ...years.map((y) => ({ value: String(y), label: String(y) })),
  ]

  const reset = () => {
    setQuery('')
    setFilter('semua')
  }

  return (
    <>
      <PageHeader
        title="Kegiatan Kami"
        description="Rekam jejak aksi nyata pemuda Karang Taruna 14 untuk lingkungan dan masyarakat."
        crumbs={[{ label: 'Kegiatan' }]}
      />

      <section className="container-page py-12 sm:py-16">
        <div className="sticky top-16 z-30 -mx-4 mb-8 bg-stone-50/90 px-4 py-3 backdrop-blur-md sm:top-20 sm:mx-0 sm:rounded-2xl sm:px-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setVisible(PAGE_SIZE)
                }}
                placeholder="Cari judul, lokasi, atau deskripsi…"
                className="input !rounded-full !pl-11 !pr-10"
                aria-label="Cari kegiatan"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:pb-0">
              {chips.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setFilter(c.value)
                    setVisible(PAGE_SIZE)
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 active:scale-95 ${
                    filter === c.value
                      ? 'bg-primary-700 text-white shadow-md shadow-primary-900/20'
                      : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:text-primary-700 hover:ring-primary-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <KegiatanGridSkeleton count={6} />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : !data?.length ? (
          <EmptyState
            icon={CalendarDays}
            title="Belum ada kegiatan"
            description="Kegiatan yang sudah dipublikasikan akan tampil di halaman ini."
          />
        ) : !filtered.length ? (
          <EmptyState
            icon={SearchX}
            title="Kegiatan tidak ditemukan"
            description="Coba gunakan kata kunci lain atau ubah filter."
            action={
              <button onClick={reset} className="btn-outline">
                Reset pencarian
              </button>
            }
          />
        ) : (
          <>
            <p className="mb-5 text-sm text-stone-500">
              Menampilkan <strong className="text-stone-800">{Math.min(visible, filtered.length)}</strong> dari{' '}
              <strong className="text-stone-800">{filtered.length}</strong> kegiatan
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visible).map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 100} className="h-full">
                  <KegiatanCard item={item} />
                </Reveal>
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-10 text-center">
                <button onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn-primary !px-8 !py-3">
                  Muat lebih banyak
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
