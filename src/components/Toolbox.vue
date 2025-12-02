<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import { getAllWidgets } from '../widgets'
import type { WidgetType } from '../types/widget'
import Icon from './Icon.vue'
import { ref } from 'vue'

const store = useDesignerStore()

// Get all widgets from registry
const widgets = getAllWidgets()

// Categorize widgets
const widgetCategories = ref([
  {
    name: 'Containers',
    icon: 'view_agenda',
    description: 'Container & layout widgets',
    widgets: ['tabview', 'tileview']
  },
  {
    name: 'Display',
    icon: 'visibility',
    description: 'Display & feedback widgets',
    widgets: ['label', 'bar', 'arc', 'line', 'led', 'qrcode', 'spinner']
  },
  {
    name: 'Input',
    icon: 'edit',
    description: 'Input & control widgets',
    widgets: ['button', 'buttonmatrix', 'slider', 'spinbox', 'dropdown', 'checkbox', 'keyboard', 'textarea', 'roller']
  }
])

// Get widget info by type
const getWidgetInfo = (type: string) => {
  return widgets.find(w => w.type === type)
}

const expandedCategories = ref<string[]>(['Containers', 'Display', 'Input'])

const toggleCategory = (categoryName: string) => {
  const index = expandedCategories.value.indexOf(categoryName)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryName)
  }
}

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
      'w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-transform duration-300',
      store.isToolboxVisible ? 'translate-x-0' : '-translate-x-full absolute'
    ]"
  >
    <!-- Toolbox Header -->
    <div class="px-4 py-5 border-b-2 border-gray-300 dark:border-gray-600">
      <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
        Widgets
      </h2>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Drag to canvas</p>
    </div>
    
    <!-- Scrollable Widget Categories -->
    <div class="flex-1 overflow-y-auto p-3 custom-scrollbar">
      <div class="space-y-3">
        <!-- Category -->
        <div v-for="category in widgetCategories" :key="category.name" class="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <!-- Category Header -->
          <button
            @click="toggleCategory(category.name)"
            class="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
          >
            <div class="flex items-center gap-2 flex-1 min-w-0">
              <div class="text-sm font-medium">{{ category.name }}</div>
            </div>
            <Icon 
              :icon="expandedCategories.includes(category.name) ? 'chevron-up' : 'chevron-down'" 
              size="18" 
              class="text-gray-400 dark:text-gray-600 shrink-0"
            />
          </button>
          
          <!-- Category Contents -->
          <div
            v-if="expandedCategories.includes(category.name)"
            class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800"
          >
            <div
              v-for="widgetType in category.widgets"
              :key="widgetType"
              :class="[
                'group flex items-center justify-between p-3 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition-all cursor-grab active:cursor-grabbing border-l-3 border-l-transparent hover:border-l-indigo-400 dark:hover:border-l-indigo-500'
              ]"
              draggable="true"
              @dragstart="handleDragStart($event, widgetType as WidgetType)"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <Icon 
                  :icon="getWidgetInfo(widgetType)?.icon || 'widgets'" 
                  size="18" 
                  class="text-indigo-500 dark:text-indigo-400 shrink-0"
                />
                <span class="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">
                  {{ getWidgetInfo(widgetType)?.label || widgetType }}
                </span>
              </div>
              <button
                @click="store.addWidget(widgetType as WidgetType)"
                class="p-1.5 rounded opacity-40 hover:opacity-100 group-hover:opacity-60 transition-opacity shrink-0 ml-2"
                title="Add to canvas"
              >
                <Icon icon="add-circle" size="18" class="text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400" />
              </button>
            </div>
          </div>
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
