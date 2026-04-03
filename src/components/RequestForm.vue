<script setup lang="ts">
import { toRef } from "vue";
import { useRequestForm } from "../composables/useRequestForm";

const props = defineProps<{
  endpoint: any;
}>();

const emit = defineEmits<{
  (e: "response", val: string): void;
  (e: "before-submit"): void;
}>();

const {
  formValues,
  metadataEntries,
  errors,
  isSubmitting,
  playerDataJson,
  metadataSelection,
  availableMetadataKeys,
  hasMetadataParam,
  removeMetadataEntry,
  getMetadataDef,
  handleSubmit,
  handleAutofill,
  onAddMetadata
} = useRequestForm(toRef(props, "endpoint"));

const handleFormSubmit = async () => {
  await handleSubmit(
    (val) => emit("response", val),
    () => emit("before-submit")
  );
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="hasMetadataParam" class="space-y-2">
      <label class="block text-sm font-medium text-gray-300"
        >Paste userData JSON</label
      >
      <textarea
        v-model="playerDataJson"
        rows="2"
        class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"
        placeholder='{"playerData":{...}}'></textarea>
      <button
        @click="handleAutofill"
        type="button"
        class="bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-3 py-1 rounded-lg text-sm transition-colors cursor-pointer">
        Autofill from JSON
      </button>
    </div>

    <form @submit.prevent="handleFormSubmit" class="space-y-4">
      <div v-for="(param, key) in endpoint.params" :key="key">
        <div v-if="param.type === 'list' && param.metadata" class="space-y-3">
          <label class="block text-sm font-medium text-gray-300">{{
            param.name
          }}</label>

          <div class="flex items-center gap-2">
            <select
              v-model="metadataSelection"
              class="flex-1 px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]">
              <option value="" disabled selected>Select a key...</option>
              <option v-for="k in availableMetadataKeys" :key="k" :value="k">
                {{ k }}
              </option>
            </select>
            <button
              @click="onAddMetadata"
              type="button"
              class="p-2 rounded-md bg-[#1a1a1a] border border-[#333] hover:bg-[#252525] cursor-pointer">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <div class="space-y-2">
            <div
              v-for="entry in metadataEntries"
              :key="entry.key"
              class="p-3 rounded-md bg-[#121212] border border-[#333] space-y-2">
              <div class="flex items-center gap-2">
                <label
                  class="rounded-md bg-[#121212] text-white border border-[#333] px-2 py-1 text-left text-sm font-semibold truncate"
                  style="width: 350px">
                  {{ entry.key }}
                </label>
                <button
                  @click="removeMetadataEntry(entry.key)"
                  type="button"
                  class="p-1 rounded-md bg-[#1a1a1a] border border-[#333] hover:bg-red-900/20 hover:border-red-900 cursor-pointer">
                  <i class="fa-solid fa-minus"></i>
                </button>
              </div>

              <select
                v-if="getMetadataDef(entry.key).options"
                v-model="entry.value"
                class="rounded-md bg-[#121212] text-white border border-[#333] px-2 py-1 text-left metadata-input-select"
                style="width: 350px">
                <option
                  v-for="opt in getMetadataDef(entry.key).options"
                  :key="opt"
                  :value="opt">
                  {{ opt }}
                </option>
              </select>
              <input
                v-else
                v-model="entry.value"
                :type="
                  getMetadataDef(entry.key).type === 'int' ? 'number' : 'text'
                "
                :placeholder="getMetadataDef(entry.key).example || ''"
                class="rounded-md bg-[#121212] text-white border border-[#333] px-2 py-1 text-left metadata-input-select"
                style="width: 350px" />
              <p
                v-if="getMetadataDef(entry.key).desc"
                class="text-xs text-gray-500">
                {{ getMetadataDef(entry.key).desc }}
              </p>
            </div>
          </div>
          <p class="text-xs text-gray-500">Max 20 Keys, every key only once.</p>
        </div>

        <div v-else class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">{{
            param.name || key
          }}</label>
          <input
            v-model="formValues[param.value || key]"
            :type="param.type === 'int' ? 'number' : 'text'"
            :placeholder="param.example || ''"
            :required="param.required"
            class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]" />
          <p v-if="param.desc" class="text-xs text-gray-500">
            {{ param.desc }}
          </p>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto bg-[#ffcc99] hover:bg-[#ee9e4f] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <i v-if="!isSubmitting" class="fas fa-paper-plane"></i>
          <div
            v-else
            class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
          {{ isSubmitting ? "Sending..." : "Send Request" }}
        </button>
      </div>

      <div
        v-if="errors"
        class="text-red-500 text-sm font-medium mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
        {{ errors }}
      </div>
    </form>
  </div>
</template>
