const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#ffffff',
      primary: colors.violet[900],
      success: colors.green[500],
    },
    extend: {
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
