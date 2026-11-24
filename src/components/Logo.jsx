export default function Logo({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="currentColor" className="text-primary-600" />
          <stop offset="1" stopColor="currentColor" className="text-primary-950" />
        </linearGradient>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e08d" />
          <stop offset="1" stopColor="#d4a017" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-bg)" />
      <path
        d="M32 9l5.6 11.4 12.6 1.8-9.1 8.9 2.1 12.5L32 37.7l-11.2 5.9 2.1-12.5-9.1-8.9 12.6-1.8z"
        fill="url(#logo-gold)"
      />
      <text
        x="32"
        y="57"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="11"
        fill="#f6e08d"
      >
        14
      </text>
    </svg>
  )
}
