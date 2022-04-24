const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#ffffff',
      primary: colors.violet[900],
      success: colors.green[500],
      gray: colors.gray[500],
      black: colors.black,
      info: colors.sky,
    },
    extend: {
      spacing: {
        128: '40rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
