import { env } from "$env/dynamic/public";
import { get } from "svelte/store";
import { st_authKey } from "./stores";

export async function fetchGetJson(url: string): Promise<any> {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": env.PUBLIC_DEV_KEY,
      "x-auth-key": get(st_authKey),
    },
  });
  const data = await resp.json();
  return data;
}

export async function fetchGetText(url: string): Promise<string> {
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

export async function fetchPost(url: string, body: any): Promise<void> {
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
