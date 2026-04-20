<script setup lang="ts">
import { useInfoModal } from "../composables/useInfoModal";

defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const {
  showSettings,
  corsProxyInput,
  limitsDisabled,
  saveCorsProxy,
  toggleLimits,
} = useInfoModal();
</script>

<template>
  <div
    v-if="show"
    id="info-modal"
    class="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-[rgba(0,0,0,0.5)] p-3 sm:items-center sm:p-6"
    @click.self="emit('close')"
  >
    <div
      class="relative w-full max-w-3xl overflow-y-auto rounded-xl bg-[#18181b] p-6 text-white max-h-[calc(100dvh-1.5rem)] sm:p-9 sm:max-h-[90vh]"
    >
      <button
        @click="emit('close')"
        type="button"
        id="info-modal-close"
        class="rounded-full p-2 inline-flex items-center justify-center text-gray-400 bg-transparent hover:text-white hover:bg-gray-700 transition-colors duration-200 absolute right-2 top-2 text-xl cursor-pointer"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="flex h-full flex-col gap-5">
        <section class="mb-2 flex flex-col items-center justify-center gap-2">
          <div class="w-full text-center text-sm">
            <p>
              You are using an unofficial tool. <br />This is not affiliated
              with or endorsed by the original game developers.
            </p>
          </div>
        </section>

        <section>
          <h3 class="text-lg font-semibold">Identity file</h3>
          <p class="text-sm">
            In your file Explorer, go into the folder
            <code class="bg-gray-800 text-green-400 px-1 rounded"
              >Android/data/com.kiloo.subwaysurf/</code
            >
            which is your game directory.
          </p>
          <p class="text-sm">
            From there you find the folder
            <code class="bg-gray-800 text-green-400 px-1 rounded"
              >/auth/subway-prod/</code
            >
            which contains the
            <code class="bg-gray-800 text-blue-400 px-1 rounded">identity</code>
            file.
          </p>
          <p class="text-sm">
            Move the file to a more accessible location, such as
            <code class="bg-gray-800 text-green-400 px-1 rounded"
              >Downloads</code
            >
            so you can easily access it with the file picker.
          </p>
        </section>

        <section>
          <h3 class="text-lg font-semibold">Docs</h3>
          <p class="text-sm">
            If you want to have a bit more explainations about what each
            endpoint does you can read about it here
            <a
              target="_blank"
              href="https://github.com/HerrErde/SubwaySurfers-Api"
              class="text-blue-400 font-bold cursor-pointer"
              >HerrErde/SubwaySurfers-Api</a
            >
            or
            <a
              target="_blank"
              href="https://github.com/HerrErde/SubwaySurfersCity-Api"
              class="text-blue-400 font-bold cursor-pointer"
              >HerrErde/SubwaySurfersCity-Api</a
            >.
          </p>
        </section>

        <div class="text-sm sm:text-base">
          <ul class="my-3 flex flex-col gap-2 font-medium">
            <li
              class="bg-base-200 border-base-content/10 rounded-xl border-2 p-3"
            >
              This page runs mostly in your browser.<br />
              Your
              <code class="bg-gray-800 text-yellow-400 px-1 rounded"
                >identityToken</code
              >
              is used to authenticate requests to the API and is
              <strong>never shared</strong>.<br />
              A
              <code class="bg-gray-800 text-orange-400 px-1 rounded"
                >Cloudflare Worker</code
              >
              acts as a CORS proxy, enabling requests that would normally be
              blocked by browser security policies.<br />
              The proxy simply forwards requests and responses and
              <strong>does not log or store your data</strong>.<br />
              You can change the CORS proxy URL below if you prefer to use a
              different proxy service. (it has to work with POST requests)<br />
            </li>
          </ul>
        </div>

        <details
          class="w-full max-w-lg mx-auto bg-[#1a1a1a] rounded-xl p-6 text-sm text-gray-300 border border-gray-600 overflow-hidden"
          :open="showSettings"
        >
          <summary
            @click.prevent="showSettings = !showSettings"
            class="cursor-pointer select-none font-semibold text-lg text-white mb-2 list-none flex justify-between items-center"
          >
            Settings
            <i
              :class="[
                'fa-solid fa-chevron-down text-gray-400 transition-transform duration-300',
                showSettings ? 'rotate-180' : '',
              ]"
            ></i>
          </summary>

          <div class="space-y-6 mt-4">
            <section class="w-full text-center">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="limitsDisabled"
                  @change="toggleLimits"
                  class="sr-only peer"
                />
                <div
                  class="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                  style="overflow: hidden"
                ></div>
                <span class="ms-3 text-sm font-medium text-gray-300"
                  >Disable Limits</span
                >
              </label>
            </section>

            <section class="w-full text-left">
              <div class="relative w-full max-w-md mx-auto">
                <label class="block mb-2">
                  <span class="block text-gray-300 font-semibold mb-1"
                    >CORS Proxy</span
                  >
                  <div class="relative">
                    <input
                      v-model="corsProxyInput"
                      type="text"
                      placeholder="https://cors-anywhere.com/?url="
                      class="h-10 w-full rounded-md bg-[#121212] px-3 font-thin text-white outline-none drop-shadow-sm transition-all duration-200 focus:bg-gray-800"
                    />
                    <button
                      @click="saveCorsProxy"
                      class="absolute top-0 right-0 h-full w-16 rounded-r-md bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-800 transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                  <span class="block mt-1 text-xs text-gray-500">
                    Url format: https://cors-anywhere.com/?url=REQUEST_URL
                  </span>
                </label>
              </div>
            </section>
          </div>
        </details>

        <div class="grow"></div>
        <section class="w-full text-center text-sm">
          <a
            target="_blank"
            href="https://github.com/HerrErde/SubwaySurfers-Api-web"
            class="hover:text-white cursor-pointer"
            >Source</a
          >
          &middot;
          <a
            target="_blank"
            href="https://github.com/HerrErde/SubwaySurfers-Api"
            class="hover:text-white cursor-pointer"
            >SS Api-Docs</a
          >
          &middot;
          <a
            target="_blank"
            href="https://github.com/HerrErde/SubwaySurfersCity-Api"
            class="hover:text-white cursor-pointer"
            >SSC Api-Docs</a
          >
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="checkbox"].peer:checked + div::after {
  content: "";
  transform: translateX(100%);
}

input[type="checkbox"].peer + div::after {
  content: "";
}

/* Hide scrollbars while keeping overflow scrollable */
#info-modal {
  scrollbar-width: none;
}

#info-modal::-webkit-scrollbar {
  display: none;
}

#info-modal > div {
  scrollbar-width: none;
}

#info-modal > div::-webkit-scrollbar {
  display: none;
}
</style>
