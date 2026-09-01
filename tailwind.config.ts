import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        serif: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#09090b",
        paper: "#f8fafc",
        accent: "#e11d48",
        moss: "#18181b",
        brand: { 50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c" },
        dark: { 700: "#27272a", 800: "#18181b", 900: "#09090b" },
      },
    },
  },
  plugins: [],
};
export default config;
