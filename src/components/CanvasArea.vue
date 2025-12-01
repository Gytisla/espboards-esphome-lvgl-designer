<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDesignerStore } from '../stores/designer'
import type { Widget } from '../types/widget'
import WidgetRenderer from './WidgetRenderer.vue'
import Icon from './Icon.vue'

const store = useDesignerStore()

// Tab renaming
const renamingTabId = ref<string | null>(null)
const renamingTabName = ref('')

function startRenameTab(tabId: string, currentName: string) {
  renamingTabId.value = tabId
  renamingTabName.value = currentName
}

function finishRenameTab() {
  if (renamingTabId.value && renamingTabName.value.trim()) {
    store.renameCanvasTab(renamingTabId.value, renamingTabName.value.trim())
  }
  renamingTabId.value = null
  renamingTabName.value = ''
}

function cancelRenameTab() {
  renamingTabId.value = null
  renamingTabName.value = ''
}

// Tab closing confirmation
const showCloseConfirmation = ref(false)
const tabToClose = ref<string | null>(null)
const tabToCloseName = ref('')

function requestCloseTab(tabId: string, tabName: string) {
  tabToClose.value = tabId
  tabToCloseName.value = tabName
  showCloseConfirmation.value = true
}

function confirmCloseTab() {
  if (tabToClose.value) {
    store.removeCanvasTab(tabToClose.value)
  }
  showCloseConfirmation.value = false
  tabToClose.value = null
  tabToCloseName.value = ''
}

function cancelCloseTab() {
  showCloseConfirmation.value = false
  tabToClose.value = null
  tabToCloseName.value = ''
}

// Keyboard shortcuts
function handleKeyDown(event: KeyboardEvent) {
  // Check if user is typing in an input field
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return
  }
  
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey
  
  // ESC - Deselect widget
  if (event.key === 'Escape' && store.selectedWidgetId) {
    event.preventDefault()
    store.selectWidget(null)
  }
  
  // Ctrl/Cmd + C - Copy widget
  if (ctrlOrCmd && event.key.toLowerCase() === 'c' && store.selectedWidgetId) {
    event.preventDefault()
    store.copyWidget(store.selectedWidgetId)
  }
  
  // Ctrl/Cmd + X - Cut widget
  if (ctrlOrCmd && event.key.toLowerCase() === 'x' && store.selectedWidgetId) {
    event.preventDefault()
    store.cutWidget(store.selectedWidgetId)
  }
  
  // Ctrl/Cmd + V - Paste widget
  if (ctrlOrCmd && event.key.toLowerCase() === 'v' && store.clipboard) {
    event.preventDefault()
    store.pasteWidget()
  }
  
  // Ctrl/Cmd + P - Open Preview Mode
  if (ctrlOrCmd && event.key.toLowerCase() === 'p') {
    event.preventDefault()
    store.showPreviewModal = true
  }
  
  // Ctrl/Cmd + E - Export YAML
  if (ctrlOrCmd && event.key.toLowerCase() === 'e') {
    event.preventDefault()
    store.showYamlModal = true
  }
  
  // Ctrl/Cmd + I - Import YAML
  if (ctrlOrCmd && event.key.toLowerCase() === 'i') {
    event.preventDefault()
    store.showImportModal = true
  }
  
  // Ctrl/Cmd + Z - Undo
  if (ctrlOrCmd && event.key.toLowerCase() === 'z' && !event.shiftKey) {
    event.preventDefault()
    store.undo()
  }
  
  // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
  if ((ctrlOrCmd && event.key.toLowerCase() === 'z' && event.shiftKey) || 
      (ctrlOrCmd && event.key.toLowerCase() === 'y')) {
    event.preventDefault()
    store.redo()
  }
  
  // Delete/Backspace - Delete selected widget
  if ((event.key === 'Delete' || event.key === 'Backspace') && store.selectedWidgetId) {
    event.preventDefault()
    store.deleteWidget(store.selectedWidgetId)
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

const resolutions = [
  '128x64',
  '128x128',
  '240x320',
  '320x240',
  '480x320',
  '800x480'
]

const scales = [0.5, 1, 2, 3]

function handleCanvasDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = store.isDraggingWidget ? 'move' : 'copy'
  }
}

