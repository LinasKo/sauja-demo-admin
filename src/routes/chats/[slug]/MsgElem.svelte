<script lang="ts">
  import { TEMPLATE_QUESTIONS } from "$lib/constants";
  import { MessageType, type Message } from "$lib/types";
  export let msg: Message;
  export let promptId: string = "";

  let authorColor: string;
  switch (msg.type) {
    case MessageType.USER:
      authorColor = "bg-green-500";
      break;
    case MessageType.AGENT:
      authorColor = "bg-purple-500";
      break;
    case MessageType.SUMMARIZER:
      authorColor = "bg-purple-500";
      break;
    case MessageType.INTERRUPTED:
      authorColor = "bg-gray-500";
      break;
    case MessageType.MEMORY:
      authorColor = "bg-blue-500";
      break;
    case MessageType.CART_STATUS:
      authorColor = "bg-yellow-500";
      break;
  }

  const msgTemplate = TEMPLATE_QUESTIONS.indexOf(msg.content);
</script>

<div class="flex flex-col justify-start items-start p-4">
  <div class="flex flex-row gap-2 items-center">
    <!-- Author badge -->
    <div class={`capitalize ${authorColor} rounded font-bold p-1 mb-1 text-lg`}>
      {msg.type}
    </div>

    {#if msgTemplate > -1}
      <!-- Template badge -->
      <div class="bg-yellow-500 rounded font-bold p-1 mb-1 text-lg">
        Template {msgTemplate}
      </div>
    {/if}

    <!-- PromptId -->
    {#if promptId}
      <div class="text-sm mb-1">
        prompt: <span class="font-bold">{promptId}</span>
      </div>
    {/if}
  </div>

  <pre
    class="whitespace-break-spaces border-l-8 pl-6 pt-2 rounded-b-2xl">{msg.content}</pre>
</div>
