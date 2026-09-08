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
        background: '#0B1020',
        'secondary-bg': '#111827',
        card: '#151D2F',
        primary: {
          DEFAULT: '#7C3AED',
          hover: '#8B5CF6',
        },
        secondary: '#6366F1',
        ai: '#06B6D4',
        text: {
          main: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },
        border: '#263248',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 32px rgba(124,58,237,0.15)',
        'primary': '0 8px 24px rgba(124,58,237,0.3)',
        'ai': '0 8px 24px rgba(6,182,212,0.3)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #7C3AED, #6366F1)',
        'ai-gradient': 'linear-gradient(135deg, #06B6D4, #7C3AED)',
        'mesh-dark': 'radial-gradient(at 80% 20%, rgba(124,58,237,0.15) 0, transparent 50%), radial-gradient(at 20% 80%, rgba(6,182,212,0.1) 0, transparent 50%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
      },
    },
  },
  plugins: [],
};
