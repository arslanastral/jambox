import QrCreator from 'qr-creator';

export function QRCode(node: HTMLCanvasElement, text: string) {
	QrCreator.render(
		{
			text: text,
			radius: 0.5, // 0.0 to 0.5
			ecLevel: 'H', // L, M, Q, H
			fill: 'blue', // foreground color
			background: null, // color or null for transparent
			size: 250 // in pixels
		},
		node
	);
}