function handleCanvasDrop(event: DragEvent) {
  event.preventDefault()
  const canvas = event.currentTarget as HTMLElement
  const rect = canvas.getBoundingClientRect()
  
  // Calculate raw drop position without offset (for nested containers)
  let rawDropX = (event.clientX - rect.left) / store.currentScale
  let rawDropY = (event.clientY - rect.top) / store.currentScale
  
  // Calculate drop position with offset (for canvas drops)
  let dropX = rawDropX - store.dragOffsetX
  let dropY = rawDropY - store.dragOffsetY
  
  // Snap to grid
  dropX = Math.max(0, Math.round(dropX / 10) * 10)
  dropY = Math.max(0, Math.round(dropY / 10) * 10)
  
  // Helper function to find widget by ID recursively (including nested in tabs/tiles)
  const findWidgetById = (id: string, widgets: any[]): any => {
    for (const widget of widgets) {
      if (widget.id === id) return widget
      
      // Search in tabview tabs
      if (widget.tabs) {
        for (const tab of widget.tabs) {
          if (tab.widgets) {
            const found = findWidgetById(id, tab.widgets)
            if (found) return found
          }
        }
      }
      
      // Search in tileview tiles
      if (widget.tiles) {
        for (const tile of widget.tiles) {
          if (tile.widgets) {
            const found = findWidgetById(id, tile.widgets)
            if (found) return found
          }
        }
      }
    }
    return null
  }
  
  // Get absolute position of a widget by traversing through parent containers
  const getAbsolutePosition = (widget: any, widgets: any[]): { x: number, y: number } => {
    // Find parent container
    for (const w of widgets) {
      // Check if widget is in a tab
      if (w.tabs) {
        for (const tab of w.tabs) {
          if (tab.widgets?.some((tw: any) => tw.id === widget.id)) {
            // Widget is in this tab, add parent's position
            const parentPos = getAbsolutePosition(w, widgets)
            return {
              x: parentPos.x + (widget.x || 0),
              y: parentPos.y + (widget.y || 0)
            }
          }
          // Recursively check nested widgets
          if (tab.widgets) {
            const childPos = getAbsolutePositionInArray(widget, tab.widgets, widgets)
            if (childPos) {
              const parentPos = getAbsolutePosition(w, widgets)
              return {
                x: parentPos.x + childPos.x,
                y: parentPos.y + childPos.y
              }
            }
          }
        }
      }
      
      // Check if widget is in a tile
      if (w.tiles) {
        for (const tile of w.tiles) {
          if (tile.widgets?.some((tw: any) => tw.id === widget.id)) {
            // Widget is in this tile, add parent's position
            const parentPos = getAbsolutePosition(w, widgets)
            return {
              x: parentPos.x + (widget.x || 0),
              y: parentPos.y + (widget.y || 0)
            }
          }
          // Recursively check nested widgets
          if (tile.widgets) {
            const childPos = getAbsolutePositionInArray(widget, tile.widgets, widgets)
            if (childPos) {
              const parentPos = getAbsolutePosition(w, widgets)
              return {
                x: parentPos.x + childPos.x,
                y: parentPos.y + childPos.y
              }
            }
          }
        }
      }
    }
    
    // Widget is at top level
    return {
      x: widget.x || 0,
      y: widget.y || 0
    }
  }
  
  const getAbsolutePositionInArray = (widget: any, widgetArray: any[], rootWidgets: any[]): { x: number, y: number } | null => {
    for (const w of widgetArray) {
      if (w.id === widget.id) {
        return { x: widget.x || 0, y: widget.y || 0 }
      }
    }
    return null
  }
  
  // Check if dropped onto containers - check most specific (innermost) first
  const targetElement = document.elementFromPoint(event.clientX, event.clientY)
  
  // Check for tileview first (more specific than tabview if nested inside)
  const tileElement = targetElement?.closest('[data-tile-id]')
  const tileviewContent = targetElement?.closest('[data-tileview-content]')
  const tileviewParentId = tileviewContent?.getAttribute('data-parent-id')
  const tileviewWidget = tileviewParentId ? findWidgetById(tileviewParentId, store.widgets) : null
  
  // Check for tabview
  const tabviewContent = targetElement?.closest('[data-tabview-content]')
  const tabviewParentId = tabviewContent?.getAttribute('data-parent-id')
  const tabviewWidget = tabviewParentId ? findWidgetById(tabviewParentId, store.widgets) : null
  
  // Priority: tileview tile > tileview > tabview > canvas
  if (tileElement && tileviewWidget && tileviewWidget.type === 'tileview' && tileviewWidget.tiles) {
    // Dropped inside a specific tile of a tileview
    const tileId = tileElement.getAttribute('data-tile-id')
    const tile = tileviewWidget.tiles.find((t: any) => t.id === tileId)
    
    if (tile) {
      // Get the tileview element's bounding rect to calculate position relative to it
      const tileviewElement = tileElement.closest('[data-tileview-content]') as HTMLElement
      const tileviewRect = tileviewElement?.getBoundingClientRect()
      
      if (tileviewRect) {
        // Account for tileview padding (default 4px)
        const tileviewPadding = tileviewWidget.pad_all || 4
        
        // Calculate position relative to the tileview's content area (after padding)
        const relativeX = (event.clientX - tileviewRect.left - tileviewPadding) / store.currentScale - store.dragOffsetX
        const relativeY = (event.clientY - tileviewRect.top - tileviewPadding) / store.currentScale - store.dragOffsetY
        
        if (store.isDraggingWidget && store.selectedWidget) {
          // Moving existing widget - check if it's already in this tile
          const isAlreadyInTile = tile.widgets?.some((w: any) => w.id === store.selectedWidget?.id)
          if (isAlreadyInTile) {
            // Just update position
            store.selectedWidget.x = relativeX
            store.selectedWidget.y = relativeY
            store.saveState()
          }
        } else if (store.draggedWidgetType) {
          // Create new widget inside tile at position 0,0
          const newWidget = store.createWidgetForTab(store.draggedWidgetType, 0, 0)
          if (!tile.widgets) tile.widgets = []
          tile.widgets.push(newWidget)
          // Trigger reactivity
          tileviewWidget.tiles = [...tileviewWidget.tiles]
          store.saveState()
        }
      }
    }
  } else if (tabviewWidget && tabviewWidget.type === 'tabview' && tabviewWidget.tabs) {
    // Dropped inside a tabview - add to active tab
    const activeTabIndex = tabviewWidget.selectedTabIndex || 0
    const activeTab = tabviewWidget.tabs[activeTabIndex]
    
    if (activeTab) {
      // Get absolute position of the tabview on canvas
      const tabviewAbsPos = getAbsolutePosition(tabviewWidget, store.widgets)
      
      // Get tabview position and content area offset
      const tabSize = tabviewWidget.tab_size || 40
      let contentOffsetX = 0
      let contentOffsetY = 0
      
      // Calculate content area offset based on tab position
      const tabPos = tabviewWidget.tab_pos || 'TOP'
      if (tabPos === 'TOP') {
        contentOffsetY = tabSize
      } else if (tabPos === 'LEFT') {
        contentOffsetX = tabSize
      }
      // BOTTOM and RIGHT don't offset the content
      
      // Calculate position relative to tab content area using raw coordinates
      const relativeX = rawDropX - tabviewAbsPos.x - contentOffsetX - store.dragOffsetX
      const relativeY = rawDropY - tabviewAbsPos.y - contentOffsetY - store.dragOffsetY
      
      if (store.isDraggingWidget && store.selectedWidget) {
        // Moving existing widget - check if it's already in this tab
        const isAlreadyInTab = activeTab.widgets?.some((w: any) => w.id === store.selectedWidget?.id)
        if (isAlreadyInTab) {
          // Just update position
          store.selectedWidget.x = relativeX
          store.selectedWidget.y = relativeY
          store.saveState()
        }
      } else if (store.draggedWidgetType) {
        // Create new widget inside tab at position 0,0
        const newWidget = store.createWidgetForTab(store.draggedWidgetType, 0, 0)
        if (!activeTab.widgets) activeTab.widgets = []
        activeTab.widgets.push(newWidget)
        store.saveState()
      }
    }
  } else {
    // Normal drop on canvas
    if (store.isDraggingWidget && store.selectedWidget) {
      store.selectedWidget.x = dropX
      store.selectedWidget.y = dropY
      store.saveState()
    } else if (store.draggedWidgetType) {
      store.addWidget(store.draggedWidgetType, dropX, dropY)
    }
  }
  
  // Reset drag state
  store.isDraggingWidget = false
  store.draggedWidgetType = null
  store.dragOffsetX = 0
  store.dragOffsetY = 0
}

