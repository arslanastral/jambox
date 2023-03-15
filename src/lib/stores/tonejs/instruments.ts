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

type InstrumentName = (typeof instrumentConfig)[number]['name'];
export const currentInstrument = writable<InstrumentName>(instrumentConfig[0].name);

function createInstruments<T extends string>(options: SamplerInstrumentsOptions<T>) {
	const { subscribe, set, update } = writable<SamplerInstruments<T>>({} as SamplerInstruments<T>);

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
			baseUrl: baseUrlAll + name + '/' ?? baseUrl + name + '/',
			onload: () => {
				console.log(`${name} Loaded`);

				onload?.();
			}
		}).toDestination();
	}

	return {
		subscribe,
		load: (instrumentNames?: InstrumentName[]) => {
			const samplerInstruments: SamplerInstruments<T> = {} as SamplerInstruments<T>;
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
		},
		add: (instrumentName?: InstrumentName) => {
			const instrumentConfig = options.instrumentsConfig.find((i) => i.name === instrumentName);

			if (instrumentConfig) {
				update((i) => {
					if (!(instrumentConfig?.name in i)) {
						i[instrumentConfig.name] = createSampler(instrumentConfig);
					}
					return i;
				});
			}
		}
	};
}

export const allInstruments = createInstruments({
	minifyAll: true,
	baseUrlAll: PUBLIC_SAMPLES_URL,
	instrumentsConfig: instrumentConfig
});

allInstruments.load(['piano']);
