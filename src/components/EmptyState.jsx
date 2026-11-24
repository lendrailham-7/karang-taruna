import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Belum ada data',
  description = 'Data akan tampil di sini setelah ditambahkan.',
  action = null,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-100 bg-white/60 px-6 py-14 text-center ${className}`}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 animate-ping rounded-full bg-accent-200/50 [animation-duration:2.5s]" />
        <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary-50 to-accent-100 text-primary-700 ring-8 ring-primary-50/60">
          <Icon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-stone-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
