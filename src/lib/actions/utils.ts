export function clickToCopy(
	node: HTMLElement,
	{
		target,
		text = ''
	}: {
		target?: string;
		text?: string;
	}
) {
	async function copyText() {
		try {
			await navigator.clipboard.writeText(text);
			node.dispatchEvent(new CustomEvent('copysuccess'));
		} catch (error) {
			node.dispatchEvent(new CustomEvent('copyerror'));
		}
	}

	async function copyTargetText() {
		let text = '';

		if (target) {
			const targetElement = document.querySelector<HTMLElement>(target);

			if (targetElement) {
				text = targetElement.innerText;
			}
		} else {
			text = node.innerText;
		}

		try {
			await navigator.clipboard.writeText(text);

			node.dispatchEvent(
				new CustomEvent('copysuccess', {
					bubbles: true
				})
			);
		} catch (error) {
			node.dispatchEvent(
				new CustomEvent('copyerror', {
					bubbles: true,
					detail: error
				})
			);
		}
	}

	if (text) {
		node.addEventListener('click', copyText);

		return {
			destroy() {
				node.removeEventListener('click', copyText);
			}
		};
	} else {
		node.addEventListener('click', copyTargetText);

		return {
			destroy() {
				node.removeEventListener('click', copyTargetText);
			}
		};
	}
}
