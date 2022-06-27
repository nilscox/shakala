/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const colors = require('tailwindcss/colors');

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
    },
    // prettier-ignore
    spacing: {
      0:    '0px',        //  0px
      0.5:  '0.25rem',    //  4px
      1:    '0.5rem',     //  8px
      2:    '0.75rem',    // 12px
      4:    '1rem',       // 16px
      5:    '1.5rem',     // 24px
      6:    '2rem',       // 32px
    },
    // prettier-ignore
    minWidth: {
      snackbar: '22rem',  // 352px
    },
    // prettier-ignore
    maxWidth: {
      none: 'none',
      snackbar: '40rem',  //  640px
      modal: '32rem',     //  512px
      page: '68rem',      // 1088px
    },
    // prettier-ignore
    minHeight: {
      main: '32rem',      // 512px
      fallback: '16rem',  // 256px
      'markdown-preview': '8rem',  // 128px
    },
    // prettier-ignore
    borderRadius: {
      DEFAULT: '0.25rem', //  4px
      lg: '0.75rem',      // 12px
      full: '100%',
    },
    colors: {
      transparent: 'transparent',
      inherit: 'inherit',
      primary: colors.amber[600],
      neutral: colors.white,
      inverted: colors.slate[800],
      muted: colors.gray[500],
      success: colors.emerald[600],
      warning: colors.amber[500],
      error: colors.rose[600],
    },
    borderColor: {
      transparent: 'transparent',
      DEFAULT: colors.neutral[200],
    },
    textColor: (theme) => ({
      DEFAULT: colors.gray[900],
      primary: theme('colors.primary'),
      muted: theme('colors.muted'),
      inverted: colors.gray[100],
      link: colors.blue[600],
      error: colors.rose[500],
      white: colors.white,
    }),
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      'open-sans': ['Open Sans', 'sans-serif'],
    },
    // prettier-ignore
    fontSize: {
      'base-mobile': '14px',
      base: '16px',
      sm: '0.8125rem',  // 13px / 11px
      lg: '1.125rem',   // 18px / 16px
      xl: '1.5rem',     // 21px / 24px
      xxl: '2rem',      // 32px / 28px
    },
    boxShadow: {
      DEFAULT: 'rgba(100, 100, 100, 0.2) 0px 2px 8px 0px',
    },
    animation: {
      highlight: 'highlight 2s ease-out 1s both',
      loading: 'loading 1s linear infinite',
      'loading-surface': 'loading-surface 2s ease infinite',
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
      'loading-surface': {
        '0%': { opacity: '0%' },
        '50%': { opacity: '100%' },
        '100%': { opacity: '0%' },
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
