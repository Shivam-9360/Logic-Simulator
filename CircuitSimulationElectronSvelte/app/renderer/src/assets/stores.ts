import { writable } from "svelte/store";

// DialogueBox Stores
export const isRegisterDeviceDialogueBoxOpen = writable(false);
export const isUnregisterDeviceDialogueBoxOpen = writable(false);
export const isNewDeviceDialogueBoxOpen = writable(false);