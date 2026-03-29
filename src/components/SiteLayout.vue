<script setup lang="ts">
defineProps<{ isDarkTheme: boolean }>();
</script>
<template>
  <div class="h-screen" :class="{ dark: isDarkTheme }">
    <div
      class="h-screen flex flex-col bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300"
    >
      <div class="text-white flex flex-row justify-end">
        <slot name="header" />
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex justify-center items-center">
          <slot name="content" />
        </div>
      </div>
      <div class="py-4 flex items-center justify-center">
        <p class="text-sm/6 text-stone-400">Copyright © 2026 <a href="https://tequirk.com" target="_blank" rel="noopener noreferrer" class="hover:text-stone-600 dark:hover:text-stone-300">Tequirk LLC</a>. All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>
