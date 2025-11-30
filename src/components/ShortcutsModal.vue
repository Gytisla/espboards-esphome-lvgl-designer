<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()

const shortcuts = [
  { keys: 'Delete/Backspace', description: 'Delete selected widget' },
  { keys: '← → ↑ ↓', description: 'Move selected widget' },
  { keys: 'Ctrl/Cmd + P', description: 'Open Preview Mode' },
  { keys: 'Ctrl/Cmd + Z', description: 'Undo (reload from localStorage)' },
  { keys: 'Ctrl/Cmd + S', description: 'Save state' },
  { keys: 'Ctrl/Cmd + G', description: 'Generate YAML' },
  { keys: 'Ctrl/Cmd + I', description: 'Import YAML' },
  { keys: 'Escape', description: 'Close modal / Deselect widget' }
]
</script>

<template>
  <div
    v-if="store.showShortcutsModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="store.showShortcutsModal = false"
  >
    <div class="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-lg">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
          <Icon icon="keyboard" size="24" class="text-indigo-400" />
          Keyboard Shortcuts
        </h2>
        <button
          @click="store.showShortcutsModal = false"
          class="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
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
              class="border-b border-gray-800 last:border-0"
            >
              <td class="py-3 pr-4">
                <kbd
                  class="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-gray-300"
                >
                  {{ shortcut.keys }}
                </kbd>
              </td>
              <td class="py-3 text-sm text-gray-400">
                {{ shortcut.description }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end p-4 border-t border-gray-700">
        <button
          @click="store.showShortcutsModal = false"
          class="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
