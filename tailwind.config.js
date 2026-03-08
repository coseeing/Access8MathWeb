/** @type {import('tailwindcss').Config} */

const v2ColorTokens = {
  blue: {
    50: '#EEF7FF',
    100: '#D8EDFF',
    200: '#BADFFF',
    300: '#8ACCFF',
    400: '#53B0FF',
    500: '#2B8DFF',
    600: '#146EFC',
    700: '#0D56E8',
    800: '#1246BB',
    900: '#08184D',
    950: '#122759',
  },
  gray: {
    50: '#F6F6F6',
    100: '#E7E7E7',
    200: '#D1D1D1',
    300: '#B0B0B0',
    400: '#888888',
    500: '#6D6D6D',
    600: '#595959',
    700: '#4F4F4F',
    800: '#454545',
    900: '#3D3D3D',
    950: '#262626',
  },
  red: {
    600: '#FC0606',
  },
};

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

        // v2 color tokens
        ...v2ColorTokens,
        primary: v2ColorTokens.blue[700],
        error: v2ColorTokens.red[600],
        bg: {
          main: v2ColorTokens.blue[50],
          disabled: v2ColorTokens.gray[100],
        },
        border: {
          main: v2ColorTokens.gray[400],
        },
        text: {
          heading: v2ColorTokens.gray[900],
          primary: v2ColorTokens.gray[800],
          secondary: v2ColorTokens.gray[500],
          placeholder: v2ColorTokens.gray[400],
          disabled: v2ColorTokens.gray[400],
        },
      },
      boxShadow: {
        shadow1: '0px 0px 4px 0px rgba(0, 0, 0, 0.1)',
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
