/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
        status: {
          info: {
            bg: '#EBEEF2',
            text: '#394452',
            icon: '#394452',
          },
          success: {
            bg: '#EDF9F0',
            text: '#287D3C',
            icon: '#287D3C',
          },
          warning: {
            bg: '#FFF4EC',
            text: '#B95000',
            icon: '#B95000',
          },
          error: {
            bg: '#FEEFEF',
            text: '#DA1414',
            icon: '#DA1414',
          },
        },
      },
    },
  },
  safelist: [
    {
      pattern: /mask-(size|repeat)-.*/,
    },
  ],
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.mask-cover': {
          'mask-size': 'cover',
          '-webkit-mask-size': 'cover',
        },
        '.mask-no-repeat': {
          'mask-repeat': 'no-repeat',
          '-webkit-mask-repeat': 'no-repeat',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
