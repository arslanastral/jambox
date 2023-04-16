<script lang="ts">
	import { theme, colors } from '$lib/stores/UX/theme';
	import { createMenu } from 'svelte-headlessui';
	import { fly } from 'svelte/transition';
	const menu = createMenu({ label: 'Colors' });
</script>

<div class="relative">
	<button
		class="material-symbols-rounded w-10 h-10 text-primary-1 dark:text-primary-9 lg:text-primary-9 font-light flex items-center justify-center rounded-full"
		use:menu.button
	>
		<span class="material-symbols-rounded"> palette </span>
	</button>

	{#if $menu.expanded}
		<div
			transition:fly
			use:menu.items
			class="absolute flex flex-col gap-2 z-40 right-0 mt-2 p-2 rounded-xl bg-primary-1 shadow-lg"
		>
			{#each colors as color}
				<button
					on:click={() => theme.setColor(color)}
					style="background-color: var(--{color}9);"
					use:menu.item
					class="rounded-full material-symbols-rounded w-8 h-8 text-primary-1"
					>{$theme.color === color ? 'check' : ''}</button
				>
			{/each}
		</div>
	{/if}
</div>
