<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    goto("/chats");
  });
</script>

<div class="p-10">
  <h1 class="text-lg font-bold">Recorded chats:</h1>
  <p>Loading...</p>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
