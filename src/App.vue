<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import MainPanel from "./components/MainPanel.vue";
import InfoModal from "./components/InfoModal.vue";
import { useAppNavigation } from "./composables/useAppNavigation";

const {
  showMobileSidebar,
  showInfoModal,
  selectedEndpoint,
  toggleMobileSidebar,
  selectEndpoint,
  openInfo,
  closeInfo
} = useAppNavigation();
</script>

<template>
  <div class="text-white font-sans min-h-screen block lg:flex">
    <div class="lg:hidden flex items-center justify-between bg-[#09090b] p-4">
      <a href="#" class="cursor-pointer flex items-center gap-2">
        <span class="font-bold text-white text-xl">Subway Surfers API</span>
      </a>
      <button
        @click="toggleMobileSidebar"
        class="text-white text-2xl"
        role="button"
        aria-label="Toggle sidebar">
        <i class="fas fa-bars"></i>
      </button>
    </div>

    <div
      id="mobileSidebar"
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-[#09090b] z-50 transform transition-transform duration-200 ease-in-out lg:hidden flex flex-col shadow-lg overflow-y-auto',
        showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
      ]">
      <Sidebar
        @select-endpoint="selectEndpoint"
        :selected-endpoint="selectedEndpoint" />
    </div>

    <div
      class="sidebar hidden lg:flex w-[16.7vw] bg-[#09090b] h-screen flex-col items-center overflow-hidden">
      <Sidebar
        @select-endpoint="selectEndpoint"
        :selected-endpoint="selectedEndpoint" />
    </div>

    <main
      class="flex-1 py-4 px-4 lg:py-10 lg:px-8 h-full roundborder border-l border-[#1a1a1a]">
      <MainPanel :selected-endpoint="selectedEndpoint" />
    </main>

    <div
      id="info-btn-container"
      style="position: fixed; bottom: 24px; right: 24px; z-index: 50">
      <button
        @click="openInfo"
        title="Info"
        class="btn btn-sm btn-circle bg-[#222] text-white hover:bg-[#444] cursor-pointer"
        style="
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          class="size-5">
          <path
            d="M480-680q-33 0-56.5-23.5T400-760q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760q0 33-23.5 56.5T480-680Zm-60 560v-480h120v480H420Z"></path>
        </svg>
      </button>
    </div>

    <InfoModal :show="showInfoModal" @close="closeInfo" />
  </div>
</template>
