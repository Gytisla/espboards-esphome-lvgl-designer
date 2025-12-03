<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import { ref, onMounted, onUnmounted } from 'vue'
import Icon from './Icon.vue'
import WidgetRenderer from './WidgetRenderer.vue'
import TabviewPreviewRenderer from './TabviewPreviewRenderer.vue'
import { convertColorToCss } from '../widgets/utils'
import type { Widget } from '../types/widget'

const store = useDesignerStore()
const previewScale = ref(1)
const minZoom = 0.25
const maxZoom = 3
const isDraggingArc = ref(false)
const draggingArcWidget = ref<Widget | null>(null)
const arcDragStartPos = ref({ x: 0, y: 0 })
const isDraggingSlider = ref(false)
const draggingSliderWidget = ref<Widget | null>(null)
const sliderDragStartPos = ref({ x: 0, y: 0 })

// Pan state
const isPanning = ref(false)
const panStartX = ref(0)
const panStartY = ref(0)
const panStartOffsetX = ref(0)
const panStartOffsetY = ref(0)
const panOffsetX = ref(0)
const panOffsetY = ref(0)
const isPanLocked = ref(false)

const previewScales = [0.5, 0.75, 1, 1.5, 2]

// Global mouseup/mousemove listeners for drag tracking
const handleGlobalMouseUp = () => {
  const wasDragging = isDraggingArc.value || isDraggingSlider.value
  
  isDraggingArc.value = false
  draggingArcWidget.value = null
  isDraggingSlider.value = false
  draggingSliderWidget.value = null
  isPanning.value = false
  
  // Save state if we were dragging
  if (wasDragging) {
    store.saveState()
  }
}

const handleGlobalMouseMove = (event: MouseEvent) => {
  // Only process if we're actively dragging or panning
  if (!isDraggingArc.value && !isDraggingSlider.value && !isPanning.value) {
    return
  }
  
  // Check if left mouse button is held down (buttons === 1 means left button is pressed)
  if (event.buttons !== 1 && !isPanning.value) {
    // Mouse button is not held, stop dragging
    isDraggingArc.value = false
    isDraggingSlider.value = false
    draggingArcWidget.value = null
    draggingSliderWidget.value = null
    return
  }
  
  // For arc: check if mouse has moved enough to be considered a drag (at least 3px)
  if (isDraggingArc.value && draggingArcWidget.value) {
    const dx = event.clientX - arcDragStartPos.value.x
    const dy = event.clientY - arcDragStartPos.value.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Only continue dragging if mouse moved more than 3px
    if (distance > 3) {
      updateArcValue(draggingArcWidget.value, event)
    }
  } 
  // For slider: check if mouse has moved enough to be considered a drag
  else if (isDraggingSlider.value && draggingSliderWidget.value) {
    const dx = event.clientX - sliderDragStartPos.value.x
    const dy = event.clientY - sliderDragStartPos.value.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Only continue dragging if mouse moved more than 3px
    if (distance > 3) {
      updateSliderValue(draggingSliderWidget.value, event)
    }
  } 
  // For panning
  else if (isPanning.value) {
    const deltaX = event.clientX - panStartX.value
    const deltaY = event.clientY - panStartY.value
    panOffsetX.value = panStartOffsetX.value + deltaX
    panOffsetY.value = panStartOffsetY.value + deltaY
  }
}

