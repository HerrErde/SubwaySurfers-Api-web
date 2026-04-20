<script setup lang="ts">
import { useAppStore } from "../stores/app";
import type { ApiKind } from "../api/types";

const store = useAppStore();

const apiOptions: { label: string; value: ApiKind }[] = [
  { label: "Subway Surfers", value: "SS" },
  { label: "Subway Surfers City", value: "SSC" },
];

const handleSwitch = (kind: ApiKind) => {
  store.setApiKind(kind);
};
</script>

<template>
  <div class="flex flex-col w-full px-4 mb-4">
    <div class="flex bg-[#121212] rounded-lg p-1 border border-[#222]">
      <button
        v-for="option in apiOptions"
        :key="option.value"
        @click="handleSwitch(option.value)"
        :class="[
          'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer',
          store.apiKind === option.value
            ? 'bg-[#ffcc99] text-black shadow-sm'
            : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]',
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
