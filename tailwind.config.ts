import type { Config } from "tailwindcss";

const config: Config = {
  safelist: ["grid-cols-2", "grid-cols-3", "grid-cols-4"],
  content: [
    "./src/**/*.{astro,js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand colors - Austin FC Green + Warm Coral
        brand: {
          green: "#00B140",
          coral: "#FF6B5A",
        },
        // Supporting colors
        base: {
          bg: "#FAFAFA",
          text: "#2C2C2C",
          border: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      spacing: {
        // Gallery-style generous spacing
        "18": "4.5rem", // 72px
        "22": "5.5rem", // 88px
        "26": "6.5rem", // 104px
        "30": "7.5rem", // 120px
      },
      animation: {
        shine: "shine var(--duration) infinite linear",
      },
      keyframes: {
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
      },
      fontSize: {
        // Typography hierarchy from moodboard
        hero: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }], // 64px
        display: ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }], // 48px
        h1: ["2rem", { lineHeight: "1.3" }], // 32px
      },
    },
  },
  plugins: [],
};
export default config;
