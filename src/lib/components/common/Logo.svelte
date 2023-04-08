<script>
	import { peers } from '$lib/stores/webrtc/room';
</script>

<h1
	class="text-3xl tracking-tight flex justify-between gap-2 items-center text-primary-12 font-logo"
>
	JAMBOX
	{#if $peers.length}
		<span
			class="text-sm font-sans tracking-normal bg-red-400 text-white flex items-center justify-center px-[6px] py-[2px] rounded-md"
		>
			<span id="innert" class="material-symbols-rounded text-sm"> music_note </span>
			LIVE
		</span>
	{:else}
		<span id="innert" class="material-symbols-rounded text-primary-9"> music_note</span>
	{/if}
</h1>
