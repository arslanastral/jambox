<script lang="ts">
	import { currentInstrument, allInstruments } from '$lib/stores/tonejs/instruments';
	import { instrumentConfig } from '$lib/stores/tonejs/instrumentsConfig';
	import { Svroller } from 'svrollbar';
	import { createListbox } from 'svelte-headlessui';
	import { scale } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	const instruments = instrumentConfig
		.map((i) => ({ name: i.name }))
		.sort((a, b) => (a.name in $allInstruments ? -1 : 1));

	const listbox = createListbox({
		label: 'Actions',
		selected: instruments[0]
	});

	function onSelect(e: Event) {
		let instrumentName = (e as CustomEvent).detail.selected.name;
		if (instrumentName in $allInstruments) {
			$currentInstrument = instrumentName;
		} else {
			allInstruments.add(instrumentName);
			$currentInstrument = instrumentName;
		}
	}
</script>

<div class="relative mt-1 w-52">
	<button
		use:listbox.button
		on:select={onSelect}
		class="relative w-full cursor-default rounded-lg bg-primary-3 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
	>
		<span class="block truncate">{$listbox.selected.name}</span>
		<span
			class="pointer-events-none material-symbols-rounded  absolute inset-y-0 right-0 flex items-center pr-2"
		>
			piano
		</span>
	</button>

	{#if $listbox.expanded}
		<div transition:scale={{ duration: 250, easing: cubicInOut }}>
			<ul
				use:listbox.items
				class="absolute z-20 mt-1 max-h-60 px-2 pr-0 w-full rounded-lg bg-surface-1 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
			>
				<Svroller alwaysVisible={true} width="100%" margin={{ left: 20 }}>
					{#each instruments as value, i}
						{@const active = $listbox.active === value}
						{@const selected = $listbox.selected === value}
						<li
							class="relative justify-between items-center mr-3 flex cursor-default rounded-full select-none p-2 {active
								? 'bg-primary-3'
								: 'text-gray-900'}"
							use:listbox.item={{ value }}
						>
							<div class="flex justify-start items-center">
								{#if selected}
									<span class="material-symbols-rounded px-2 text-primary"> piano </span>
								{:else}
									<span class="material-symbols-rounded px-2 text-primary"> music_note </span>
								{/if}

								<span class="truncate {selected ? 'font-medium' : 'font-normal'}">{value.name}</span
								>
							</div>

							{#if !(value.name in $allInstruments)}
								<span class="material-symbols-rounded text-primary"> download </span>
							{/if}
						</li>
					{/each}
				</Svroller>
			</ul>
		</div>
	{/if}
</div>
