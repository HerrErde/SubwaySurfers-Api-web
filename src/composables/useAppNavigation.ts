import { ref } from "vue";
import type { Endpoint } from "../stores/app";

export function useAppNavigation() {
  const showMobileSidebar = ref(false);
  const showInfoModal = ref(false);
  const selectedEndpoint = ref<Endpoint | null>(null);

  const toggleMobileSidebar = () => {
    showMobileSidebar.value = !showMobileSidebar.value;
  };

  const closeMobileSidebar = () => {
    showMobileSidebar.value = false;
  };

  const selectEndpoint = (ep: any) => {
    selectedEndpoint.value = ep;
    showMobileSidebar.value = false;
  };

  const openInfo = () => {
    showInfoModal.value = true;
  };

  const closeInfo = () => {
    showInfoModal.value = false;
  };

  return {
    showMobileSidebar,
    showInfoModal,
    selectedEndpoint,
    toggleMobileSidebar,
    selectEndpoint,
    openInfo,
    closeInfo,
    closeMobileSidebar,
  };
}
