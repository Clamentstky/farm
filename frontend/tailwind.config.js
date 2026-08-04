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
          400: "#118707",
          600: "#118707",
          700: "#118707",
          800: "#27272a",
          900: "#18181b",
        },
        leaf: {
          400: "#118707",
          500: "#118707",
          600: "#118707",
          700: "#118707",
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
