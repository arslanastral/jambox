<script lang="ts">
	import { joinRoom } from 'trystero';
	import { start } from 'tone';
	import { onMount } from 'svelte';
	import { allInstruments, currentInstrument } from '$lib/stores/tonejs/instruments';
	import PianoKey from './PianoKey.svelte';
	import InstrumentSelect from './InstrumentSelect.svelte';

	let peerCount = 0;
	let hasAudioPermission = false;

	const config = { appId: 'pianojam-xcvd' };
	const room = joinRoom(config, 'pianojam_room-sdf');

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

	$: instrument = $allInstruments[$currentInstrument];

	function setRelease() {
		instrument.release = 50;
	}

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
	let octave = ['3', '4', '5'];

	$: KEYMAP = {
		[`C${octave[0]}`]: 'q',
		[`C#${octave[0]}`]: '2',
		[`D${octave[0]}`]: 'w',
		[`D#${octave[0]}`]: '3',
		[`E${octave[0]}`]: 'e',
		[`F${octave[0]}`]: 'r',
		[`F#${octave[0]}`]: '5',
		[`G${octave[0]}`]: 't',
		[`G#${octave[0]}`]: '6',
		[`A${octave[0]}`]: 'y',
		[`A#${octave[0]}`]: '7',
		[`B${octave[0]}`]: 'u',
		[`C${octave[1]}`]: 'i',
		[`C#${octave[1]}`]: '9',
		[`D${octave[1]}`]: 'o',
		[`D#${octave[1]}`]: '0',
		[`E${octave[1]}`]: 'p',
		[`F${octave[1]}`]: 'z',
		[`F#${octave[1]}`]: 's',
		[`G${octave[1]}`]: 'x',
		[`G#${octave[1]}`]: 'd',
		[`A${octave[1]}`]: 'c',
		[`A#${octave[1]}`]: 'f',
		[`B${octave[1]}`]: 'v',
		[`C${octave[2]}`]: 'b',
		[`C#${octave[2]}`]: 'h',
		[`D${octave[2]}`]: 'n',
		[`D#${octave[2]}`]: 'j',
		[`E${octave[2]}`]: 'm',
		[`F${octave[2]}`]: ',',
		[`F#${octave[2]}`]: 'l',
		[`G${octave[2]}`]: '.',
		[`G#${octave[2]}`]: ';',
		[`A${octave[2]}`]: 'a',
		[`A#${octave[2]}`]: '4',
		[`B${octave[2]}`]: 'k'
	};

	function incrementOctave() {
		if (octave.toString() === '5,6,7') {
			return;
		}
		octave = octave.map((num) => {
			const incremented = Number(num) + 1;
			return incremented > 7 ? '7' : incremented.toString();
		});
	}

	function decrementOctave() {
		if (octave.toString() === '0,1,2') {
			return;
		}
		octave = octave.map((num) => {
			const decremented = Number(num) - 1;
			return decremented < 0 ? '0' : decremented.toString();
		});
	}

	function handleKeyPress(e: KeyboardEvent, note: string, type: string) {
		if (!e.repeat && KEYMAP[note] === e.key) {
			keyClick(note, type);
		}
	}
</script>

<svelte:window
	on:keypress={(e) => {
		if (!e.repeat && e.key === '-') {
			decrementOctave();
		}

		if (!e.repeat && e.key === '=') {
			incrementOctave();
		}
	}}
/>

<div
	class="grid min-h-screen grid-row-1 min-w-full text-primary-9 justify-center content-center p-4"
>
	{#if !hasAudioPermission}
		<button on:click={handleAudioPermissions}>Allow Sound</button>
	{/if}
	<button on:click={setRelease}>Set Release</button>
	{#if !peerCount}
		Finding Peers...
	{/if}

	<div class="rounded-container-token  grid-rows-1 grid bg-primary-9">
		<div
			class="flex items-center justify-between bg-primary-12 rounded-tl-container-token rounded-tr-container-token p-4"
		>
			<InstrumentSelect />
			<div class="flex flex-col items-start gap-1">
				<div class="text-sm font-light">Octave</div>
				<div class="flex items-center justify-center gap-2">
					<button class="material-symbols-rounded" on:click={decrementOctave}
						>do_not_disturb_on</button
					>

					<span> {octave[0]} </span>
					<button class="material-symbols-rounded" on:click={incrementOctave}>add_circle</button>
				</div>
			</div>
		</div>
		<div class="h-[300px] lg:h-[270px] overflow-x-auto md:px-5 w-full">
			<div class="flex h-full pb-12 lg:pb-8 min-w-max touch-none">
				{#each octave as octave}
					{#each notes as note}
						<PianoKey {handleKeyPress} {keyClick} note={note + octave} />
					{/each}
				{/each}
			</div>
		</div>
	</div>
</div>
