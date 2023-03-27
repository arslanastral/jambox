<script lang="ts">
	import { joinRoom } from 'trystero';
	import { start } from 'tone';
	import { onMount } from 'svelte';
	import { allInstruments, currentInstrument } from '$lib/stores/tonejs/instruments';
	import PianoKey from './PianoKey.svelte';
	import InstrumentSelect from './InstrumentSelect.svelte';
	import { fade } from 'svelte/transition';
	import { dial } from '$lib/actions/dial';

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

	function setRelease(value = 50) {
		instrument.release = value;
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

	const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	let octave = [3, 4, 5];
	const KEYS = [
		'q',
		'2',
		'w',
		'3',
		'e',
		'r',
		'5',
		't',
		'6',
		'y',
		'7',
		'u',
		'i',
		'9',
		'o',
		'0',
		'p',
		'z',
		's',
		'x',
		'd',
		'c',
		'f',
		'v',
		'b',
		'h',
		'n',
		'j',
		'm',
		',',
		'l',
		'.',
		';',
		'a',
		'4',
		'k'
	];

	function handleOctave(type: 'inc' | 'dec') {
		if (type === 'inc' && octave[octave.length - 1] !== 7) {
			octave = octave.map((num) => {
				const inc = num + 1;
				return inc;
			});
		}

		if (type === 'dec' && octave[0] !== 0) {
			octave = octave.map((num) => {
				const dec = num - 1;
				return dec;
			});
		}
	}
</script>

<svelte:window
	on:keypress={(e) => {
		if (!e.repeat && e.key === '-') {
			handleOctave('dec');
		}

		if (!e.repeat && e.key === '=') {
			handleOctave('inc');
		}
	}}
/>

<div
	class="grid min-h-screen grid-row-1 min-w-full text-primary-9 justify-center content-center p-4"
>
	{#if !peerCount}
		Finding Peers...
	{/if}

	<div class="rounded-container-token relative grid-rows-1 grid bg-primary-9">
		<div
			class="flex items-center justify-between bg-primary-12 rounded-tl-container-token rounded-tr-container-token p-4"
		>
			<InstrumentSelect />
			<div class="flex flex-col items-center gap-1">
				<div use:dial={setRelease} />
			</div>

			<div class="flex flex-col items-start gap-1">
				<div class="text-sm font-light">Octave</div>
				<div class="flex items-center justify-center gap-2">
					<button class="material-symbols-rounded" on:click={() => handleOctave('dec')}
						>do_not_disturb_on</button
					>

					<span> {octave[0]} </span>
					<button class="material-symbols-rounded" on:click={() => handleOctave('inc')}
						>add_circle</button
					>
				</div>
			</div>
		</div>
		<div class="h-[300px] lg:h-[270px] overflow-x-auto md:px-5 w-full">
			<div class="flex h-full pb-12 lg:pb-8 min-w-max touch-pan-x">
				{#each octave as octave, o}
					{#each notes as note, n}
						<PianoKey {keyClick} note={note + octave} keybind={KEYS[o * notes.length + n]} />
					{/each}
				{/each}
			</div>
		</div>

		{#if !hasAudioPermission}
			<div
				out:fade={{ duration: 200 }}
				class=" bg-primaryA-8 flex items-center justify-center rounded-container-token absolute inset-0 z-30"
			>
				<button
					class="bg-primary-1 relative shadow-lg hover:animate-none transition-all ease-in-out duration-200 z-50 flex items-center gap-1 text-primary-12 p-3 rounded-full"
					on:click={handleAudioPermissions}
				>
					<span class="absolute bg-primary-2 rounded-full z-30 animate-ping inset-0" />
					<span class="material-symbols-rounded z-40 text-primary"> music_note </span>
					<span class="z-40"> Allow Sound </span>
				</button>
			</div>
		{/if}
	</div>
</div>
