<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()

function copyToClipboard() {
  navigator.clipboard.writeText(store.generatedYAML)
    .then(() => alert('YAML copied to clipboard!'))
    .catch(() => alert('Failed to copy to clipboard'))
}
</script>

<template>
  <div
    v-if="store.showYamlModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="store.showYamlModal = false"
  >
    <div class="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <Icon icon="code-tags" size="24" class="text-indigo-400" />
          Generated YAML
        </h2>
        <button
          @click="store.showYamlModal = false"
          class="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Icon icon="close" size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto p-4">
        <pre class="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono border border-gray-800">{{ store.generatedYAML }}</pre>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 p-4 border-t border-gray-700">
        <button
          @click="copyToClipboard"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Icon icon="content-copy" size="18" />
          Copy to Clipboard
        </button>
        <button
          @click="store.showYamlModal = false"
          class="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
