import { env } from "$env/dynamic/public";
import { get } from "svelte/store";
import {
  ENDPOINT_ADMIN_CHAT,
  ENDPOINT_ADMIN_CHATS,
  ENDPOINT_ADMIN_PROMPT,
  ENDPOINT_ADMIN_PROMPT_GET_SELECTED,
  ENDPOINT_ADMIN_PROMPT_IDS,
  ENDPOINT_ADMIN_PROMPT_NEW,
  ENDPOINT_ADMIN_PROMPT_SET_SELECTED,
  ENDPOINT_ADMIN_PROMPT_UPDATE,
} from "./endpoints";
import { st_authKey } from "./stores";
import type { Chat, Message, Prompt } from "./types";

// General

async function fetchGetJson(url: string): Promise<any> {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": env.PUBLIC_DEV_KEY,
      "x-auth-key": get(st_authKey),
    },
  });
  const data = await resp.json();
  console.log(data);
  return data;
}

async function fetchGetText(url: string): Promise<string> {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": env.PUBLIC_DEV_KEY,
      "x-auth-key": get(st_authKey),
    },
  });
  const data = await resp.text();
  return data;
}

async function fetchPost(url: string, body: any): Promise<void> {
  await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": env.PUBLIC_DEV_KEY,
      "x-auth-key": get(st_authKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// Specific
export async function fetchPromptIds(): Promise<string[]> {
  const url = ENDPOINT_ADMIN_PROMPT_IDS;
  return await fetchGetJson(url);
}

export async function fetchPrompt(promptId: string): Promise<Prompt> {
  const url = ENDPOINT_ADMIN_PROMPT(promptId);
  const prompt = await fetchGetJson(url);

  prompt.createdAt = new Date(prompt.createdAt);
  prompt.updatedAt = new Date(prompt.updatedAt);

  return prompt;
}

export async function insertPrompt(
  promptId: string,
  promptText: string
): Promise<void> {
  const url = ENDPOINT_ADMIN_PROMPT_NEW;
  const body = { prompt: promptText, promptId };
  await fetchPost(url, body);
}

export async function updatePrompt(
  promptId: string,
  promptText: string
): Promise<void> {
  const url = ENDPOINT_ADMIN_PROMPT_UPDATE;
  const body = { prompt: promptText, promptId };
  await fetchPost(url, body);
}

export async function fetchSelectedPromptId(): Promise<string> {
  const url = ENDPOINT_ADMIN_PROMPT_GET_SELECTED;
  return await fetchGetText(url);
}

export async function setSelectedPromptId(promptId: string): Promise<void> {
  const url = ENDPOINT_ADMIN_PROMPT_SET_SELECTED;
  const body = { promptId };
  await fetchPost(url, body);
}

export async function fetchChats(): Promise<Chat[]> {
  return await fetchGetJson(ENDPOINT_ADMIN_CHATS);
}

export async function fetchMessages(chatId: string): Promise<Message[]> {
  return await fetchGetJson(ENDPOINT_ADMIN_CHAT(chatId));
}
