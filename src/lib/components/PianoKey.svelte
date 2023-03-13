<script lang="ts">
	export let note: string;
	export let handleKeyPress: (e: KeyboardEvent, note: string, type: string) => void;
	export let keyClick: (note: string, type: string) => void;

	const whiteKeyClasses =
		'bg-primary-1 flex justify-center items-end border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-11 hover:bg-primary-4 active:bg-primary-5 transition-colors duration-300 ease-in-out';
	const blackKeyClasses =
		'bg-primary-12 flex justify-center items-end text-primary-1 text-xs  h-40 w-6 rounded-b -ml-3 -mr-3 z-10';
</script>

<svelte:window
	on:keydown={(e) => handleKeyPress(e, note, 'down')}
	on:keyup={(e) => handleKeyPress(e, note, 'up')}
/>

<button
	on:mousedown={() => keyClick(note, 'down')}
	on:mouseup={() => keyClick(note, 'up')}
	on:mouseenter={(e) => {
		if (e.buttons == 1 || e.buttons == 3) keyClick(note, 'down');
	}}
	on:mouseleave={() => keyClick(note, 'up')}
	class={note.includes('#') ? blackKeyClasses : whiteKeyClasses}
>
	{note}</button
>