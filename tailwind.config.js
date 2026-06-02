/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50:  '#f8fafc',
        },
        primary: {
          light: '#2d45a9',
          DEFAULT: '#263a8d',
          dark: '#1e2e70',
        },
        accent: {
          light: '#ff334c',
          DEFAULT: '#e42b40',
          dark: '#b62233',
        },
        emerald: {
          DEFAULT: '#059669',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#059669',
          500: '#047857',
          600: '#065F46',
          700: '#064E3B',
          800: '#022C22',
          900: '#022C22',
        },
        amber: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#D97706',
          500: '#B45309',
          600: '#92400E',
          700: '#78350F',
          800: '#451A03',
          900: '#451A03',
        },
        rose: {
          DEFAULT: '#E11D48',
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#E11D48',
          500: '#BE123C',
          600: '#9F1239',
          700: '#881337',
          800: '#4C0519',
          900: '#4C0519',
        },
        wa:      { DEFAULT: '#25D366' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      spacing: {
        'safe-top':    'env(safe-area-inset-top, 0px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 0px)',
        'safe-left':   'env(safe-area-inset-left, 0px)',
        'safe-right':  'env(safe-area-inset-right, 0px)',
      },
      height: {
        'dvh': '100dvh',
        'svh': '100svh',
      },
      minHeight: {
        'dvh': '100dvh',
        'touch': '44px',   // minimum touch target
      },
      minWidth: {
        'touch': '44px',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'slide-up':       'slideUp 0.3s ease-out',
        'fade-in':        'fadeIn 0.25s ease-out',
        'scale-in':       'scaleIn 0.2s ease-out',
        'pulse-slow':     'pulse 3s infinite',
        'bounce-subtle':  'bounceSub 0.4s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%':   { transform: 'translateX(110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        bounceSub: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
