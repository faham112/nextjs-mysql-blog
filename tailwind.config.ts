import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0f172a",
        paper: "#faf7f2",
        accent: "#c45c26",
        moss: "#2f4f3e",
      },
    },
  },
  plugins: [],
};

export default config;
