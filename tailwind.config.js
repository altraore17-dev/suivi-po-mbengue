/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1B5E20', light: '#2E7D32', dark: '#0a3d0a' },
        accent:  { DEFAULT: '#F57F17', light: '#FFA000' },
        alert:   { red: '#B71C1C', orange: '#E65100', yellow: '#F9A825' },
      },
    },
  },
  plugins: [],
}
