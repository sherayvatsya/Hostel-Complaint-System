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
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(15, 23, 42, 0.3)',
          border: 'rgba(255, 255, 255, 0.15)',
          'border-dark': 'rgba(255, 255, 255, 0.05)',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // Indigo
          600: '#4f46e5',
          700: '#4338ca',
        },
        cyber: {
          violet: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#06b6d4',
          green: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      backgroundImage: {
        'radial-gradient-dark': 'radial-gradient(circle at top, #1e1b4b, #0f172a, #020617)',
        'radial-gradient-light': 'radial-gradient(circle at top, #eef2ff, #f8fafc, #f1f5f9)',
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-card-hover': '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
        'neon-indigo': '0 0 15px rgba(99, 102, 241, 0.5)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.5)',
        'neon-green': '0 0 15px rgba(16, 185, 129, 0.5)',
        'neon-rose': '0 0 15px rgba(244, 63, 94, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
