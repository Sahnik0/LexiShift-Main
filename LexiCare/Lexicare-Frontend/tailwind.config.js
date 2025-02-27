/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        'primary':'#5F6FFF'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.8, 0, 1, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      height: {
        'navbar': '64px', // Standard navbar height
      },
      zIndex: {
        'navbar': '1000', // Ensure navbar stays on top
      },
      boxShadow: {
        'navbar': '0 2px 4px rgba(0,0,0,0.1)', // Subtle navbar shadow
      },
    },
  },
  plugins: [],
}