import { useCallback, useMemo, useState } from 'react'
import {
  Camera,
  Crown,
  Megaphone,
  Package,
  Search,
  SearchX,
  Sparkles,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { getAnggota } from '../lib/api'
import { DAFTAR_DIVISI, groupAnggota, parseJabatan } from '../config/struktur'
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

const GROUP_ICONS = {
  inti: Crown,
  'divisi-acara': Sparkles,
  'divisi-logistik': Package,
  'divisi-humas': Megaphone,
  'divisi-konsumsi': UtensilsCrossed,
  'divisi-pdd': Camera,
  lainnya: Users,
}

export default function Anggota() {
  useDocumentTitle('Struktur & Anggota')
  const { data, loading, error, reload } = useAsync(() => getAnggota(), [])
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('semua')
  const [selected, setSelected] = useState(null)
  const closeLightbox = useCallback(() => setSelected(null), [])

  const allGroups = useMemo(() => groupAnggota(data ?? []), [data])
  const countByKey = useMemo(() => {
    const map = new Map()
    for (const g of allGroups) map.set(g.key, g.items.length)
    return map
  }, [allGroups])

  const tabs = useMemo(
    () => [
      { key: 'semua', label: 'Semua', count: data?.length ?? 0 },
      { key: 'inti', label: 'Pengurus Inti', count: countByKey.get('inti') ?? 0 },
      ...DAFTAR_DIVISI.map((d) => ({
        key: `divisi-${d.id}`,
        label: `Divisi ${d.nama}`,
        count: countByKey.get(`divisi-${d.id}`) ?? 0,
      })),
      ...(countByKey.get('lainnya') ? [{ key: 'lainnya', label: 'Lainnya', count: countByKey.get('lainnya') }] : []),
    ],
    [data, countByKey],
  )

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filteredList = (data ?? []).filter((a) => {
      const info = parseJabatan(a.jabatan)
      const matchTab = activeTab === 'semua' || info.groupKey === activeTab
      const matchQuery =
        !q ||
        a.nama?.toLowerCase().includes(q) ||
        a.jabatan?.toLowerCase().includes(q) ||
        info.divisi?.toLowerCase().includes(q) ||
        info.peranDivisi?.toLowerCase().includes(q) ||
        (info.isInti && 'pengurus inti'.includes(q))
      return matchTab && matchQuery
    })

    const grouped = groupAnggota(filteredList)
    if (activeTab !== 'semua') {
      return grouped.filter((g) => g.key === activeTab && g.items.length > 0)
    }
    return grouped.filter((g) => g.items.length > 0)
  }, [data, query, activeTab])

  const totalShown = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.items.length, 0),
    [filteredGroups],
  )

  const resetFilter = () => {
    setQuery('')
    setActiveTab('semua')
  }

  return (
    <>
      <PageHeader
        title="Struktur & Anggota"
        description="Jajaran pengurus inti, koordinator, serta anggota divisi Karang Taruna 14 Antapani Kidul."
        crumbs={[{ label: 'Anggota' }]}
      />

      <section className="container-page py-12 sm:py-16">
        <div className="sticky top-16 z-30 -mx-4 mb-10 bg-stone-50/95 px-4 py-3 backdrop-blur-md sm:top-20 sm:mx-0 sm:rounded-2xl sm:px-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama, jabatan, atau divisi…"
                className="input !rounded-full !py-2.5 !pl-11 !pr-10 shadow-sm"
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
                  Menampilkan <strong className="text-stone-800">{totalShown}</strong>
                  {query || activeTab !== 'semua' ? ` dari ${data.length}` : ''} anggota
                </span>
              </p>
            )}
          </div>

          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition duration-200 active:scale-95 sm:text-sm ${
                    active
                      ? 'bg-primary-700 text-white shadow-md shadow-primary-900/20'
                      : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:text-primary-700 hover:ring-primary-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  {!loading && tab.count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                        active ? 'bg-accent-400 text-primary-950' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {loading ? (
          <AnggotaGridSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : !data?.length ? (
          <EmptyState
            icon={Users}
            title="Belum ada anggota"
            description="Daftar pengurus inti dan anggota divisi akan tampil di sini."
          />
        ) : !filteredGroups.length ? (
          <EmptyState
            icon={SearchX}
            title={query ? 'Anggota tidak ditemukan' : 'Belum ada anggota di bagian ini'}
            description={
              query
                ? `Tidak ada nama, jabatan, atau divisi yang cocok dengan “${query}”.`
                : 'Belum ada personel yang terdaftar pada divisi atau kategori ini.'
            }
            action={
              <button onClick={resetFilter} className="btn-outline">
                Tampilkan semua anggota
              </button>
            }
          />
        ) : (
          <div className="space-y-14">
            {filteredGroups.map((group) => {
              const Icon = GROUP_ICONS[group.key] ?? Users
              const koordinatorCount = group.items.filter((i) => i._struktur?.isKoordinator).length

              return (
                <section key={group.key} aria-labelledby={`heading-${group.key}`}>
                  <Reveal className="mb-6 flex flex-col gap-3 border-b border-primary-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-sm ${
                          group.key === 'inti'
                            ? 'bg-gradient-to-br from-accent-300 to-accent-500 text-primary-950'
                            : 'bg-gradient-to-br from-primary-700 to-primary-900 text-accent-300'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2
                          id={`heading-${group.key}`}
                          className="font-display text-2xl font-bold text-primary-900 sm:text-3xl"
                        >
                          {group.title}
                        </h2>
                        <p className="mt-0.5 text-sm text-stone-500">{group.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {group.isDivisi && koordinatorCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-800">
                          <Crown className="h-3.5 w-3.5" /> {koordinatorCount} Koordinator
                        </span>
                      )}
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                        {group.items.length} Orang
                      </span>
                    </div>
                  </Reveal>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {group.items.map((a, i) => (
                      <Reveal key={a.id} delay={(i % 4) * 70} className="h-full">
                        <AnggotaCard item={a} compactDivision={group.isDivisi} onClick={() => setSelected(a)} />
                      </Reveal>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </section>

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
