export const JABATAN_INTI = [
  { id: 'pembina', label: 'Pembina' },
  { id: 'ketua', label: 'Ketua' },
  { id: 'wakil-ketua', label: 'Wakil Ketua' },
  { id: 'ketua-pelaksana', label: 'Ketua Pelaksana' },
  { id: 'wakil-ketua-pelaksana', label: 'Wakil Ketua Pelaksana' },
  { id: 'sekretaris', label: 'Sekretaris' },
  { id: 'bendahara', label: 'Bendahara' },
]

export const DAFTAR_DIVISI = [
  { id: 'acara', nama: 'Acara', deskripsi: 'Perencanaan dan pelaksanaan rangkaian kegiatan' },
  { id: 'logistik', nama: 'Logistik', deskripsi: 'Perlengkapan, sarana prasarana, dan teknis lapangan' },
  { id: 'humas', nama: 'Humas', deskripsi: 'Hubungan masyarakat, komunikasi warga, dan kemitraan' },
  { id: 'konsumsi', nama: 'Konsumsi', deskripsi: 'Pengelolaan dan penyediaan konsumsi kegiatan' },
  { id: 'pdd', nama: 'PDD', deskripsi: 'Publikasi, dekorasi, dan dokumentasi kegiatan' },
]

export const PERAN_DIVISI = ['Koordinator', 'Anggota']

export function formatJabatanDivisi(divisi, peran = 'Anggota') {
  return `${peran} Divisi ${divisi}`
}

export function parseJabatan(raw = '') {
  const original = (raw || '').trim()
  const lower = original.toLowerCase()

  for (let i = 0; i < DAFTAR_DIVISI.length; i++) {
    const div = DAFTAR_DIVISI[i]
    const pattern = new RegExp(`\\b${div.nama.toLowerCase()}\\b`, 'i')
    if (pattern.test(lower)) {
      const isKoordinator = /\b(koordinator|koor|kor|ketua|kepala|kadiv|penanggung\s*jawab|pj)\b/i.test(lower)
      const peranDivisi = isKoordinator ? 'Koordinator' : 'Anggota'
      return {
        kategori: 'divisi',
        groupKey: `divisi-${div.id}`,
        jabatanInti: null,
        divisi: div.nama,
        divisiId: div.id,
        peranDivisi,
        isKoordinator,
        isInti: false,
        label: original || formatJabatanDivisi(div.nama, peranDivisi),
        rank: 100 + i * 10 + (isKoordinator ? 0 : 1),
      }
    }
  }

  const intiMatchers = [
    { idx: 0, label: 'Pembina', test: (s) => s.includes('pembina') || s.includes('penasehat') || s.includes('penasihat') },
    { idx: 4, label: 'Wakil Ketua Pelaksana', test: (s) => s.includes('wakil ketua pelaksana') || s.includes('wakil pelaksana') },
    { idx: 3, label: 'Ketua Pelaksana', test: (s) => s.includes('ketua pelaksana') },
    { idx: 2, label: 'Wakil Ketua', test: (s) => s.includes('wakil ketua') },
    { idx: 1, label: 'Ketua', test: (s) => /\bketua\b/.test(s) },
    { idx: 5, label: 'Sekretaris', test: (s) => s.includes('sekretaris') },
    { idx: 6, label: 'Bendahara', test: (s) => s.includes('bendahara') },
  ]

  for (const m of intiMatchers) {
    if (m.test(lower)) {
      const subRank = (m.idx === 5 || m.idx === 6) && lower.includes('wakil') ? 0.5 : 0
      return {
        kategori: 'inti',
        groupKey: 'inti',
        jabatanInti: m.label,
        divisi: null,
        divisiId: null,
        peranDivisi: null,
        isKoordinator: false,
        isInti: true,
        label: original || m.label,
        rank: m.idx + subRank,
      }
    }
  }

  return {
    kategori: 'lainnya',
    groupKey: 'lainnya',
    jabatanInti: null,
    divisi: null,
    divisiId: null,
    peranDivisi: null,
    isKoordinator: false,
    isInti: false,
    label: original || 'Anggota',
    rank: 999,
  }
}

export function sortAnggota(list = []) {
  return [...list].sort((a, b) => {
    const pa = parseJabatan(a.jabatan)
    const pb = parseJabatan(b.jabatan)
    if (pa.rank !== pb.rank) return pa.rank - pb.rank
    return new Date(a.created_at || 0) - new Date(b.created_at || 0)
  })
}

export function groupAnggota(list = []) {
  const sorted = sortAnggota(list)
  const buckets = new Map()

  for (const item of sorted) {
    const info = parseJabatan(item.jabatan)
    if (!buckets.has(info.groupKey)) buckets.set(info.groupKey, [])
    buckets.get(info.groupKey).push({ ...item, _struktur: info })
  }

  const groups = [
    {
      key: 'inti',
      title: 'Pengurus Inti',
      shortLabel: 'Pengurus Inti',
      subtitle: 'Jajaran pembina, pimpinan, dan pengurus harian organisasi',
      isDivisi: false,
      items: buckets.get('inti') ?? [],
    },
    ...DAFTAR_DIVISI.map((div) => ({
      key: `divisi-${div.id}`,
      divisiId: div.id,
      divisiNama: div.nama,
      title: `Divisi ${div.nama}`,
      shortLabel: div.nama,
      subtitle: div.deskripsi,
      isDivisi: true,
      items: buckets.get(`divisi-${div.id}`) ?? [],
    })),
  ]

  const lainnya = buckets.get('lainnya') ?? []
  if (lainnya.length > 0) {
    groups.push({
      key: 'lainnya',
      title: 'Anggota Lainnya',
      shortLabel: 'Lainnya',
      subtitle: 'Anggota aktif Karang Taruna 14 Antapani Kidul',
      isDivisi: false,
      items: lainnya,
    })
  }

  return groups
}
