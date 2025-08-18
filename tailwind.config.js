/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@coseeing/access8math-web-lib/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg1: '#E8F0FF',
        bg2: '#EAEDF1',
        bg3: '#31374690',
        bd1: '#3F5E8B',
        bd2: '#1B66EF',
        cyan: '#01A9DB',
        cyanDark: '#0B76B7',
        cyanLight: '#D0F0FD',
      },
    },
  },
  safelist: [
    {
      pattern: /mask-(size|repeat)-.*/,
    },
  ],
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.mask-cover': {
          'mask-size': 'cover',
          '-webkit-mask-size': 'cover',
        },
        '.mask-no-repeat': {
          'mask-repeat': 'no-repeat',
          '-webkit-mask-repeat': 'no-repeat',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
