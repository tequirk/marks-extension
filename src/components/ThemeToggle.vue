<script setup lang="ts">
import { Icon } from "../types";
defineProps<{ isDarkTheme: boolean }>();
defineEmits<{ (e: "toggle-theme"): void }>();
</script>
<template>
  <button class="m-2 leading-4 text-stone-700 dark:text-stone-300" @click="$emit('toggle-theme')">{{ isDarkTheme ? Icon.Sun : Icon.Moon }}
  </button>
</template>
