<script lang="ts">
  import { st_authKey } from "$lib/stores";
  import { onMount } from "svelte";

  onMount(() => {
    const key = localStorage.getItem("authKey");
    $st_authKey = key || "";
  });

  function onClickSave() {
    localStorage.setItem("authKey", $st_authKey);
    alert("✅ Saved");
  }
</script>

<div class="p-10">
  <h1 class="text-lg font-bold">Authentication</h1>
  <p>You must provide the authentication key before using the site.</p>
  <br />
  <input
    class="w-1/2 p-4 text-lg border rounded-lg"
    bind:value={$st_authKey}
    placeholder="Authentication key"
    type="password"
  />
  <br />
  <br />
  <button class="border-2 p-2 rounded-lg" on:click={onClickSave}>Save</button>
</div>
