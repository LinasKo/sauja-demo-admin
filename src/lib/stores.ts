import { writable } from "svelte/store";
import type { Chat } from "./types";

export const st_showDev = writable<boolean>(true);
export const st_selectedPromptId = writable<string>("");
export const st_authKey = writable<string>("");

// Cache known token texts when computing tokens
export const st_chats = writable<Record<string, Chat>>({});
export const st_prompts = writable<Record<string, string>>({});
