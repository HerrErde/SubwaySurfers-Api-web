<script setup lang="ts">
import { watch } from "vue";
import RequestForm from "./RequestForm.vue";
import ResponsePanel from "./ResponsePanel.vue";
import { useMainPanel } from "../composables/useMainPanel";
import type { Endpoint } from "../stores/app";

const props = defineProps<{
  selectedEndpoint: Endpoint | null;
}>();

const {
  activeTab,
  responseValue,
  isResponseReady,
  onResponse,
  clearResponse,
  setTab
} = useMainPanel();

watch(
  () => props.selectedEndpoint,
  () => {
    clearResponse();
    setTab("request");
  }
);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 w-full">
    <div v-if="selectedEndpoint" class="lg:hidden sticky top-0 z-20 py-2">
      <div
        class="grid grid-cols-2 gap-2 rounded-xl border border-[#222] bg-[#101014] p-1">
        <button
          @click="setTab('request')"
          type="button"
          :class="[
            'rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer',
            activeTab === 'request'
              ? 'bg-[#ffcc99] text-black'
              : 'text-gray-300'
          ]">
          Request
        </button>
        <button
          @click="setTab('response')"
          type="button"
          :class="[
            'relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors cursor-pointer',
            activeTab === 'response'
              ? 'bg-[#ffcc99] text-black'
              : 'text-gray-300'
          ]">
          Response
          <span
            v-if="isResponseReady && activeTab === 'request'"
            class="absolute right-2 top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"></span>
        </button>
      </div>
    </div>

    <div
      id="request-panel"
      :class="[
        'bg-[#0f0f11] p-6 rounded-xl border border-[#1a1a1a] h-[calc(100dvh-11rem)] lg:h-screen overflow-y-auto custom-scrollbar',
        activeTab === 'request' ? 'block' : 'hidden lg:block'
      ]">
      <div v-if="selectedEndpoint">
        <h2 class="text-[#ffcc99] font-poppins text-2xl font-semibold mb-2">
          {{ selectedEndpoint.name }}
        </h2>
        <p class="text-gray-400 mb-4">
          {{ selectedEndpoint.endpoint }}
        </p>
        <p v-if="selectedEndpoint.desc" class="text-gray-400 mb-2">
          {{ selectedEndpoint.desc }}
        </p>

        <RequestForm
          :endpoint="selectedEndpoint"
          @response="onResponse"
          @before-submit="clearResponse" />
      </div>

      <div v-else>
        <h2
          id="endpointTitle"
          class="text-[#ffcc99] font-poppins text-2xl font-semibold mb-2">
          Select an Endpoint
        </h2>
        <p id="endpointPath" class="font-poppins text-gray-400 mb-4">
          Choose an endpoint from the sidebar to test.
        </p>
        <p id="endpointDesc" class="font-poppins text-gray-400 mb-2"></p>
        <div id="endpointForm"></div>
      </div>
    </div>

    <div
      id="response-panel"
      :class="[
        'bg-[#0f0f11] p-6 rounded-xl border border-[#1a1a1a] flex flex-col h-[calc(100dvh-11rem)] lg:h-auto',
        activeTab === 'response' ? 'flex' : 'hidden lg:flex'
      ]">
      <ResponsePanel :value="responseValue" />
    </div>
  </div>
</template>
