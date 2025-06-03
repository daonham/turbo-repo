// prettier.config.js
module.exports = {
  endOfLine: "lf",
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: "none",
  arrowParens: "always",
  printWidth: 150,
  tabWidth: 2,
  importOrder: [
    "<BUILTIN_MODULES>",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "^@repo/(.*)$",
    "",
    "<TYPES>",
    "<TYPES>^[.]",
    "^@/(.*)$",
    "^[.]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$"
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
};
