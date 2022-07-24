<script setup lang="ts">
import { UseTimeAgo } from "@vueuse/components";

import { Bookmark, Icon } from "../types";
import IconButton from "./IconButton.vue";
import IconButtonContainer from "./IconButtonContainer.vue";

const props = defineProps<{ bookmark: Bookmark; isEditing: boolean }>();

defineEmits<{
  (e: "favorite-clicked", value: string): void;
  (e: "edit-clicked", value: string): void;
  (e: "open-bookmark", value: Bookmark): void;
}>();
</script>

<template>
  <li
    class="flex flex-row space-x-2 p-2"
    :class="{ 'bg-stone-200 dark:bg-gray-800': isEditing }"
  >
    <button
      class="flex-1 overflow-hidden break-words hover:bg-stone-300 dark:hover:bg-gray-700 rounded-lg p-2 flex flex-col items-start text-left"
      @click="$emit('open-bookmark', bookmark)"
    >
      <h2>{{ props.bookmark.title }}</h2>
      <p>{{ props.bookmark.url }}</p>
    </button>
    <IconButtonContainer>
      <template v-if="isEditing">
        <div
          class="py-2 px-3 select-none"
          :class="{ 'text-stone-400': isEditing }"
        >
          {{ Icon.RightArrow }}
        </div>
      </template>
      <template v-else>
        <span
          v-if="bookmark.lastUsed"
          class="mx-2"
          :title="bookmark.lastUsed.toLocaleString()"
        >
          <UseTimeAgo v-slot="{ timeAgo }" :time="bookmark.lastUsed">
            {{ timeAgo }}
          </UseTimeAgo>
        </span>
        <IconButton
          title="Favorite Bookmark"
          @click="$emit('favorite-clicked', bookmark.id)"
        >
          {{ bookmark.isFavorite ? Icon.Favorite : Icon.NotFavorite }}
        </IconButton>
        <IconButton
          v-if="!isEditing"
          title="Edit Bookmark"
          @click="$emit('edit-clicked', bookmark.id)"
        >
          {{ Icon.Pencil }}
        </IconButton>
      </template>
    </IconButtonContainer>
  </li>
</template>
