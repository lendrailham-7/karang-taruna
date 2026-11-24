const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

/** Parse 'YYYY-MM-DD' sebagai tanggal lokal (hindari geser zona waktu). */
export function parseDate(value) {
  if (!value) return null
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatTanggal(value, opts = {}) {
  const date = parseDate(value)
  if (!date) return '-'
  return date.toLocaleDateString('id-ID', {
    weekday: opts.withDay ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function tanggalParts(value) {
  const date = parseDate(value)
  if (!date) return { day: '--', month: '---', year: '' }
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: BULAN_PENDEK[date.getMonth()],
    year: date.getFullYear(),
  }
}

/** Apakah tanggal kegiatan masih akan datang (hari ini termasuk). */
export function isUpcoming(value) {
  const date = parseDate(value)
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}

export function getInitials(name = '') {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?'
  )
}

export function truncate(text = '', max = 120) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text
}

export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
