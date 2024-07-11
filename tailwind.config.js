/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      regular: ["Inter", "sans-serif"],
      special: ["Space Grotesk", "sans-serif"],
    },
  },
  plugins: [],
};
