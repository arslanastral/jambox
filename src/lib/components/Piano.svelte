<script lang="ts">
	import { start, Destination, Midi } from 'tone';
	import { allInstruments, currentInstrument } from '$lib/stores/tonejs/instruments';
	import PianoKey from './PianoKey.svelte';
	import InstrumentSelect from './InstrumentSelect.svelte';
	import { fade } from 'svelte/transition';
	import { dial } from '$lib/actions/dial';
	import { room, activeKeys, selfId } from '$lib/stores/webrtc/room';
	import type { Action, NotesAction } from '$lib/stores/webrtc/room';
	import { page } from '$app/stores';
	import Header from './common/Header.svelte';
	import { midiInputs, selectedMidiInput } from '$lib/stores/midi';
	import { tooltip } from '$lib/actions/tooltip';

	let hasAudioPermission = false;
	let roomId = $page.params.id;

	$: selectedInstrument = $allInstruments[$currentInstrument];

	export let sendNote: Action<NotesAction>[0] | undefined = undefined;
	export let receiveNote: Action<NotesAction>[1] | undefined = undefined;

	function handleNote({ note, instrument, isPressed, id, velocity }: NotesAction) {
		if (isPressed) {
			$allInstruments[instrument].triggerAttack(note, undefined, velocity);
			$activeKeys = [...$activeKeys, { note, id }];
		} else {
			$allInstruments[instrument].triggerRelease(note);
			$activeKeys = $activeKeys.filter((n) => n.note !== note);
		}

		const startTimestamp = Date.now();
		if (roomId && sendNote) {
			sendNote({ note, timestamp: startTimestamp, isPressed, instrument, id });
		}
	}

	function setRelease(value = 50) {
		Destination.volume.value = -10;
		selectedInstrument.release = value;
	}

	navigator
		.requestMIDIAccess()
		.then((midiAccess) => {
			const inputs = midiAccess.inputs.values();

			for (let input of inputs) {
				$midiInputs?.push(input);
			}
			$selectedMidiInput = $midiInputs[0];

			if ($selectedMidiInput) {
				$selectedMidiInput.onmidimessage = ((e: MIDIMessageEvent) => {
					const [status, note, velocity] = e.data;

					const toneVelocity = velocity / 127;
					if (status === 0x90 || status === 0x9f) {
						// note on
						handleNote({
							note: Midi(note).toNote(),
							velocity: toneVelocity,
							id: selfId,
							instrument: $currentInstrument,
							isPressed: true
						});
					} else if (status === 0x80 || status === 0x8f) {
						// note off
						handleNote({
							note: Midi(note).toNote(),
							id: selfId,
							instrument: $currentInstrument,
							isPressed: false
						});
					}
				}) as (this: MIDIInput, ev: Event) => any;

				$selectedMidiInput.onstatechange = (e) => {
					console.log(e);
					const port = e.target as MIDIInput;
					console.log(`MIDI input ${port.name} state changed: ${port.state}`);
					if (port.state === 'disconnected') {
						$midiInputs = $midiInputs.filter(({ name }) => {
							if (port.name) {
								name !== port.name || !name?.includes(port.name);
							}
						});

						if ($selectedMidiInput?.name === port.name) {
							$selectedMidiInput = null;
						}
					}

					if (port.state === 'connected') {
						const exists = $midiInputs.find((m) => m.name === port.name);

						if (exists?.name !== port.name) {
							$midiInputs.push(port);
							$selectedMidiInput = port;
						}
					}
				};
			}
		})
		.catch((error) => {
			console.log('Failed to get MIDI access', error);
		});

	if (roomId && receiveNote) {
		receiveNote((data, peerId) => {
			const endTimestamp = Date.now();
			const latency = data.timestamp ? endTimestamp - data.timestamp + 'ms' : 'unknown';

			const { isPressed, note, instrument, id } = data;

			if (isPressed) {
				$allInstruments[instrument].triggerAttack(note);
				$activeKeys = [...$activeKeys, { note, id }];
			} else {
				$allInstruments[instrument].triggerRelease(note);
				$activeKeys = $activeKeys.filter((n) => n.note !== note);
			}

			console.log(
				`Note: ${data.note} , Direction: ${isPressed ? ' down' : ' up'} Latency: ${latency}`
			);
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
	class="grid h-screen grid-rows-[auto_1fr] bg-primary-9 dark:bg-primary-1 lg:bg-inherit min-w-full overflow-hidden text-primary-9 justify-center lg:p-4"
>
	<Header />

	<div
		class="lg:rounded-container-token max-h-[350px] max-w-[1048px] justify-self-center h-full self-center relative grid grid-rows-[auto_1fr] bg-primary-9 dark:bg-primary-3"
	>
		<div
			class="flex items-center justify-between bg-primary-12 dark:bg-primary-3 lg:rounded-tl-container-token lg:rounded-tr-container-token p-2 lg:p-4 flex-wrap"
		>
			<InstrumentSelect />

			<div class="flex items-center gap-5">
				<div use:tooltip={'Release'} class="flex items-center order-1">
					<div use:dial={setRelease} />
				</div>

				<div class="flex flex-col">
					<div class="text-sm font-light">Octave</div>
					<div class="flex items-center justify-center gap-2">
						<button
							use:tooltip={'Decrease Octave'}
							class="material-symbols-rounded text-lg"
							on:click={() => handleOctave('dec')}>do_not_disturb_on</button
						>

						<span class="text-sm"> {octave[0]} </span>
						<button
							use:tooltip={'Increase Octave'}
							class="material-symbols-rounded text-lg"
							on:click={() => handleOctave('inc')}>add_circle</button
						>
					</div>
				</div>
			</div>
		</div>
		<div class="overflow-x-auto lg:px-5 w-full">
			<div class="flex h-full pb-10 lg:pb-6 min-w-max scrollstrip lg:!bg-none touch-pan-x">
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
				class=" bg-primaryA-8 flex items-center justify-center lg:rounded-container-token absolute inset-0 z-30"
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

<style>
	.scrollstrip {
		background-image: radial-gradient(
			circle at 10px 10px,
			var(--color-primary-11) 1px,
			transparent 0
		);
		background-size: 10px 10px;
	}
</style>
