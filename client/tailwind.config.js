/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E', // Deep Teal
          dark: '#115E59',
          hover: '#115E59',
          light: '#F0FDFA',
        },
        teal: {
          DEFAULT: '#0F766E',
          dark: '#115E59',
          hover: '#115E59',
          light: '#F0FDFA',
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          DEFAULT: '#F97360', // Coral
          dark: '#EA6250',
          hover: '#EA6250',
          light: '#FFF1F0',
        },
        coral: {
          DEFAULT: '#F97360',
          dark: '#EA6250',
          hover: '#EA6250',
          light: '#FFF1F0',
        },
        background: '#FAFAF9',
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          secondary: '#F0FDFA',
          teal: '#F0FDFA',
          coral: '#FFF1F0',
        },
        stone: {
          950: '#0C0A09',
          900: '#1C1917',
          800: '#292524',
          700: '#44403C',
          600: '#57534E',
          500: '#78716C',
          400: '#A8A29E',
          300: '#D6D3D1',
          200: '#E7E5E4',
          100: '#F5F5F4',
          50:  '#FAFAF9',
        },
        border: {
          DEFAULT: '#E7E5E4',
          light: '#F5F5F4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(28, 25, 23, 0.05)',
        'card-hover': '0 8px 24px rgba(15, 118, 110, 0.08)',
        'primary': '0 4px 14px rgba(15, 118, 110, 0.25)',
        'coral': '0 4px 14px rgba(249, 115, 96, 0.25)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0F766E, #14B8A6)',
        'gradient-primary': 'linear-gradient(135deg, #0F766E, #14B8A6)',
      },
    },
  },
  plugins: [],
};
