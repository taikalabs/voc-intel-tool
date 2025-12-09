/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mistral: {
          orange: '#ff7000',
          'orange-dark': '#e06000',
        }
      }
    },
  },
  plugins: [],
}
