import { Sampler } from 'tone';
import { writable, get } from 'svelte/store';
import { PUBLIC_SAMPLES_URL } from '$env/static/public';
import { instrumentConfig } from './instrumentsConfig';

type InstrumentConfig<T extends string> = {
	name: T;
	urls: Record<string, string>;
	baseUrl?: string;
	onload?: () => void;
	minify?: boolean;
};

type SamplerInstrumentsOptions<T extends string> = {
	baseUrlAll?: string;
	instrumentsConfig: readonly InstrumentConfig<T>[];
	minifyAll?: boolean;
};

type SamplerInstruments<T extends string> = Record<T, Sampler>;

export type InstrumentName = (typeof instrumentConfig)[number]['name'];

function createInstruments<T extends string>(options: SamplerInstrumentsOptions<T>) {
	const { subscribe, set, update } = writable<SamplerInstruments<T>>({} as SamplerInstruments<T>);
	const currentInstrument = writable<InstrumentName>();

	function createSampler({ name, urls, baseUrl, onload, minify }: InstrumentConfig<T>): Sampler {
		const { minifyAll, baseUrlAll } = options;

		const minifiedUrls: Record<string, string> = {};

		if (minify || (minifyAll && minify === undefined)) {
			const { length } = Object.keys(urls);
			const skip = length > 48 ? 6 : length > 32 ? 4 : length > 16 ? 2 : 1;

			let i = 0;
			for (const [note, url] of Object.entries(urls)) {
				if (i % skip === 0) {
					minifiedUrls[note] = url;
				}
				i++;
			}
		}

		return new Sampler({
			urls: Object.keys(minifiedUrls).length ? minifiedUrls : urls,
			baseUrl: baseUrl ?? baseUrlAll + name + '/',
			onload: () => {
				console.log(`${name} Loaded`);

				onload?.();
			}
		}).toDestination();
	}

	const samplerInstruments: SamplerInstruments<T> = {} as SamplerInstruments<T>;

	return {
		subscribe,
		load: (instrumentNames?: InstrumentName[]) => {
			if (instrumentNames?.length) {
				for (const name of Array.from(new Set(instrumentNames))) {
					const instrumentConfig = options.instrumentsConfig.find((i) => i.name === name);
					if (instrumentConfig) {
						samplerInstruments[instrumentConfig.name] = createSampler(instrumentConfig);
					}
				}
			} else {
				for (const instrumentConfig of options.instrumentsConfig) {
					samplerInstruments[instrumentConfig.name] = createSampler(instrumentConfig);
				}
			}
			set(samplerInstruments);

			if (instrumentNames) {
				currentInstrument.set(instrumentNames[0]);
			}
		},
		add: (instrumentName: InstrumentName) => {
			const instrumentConfig = options.instrumentsConfig.find((i) => i.name === instrumentName);

			if (instrumentConfig) {
				update((i) => {
					if (!(instrumentConfig?.name in i)) {
						i[instrumentConfig.name] = createSampler(instrumentConfig);
					}
					return i;
				});
			}
		},
		selected: currentInstrument
	};
}

export const allInstruments = createInstruments({
	minifyAll: true,
	baseUrlAll: PUBLIC_SAMPLES_URL,
	instrumentsConfig: instrumentConfig
});

export const currentInstrument = allInstruments.selected;

allInstruments.load(['grand-piano']);
