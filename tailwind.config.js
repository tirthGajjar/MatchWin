const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

// Rotate Y utilities
const rotateY = plugin(function ({ addUtilities }) {
  addUtilities({
    ".rotate-y-180": {
      transform: "rotateY(180deg)",
    },
    ".transform-preserve-3d": {
      "transform-style": "preserve-3d",
    },
  });
});

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
        lime: colors.lime,
        sky: colors.sky,
        "cool-gray": colors.coolGray,
      },
      fontFamily: {
        sans: ["Inter", "system-ui"],
        calc: ["digital-7"],
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
  plugins: [require("@tailwindcss/aspect-ratio"), rotateY],
};
