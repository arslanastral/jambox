<script lang="ts">
	import { joinRoom } from 'trystero';
	import * as Tone from 'tone';

	import { onMount } from 'svelte';

	const whiteKeyClasses =
		'bg-primary-1 border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-11 hover:bg-primary-4 active:bg-primary-5 transition-colors duration-300 ease-in-out';
	const blackKeyClasses = 'bg-primary-12 h-40 w-6 rounded-b -ml-3 -mr-3 z-10';

	let peerid = '';
	let hasAudioPermission = false;

	const config = { appId: 'pianojam-xcvddfg3434323faf' };
	const room = joinRoom(config, 'pianojam_room-sdfasdfasf878');

	const [playNote, getNote] = room.makeAction('notes');

	onMount(async () => {
		room.onPeerJoin((peerId) => {
			peerid = peerId;
			console.log(`${peerId} joined`);
		});

		room.onPeerLeave((peerId) => {
			peerid = '';
			console.log(`${peerId} joined`);
			console.log(`${peerId} left`);
		});

		getNote((data, peerId) => {
			const endTimestamp = Date.now();
			const latency = endTimestamp - data.timestamp;
			synth.triggerAttackRelease(data.note, '4n');
			console.log(`Note: ${data.note} , Latency: ${latency}ms`);
		});
	});

	const synth = new Tone.Synth().toDestination();

	function keyClick(note: string) {
		synth.triggerAttackRelease(note, '4n');
		const startTimestamp = Date.now();
		playNote({ note, timestamp: startTimestamp });
	}

	function handleAudioPermissions() {
		Tone.start();
		hasAudioPermission = true;
	}
</script>

<div
	class="grid min-h-screen grid-row-1 min-w-full text-primary-9 justify-center content-center p-4"
>
	{#if !hasAudioPermission}
		<button on:click={handleAudioPermissions}>Allow Sound</button>
	{/if}

	{#if !peerid}
		Finding Peers...
	{/if}
	<div class=" h-[500px] rounded-container-token grid-rows-2 grid bg-primary-9">
		<div class="bg-primary-12 rounded-tl-container-token rounded-tr-container-token" />
		<div class="flex px-4">
			<button on:click={() => keyClick('C4')} class={whiteKeyClasses} />
			<button on:click={() => keyClick('C#4')} class={blackKeyClasses} />
			<button on:click={() => keyClick('D4')} class={whiteKeyClasses} />
			<button on:click={() => keyClick('D#4')} class={blackKeyClasses} />
			<button on:click={() => keyClick('E4')} class={whiteKeyClasses} />
			<button on:click={() => keyClick('F4')} class={whiteKeyClasses} />
			<button on:click={() => keyClick('F#4')} class={blackKeyClasses} />
			<button on:click={() => keyClick('G4')} class={whiteKeyClasses} />
			<button on:click={() => keyClick('G#4')} class={blackKeyClasses} />
			<button on:click={() => keyClick('A4')} class={whiteKeyClasses} />
			<button on:click={() => keyClick('A#4')} class={blackKeyClasses} />
			<button on:click={() => keyClick('B4')} class={whiteKeyClasses} />
		</div>
	</div>
</div>
