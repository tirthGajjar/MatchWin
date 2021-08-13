const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        rose: colors.rose,
        emerald: colors.emerald,
      },
      fontFamily: {
        sans: ["Inter", "system-ui"],
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        24: "repeat(24, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-16": "span 16 / span 16",
        "span-17": "span 17 / span 17",
        "span-18": "span 18 / span 18",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
