import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      maxHeight: {
        'fill-below-header': 'calc(100% - 64px)'
      }
    }
  },
  plugins: [
    nextui({
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: {
              50: '#89B78A',
              100: '#7EA97F',
              200: '#739B74',
              300: '#689E69',
              400: '#5D905E',
              500: '#0A5C36', // DEFAULT
              600: '#05482B',
              700: '#043D21',
              800: '#023016',
              900: '#01150B',
              foreground: '#FFF',
              DEFAULT: '#0A5C36'
            },
            secondary: {
              50: '#FFF7D2',
              100: '#FFEDA6',
              200: '#FFE27A',
              300: '#FFD74D',
              400: '#FFCC21',
              500: '#FFBA00', // DEFAULT
              600: '#E6A700',
              700: '#CC9300',
              800: '#B38100',
              900: '#996F00',
              foreground: '#000',
              DEFAULT: '#FFBA00'
            }
          }
        }
      }
    })
  ]
};
