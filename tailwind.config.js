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
        'black-primary': "#525252",
        'black-secondary': "#404040",
        'gray-secondary': "#737373",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      animation: {
        float: 'float 1.8s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}