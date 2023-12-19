/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        brand_pink: "#FF1B8D",
        brand_yellow: "#FFDA00",
        brand_blue: "#1BB3FF",
        brand_black: "#101214",
        brand_white: "#FFFFFF",
        brand_gray: "#9FA0A3",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        breath: "breath 4s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        breath: {
          "50%": { opacity: 0.90 },
        },
      },
    },
  },
  plugins: [],
};
