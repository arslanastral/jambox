<script>
	import { theme } from '$lib/stores/UX/theme';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		theme.setTheme();
	});
</script>

<slot />
