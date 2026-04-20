import { ref } from "vue";

export function useClipboard() {
  const copyText = ref("Copy");

  const onCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      copyText.value = "Copied";
      setTimeout(() => {
        copyText.value = "Copy";
      }, 1200);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return {
    copyText,
    onCopy,
  };
}
