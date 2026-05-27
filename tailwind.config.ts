import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#e7ecf1",
          100: "#c1ccd8",
          200: "#97abbc",
          300: "#6e899f",
          400: "#4f7089",
          500: "#305773",
          600: "#284a64",
          700: "#1e3a52",
          800: "#162e42",
          900: "#10283B",
          950: "#0a1a28",
        },
        gold: {
          50: "#fbf4ed",
          100: "#f4e3d0",
          200: "#e7c5a3",
          300: "#daa776",
          400: "#c68f5f",
          500: "#B1784D",
          600: "#956440",
          700: "#785034",
          800: "#5b3d27",
          900: "#3e2a1b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;