import { supabase, isSupabaseConfigured, BUCKET_FOTO } from './supabase'

function client() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.',
    )
  }
  return supabase
}

function unwrap({ data, error, count }) {
  if (error) throw new Error(error.message)
  return count !== undefined && count !== null ? { data, count } : data
}

/* ------------------------------------------------------------------ */
/*  KEGIATAN                                                           */
/* ------------------------------------------------------------------ */

export async function getKegiatan({ limit } = {}) {
  let query = client()
    .from('kegiatan')
    .select('*')
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })
  if (limit) query = query.limit(limit)
  return unwrap(await query)
}

export async function getKegiatanById(id) {
  return unwrap(await client().from('kegiatan').select('*').eq('id', id).maybeSingle())
}

export async function createKegiatan(payload) {
  return unwrap(await client().from('kegiatan').insert(payload).select().single())
}

export async function updateKegiatan(id, payload) {
  return unwrap(await client().from('kegiatan').update(payload).eq('id', id).select().single())
}

export async function deleteKegiatan(item) {
  unwrap(await client().from('kegiatan').delete().eq('id', item.id))
  await deleteFotoByUrl(item.foto_url)
}

/* ------------------------------------------------------------------ */
/*  ANGGOTA                                                            */
/* ------------------------------------------------------------------ */

// Urutan jabatan inti agar pengurus tampil paling atas
const URUTAN_JABATAN = [
  'pembina',
  'penasehat',
  'penasihat',
  'ketua',
  'wakil ketua',
  'sekretaris',
  'wakil sekretaris',
  'bendahara',
  'wakil bendahara',
  'koordinator',
  'seksi',
  'divisi',
]

function rankJabatan(jabatan = '') {
  const j = jabatan.toLowerCase().trim()
  const exact = URUTAN_JABATAN.indexOf(j)
  if (exact !== -1) return exact
  const partial = URUTAN_JABATAN.findIndex((k) => j.startsWith(k))
  return partial !== -1 ? partial + 0.5 : URUTAN_JABATAN.length + 1
}

export function sortAnggota(list = []) {
  return [...list].sort(
    (a, b) =>
      rankJabatan(a.jabatan) - rankJabatan(b.jabatan) ||
      new Date(a.created_at) - new Date(b.created_at),
  )
}

export async function getAnggota() {
  const data = unwrap(
    await client().from('anggota').select('*').order('created_at', { ascending: true }),
  )
  return sortAnggota(data)
}

export async function createAnggota(payload) {
  return unwrap(await client().from('anggota').insert(payload).select().single())
}

export async function updateAnggota(id, payload) {
  return unwrap(await client().from('anggota').update(payload).eq('id', id).select().single())
}

export async function deleteAnggota(item) {
  unwrap(await client().from('anggota').delete().eq('id', item.id))
  await deleteFotoByUrl(item.foto_url)
}

/* ------------------------------------------------------------------ */
/*  STATISTIK                                                          */
/* ------------------------------------------------------------------ */

export async function getStats() {
  const c = client()
  const [k, a] = await Promise.all([
    c.from('kegiatan').select('id', { count: 'exact', head: true }),
    c.from('anggota').select('id', { count: 'exact', head: true }),
  ])
  if (k.error) throw new Error(k.error.message)
  if (a.error) throw new Error(a.error.message)
  return { kegiatan: k.count ?? 0, anggota: a.count ?? 0 }
}

/* ------------------------------------------------------------------ */
/*  STORAGE FOTO                                                       */
/* ------------------------------------------------------------------ */

/**
 * Upload file (sudah dikompres) ke bucket "foto".
 * @param {Blob} file
 * @param {'kegiatan'|'anggota'} folder
 * @returns {Promise<string>} URL publik
 */
export async function uploadFoto(file, folder) {
  const c = client()
  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg'
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  const path = `${folder}/${Date.now()}-${random}.${ext}`

  const { error } = await c.storage.from(BUCKET_FOTO).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error(`Gagal upload foto: ${error.message}`)

  const { data } = c.storage.from(BUCKET_FOTO).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Simpan record yang punya foto dengan aman:
 * 1. Upload foto baru (jika ada)
 * 2. Simpan record lewat callback `save(foto_url)`
 * 3. Hapus foto lama bila diganti/dihapus
 * Jika penyimpanan gagal, foto yang baru diupload dibersihkan lagi.
 */
export async function simpanDenganFoto({ folder, oldUrl = null, newFile = null, removeFoto = false, save }) {
  let fotoUrl = oldUrl
  let uploadedUrl = null

  if (newFile) {
    uploadedUrl = await uploadFoto(newFile, folder)
    fotoUrl = uploadedUrl
  } else if (removeFoto) {
    fotoUrl = null
  }

  try {
    const result = await save(fotoUrl)
    if (oldUrl && oldUrl !== fotoUrl) await deleteFotoByUrl(oldUrl)
    return result
  } catch (err) {
    if (uploadedUrl) await deleteFotoByUrl(uploadedUrl)
    throw err
  }
}

/** Ambil path di dalam bucket dari URL publik Supabase Storage. */
export function getPathFromPublicUrl(url) {
  if (!url) return null
  const marker = `/storage/v1/object/public/${BUCKET_FOTO}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(url.slice(idx + marker.length).split('?')[0])
}

/** Hapus file foto berdasarkan URL publiknya (diam jika gagal/bukan dari bucket). */
export async function deleteFotoByUrl(url) {
  const path = getPathFromPublicUrl(url)
  if (!path) return
  const { error } = await client().storage.from(BUCKET_FOTO).remove([path])
  if (error) console.warn('Gagal menghapus file foto:', error.message)
}
