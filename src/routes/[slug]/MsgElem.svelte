<script lang="ts">
  import { Author, type Message } from "$lib/types";

  export let msg: Message;

  let authorColor: string;
  switch (msg.author) {
    case Author.SYSTEM:
      authorColor = "bg-blue-500";
      break;
    case Author.AGENT:
      authorColor = "bg-purple-500";
      break;
    case Author.USER:
      authorColor = "bg-green-500";
      break;
  }
</script>

<div class="flex flex-col justify-start items-start p-4">
  <!-- Author badge -->
  <div class={`capitalize ${authorColor} rounded font-bold text-md p-1 mb-1`}>
    {msg.author}
  </div>

  <pre class="whitespace-break-spaces border-l-8 pl-2 rounded-b-2xl">
    {msg.content}
  </pre>
</div>
