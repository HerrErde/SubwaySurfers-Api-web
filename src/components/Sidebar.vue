<script setup lang="ts">
import { computed } from "vue";
import { endpointsList } from "../endpoints";
import { useSidebar } from "../composables/useSidebar";
import { useAppStore } from "../stores/app";

const props = defineProps<{
  selectedEndpoint: any;
}>();

const emit = defineEmits<{
  (e: "select-endpoint", endpoint: any): void;
}>();

const {
  searchQuery,
  fileInput,
  expiryDisplay,
  hasIdentity,
  onFileChange,
  triggerUpload,
  removeIdentity
} = useSidebar();
const store = useAppStore();
void fileInput;

const filteredEndpoints = computed(() => {
  if (!searchQuery.value) return endpointsList;
  const query = searchQuery.value.toLowerCase();
  return endpointsList.filter(
    (ep) =>
      ep.name.toLowerCase().includes(query) ||
      ep.endpoint.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex-none flex flex-col items-center w-full p-4">
      <div class="text-left font-poppins text-lg mb-2 text-[#ffcc99]">
        Endpoints
      </div>

      <p
        v-if="expiryDisplay"
        id="token-expire"
        :title="
          store.identityExpiry ? new Date(store.identityExpiry).toString() : ''
        "
        class="font-poppins mb-2 text-center text-xs text-gray-400 hidden lg:block">
        Expires:<br />{{ expiryDisplay }}
      </p>

      <div class="flex items-center gap-2 mb-2">
        <button
          @click="triggerUpload"
          type="button"
          class="cursor-pointer hover:bg-[#7760fe] hover:text-white duration-100 p-2 px-6 rounded-[7px] bg-white text-black font-semibold text-sm">
          <i v-if="hasIdentity" class="fa fa-file mr-2" aria-hidden="true"></i>
          <i v-else class="fa fa-upload mr-2" aria-hidden="true"></i>
          {{ hasIdentity ? "identity" : "Upload Identity" }}
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="*"
          class="hidden"
          @change="onFileChange" />

        <button
          v-if="hasIdentity"
          @click="removeIdentity"
          type="button"
          class="ml-1 p-1 rounded-[3px] text-white text-sm cursor-pointer"
          title="Remove identity token">
          <i class="fa fa-close"></i>
        </button>
      </div>

      <div class="w-full border-t border-[#222] my-3"></div>
      <div class="w-full">
        <div class="px-4 mb-4 w-full lg:hidden">
          <input
            v-model="searchQuery"
            id="endpointSearch"
            type="text"
            placeholder="Search endpoints..."
            autocomplete="off"
            class="endpointSearch px-3 py-2.5" />
        </div>
        <div class="px-4 mb-4 w-full hidden lg:block">
          <input
            v-model="searchQuery"
            id="endpointSearchDesktop"
            type="text"
            placeholder="Search endpoints..."
            autocomplete="off"
            class="endpointSearch px-3 py-2.5" />
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto w-full custom-scrollbar px-0">
      <div
        id="endpointList"
        class="sidebar-links mb-5 w-full flex flex-col items-center gap-3">
        <div
          v-for="ep in filteredEndpoints"
          :key="ep.endpoint"
          @click="emit('select-endpoint', ep)"
          :class="[
            'sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex items-start gap-1 flex-col justify-between',
            props.selectedEndpoint?.endpoint === ep.endpoint
              ? 'sb-selected'
              : ''
          ]">
          <span
            class="flex font-semibold justify-between font-poppins items-center gap-1"
            >{{ ep.name }}</span
          >
          <span
            class="ep-desc text-xs font-poppins transition-colors text-white"
            >{{ ep.subdesc }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
