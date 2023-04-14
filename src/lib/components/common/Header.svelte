<script>
	import { page } from '$app/stores';
	import { clickToCopy } from '$lib/actions/copy';
	import ActionButton from './ActionButton.svelte';
	import Logo from './Logo.svelte';
	import Modal from './Modal.svelte';
	import Peers from './Peers.svelte';
	import { room } from '$lib/stores/webrtc/room';
	import { goto } from '$app/navigation';

	function handleRoomJoin() {
		goto('/rooms/' + crypto.randomUUID());
	}
</script>

<div class="grid grid-cols-3 gap-y-5 bg-primary-9 lg:bg-inherit p-2 self-start">
	<Logo />
	<Peers />
	<div class="flex items-center gap-2 col-span-2 xs:col-span-1 justify-self-end">
		{#if $page.params.id}
			<ActionButton on:click={() => room.exit()} icon="door_back" />
			<Modal />
			<button
				use:clickToCopy={{ text: $page.url.href }}
				class="material-symbols-rounded text-primary-1 lg:text-primary-9 w-8 h-8 flex items-center justify-center rounded-full"
			>
				content_copy
			</button>
		{:else}
			<button
				on:click={handleRoomJoin}
				class="px-4 py-3 text-sm bg-primary-11 text-white font-light rounded-full"
				>+ New Room</button
			>
		{/if}
	</div>
</div>
