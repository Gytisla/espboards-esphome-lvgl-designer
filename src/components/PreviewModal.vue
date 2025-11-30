<script setup lang="ts">
import { useDesignerStore } from '../stores/designer'
import { ref } from 'vue'
import Icon from './Icon.vue'
import WidgetRenderer from './WidgetRenderer.vue'
import TabviewPreviewRenderer from './TabviewPreviewRenderer.vue'
import type { Widget } from '../types/widget'

const store = useDesignerStore()
const previewScale = ref(1)
const isDraggingArc = ref(false)
const draggingArcWidget = ref<Widget | null>(null)
const isDraggingSlider = ref(false)
const draggingSliderWidget = ref<Widget | null>(null)

const previewScales = [0.5, 0.75, 1, 1.5, 2]

function handleClose() {
  store.showPreviewModal = false
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
    updateArcValue(widget, event)
    event.stopPropagation()
  }
}

function handleSliderMouseDown(widget: Widget, event: MouseEvent) {
  if (widget.type === 'slider') {
    isDraggingSlider.value = true
    draggingSliderWidget.value = widget
    updateSliderValue(widget, event)
    event.stopPropagation()
  }
}

function handleCanvasMouseMove(event: MouseEvent) {
  if (isDraggingArc.value && draggingArcWidget.value) {
    updateArcValue(draggingArcWidget.value, event)
  } else if (isDraggingSlider.value && draggingSliderWidget.value) {
    updateSliderValue(draggingSliderWidget.value, event)
  }
}

function handleCanvasMouseUp() {
  isDraggingArc.value = false
  draggingArcWidget.value = null
  isDraggingSlider.value = false
  draggingSliderWidget.value = null
}

function updateArcValue(widget: Widget, event: MouseEvent) {
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
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="handleClose"
      >
        <div class="w-full h-full max-w-[95vw] max-h-[95vh] bg-gray-900 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <!-- Modal Header -->
          <div class="shrink-0 bg-gray-950 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Icon icon="eye" size="24" class="text-indigo-400" />
              <div>
                <h2 class="text-lg font-bold text-white">Preview Mode</h2>
                <p class="text-xs text-gray-400">Interactive view - Drag arcs & sliders, click buttons & switches</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <!-- Scale Controls -->
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-gray-400">Zoom:</span>
                <div class="flex gap-1">
                  <button
                    v-for="scale in previewScales"
                    :key="scale"
                    @click="previewScale = scale"
                    :class="[
                      'px-2 py-1 text-xs rounded border transition-colors',
                      previewScale === scale
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                    ]"
                  >
                    {{ scale }}x
                  </button>
                </div>
              </div>
              
              <button
                @click="handleClose"
                class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Close Preview"
              >
                <Icon icon="close" size="24" />
              </button>
            </div>
          </div>

          <!-- Preview Canvas Area -->
          <div class="flex-1 overflow-auto flex items-center justify-center p-8 bg-gray-800">
            <div
              id="preview-canvas"
              class="relative bg-gray-900 border-2 border-gray-700 shadow-2xl"
              :style="{
                width: store.canvasWidth + 'px',
                height: store.canvasHeight + 'px',
                transform: `scale(${previewScale})`,
                transformOrigin: 'center center'
              }"
              @mousemove="handleCanvasMouseMove"
              @mouseup="handleCanvasMouseUp"
              @mouseleave="handleCanvasMouseUp"
            >
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
                <!-- Default renderer for other widgets -->
                <WidgetRenderer v-else :widget="widget" />
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
                Interactive: Arcs • Sliders • Switches • Tabs
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
</style>
