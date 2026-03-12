import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        sans:  ["Inter", "sans-serif"],
      },
      colors: {
        bg:         "#D5D2CB",
        main:       "#1a1a1a",
        muted:      "#555555",
        terracotta: "#d38b88",
        accent:     "#1B2A47",
        border:     "#bfbcb5",
      },
    },
  },
  plugins: [],
};

export default config;
