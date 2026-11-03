/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en el monte mediterráneo
        pine: {
          50: "#f1f6f2",
          100: "#dde9e0",
          200: "#bcd3c3",
          300: "#91b59d",
          400: "#649277",
          500: "#44765b",
          600: "#335e48",
          700: "#294b3b",
          800: "#1f3a2e",
          900: "#142820",
          950: "#0b1913",
        },
        paper: {
          DEFAULT: "#f6f2ea",
          50: "#fbf9f5",
          100: "#f6f2ea",
          200: "#ece4d5",
          300: "#ddd0b8",
        },
        ink: "#1a221d",
        clay: {
          50: "#fbf1ec",
          100: "#f5ddd0",
          400: "#d9845a",
          500: "#c4622d",
          600: "#a54d20",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20, 40, 32, 0.04), 0 8px 24px -8px rgba(20, 40, 32, 0.12)",
        lift: "0 2px 4px rgba(20, 40, 32, 0.06), 0 18px 40px -12px rgba(20, 40, 32, 0.22)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
