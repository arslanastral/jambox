<script lang="ts">
	const whiteKeyClasses =
		'bg-primary-1 border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-11 hover:bg-primary-4 active:bg-primary-5 transition-colors duration-300 ease-in-out';
	const blackKeyClasses = 'bg-primary-12 h-40 w-6 rounded-b -ml-3 -mr-3 z-10';

	function keyClick() {
		//TODO
	}
</script>

<div
	class="grid min-h-screen grid-row-1 min-w-full text-primary-9 justify-center content-center p-4"
>
	<div class=" h-[500px] rounded-container-token grid-rows-2 grid bg-primary-9">
		<div class="bg-primary-12 rounded-tl-container-token rounded-tr-container-token" />
		<div class="flex px-4">
			<button on:click={keyClick} class={whiteKeyClasses} />
			<button on:click={keyClick} class={blackKeyClasses} />
			<button on:click={keyClick} class={whiteKeyClasses} />
			<button on:click={keyClick} class={blackKeyClasses} />
			<button on:click={keyClick} class={whiteKeyClasses} />
			<button on:click={keyClick} class={whiteKeyClasses} />
			<button on:click={keyClick} class={blackKeyClasses} />
			<button on:click={keyClick} class={whiteKeyClasses} />
			<button on:click={keyClick} class={blackKeyClasses} />
			<button on:click={keyClick} class={whiteKeyClasses} />
			<button on:click={keyClick} class={blackKeyClasses} />
			<button on:click={keyClick} class={whiteKeyClasses} />
		</div>
	</div>
</div>
