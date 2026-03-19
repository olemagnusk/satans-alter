import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      /* ── Coven color tokens (mapped from CSS vars in globals.css) ── */
      colors: {
        coven: {
          bg: "var(--coven-bg)",
          surface: "var(--coven-surface)",
          sidebar: "var(--coven-sidebar)",
          primary: "var(--coven-primary)",
          "primary-hover": "var(--coven-primary-hover)",
          danger: "var(--coven-danger)",
          text: "var(--coven-text)",
          "text-muted": "var(--coven-text-muted)",
          "text-soft": "var(--coven-text-soft)",
          border: "var(--coven-border)",
          "border-strong": "var(--coven-border-strong)",
          active: "var(--coven-active)",
          grid: "var(--coven-grid)"
        }
      },
      /* ── Coven radii ── */
      borderRadius: {
        xl: "1.125rem",   /* 18px — cards */
        lg: "0.75rem",    /* 12px — buttons, inputs */
        md: "0.5rem",     /* 8px */
        sm: "0.25rem"     /* 4px */
      },
      /* ── Coven typography ── */
      fontFamily: {
        heading: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      container: {
        center: true,
        padding: "1.5rem"
      }
    }
  },
  plugins: [tailwindAnimate]
};

export default config;
