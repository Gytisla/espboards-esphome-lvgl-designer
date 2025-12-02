<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDesignerStore } from './stores/designer'
import DesignerHeader from './components/DesignerHeader.vue'
import Toolbox from './components/Toolbox.vue'
import CanvasArea from './components/CanvasArea.vue'
import Sidebar from './components/Sidebar.vue'
import YamlModal from './components/YamlModal.vue'
import ImportModal from './components/ImportModal.vue'
import ShortcutsModal from './components/ShortcutsModal.vue'
import PreviewModal from './components/PreviewModal.vue'
import MobileWarningDialog from './components/MobileWarningDialog.vue'
import Icon from './components/Icon.vue'

const store = useDesignerStore()
const route = useRoute()

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

<style scoped>
/* Make Toolbox and Sidebar full width in mobile context */
:deep(.lg\:hidden aside) {
  width: 100% !important;
}
</style>

<template>
  <!-- Mobile Warning Dialog -->
  <MobileWarningDialog />

  <!-- Help Pages and Other Routes -->
  <router-view v-if="route.path.startsWith('/help') || route.path === '/about'" />
  
  <!-- Designer Interface (Default) -->
  <div v-else class="h-screen w-screen overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Fixed Header -->
    
    <DesignerHeader />
    
    <!-- Main Content Area with Sidebars -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Left Toolbox Sidebar - hidden on mobile -->
      <div class="hidden lg:block">
        <Toolbox />
      </div>
      
      <!-- Center Canvas Area -->
      <div class="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-800">
        <CanvasArea />
      </div>
      
      <!-- Right Properties Sidebar - hidden on mobile -->
      <div class="hidden lg:block">
        <Sidebar />
      </div>
      
      <!-- Mobile Floating Action Buttons -->
      <div class="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <!-- Properties Panel Button -->
        <button
          @click="store.showMobileSidebar = !store.showMobileSidebar"
          class="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-colors"
          title="Toggle Properties Panel"
        >
          <Icon icon="format-list-bulleted" size="24" />
        </button>
        
        <!-- Widgets Panel Button -->
        <button
          @click="store.showMobileToolbox = !store.showMobileToolbox"
          class="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors"
          title="Toggle Widgets Panel"
        >
          <Icon icon="plus" size="24" />
        </button>
      </div>
      
      <!-- Mobile Toolbox Overlay -->
      <div
        v-if="store.showMobileToolbox"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
        @click="store.showMobileToolbox = false"
      />
      <div
        v-if="store.showMobileToolbox"
        class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl z-50 max-h-[75vh] overflow-hidden flex flex-col"
      >
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Widgets</h2>
          <button
            @click="store.showMobileToolbox = false"
            class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Icon icon="close" size="20" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto w-full">
          <div class="w-full">
            <Toolbox />
          </div>
        </div>
      </div>
      
      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="store.showMobileSidebar"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
        @click="store.showMobileSidebar = false"
      />
      <div
        v-if="store.showMobileSidebar"
        class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl z-50 max-h-[75vh] overflow-hidden flex flex-col"
      >
        <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Properties</h2>
          <button
            @click="store.showMobileSidebar = false"
            class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Icon icon="close" size="20" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto w-full">
          <div class="w-full">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modals -->
    <YamlModal />
    <ImportModal />
    <ShortcutsModal />
    <PreviewModal />
  </div>
</template>
