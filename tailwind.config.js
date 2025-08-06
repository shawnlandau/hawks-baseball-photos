/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        hawks: {
          navy: '#1e3a8a',
          red: '#dc2626',
          white: '#ffffff',
          gold: '#fbbf24',
          'navy-dark': '#1e40af',
          'red-dark': '#b91c1c',
          'gold-dark': '#f59e0b',
        },
        cooperstown: {
          blue: '#1e40af',
          red: '#dc2626',
          white: '#ffffff',
          gold: '#fbbf24',
          'navy': '#1e3a8a',
        }
      },
      backgroundImage: {
        'hawks-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #dc2626 100%)',
        'cooperstown-gradient': 'linear-gradient(135deg, #1e40af 0%, #dc2626 50%, #fbbf24 100%)',
        'baseball-diamond': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M30 0L60 30L30 60L0 30Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
} 