<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { ENDPOINT_ADMIN_CHAT } from "$lib/endpoints";
  import type { Message } from "$lib/types";
  import type { PageData } from "./$types";
  import MsgElem from "./MsgElem.svelte";

  export let data: PageData;
  const convoId = data.slug;

  async function getMessages(chatId: string): Promise<Message[]> {
    const resp = await fetch(ENDPOINT_ADMIN_CHAT(chatId), {
      method: "GET",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
      },
    });
    const data = await resp.json();
    return data;
  }
</script>

<div class="">
  {#await getMessages(convoId)}
    <p>Loading...</p>
  {:then msgs}
    {#each msgs as msg}
      <MsgElem {msg} />
    {/each}
  {/await}
</div>
