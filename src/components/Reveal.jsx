import { useInView } from '../hooks/useInView'

/**
 * Animasi muncul saat elemen di-scroll ke viewport.
 * @param {{ as?: any, delay?: number, className?: string, children: any }} props
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, visible] = useInView()
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
