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
        bg: '#09090b', // Zinc 950
        surface: 'rgba(24, 24, 27, 0.6)', // Zinc 900 Glass
        'surface-card': 'rgba(39, 39, 42, 0.4)', // Zinc 800 Glass
        border: 'rgba(255, 255, 255, 0.08)',
        'border-hover': 'rgba(255, 255, 255, 0.15)',
        accent: '#3b82f6', // Blue 500
        'accent-glow': 'rgba(59, 130, 246, 0.4)',
        
        // Light Theme overrides (handled via CSS variables usually, or custom classes)
        // Here we define the base tokens. For dynamic theming, we might use CSS vars
        // mapped to these names in index.css if we want full flexibility.
        // But for now, we'll stick to direct colors and use 'dark:' modifiers.
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
