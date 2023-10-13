<script lang="ts">
  import { st_showDev } from "$lib/stores";
  import { UserType, type Chat } from "$lib/types";

  export let chat: Chat;

  let tagText = chat.userType;
  let tagColor = "bg-red-500";

  switch (chat.userType) {
    case UserType.LOCAL:
      tagText = "local";
      tagColor = "bg-yellow-500";
      break;
    case UserType.DEV:
      tagText = "dev";
      tagColor = "bg-blue-500";
      break;
    case UserType.USER:
      tagText = "user";
      tagColor = "bg-green-500";
      break;
    case UserType.UNKNOWN:
      tagText = `unknown`;
      tagColor = "bg-gray-500";
      break;
    default:
      tagText = `??? ${chat.userType}`;
      tagColor = "bg-red-500";
      break;
  }
</script>

{#if $st_showDev || ![UserType.LOCAL, UserType.DEV].includes(chat.userType)}
  <li>
    <!-- Badge -->
    <span
      class={`inline-block px-2 py-1 mr-2 text-xs font-bold rounded-full "text-black" ${tagColor}`}
      >{tagText}
    </span>

    <!-- Link -->
    <a href={`/chats/${chat.id}`}>
      {chat.id.slice(0, 13)}
    </a>
  </li>
{/if}
