/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#0B2027",
        river: "#173A44",
        riverLight: "#2E5266",
        cyan: "#4CC9C0",
        silt: "#D4A24C",
        rust: "#B5533C",
        mist: "#F0F4F3",
        mistDim: "#9FB3AF",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        flow: { "0%": { strokeDashoffset: "0" }, "100%": { strokeDashoffset: "-200" } },
        pulseDot: { "0%, 100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: "0.5", transform: "scale(1.4)" } },
      },
      animation: {
        flow: "flow 6s linear infinite",
        pulseDot: "pulseDot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