// Attach document-level listeners
onMounted(() => {
  document.addEventListener('mouseup', handleGlobalMouseUp)
  document.addEventListener('mousemove', handleGlobalMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mouseup', handleGlobalMouseUp)
  document.removeEventListener('mousemove', handleGlobalMouseMove)
})

function handleClose() {
  store.showPreviewModal = false
}

function handleZoomIn() {
  previewScale.value = Math.min(maxZoom, previewScale.value * 1.2)
}

function handleZoomOut() {
  previewScale.value = Math.max(minZoom, previewScale.value / 1.2)
}

function handleWheel(event: WheelEvent) {
  // Don't prevent default if scrolling on interactive widgets
  const target = event.target as HTMLElement
  if (target) {
    // Check if we're inside a roller, spinbox, or other interactive widget
    const interactiveParent = target.closest('[data-interactive="true"]')
    if (interactiveParent) {
      // Let the widget handle it
      return
    }
  }
  
  event.preventDefault()
  
  const canvas = document.getElementById('preview-canvas')
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  if (event.ctrlKey) {
    // Zoom if Ctrl is held
    const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(minZoom, Math.min(maxZoom, previewScale.value * zoomDelta))
    
    // Adjust pan to zoom towards mouse position
    const zoomChange = newZoom - previewScale.value
    panOffsetX.value -= (mouseX - rect.width / 2) * (zoomChange / previewScale.value)
    panOffsetY.value -= (mouseY - rect.height / 2) * (zoomChange / previewScale.value)
    
    previewScale.value = newZoom
  } else if (!isPanLocked.value) {
    // Pan if Ctrl is not held and pan is not locked (scroll gesture on mousepad)
    panOffsetX.value -= event.deltaX
    panOffsetY.value -= event.deltaY
  }
}

function handleWidgetClick(widget: Widget, event: MouseEvent) {
  // Interactive widget clicks
  if (widget.type === 'button') {
    console.log(`Button "${widget.text || widget.id}" clicked`)
  } else if (widget.type === 'checkbox') {
    widget.checked = !widget.checked
    store.saveState()
  } else if (widget.type === 'switch') {
    widget.value = !widget.value
    store.saveState()
  } else if (widget.type === 'led') {
    widget.value = !widget.value
    store.saveState()
  } else if (widget.type === 'arc' && widget.adjustable) {
    // Start arc dragging
    isDraggingArc.value = true
    draggingArcWidget.value = widget
    updateArcValue(widget, event)
  } else if (widget.type === 'slider') {
    // Start slider dragging
    isDraggingSlider.value = true
    draggingSliderWidget.value = widget
    updateSliderValue(widget, event)
  }
}

function handleTabClick(widget: Widget, tabIndex: number, event: MouseEvent) {
  if (widget.type === 'tabview') {
    widget.selectedTabIndex = tabIndex
    store.saveState()
    event.stopPropagation()
  }
}

function handleArcMouseDown(widget: Widget, event: MouseEvent) {
  if (widget.type === 'arc' && widget.adjustable) {
    isDraggingArc.value = true
    draggingArcWidget.value = widget
    arcDragStartPos.value = { x: event.clientX, y: event.clientY }
    updateArcValue(widget, event)
    event.stopPropagation()
  }
}

function handleSliderMouseDown(widget: Widget, event: MouseEvent) {
  if (widget.type === 'slider') {
    isDraggingSlider.value = true
    draggingSliderWidget.value = widget
    sliderDragStartPos.value = { x: event.clientX, y: event.clientY }
    updateSliderValue(widget, event)
    event.stopPropagation()
  }
}

function handleCanvasMouseDown(event: MouseEvent) {
  // Left mouse button for panning (if not locked)
  if (!isPanLocked.value && event.button === 0) {
    event.preventDefault()
    isPanning.value = true
    panStartX.value = event.clientX
    panStartY.value = event.clientY
    panStartOffsetX.value = panOffsetX.value
    panStartOffsetY.value = panOffsetY.value
  }
}

function handleCanvasMouseUp() {
  isPanning.value = false
  isDraggingArc.value = false
  draggingArcWidget.value = null
  isDraggingSlider.value = false
  draggingSliderWidget.value = null
}

function updateArcValue(widget: Widget, event: MouseEvent) {
  // Guard: only update if we're still dragging
  if (!isDraggingArc.value || !draggingArcWidget.value) {
    return
  }
  
  const canvas = document.querySelector('#preview-canvas') as HTMLElement
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const mouseX = (event.clientX - rect.left) / previewScale.value
  const mouseY = (event.clientY - rect.top) / previewScale.value
  
  // Calculate center of arc
  const cx = widget.x + (widget.width || 100) / 2
  const cy = widget.y + (widget.height || 100) / 2
  
  // Calculate angle from center to mouse
  const dx = mouseX - cx
  const dy = mouseY - cy
  let angle = Math.atan2(dy, dx) * (180 / Math.PI)
  
  // Normalize angle to 0-360
  if (angle < 0) angle += 360
  
  // Get arc configuration
  const startAngle = (widget.start_angle !== undefined ? widget.start_angle : 135) + (widget.rotation || 0)
  const endAngle = (widget.end_angle !== undefined ? widget.end_angle : 45) + (widget.rotation || 0)
  let arcSpan = endAngle - startAngle
  if (arcSpan < 0) arcSpan += 360
  
  // Calculate position on arc
  let relativeAngle = angle - startAngle
  if (relativeAngle < 0) relativeAngle += 360
  if (relativeAngle > arcSpan) relativeAngle = arcSpan
  
  // Calculate value based on mode
  const minValue = widget.min_value || 0
  const maxValue = widget.max_value || 100
  const mode = widget.arc_mode || 'NORMAL'
  
  let percentage: number
  if (mode === 'REVERSE') {
    percentage = 1 - (relativeAngle / arcSpan)
  } else if (mode === 'SYMMETRICAL') {
    percentage = (relativeAngle / arcSpan - 0.5) * 2 + 0.5
  } else { // NORMAL
    percentage = relativeAngle / arcSpan
  }
  
  // Clamp percentage
  percentage = Math.max(0, Math.min(1, percentage))
  
  // Calculate new value
  const newValue = Math.round(minValue + percentage * (maxValue - minValue))
  widget.value = newValue
  store.saveState()
}

function updateSliderValue(widget: Widget, event: MouseEvent) {
  // Guard: only update if we're still dragging
  if (!isDraggingSlider.value || !draggingSliderWidget.value) {
    return
  }
  
  const canvas = document.querySelector('#preview-canvas') as HTMLElement
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const mouseX = (event.clientX - rect.left) / previewScale.value
  
  // Calculate relative position on slider
  const sliderLeft = widget.x
  const sliderWidth = (widget.width || 150)
  
  // Calculate position relative to slider
  let relativeX = mouseX - sliderLeft
  relativeX = Math.max(0, Math.min(sliderWidth, relativeX))
  
  // Calculate percentage
  const percentage = relativeX / sliderWidth
  
  // Calculate new value
  const minValue = widget.min_value || 0
  const maxValue = widget.max_value || 100
  const newValue = Math.round(minValue + percentage * (maxValue - minValue))
  
  widget.value = newValue
  store.saveState()
}

function getWidgetStyle(widget: Widget) {
  return {
    left: `${widget.x}px`,
    top: `${widget.y}px`,
    width: widget.width !== undefined ? `${widget.width}px` : 'auto',
    height: widget.height !== undefined ? `${widget.height}px` : 'auto',
    zIndex: widget.zIndex
  }
}

function resetZoom() {
  previewScale.value = 1
  panOffsetX.value = 0
  panOffsetY.value = 0
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="store.showPreviewModal"
        class="fixed inset-0 bg-black/10 backdrop-blur-md z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="w-full h-full max-w-[95vw] max-h-[95vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <!-- Modal Header -->
          <div class="shrink-0 bg-gray-100 dark:bg-gray-950 border-b border-gray-300 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Icon icon="eye" size="24" class="text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Preview Mode</h2>
                <p class="text-xs text-gray-600 dark:text-gray-400">Interactive view - Drag arcs & sliders, click buttons & switches</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <!-- Zoom Controls - Match CanvasArea Style -->
              <div class="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                <button
                  @click="handleZoomOut"
                  :disabled="previewScale <= minZoom"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white text-xs rounded transition-colors"
                  title="Zoom out (Ctrl −)"
                >
                  −
                </button>
                
                <button
                  @click="previewScale = 0.5"
                  :class="[
                    'px-2 py-1 text-xs rounded transition-colors',
                    Math.abs(previewScale - 0.5) < 0.01
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                  title="50% zoom"
                >
                  0.5×
                </button>
                
                <button
                  @click="previewScale = 1"
                  :class="[
                    'px-2 py-1 text-xs rounded transition-colors',
                    Math.abs(previewScale - 1) < 0.01
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                  title="100% zoom"
                >
                  1×
                </button>
                
                <button
                  @click="previewScale = 1.5"
                  :class="[
                    'px-2 py-1 text-xs rounded transition-colors',
                    Math.abs(previewScale - 1.5) < 0.01
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                  title="150% zoom"
                >
                  1.5×
                </button>
                

                <button
                  @click="previewScale = 2"
                  :class="[
                    'px-2 py-1 text-xs rounded transition-colors',
                    Math.abs(previewScale - 2) < 0.01
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                  title="200% zoom"
                >
                  2×
                </button>

                <button
                  @click="previewScale = 3"
                  :class="[
                    'px-2 py-1 text-xs rounded transition-colors',
                    Math.abs(previewScale - 3) < 0.01
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                  title="300% zoom"
                >
                  3×
                </button>
                
                <button
                  @click="handleZoomIn"
                  :disabled="previewScale >= maxZoom"
                  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white text-xs rounded transition-colors"
                  title="Zoom in (Ctrl +)"
                >
                  +
                </button>
              </div>
              
              <button
                @click="resetZoom"
                class="px-3 py-1 text-xs bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                title="Reset zoom and pan"
              >
                Reset
              </button>
              
              <button
                @click="handleClose"
                class="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Close Preview"
              >
                <Icon icon="close" size="24" />
              </button>
            </div>
          </div>

          <!-- Preview Canvas Area -->
          <div class="flex-1 overflow-hidden flex items-center justify-center p-8 bg-gray-200 dark:bg-gray-800 relative">
            <!-- Pan Lock Button -->
            <button
              @click="isPanLocked = !isPanLocked"
              :class="[
                'absolute top-4 left-4 z-40 p-2 rounded-lg transition-all shadow-lg border',
                isPanLocked
                  ? 'bg-indigo-600 dark:bg-indigo-600 border-indigo-500 dark:border-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-700'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-white'
              ]"
              :title="isPanLocked ? 'Pan locked - click to unlock' : 'Pan unlocked - click to lock'"
            >
              <Icon :icon="isPanLocked ? 'lock' : 'lock-open-variant'" size="20" />
            </button>
            
            <!-- Zoom Percentage Indicator -->
            <div class="absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-gray-200 dark:border-gray-700 z-40">
              <span>{{ (previewScale * 100).toFixed(0) }}%</span>
            </div>
            
            <div
              id="preview-canvas"
              class="relative border-2 border-gray-700 shadow-2xl"
              :style="{
                width: store.canvasWidth + 'px',
                height: store.canvasHeight + 'px',
                padding: store.canvasPadding + 'px',
                backgroundColor: store.canvasBgColor,
                opacity: store.canvasBgOpa / 100,
                transform: `translate(${panOffsetX}px, ${panOffsetY}px) scale(${previewScale})`,
                transformOrigin: 'center center',
                cursor: isPanning ? 'grabbing' : 'default'
              }"
              @mousedown="handleCanvasMouseDown"
              @mouseup="handleCanvasMouseUp"
              @mouseleave="handleCanvasMouseUp"
              @wheel="handleWheel"
            >
              <!-- Padding Visual Indicator (shown when padding > 0) -->
              <div
                v-if="store.canvasPadding > 0"
                class="absolute inset-0 pointer-events-none"
                :style="{
                  border: `${store.canvasPadding}px dashed rgba(99, 102, 241, 0.3)`,
                  boxSizing: 'border-box'
                }"
              />
              
              <!-- Padding Labels (shown when padding > 0) -->
              <div
                v-if="store.canvasPadding > 0"
                class="absolute text-[10px] font-medium text-indigo-400/60 pointer-events-none select-none"
                style="top: 4px; left: 4px; z-index: 1"
              >
                {{ store.canvasPadding }}px
              </div>

              <!-- Widgets -->
              <div
                v-for="widget in store.widgets"
                :key="widget.id"
                :class="[
                  'absolute transition-all',
                  widget.type === 'button' && 'cursor-pointer hover:opacity-90',
                  widget.type === 'checkbox' && 'cursor-pointer hover:opacity-90',
                  widget.type === 'switch' && 'cursor-pointer hover:opacity-90',
                  widget.type === 'led' && 'cursor-pointer hover:opacity-90',
                  widget.type === 'arc' && widget.adjustable && 'cursor-grab active:cursor-grabbing',
                  widget.type === 'slider' && 'cursor-pointer'
                ]"
                :style="getWidgetStyle(widget)"
                @click="handleWidgetClick(widget, $event)"
                @mousedown="widget.type === 'arc' && widget.adjustable ? handleArcMouseDown(widget, $event) : widget.type === 'slider' ? handleSliderMouseDown(widget, $event) : null"
              >
                <!-- Special renderer for tabview -->
                <TabviewPreviewRenderer 
                  v-if="widget.type === 'tabview'" 
                  :widget="widget" 
                  :onTabClick="(tabIndex: number) => { widget.selectedTabIndex = tabIndex; store.saveState() }"
                />
                <!-- Default renderer for other widgets - with pointer-events-none on nested content -->
                <div v-else class="w-full h-full pointer-events-auto">
                  <WidgetRenderer :widget="widget" :isPreview="true" />
                </div>
              </div>
              
              <!-- Empty State -->
              <div
                v-if="store.widgets.length === 0"
                class="absolute inset-0 flex items-center justify-center text-gray-500"
              >
                <div class="text-center">
                  <Icon icon="widgets" size="48" class="mx-auto mb-2 opacity-50" />
                  <p class="text-sm">No widgets to preview</p>
                  <p class="text-xs mt-1">Add widgets in the designer</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer with Info -->
          <div class="shrink-0 bg-gray-950 border-t border-gray-700 px-6 py-3 flex items-center justify-between">
            <div class="flex items-center gap-4 text-xs text-gray-400">
              <span class="flex items-center gap-1.5">
                <Icon icon="widgets" size="16" />
                {{ store.widgetCount }} widget{{ store.widgetCount !== 1 ? 's' : '' }}
              </span>
              <span class="flex items-center gap-1.5">
                <Icon icon="monitor" size="16" />
                {{ store.canvasResolution }}
              </span>
              <span class="flex items-center gap-1.5 text-indigo-400">
                <Icon icon="gesture-tap" size="16" />
                Interactive: Arcs • Checkboxes • Rollers • Sliders • Spinboxes • Switches • Tabs
              </span>
            </div>
            
            <div class="text-xs text-gray-400">
              Press <kbd class="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-gray-300">Esc</kbd> to close
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
kbd {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* Hide scrollbars while keeping scroll functionality */
:deep(.flex-1) {
  overflow: hidden !important;
}

::-webkit-scrollbar {
  display: none;
}

/* For Firefox */
* {
  scrollbar-width: none;
}
</style>
