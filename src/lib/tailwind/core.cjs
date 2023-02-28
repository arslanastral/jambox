const plugin = require('tailwindcss/plugin');

// colors
const themeColors = require('./colorSystem.cjs');

// tokens
const tokensBorders = require('./tokens/borders.cjs');
const tokensBorderRadius = require('./tokens/border-radius.cjs');

module.exports = plugin(
	({ addUtilities }) => {
		addUtilities({
			...tokensBorders(),
			...tokensBorderRadius()
		});
	},
	{
		theme: {
			extend: {
				colors: themeColors()
			}
		}
	}
);
