<script lang="ts">
  import { st_showDev } from "$lib/stores";
  import type { Convo } from "$lib/types";

  export let convo: Convo;

  let tagName = convo.origin;
  let tagColor = "bg-red-500";

  // Localhost - regex match
  if (tagName.match(/http:\/\/localhost:\d{4}/)) {
    tagName = "dev";
    tagColor = "bg-blue-500";
  } else if (tagName == "https://sauja.vercel.app") {
    tagName = "user";
    tagColor = "bg-green-500";
  }
</script>

{#if $st_showDev || tagName != "dev"}
  <li>
    <!-- Badge -->
    <span
      class={`inline-block px-2 py-1 mr-2 text-xs font-bold text-white rounded-full ${tagColor}`}
    >
      {tagName}
    </span>

    <!-- Link -->
    <a href={`/${convo.id}`}>
      {convo.id}
    </a>
  </li>
{/if}
