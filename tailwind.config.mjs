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
        utility_success: '#008F0E',
        utility_success_tint: '#D8F5DB',
        utility_success_shade: '#064210',
        // Core color for warning messages
        utility_warning: '#FACC15',
        utility_warning_tint: '#FEF9C3',
        utility_warning_shade: '#A16207',
        // Core color for error messages
        utility_danger: '#DC2626',
        utility_danger_tint: '#FEE2E2',
        utility_danger_shade: '#7F1D1D',
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
