import { get, writable } from 'svelte/store';
import { joinRoom, selfId } from 'trystero';
import { PUBLIC_APPID } from '$env/static/public';
import { allInstruments } from '$lib/stores/tonejs/instruments';
import type { InstrumentName } from '$lib/stores/tonejs/instruments';
import type { Room, ActionSender, ActionReceiver, ActionProgress } from 'trystero';
import { pick } from 'nexusui';
import { goto } from '$app/navigation';

export type Action<T> = [ActionSender<T>, ActionReceiver<T>, ActionProgress];

type PeerProfile = {
	id: string;
	emoji: 'string';
	joined: number;
};

export type NotesAction = {
	note: string | number;
	velocity?: number;
	timestamp?: number;
	instrument: InstrumentName;
	isPressed: boolean;
	id: PeerProfile['id'];
};

type ActiveNote = {
	note: string | number;
	id?: NotesAction['id'];
};

type PeerError = EmojiError;

type EmojiError = {
	scope: 'emoji';
	reason: 'collision';
	available: string[];
};

const emojis = [
	'🦁',
	'🐳',
	'🐵',
	'🐺',
	'😺',
	'🐶',
	'🦄',
	'🦊',
	'🐻',
	'🐮',
	'🐼',
	'🐹',
	'🐨',
	'🐰',
	'🐯',
	'🐸'
];

function createRoom(appId: string) {
	const { subscribe, set } = writable<Room | undefined>();
	const { subscribe: subscribePeers, update: updatePeers } = writable<PeerProfile[]>([]);

	const actions: Record<string, Action<unknown>> = {};
	let room: Room;

	return {
		subscribe,
		join: (config: { roomId: string; roomActions: string[] }) => {
			room = joinRoom({ appId }, config.roomId);

			set(room);

			config.roomActions.forEach((a) => {
				actions[a] = room.makeAction(a);
			});

			const [sendProfile, receiveProfile] = actions.profile as Action<PeerProfile>;
			const [sendError, receiveError] = actions.error as Action<PeerError>;
			const [sendInstrument, receiveInstrument] = actions.instrument as Action<
				InstrumentName | InstrumentName[]
			>;

			const randomEmoji = pick(...emojis);

			const selfProfile = { id: selfId, emoji: randomEmoji, joined: Date.now() };

			updatePeers((p) => {
				p.push(selfProfile);
				return p;
			});

			room.onPeerJoin((peerId) => {
				sendProfile(selfProfile, peerId);
				sendInstrument(Object.keys(get(allInstruments)) as InstrumentName[]);
			});

			receiveProfile((data, peerId) => {
				updatePeers((p) => {
					const collision = p.find((p) => p.emoji === data.emoji);

					if (collision && collision?.joined < data.joined) {
						const availableEmojis = emojis.filter((e) => !p.some((p) => p.emoji === e));

						sendError(
							{
								scope: 'emoji',
								reason: 'collision',
								available: availableEmojis
							},
							peerId
						);
					} else {
						p.push(data);
					}

					return p;
				});
			});

			receiveError(({ reason, available }, peerId) => {
				if (reason === 'collision') {
					selfProfile.emoji = pick(...available);
					updatePeers((p) => {
						const filtered = p.filter((p) => p.id !== selfProfile.id);
						filtered.push(selfProfile);
						p = filtered;
						return p;
					});
					sendProfile(selfProfile, peerId);
				}
			});

			receiveInstrument((name) => {
				if (Array.isArray(name)) {
					name.forEach((n) => allInstruments.add(n));
				} else {
					allInstruments.add(name);
				}
			});

			room.onPeerLeave((peerId) => {
				updatePeers((p) => {
					const filtered = p.filter((p) => p.id !== peerId);
					p = filtered;

					return p;
				});
			});
		},
		exit: () => {
			room.leave();
			updatePeers((p) => {
				p = [];
				return p;
			});
			goto('/');
		},
		actions,
		peers: {
			subscribe: subscribePeers
		}
	};
}

export const room = createRoom(PUBLIC_APPID);
export const peers = room.peers;
export const activeKeys = writable<ActiveNote[]>([]);
export { selfId };
export { ActionSender, ActionReceiver };
