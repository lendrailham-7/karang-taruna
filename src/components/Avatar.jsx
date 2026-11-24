import { useState } from 'react'
import { getInitials } from '../lib/format'

const SIZES = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-base',
  lg: 'h-24 w-24 text-2xl',
  xl: 'h-28 w-28 text-3xl',
}

export default function Avatar({ src, name, size = 'lg', className = '' }) {
  const [failed, setFailed] = useState(false)
  const sizeCls = SIZES[size] ?? SIZES.lg

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${sizeCls} rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      aria-label={name}
      className={`${sizeCls} grid place-items-center rounded-full bg-gradient-to-br from-primary-600 to-primary-900 font-bold text-accent-300 ${className}`}
    >
      {getInitials(name)}
    </div>
  )
}
