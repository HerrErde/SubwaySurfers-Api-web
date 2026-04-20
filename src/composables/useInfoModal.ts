import { ref, computed } from "vue";
import { useAppStore } from "../stores/app";

export function useInfoModal() {
  const store = useAppStore();
  const showSettings = ref(false);
  const corsProxyInput = ref(store.corsProxy);

  const saveCorsProxy = () => {
    store.setCorsProxy(corsProxyInput.value);
  };

  const toggleLimits = () => {
    store.setLimitsDisabled(!store.limitsDisabled);
  };

  const limitsDisabled = computed(() => store.limitsDisabled);

  return {
    showSettings,
    corsProxyInput,
    limitsDisabled,
    saveCorsProxy,
    toggleLimits,
  };
}
