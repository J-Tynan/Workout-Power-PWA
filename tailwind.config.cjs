/** @type {import('tailwindcss').Config} */
const themes = require('daisyui/src/theming/themes');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: themes.light,
        dark: {
          ...themes.dark,
          // Off-white for OLED friendliness (avoid pure white)
          'base-content': '#E2E8F0'
        }
      }
    ]
  }
};
