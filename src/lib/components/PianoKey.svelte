<script lang="ts">
	export let note: string;
	export let keyClick: (note: string, type: string) => void;
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
			keyClick(note, 'down');
		}
	}}
	on:keyup={(e) => {
		if (!e.repeat && e.key === keybind) {
			active = false;
			keyClick(note, 'up');
		}
	}}
/>

<button
	on:pointerdown|preventDefault={(e) => {
		e.currentTarget.releasePointerCapture(e.pointerId);
		active = true;
		keyClick(note, 'down');
	}}
	on:pointerup|preventDefault={(e) => {
		active = false;
		keyClick(note, 'up');
	}}
	on:pointerenter|preventDefault={(e) => {
		if (e.buttons === 1) {
			active = true;
			keyClick(note, 'down');
		}
	}}
	on:pointerleave|preventDefault={(e) => {
		if (e.buttons === 1) {
			active = false;
			keyClick(note, 'up');
		}
	}}
	class={note.includes('#') ? blackKeyClasses : whiteKeyClasses}
	class:bg-primary-10={active}
	class:border-primary-7={active}
	class:border-b-2={active}
	class:text-primary-1={active}
>
	{note.includes('#') ? '' : note}</button
>
