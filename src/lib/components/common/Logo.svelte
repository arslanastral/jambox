<script>
	import { peers } from '$lib/stores/webrtc/room';
</script>

<h1
	class="text-xl tracking-tight flex gap-2 items-center text-primary-1 lg:text-primary-12 font-logo"
>
	JAMBOX
	{#if $peers.length}
		<span
			class="text-xs font-sans tracking-normal bg-red-400 text-white flex items-center justify-center px-[5px] py-[2px] rounded-md"
		>
			<span id="innert" class="material-symbols-rounded text-xs"> music_note </span>
			LIVE
		</span>
	{:else}
		<span id="innert" class="material-symbols-rounded"> music_note</span>
	{/if}
</h1>
