<script>
	import { tooltip } from '$lib/actions/tooltip';
	import { peers, selfId } from '$lib/stores/webrtc/room';
	import { scale } from 'svelte/transition';
	import Loader from './Loader.svelte';

	$: sortedPeers = $peers.sort((a, b) => {
		if (a.id === selfId || b.id === selfId) {
			return -1;
		}
		return a.joined < b.joined ? -1 : 1;
	});
</script>

<div
	class="flex items-center lg:justify-self-center col-span-3 xs:col-span-1 order-1 xs:order-none transition-all duration-150 ease-in-out min-w-min gap-3"
>
	<div class="flex flex-col xs:flex-row-reverse items-start xs:items-center gap-3">
		{#if $peers.length === 1}
			<div class="flex xs:flex-row-reverse items-center gap-2">
				<span class="text-base xs:text-sm lg:text-base font-light text-primary-1 lg:text-primary-9"
					>Finding Friends</span
				>
				<Loader />
			</div>
		{/if}
		{#if $peers}
			<div class="flex items-center justify-evenly gap-2">
				{#each sortedPeers as item, i}
					<span
						transition:scale
						use:tooltip={item.id === selfId ? 'You' : ''}
						class="h-10 w-10 text-xl flex justify-center items-center rounded-full bg-primary-3"
						class:ring-2={item.id === selfId}>{item.emoji}</span
					>
				{/each}
			</div>
		{/if}
	</div>
</div>
