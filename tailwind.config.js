/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      screens: {
      xxs: '330px',
      xs: '490px',
      ...defaultTheme.screens
    }},
  },
  plugins: [],
}

