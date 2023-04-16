import { get } from 'svelte/store';
import { localStorageStore } from '../utils/localStorageStore';
import mediaQuery from '../utils/mediaQuery';

export const prefersDarkMode = mediaQuery('(prefers-color-scheme:dark)');

export const colors = ['blue', 'cyan', 'red', 'grass', 'pink'] as const;

type Theme = {
	color: (typeof colors)[number];
	dark?: boolean;
};

function createThemeStore() {
	const theme = localStorageStore<Theme>('theme', {
		color: 'blue'
	});

	const { subscribe, update } = theme;

	const browser = typeof window !== 'undefined' && typeof document !== 'undefined';

	function setColor(color: (typeof colors)[number]) {
		if (browser) {
			const root = document.documentElement;
			update((t) => {
				t.color = color;
				return t;
			});
			for (let i = 1; i <= 12; i++) {
				root.style.setProperty('--color-primary-' + i, `var(--${color + i})`);
				root.style.setProperty('--color-primaryA-' + i, `var(--${color + 'A' + i})`);
			}
		}
	}

	function darkMode() {
		update((t) => {
			t.dark = true;
			document.documentElement.classList.add('dark-theme');
			return t;
		});
	}

	function lightMode() {
		update((t) => {
			t.dark = false;
			document.documentElement.classList.remove('dark-theme');
			return t;
		});
	}

	function setTheme() {
		const { color, dark } = get(theme);
		const prefersDark = get(prefersDarkMode);
		setColor(color);
		if (dark || (dark === undefined && prefersDark)) {
			darkMode();
		} else {
			lightMode();
		}
	}

	return {
		subscribe,
		setTheme,
		setColor,
		darkMode,
		lightMode
	};
}

export const theme = createThemeStore();
