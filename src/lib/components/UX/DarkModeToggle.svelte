<script lang="ts">
	import { theme } from '$lib/stores/UX/theme';

	$: isDark = $theme.dark;
</script>

<button
	class="material-symbols-rounded w-10 h-10 text-primary-1 lg:text-primary-9 dark:text-primary-9 font-light flex items-center justify-center rounded-full"
	on:click={isDark ? theme.lightMode : theme.darkMode}
>
	{#if isDark}
		light_mode
	{:else}
		dark_mode
	{/if}
</button>
