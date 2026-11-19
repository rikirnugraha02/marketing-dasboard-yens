/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yens: {
          navy: '#1B365D',
          'navy-dark': '#122540',
          'navy-light': '#24477A',
          coral: '#F26522',
          'coral-hover': '#D95314',
          'coral-light': '#FFF0EB',
        }
      }
    },
  },
  plugins: [],
}
