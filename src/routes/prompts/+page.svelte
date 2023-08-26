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

  async function fetchPromptIds(): Promise<string[]> {
    const resp = await fetch(ENDPOINT_ADMIN_PROMPT_IDS, {
      method: "GET",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
      },
    });
    const data = await resp.json();
    return data;
  }

  async function fetchPrompt(promptId: string): Promise<string> {
    const resp = await fetch(ENDPOINT_ADMIN_PROMPT(promptId), {
      method: "GET",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
      },
    });
    const data = await resp.text();
    return data;
  }

  async function insertPrompt(promptId: string, prompt: string): Promise<void> {
    await fetch(ENDPOINT_ADMIN_PROMPT_NEW, {
      method: "POST",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptId, prompt }),
    });
  }

  async function updatePrompt(promptId: string, prompt: string): Promise<void> {
    await fetch(ENDPOINT_ADMIN_PROMPT_UPDATE, {
      method: "POST",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptId, prompt }),
    });
  }

  async function fetchSelectedPromptId(): Promise<string> {
    const resp = await fetch(ENDPOINT_ADMIN_PROMPT_GET_SELECTED, {
      method: "GET",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
      },
    });
    const data = await resp.text();
    return data;
  }

  async function setSelectedPromptId(promptId: string): Promise<void> {
    await fetch(ENDPOINT_ADMIN_PROMPT_SET_SELECTED, {
      method: "POST",
      headers: {
        "x-api-key": env.PUBLIC_DEV_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ promptId }),
    });
  }

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
        <!-- <a class="btn bg-lime-400" href="/prompts/new"> New Prompt </a> -->
        <button
          class="btn bg-purple-500"
          on:click={() => {
            makingNewPrompt = true;
            current = null;
          }}
        >
          New Prompt
        </button>

        {#key $st_selectedPromptId}
          {#each promptIds as promptId}
            <button
              class={`btn ${
                $st_selectedPromptId === promptId && "bg-lime-400"
              }`}
              on:click={async () => {
                makingNewPrompt = false;
                const promptText = await fetchPrompt(promptId);
                current = {
                  id: promptId,
                  prompt: promptText,
                };
              }}
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
            on:change={(e) => {
              if (!current) {
                current = {
                  id: "",
                  prompt: "",
                };
              }
              current.id = e.target.value;
            }}
          />

          {#if !makingNewPrompt}
            <button
              class="btn bg-lime-400 disabled:bg-lime-600"
              disabled={$st_selectedPromptId === current?.id}
              on:click={async () => {
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
              }}
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
          on:change={(e) => {
            if (!current) {
              current = {
                id: "",
                prompt: "",
              };
            }
            current.prompt = e.target.value;
          }}>{current?.prompt || ""}</textarea
        >

        <button
          class="btn bg-lime-400"
          on:click={async () => {
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
          }}
        >
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
