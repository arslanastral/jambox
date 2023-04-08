<script lang="ts">
	import { activeKeys } from '$lib/stores/piano';
	import { currentInstrument } from '$lib/stores/tonejs/instruments';
	import { peers } from '$lib/stores/webrtc/room';
	import type { NotesAction } from '$lib/stores/webrtc/room';
	import { selfId } from 'trystero';
	export let note: string;
	export let handleNote: (noteAction: NotesAction) => void;
	export let keybind: string;

	let active = false;

	const whiteKeyClasses =
		'bg-primary-1 relative flex touch-none text-primary-8 select-none justify-center items-end border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-12 transition-all duration-150 ease-in-out';
	const blackKeyClasses =
		'bg-primary-12 relative flex touch-none select-none justify-center items-end text-primary-6 text-xs border-b-4 border-primary-12 h-40 w-7 rounded-b -ml-3.5 -mr-3.5 z-10 transition-all duration-150 ease-in-out';

	const keyClasses = note.includes('#') ? blackKeyClasses : whiteKeyClasses;

	$: pressedDown = { note, instrument: $currentInstrument, isPressed: true, player: selfId };
	$: released = { note, instrument: $currentInstrument, isPressed: false, player: selfId };
	$: activeClasses = active ? '!bg-amber-500 !border-amber-500 !border-b-0 !text-surface-1' : '';
</script>

<svelte:window
	on:keydown={(e) => {
		if (!e.repeat && e.key === keybind) {
			active = true;
			handleNote(pressedDown);
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
		active = true;
		handleNote(pressedDown);
	}}
	on:pointerup|preventDefault={(e) => {
		active = false;
		handleNote(released);
	}}
	on:pointerenter|preventDefault={(e) => {
		if (e.buttons === 1) {
			active = true;
			handleNote(pressedDown);
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
	{#if active && $peers.length}
		<span
			class="h-12 w-12 absolute -bottom-6 text-xl flex justify-center items-center ring-2 ring-primary-5 rounded-full bg-primary-4"
			>😺</span
		>
	{/if}
</button>
