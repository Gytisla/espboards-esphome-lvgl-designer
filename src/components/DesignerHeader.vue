<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()
</script>

<template>
  <header class="h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 z-50">
    <!-- Left Section -->
    <div class="flex items-center gap-4">
      <button
        @click="store.isToolboxVisible = !store.isToolboxVisible"
        class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Toggle Toolbox"
      >
        <Icon :icon="store.isToolboxVisible ? 'menu-open' : 'menu'" size="24" />
      </button>
      
      <h1 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Icon icon="widgets" size="24" class="text-indigo-500 dark:text-indigo-400" />
        LVGL ESPHome Designer
      </h1>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-2">
      <!-- Theme Toggle -->
      <button
        @click="store.toggleTheme()"
        class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        :title="store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Icon :icon="store.theme === 'dark' ? 'weather-sunny' : 'weather-night'" size="20" />
      </button>
      
      <button
        @click="store.showPreviewModal = true"
        class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
        title="Preview (Interactive Mode)"
      >
        <Icon icon="eye" size="18" />
        <span class="hidden sm:inline">Preview</span>
      </button>
      
      <button
        @click="store.showShortcutsModal = true"
        class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
        title="Keyboard Shortcuts"
      >
        <Icon icon="keyboard" size="18" />
        <span class="hidden sm:inline">Shortcuts</span>
      </button>
      
      <button
        @click="store.showImportModal = true"
        class="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
        title="Import YAML"
      >
        <Icon icon="file-upload" size="18" />
        <span class="hidden sm:inline">Import</span>
      </button>
      
      <button
        @click="store.showYamlModal = true"
        class="px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
        title="Generate YAML"
      >
        <Icon icon="code-tags" size="18" />
        <span class="hidden sm:inline">Generate YAML</span>
      </button>
    </div>
  </header>
</template>
