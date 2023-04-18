<script>
	import { theme } from '$lib/stores/UX/theme';
	import { onMount } from 'svelte';
	import '../app.css';
	import { PUBLIC_APP_ENV } from '$env/static/public';
	onMount(() => {
		theme.setTheme();
	});
</script>

<svelte:head>
	{#if PUBLIC_APP_ENV === 'prod'}
		<script
			defer
			src="https://static.cloudflareinsights.com/beacon.min.js"
			data-cf-beacon={'{"token": "e271d0e3d28d4b35b50ca6e54345d7d5"}'}
		></script>
	{/if}
</svelte:head>

<slot />
