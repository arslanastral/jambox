<script>
	import { peers } from '$lib/stores/webrtc/room';
	import { pick } from 'nexusui';
</script>

<div class="flex items-center gap-4">
	{#if $peers}
		{#each $peers as item}
			<span
				class="h-12 w-12 flex justify-center items-center ring-2 ring-primary-5 rounded-full bg-primary-4"
				>{item.emoji}</span
			>
		{/each}
	{/if}
</div>
