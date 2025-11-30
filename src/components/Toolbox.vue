<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import { getAllWidgets } from '../widgets'
import type { WidgetType } from '../types/widget'
import Icon from './Icon.vue'

const store = useDesignerStore()

// Get all widgets from registry
const widgets = getAllWidgets()

function handleDragStart(event: DragEvent, type: WidgetType) {
  store.draggedWidgetType = type
  store.isDraggingWidget = false
  // Reset offsets when dragging from toolbox
  store.dragOffsetX = 0
  store.dragOffsetY = 0
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
  }
}
</script>

<template>
  <aside
    :class="[
      'w-64 bg-gray-900 border-r border-gray-700 flex flex-col shrink-0 transition-transform duration-300',
      store.isToolboxVisible ? 'translate-x-0' : '-translate-x-full absolute'
    ]"
  >
    <!-- Toolbox Header -->
    <div class="px-4 py-3 border-b border-gray-700">
      <h2 class="text-sm font-semibold text-gray-200 uppercase tracking-wider">
        Widgets
      </h2>
    </div>
    
    <!-- Scrollable Widget List -->
    <div class="flex-1 overflow-y-auto p-2 custom-scrollbar">
      <div class="space-y-1">
        <div
          v-for="widget in widgets"
          :key="widget.type"
          class="group flex items-center justify-between p-2.5 rounded-lg bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-all"
          draggable="true"
          @dragstart="handleDragStart($event, widget.type as WidgetType)"
        >
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <Icon :icon="widget.icon" size="20" class="text-indigo-400 shrink-0" />
            <span class="text-sm text-gray-200 truncate">{{ widget.label }}</span>
          </div>
          <button
            @click="store.addWidget(widget.type as WidgetType)"
            class="p-1 rounded hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            title="Add to canvas"
          >
            <Icon icon="plus-circle" size="18" class="text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
