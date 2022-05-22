const colors = require('tailwindcss/colors');

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./app/**/*.tsx'],
  theme: {
    screens: {
      xxs: '280px',
      xs: '380px',
      sm: '640px',
      md: '768px',
    },
    spacing: {
      0: '0px',
      0.5: '0.25rem',
      1: '0.5rem',
      2: '0.75rem',
      3: '1rem',
      4: '1.5rem',
      5: '2rem',
      8: '4rem',
    },
    minWidth: {},
    maxWidth: {
      none: 'none',
      DEFAULT: '22rem',
      modal: '30rem',
      page: '1100px',
    },
    maxHeight: {
      small: '5.5rem',
      DEFAULT: '8rem',
      big: '18rem',
    },
    minHeight: {
      small: '5.5rem',
      DEFAULT: '8rem',
      big: '18rem',
      page: '32rem',
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
      // domain
      'replies-background': '#F7F7FA',
      'modal-overlay': '#000000',
    },
    fontFamily: {
      body: ['Montserrat', 'sans-serif'],
    },
    fontSize: {
      'base-mobile-xs': '13px',
      'base-mobile': '14px',
      base: '16px',
      sm: '0.8125rem',
      lg: '1.125rem',
      xl: '1.5rem',
      xxl: '2rem',
    },
    boxShadow: {
      DEFAULT: 'rgba(100, 100, 100, 0.2) 0px 2px 8px 0px',
    },
    animation: {
      highlight: 'highlight 2s ease-out 1s both',
      loading: 'loading 1s linear infinite',
    },
    keyframes: (theme) => ({
      highlight: {
        '0%': { background: theme('colors.primary') + '33' },
        '100%': {},
      },
      loading: {
        '0%': { width: 0, left: 0 },
        '50%': { width: '100%' },
        '100%': { width: 0, right: 0 },
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
              wordBreak: 'break-all',
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
