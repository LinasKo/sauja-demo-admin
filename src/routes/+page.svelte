<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { st_showDev } from "$lib/stores";
  import type { Convo, Message } from "$lib/types";
  import ConvoElem from "./ConvoElem.svelte";

  async function getConversations(): Promise<Convo[]> {
    const endpoint = `${env.PUBLIC_BACKEND_URL}/admin/conversations`;
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

<div class="p-10">
  <h1 class="text-lg font-bold">Recorded conversations:</h1>
  <div class="">
    {#await getConversations()}
      <p>Loading...</p>
    {:then convos}
      <!-- Inputs -->
      <div class="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="show-dev"
          name="show-dev"
          class="w-4 h-4"
          bind:checked={$st_showDev}
        />
        <label for="show-dev">Show dev</label>
      </div>

      <!-- Conversations -->
      <ul class="flex flex-col gap-1 mt-4">
        {#each convos as convo}
          <ConvoElem {convo} />
        {/each}
      </ul>
    {:catch error}
      <p>{error.message}</p>
    {/await}
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
