import Avatar from './Avatar'

const INTI = ['ketua', 'wakil ketua', 'sekretaris', 'bendahara', 'pembina', 'penasehat', 'penasihat']

export default function AnggotaCard({ item, onClick }) {
  const isInti = INTI.includes((item.jabatan || '').toLowerCase().trim())

  return (
    <button
      type="button"
      onClick={onClick}
      className="group card relative flex w-full flex-col items-center overflow-hidden px-4 pb-6 pt-8 text-center transition duration-300 hover:-translate-y-1.5 hover:shadow-soft hover:ring-accent-300"
    >
      {/* Latar dekoratif */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-primary-700 to-primary-900 transition-all duration-500 group-hover:h-full" />
      <div className="bg-batik absolute inset-x-0 top-0 h-20 opacity-60 transition-all duration-500 group-hover:h-full" />

      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-200 via-accent-400 to-accent-600 opacity-90 transition duration-500 group-hover:rotate-180 group-hover:scale-105" />
        <Avatar src={item.foto_url} name={item.nama} size="lg" className="relative ring-4 ring-white" />
      </div>

      <h3 className="relative mt-4 line-clamp-2 text-base font-bold text-stone-900 transition-colors duration-300 group-hover:text-white sm:text-lg">
        {item.nama}
      </h3>
      <span
        className={`relative mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
          isInti
            ? 'bg-accent-100 text-accent-800 group-hover:bg-accent-400 group-hover:text-primary-950'
            : 'bg-primary-50 text-primary-700 group-hover:bg-white/15 group-hover:text-accent-200'
        }`}
      >
        {item.jabatan || 'Anggota'}
      </span>
    </button>
  )
}
