const base = require('@repo/config/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  content: [...base.content],
  plugins: [...base.plugins]
};
