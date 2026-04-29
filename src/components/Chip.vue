<script setup lang="ts">
import { Icon } from "../types";
defineProps<{ tag: string }>();
defineEmits<{ (e: "remove-tag", value: string): void }>();
</script>
<template>
  <div
    class="bg-stone-700 dark:bg-stone-800 rounded-2xl p-2 text-white dark:text-stone-300 text-xs overflow-hidden"
  >
    {{ tag }}
    <button
      class="bg-stone-600 hover:bg-stone-500 dark:bg-stone-700 dark:hover:bg-stone-600 rounded-2xl w-5 h-5"
      @click="$emit('remove-tag', tag)"
    >
      {{ Icon.X }}
    </button>
  </div>
</template>
