<script lang="ts">
	import P2PCF from 'p2pcf';
	import * as Tone from 'tone';

	import { onMount } from 'svelte';

	const whiteKeyClasses =
		'bg-primary-1 border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-11 hover:bg-primary-4 active:bg-primary-5 transition-colors duration-300 ease-in-out';
	const blackKeyClasses = 'bg-primary-12 h-40 w-6 rounded-b -ml-3 -mr-3 z-10';

	const client_id = 'MyUsername';
	const room_id = 'MyRoom';

	let peerid = '';
	let hasAudioPermission = false;

	const p2pcf = new P2PCF(client_id, room_id, {
		workerUrl: 'https://peers.pianojam.workers.dev/'
	});

	onMount(async () => {
		p2pcf.start();

		p2pcf.on('peerconnect', (peer) => {
			peerid = peer.id;
			console.log('New peer:', peer.id, peer.client_id);
		});

		p2pcf.on('peerclose', (peer) => {
			console.log('peer closed');
			peerid = '';
			// Peer has disconnected
		});

		p2pcf.on('msg', (peer, data) => {
			const decoder = new TextDecoder();
			const jsonString = decoder.decode(data);
			const obj = JSON.parse(jsonString);
			const endTimestamp = Date.now();
			const latency = endTimestamp - obj.timestamp;
			synth.triggerAttackRelease(obj.key, '4n', latency);

			const toneTime = Tone.now();

			console.log(`Note: ${obj.key} , Latency: ${latency}ms ,Tone.Now(): ${toneTime}`);
		});
	});

	const synth = new Tone.Synth().toDestination();

	function keyClick(key: string) {
		synth.triggerAttackRelease(key, '4n');
		const startTimestamp = Date.now();
		const obj = { key, timestamp: startTimestamp };
		const encoder = new TextEncoder();
		const arrayBuffer = encoder.encode(JSON.stringify(obj)).buffer;

		p2pcf.broadcast(arrayBuffer);
	}

	function handleToneStart() {
		Tone.start();
		hasAudioPermission = true;
	}
</script>

<div
	class="grid min-h-screen grid-row-1 min-w-full text-primary-9 justify-center content-center p-4"
>
	{#if !hasAudioPermission}
		<button on:click={handleToneStart}>Allow Sound</button>
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
