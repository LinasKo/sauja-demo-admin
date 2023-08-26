<script>
  import "../app.css";
</script>

<!-- Header -->
<div class="w-full p-4 bg-gray-200">
  <a class="btn" href="/chats"> Conversations </a>

  <a class="btn" href="/prompts">Prompts</a>
</div>

<slot />

<style lang="postcss">
  .btn {
    @apply p-2 mx-1 bg-white rounded hover:bg-lime-300 font-bold transition;
  }
</style>
