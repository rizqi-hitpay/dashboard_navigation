/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'hp-bg': '#f8f9fc',
        'hp-sidebar': '#fcfcfd',
        'hp-primary': '#03102f',
        'hp-secondary': '#61667c',
        'hp-section': '#8093b8',
        'hp-section-alt': '#a6b3cd',
        'hp-blue': '#2364dd',
        'hp-brand': '#002771',
        'hp-muted': '#4c689c',
        'hp-purple': '#b14aed',
        'hp-red': '#dc3545',
        'hp-amber': '#f4b840',
      },
    },
  },
  plugins: [],
}
