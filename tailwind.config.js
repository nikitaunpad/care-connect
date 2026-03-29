/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "variable-collection-black": "var(--variable-collection-black)",
        "variable-collection-coklat-muda":
          "var(--variable-collection-coklat-muda)",
        "variable-collection-coklat-pastel":
          "var(--variable-collection-coklat-pastel)",
        "variable-collection-dark-grey": "var(--variable-collection-dark-grey)",
        "variable-collection-grey": "var(--variable-collection-grey)",
        "variable-collection-ijo-muda": "var(--variable-collection-ijo-muda)",
        "variable-collection-ijo-pastel":
          "var(--variable-collection-ijo-pastel)",
        "variable-collection-ijo-tua": "var(--variable-collection-ijo-tua)",
        "variable-collection-light-grey":
          "var(--variable-collection-light-grey)",
        "variable-collection-putih-tulang":
          "var(--variable-collection-putih-tulang)",
        "variable-collection-white": "var(--variable-collection-white)",
      },
    },
  },
  plugins: [],
};
