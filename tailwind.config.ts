import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#ffffff",
        ink: "#1c1c1c",
        muted: "#6b6b6b",
        rule: "#e6e4e0",
        accent: "#a51c30",
        "accent-soft": "#fbf0f2",
        navy: "#1b2a4a",
      },
      fontFamily: {
        slab: ["'Roboto Slab'", "Georgia", "serif"],
        sans: ["Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
