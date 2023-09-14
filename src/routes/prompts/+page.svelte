<script lang="ts">
  import { env } from "$env/dynamic/public";
  import {
    ENDPOINT_ADMIN_PROMPT,
    ENDPOINT_ADMIN_PROMPT_GET_SELECTED,
    ENDPOINT_ADMIN_PROMPT_IDS,
    ENDPOINT_ADMIN_PROMPT_NEW,
    ENDPOINT_ADMIN_PROMPT_SET_SELECTED,
    ENDPOINT_ADMIN_PROMPT_UPDATE,
  } from "$lib/endpoints";
  import { st_selectedPromptId } from "$lib/stores";
  import { onMount } from "svelte";

  // Fetch
  async function fetchGetJson(url: string): Promise<any> {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
      },
    });
    const data = await resp.json();
    return data;
  }

  async function fetchGetText(url: string): Promise<string> {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
      },
    });
    const data = await resp.text();
    return data;
  }

  async function fetchPost(url: string, body: any): Promise<void> {
    await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async function fetchPromptIds(): Promise<string[]> {
    const url = ENDPOINT_ADMIN_PROMPT_IDS;
    return await fetchGetJson(url);
  }

  async function fetchPrompt(promptId: string): Promise<string> {
    const url = ENDPOINT_ADMIN_PROMPT(promptId);
    return await fetchGetText(url);
  }

  async function insertPrompt(promptId: string, prompt: string): Promise<void> {
    const url = ENDPOINT_ADMIN_PROMPT_NEW;
    const body = { prompt, promptId };
    await fetchPost(url, body);
  }

  async function updatePrompt(promptId: string, prompt: string): Promise<void> {
    const url = ENDPOINT_ADMIN_PROMPT_UPDATE;
    const body = { prompt, promptId };
    await fetchPost(url, body);
  }

  async function fetchSelectedPromptId(): Promise<string> {
    const url = ENDPOINT_ADMIN_PROMPT_GET_SELECTED;
    return await fetchGetText(url);
  }

  async function setSelectedPromptId(promptId: string): Promise<void> {
    const url = ENDPOINT_ADMIN_PROMPT_SET_SELECTED;
    const body = { promptId };
    await fetchPost(url, body);
  }

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
  function onChangeTextarea(e: Event) {
    if (!current) {
      current = {
        id: "",
        prompt: "",
      };
    }
    const elem = e.target as HTMLInputElement;
    current.id = elem.value;
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
            on:change={onChangeTextarea}
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
