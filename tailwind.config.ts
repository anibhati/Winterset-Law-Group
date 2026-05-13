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
          50: "#e8ecf3",
          100: "#c5cfde",
          200: "#9eafc8",
          300: "#778fb2",
          400: "#5a7aa2",
          500: "#3d6592",
          600: "#345a86",
          700: "#294c76",
          800: "#1f3d65",
          900: "#1B2B4B", // Primary brand navy
          950: "#111d32",
        },
        gold: {
          50: "#fdf8ec",
          100: "#faeece",
          200: "#f5dfa0",
          300: "#f0cf72",
          400: "#e8bb4a",
          500: "#C9A84C", // Primary brand gold
          600: "#b08f3a",
          700: "#8e7230",
          800: "#6c5626",
          900: "#4a3b1c",
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
