<script lang="ts">
	import { theme } from '$lib/stores/UX/theme';
</script>

<button
	class="material-symbols-rounded w-10 h-10 text-primary-1 lg:text-primary-9 dark:text-primary-9 font-light flex items-center justify-center rounded-full"
	on:click={$theme.dark ? theme.lightMode : theme.darkMode}
>
	{#if $theme.dark}
		light_mode
	{:else}
		dark_mode
	{/if}
</button>
