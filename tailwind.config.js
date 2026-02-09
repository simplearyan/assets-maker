/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-card': 'var(--surface-card)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-glow': 'var(--accent-glow)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        brand: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        heroFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(40px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        heroFloat: 'heroFloat 8s ease-in-out infinite',
        slideUp: 'slideUp 0.8s cubic-bezier(0.25, 0.4, 0.25, 1) forwards',
      },
    },
  },
  plugins: [],
}
