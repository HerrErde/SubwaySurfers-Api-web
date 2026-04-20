import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ApiKind } from "../api/types";
import { ssEndpoints } from "../api/endpoints/ss";
import { sscEndpoints } from "../api/endpoints/ssc";

interface IdentityEntry {
  token: string | null;
  expiry: string | null;
}

export interface Endpoint {
  name: string;
  endpoint: string;
  desc?: string;
  subdesc?: string;
  method: "POST" | "GET";
  // For JSON endpoints: path parameters that interpolate into the URL (e.g. ":uuid")
  pathParams?: any;
  // For RPC endpoints: parameters that map into the RPC body structure
  bodyParams?: any;
  requestType?: any;
  responseType?: any;
  type: "rpc" | "json";
  body?: any;
}

function readIdentityMap(): Record<string, IdentityEntry> {
  try {
    const raw = localStorage.getItem("identityTokens");
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

function writeIdentityMap(map: Record<string, IdentityEntry>) {
  try {
    localStorage.setItem("identityTokens", JSON.stringify(map));
  } catch (e) {
    // ignore
  }
}

function getStoredIdentity(kind: ApiKind): IdentityEntry {
  const map = readIdentityMap();
  const entry = map?.[kind];
  if (!entry || !entry.token) return { token: null, expiry: null };

  const expiry = entry.expiry ?? null;
  if (!expiry) return { token: entry.token, expiry: null };

  const expiryDate = new Date(expiry);
  if (Number.isNaN(expiryDate.getTime())) {
    // remove invalid expiry
    delete map[kind];
    writeIdentityMap(map);
    return { token: null, expiry: null };
  }

  if (expiryDate <= new Date()) {
    // expired - remove
    delete map[kind];
    writeIdentityMap(map);
    return { token: null, expiry: null };
  }

  return { token: entry.token, expiry };
}

function setStoredIdentity(
  kind: ApiKind,
  token: string | null,
  expiry: string | null,
) {
  const map = readIdentityMap();
  if (!token) {
    delete map[kind];
  } else {
    map[kind] = { token, expiry };
  }
  writeIdentityMap(map);
}

export const useAppStore = defineStore("app", () => {
  const initialKind = (localStorage.getItem("apiKind") as ApiKind) || "SS";
  const storedIdentity = getStoredIdentity(initialKind as ApiKind);
  const identityToken = ref<string | null>(storedIdentity.token);
  const identityExpiry = ref<string | null>(storedIdentity.expiry);
  const corsProxy = ref(
    localStorage.getItem("corsProxy") ||
      "https://subwayproxy.herrerde.workers.dev/?url=",
  );
  const limitsDisabled = ref(localStorage.getItem("limitsDisabled") === "true");
  const apiKind = ref<ApiKind>(
    (localStorage.getItem("apiKind") as ApiKind) || "SS",
  );

  const setApiKind = (kind: ApiKind) => {
    apiKind.value = kind;
    localStorage.setItem("apiKind", kind);
    // load stored identity for the newly selected kind
    const stored = getStoredIdentity(kind);
    identityToken.value = stored.token;
    identityExpiry.value = stored.expiry;
  };

  const setIdentity = (token: string, expiry: Date | null) => {
    identityToken.value = token;
    const expiryStr = expiry ? expiry.toISOString() : null;
    identityExpiry.value = expiryStr;
    setStoredIdentity(apiKind.value, token, expiryStr);
  };

  const clearIdentity = () => {
    identityToken.value = null;
    identityExpiry.value = null;
    setStoredIdentity(apiKind.value, null, null);
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

  const activeEndpoints = computed(() => {
    return apiKind.value === "SS" ? ssEndpoints : sscEndpoints;
  });

  return {
    identityToken,
    identityExpiry,
    corsProxy,
    limitsDisabled,
    apiKind,
    setApiKind,
    setIdentity,
    clearIdentity,
    setCorsProxy,
    setLimitsDisabled,
    isTokenExpired,
    activeEndpoints,
  };
});
