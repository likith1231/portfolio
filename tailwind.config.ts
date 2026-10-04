import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts", "./lib/**/*.ts"],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: "#050404", 900: "#0a0808", 800: "#110d0d", 700: "#181313", 600: "#221a1a" },
        steel: { 100: "#efeae6", 200: "#cfc8c3", 300: "#a39b96", 400: "#77706c", 500: "#524c49" },
        // Accent tokens. Classic mode: hot-rod red + gold. War Machine mode: gunmetal + silver.
        gold: "rgb(var(--gold) / <alpha-value>)",
        hot: "rgb(var(--hot) / <alpha-value>)",
        // Blue lives only in the arc reactor.
        reactor: "#8fefff",
        ok: "#4ade80",
        danger: "#ff4d4d",
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
        flicker: { "0%,100%": { opacity: "1" }, "92%": { opacity: "1" }, "93%": { opacity: ".4" }, "94%": { opacity: "1" } },
        blast: { "0%": { transform: "translate(-50%,-50%) scale(.2)", opacity: "1" }, "100%": { transform: "translate(-50%,-50%) scale(2.6)", opacity: "0" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        flicker: "flicker 6s linear infinite",
        "spin-slow": "spin 30s linear infinite",
        blast: "blast .6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
