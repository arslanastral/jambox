<script lang="ts">
	import { start } from 'tone';
	import {
		allInstruments,
		currentInstrument,
		type InstrumentName
	} from '$lib/stores/tonejs/instruments';
	import PianoKey from './PianoKey.svelte';
	import InstrumentSelect from './InstrumentSelect.svelte';
	import { fade } from 'svelte/transition';
	import { dial } from '$lib/actions/dial';
	import { room, peers } from '$lib/stores/webrtc/room';
	import type { Action, NotesAction } from '$lib/stores/webrtc/room';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { clickToCopy } from '$lib/actions/copy';
	import Modal from './common/Modal.svelte';
	import Peers from './common/Peers.svelte';
	import Logo from './common/Logo.svelte';

	let hasAudioPermission = false;
	let roomId = $page.params.id;

	let selectedInstrument = $allInstruments[$currentInstrument];

	function setRelease(value = 50) {
		selectedInstrument.release = value;
	}

	export let sendNote: Action<NotesAction>[0];
	export let receiveNote: Action<NotesAction>[1];

	function handleNote({ note, instrument, isPressed }: NotesAction) {
		isPressed
			? $allInstruments[instrument].triggerAttack(note)
			: $allInstruments[instrument].triggerRelease(note);
		const startTimestamp = Date.now();
		if (roomId) {
			sendNote({ note, timestamp: startTimestamp, isPressed, instrument });
		}
	}

	if (roomId) {
		receiveNote((data, peerId) => {
			const endTimestamp = Date.now();
			const latency = data.timestamp ? endTimestamp - data.timestamp + 'ms' : 'unknown';

			const { isPressed, note, instrument } = data;
			isPressed
				? $allInstruments[instrument].triggerAttack(note)
				: $allInstruments[instrument].triggerRelease(note);
			console.log(`Note: ${data.note} , Latency: ${latency}`);
		});
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

	function handleRoomJoin() {
		goto('/rooms/' + crypto.randomUUID());
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
	class="grid min-h-screen grid-row-1 min-w-full text-primary-9 justify-center content-around p-4"
>
	<div class="flex items-center justify-between">
		<Logo />

		<Peers />

		<div class="flex items-center gap-4">
			{#if roomId}
				<Modal />
				<button
					use:clickToCopy={{ text: $page.url.href }}
					class="px-4 py-2 ring-2 ring-primary-4 bg-primary-3 flex items-center gap-2 rounded-full"
				>
					<span class="material-symbols-rounded">content_copy</span> Copy Link</button
				>
			{:else}
				<button on:click={handleRoomJoin} class="px-4 py-3 bg-black text-white rounded-full"
					>+ Create Room</button
				>
			{/if}
		</div>
	</div>

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
						<PianoKey {handleNote} note={note + octave} keybind={KEYS[o * notes.length + n]} />
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
					class="bg-primary-1 relative shadow-lg hover:animate-none transition-all ease-in-out duration-200 z-30 flex items-center gap-1 text-primary-12 p-3 rounded-full"
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
