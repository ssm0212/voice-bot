/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#F5F5FF',
          100: '#E6E5FA',
          200: '#C7C5F7',
          300: '#A5A1EB',
          400: '#7A76C2',
          500: '#4F4C8F',
          600: '#2D2B5C',
          700: '#1D1B40',
          800: '#12102A',
          900: '#070612',
        },
        gold: {
          300: '#FF9F93',
          400: '#FF7262', // Sunset Coral
          500: '#FF5744', // Vibrant Coral
          600: '#E03E2D',
        },
        sage: {
          400: '#00F5FF', // Electric Cyan
          500: '#0DFFC4', // Electric Teal
        }
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.7' },
        },
        'wave': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
