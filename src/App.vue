<script setup lang="ts">
import { onMounted } from 'vue'
import { useDesignerStore } from './stores/designer'
import DesignerHeader from './components/DesignerHeader.vue'
import Toolbox from './components/Toolbox.vue'
import CanvasArea from './components/CanvasArea.vue'
import Sidebar from './components/Sidebar.vue'
import YamlModal from './components/YamlModal.vue'
import ImportModal from './components/ImportModal.vue'
import ShortcutsModal from './components/ShortcutsModal.vue'
import PreviewModal from './components/PreviewModal.vue'

const store = useDesignerStore()

onMounted(() => {
  store.loadState()
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
    
    // Escape key should always work to close modals and blur inputs
    if (e.key === 'Escape') {
      e.preventDefault()
      // Close all modals
      store.showYamlModal = false
      store.showImportModal = false
      store.showShortcutsModal = false
      store.showPreviewModal = false
      // Blur any focused input
      if (isInput) {
        (e.target as HTMLElement).blur()
      }
      return
    }
    
    // Other shortcuts only work when not typing in inputs
    if (!isInput) {
      if (store.selectedWidget) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          store.deleteWidget(store.selectedWidget.id)
        } else if (e.key.startsWith('Arrow')) {
          e.preventDefault()
          const widget = store.selectedWidget
          if (e.key === 'ArrowLeft') widget.x = Math.max(0, widget.x - 1)
          else if (e.key === 'ArrowRight') widget.x = Math.min(store.canvasWidth, widget.x + 1)
          else if (e.key === 'ArrowUp') widget.y = Math.max(0, widget.y - 1)
          else if (e.key === 'ArrowDown') widget.y = Math.min(store.canvasHeight, widget.y + 1)
          store.saveState()
        }
      }
      
      // Global shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        store.showPreviewModal = true
      }
    }
  })
})
</script>

<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Fixed Header -->
    <DesignerHeader />
    
    <!-- Main Content Area with Sidebars -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Left Toolbox Sidebar -->
      <Toolbox />
      
      <!-- Center Canvas Area -->
      <div class="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-800">
        <CanvasArea />
      </div>
      
      <!-- Right Properties Sidebar -->
      <Sidebar />
    </div>
    
    <!-- Modals -->
    <YamlModal />
    <ImportModal />
    <ShortcutsModal />
    <PreviewModal />
  </div>
</template>
