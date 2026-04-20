import { ref } from "vue";

export function useMainPanel() {
  const activeTab = ref<"request" | "response">("request");
  const responseValue = ref("Nothing returned yet.");
  const isResponseReady = ref(false);

  const onResponse = (val: string) => {
    responseValue.value = val;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop && activeTab.value === "request") {
      isResponseReady.value = true;
    }
  };

  const clearResponse = () => {
    responseValue.value = "Nothing returned yet.";
    isResponseReady.value = false;
  };

  const setTab = (tab: "request" | "response") => {
    activeTab.value = tab;
    if (tab === "response") {
      isResponseReady.value = false;
    }
  };

  return {
    activeTab,
    responseValue,
    isResponseReady,
    onResponse,
    clearResponse,
    setTab,
  };
}
