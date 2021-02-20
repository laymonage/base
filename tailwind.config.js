const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', ...fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      margin: ['first'],
    },
  },
};
