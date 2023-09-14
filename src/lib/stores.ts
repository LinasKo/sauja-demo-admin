import { writable } from "svelte/store";

export const st_showDev = writable(true);
export const st_selectedPromptId = writable("");
export const st_authKey = writable("");
