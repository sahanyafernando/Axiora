/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'axiora-blue': '#1e3a8a',
        'axiora-dark': '#0f172a',
      },
    },
  },
  plugins: [],
}
