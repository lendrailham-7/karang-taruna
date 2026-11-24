import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, description, align = 'center', light = false }) {
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start'
  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignCls}`}>
      {eyebrow && (
        <span
          className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
            light ? 'bg-white/10 text-accent-300' : 'bg-accent-100 text-accent-800'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-accent-300' : 'bg-accent-500'}`} />
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl font-bold leading-tight sm:text-4xl ${
          light ? 'text-white' : 'text-primary-900'
        }`}
      >
        {title}
      </h2>
      <span className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-accent-400 to-accent-600" />
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? 'text-primary-100' : 'text-stone-600'}`}>
          {description}
        </p>
      )}
    </Reveal>
  )
}
