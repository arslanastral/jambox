import { writable } from 'svelte/store';

export const midiInputs = writable<MIDIInput[]>([]);
export const selectedMidiInput = writable<MIDIInput>();
