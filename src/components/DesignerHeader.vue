<script setup lang="ts">
import { ref } from 'vue'
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()
const showAboutModal = ref(false)
</script>

<template>
  <header class="h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 z-50">
    <!-- Left Section -->
    <div class="flex items-center gap-4">
      <h1 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Icon icon="widgets" size="24" class="text-indigo-500 dark:text-indigo-400" />
        ESPHome LVGL UI Builder
      </h1>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-2">
      <!-- Primary Action: Generate YAML -->
      <button
        @click="store.showYamlModal = true"
        class="px-4 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
        title="Generate YAML"
      >
        <Icon icon="code-tags" size="18" />
        <span class="hidden sm:inline">YAML</span>
      </button>
      
      <!-- Preview -->
      <button
        @click="store.showPreviewModal = true"
        class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
        title="Preview (Interactive Mode)"
      >
        <Icon icon="eye" size="18" />
        <span class="hidden sm:inline">Preview</span>
      </button>
      
      <!-- Import -->
      <button
        @click="store.showImportModal = true"
        class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
        title="Import YAML"
      >
        <Icon icon="file-upload" size="18" />
        <span class="hidden sm:inline">Import</span>
      </button>
      
      <!-- Help Menu (Shortcuts + About) -->
      <div class="relative group">
        <button
          class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
          title="Help & Information"
        >
          <Icon icon="help-circle" size="18" />
          <span class="hidden sm:inline">Help</span>
        </button>
        
        <!-- Dropdown Menu -->
        <div class="absolute right-0 mt-0 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <button
            @click="store.showShortcutsModal = true"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 rounded-t-lg transition-colors"
          >
            <Icon icon="keyboard" size="16" />
            Keyboard Shortcuts
          </button>
          
          <button
            @click="showAboutModal = true"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
          >
            <Icon icon="information" size="16" />
            About
          </button>
          
          <div class="border-t border-gray-200 dark:border-gray-700"></div>
          
          <div class="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 rounded-b-lg">
            <div class="font-semibold text-gray-900 dark:text-white mb-1">ESPHome LVGL UI Builder</div>
            <div class="text-gray-600 dark:text-gray-400">Version 0.0.1</div>
          </div>
        </div>
      </div>
      
      <!-- About Modal -->
      <div v-if="showAboutModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <Icon icon="information" size="20" />
              About
            </h2>
            <button
              @click="showAboutModal = false"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <Icon icon="close" size="20" />
            </button>
          </div>
          
          <!-- Content -->
          <div class="p-6 space-y-4">
            <div class="flex items-center gap-3">
              <Icon icon="widgets" size="32" class="text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white">ESPHome LVGL UI Builder</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Version 0.0.1</p>
              </div>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                A visual designer for creating LVGL UI layouts for ESPHome devices.
              </p>
              
              <div class="space-y-2 text-sm">
                <p class="text-gray-700 dark:text-gray-300">
                  <span class="font-semibold text-gray-900 dark:text-white">Features:</span>
                </p>
                <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Drag & drop widget placement</li>
                  <li>Multiple canvas support</li>
                  <li>YAML export/import</li>
                  <li>Interactive preview mode</li>
                  <li>Dark/Light theme</li>
                </ul>
              </div>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p class="text-xs text-gray-500 dark:text-gray-500 text-center mb-3">
                Built with Vue 3 & TypeScript
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
                Made by <a href="https://espboards.dev" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">ESPBoards</a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 dark:bg-gray-800 px-6 py-3 flex justify-end">
            <button
              @click="showAboutModal = false"
              class="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      <!-- Theme Toggle -->
      <button
        @click="store.toggleTheme()"
        class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        :title="store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <Icon :icon="store.theme === 'dark' ? 'weather-sunny' : 'weather-night'" size="20" />
      </button>
    </div>
  </header>
</template>
