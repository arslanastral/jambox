import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import type { Writable, Updater } from 'svelte/store';

type Stores<T> = Record<string, Writable<T>>;

const stores: Stores<unknown> = {};

export function localStorageStore<T>(key: string, value: T): Writable<T> {
	function setLocalStorage(key: string, value: T) {
		if (browser) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	if (!stores[key]) {
		const store = writable(value, (set) => {
			if (browser) {
				const json = localStorage.getItem(key);

				if (json) {
					set(<T>JSON.parse(json));
				}

				const handleStorage = (event: StorageEvent) => {
					if (event.key === key) set(event.newValue ? JSON.parse(event.newValue) : null);
				};

				window.addEventListener('storage', handleStorage);

				return () => window.removeEventListener('storage', handleStorage);
			}
		});

		const { subscribe, set } = store;

		stores[key] = {
			set(value: T) {
				setLocalStorage(key, value);
				set(value);
			},
			update: (updater: Updater<T>) => {
				const value = updater(get(store));

				setLocalStorage(key, value);
				set(value);
			},
			subscribe
		};
	}

	return stores[key] as Writable<T>;
}
