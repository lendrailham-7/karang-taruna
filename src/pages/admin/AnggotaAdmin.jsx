import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Crown, Pencil, Search, Trash2, UserPlus, Users, X } from 'lucide-react'
import {
  createAnggota,
  deleteAnggota,
  getAnggota,
  simpanDenganFoto,
  updateAnggota,
} from '../../lib/api'
import { DAFTAR_DIVISI, groupAnggota, parseJabatan } from '../../config/struktur'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useToast } from '../../context/ToastContext'
import Avatar from '../../components/Avatar'
import AnggotaForm from '../../components/admin/AnggotaForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { TableRowSkeleton } from '../../components/Skeleton'

export default function AnggotaAdmin() {
  useDocumentTitle('Kelola Anggota')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const { data, loading, error, reload } = useAsync(() => getAnggota(), [])
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('semua')
  const [formState, setFormState] = useState({ open: false, item: null })
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.get('baru') === '1') {
      setFormState({ open: true, item: null })
      setParams({}, { replace: true })
    }
  }, [params, setParams])

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
        label: d.nama,
        count: countByKey.get(`divisi-${d.id}`) ?? 0,
      })),
    ],
    [data, countByKey],
  )

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = (data ?? []).filter((a) => {
      const info = parseJabatan(a.jabatan)
      const matchTab = activeTab === 'semua' || info.groupKey === activeTab
      const matchQ =
        !q ||
        a.nama?.toLowerCase().includes(q) ||
        a.jabatan?.toLowerCase().includes(q) ||
        info.divisi?.toLowerCase().includes(q)
      return matchTab && matchQ
    })
    return groupAnggota(list).filter((g) => g.items.length > 0)
  }, [data, query, activeTab])

  const totalShown = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.items.length, 0),
    [filteredGroups],
  )

  const openNew = () => setFormState({ open: true, item: null })
  const openEdit = (item) => setFormState({ open: true, item })
  const closeForm = () => setFormState({ open: false, item: null })

  const handleSave = async (values, foto) => {
    const editing = formState.item
    await simpanDenganFoto({
      folder: 'anggota',
      oldUrl: editing?.foto_url ?? null,
      newFile: foto.file,
      removeFoto: foto.removed,
      save: (foto_url) =>
        editing
          ? updateAnggota(editing.id, { ...values, foto_url })
          : createAnggota({ ...values, foto_url }),
    })
    toast.success(editing ? 'Data anggota berhasil diperbarui.' : 'Anggota berhasil ditambahkan.')
    closeForm()
    reload()
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteAnggota(toDelete)
      toast.success('Anggota dan fotonya berhasil dihapus.')
      setToDelete(null)
      reload()
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus anggota.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-900 sm:text-3xl">Kelola Anggota</h1>
          <p className="mt-1 text-sm text-stone-500">Atur pengurus inti, koordinator, dan anggota tiap divisi.</p>
        </div>
        <button onClick={openNew} className="btn-primary shrink-0">
          <UserPlus className="h-4 w-4" /> Tambah Anggota
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, jabatan, atau divisi…"
              className="input !rounded-full !pl-11 !pr-10"
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
            <p className="text-sm text-stone-500">
              Menampilkan <strong className="text-stone-800">{totalShown}</strong> dari{' '}
              <strong className="text-stone-800">{data.length}</strong> anggota
            </p>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:text-primary-700'
                }`}
              >
                {tab.label}
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
        <div className="card overflow-hidden">
          <TableRowSkeleton rows={5} />
        </div>
      ) : error ? (
        <div className="card p-6">
          <ErrorState error={error} onRetry={reload} />
        </div>
      ) : !data?.length ? (
        <div className="card p-6">
          <EmptyState
            icon={Users}
            title="Belum ada anggota"
            description="Tambahkan pengurus inti atau anggota divisi pertama Anda."
            action={
              <button onClick={openNew} className="btn-primary">
                <UserPlus className="h-4 w-4" /> Tambah Anggota
              </button>
            }
          />
        </div>
      ) : !filteredGroups.length ? (
        <div className="card p-6">
          <EmptyState
            icon={Search}
            title="Tidak ditemukan"
            description={
              query
                ? `Tidak ada anggota yang cocok dengan “${query}”.`
                : 'Belum ada anggota pada kategori/divisi ini.'
            }
            action={
              <button
                onClick={() => {
                  setQuery('')
                  setActiveTab('semua')
                }}
                className="btn-outline"
              >
                Tampilkan semua
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-5">
          {filteredGroups.map((group) => (
            <div key={group.key} className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/80 px-4 py-3">
                <h2 className="text-sm font-bold text-primary-900">{group.title}</h2>
                <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-bold text-primary-800">
                  {group.items.length} orang
                </span>
              </div>
              <ul className="divide-y divide-stone-100">
                {group.items.map((item) => {
                  const info = item._struktur ?? parseJabatan(item.jabatan)
                  const highlighted = info.isInti || info.isKoordinator
                  return (
                    <li
                      key={item.id}
                      className="flex flex-col gap-4 p-4 transition hover:bg-stone-50/80 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <Avatar
                          src={item.foto_url}
                          name={item.nama}
                          size="md"
                          className="shrink-0 ring-2 ring-accent-300"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-bold text-stone-900">{item.nama}</h3>
                          <span
                            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              highlighted
                                ? 'bg-accent-100 text-accent-800'
                                : 'bg-primary-50 text-primary-700'
                            }`}
                          >
                            {info.isKoordinator && <Crown className="h-3 w-3" />}
                            {item.jabatan || 'Anggota'}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-end gap-1.5 border-t border-stone-100 pt-3 sm:border-t-0 sm:pt-0">
                        <button
                          onClick={() => openEdit(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-700 ring-1 ring-primary-200 transition hover:bg-primary-50"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Ubah
                        </button>
                        <button
                          onClick={() => setToDelete(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {formState.open && (
        <AnggotaForm
          key={formState.item?.id ?? 'new'}
          open
          item={formState.item}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Anggota?"
        message={
          <>
            Data anggota <strong>“{toDelete?.nama}”</strong>
            {toDelete?.foto_url ? ' beserta foto profilnya di penyimpanan' : ''} akan dihapus secara permanen dan tidak
            dapat dikembalikan.
          </>
        }
      />
    </div>
  )
}
