import { writable } from 'svelte/store';
import { joinRoom } from 'trystero';
import type { InstrumentName } from '$lib/stores/tonejs/instruments';
import type { Room, ActionSender, ActionReceiver, ActionProgress } from 'trystero';

export type Action<T> = [ActionSender<T>, ActionReceiver<T>, ActionProgress];

export type NotesAction = {
	note: string;
	timestamp?: number;
	instrument: InstrumentName;
	isPressed: boolean;
};

function createRoom(appId: string) {
	const { subscribe, set } = writable<Room | undefined>();
	const { subscribe: subscribePeerCount, update: updatePeerCount } = writable<number>(0);

	const peerNames: Record<string, string> = {};
	const actions: Record<string, Action<unknown>> = {};

	return {
		subscribe,
		join: (config: { roomId: string; roomActions: string[] }) => {
			const room = joinRoom({ appId }, config.roomId);

			set(room);

			config.roomActions.forEach((a) => {
				actions[a] = room.makeAction(a);
			});

			room.onPeerJoin((peerId) => {
				updatePeerCount((n) => n + 1);
				console.log(`${peerNames[peerId] || 'a weird stranger'} joined`);
			});

			room.onPeerLeave((peerId) => {
				updatePeerCount((n) => n - 1);
				console.log(`${peerNames[peerId] || 'a weird stranger'} left`);
				console.log(`${room?.getPeers().length} peers left`);
			});
		},
		actions,
		peerCount: {
			subscribe: subscribePeerCount
		}
	};
}

export const room = createRoom('pianojam-xcvd');

export const peerCount = room.peerCount;
