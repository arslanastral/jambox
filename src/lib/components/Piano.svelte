<script lang="ts">
	import { joinRoom } from 'trystero';
	import { start } from 'tone';

	import { onMount } from 'svelte';
	import { allInstruments } from '$lib/stores/tonejs/instruments';

	const whiteKeyClasses =
		'bg-primary-1 flex justify-center items-end border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-11 hover:bg-primary-4 active:bg-primary-5 transition-colors duration-300 ease-in-out';
	const blackKeyClasses =
		'bg-primary-12 flex justify-center items-end text-primary-1 text-xs  h-40 w-6 rounded-b -ml-3 -mr-3 z-10';

	let peerCount = 0;
	let hasAudioPermission = false;

	const config = { appId: 'pianojam-xcvddfg3434323faf' };
	const room = joinRoom(config, 'pianojam_room-sdfasdfasf878');

	const peerNames = {};

	const [playNote, getNote] = room.makeAction('notes');
	const [setName, getName] = room.makeAction('name');

	onMount(async () => {
		setName('some-player');

		room.onPeerJoin((peerId) => {
			peerCount++;
			setName('Oedipa', peerId);
			console.log(`${peerNames[peerId] || 'a weird stranger'} joined`);
		});

		room.onPeerLeave((peerId) => {
			if (!room.getPeers().length) {
				peerCount = 0;
			}

			console.log(`${peerNames[peerId] || 'a weird stranger'} left`);
			console.log(`${room.getPeers().length} peers left`);
		});

		getNote((data, peerId) => {
			const endTimestamp = Date.now();
			const latency = endTimestamp - data.timestamp;
			data.type === 'down'
				? instrument.triggerAttack(data.note)
				: instrument.triggerRelease(data.note);
			console.log(`Note: ${data.note} , Latency: ${latency}ms`);
		});

		getName((name, peerId) => (peerNames[peerId] = name));
	});

	const instrument = $allInstruments.piano;

	function keyClick(note: string, type: string) {
		type === 'down' ? instrument.triggerAttack(note) : instrument.triggerRelease(note);
		const startTimestamp = Date.now();
		playNote({ note, timestamp: startTimestamp, type });
	}

	function handleAudioPermissions() {
		start();
		hasAudioPermission = true;
	}

	let notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	let octaves = ['1', '2', '3'];
</script>

<div
	class="grid min-h-screen grid-row-1 min-w-full text-primary-9 justify-center content-center p-4"
>
	{#if !hasAudioPermission}
		<button on:click={handleAudioPermissions}>Allow Sound</button>
	{/if}

	{#if !peerCount}
		Finding Peers...
	{/if}
	<div class=" h-[500px] rounded-container-token grid-rows-2 grid bg-primary-9">
		<div class="bg-primary-12 rounded-tl-container-token rounded-tr-container-token" />
		<div class="flex px-4">
			{#each octaves as octave}
				{#each notes as note}
					<button
						on:mousedown={() => keyClick(note + octave, 'down')}
						on:mouseup={() => keyClick(note + octave, 'up')}
						on:mouseenter={(e) => {
							if (e.buttons == 1 || e.buttons == 3) keyClick(note + octave, 'down');
						}}
						on:mouseleave={() => keyClick(note + octave, 'up')}
						class={note.includes('#') ? blackKeyClasses : whiteKeyClasses}
					>
						{note + octave}</button
					>
				{/each}
			{/each}
		</div>
	</div>
</div>
