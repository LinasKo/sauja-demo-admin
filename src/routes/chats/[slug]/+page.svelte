<script lang="ts">
  import { fetchMessages } from "$lib/requests";
  import { st_chats, st_prompts } from "$lib/stores";
  import { Author, type Message } from "$lib/types";
  import { encoding_for_model } from "@dqbd/tiktoken";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import MsgElem from "./MsgElem.svelte";

  export let data: PageData;
  const chatId = data.slug;
  const chat = $st_chats[chatId];

  let msgs: Message[];
  $: msgs = [];

  interface TokenCount {
    sys: number;
    agent: number;
    user: number;
    input: number;
    output: number;
  }

  let tokenCount: TokenCount;
  $: tokenCount = {
    sys: 0,
    agent: 0,
    user: 0,
    input: 0,
    output: 0,
  };

  /** Relies on stores, but otherwise independent */
  function computeTokens(messages: Message[]): TokenCount {
    const tokenCount: TokenCount = {
      sys: 0,
      agent: 0,
      user: 0,
      input: 0,
      output: 0,
    };

    const encoding = encoding_for_model("gpt-4");

    let tokenCountSoFar = 0;
    messages.forEach((msg) => {
      const msgTokenCount = encoding.encode(msg.content).length;
      tokenCountSoFar += msgTokenCount;

      switch (msg.author) {
        case Author.SYSTEM:
          tokenCount.sys += msgTokenCount;
          tokenCountSoFar += msgTokenCount;
          break;
        case Author.AGENT:
          tokenCount.agent += msgTokenCount;
          tokenCount.input += tokenCountSoFar;
          tokenCount.output += msgTokenCount;
          break;
        case Author.USER:
          tokenCount.user += msgTokenCount;
          break;
        default:
          console.warn(`Unknown author ${msg.author}`);
          break;
      }
    });
    encoding.free();

    // TODO: does not account for cases where chat is ended by non-agent (e.g. terminated by user before agent starts responding)

    return tokenCount;
  }

  function tokenCost(tokenCount: TokenCount): number {
    const USD_PER_INPUT_TOKEN = 0.001 * 0.03;
    const USD_PER_OUTPUT_TOKEN = 0.001 * 0.06;
    return (
      tokenCount.input * USD_PER_INPUT_TOKEN +
      tokenCount.output * USD_PER_OUTPUT_TOKEN
    );
  }

  onMount(async () => {
    msgs = await fetchMessages(chatId);

    // Substitute in secret prompt
    let promptText = "";
    promptText = $st_prompts[chat.promptId] || "";
    if (!promptText) {
      console.warn(`No prompt text for chat ${chatId}`);
    }
    msgs[0].content = promptText;

    // Count tokens
    tokenCount = computeTokens(msgs);
  });
</script>

<div class="">
  <!-- Chat Details -->
  <div class="p-10">
    <h1 class="text-lg mb-1">Chat <span class="font-bold">{chatId}</span></h1>
    <div class="flex flex-row">
      <pre class="text-xs rounded bg-gray-300 p-2">Tokens:
System: {tokenCount.sys}
Agent: {tokenCount.agent}
User: {tokenCount.user}
---
Input: {tokenCount.input}
Output: {tokenCount.output}</pre>
      <pre class="text-xs rounded bg-gray-300 p-2 ml-2">Cost: ${tokenCost(
          tokenCount
        ).toFixed(2)}</pre>
    </div>
  </div>

  <!-- Messages -->
  {#if msgs}
    {#each msgs as msg}
      <MsgElem {msg} />
    {/each}
  {:else}
    <p>Loading...</p>
  {/if}
</div>
