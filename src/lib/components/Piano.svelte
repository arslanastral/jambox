<script lang="ts">
	import { db } from '$lib/utils/firebase';
	import {
		collection,
		addDoc,
		setDoc,
		updateDoc,
		doc,
		onSnapshot,
		getDoc
	} from 'firebase/firestore';

	import { onMount } from 'svelte';

	const whiteKeyClasses =
		'bg-primary-1 border-b-4 border-r border-primary-5 rounded-b h-[calc(100%+4px)] w-11 hover:bg-primary-4 active:bg-primary-5 transition-colors duration-300 ease-in-out';
	const blackKeyClasses = 'bg-primary-12 h-40 w-6 rounded-b -ml-3 -mr-3 z-10';

	const servers = {
		iceServers: [
			{
				urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
			}
		],
		iceCandidatePoolSize: 10
	};

	const pc = new RTCPeerConnection(servers);

	const dataChannel = pc.createDataChannel('pianojam');

	pc.addEventListener('datachannel', (event) => {
		console.log('Event FROM datachannel event', event);
		const dataChannel = event.channel;

		dataChannel.onerror = (error) => {
			console.log('Data Channel Error:', error);
		};

		dataChannel.onmessage = (event) => {
			console.log('Got Data Channel Message:', event.data);
		};

		dataChannel.addEventListener('open', (event) => {
			console.log(event);
			console.log('STATE', dataChannel.readyState);
			console.log('voila');
			dataChannel.send('Hello World!');
		});

		dataChannel.onopen = () => {
			dataChannel.send('Hello World!');
		};

		dataChannel.onclose = (e) => {
			console.log('close event', e);
			console.log('STATE', dataChannel.readyState);
			console.log('The Data Channel is Closed');
		};
	});

	onMount(async () => {
		let roomId = crypto.randomUUID();

		if (window.location.hash) {
			let id = window.location.hash.substring(1);

			const roomDoc = doc(db, 'rooms', id);
			const offerCandidates = collection(roomDoc, 'offerCandidates');
			const answerCandidates = collection(roomDoc, 'answerCandidates');
			let roomData = (await getDoc(roomDoc)).data();

			pc.onicecandidate = async (event) => {
				console.log('ice trigger with hash');
				event.candidate && (await addDoc(answerCandidates, event.candidate.toJSON()));
			};

			const offerDescription = roomData?.offer;
			await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

			const answerDescription = await pc.createAnswer();
			await pc.setLocalDescription(answerDescription);

			const answer = {
				type: answerDescription.type,
				sdp: answerDescription.sdp
			};

			await updateDoc(roomDoc, { answer });

			onSnapshot(offerCandidates, (snapshot) => {
				snapshot.docChanges().forEach(async (change) => {
					if (change.type === 'added') {
						let data = change.doc.data();
						pc.addIceCandidate(new RTCIceCandidate(data));
					}
				});
			});
		}

		if (!window.location.hash) {
			window.location.hash = roomId;

			const roomDoc = doc(db, 'rooms', roomId);
			const offerCandidates = collection(roomDoc, 'offerCandidates');
			const answerCandidates = collection(roomDoc, 'answerCandidates');

			pc.onicecandidate = async (event) => {
				console.log('ice trigger with no hash');
				event.candidate && (await addDoc(offerCandidates, event.candidate.toJSON()));
			};

			// Create offer
			const offerDescription = await pc.createOffer();
			await pc.setLocalDescription(offerDescription);

			const offer = {
				sdp: offerDescription.sdp,
				type: offerDescription.type
			};

			await setDoc(roomDoc, { offer });

			onSnapshot(doc(db, 'rooms', roomId), (snapshot) => {
				const data = snapshot.data();
				if (!pc.currentRemoteDescription && data?.answer) {
					const answerDescription = new RTCSessionDescription(data.answer);
					pc.setRemoteDescription(answerDescription);
				}
			});

			onSnapshot(answerCandidates, (snapshot) => {
				snapshot.docChanges().forEach(async (change) => {
					if (change.type === 'added') {
						const candidate = new RTCIceCandidate(change.doc.data());
						pc.addIceCandidate(candidate);
					}
				});
			});
		}
	});

	function keyClick() {
		dataChannel.send('Click...');
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
