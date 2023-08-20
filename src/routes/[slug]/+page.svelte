<script lang="ts">
  import { env } from "$env/dynamic/public";
  import type { Message } from "$lib/types";
  import type { PageData } from "./$types";
  import MsgElem from "./MsgElem.svelte";

  export let data: PageData;
  const convoId = data.slug;

  async function getMessages(conversationId: string): Promise<Message[]> {
    const endpoint = `${env.PUBLIC_BACKEND_URL}/admin/messages/${conversationId}`;
    const resp = await fetch(endpoint, {
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
