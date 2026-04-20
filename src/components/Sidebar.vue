<script setup lang="ts">
import { computed, ref } from "vue";
import { useSidebar } from "../composables/useSidebar";
import ApiSwitcher from "./ApiSwitcher.vue";
import { useAppStore } from "../stores/app";
import type { Endpoint } from "../stores/app";

const props = defineProps<{
  selectedEndpoint: Endpoint | null;
}>();

const emit = defineEmits<{
  (e: "select-endpoint", endpoint: Endpoint): void;
}>();

const {
  searchQuery,
  fileInput,
  expiryDisplay,
  hasIdentity,
  onFileChange,
  triggerUpload,
  removeIdentity,
  parseIdentityJson
} = useSidebar();
const store = useAppStore();
void fileInput;

const showPaste = ref(false);
const pasteText = ref("");

const openPaste = () => {
  showPaste.value = true;
};

const cancelPaste = () => {
  pasteText.value = "";
  showPaste.value = false;
};

const submitPaste = () => {
  if (!pasteText.value) return;
  const ok = parseIdentityJson(pasteText.value);
  if (ok) {
    pasteText.value = "";
    showPaste.value = false;
  }
};

const filteredEndpoints = computed(() => {
  const endpoints = store.activeEndpoints;
  if (!searchQuery.value) return endpoints;
  const query = searchQuery.value.toLowerCase();
  return endpoints.filter(
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
        class="font-poppins mb-2 text-center text-xs text-gray-400 block">
        Expires:<br />{{ expiryDisplay }}
      </p>

      <div class="flex items-center gap-2 mb-2">
        <button
          type="button"
          @click="openPaste"
          class="cursor-pointer hover:bg-[#2b2b2b] duration-100 p-1 px-2 rounded-[6px] bg-transparent text-white text-xs"
          title="Paste identity JSON">
          <i class="fa fa-clipboard" aria-hidden="true"></i>
        </button>

        <teleport to="body">
          <div
            v-if="showPaste"
            class="fixed inset-0 z-50 flex items-center justify-center">
            <div
              class="absolute inset-0 bg-black/70"
              @click="cancelPaste"></div>
            <div
              class="relative bg-[#0b0b0b] rounded-md p-4 w-full max-w-lg z-50 mx-4 sm:mx-0">
              <div class="flex justify-between items-center mb-3">
                <div class="text-sm font-semibold text-white">
                  Paste Identity JSON
                </div>
                <button
                  @click="cancelPaste"
                  class="text-white text-lg leading-none cursor-pointer">
                  &times;
                </button>
              </div>
              <textarea
                v-model="pasteText"
                rows="8"
                placeholder="Paste identity JSON here"
                class="w-full px-3 py-2 text-sm rounded-md bg-[#111] text-white resize-y max-h-80 overflow-auto"></textarea>
              <div class="flex justify-end gap-2 mt-3">
                <button
                  @click="submitPaste"
                  class="p-2 px-4 bg-[#3b82f6] rounded text-white text-sm cursor-pointer">
                  Submit
                </button>
                <button
                  @click="cancelPaste"
                  class="p-2 px-4 bg-[#444] rounded text-white text-sm cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </teleport>

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
      <ApiSwitcher />
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
