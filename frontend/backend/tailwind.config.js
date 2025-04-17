/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        goodierun: {
          primary: '#743895',    // Primary Purple
          secondary: '#9A79A9',  // Secondary Purple
          gray: '#7E7383',       // Main Grey
          'gray-accent': '#636466', // Accent Grey
        }
      },
      animation: {
        'slide-right': 'slideRight 0.3s ease-in-out',
        'slide-left': 'slideLeft 0.3s ease-in-out',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
