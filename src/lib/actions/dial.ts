import Nexus from 'nexusui';

export function dial(
	node: HTMLElement,
	onChange: (value?: number) => void,
	options = {
		size: [40, 40],
		min: 1,
		max: 100,
		value: 50
	}
) {
	onChange();
	const dial = new Nexus.Dial(node, options);

	dial.colorize('accent', 'var(--color-primary-9)');
	dial.colorize('fill', 'var(--color-primary-6)');

	dial.on('change', (value: number) => {
		onChange(value);
	});
}
