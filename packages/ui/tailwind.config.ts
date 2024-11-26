const base = require('@repo/config/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  content: [...base.content],
  theme: {
    extend: {
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        }
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite'
      }
    }
  },
  plugins: [...base.plugins, require('tailwindcss-animate')]
};
