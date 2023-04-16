<script>
	import { page } from '$app/stores';
	import ActionButton from './ActionButton.svelte';
	import Logo from './Logo.svelte';
	import ShareModal from './ShareModal.svelte';
	import Peers from './Peers.svelte';
	import { room } from '$lib/stores/webrtc/room';
	import { goto } from '$app/navigation';
	import DarkModeToggle from '../UX/DarkModeToggle.svelte';
	import Menu from './Menu.svelte';

	function handleRoomJoin() {
		goto('/rooms/' + crypto.randomUUID());
	}
</script>

<div class="grid grid-cols-3 gap-y-5 p-2 self-start">
	<Logo />
	<Peers />
	<div class="flex items-center gap-1 col-span-2 xs:col-span-1 justify-self-end">
		<DarkModeToggle />
		<Menu />
		{#if $page.params.id}
			<ShareModal />
		{:else}
			<button
				on:click={handleRoomJoin}
				class="px-4 py-2 flex items-center gap-1 text-base bg-primary-11 text-primary-5 font-light rounded-full"
				><span class="material-symbols-rounded"> magic_button </span>Join Room</button
			>
		{/if}
	</div>
</div>
