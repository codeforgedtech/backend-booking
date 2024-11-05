/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Define primary brand color
        secondary: '#22C55E', // Define secondary brand color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set default fonts
      },
    },
  },
  plugins: [],
};

