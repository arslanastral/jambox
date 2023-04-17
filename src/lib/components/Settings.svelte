<script lang="ts">
	import { colors } from '$lib/stores/UX/theme';
	import { createDialog } from 'svelte-headlessui';
	import { fade, scale } from 'svelte/transition';
	import Switch from './common/Switch.svelte';
	import { theme } from '$lib/stores/UX/theme';
	import { showKeybinds, showNoteNames } from '$lib/stores/UX/piano';
	import MidiSelect from './MidiSelect.svelte';
	const dialog = createDialog({ label: 'Settings' });
	let isDark = false;
</script>

<button
	class="material-symbols-rounded w-10 h-10 text-primary-1 dark:text-primary-9 lg:text-primary-9 font-light flex items-center justify-center rounded-full"
	on:click={dialog.open}
>
	settings
</button>

{#if $dialog.expanded}
	<div
		transition:fade={{ duration: 200 }}
		role="presentation"
		class="fixed inset-0 z-40 selection: bg-primaryA-7 dark:bg-primaryA-4 backdrop-blur-md bg-opacity-60"
		on:click={dialog.close}
	/>

	<div class="fixed flex items-center justify-center inset-0 z-50 overflow-y-auto">
		<div
			transition:scale={{ duration: 300 }}
			class="flex flex-col gap-6 rounded-container-token bg-primary-1 p-6 shadow-xl"
			use:dialog.modal
		>
			<h3 class="text-xl leading-6 text-primary-12">Settings</h3>

			<div class="grid grid-cols-2 gap-x-6 gap-y-4">
				<!-- Dark Mode -->

				<div class="flex items-center gap-2">
					<span class="material-symbols-rounded">dark_mode</span>Dark Mode
				</div>
				<Switch checked={$theme.dark} on:click={$theme.dark ? theme.lightMode : theme.darkMode} />

				<div class="flex items-center gap-2">
					<span class="material-symbols-rounded">piano</span>Note Name
				</div>
				<Switch checked={$showNoteNames} on:click={() => ($showNoteNames = !$showNoteNames)} />

				{#if !('ontouchstart' in window)}
					<div class="flex items-center gap-2">
						<span class="material-symbols-rounded">keyboard</span>Keybinds
					</div>
					<Switch checked={$showKeybinds} on:click={() => ($showKeybinds = !$showKeybinds)} />
				{/if}

				<!-- Theme -->

				<div class="flex items-center gap-2">
					<span class="material-symbols-rounded">palette</span>Theme
				</div>
				<div class="flex items-center">
					{#each colors as color}
						<button
							on:click={() => theme.setColor(color)}
							style="background-color: var(--{color}9);"
							class="rounded-full aspect-square m-1 max-w-[40px] lg:min-w-[30px] material-symbols-rounded flex-1 text-primary-1"
							>{$theme.color === color ? 'check' : ''}
						</button>
					{/each}
				</div>

				<div class="flex items-center gap-2">
					<span class="material-symbols-rounded">cable</span>Midi Device
				</div>
				<MidiSelect />
			</div>
		</div>
	</div>
{/if}
