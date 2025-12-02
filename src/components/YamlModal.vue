<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDesignerStore } from '../stores/designer'
import Icon from './Icon.vue'

const store = useDesignerStore()
const copied = ref(false)

function copyToClipboard() {
  navigator.clipboard.writeText(store.generatedYAML)
    .then(() => {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    })
    .catch(() => alert('Failed to copy to clipboard'))
}


// Simple YAML syntax highlighting
const highlightedYAML = computed(() => {
  const yaml = store.generatedYAML
  
  // Apply basic syntax highlighting
  return yaml
    .split('\n')
    .map(line => {
      // Comments
      if (line.trim().startsWith('#')) {
        return `<span class="text-gray-500 dark:text-gray-500">${escapeHtml(line)}</span>`
      }
      
      // Keys (before colon)
      const keyMatch = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*):/)
      if (keyMatch) {
        const indent = keyMatch[1]
        const key = keyMatch[2]
        const rest = line.substring(keyMatch[0].length)
        return `${indent}<span class="text-blue-600 dark:text-blue-400 font-semibold">${key}</span>:<span class="text-gray-800 dark:text-gray-300">${escapeHtml(rest)}</span>`
      }
      
      // List items
      if (line.trim().startsWith('-')) {
        return line.replace(/^(\s*)(-)(.*)$/, '$1<span class="text-purple-600 dark:text-purple-400">$2</span><span class="text-gray-800 dark:text-gray-300">$3</span>')
      }
      
      // Numbers
      return escapeHtml(line).replace(/\b(\d+)\b/g, '<span class="text-orange-600 dark:text-orange-400">$1</span>')
    })
    .join('\n')
})

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
</script>

<template>
  <div
    v-if="store.showYamlModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="store.showYamlModal = false"
  >
    <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon icon="code-tags" size="24" class="text-indigo-600 dark:text-indigo-400" />
          Generated YAML
        </h2>
        <button
          @click="store.showYamlModal = false"
          class="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Icon icon="close" size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto rounded-b-lg">
        <div class="bg-gray-50 dark:bg-gray-950 rounded-b-lg relative group hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
          <!-- Copy button (floating top-right) -->
          <button
            @click="copyToClipboard"
            :class="[
              'sticky top-3 right-3 ml-auto p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium shadow-lg backdrop-blur-sm',
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-50/90 dark:bg-gray-950/90 text-gray-700 dark:text-gray-300 group-hover:bg-gray-100/90 dark:group-hover:bg-gray-900/90'
            ]"
            style="z-index: 20; margin-right: 12px; margin-top: 12px;"
          >
            <Icon :icon="copied ? 'check' : 'content-copy'" size="18" />
            <span v-if="copied" class="text-xs">Copied!</span>
          </button>
          
          <!-- Visual highlighted YAML -->
          <pre 
            class="text-sm overflow-x-auto font-mono leading-relaxed relative p-4 cursor-pointer" 
            style="margin-top: -48px;"
            v-html="highlightedYAML"
            @click="copyToClipboard"
          ></pre>
        </div>
      </div>
    </div>
  </div>
</template>
