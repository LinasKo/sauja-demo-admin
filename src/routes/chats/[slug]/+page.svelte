<script lang="ts">
  import { ENDPOINT_ADMIN_CHAT } from "$lib/endpoints";
  import { fetchGetJson } from "$lib/requests";
  import type { Message } from "$lib/types";
  import type { PageData } from "./$types";
  import MsgElem from "./MsgElem.svelte";

  export let data: PageData;
  const convoId = data.slug;

  async function getMessages(chatId: string): Promise<Message[]> {
    return await fetchGetJson(ENDPOINT_ADMIN_CHAT(chatId));
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
