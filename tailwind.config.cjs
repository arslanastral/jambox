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

			gridTemplateRows: {
				share: 'auto minmax(auto, 1fr) auto',
				qr: 'minmax(0, 1fr) auto'
			}
		}
	},
	plugins: [require('./src/lib/tailwind/core.cjs')]
};
