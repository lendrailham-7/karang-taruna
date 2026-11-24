export default function Logo({ className = 'h-10 w-10', alt = 'Logo Karang Taruna 14 Antapani Kidul' }) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      draggable="false"
      className={`select-none object-contain drop-shadow-md ${className}`}
    />
  )
}
