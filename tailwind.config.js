/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      regular: ["Inter", "sans-serif"],
      special: ["Space Grotesk", "sans-serif"],
      super_special: ["Archivo", "monospace"],
    },
    colors: {
      text_white_primary: "#fffffff2",
      text_white_secondary: "#ffffff7f",
      text_white_tertiary: "#ffffff66",
      text_black_primary: "#231F20",
      text_black_secondary: "#231f20b3",
      primary_main: "#25AAE1",
      background_light: "#e6e6e6",
      border_dark: "#575757",
    },
  },
  plugins: [],
};
