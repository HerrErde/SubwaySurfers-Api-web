import { ref, computed } from "vue";
import { useAppStore } from "../stores/app";

export function useSidebar() {
  const store = useAppStore();
  const searchQuery = ref("");
  const fileInput = ref<HTMLInputElement | null>(null);
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

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
        position: "right top",
      });
    } else {
      alert(text);
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

        const json = JSON.parse(result);
        if (
          !json.user?.id ||
          !json.identityToken?.token ||
          !json.refreshToken?.token
        ) {
          throw new Error("JSON missing required fields");
        }

        const jwt = json.identityToken.token;
        if (!jwtPattern.test(jwt)) {
          throw new Error("Invalid JWT format");
        }

        let expiryDate: Date | null = null;
        if (json.identityToken.expiresAt) {
          expiryDate = new Date(json.identityToken.expiresAt);
          if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
            notify("error", "Token Expired", "Token has expired");
            return;
          }
        }

        store.setIdentity(jwt, expiryDate);
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
    notify(
      "success",
      "Identity removed",
      "Identity cleared from local storage",
    );
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
  };
}
