/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'custom': 'rgba(0,0,0,.30) 0 2px 3px',
      },
      maxHeight: {
        'minus-134': 'calc(100% - 134px)',
      }
    },
  },
  plugins: [],
}