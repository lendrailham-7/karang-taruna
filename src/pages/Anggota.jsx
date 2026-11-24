import { useCallback, useMemo, useState } from 'react'
import { Search, SearchX, Users, X } from 'lucide-react'
import { getAnggota } from '../lib/api'
import { useAsync } from '../hooks/useAsync'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import PageHeader from '../components/PageHeader'
import AnggotaCard from '../components/AnggotaCard'
import Avatar from '../components/Avatar'
import Reveal from '../components/Reveal'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Lightbox from '../components/Lightbox'
import { AnggotaGridSkeleton } from '../components/Skeleton'

export default function Anggota() {
  useDocumentTitle('Anggota')
  const { data, loading, error, reload } = useAsync(() => getAnggota(), [])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const closeLightbox = useCallback(() => setSelected(null), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data ?? []
    return (data ?? []).filter(
      (a) => a.nama?.toLowerCase().includes(q) || a.jabatan?.toLowerCase().includes(q),
    )
  }, [data, query])

  return (
    <>
      <PageHeader
        title="Anggota & Pengurus"
        description="Orang-orang hebat di balik setiap kegiatan Karang Taruna 14 Antapani Kidul."
        crumbs={[{ label: 'Anggota' }]}
      />

      <section className="container-page py-12 sm:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama atau jabatan…"
              className="input !rounded-full !py-3 !pl-11 !pr-10 shadow-sm"
              aria-label="Cari anggota"
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
          {!loading && !error && data?.length > 0 && (
            <p className="flex items-center gap-2 text-sm text-stone-500">
              <Users className="h-4 w-4 text-accent-600" />
              <span>
                <strong className="text-stone-800">{filtered.length}</strong>
                {query ? ` dari ${data.length}` : ''} anggota
              </span>
            </p>
          )}
        </div>

        {loading ? (
          <AnggotaGridSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : !data?.length ? (
          <EmptyState
            icon={Users}
            title="Belum ada anggota"
            description="Daftar anggota dan pengurus akan tampil di sini."
          />
        ) : !filtered.length ? (
          <EmptyState
            icon={SearchX}
            title="Anggota tidak ditemukan"
            description={`Tidak ada nama atau jabatan yang cocok dengan “${query}”.`}
            action={
              <button onClick={() => setQuery('')} className="btn-outline">
                Hapus pencarian
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((a, i) => (
              <Reveal key={a.id} delay={(i % 4) * 80}>
                <AnggotaCard item={a} onClick={() => setSelected(a)} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Lihat foto anggota */}
      {selected?.foto_url ? (
        <Lightbox src={selected.foto_url} alt={selected.nama} open onClose={closeLightbox} />
      ) : selected ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-[90] grid animate-fade-in place-items-center bg-primary-950/80 p-4 backdrop-blur-sm"
        >
          <div className="card w-full max-w-xs animate-scale-in p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <Avatar name={selected.nama} size="xl" className="mx-auto ring-4 ring-accent-300" />
            <h3 className="mt-4 text-xl font-bold text-stone-900">{selected.nama}</h3>
            <p className="mt-1 text-sm font-semibold text-accent-700">{selected.jabatan}</p>
            <button onClick={closeLightbox} className="btn-outline mt-6 w-full">
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
