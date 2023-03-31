<script lang="ts">
	import { currentInstrument } from '$lib/stores/tonejs/instruments';
	import type { NotesAction } from '$lib/stores/webrtc/room';
	export let note: string;
	export let handleNote: (noteAction: NotesAction) => void;
	export let keybind: string;

	let active = false;

	const whiteKeyClasses =
		'bg-primary-1 flex touch-none text-primary-8 select-none justify-center items-end border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-12 transition-all duration-150 ease-in-out';
	const blackKeyClasses =
		'bg-primary-12 flex touch-none select-none justify-center items-end text-primary-6 text-xs  h-40 w-7 rounded-b -ml-3.5 -mr-3.5 z-10';
</script>

<svelte:window
	on:keydown={(e) => {
		if (!e.repeat && e.key === keybind) {
			active = true;
			handleNote({ note, instrument: $currentInstrument, isPressed: true });
		}
	}}
	on:keyup={(e) => {
		if (!e.repeat && e.key === keybind) {
			active = false;
			handleNote({ note, instrument: $currentInstrument, isPressed: false });
		}
	}}
/>

<button
	on:pointerdown|preventDefault={(e) => {
		e.currentTarget.releasePointerCapture(e.pointerId);
		active = true;
		handleNote({ note, instrument: $currentInstrument, isPressed: true });
	}}
	on:pointerup|preventDefault={(e) => {
		active = false;
		handleNote({ note, instrument: $currentInstrument, isPressed: false });
	}}
	on:pointerenter|preventDefault={(e) => {
		if (e.buttons === 1) {
			active = true;
			handleNote({ note, instrument: $currentInstrument, isPressed: true });
		}
	}}
	on:pointerleave|preventDefault={(e) => {
		if (e.buttons === 1) {
			active = false;
			handleNote({ note, instrument: $currentInstrument, isPressed: false });
		}
	}}
	class={note.includes('#') ? blackKeyClasses : whiteKeyClasses}
	class:!bg-amber-500={active}
	class:!border-amber-500={active}
	class:!border-b-0={active}
	class:!text-surface-1={active}
>
	{note.includes('#') ? '' : note}</button
>
