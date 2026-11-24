import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/** Header halaman dalam (selain beranda). */
export default function PageHeader({ title, description, crumbs = [] }) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 pb-14 pt-28 sm:pb-16 sm:pt-36">
      <div className="bg-batik absolute inset-0 -z-10 opacity-60" />
      <div className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="container-page">
        <nav aria-label="Breadcrumb" className="flex animate-fade-up flex-wrap items-center gap-1 text-xs font-medium text-primary-200">
          <Link to="/" className="transition hover:text-accent-300">
            Beranda
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.to ? (
                <Link to={c.to} className="transition hover:text-accent-300">
                  {c.label}
                </Link>
              ) : (
                <span className="text-accent-300">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="mt-4 animate-fade-up font-display text-3xl font-bold text-white [animation-delay:100ms] sm:text-5xl">
          {title}
        </h1>
        <span className="mt-4 block h-1 w-16 animate-fade-up rounded-full bg-gradient-to-r from-accent-400 to-accent-600 [animation-delay:150ms]" />
        {description && (
          <p className="mt-4 max-w-2xl animate-fade-up text-base text-primary-100 [animation-delay:200ms]">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
