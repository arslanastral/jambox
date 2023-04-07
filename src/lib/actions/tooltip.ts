import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/perspective-subtle.css';

export function tooltip(node: HTMLElement, text: string) {
	if (text) {
		tippy(node, {
			content: text,
			animation: 'perspective-subtle'
		});
	}
}
