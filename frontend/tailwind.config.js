/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          dark: '#141414',
          gray: '#808080',
          'light-gray': '#B3B3B3'
        },
        kdrama: {
          gold: '#F5C842',
          rose: '#E8376B',
          teal: '#00C4CC',
          purple: '#9B59B6'
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.7) 50%, transparent 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)'
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s infinite'
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } }
      }
    }
  },
  plugins: []
}
