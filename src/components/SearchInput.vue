<script setup lang="ts">
defineProps<{
  modelValue?: string;
  placeholder: string;
}>();
defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "go"): void;
}>();
</script>
<template>
  <input
    :value="modelValue"
    autofocus
    class="flex-1 rounded-lg mr-2 pl-2 dark:bg-stone-900"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    @keydown.enter="$emit('go')"
  />
</template>
