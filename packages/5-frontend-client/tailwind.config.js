/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const colors = require('tailwindcss/colors');

// prettier-ignore
const widths = {
  none: 'none',
  1: '22rem', //  352px
  2: '26rem', //  512px
  3: '32rem', //  512px
  4: '40rem', //  640px
  5: '52rem', //  640px
  6: '68rem', // 1088px
};

// prettier-ignore
const heights = {
  none: 'none',
  full: '100%',
  1: '8rem',  // 128px
  2: '16rem', // 256px
  3: '32rem', // 512px
};

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
    },
    // prettier-ignore
    spacing: {
      0:    '0px',      //  0px
      px:   '1px',      //  1px
      0.5:  '0.25rem',  //  4px
      1:    '0.5rem',   //  8px
      2:    '0.75rem',  // 12px
      4:    '1rem',     // 16px
      5:    '1.5rem',   // 24px
      6:    '2rem',     // 32px
      8:    '3rem',     // 48px
      10:   '4rem',     // 64px
      12:   '6rem',     // 96px
      16:   '8rem',     // 128px
    },
    minWidth: widths,
    maxWidth: widths,
    minHeight: heights,
    maxHeight: heights,
    borderRadius: {
      DEFAULT: '0.25rem',
      lg: '0.75rem',
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
      info: colors.sky[600],
      warning: colors.amber[500],
      error: colors.rose[600],
    },
    borderColor: (theme) => ({
      transparent: 'transparent',
      DEFAULT: colors.neutral[200],
      success: theme('colors.success'),
      info: theme('colors.info'),
      error: theme('colors.error'),
      warning: theme('colors.warning'),
    }),
    textColor: (theme) => ({
      DEFAULT: colors.gray[900],
      inherit: 'inherit',
      primary: theme('colors.primary'),
      muted: theme('colors.muted'),
      inverted: colors.gray[100],
      link: colors.blue[600],
      success: colors.emerald[800],
      info: colors.sky[800],
      warning: colors.amber[700],
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
      base: '16px',     // base / mobile
      sm: '0.8125rem',  // 13px / 11.375px
      lg: '1.125rem',   // 18px / 15.75px
      xl: '1.375rem',   // 22px / 19.25px
      xxl: '2rem',      // 32px / 28px
    },
    boxShadow: {
      DEFAULT: 'rgba(100, 100, 100, 0.2) 0px 2px 8px 0px',
    },
    animation: {
      'fade-in': 'fade 280ms ease-out',
      'fade-out': 'fade 280ms ease-out reverse',
      highlight: 'highlight 2s ease-out 2s both',
      loading: 'loading 1s linear infinite',
      'loading-surface': 'loading-surface 2s ease infinite',
    },
    keyframes: (theme) => ({
      fade: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
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
