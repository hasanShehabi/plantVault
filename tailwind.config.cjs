/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf6",
          100: "#d7f8e9",
          500: "#18a562",
          700: "#0f7b49",
          900: "#0b4d30"
        }
      },
      boxShadow: {
        card: "0 6px 18px -8px rgba(15, 23, 42, 0.16)"
      }
    },
  },
  plugins: [],
};
