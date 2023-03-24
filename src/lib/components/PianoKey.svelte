<script lang="ts">
	export let note: string;
	export let handleKeyPress: (e: KeyboardEvent, note: string, type: string) => void;
	export let keyClick: (note: string, type: string) => void;

	const whiteKeyClasses =
		'bg-primary-1 flex touch-none text-primary-8 select-none justify-center items-end border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-12 hover:bg-primary-4 active:bg-primary-5 transition-colors duration-300 ease-in-out';
	const blackKeyClasses =
		'bg-primary-12 flex touch-none select-none justify-center items-end text-primary-6 text-xs  h-40 w-7 rounded-b -ml-3.5 -mr-3.5 z-10';
</script>

<svelte:window
	on:keydown={(e) => handleKeyPress(e, note, 'down')}
	on:keyup={(e) => handleKeyPress(e, note, 'up')}
/>

<button
	on:pointerdown|preventDefault={(e) => {
		e.currentTarget.releasePointerCapture(e.pointerId);
		keyClick(note, 'down');
	}}
	on:pointerup|preventDefault={(e) => {
		keyClick(note, 'up');
	}}
	on:pointerenter|preventDefault={(e) => {
		if (e.buttons === 1) {
			keyClick(note, 'down');
		}
	}}
	on:pointerleave|preventDefault={(e) => {
		if (e.buttons === 1) {
			keyClick(note, 'up');
		}
	}}
	class={note.includes('#') ? blackKeyClasses : whiteKeyClasses}
>
	{note.includes('#') ? '' : note}</button
>