function handleWidgetClick(event: MouseEvent, widget: Widget) {
  event.stopPropagation()
  store.selectWidget(widget.id)
}

function handleWidgetDragStart(event: DragEvent, widget: Widget) {
  event.stopPropagation()
  store.isDraggingWidget = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    
    // Create a custom drag image that's not scaled
    const dragElement = event.target as HTMLElement
    const clone = dragElement.cloneNode(true) as HTMLElement
    
    // Style the clone to appear unscaled and positioned offscreen
    clone.style.position = 'absolute'
    clone.style.top = '-1000px'
    clone.style.left = '-1000px'
    clone.style.transform = 'none' // Remove any transforms
    clone.style.zIndex = '9999'
    
    document.body.appendChild(clone)
    
    // Set the custom drag image at the correct offset
    const rect = dragElement.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top
    event.dataTransfer.setDragImage(clone, offsetX / store.currentScale, offsetY / store.currentScale)
    
    // Clean up the clone after a short delay
    setTimeout(() => {
      document.body.removeChild(clone)
    }, 0)
  }
  
  // Calculate offset from the widget's position (accounting for scale)
  const canvas = (event.target as HTMLElement).closest('#canvas') as HTMLElement
  if (canvas) {
    const canvasRect = canvas.getBoundingClientRect()
    // Calculate mouse position in canvas coordinates (unscaled)
    const mouseXInCanvas = (event.clientX - canvasRect.left) / store.currentScale
    const mouseYInCanvas = (event.clientY - canvasRect.top) / store.currentScale
    
    // Store the offset from widget's top-left corner
    store.dragOffsetX = mouseXInCanvas - widget.x
    store.dragOffsetY = mouseYInCanvas - widget.y
  }
  
  store.selectWidget(widget.id)
}

