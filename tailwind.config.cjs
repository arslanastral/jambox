/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class', '.dark-theme'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--theme-font-family-base)'],
				logo: ['var(--theme-font-family-logo)']
			},
			screens: {
				xs: '568px'
			},
			gridTemplateAreas: {},
			gridTemplateColumns: {},
			gridTemplateRows: {}
		}
	},
	plugins: [require('@savvywombat/tailwindcss-grid-areas'), require('./src/lib/tailwind/core.cjs')]
};
