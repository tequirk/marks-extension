<script setup lang="ts">
defineProps<{ title: string }>();
</script>
<template>
  <button
    class="hover:bg-stone-300 dark:hover:bg-gray-700 rounded-lg py-2 px-3"
    type="button"
    :title="title"
  >
    <slot />
  </button>
</template>
