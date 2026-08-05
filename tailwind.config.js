/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, appetizing marigold — campus-food vernacular, not the default SaaS orange
        primary: '#F0532B',
        'primary-deep': '#C63C18',
        secondary: '#1A1614',   // near-black warm charcoal for text
        accent: '#12B886',      // mint — used for "open"/"available"/success
        canvas: '#FBF7F0',      // warm off-white app background (student)
        ink: '#2A2320',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,22,20,0.06), 0 1px 2px rgba(26,22,20,0.04)',
        'card-hover': '0 10px 30px -8px rgba(26,22,20,0.18)',
      },
      borderRadius: {
        xl: '0.9rem',
      }
    }
  },
  plugins: []
}
