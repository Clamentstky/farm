/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        soil: {
          50: "#FAF6EF",
          100: "#F1E8D8",
          200: "#E2D0AF",
          400: "#B98B4E",
          600: "#8A5A2B",
          700: "#6B4520",
        },
        leaf: {
          400: "#7BA05B",
          500: "#5C8A3D",
          600: "#456B2C",
          700: "#33511F",
        },
        clay: {
          500: "#C1662F",
          600: "#A5511F",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
