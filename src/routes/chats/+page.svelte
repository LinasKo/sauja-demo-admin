<script lang="ts">
  import { ENDPOINT_ADMIN_CHATS } from "$lib/endpoints";
  import { fetchGetJson } from "$lib/requests";
  import { st_showDev } from "$lib/stores";
  import type { Chat } from "$lib/types";
  import { onMount } from "svelte";
  import ChatElem from "../ChatElem.svelte";

  async function getChats(): Promise<Chat[]> {
    return await fetchGetJson(ENDPOINT_ADMIN_CHATS);
  }

  function groupChatsByDay(convos: Chat[]): Record<string, Chat[]> {
    return convos.reduce<Record<string, Chat[]>>((acc, convo) => {
      const day = convo.timeCreated.split("T")[0];
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(convo);
      return acc;
    }, {});
  }

  let convoGroups: Record<string, Chat[]>;
  $: convoGroups = {};
  onMount(async () => {
    const convos = await getChats();
    convoGroups = groupChatsByDay(convos);
  });

  function groupSortOrder(convoGroups: Record<string, Chat[]>) {
    return Object.keys(convoGroups).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }

  const dayStringToday = new Date().toISOString().split("T")[0];
  const dayStringYesterday = new Date(
    new Date().getTime() - 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];
</script>

<div class="p-10">
  <h1 class="text-lg font-bold">Recorded chats:</h1>
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

      <!-- Chats -->
      <ul class="flex flex-col gap-1 mt-4">
        {#each groupSortOrder(convoGroups) as dayStr}
          <div class="text-sm font-bold mt-4">
            {dayStr === dayStringToday
              ? "Today"
              : dayStr === dayStringYesterday
              ? "Yesterday"
              : dayStr}
          </div>
          {#each convoGroups[dayStr] as convo}
            <ChatElem {convo} />
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
