/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto Flex', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%'
      }
    },
    colors: {
      primary: '#1AC0C0',
      primaryHover: '#1ad4d4',
      background: '#101D28',
      danger: '#F76868',
      dangerHover: '#f67a7a',
      surface: '#28343D',
      surfaceHover: '#40515E',
      disabledSurface: '#6D6D6D',
      primaryText: '#FFFFFF',
      oppositeText: '#000000',
      secondaryText: '#BBBAC1',
      disabledText: '#C7C7C7',
      gradient: '#023869'
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
