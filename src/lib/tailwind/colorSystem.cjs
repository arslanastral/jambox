const colorSettings = require('./colorSettings.cjs');

function generateShades(name) {
	const shades = {};

	for (const shade of colorSettings.shades) {
		shades[shade] = `var(--color-${name}-${shade})`;
	}

	shades['DEFAULT'] = `var(--color-${name}-9)`; // Set DEFAULT to shade 9

	return shades;
}

module.exports = () => {
	const palette = {};

	for (const name of colorSettings.names) {
		palette[name] = generateShades(name);
	}

	return palette;
};
