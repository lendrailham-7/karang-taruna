/** @type {import('tailwindcss').Config} */

/*
 * ============================================================
 *  WARNA TEMA
 *  Ganti palet di bawah ini untuk mengubah warna seluruh website.
 *  - primary : warna utama (merah marun)
 *  - accent  : warna aksen (gold)
 *  Semua komponen memakai `primary-*` dan `accent-*`, jadi cukup
 *  ubah di sini saja.
 * ============================================================
 */
const primary = {
  50: '#fdf3f4',
  100: '#fbe6e8',
  200: '#f5cbd0',
  300: '#eca2ab',
  400: '#de6f7d',
  500: '#c9445a',
  600: '#a92a42',
  700: '#8c1d34',
  800: '#741a2e',
  900: '#5e1527',
  950: '#3b0913',
}

const accent = {
  50: '#fefaec',
  100: '#fbf0c8',
  200: '#f6e08d',
  300: '#f1ca52',
  400: '#ecb52b',
  500: '#d4a017',
  600: '#b97c0f',
  700: '#935910',
  800: '#784614',
  900: '#663b16',
  950: '#3b1e07',
}

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { primary, accent },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(59, 9, 19, 0.25)',
        glow: '0 0 0 4px rgba(212, 160, 23, 0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        'slide-in-right': 'slide-in-right 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
