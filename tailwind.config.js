/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yellow': "#FFB42C",
        'darkblue': "#001D7D",
        'red': "#F20000",
        'green': "#5FD35F",
        'orange': "#FF6D18",
        'blue': "#0835CA",
      }
    },
  },
  plugins: [],
}