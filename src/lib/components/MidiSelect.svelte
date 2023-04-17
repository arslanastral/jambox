<script lang="ts">
	import { allInstruments } from '$lib/stores/tonejs/instruments';
	import { instrumentConfig } from '$lib/stores/tonejs/instrumentsConfig';
	import { createListbox } from 'svelte-headlessui';
	import { scale, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { midiInputs, selectedMidiInput } from '$lib/stores/midi';

	const listbox = createListbox({
		label: 'Midi Devices',
		selected: $midiInputs.length && $midiInputs[0].name
	});

	function onSelect(e: Event) {
		let inputName = (e as CustomEvent).detail.selected.name;
		const midiInput = $midiInputs.find((i) => i.name === inputName);
		if (midiInput) {
			$selectedMidiInput = midiInput;
		}
	}
</script>

<div class="relative z-20">
	<button
		use:listbox.button
		on:select={onSelect}
		class="relative w-full flex items-center justify-between cursor-pointer rounded-full bg-primary-3 dark:border-primary-7 border-primary-11 border px-3 py-1 text-sm"
	>
		<div class="flex items-center gap-2">
			<span class="pointer-events-none material-symbols-rounded"> input </span>
			<span class="block truncate">{$selectedMidiInput.name ?? 'Not Connected'}</span>
		</div>
		<span class="pointer-events-none material-symbols-rounded"> expand_more </span>
	</button>

	{#if $midiInputs.length && $listbox.expanded}
		<div transition:fly={{ duration: 200, easing: cubicInOut, y: -10 }}>
			<ul
				use:listbox.items
				class="absolute bottom-10 mt-1 h-44 overflow-y-auto px-1 pr-0 w-full rounded-lg bg-primary-3 dark:border-primary-7 border-primary-11 border py-1 text-sm"
			>
				{#each $midiInputs as value, i}
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
								<span class="material-symbols-rounded px-1"> check_box </span>
							{:else}
								<span class="material-symbols-rounded px-1"> input </span>
							{/if}

							<span class="truncate">{value.name}</span>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
