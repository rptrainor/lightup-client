/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
		},
	},
	plugins: [
	],
}
