<script>
	import { tooltip } from '$lib/actions/tooltip';
	import { peers, selfId } from '$lib/stores/webrtc/room';
	import { crossfade, fade, fly, scale } from 'svelte/transition';
	import Loader from './Loader.svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';

	$: sortedPeers = $peers.sort((a, b) => {
		if (a.id === selfId || b.id === selfId) {
			return -1;
		}
		return a.joined < b.joined ? -1 : 1;
	});

	const [enter, leave] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<div
	class="flex items-center lg:justify-self-center col-span-3 xs:col-span-1 order-1 xs:order-none transition-all duration-150 ease-in-out min-w-min gap-3"
>
	<div class="flex flex-col xs:flex-row-reverse items-start xs:items-center gap-3">
		{#if sortedPeers.length === 1}
			<div transition:scale={{ duration: 300 }} class="flex xs:flex-row-reverse items-center gap-3">
				<Loader />
				<span
					class="text-base xs:text-sm lg:text-base font-light text-primary-1 dark:text-primary-9 lg:text-primary-9"
					>Waiting For Friends</span
				>
			</div>
		{/if}
		{#if sortedPeers}
			<div class="flex items-center justify-evenly gap-3">
				{#each sortedPeers as item, i (item.id)}
					<span
						in:enter={{ key: item.id }}
						out:leave={{ key: item.id }}
						animate:flip
						use:tooltip={item.id === selfId ? 'You' : ''}
						class="h-10 w-10 text-xl flex justify-center items-center rounded-full bg-primary-4 ring-2 ring-primary-5"
						class:!ring-primary-8={item.id === selfId}>{item.emoji}</span
					>
				{/each}
			</div>
		{/if}
	</div>
</div>
