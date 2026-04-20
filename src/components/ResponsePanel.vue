<script setup lang="ts">
import { computed } from "vue";
import { useClipboard } from "../composables/useClipboard";

const props = defineProps<{
  value: string;
}>();

const { copyText, onCopy } = useClipboard();
const hasValue = computed(
  () => props.value && props.value !== "Nothing returned yet.",
);

const handleCopy = () => {
  if (hasValue.value) onCopy(props.value);
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-[#ffcc99] text-xl font-poppins font-semibold">Result</h3>
      <button
        v-if="hasValue"
        @click="handleCopy"
        type="button"
        class="rounded-md border border-[#333] bg-[#1a1a1a] px-3 py-1 text-xs font-semibold text-gray-200 transition-colors hover:bg-[#252525] cursor-pointer"
      >
        {{ copyText }}
      </button>
    </div>
    <div
      class="bg-[#121212] border border-[#333] rounded-lg p-4 font-mono text-left text-sm text-gray-200 overflow-y-auto flex-1 flex flex-col"
      style="max-height: 80vh; min-height: 120px"
    >
      <textarea
        v-if="hasValue"
        id="response-output"
        readonly
        class="w-full h-full bg-transparent text-gray-200 outline-none resize-none custom-scrollbar"
        :value="value"
      ></textarea>
      <span v-else class="text-left">Nothing returned yet.</span>
    </div>
  </div>
</template>
