import { writable } from "svelte/store";

// Simcir Stores
export const simcir = writable({});
export const simcirDiv = writable({});

// DialogueBox Stores
export const isRegisterDeviceDialogueBoxOpen = writable(false);
export const isUnregisterDeviceDialogueBoxOpen = writable(false);
export const isNewDeviceDialogueBoxOpen = writable(false);