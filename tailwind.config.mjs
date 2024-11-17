import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typography from '@tailwindcss/typography';
import styles from '@tailwindcss/typography/src/styles';

const reading = plugin(function ({ addComponents }) {
  addComponents({
    // Relative to font size of this element,
    // defaults to 20px on the body
    '.reading': {
      display: 'grid',
      gridTemplateColumns: '1fr min(66ch, 100%) 1fr',
      '> *': {
        gridColumn: '2',
      },
    },
  });
});

/** Sourced from https://github.com/tailwindlabs/tailwindcss-typography/blob/main/src/styles.js */
const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '');
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;

/** Add negative margins to blockquote and pre elements so the text is not indented */
const modifyStyles = (breakpoint) => {
  const defaults = styles.DEFAULT.css[0];
  const style = styles[breakpoint].css[0];
  return {
    css: {
      blockquote: {
        marginInlineStart: `calc(-${style.blockquote.paddingInlineStart} - ${defaults.blockquote.borderInlineStartWidth})`,
      },
      pre: {
        marginInlineStart: `-${style.pre.paddingInlineStart}`,
        marginInlineEnd: `-${style.pre.paddingInlineEnd}`,
      },
    },
  };
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', ...fontFamily.sans],
      },
      strokeWidth: {
        unset: 'unset',
      },
      typography: (theme) => ({
        sm: modifyStyles('sm'),
        DEFAULT: {
          css: {
            '@apply break-words': '',
            h1: {
              fontWeight: '600',
            },
            'h1 strong': {
              fontWeight: '700',
            },
            h2: {
              fontWeight: '600',
            },
            'h2 strong': {
              fontWeight: '700',
            },
            maxWidth: 'initial',
            'blockquote p:first-of-type::before': {
              content: '',
            },
            'blockquote p:last-of-type::after': {
              content: '',
            },
            'p code:not(a code), li code:not(a code)': {
              '@apply text-pink-600 dark:text-red-300': '',
            },
            code: {
              '@apply rounded bg-gray-500 bg-opacity-5 p-1 font-medium': '',
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            'img, video, iframe': {
              '@apply mx-auto flex justify-center rounded': '',
            },
            iframe: {
              '@apply aspect-video w-full': '',
            },
            // Bleed layout
            // We don't want to use the grid-column 1 / -1 approach here
            // because using grid will disable margin collapsing,
            // which is relied upon by the typography plugin
            '.bleed': {
              width: '100vw',
              marginInlineStart: 'calc(50% - 50vw)',
              ':where(img, video, iframe)': {
                '@apply rounded-none sm:rounded': '',
              },
            },
            '.bleed-full > *': {
              '@apply w-screen rounded-none': '',
            },
          },
        },
        base: modifyStyles('base'),
        lg: modifyStyles('lg'),
        xl: modifyStyles('xl'),
        '2xl': modifyStyles('2xl'),
      }),
    },
  },
  plugins: [reading, typography],
};
