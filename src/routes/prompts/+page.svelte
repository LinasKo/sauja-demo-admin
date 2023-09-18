<script lang="ts">
  import {
    fetchPrompt,
    fetchPromptIds,
    fetchSelectedPromptId,
    insertPrompt,
    setSelectedPromptId,
    updatePrompt,
  } from "$lib/requests";
  import { st_selectedPromptId } from "$lib/stores";
  import { onMount } from "svelte";

  // Main
  let promptIds: string[];
  $: promptIds = [];

  type Prompt = {
    id: string;
    prompt: string;
  };
  let current: Prompt | null;
  $: current = null;

  $: makingNewPrompt = false;

  onMount(async () => {
    promptIds = await fetchPromptIds();
    $st_selectedPromptId = await fetchSelectedPromptId();
    if ($st_selectedPromptId) {
      const promptText = await fetchPrompt($st_selectedPromptId);
      current = {
        id: $st_selectedPromptId,
        prompt: promptText,
      };
    }
  });

  // UI Events
  function onChangeIdInput(e: Event) {
    if (!current) {
      current = {
        id: "",
        prompt: "",
      };
    }
    const elem = e.target as HTMLInputElement;
    current.id = elem.value;
  }

  function onChangeTextarea(e: Event) {
    if (!current) {
      current = {
        id: "",
        prompt: "",
      };
    }
    const elem = e.target as HTMLInputElement;
    current.prompt = elem.value;
  }

  function onClickNewPrompt() {
    makingNewPrompt = true;
    current = null;
  }

  async function onClickPrompt(promptId: string) {
    makingNewPrompt = false;
    const promptText = await fetchPrompt(promptId);
    current = {
      id: promptId,
      prompt: promptText,
    };
  }

  async function onClickActivatePrompt() {
    if (!current?.id) {
      alert("No prompt ID");
      return;
    }
    await setSelectedPromptId(current.id);
    promptIds = await fetchPromptIds(); // Won't hurt
    const selectedId = await fetchSelectedPromptId();
    if (selectedId) {
      const promptText = await fetchPrompt(selectedId);
      current = {
        id: selectedId,
        prompt: promptText,
      };
    }
    $st_selectedPromptId = selectedId;
  }

  async function onClickCreateUpdatePrompt() {
    if (!current?.id) {
      alert("No prompt ID");
      return;
    }
    if (!current?.prompt) {
      alert("No prompt text");
      return;
    }

    if (makingNewPrompt) {
      try {
        await insertPrompt(current.id, current.prompt);
        promptIds = await fetchPromptIds(); // Won't hurt
        const promptText = await fetchPrompt(current.id);
        current.prompt = promptText;
        makingNewPrompt = false;
        alert("Created prompt");
      } catch (e) {
        alert("Failed to create prompt: " + e);
        throw e;
      }
    } else {
      try {
        await updatePrompt(current.id, current.prompt);
        promptIds = await fetchPromptIds(); // Won't hurt
        const promptText = await fetchPrompt(current.id);
        current.prompt = promptText;
        alert("Updated prompt");
      } catch (e) {
        alert("Failed to update prompt: " + e);
        throw e;
      }
    }
  }

  // UI Elements
  function promptButtonClass(promptId: string): string {
    let classes = "btn";
    if (promptId === $st_selectedPromptId) {
      classes += " bg-lime-400";
    } else if (promptId === current?.id) {
      classes += " bg-lime-200 hover:bg-lime-300";
    }
    return classes;
  }
</script>

{#key $st_selectedPromptId}
  <div class="p-10">
    <h1 class="text-xl font-bold">Prompts</h1>
    <div class="text-sm">
      Active:
      <span class="font-bold">{$st_selectedPromptId ?? "Unknown"}</span>
    </div>
    <br />

    <div class="flex flex-row gap-8">
      <!-- Selection -->
      <div class="flex flex-col gap-1">
        <button class="btn bg-purple-500" on:click={onClickNewPrompt}>
          New Prompt
        </button>

        {#key $st_selectedPromptId}
          {#each promptIds as promptId}
            <button
              class={promptButtonClass(promptId)}
              on:click={() => onClickPrompt(promptId)}
            >
              {promptId}
            </button>
          {/each}
        {/key}
      </div>

      <!-- View -->
      <div class="flex flex-col">
        <div>
          <label for="prompt-id">Prompt ID:</label>
          <input
            id="prompt-id"
            type="text"
            value={current?.id || ""}
            disabled={!makingNewPrompt}
            class="p-2 disabled:bg-slate-300 rounded enabled:bg-lime-200"
            placeholder="no-id-so-far"
            on:change={onChangeIdInput}
          />

          {#if !makingNewPrompt}
            <button
              class="btn bg-lime-400 disabled:bg-lime-600"
              disabled={$st_selectedPromptId === current?.id}
              on:click={onClickActivatePrompt}
              >{$st_selectedPromptId === current?.id
                ? "Already Active"
                : "Activate"}</button
            >
          {/if}
        </div>

        <textarea
          id="prompt-text"
          class="p-2 mt-2 border-2 rounded min-w-[50vw] min-h-[60vh]"
          placeholder="<no prompt text>"
          on:change={onChangeTextarea}>{current?.prompt || ""}</textarea
        >

        <button class="btn bg-lime-400" on:click={onClickCreateUpdatePrompt}>
          {makingNewPrompt ? "Create" : "Update"}
          <button />
        </button>
      </div>
    </div>
  </div>
{/key}

<style lang="postcss">
  .btn {
    @apply p-2 mx-1 rounded border-2 enabled:hover:bg-lime-300 font-bold enabled:transition;
  }
</style>
