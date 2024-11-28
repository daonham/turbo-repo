const base = require('@repo/config/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  content: [...base.content],
  theme: {
    ...base?.theme,
    extend: {
      ...base?.theme?.extend
    }
  },
  plugins: [...base.plugins]
};
