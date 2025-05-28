/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#009142'
      },
      fontFamily: {
        "noto-thai": ['Noto Sans Thai', 'sans-serif'],
      },
    },
  },
  plugins: [],
}