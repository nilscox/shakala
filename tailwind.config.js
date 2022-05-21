const colors = require('tailwindcss/colors');

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./app/**/*.tsx'],
  theme: {
    fontFamily: {
      body: ['Montserrat', 'sans-serif'],
    },
    fontSize: {
      sm: '13px',
      base: '16px',
      lg: '18px',
      xl: '24px',
    },
    spacing: {
      0: '0px',
      0.5: '4px',
      1: '8px',
      2: '12px',
      3: '16px',
      4: '24px',
      5: '32px',
    },
    minHeight: {
      DEFAULT: '280px',
    },
    colors: {
      transparent: 'transparent',
      white: colors.white,
      primary: colors.amber[600],
      dark: colors.slate[800],
      'light-gray': colors.neutral[200],
      text: colors.gray[900],
      'text-light': colors.gray[500],
      'text-white': colors.gray[100],
      'text-link': colors.blue[600],
      'text-error': colors.rose[500],
    },
    animation: {
      highlight: 'highlight 2s ease-out 1s both',
    },
    keyframes: (theme) => ({
      highlight: {
        '0%': { background: theme('colors.primary') + '33' },
        '100%': {},
      },
    }),
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: '1.5rem',
            },
            h2: {
              fontSize: '1.3rem',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            h3: {
              fontSize: '1.1rem',
              marginTop: '1.3em',
              marginBottom: '0.3em',
            },
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
              lineHeight: '1.4rem',
            },
            li: {
              marginTop: 0.25,
              marginBottom: 0.25,
            },
            strong: {
              color: colors.gray[600],
            },
            a: {
              color: colors.blue[600],
              textDecoration: 'none',
              fontWeight: 400,
            },
            blockquote: {
              marginTop: '1em',
              marginBottom: '1em',
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
