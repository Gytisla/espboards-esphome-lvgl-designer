<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()

const shortcuts = [
  { keys: 'Escape', description: 'Deselect widget / Close modal' },
  { keys: 'Delete/Backspace', description: 'Delete selected widget' },
  { keys: '← → ↑ ↓', description: 'Move selected widget' },
  { keys: 'Ctrl/Cmd + S', description: 'Save canvas' },
  { keys: 'Ctrl/Cmd + C', description: 'Copy selected widget' },
  { keys: 'Ctrl/Cmd + X', description: 'Cut selected widget' },
  { keys: 'Ctrl/Cmd + V', description: 'Paste widget' },
  { keys: 'Ctrl/Cmd + Z', description: 'Undo last action' },
  { keys: 'Ctrl/Cmd + Shift + Z', description: 'Redo action' },
  { keys: 'Ctrl/Cmd + Y', description: 'Redo action (alternative)' },
  { keys: 'Ctrl/Cmd + P', description: 'Open Preview Mode' },
  { keys: 'Ctrl/Cmd + E', description: 'Export YAML' },
  { keys: 'Ctrl/Cmd + I', description: 'Import YAML' },
]
</script>

<template>
  <div
    v-if="store.showShortcutsModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="store.showShortcutsModal = false"
  >
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 w-full max-w-lg overflow-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon icon="keyboard" size="24" class="text-indigo-600 dark:text-indigo-400" />
          Keyboard Shortcuts
        </h2>
        <button
          @click="store.showShortcutsModal = false"
          class="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Icon icon="close" size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4">
        <table class="w-full">
          <tbody>
            <tr
              v-for="(shortcut, index) in shortcuts"
              :key="index"
              class="border-b border-gray-200 dark:border-gray-800 last:border-0"
            >
              <td class="py-3 pr-4">
                <kbd
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                >
                  {{ shortcut.keys }}
                </kbd>
              </td>
              <td class="py-3 text-sm text-gray-600 dark:text-gray-400">
                {{ shortcut.description }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          @click="store.showShortcutsModal = false"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
