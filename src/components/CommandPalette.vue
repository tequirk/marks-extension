<script setup lang="ts">
defineProps<{ isOpen: boolean }>();
</script>

<template>
  <div
    class="text-sm flex-1 flex h-full mx-8 md:mx-0 md:max-w-2xl md:max-h-[30rem] md:mb-6 2xl:max-w-4xl 2xl:max-h-[32rem] bg-white dark:bg-stone-900 rounded-lg drop-shadow-[0_24px_24px_rgba(0,0,0,0.50)]"
  >
    <div class="flex-1 flex flex-col max-w-full">
      <div class="flex-1 flex flex-row overflow-hidden">
        <div
          class="flex-1 min-w-[60%] sm:flex flex-col overflow-hidden rounded-lg"
          :class="{
            hidden: isOpen,
            'rounded-lg': !isOpen,
            'rounded-l-lg rounded-r-none': isOpen,
          }"
        >
          <slot name="content" />
        </div>
        <div
          class="w-0 opacity-0 overflow-hidden break-words flex flex-col sm:border-l dark:border-stone-700 transition-[width,opacity] duration-[300ms] delay-[0ms]"
          :class="{
            'min-w-full opacity-100 sm:min-w-0 sm:w-80 p-4': isOpen,
          }"
        >
          <slot name="drawer" />
        </div>
      </div>
    </div>
  </div>
</template>
