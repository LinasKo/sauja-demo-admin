import { env } from "$env/dynamic/public";

const url = env.PUBLIC_BACKEND_URL;

export const ENDPOINT_ADMIN_CHATS = `${url}/admin/chats`;
export const ENDPOINT_ADMIN_CHAT = (chatId: string) =>
  `${url}/admin/messages/${chatId}`;

export const ENDPOINT_ADMIN_PROMPT_IDS = `${url}/admin/prompts`;
export const ENDPOINT_ADMIN_PROMPT = (promptId: string) =>
  `${url}/admin/prompts/${promptId}`;

export const ENDPOINT_ADMIN_PROMPT_NEW = `${url}/admin/prompts_edit/new`;
export const ENDPOINT_ADMIN_PROMPT_UPDATE = `${url}/admin/prompts_edit/update`;
export const ENDPOINT_ADMIN_PROMPT_SET_SELECTED = `${url}/admin/prompt_main/set_selected`;
export const ENDPOINT_ADMIN_PROMPT_GET_SELECTED = `${url}/admin/prompt_main/get_selected`;
