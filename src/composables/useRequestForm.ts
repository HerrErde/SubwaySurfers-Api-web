import { ref, computed, watch, isRef, unref } from "vue";
import { useAppStore } from "../stores/app";
import { createPromiseClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { PrivateService as PlayerService } from "../gen/player_connect";
import { PrivateService as FriendsService } from "../gen/friends_connect";
import { PrivateService as WalletService } from "../gen/wallet_connect";
import { PrivateService as TournamentService } from "../gen/tournament_connect";

export function useRequestForm(endpoint: any) {
  const store = useAppStore();
  const endpointRef = isRef(endpoint) ? endpoint : ref(endpoint);
  const getEndpoint = () => unref(endpointRef);
  const formValues = ref<Record<string, any>>({});
  const metadataEntries = ref<{ key: string; value: any }[]>([]);
  const errors = ref<string | null>(null);
  const isSubmitting = ref(false);
  const playerDataJson = ref("");
  const metadataSelection = ref("");
  let abortController: AbortController | null = null;
  let requestGeneration = 0;
  const notify = (status: "error" | "success", title: string, text: string) => {
    const NotifyCtor = (window as any).Notify;
    if (typeof NotifyCtor === "function") {
      new NotifyCtor({
        status,
        title,
        text,
        effect: "fade",
        speed: 300,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        type: "filled",
        position: "right top"
      });
    } else {
      alert(text);
    }
  };

  const isLeafParam = (p: any) => {
    if (!p || typeof p !== "object") return false;
    return (
      "type" in p ||
      "metadata" in p ||
      "regex" in p ||
      "example" in p ||
      "required" in p ||
      "default" in p ||
      "name" in p ||
      "value" in p
    );
  };

  const flattenParams = (params: any, prefix = ""): Array<any> => {
    const out: Array<any> = [];
    if (!params) return out;
    for (const [k, v] of Object.entries(params)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (isLeafParam(v)) {
        out.push({ key: fullKey, param: v });
      } else {
        out.push(...flattenParams(v as any, fullKey));
      }
    }
    return out;
  };

  const initializeForm = () => {
    formValues.value = {};
    metadataEntries.value = [];
    errors.value = null;
    playerDataJson.value = "";

    if (getEndpoint().params) {
      const flat = flattenParams(getEndpoint().params || {});
      flat.forEach(({ key, param }: { key: string; param: any }) => {
        if (param.type !== "list") {
          const fieldName = param.value || key;
          formValues.value[fieldName] = param.default || "";
        }
      });
    }
  };

  watch(
    endpointRef,
    () => {
      // Cancel any pending requests and invalidate their responses
      requestGeneration++;
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      initializeForm();
    },
    { immediate: true }
  );

  const addMetadataEntry = (key: string) => {
    if (metadataEntries.value.length >= 20) {
      notify("error", "Metadata Limit", "The maximal limit is 20 fields");
      return;
    }
    if (!metadataEntries.value.find((e) => e.key === key)) {
      metadataEntries.value.push({ key, value: "" });
    }
  };

  const removeMetadataEntry = (key: string) => {
    metadataEntries.value = metadataEntries.value.filter((e) => e.key !== key);
  };

  const availableMetadataKeys = computed(() => {
    const metaEntry = flattenParams(getEndpoint().params || {}).find(
      (e: any) => e.param?.type === "list" && e.param?.metadata
    );
    if (!metaEntry) return [];
    const allKeys = Object.keys(metaEntry.param.metadata || {});
    return allKeys.filter(
      (k) => !metadataEntries.value.find((e) => e.key === k)
    );
  });

  const getMetadataDef = (key: string) => {
    const metaEntry = flattenParams(getEndpoint().params || {}).find(
      (e: any) => e.param?.type === "list" && e.param?.metadata
    );
    return metaEntry?.param?.metadata?.[key];
  };

  const validate = () => {
    if (store.limitsDisabled) return true;

    const flat = flattenParams(getEndpoint().params || {});
    for (const entry of flat) {
      const key = entry.key;
      const p = entry.param as any;
      if (p.type === "list" && p.metadata) {
        for (const metaEntry of metadataEntries.value) {
          const metaDef = p.metadata[metaEntry.key];
          if (metaDef?.regex && metaEntry.value) {
            if (!new RegExp(metaDef.regex).test(String(metaEntry.value))) {
              const examplePart = metaDef.example
                ? ` Example: ${metaDef.example}`
                : "";
              const desc = metaDef.errordesc ? ` ${metaDef.errordesc}` : "";
              errors.value = `Field ${metaDef.name || metaEntry.key} does not match required format.${examplePart}${desc}`;
              return false;
            }
          }
        }
      } else {
        const fieldName = p.value || key;
        const val = formValues.value[fieldName];
        if (p.required && !val) {
          errors.value = `Field ${p.name || key} is required.`;
          return false;
        }
        if (p.regex && val && !new RegExp(p.regex).test(String(val))) {
          errors.value = `Field ${p.name || key} does not match required format.`;
          return false;
        }
      }
    }
    return true;
  };

  const buildBody = (currentEndpoint: any = getEndpoint()) => {
    let body: any = {};

    if (currentEndpoint.body) {
      const fillTemplate = (obj: any): any => {
        if (typeof obj === "string" && obj.startsWith("$")) {
          const key = obj.slice(1);
          let val = formValues.value[key];
          const param = currentEndpoint.params?.[key];
          if (param?.type === "int" || param === "int") {
            val = parseInt(val, 10);
          }
          return val;
        } else if (typeof obj === "object" && obj !== null) {
          const out = Array.isArray(obj) ? [] : {};
          for (const k in obj) (out as any)[k] = fillTemplate(obj[k]);
          return out;
        }
        return obj;
      };
      body = fillTemplate(currentEndpoint.body);
    } else if (currentEndpoint.params) {
      const flat = flattenParams(currentEndpoint.params || {});
      flat.forEach(({ key, param }: { key: string; param: any }) => {
        if (param.type === "list" && param.metadata) {
          if (metadataEntries.value.length > 0) {
            const meta: any = {};
            metadataEntries.value.forEach((e) => {
              if (e.value !== "") {
                meta[e.key] = e.value;
              }
            });
            if (Object.keys(meta).length > 0) body.metadata = meta;
          }
        } else {
          const fieldName = param.value || key;
          let val = formValues.value[fieldName];
          if (param.type === "int" || param === "int") {
            val = parseInt(val, 10);
          }

          const parts = key.split(".");
          let current = body;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
          }
          current[parts[parts.length - 1]] = val;
        }
      });
    }
    return body;
  };

  const handleSubmit = async (
    onResponse: (val: string) => void,
    beforeSubmit: () => void
  ) => {
    errors.value = null;
    if (!store.identityToken) {
      errors.value = "Upload JSON first!";
      notify(
        "error",
        "Token missing",
        "You need to upload a valid identity file first"
      );
      return;
    }

    if (store.isTokenExpired) {
      errors.value = "Token has expired";
      notify("error", "Token expired", "Upload a fresh identity file");
      return;
    }

    if (!validate()) return;

    beforeSubmit();
    isSubmitting.value = true;

    // Cancel any previous request
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    // Capture current values before async operations
    const currentGeneration = requestGeneration;
    const currentEndpoint = { ...getEndpoint() }; // Capture endpoint snapshot
    const body = buildBody(currentEndpoint);

    try {
      // Check if endpoint changed before proceeding
      if (currentGeneration !== requestGeneration) {
        isSubmitting.value = false;
        return;
      }

      const baseUrl = "https://subway.prod.sybo.net";

      if (currentEndpoint.type === "json") {
        const res = await fetch(
          store.corsProxy + baseUrl + currentEndpoint.endpoint,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${store.identityToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            signal: abortController.signal
          }
        );
        const data = await res.json();
        if (currentGeneration === requestGeneration) {
          onResponse(JSON.stringify(data, null, 2));
        }
      } else {
        // Connect-gRPC
        const transport = createConnectTransport({
          baseUrl: store.corsProxy + baseUrl + "/rpc",
          useBinaryFormat: true,
          interceptors: [
            (next) => async (req) => {
              req.header.set("Authorization", `Bearer ${store.identityToken}`);
              req.header.set(
                "User-Agent",
                "grpc-dotnet/2.63.0 (Mono Unity; CLR 4.0.30319.17020; netstandard2.0; arm64) com.kiloo.subwaysurf/3.47.0"
              );
              return await next(req);
            }
          ]
        });

        let client: any;
        const path = currentEndpoint.endpoint.replace("/rpc/", "/");
        let methodName = path.split("/").pop();

        if (methodName) {
          methodName = methodName.charAt(0).toLowerCase() + methodName.slice(1);
        }

        if (path.includes("player.ext.v1")) {
          client = createPromiseClient(PlayerService, transport);
        } else if (path.includes("friends.ext.v1")) {
          client = createPromiseClient(FriendsService, transport);
        } else if (path.includes("wallet.ext.v1")) {
          client = createPromiseClient(WalletService, transport);
        } else if (path.includes("tournament.ext.v2")) {
          client = createPromiseClient(TournamentService, transport);
        }

        if (client && methodName && client[methodName]) {
          const response = await client[methodName](body, {
            signal: abortController?.signal
          });
          if (currentGeneration === requestGeneration) {
            const plainResponse = JSON.parse(JSON.stringify(response));
            onResponse(JSON.stringify(plainResponse, null, 2));
          }
        } else {
          throw new Error(`Service or method ${methodName} not found`);
        }
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }
      if (currentGeneration === requestGeneration) {
        console.error(err);
        onResponse(`Error: ${err.message}`);
      }
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleAutofill = () => {
    try {
      const input = playerDataJson.value.trim();
      if (!input) return;
      const parsed = JSON.parse(input);
      const userData = parsed.userData;
      if (!userData) {
        notify(
          "error",
          "Invalid JSON",
          "JSON must contain { userData: {...} }"
        );
        return;
      }

      if (userData.name) formValues.value["name"] = userData.name;
      if (userData.level !== undefined)
        formValues.value["level"] = userData.level;
      if (userData.highscore !== undefined)
        formValues.value["highscore"] = userData.highscore;

      if (Array.isArray(userData.metadataMap)) {
        metadataEntries.value = [];
        userData.metadataMap
          .slice(0, 20)
          .forEach(([key, value]: [string, any]) => {
            metadataEntries.value.push({ key, value });
          });
      }
    } catch (err: any) {
      notify("error", "Invalid JSON", err.message);
    }
  };

  const hasMetadataParam = computed(() => {
    return flattenParams(endpoint.params || {}).some(
      (e: any) => e.param?.type === "list" && e.param?.metadata
    );
  });

  const onAddMetadata = () => {
    if (metadataSelection.value) {
      addMetadataEntry(metadataSelection.value);
      metadataSelection.value = "";
    }
  };

  return {
    formValues,
    metadataEntries,
    errors,
    isSubmitting,
    playerDataJson,
    metadataSelection,
    availableMetadataKeys,
    hasMetadataParam,
    initializeForm,
    addMetadataEntry,
    removeMetadataEntry,
    getMetadataDef,
    validate,
    buildBody,
    handleSubmit,
    handleAutofill,
    onAddMetadata
  };
}
