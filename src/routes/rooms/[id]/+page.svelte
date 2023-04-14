<script lang="ts">
	import { page } from '$app/stores';
	import Piano from '$lib/components/Piano.svelte';
	import { room } from '$lib/stores/webrtc/room';
	import type { Action, NotesAction } from '$lib/stores/webrtc/room';

	room.join({ roomId: $page.params.id, roomActions: ['notes', 'profile', 'error'] });
	const [sendNote, receiveNote] = room.actions.notes as Action<NotesAction>;
</script>

<svelte:head>
	<title>JAMBOX 🎺 #{$page.params.id.slice(0, 6)}</title>
</svelte:head>

<Piano {sendNote} {receiveNote} />
