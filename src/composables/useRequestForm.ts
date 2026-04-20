import { ref, computed, watch, isRef, unref } from "vue";
import type { Ref } from "vue";
import { useAppStore } from "../stores/app";
import type { Endpoint } from "../stores/app";
import { ApiClient } from "../api/ApiClient";

export function useRequestForm(endpoint: Endpoint | Ref<Endpoint | null>) {
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

  interface Param {
    type?: string;
    metadata?: Record<
      string,
      {
        regex?: string;
        example?: string;
        errordesc?: string;
        name?: string;
        options?: string[];
        type?: string;
        desc?: string;
      }
    >;
    regex?: string;
    example?: string;
    required?: boolean;
    default?: any;
    name?: string;
    value?: string;
  }

  const isLeafParam = (p: Param) => {
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

  const flattenParams = (
    params: Record<string, any>,
    prefix = ""
  ): Array<{ key: string; param: Param }> => {
    const out: Array<{ key: string; param: Param }> = [];
    if (!params) return out;
    for (const [k, v] of Object.entries(params)) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      if (isLeafParam(v)) {
        out.push({ key: fullKey, param: v });
      } else {
        out.push(...flattenParams(v as Record<string, any>, fullKey));
      }
    }
    return out;
  };

  const getParamsFor = (ep: any): Record<string, any> => {
    if (!ep) return {};
    return ep.pathParams ?? ep.bodyParams ?? {};
  };

  const normalizeParamValue = (param: Param, value: any): any => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    if (param?.type === "int") {
      const parsed = parseInt(String(value), 10);
      return Number.isNaN(parsed) ? undefined : parsed;
    }

    return value;
  };

  const pruneEmpty = (value: any): any => {
    if (Array.isArray(value)) {
      const next = value
        .map((entry) => pruneEmpty(entry))
        .filter((entry) => entry !== undefined);
      return next.length > 0 ? next : undefined;
    }

    if (value && typeof value === "object") {
      const next = Object.fromEntries(
        Object.entries(value)
          .map(([key, entry]) => [key, pruneEmpty(entry)])
          .filter(([, entry]) => entry !== undefined)
      );
      return Object.keys(next).length > 0 ? next : undefined;
    }

    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "number" && Number.isNaN(value)) {
      return undefined;
    }

    return value;
  };

  const isArrayIndex = (segment: string) => /^\d+$/.test(segment);

  const setNestedValue = (target: any, path: string[], value: any) => {
    let current = target;

    for (let i = 0; i < path.length - 1; i++) {
      const segment = path[i];
      const nextSegment = path[i + 1];
      const nextIsIndex = isArrayIndex(nextSegment);

      if (isArrayIndex(segment)) {
        const index = Number(segment);
        if (!Array.isArray(current)) {
          return;
        }
        if (current[index] === undefined) {
          current[index] = nextIsIndex ? [] : {};
        }
        current = current[index];
      } else {
        if (current[segment] === undefined) {
          current[segment] = nextIsIndex ? [] : {};
        }
        current = current[segment];
      }
    }

    const lastSegment = path[path.length - 1];
    if (isArrayIndex(lastSegment)) {
      if (!Array.isArray(current)) {
        return;
      }
      current[Number(lastSegment)] = value;
      return;
    }

    current[lastSegment] = value;
  };

  const initializeForm = () => {
    formValues.value = {};
    metadataEntries.value = [];
    errors.value = null;
    playerDataJson.value = "";

    const params = getParamsFor(getEndpoint());
    if (params && Object.keys(params).length > 0) {
      const flat = flattenParams(params || {});
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
    const metaEntry = flattenParams(getParamsFor(getEndpoint()) || {}).find(
      (e: any) => e.param?.type === "list" && e.param?.metadata
    );
    if (!metaEntry) return [];
    const allKeys = Object.keys(metaEntry.param.metadata || {});
    return allKeys.filter(
      (k) => !metadataEntries.value.find((e) => e.key === k)
    );
  });

  const getMetadataDef = (key: string) => {
    const metaEntry = flattenParams(getParamsFor(getEndpoint()) || {}).find(
      (e: any) => e.param?.type === "list" && e.param?.metadata
    );
    return metaEntry?.param?.metadata?.[key];
  };

  const validate = () => {
    if (store.limitsDisabled) return true;

    const flat = flattenParams(getParamsFor(getEndpoint()) || {});
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

  const buildBody = (
    currentEndpoint: any = getEndpoint()
  ): Record<string, any> => {
    if (!currentEndpoint) return {};
    let body: Record<string, any> = {};

    if (currentEndpoint.body) {
      const fillTemplate = (obj: any): any => {
        if (typeof obj === "string" && obj.startsWith("$")) {
          const key = obj.slice(1);
          const param = currentEndpoint.bodyParams?.[key];
          const val = formValues.value[key];
          return normalizeParamValue(param, val);
        } else if (typeof obj === "object" && obj !== null) {
          const out = Array.isArray(obj) ? [] : {};
          for (const k in obj) (out as any)[k] = fillTemplate(obj[k]);
          return out;
        }
        return obj;
      };
      body = fillTemplate(currentEndpoint.body);
    } else {
      const params = getParamsFor(currentEndpoint);
      const flat = flattenParams(params || {});
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
          const val = normalizeParamValue(param, formValues.value[fieldName]);

          if (val === undefined) {
            return;
          }

          setNestedValue(body, key.split("."), val);
        }
      });
    }
    return pruneEmpty(body) ?? {};
  };

  const handleSubmit = async (
    onResponse: (val: string) => void,
    beforeSubmit: () => void
  ) => {
    errors.value = null;
    if (!store.identityToken) {
      // errors.value = "Upload JSON first!";
      notify(
        "error",
        "Token missing",
        "You need to upload a valid identity file first"
      );
      return;
    }

    if (store.isTokenExpired) {
      // errors.value = "Token has expired";
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

      const client = ApiClient.getInstance();

      // Build pathParams for any placeholders like :uuid in the endpoint
      const pathParams: Record<string, string> = {};
      const paramsForEndpoint = getParamsFor(currentEndpoint);
      if (paramsForEndpoint) {
        for (const [pkey, pdef] of Object.entries(paramsForEndpoint)) {
          try {
            if (
              currentEndpoint.endpoint &&
              String(currentEndpoint.endpoint).includes(`:${pkey}`)
            ) {
              const fieldName = (pdef as any).value || pkey;
              const val = formValues.value[fieldName];
              if (val !== undefined && val !== null && String(val) !== "") {
                pathParams[pkey] = String(val);
              }
            }
          } catch (e) {
            // ignore malformed param definitions
          }
        }
      }

      const data = await client.request(currentEndpoint as Endpoint, {
        body,
        pathParams
      });
      if (currentGeneration === requestGeneration) {
        onResponse(
          JSON.stringify(
            data,
            (_, v) => (typeof v === "bigint" ? v.toString() : v),
            2
          )
        );
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
    return flattenParams(getParamsFor(getEndpoint()) || {}).some(
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
