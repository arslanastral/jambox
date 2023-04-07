<script>
	import { peers } from '$lib/stores/webrtc/room';
	import { selfId } from 'trystero';

	$: sortedPeers = $peers.sort((a, b) => {
		if (a.id === selfId || b.id === selfId) {
			return -1;
		}
		return a.joined < b.joined ? -1 : 1;
	});
</script>

<div class="flex items-center gap-4">
	{#if $peers}
		{#each sortedPeers as item, i}
			<span
				class="h-12 w-12 text-xl flex justify-center items-center ring-2 ring-primary-5 rounded-full bg-primary-4"
				class:ring-primary-9={item.id === selfId}>{item.emoji}</span
			>
		{/each}
	{/if}
</div>
