<script lang="ts">
	import { showKeybinds, showNoteNames } from '$lib/stores/UX/piano';
	import { currentInstrument } from '$lib/stores/tonejs/instruments';
	import { peers, activeKeys, selfId } from '$lib/stores/webrtc/room';
	import type { NotesAction } from '$lib/stores/webrtc/room';
	export let note: string;
	export let handleNote: (noteAction: NotesAction) => void;
	export let keybind: string;

	$: active = $activeKeys.find((k) => k.note === note);

	const whiteKeyClasses =
		'bg-primary-1 dark:bg-primary-8 relative flex touch-none text-primary-8 select-none justify-center items-end border-b-4 border-r border-primary-5 dark:border-primary-7 rounded-b h-full w-12 transition-all duration-150 ease-in-out';
	const blackKeyClasses =
		'bg-primary-12 dark:bg-primary-3 relative flex touch-none select-none justify-center items-end text-primary-6 text-xs border-b-4 border-primary-12 dark:border-primary-3 h-[67%] w-7 rounded-b -ml-3.5 -mr-3.5 z-10 transition-all duration-150 ease-in-out';

	const keyClasses = note.includes('#') ? blackKeyClasses : whiteKeyClasses;

	$: pressed = { note, instrument: $currentInstrument, isPressed: true, id: selfId };
	$: released = { note, instrument: $currentInstrument, isPressed: false, id: selfId };
	$: activeClasses = active ? '!bg-amber-500 !border-amber-600 !border-b-0 !text-surface-1' : '';

	$: peerEmoji = $peers.find((p) => p.id === active?.id)?.emoji;
</script>

<svelte:window
	on:keydown={(e) => {
		if (!e.repeat && e.key === keybind) {
			handleNote(pressed);
		}
	}}
	on:keyup={(e) => {
		if (!e.repeat && e.key === keybind) {
			handleNote(released);
		}
	}}
/>

<button
	on:pointerdown|preventDefault={(e) => {
		e.currentTarget.releasePointerCapture(e.pointerId);
		if (!active) {
			handleNote(pressed);
		}
	}}
	on:pointerup|preventDefault={(e) => {
		handleNote(released);
	}}
	on:pointerenter|preventDefault={(e) => {
		if (e.buttons === 1) {
			handleNote(pressed);
		}
	}}
	on:pointerleave|preventDefault={(e) => {
		if (e.buttons === 1) {
			handleNote(released);
		}
	}}
	class="{keyClasses} {activeClasses}"
>
	<span class="flex flex-col">
		{#if $showKeybinds}
			<span class="text-sm text-primary-7">
				{keybind}
			</span>
		{/if}

		{#if $showNoteNames}
			<span class="text-[11px]">
				{note}
			</span>
		{/if}
	</span>

	{#if active && $peers.length}
		<span
			class="h-10 w-10 absolute -bottom-4 text-xl flex justify-center items-center ring-2 ring-primary-5 rounded-full bg-primary-4"
			>{peerEmoji}</span
		>
	{/if}
</button>
