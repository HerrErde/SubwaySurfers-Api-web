import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface Endpoint {
  name: string;
  endpoint: string;
  desc?: string;
  subdesc?: string;
  params: any;
  request?: string;
  response?: string;
  type: "rpc" | "json";
  body?: any;
}

export const useAppStore = defineStore("app", () => {
  const identityToken = ref<string | null>(
    localStorage.getItem("identityToken")
  );
  const identityExpiry = ref<string | null>(
    localStorage.getItem("identityExpiry")
  );
  const corsProxy = ref(
    localStorage.getItem("corsProxy") ||
      "https://noisy-disk-638c.herrerde.workers.dev/?url="
  );
  const limitsDisabled = ref(localStorage.getItem("limitsDisabled") === "true");

  const setIdentity = (token: string, expiry: Date | null) => {
    identityToken.value = token;
    localStorage.setItem("identityToken", token);
    if (expiry) {
      const expiryStr = expiry.toISOString();
      identityExpiry.value = expiryStr;
      localStorage.setItem("identityExpiry", expiryStr);
    } else {
      identityExpiry.value = null;
      localStorage.removeItem("identityExpiry");
    }
  };

  const clearIdentity = () => {
    identityToken.value = null;
    identityExpiry.value = null;
    localStorage.removeItem("identityToken");
    localStorage.removeItem("identityExpiry");
  };

  const setCorsProxy = (url: string) => {
    corsProxy.value = url;
    localStorage.setItem("corsProxy", url);
  };

  const setLimitsDisabled = (disabled: boolean) => {
    limitsDisabled.value = disabled;
    localStorage.setItem("limitsDisabled", String(disabled));
  };

  const isTokenExpired = computed(() => {
    if (!identityExpiry.value) return false;
    return new Date(identityExpiry.value) < new Date();
  });

  return {
    identityToken,
    identityExpiry,
    corsProxy,
    limitsDisabled,
    setIdentity,
    clearIdentity,
    setCorsProxy,
    setLimitsDisabled,
    isTokenExpired
  };
});
