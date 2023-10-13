<script lang="ts">
  import { fetchMessages } from "$lib/requests";
  import { st_chats, st_prompts } from "$lib/stores";
  import { MessageType, type Message } from "$lib/types";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import MsgElem from "./MsgElem.svelte";

  export let data: PageData;
  const chatId = data.slug;
  const chat = $st_chats[chatId];
  const promptText = $st_prompts[chat.promptId] || "";
  if (!promptText) {
    console.warn(`No prompt text for chat ${chatId}`);
  }

  let msgs: Message[];
  $: msgs = [];

  interface TokenTally {
    agent: number;
    user: number;
    input: number;
    output: number;
    costUsd: number;
  }

  let tokenTally: TokenTally;
  $: tokenTally = {
    agent: 0,
    user: 0,
    input: 0,
    output: 0,
    costUsd: 0,
  };

  function tokenCost(message: Message): number {
    // Hardcoded for models
    const COST_PER_TOKEN = {
      "gpt-4": {
        input: 0.001 * 0.03,
        output: 0.001 * 0.06,
      },
      "gpt-3.5-turbo": {
        input: 0.001 * 0.0015,
        output: 0.001 * 0.002,
      },
    };

    let costs = COST_PER_TOKEN["gpt-4"];
    if (message.type == MessageType.SUMMARIZER) {
      costs = COST_PER_TOKEN["gpt-3.5-turbo"];
    }

    return (
      message.tokenInputUsed * costs.input +
      message.tokenOutputUsed * costs.output
    );
  }

  onMount(async () => {
    msgs = await fetchMessages(chatId);

    // Tally-up tokens
    for (const msg of msgs) {
      const cost = tokenCost(msg);
      if (msg.type === MessageType.USER) {
        tokenTally.user += msg.tokenInputUsed;
      } else {
        tokenTally.agent += msg.tokenInputUsed;
      }

      // Note: different models are conflated here
      tokenTally.input += msg.tokenInputUsed;
      tokenTally.output += msg.tokenOutputUsed;

      tokenTally.costUsd += cost;
    }

    // TODO: show prompt text

    // const promptText = $st_prompts[chat.promptId] || "";
    // if (!promptText) {
    // console.warn(`No prompt text for chat ${chatId}`);
    // }
  });
</script>

<div class="">
  <!-- Chat Details -->
  <div class="p-10">
    <h1 class="text-lg mb-1">Chat <span class="font-bold">{chatId}</span></h1>
    <div class="flex flex-row">
      <pre class="text-xs rounded bg-gray-300 p-2">Tokens:
 Agent: {tokenTally.agent}
 User: {tokenTally.user}
 ---
 Input: {tokenTally.input}
 Output: {tokenTally.output}

Cost: ${tokenTally.costUsd.toFixed(2)}</pre>
    </div>
  </div>

  <!-- Messages -->
  {#if msgs}
    {#each msgs as msg, i}
      {#if i == 0}
        <MsgElem {msg} promptId={chat.promptId} />
      {:else}
        <MsgElem {msg} />
      {/if}
    {/each}
  {:else}
    <p>Loading...</p>
  {/if}
</div>
