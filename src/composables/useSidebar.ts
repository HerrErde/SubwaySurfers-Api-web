import { ref, computed } from "vue";
import { useAppStore } from "../stores/app";

export function useSidebar() {
  const store = useAppStore();
  const searchQuery = ref("");
  const fileInput = ref<HTMLInputElement | null>(null);
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

  const notify = (
    status: "error" | "success" | "info",
    title: string,
    text: string
  ) => {
    const NotifyCtor = (window as Window).Notify;
    if (typeof NotifyCtor === "function") {
      new NotifyCtor({
        status,
        title,
        text,
        effect: "fade",
        speed: 300,
        showIcon: false,
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

  const parseIdentityJson = (identity: string | object) => {
    try {
      const json =
        typeof identity === "string" ? JSON.parse(identity) : identity;

      let jwt: string | null = null;
      let expiryDate: Date | null = null;

      if (json.identityToken?.token) {
        jwt = json.identityToken.token;
        if (json.identityToken.expiresAt) {
          expiryDate = new Date(json.identityToken.expiresAt);
          if (isNaN(expiryDate.getTime())) expiryDate = null;
        }
      } else {
        throw new Error("JSON missing required fields");
      }

      if (!jwt || !jwtPattern.test(jwt)) {
        throw new Error("Invalid JWT format");
      }

      const parseJwtExp = (token: string): number | null => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return typeof payload.exp === "number" ? payload.exp : null;
        } catch {
          return null;
        }
      };

      if (!expiryDate) {
        const exp = parseJwtExp(jwt);
        if (exp) expiryDate = new Date(exp * 1000);
      }

      if (expiryDate && expiryDate < new Date()) {
        notify("error", "Token Expired", "Token has expired");
        store.clearIdentity();
        return false;
      }

      store.setIdentity(jwt, expiryDate);
      notify("success", "Identity loaded", "Identity pasted successfully");
      return true;
    } catch (err) {
      notify("error", "Invalid JSON", "Please paste a valid identity JSON");
      store.clearIdentity();
      return false;
    }
  };

  const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (!file.name.startsWith("identity")) {
      alert('Please select a file named "identity"');
      target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = ev.target?.result;
        if (typeof result !== "string") return;

        const ok = parseIdentityJson(result);
        if (!ok) {
          target.value = "";
        }
      } catch (err) {
        notify("error", "Invalid file", "Please select a valid identity file");
        store.clearIdentity();
        target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const triggerUpload = () => {
    fileInput.value?.click();
  };

  const removeIdentity = () => {
    if (!store.identityToken) {
      notify("error", "No Identity", "No identity is currently stored.");
      return;
    }
    const ok = confirm("Remove stored identity token from this browser?");
    if (!ok) return;
    store.clearIdentity();
    notify("info", "Identity removed", "Identity cleared from local storage");
  };

  const expiryDisplay = computed(() => {
    if (!store.identityExpiry) return "";
    return new Date(store.identityExpiry).toLocaleString();
  });

  const hasIdentity = computed(() => !!store.identityToken);

  return {
    searchQuery,
    fileInput,
    expiryDisplay,
    hasIdentity,
    onFileChange,
    triggerUpload,
    removeIdentity,
    parseIdentityJson
  };
}
