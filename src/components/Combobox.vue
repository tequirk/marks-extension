<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  options: string[];
  placeholder: string;
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "add-tag"): void;
}>();

const tagInput = ref<HTMLInputElement>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
<template>
  <input
    ref="tagInput"
    v-model="inputValue"
    list="tagSuggestions"
    class="rounded-lg border border-stone-300 dark:border-stone-700 p-2 dark:bg-stone-900"
    :placeholder="placeholder"
    @keydown.enter="$emit('add-tag')"
  />
  <datalist id="tagSuggestions">
    <option v-for="option in options" :key="option">
      {{ option }}
    </option>
  </datalist>
</template>
