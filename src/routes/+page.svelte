<script lang="ts">
  import { onMount } from "svelte";
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

  function groupConversationsByDay(convos: Convo[]): Record<string, Convo[]> {
    return convos.reduce<Record<string, Convo[]>>((acc, convo) => {
      const day = convo.timeCreated.split("T")[0];
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(convo);
      return acc;
    }, {});
  }

  let convoGroups: Record<string, Convo[]>;
  $: convoGroups = {};
  onMount(async () => {
    const convos = await getConversations();
    convoGroups = groupConversationsByDay(convos);
  });

  function groupSortOrder(convoGroups: Record<string, Convo[]>) {
    return Object.keys(convoGroups).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }
</script>

<div class="p-10">
  <h1 class="text-lg font-bold">Recorded conversations:</h1>
  <div class="">
    {#if Object.keys(convoGroups).length == 0}
      <p>Loading...</p>
    {:else}
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
        {#each groupSortOrder(convoGroups) as dayStr}
          <div class="text-sm font-bold">{dayStr}</div>
          {#each convoGroups[dayStr] as convo}
            <ConvoElem {convo} />
          {/each}
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
