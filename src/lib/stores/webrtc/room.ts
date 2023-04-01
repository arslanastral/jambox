import { writable } from 'svelte/store';
import { joinRoom } from 'trystero';
import type { InstrumentName } from '$lib/stores/tonejs/instruments';
import type { Room, ActionSender, ActionReceiver, ActionProgress } from 'trystero';
import { pick } from 'nexusui';

export type Action<T> = [ActionSender<T>, ActionReceiver<T>, ActionProgress];

export type NotesAction = {
	note: string;
	timestamp?: number;
	instrument: InstrumentName;
	isPressed: boolean;
};

type Peer = {
	id: string;
	emoji: string;
};

const emojis = ['🦁', '🐳', '🐵', '🐺', '😺', '🐶', '🦄'];

function createRoom(appId: string) {
	const { subscribe, set } = writable<Room | undefined>();
	const { subscribe: subscribePeerCount, update: updatePeerCount } = writable<number>(0);
	const { subscribe: subscribePeers, update: updatePeers } = writable<Peer[]>([]);

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
				updatePeers((p) => {
					const usedEmojis = p.map((p) => p.emoji);
					const unusedEmojis = emojis.filter((e) => !usedEmojis.includes(e));
					p.push({
						id: peerId,
						emoji: pick(...unusedEmojis)
					});
					return p;
				});
				updatePeerCount((n) => n + 1);
			});

			room.onPeerLeave((peerId) => {
				updatePeers((p) => {
					const filtered = p.filter((p) => p.id !== peerId);
					p = filtered;

					return p;
				});
				updatePeerCount((n) => n - 1);
			});
		},
		actions,
		peerCount: {
			subscribe: subscribePeerCount
		},
		peers: {
			subscribe: subscribePeers
		}
	};
}

export const room = createRoom('pianojam-xcvd');

export const peerCount = room.peerCount;
export const peers = room.peers;
