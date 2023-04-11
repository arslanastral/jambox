<script lang="ts">
	import { currentInstrument } from '$lib/stores/tonejs/instruments';
	import { peers, activeKeys, selfId } from '$lib/stores/webrtc/room';
	import type { NotesAction } from '$lib/stores/webrtc/room';
	export let note: string;
	export let handleNote: (noteAction: NotesAction) => void;
	export let keybind: string;

	let active = false;
	$: activePeer = $activeKeys.find((k) => k.note === note);

	const whiteKeyClasses =
		'bg-primary-1 relative flex touch-none text-primary-8 select-none justify-center items-end border-b-4 border-r border-primary-5 rounded-b h-full w-12 transition-all duration-150 ease-in-out';
	const blackKeyClasses =
		'bg-primary-12 relative flex touch-none select-none justify-center items-end text-primary-6 text-xs border-b-4 border-primary-12 h-[67%] w-7 rounded-b -ml-3.5 -mr-3.5 z-10 transition-all duration-150 ease-in-out';

	const keyClasses = note.includes('#') ? blackKeyClasses : whiteKeyClasses;

	$: pressed = { note, instrument: $currentInstrument, isPressed: true, id: selfId };
	$: released = { note, instrument: $currentInstrument, isPressed: false, id: selfId };
	$: activeClasses =
		active || activePeer ? '!bg-amber-500 !border-amber-600 !border-b-0 !text-surface-1' : '';

	$: selfEmoji = $peers.find((p) => p.id === selfId)?.emoji;
	$: peerEmoji = $peers.find((p) => p.id === activePeer?.id)?.emoji;
</script>

<svelte:window
	on:keydown={(e) => {
		if (!e.repeat && e.key === keybind) {
			active = true;
			handleNote(pressed);
		}
	}}
	on:keyup={(e) => {
		if (!e.repeat && e.key === keybind) {
			active = false;
			handleNote(released);
		}
	}}
/>

<button
	on:pointerdown|preventDefault={(e) => {
		e.currentTarget.releasePointerCapture(e.pointerId);
		if (!active) {
			active = true;
			handleNote(pressed);
		}
	}}
	on:pointerup|preventDefault={(e) => {
		active = false;
		handleNote(released);
	}}
	on:pointerenter|preventDefault={(e) => {
		if (e.buttons === 1) {
			active = true;
			handleNote(pressed);
		}
	}}
	on:pointerleave|preventDefault={(e) => {
		if (e.buttons === 1) {
			active = false;
			handleNote(released);
		}
	}}
	class="{keyClasses} {activeClasses}"
>
	{#if active && selfEmoji}
		<span
			class="h-12 w-12 absolute -bottom-6 text-xl flex justify-center items-center ring-2 ring-primary-5 rounded-full bg-primary-4"
			>{selfEmoji}</span
		>
	{/if}

	{#if activePeer}
		<span
			class="h-12 w-12 absolute -bottom-6 text-xl flex justify-center items-center ring-2 ring-primary-5 rounded-full bg-primary-4"
			>{peerEmoji}</span
		>
	{/if}
</button>
