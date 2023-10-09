<script lang="ts">
  import { fetchChats, fetchPrompt } from "$lib/requests";
  import { st_chats, st_prompts, st_showDev } from "$lib/stores";
  import type { Chat } from "$lib/types";
  import { onMount } from "svelte";
  import ChatElem from "../ChatElem.svelte";

  function groupChatsByDay(chats: Chat[]): Record<string, Chat[]> {
    return chats.reduce<Record<string, Chat[]>>((acc, chat) => {
      const day = chat.timeCreated.split("T")[0];
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(chat);
      return acc;
    }, {});
  }

  let chatGroups: Record<string, Chat[]>;
  $: chatGroups = {};
  onMount(async () => {
    const chats = await fetchChats();
    for (const chat of chats) {
      $st_chats[chat.id] = chat;
    }
    $st_chats = $st_chats;

    chatGroups = groupChatsByDay(chats);

    // Fetch used prompts for token calc
    const promptIds = new Set<string>();
    chats.forEach((chat) => {
      promptIds.add(chat.promptId);
    });
    promptIds.forEach(async (promptId) => {
      const prompt = await fetchPrompt(promptId);
      $st_prompts[promptId] = prompt.text;
      $st_prompts = $st_prompts;
    });
  });

  function groupSortOrder(chatGroups: Record<string, Chat[]>) {
    return Object.keys(chatGroups).sort((a, b) => {
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
    {#if Object.keys(chatGroups).length == 0}
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
        {#each groupSortOrder(chatGroups) as dayStr}
          <div class="text-sm font-bold mt-4">
            {dayStr === dayStringToday
              ? "Today"
              : dayStr === dayStringYesterday
              ? "Yesterday"
              : dayStr}
          </div>
          {#each chatGroups[dayStr] as chat}
            <ChatElem {chat} />
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
