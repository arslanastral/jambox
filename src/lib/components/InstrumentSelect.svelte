<script lang="ts">
	import { allInstruments, type InstrumentName } from '$lib/stores/tonejs/instruments';
	import { instrumentConfig } from '$lib/stores/tonejs/instrumentsConfig';
	import { createListbox } from 'svelte-headlessui';
	import { scale, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { room, type Action } from '$lib/stores/webrtc/room';
	import { tooltip } from '$lib/actions/tooltip';
	import { page } from '$app/stores';

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
			allInstruments.selected.set(instrumentName);
		} else {
			allInstruments.add(instrumentName);

			if ($page.params.id) {
				const [sendInstrument] = room.actions.instrument as Action<InstrumentName>;
				sendInstrument(instrumentName);
			}
			allInstruments.selected.set(instrumentName);
		}
	}
</script>

<div class="relative w-44 z-20">
	<button
		use:tooltip={'Select Instrument'}
		use:listbox.button
		on:select={onSelect}
		class="relative w-full flex items-center justify-between cursor-pointer rounded-full bg-primary-12 dark:bg-primary-2 dark:border-primary-7 border-primary-11 border px-3 py-1 text-sm"
	>
		<div class="flex items-center gap-2">
			<span class="pointer-events-none material-symbols-rounded"> piano </span>
			<span class="block truncate">{$listbox.selected.name}</span>
		</div>
		<span class="pointer-events-none material-symbols-rounded"> expand_more </span>
	</button>

	{#if $listbox.expanded}
		<div transition:fly={{ duration: 200, easing: cubicInOut, y: -10 }}>
			<ul
				use:listbox.items
				class="absolute mt-1 h-44 overflow-y-auto px-1 pr-0 w-full rounded-lg bg-primary-12 dark:bg-primary-2 dark:border-primary-7 border-primary-11 border py-1 text-sm"
			>
				{#each instruments as value, i}
					{@const active = $listbox.active === value}
					{@const selected = $listbox.selected === value}
					<li
						class="relative justify-between items-center mr-1 flex cursor-default rounded-full select-none p-2 {active
							? 'bg-primaryA-4'
							: ''}"
						use:listbox.item={{ value }}
					>
						<div class="flex justify-start items-center">
							{#if selected}
								<span class="material-symbols-rounded px-1"> piano </span>
							{:else}
								<span class="material-symbols-rounded px-1"> music_note </span>
							{/if}

							<span class="truncate {selected ? 'font-medium' : 'font-normal'}">{value.name}</span>
						</div>

						{#if !(value.name in $allInstruments)}
							<span class="material-symbols-rounded"> download </span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