// Resize handling
const isResizing = ref(false)
const resizingWidgetId = ref<string | null>(null)
const resizeStartX = ref(0)
const resizeStartY = ref(0)
const resizeStartWidth = ref(0)
const resizeStartHeight = ref(0)

function handleResizeStart(event: MouseEvent, widget: Widget) {
  event.stopPropagation()
  event.preventDefault()
  
  isResizing.value = true
  resizingWidgetId.value = widget.id
  
  const canvas = document.getElementById('canvas')
  if (canvas) {
    const canvasRect = canvas.getBoundingClientRect()
    resizeStartX.value = (event.clientX - canvasRect.left) / store.currentScale
    resizeStartY.value = (event.clientY - canvasRect.top) / store.currentScale
  }
  
  resizeStartWidth.value = widget.width || 100
  resizeStartHeight.value = widget.height || 100
  
  store.selectWidget(widget.id)
  
  // Add global mouse event listeners
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
}

function handleResizeMove(event: MouseEvent) {
  if (!isResizing.value || !resizingWidgetId.value) return
  
  const widget = store.widgets.find(w => w.id === resizingWidgetId.value)
  if (!widget) return
  
  const canvas = document.getElementById('canvas')
  if (!canvas) return
  
  const canvasRect = canvas.getBoundingClientRect()
  const currentX = (event.clientX - canvasRect.left) / store.currentScale
  const currentY = (event.clientY - canvasRect.top) / store.currentScale
  
  const deltaX = currentX - resizeStartX.value
  const deltaY = currentY - resizeStartY.value
  
  // Calculate new dimensions (minimum 20px)
  let newWidth = Math.max(20, resizeStartWidth.value + deltaX)
  let newHeight = Math.max(20, resizeStartHeight.value + deltaY)
  
  // Constrain to canvas boundaries (max size = canvas width/height - widget position)
  const maxWidth = store.canvasWidth - widget.x
  const maxHeight = store.canvasHeight - widget.y
  newWidth = Math.min(newWidth, maxWidth)
  newHeight = Math.min(newHeight, maxHeight)
  
  // Snap to grid (10px)
  newWidth = Math.round(newWidth / 10) * 10
  newHeight = Math.round(newHeight / 10) * 10
  
  widget.width = newWidth
  widget.height = newHeight
}

