import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        thanksgiving: {
          orange: "#E87722",
          pumpkin: "#FF7518",
          red: "#C1440E",
          cranberry: "#9D2235",
          yellow: "#F4AB4A",
          cream: "#FFF8E7",
          beige: "#FAF7F0",
          peach: "#FFE5CC",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
