import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          primary: "#D4AF37",
          secondary: "#F2C94C",
          dark: "#A77C12",
          pale: "#FFF6D6"
        },
        harvest: {
          olive: "#5F6F37",
          leaf: "#7D9A4D",
          safflower: "#C94C35",
          cream: "#FFF9EC"
        },
        surface: {
          white: "#FFFFFF",
          black: "#101010",
          gray: "#F5F5F5",
          border: "#E6E2D8",
          muted: "#757575"
        }
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(16, 16, 16, 0.08)",
        focus: "0 0 0 3px rgba(212, 175, 55, 0.28)"
      },
      borderRadius: {
        component: "8px"
      }
    }
  },
  plugins: []
};

export default config;
