import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: "#030304", 900: "#07080a", 800: "#0c0d10", 700: "#121318", 600: "#1a1c22" },
        steel: { 100: "#ececef", 200: "#c9cad1", 300: "#9a9ca6", 400: "#6d6f7a", 500: "#4a4c55" },
        arc: { DEFAULT: "rgb(var(--arc) / <alpha-value>)", soft: "#a8f3ff", deep: "#0e7c93" },
        // "hot" and "warm" are steel/silver in Stealth mode and red/gold in Mark mode.
        hot: "rgb(var(--hot) / <alpha-value>)",
        warm: "rgb(var(--warm) / <alpha-value>)",
        ok: "#4ade80",
        // Status colours stay fixed in both modes so warnings always read as warnings.
        danger: "#f05252",
        caution: "#f2b84b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        scan: { "0%": { transform: "translateY(-100%)" }, "100%": { transform: "translateY(100%)" } },
        flicker: { "0%,100%": { opacity: "1" }, "92%": { opacity: "1" }, "93%": { opacity: ".4" }, "94%": { opacity: "1" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        scan: "scan 3.5s linear infinite",
        flicker: "flicker 6s linear infinite",
        "spin-slow": "spin 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
