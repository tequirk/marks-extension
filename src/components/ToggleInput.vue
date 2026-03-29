<script setup lang="ts">
defineProps<{ label: string }>();
defineEmits<{ (e: "toggle-clicked"): void }>();
</script>
<template>
  <button
    class="rounded-lg border border-stone-300 dark:border-stone-700 p-2 flex"
    @click="$emit('toggle-clicked')"
  >
    <div class="text-left flex-1">{{ label }}</div>
    <slot />
  </button>
</template>
