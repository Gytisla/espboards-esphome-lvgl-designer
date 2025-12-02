<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()
const yamlInput = ref('')
const errorMessage = ref('')
const showConfirmation = ref(false)

const hasCanvasContent = computed(() => {
  const activeTab = store.canvasTabs.find(tab => tab.id === store.activeCanvasTabId)
  return activeTab && activeTab.widgets.length > 0
})

function handleImport() {
  errorMessage.value = ''
  
  // Check if canvas has content and show confirmation
  if (hasCanvasContent.value && !showConfirmation.value) {
    showConfirmation.value = true
    return
  }
  
  try {
    const success = store.importYAML(yamlInput.value)
    if (!success) {
      errorMessage.value = store.importError || 'Failed to import YAML'
      return
    }
    store.showImportModal = false
    yamlInput.value = ''
    showConfirmation.value = false
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to import YAML'
    showConfirmation.value = false
  }
}

function cancelConfirmation() {
  showConfirmation.value = false
}

function handleClose() {
  store.showImportModal = false
  yamlInput.value = ''
  errorMessage.value = ''
  showConfirmation.value = false
}
</script>

<template>
  <div
    v-if="store.showImportModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon icon="file-upload" size="24" class="text-indigo-600 dark:text-indigo-400" />
          Import YAML
        </h2>
        <button
          @click="handleClose"
          class="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Icon icon="close" size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto p-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
          <Icon icon="information-outline" size="16" />
          Paste your ESPHome LVGL YAML configuration below
        </p>
        <div class="bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-300 dark:border-gray-800 overflow-hidden">
          <textarea
            v-model="yamlInput"
            rows="15"
            class="w-full px-4 py-4 bg-transparent text-gray-900 dark:text-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
            placeholder="lvgl:&#10;  displays:&#10;    - ...&#10;  pages:&#10;    - widgets:&#10;        - ..."
          ></textarea>
        </div>
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <Icon icon="alert-circle" size="20" class="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p class="text-sm text-red-700 dark:text-red-300">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between gap-2 p-4 border-t border-gray-300 dark:border-gray-700">
        <!-- Warning message when canvas has content -->
        <div v-if="hasCanvasContent && !showConfirmation" class="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs">
          <Icon icon="alert" size="16" />
          <span>This will replace your current canvas</span>
        </div>
        <div v-else></div>
        
        <div class="flex items-center gap-2">
          <!-- Show cancel button if confirmation is active -->
          <button
            v-if="showConfirmation"
            @click="cancelConfirmation"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            v-else
            @click="handleClose"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium"
          >
            Close
          </button>
          
          <!-- Import button changes to confirmation state -->
          <button
            @click="handleImport"
            :class="[
              'px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2',
              showConfirmation
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20'
            ]"
          >
            <Icon :icon="showConfirmation ? 'check' : 'file-upload'" size="18" />
            {{ showConfirmation ? 'Confirm Replace' : 'Import YAML' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
