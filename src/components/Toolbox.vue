<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import { getAllWidgets } from '../widgets'
import type { WidgetType } from '../types/widget'
import Icon from './Icon.vue'
import { ref, computed } from 'vue'

const store = useDesignerStore()

// Get all widgets from registry
const widgets = getAllWidgets()

// Toolbox collapsed state
const isToolboxCollapsed = ref(false)
const collapsedWidth = 70 // Width when collapsed
const expandedWidth = 256 // Default width (w-64 = 256px)
const toolboxWidth = ref(expandedWidth)

// Detect if we're in mobile modal context (when showMobileToolbox is true)
const isMobileModal = computed(() => store.showMobileToolbox)

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
    widgets: ['bar', 'label', 'led', 'line', 'obj', 'qrcode', 'spinner']
  },
  {
    name: 'Input',
    icon: 'edit',
    description: 'Input & control widgets',
    widgets: ['arc', 'button', 'buttonmatrix', 'checkbox', 'dropdown', 'keyboard', 'roller', 'slider', 'spinbox', 'switch', 'textarea']
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

function toggleToolboxCollapse() {
  isToolboxCollapsed.value = !isToolboxCollapsed.value
  toolboxWidth.value = isToolboxCollapsed.value ? collapsedWidth : expandedWidth
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
      'bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300',
      isMobileModal ? 'w-full shrink' : 'shrink-0 h-screen',
      store.isToolboxVisible ? 'translate-x-0' : '-translate-x-full absolute'
    ]"
    :style="isMobileModal ? {} : { width: toolboxWidth + 'px' }"
  >
    <!-- Toolbox Header -->
    <div class="px-3 py-5 border-b-2 border-gray-300 dark:border-gray-600 flex items-center" :class="isToolboxCollapsed ? 'justify-center' : 'justify-between'">
      <h2 v-if="!isToolboxCollapsed" class="text-sm font-semibold text-gray-700 dark:text-gray-200">
        Widgets
      </h2>
      <button
        @click="toggleToolboxCollapse"
        class="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        :title="isToolboxCollapsed ? 'Expand widgets' : 'Collapse widgets'"
      >
        <Icon :icon="isToolboxCollapsed ? 'chevron-right' : 'chevron-left'" size="18" />
      </button>
    </div>
    
    <!-- Collapsed View - Quick Widget Icons (draggable) -->
    <div v-if="isToolboxCollapsed" class="flex-1 flex flex-col items-center gap-2 py-4 px-1 overflow-y-auto custom-scrollbar scroll-container">
      <!-- Containers -->
      <button
        v-for="widgetType in ['tabview', 'tileview']"
        :key="widgetType"
        draggable="true"
        @dragstart="handleDragStart($event, widgetType as any)"
        @dragend="$event.dataTransfer!.dropEffect = 'none'"
        class="flex flex-col items-center gap-0.5 p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-move active:opacity-75"
        :title="`Drag ${widgetType} to canvas`"
      >
        <Icon :icon="getWidgetInfo(widgetType)?.icon || 'widgets'" size="16" />
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-12">{{ widgetType }}</span>
      </button>
      
      <!-- Separator -->
      <div class="w-8 border-t border-gray-400 dark:border-gray-600"></div>
      
      <!-- Display -->
      <button
        v-for="widgetType in ['label', 'bar', 'arc', 'line', 'led', 'qrcode', 'spinner']"
        :key="widgetType"
        draggable="true"
        @dragstart="handleDragStart($event, widgetType as any)"
        @dragend="$event.dataTransfer!.dropEffect = 'none'"
        class="flex flex-col items-center gap-0.5 p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-move active:opacity-75"
        :title="`Drag ${widgetType} to canvas`"
      >
        <Icon :icon="getWidgetInfo(widgetType)?.icon || 'widgets'" size="16" />
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-12">{{ widgetType }}</span>
      </button>
      
      <!-- Separator -->
      <div class="w-8 border-t border-gray-400 dark:border-gray-600"></div>
      
      <!-- Input -->
      <button
        v-for="widgetType in ['button', 'buttonmatrix', 'slider', 'spinbox', 'dropdown', 'checkbox', 'keyboard', 'textarea', 'roller', 'switch']"
        :key="widgetType"
        draggable="true"
        @dragstart="handleDragStart($event, widgetType as any)"
        @dragend="$event.dataTransfer!.dropEffect = 'none'"
        class="flex flex-col items-center gap-0.5 p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-move active:opacity-75"
        :title="`Drag ${widgetType} to canvas`"
      >
        <Icon :icon="getWidgetInfo(widgetType)?.icon || 'widgets'" size="16" />
        <span class="text-xs font-medium text-gray-600 dark:text-gray-400 truncate max-w-12">{{ widgetType }}</span>
      </button>
    </div>
    
    <!-- Scrollable Widget Categories -->
    <div v-if="!isToolboxCollapsed" class="flex-1 overflow-y-auto p-3 custom-scrollbar scroll-container">
      <!-- Helper Text -->
      <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">Drag & Drop</p>
        <p class="text-xs text-blue-600 dark:text-blue-400">Select a widget and drag it onto the canvas to add it to your design.</p>
      </div>
      
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