function handleResizeEnd() {
  if (isResizing.value) {
    isResizing.value = false
    resizingWidgetId.value = null
    store.saveState()
    
    document.removeEventListener('mousemove', handleResizeMove)
    document.removeEventListener('mouseup', handleResizeEnd)
  }
}

function getWidgetStyle(widget: Widget) {
  return {
    left: `${widget.x}px`,
    top: `${widget.y}px`,
    width: widget.width !== undefined ? `${widget.width}px` : 'auto',
    height: widget.height !== undefined ? `${widget.height}px` : 'auto',
    zIndex: store.selectedWidgetId === widget.id ? 50 : widget.zIndex
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-100 dark:bg-gray-800">
    <!-- Canvas Tabs Bar -->
    <div class="shrink-0 bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex items-center">
      <div class="flex-1 flex items-center overflow-x-auto">
        <div
          v-for="tab in store.canvasTabs"
          :key="tab.id"
          @click="store.switchCanvasTab(tab.id)"
          :class="[
            'group relative flex items-center gap-2 px-4 py-2 text-sm border-r border-gray-300 dark:border-gray-700 cursor-pointer transition-colors min-w-0',
            store.activeCanvasTabId === tab.id
              ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-150 dark:hover:bg-gray-850'
          ]"
        >
          <Icon icon="web" size="16" class="shrink-0" />
          
          <!-- Tab name (editable) -->
          <input
            v-if="renamingTabId === tab.id"
            v-model="renamingTabName"
            @blur="finishRenameTab"
            @keydown.enter="finishRenameTab"
            @keydown.esc="cancelRenameTab"
            @click.stop
            class="flex-1 min-w-0 px-1 py-0.5 bg-gray-700 text-white text-sm border border-indigo-500 rounded focus:outline-none"
            autofocus
          />
          <span
            v-else
            @dblclick.stop="startRenameTab(tab.id, tab.name)"
            class="flex-1 min-w-0 truncate"
            :title="tab.name"
          >
            {{ tab.name }}
          </span>
          
          <!-- Close button (hidden for single tab) -->
          <button
            v-if="store.canvasTabs.length > 1"
            @click.stop="requestCloseTab(tab.id, tab.name)"
            class="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-900/20 hover:text-red-400 rounded transition-all"
            title="Close tab"
          >
            <Icon icon="close" size="14" />
          </button>
        </div>
      </div>
      
      <!-- Add new tab button -->
      <button
        @click="store.addCanvasTab()"
        class="shrink-0 px-3 py-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-850 border-l border-gray-700 transition-colors"
        title="Add new canvas tab"
      >
        <Icon icon="plus" size="16" />
      </button>
    </div>

    <!-- Canvas Toolbar -->
    <div class="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- Undo/Redo buttons -->
        <div class="flex items-center gap-1">
          <button
            @click="store.undo()"
            :disabled="!store.canUndo"
            :class="[
              'px-2 py-1 text-xs rounded transition-colors flex items-center gap-1',
              store.canUndo
                ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            ]"
            title="Undo (Ctrl+Z)"
          >
            <Icon icon="undo" size="16" />
            <span class="hidden sm:inline">Undo</span>
          </button>
          <button
            @click="store.redo()"
            :disabled="!store.canRedo"
            :class="[
              'px-2 py-1 text-xs rounded transition-colors flex items-center gap-1',
              store.canRedo
                ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            ]"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Icon icon="redo" size="16" />
            <span class="hidden sm:inline">Redo</span>
          </button>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Resolution Select -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-400">Resolution:</label>
          <select
            v-model="store.canvasResolution"
            @change="store.updateCanvasSize()"
            class="px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option v-for="res in resolutions" :key="res" :value="res">
              {{ res }}
            </option>
          </select>
        </div>
        
        <!-- Scale Controls -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Zoom:</span>
          <div class="flex gap-1">
            <button
              v-for="scale in scales"
              :key="scale"
              @click="store.setScale(scale)"
              :class="[
                'px-2 py-1 text-xs rounded border transition-colors',
                store.currentScale === scale
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700'
              ]"
            >
              {{ scale }}×
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Canvas Viewport -->
    <div class="flex-1 overflow-auto flex items-center justify-center p-4 custom-scrollbar">
      <div
        id="canvas"
        :style="{
          width: store.canvasWidth + 'px',
          height: store.canvasHeight + 'px',
          transform: `scale(${store.currentScale})`,
          transformOrigin: 'center center',
          backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }"
        @dragover="handleCanvasDragOver"
        @drop="handleCanvasDrop"
        @click="$event.target === $event.currentTarget && store.selectWidget(null)"
        class="relative bg-gray-900 border-2 border-gray-700 shadow-2xl transition-all duration-200"
      >
        <!-- Widgets -->
        <div
          v-for="widget in store.widgets"
          :key="widget.id"
          :class="[
            'absolute border rounded-md cursor-move select-none min-w-5 min-h-5',
            'flex items-center justify-center shadow-lg',
            'hover:shadow-xl transition-shadow',
            store.selectedWidgetId === widget.id
              ? 'border-2 border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.3)] z-50 ring-2 ring-indigo-400/50'
              : 'border-gray-600'
          ]"
          :style="getWidgetStyle(widget)"
          :data-widget-id="widget.id"
          :data-widget-type="widget.type"
          draggable="true"
          @click="handleWidgetClick($event, widget)"
          @dragstart="handleWidgetDragStart($event, widget)"
        >
          <WidgetRenderer :widget="widget" />
          
          <!-- Resize handle (bottom-right corner) -->
          <div
            v-if="store.selectedWidgetId === widget.id"
            @mousedown="handleResizeStart($event, widget)"
            class="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 border border-white cursor-se-resize hover:bg-indigo-400 transition-colors"
            style="transform: translate(50%, 50%)"
            title="Drag to resize"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Close Tab Confirmation Modal -->
    <div
      v-if="showCloseConfirmation"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="cancelCloseTab"
    >
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center gap-3 p-4 border-b border-gray-300 dark:border-gray-700">
          <div class="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Icon icon="warning" size="24" class="text-red-600 dark:text-red-400" />
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Close Canvas Tab?</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <p class="text-gray-700 dark:text-gray-300 mb-2">
            Are you sure you want to close <span class="font-semibold text-indigo-600 dark:text-indigo-400">"{{ tabToCloseName }}"</span>?
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            All widgets in this canvas will be permanently deleted.
          </p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-2 p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            @click="cancelCloseTab"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmCloseTab"
            class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="delete" size="16" />
            Close Tab
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1f2937;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 6px;
  border: 2px solid #1f2937;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

.custom-scrollbar::-webkit-scrollbar-corner {
  background: #1f2937;
}
</style>
