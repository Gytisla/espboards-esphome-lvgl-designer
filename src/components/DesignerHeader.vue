<script setup lang="ts">
import { ref } from 'vue'
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()
const showAboutModal = ref(false)
const showHelpDropdown = ref(false)
</script>

<template>
  <header class="min-h-14 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 z-50 py-2">
    <!-- Left Section -->
    <div class="flex items-center gap-2 min-w-0">
      <img src="/logo.png" alt="ESPHome LVGL UI Builder" class="h-10 w-10 shrink-0" />
      <!-- Short title on mobile (multi-line), full title on sm+ -->
      <h1 class="text-xs sm:text-lg font-bold text-gray-900 dark:text-white">
        <span class="sm:hidden leading-tight">
          ESPHome<br />LVGL<br />Designer
        </span>
        <span class="hidden sm:inline">ESPHome LVGL UI Builder</span>
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
      <div class="relative">
        <button
          @click="showHelpDropdown = !showHelpDropdown"
          class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1.5"
          title="Help & Information"
        >
          <Icon icon="help-circle" size="18" />
          <span class="hidden sm:inline">Help</span>
        </button>
        
        <!-- Dropdown Menu -->
        <div v-if="showHelpDropdown" class="absolute right-0 mt-0 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <router-link
            to="/help/overview"
            @click="showHelpDropdown = false"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 rounded-t-lg transition-colors"
          >
            <Icon icon="book-open" size="16" />
            Help & Docs
          </router-link>
          
          <button
            @click="() => { store.showShortcutsModal = true; showHelpDropdown = false }"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
          >
            <Icon icon="keyboard" size="16" />
            Keyboard Shortcuts
          </button>
          
          <button
            @click="() => { showAboutModal = true; showHelpDropdown = false }"
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
      <div v-if="showAboutModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="bg-indigo-600 px-6 py-3 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <h2 class="text-lg font-bold text-white">
                About
              </h2>
            </div>
            <button
              @click="showAboutModal = false"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <Icon icon="close" size="20" />
            </button>
          </div>
          
          <!-- Content (Scrollable) -->
          <div class="overflow-y-auto flex-1">
            <div class="p-5 space-y-3">
            <div class="flex flex-col items-center gap-3 pb-3">
              <img src="/logo.png" alt="ESPHome LVGL UI Builder" class="h-16 w-16" />
              <div class="text-center">
                <h3 class="font-bold text-gray-900 dark:text-white">ESPHome LVGL UI Builder</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">v0.0.1</p>
              </div>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                A free visual designer for creating beautiful graphical user interfaces for ESPHome devices. No coding required!
              </p>
              
              <div class="space-y-3 text-sm">
                <!-- Quick Start -->
                <div class="flex gap-2">
                  <div class="shrink-0">
                    <span class="text-base">🚀</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Get Started in 5 Minutes</p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      <router-link to="/help/getting-started" class="text-indigo-600 dark:text-indigo-400 hover:underline">View quick tutorial</router-link>
                    </p>
                  </div>
                </div>

                <!-- Drag & Drop -->
                <div class="flex gap-2">
                  <div class="shrink-0">
                    <span class="text-base">✨</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Drag & Drop Interface</p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      19+ widgets • Live preview • YAML export
                    </p>
                  </div>
                </div>

                <!-- Multiple Screens -->
                <div class="flex gap-2">
                  <div class="shrink-0">
                    <span class="text-base">📱</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Multiple Screens</p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      Create complex multi-screen layouts for any device
                    </p>
                  </div>
                </div>

                <!-- YAML Support -->
                <div class="flex gap-2">
                  <div class="shrink-0">
                    <span class="text-base">⚙️</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">YAML Import/Export</p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      Export to ESPHome YAML • Import existing configs
                    </p>
                  </div>
                </div>

                <!-- Interactive -->
                <div class="flex gap-2">
                  <div class="shrink-0">
                    <span class="text-base">👁️</span>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white">Interactive Preview</p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      Test interactions before deploying to your device
                    </p>
                  </div>
                </div>

                <!-- Help & Docs -->
                <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p class="text-xs text-gray-500 dark:text-gray-500 font-semibold mb-2">Need help?</p>
                  <div class="flex flex-wrap gap-2">
                    <router-link to="/help/user-guide" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      User Guide
                    </router-link>
                    <router-link to="/help/faq" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      FAQ
                    </router-link>
                    <router-link to="/help/widget-support" class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      Widgets
                    </router-link>
                  </div>
                </div>

                <!-- Buy Me a Coffee Button (Moved Higher) -->
                <div class="flex flex-col items-center gap-2">
                  <p class="text-xs text-gray-600 dark:text-gray-400 font-semibold">Support the Project</p>
                  <a 
                    href="https://www.buymeacoffee.com/espboards" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="inline-block hover:opacity-90 transition-opacity"
                  >
                    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px; width: auto;" />
                  </a>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
              <div class="flex items-center justify-center gap-2">
                <span class="text-xs text-gray-600 dark:text-gray-400">Made by</span>
                <a href="https://espboards.dev" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors">
                  <img src="/logo.png" alt="ESPBoards" class="h-4 w-4" />
                  ESPBoards
                </a>
              </div>
            </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="bg-gray-50 dark:bg-gray-800 px-6 py-3 flex justify-end shrink-0 border-t border-gray-200 dark:border-gray-700">
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
