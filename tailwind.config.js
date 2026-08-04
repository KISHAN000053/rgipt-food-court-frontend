/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        secondary: '#111111',
        accent: '#FFD54F',
      },
      fontFamily: { 
        sans: ['Inter', 'sans-serif'] 
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
      }
    }
  },
  plugins: []
}
