<script setup lang="ts">
import type { Widget } from '../types/widget'
import Icon from './Icon.vue'
import { useDesignerStore } from '../stores/designer'
import { ref } from 'vue'

const store = useDesignerStore()

interface Props {
  widget: Widget
  isNested?: boolean
  hoveredDropTargetId?: string | null
  isPreview?: boolean
}

const props = defineProps<Props>()

// Resize state for nested widgets
const isResizing = ref(false)
const resizingWidgetId = ref<string | null>(null)
const resizeStartX = ref(0)
const resizeStartY = ref(0)
const resizeStartWidth = ref(0)
const resizeStartHeight = ref(0)

function handleNestedWidgetClick(event: MouseEvent, childWidget: Widget) {
  event.stopPropagation()
  store.selectWidget(childWidget.id)
}

function switchTab(event: MouseEvent, widget: Widget, tabIndex: number) {
  event.stopPropagation()
  if (widget.selectedTabIndex !== tabIndex) {
    widget.selectedTabIndex = tabIndex
    store.saveState()
  }
}

function handleNestedWidgetDragStart(event: DragEvent, childWidget: Widget, parentWidget: Widget) {
  event.stopPropagation()
  store.isDraggingWidget = true
  store.selectWidget(childWidget.id)
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    
    // Create a custom drag image
    const dragElement = event.target as HTMLElement
    const clone = dragElement.cloneNode(true) as HTMLElement
    
    clone.style.position = 'absolute'
    clone.style.top = '-1000px'
    clone.style.left = '-1000px'
    clone.style.transform = 'none'
    clone.style.zIndex = '9999'
    
    document.body.appendChild(clone)
    
    const rect = dragElement.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top
    event.dataTransfer.setDragImage(clone, offsetX / store.currentScale, offsetY / store.currentScale)
    
    setTimeout(() => {
      document.body.removeChild(clone)
    }, 0)
  }
  
  // Check if parent is a tabview or tileview
  if (parentWidget.type === 'tabview') {
    // Calculate offset for tabview - coordinates are relative to tab content area
    const tabSize = parentWidget.size || parentWidget.tab_size || 10
    const tabPos = parentWidget.position || parentWidget.tab_pos || 'TOP'
    
    let contentOffsetX = 0
    let contentOffsetY = 0
    
    if (tabPos === 'TOP') contentOffsetY = tabSize
    else if (tabPos === 'LEFT') contentOffsetX = tabSize
    
    // Store offset from widget's position
    const tabviewRect = (event.target as HTMLElement).closest('[data-tabview-content]')?.getBoundingClientRect()
    if (tabviewRect) {
      const mouseXInTab = (event.clientX - tabviewRect.left) / store.currentScale
      const mouseYInTab = (event.clientY - tabviewRect.top) / store.currentScale
      
      store.dragOffsetX = mouseXInTab - childWidget.x
      store.dragOffsetY = mouseYInTab - childWidget.y
    }
  } else if (parentWidget.type === 'tileview') {
    // Calculate offset for tileview - coordinates are relative to tileview
    const tileElement = (event.target as HTMLElement).closest('[data-tile-id]')
    const tileviewRect = (event.target as HTMLElement).closest('[data-tileview-content]')?.getBoundingClientRect()
    
    if (tileviewRect) {
      // Account for tileview padding (default 4px)
      const tileviewPadding = parentWidget.pad_all || 4
      
      const mouseXInTileview = (event.clientX - tileviewRect.left - tileviewPadding) / store.currentScale
      const mouseYInTileview = (event.clientY - tileviewRect.top - tileviewPadding) / store.currentScale
      
      store.dragOffsetX = mouseXInTileview - childWidget.x
      store.dragOffsetY = mouseYInTileview - childWidget.y
    }
  }
}

function handleNestedResizeStart(event: MouseEvent, childWidget: Widget) {
  event.stopPropagation()
  event.preventDefault()
  
  isResizing.value = true
  resizingWidgetId.value = childWidget.id
  
  const tabContent = (event.target as HTMLElement).closest('[data-tabview-content]')
  if (tabContent) {
    const rect = tabContent.getBoundingClientRect()
    resizeStartX.value = (event.clientX - rect.left) / store.currentScale
    resizeStartY.value = (event.clientY - rect.top) / store.currentScale
  }
  
  resizeStartWidth.value = childWidget.width || 100
  resizeStartHeight.value = childWidget.height || 100
  
  store.selectWidget(childWidget.id)
  
  document.addEventListener('mousemove', handleNestedResizeMove)
  document.addEventListener('mouseup', handleNestedResizeEnd)
}

function handleNestedResizeMove(event: MouseEvent) {
  if (!isResizing.value || !resizingWidgetId.value) return
  
  const widget = store.selectedWidget
  if (!widget) return
  
  const tabContent = document.querySelector('[data-tabview-content]')
  if (!tabContent) return
  
  const rect = tabContent.getBoundingClientRect()
  const currentX = (event.clientX - rect.left) / store.currentScale
  const currentY = (event.clientY - rect.top) / store.currentScale
  
  const deltaX = currentX - resizeStartX.value
  const deltaY = currentY - resizeStartY.value
  
  let newWidth = Math.max(20, resizeStartWidth.value + deltaX)
  let newHeight = Math.max(20, resizeStartHeight.value + deltaY)
  
  // Constrain to tab content area boundaries
  const tabContentWidth = rect.width / store.currentScale
  const tabContentHeight = rect.height / store.currentScale
  const maxWidth = tabContentWidth - widget.x
  const maxHeight = tabContentHeight - widget.y
  newWidth = Math.min(newWidth, maxWidth)
  newHeight = Math.min(newHeight, maxHeight)
  
  newWidth = Math.round(newWidth / 10) * 10
  newHeight = Math.round(newHeight / 10) * 10
  
  widget.width = newWidth
  widget.height = newHeight
}

function handleNestedResizeEnd() {
  if (isResizing.value) {
    isResizing.value = false
    resizingWidgetId.value = null
    store.saveState()
    
    document.removeEventListener('mousemove', handleNestedResizeMove)
    document.removeEventListener('mouseup', handleNestedResizeEnd)
  }
}

// Format spinbox value with proper digit count and decimal places
function formatSpinboxValue(widget: Widget): string {
  const value = typeof widget.value === 'number' ? Math.abs(widget.value) : 0
  const digits = widget.digits || 4
  const decimalPlaces = widget.decimal_places || 0
  
  if (decimalPlaces > 0) {
    // Format with decimal places
    const formatted = value.toFixed(decimalPlaces)
    const parts = formatted.split('.')
    const intPart = (parts[0] || '0').padStart(digits - decimalPlaces, '0')
    const decPart = parts[1] || '0'
    return `${intPart}.${decPart}`
  } else {
    // Format as integer
    return value.toString().padStart(digits, '0')
  }
}

// Get maximum column index from tiles
function getMaxColumn(widget: Widget): number {
  if (!widget.tiles || !Array.isArray(widget.tiles)) return 0
  return Math.max(...widget.tiles.map((t: any) => t.column), 0)
}

// Get maximum row index from tiles
function getMaxRow(widget: Widget): number {
  if (!widget.tiles || !Array.isArray(widget.tiles)) return 0
  return Math.max(...widget.tiles.map((t: any) => t.row), 0)
}

// Convert hex color (0xRRGGBB) to CSS color
function hexToColor(hex: string | number | undefined): string {
  if (!hex) return 'currentColor'
  const hexStr = typeof hex === 'number' ? hex.toString(16).padStart(6, '0') : hex.toString()
  const cleaned = hexStr.replace('0x', '').padStart(6, '0')
  return `#${cleaned}`
}

// Get arc indicator color
function getArcColor(widget: Widget): string {
  return hexToColor(widget.indicator?.arc_color || widget.arc_color) || '#818cf8' // indigo-400
}

// Get arc width
function getArcWidth(widget: Widget): number {
  return widget.indicator?.arc_width || widget.arc_width || 8
}

// Calculate arc parameters
function getArcPath(widget: Widget): string {
  const width = widget.width || 100
  const height = widget.height || 100
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) / 2 - 10
  const value = (widget.value as number) || 50
  const minValue = widget.min_value || 0
  const maxValue = widget.max_value || 100
  
  // Use start_angle and end_angle if provided, otherwise default range
  const startAngleDeg = (widget.start_angle !== undefined ? widget.start_angle : 135) + (widget.rotation || 0)
  const endAngleDeg = (widget.end_angle !== undefined ? widget.end_angle : 45) + (widget.rotation || 0)
  
  // Calculate arc span
  let arcSpan = endAngleDeg - startAngleDeg
  if (arcSpan < 0) arcSpan += 360
  
  // Calculate percentage and indicator angle based on mode
  const percentage = ((value - minValue) / (maxValue - minValue))
  let indicatorAngle: number
  
  const mode = widget.arc_mode || 'NORMAL'
  if (mode === 'REVERSE') {
    indicatorAngle = endAngleDeg - (percentage * arcSpan)
  } else if (mode === 'SYMMETRICAL') {
    const midAngle = startAngleDeg + arcSpan / 2
    indicatorAngle = midAngle + ((percentage - 0.5) * arcSpan)
  } else { // NORMAL
    indicatorAngle = startAngleDeg + (percentage * arcSpan)
  }
  
  // Convert to radians
  const startRad = (startAngleDeg * Math.PI) / 180
  const endRad = (indicatorAngle * Math.PI) / 180
  
  // Calculate arc path
  const x1 = cx + radius * Math.cos(startRad)
  const y1 = cy + radius * Math.sin(startRad)
  const x2 = cx + radius * Math.cos(endRad)
  const y2 = cy + radius * Math.sin(endRad)
  
  const arcAngleDiff = indicatorAngle - startAngleDeg
  const largeArc = Math.abs(arcAngleDiff) > 180 ? 1 : 0
  
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
}

// Get arc knob position for adjustable arcs
function getArcKnobPosition(widget: Widget): { x: number; y: number } {
  const width = widget.width || 100
  const height = widget.height || 100
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) / 2 - 10
  const value = (widget.value as number) || 50
  const minValue = widget.min_value || 0
  const maxValue = widget.max_value || 100
  
  const startAngleDeg = (widget.start_angle !== undefined ? widget.start_angle : 135) + (widget.rotation || 0)
  const endAngleDeg = (widget.end_angle !== undefined ? widget.end_angle : 45) + (widget.rotation || 0)
  
  let arcSpan = endAngleDeg - startAngleDeg
  if (arcSpan < 0) arcSpan += 360
  
  const percentage = ((value - minValue) / (maxValue - minValue))
  const mode = widget.arc_mode || 'NORMAL'
  
  let indicatorAngle: number
  if (mode === 'REVERSE') {
    indicatorAngle = endAngleDeg - (percentage * arcSpan)
  } else if (mode === 'SYMMETRICAL') {
    const midAngle = startAngleDeg + arcSpan / 2
    indicatorAngle = midAngle + ((percentage - 0.5) * arcSpan)
  } else {
    indicatorAngle = startAngleDeg + (percentage * arcSpan)
  }
  
  const rad = (indicatorAngle * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad)
  }
}

// Calculate slider position
function getSliderKnobPosition(widget: Widget): number {
  const value = (widget.value as number) || 50
  const minValue = widget.min_value || 0
  const maxValue = widget.max_value || 100
  const width = (widget.width || 150) - 20
  
  return ((value - minValue) / (maxValue - minValue)) * width + 10
}

// Get bar fill width
function getBarFillWidth(widget: Widget): number {
  const value = (widget.value as number) || 60
  const minValue = widget.min_value || 0
  const maxValue = widget.max_value || 100
  const width = widget.width || 150
  
  return ((value - minValue) / (maxValue - minValue)) * width
}
</script>

<template>
  <!-- Arc Widget -->
  <svg v-if="widget.type === 'arc'" class="w-full h-full" :viewBox="`0 0 ${widget.width || 100} ${widget.height || 100}`">
    <!-- Background arc -->
    <circle
      :cx="(widget.width || 100) / 2"
      :cy="(widget.height || 100) / 2"
      :r="Math.min((widget.width || 100), (widget.height || 100)) / 2 - 10"
      fill="none"
      :stroke="widget.arc_color ? hexToColor(widget.arc_color) : 'currentColor'"
      :stroke-width="widget.arc_width || getArcWidth(widget)"
      :stroke-linecap="widget.arc_rounded ? 'round' : 'butt'"
      :opacity="widget.arc_opa !== undefined ? widget.arc_opa / 255 : 0.2"
      class="transition-opacity"
    />
    <!-- Indicator arc (value) -->
    <path
      :d="getArcPath(widget)"
      fill="none"
      :stroke="getArcColor(widget)"
      :stroke-width="getArcWidth(widget)"
      :stroke-linecap="widget.indicator?.arc_rounded ? 'round' : 'round'"
      :opacity="widget.indicator?.arc_opa !== undefined ? widget.indicator.arc_opa / 255 : 1"
    />
    <!-- Knob (if adjustable) -->
    <circle
      v-if="widget.adjustable"
      :cx="getArcKnobPosition(widget).x"
      :cy="getArcKnobPosition(widget).y"
      :r="(widget.knob?.radius || getArcWidth(widget) * 1.5)"
      :fill="widget.knob?.bg_color ? hexToColor(widget.knob.bg_color) : '#ffffff'"
      stroke="currentColor"
      stroke-width="2"
      class="drop-shadow-md"
    />
  </svg>

  <!-- Bar Widget -->
  <div v-else-if="widget.type === 'bar'" class="w-full h-full flex items-center p-1">
    <div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
      <div 
        class="h-full bg-indigo-500 rounded-full transition-all"
        :style="{ width: getBarFillWidth(widget) + 'px' }"
      ></div>
    </div>
  </div>

  <!-- Button Widget -->
  <div 
    v-else-if="widget.type === 'button'" 
    class="w-full h-full flex items-center justify-center rounded-lg shadow-md border-2 transition-colors"
    :style="{
      backgroundColor: widget.bg_color || '#4f46e5',
      borderColor: widget.bg_color ? widget.bg_color : '#818cf8',
      color: widget.text_color || '#ffffff'
    }"
  >
    <span class="font-medium text-sm px-2 truncate">{{ widget.text || 'Button' }}</span>
  </div>

  <!-- Checkbox Widget -->
  <div v-else-if="widget.type === 'checkbox'" class="w-full h-full flex items-center" :style="{ gap: `${widget.pad_column || 10}px` }">
    <!-- Tick box indicator -->
    <div 
      :class="[
        'flex items-center justify-center transition-all shrink-0',
        widget.checked ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-700 border-gray-500'
      ]"
      :style="{
        width: `${Math.min(widget.width || 40, widget.height || 40) * 0.4}px`,
        height: `${Math.min(widget.width || 40, widget.height || 40) * 0.4}px`,
        borderWidth: widget.indicator?.border_width ? `${widget.indicator.border_width}px` : '2px',
        borderStyle: 'solid',
        borderColor: widget.indicator?.border_color || (widget.checked ? '#4f46e5' : '#6b7280'),
        backgroundColor: widget.checked ? (widget.indicator?.bg_color || '#4f46e5') : (widget.indicator?.bg_color || '#374151'),
        borderRadius: widget.indicator?.radius ? `${widget.indicator.radius}px` : '4px',
        opacity: widget.indicator?.bg_opa ? widget.indicator.bg_opa / 100 : 1
      }"
    >
      <Icon v-if="widget.checked" icon="check" class="text-white" :size="Math.min(widget.width || 40, widget.height || 40) * 0.3" />
    </div>
    <!-- Label text -->
    <span 
      class="font-medium text-sm truncate"
      :style="{
        color: widget.text_color || '#ffffff',
        opacity: widget.text_opa ? widget.text_opa / 100 : 1
      }"
    >
      {{ widget.text || 'Checkbox' }}
    </span>
  </div>

  <!-- Switch Widget -->
  <div v-else-if="widget.type === 'switch'" class="w-full h-full flex items-center p-1">
    <div :class="[
      'relative h-full rounded-full transition-all',
      widget.value ? 'bg-indigo-600' : 'bg-gray-600'
    ]" style="width: 100%">
      <div :class="[
        'absolute top-1 w-1/2 h-[calc(100%-8px)] bg-white rounded-full transition-all shadow-md',
        widget.value ? 'right-1' : 'left-1'
      ]"></div>
    </div>
  </div>

  <!-- Slider Widget -->
  <div v-else-if="widget.type === 'slider'" class="w-full h-full flex items-center p-1">
    <div class="relative w-full h-2 bg-gray-700 rounded-full">
      <div 
        class="absolute h-full bg-indigo-500 rounded-full"
        :style="{ width: getSliderKnobPosition(widget) + 'px' }"
      ></div>
      <div 
        class="absolute w-4 h-4 bg-white rounded-full shadow-md border-2 border-indigo-500 -top-1"
        :style="{ left: (getSliderKnobPosition(widget) - 8) + 'px' }"
      ></div>
    </div>
  </div>

  <!-- Label Widget -->
  <div 
    v-else-if="widget.type === 'label'" 
    class="w-full h-full flex items-center px-2 text-xs truncate"
    :style="{
      color: widget.text_color || '#e5e7eb'
    }"
  >
    {{ widget.text || 'Label' }}
  </div>

  <!-- LED Widget -->
  <div v-else-if="widget.type === 'led'" class="w-full h-full flex items-center justify-center p-1">
    <div 
      class="w-full h-full transition-all shadow-lg"
      :style="{
        backgroundColor: widget.color || '#FF0000',
        opacity: (widget.brightness || 100) / 100,
        borderRadius: widget.radius !== undefined ? `${widget.radius}px` : '50%',
        borderWidth: widget.border_width ? `${widget.border_width}px` : '0',
        borderStyle: 'solid',
        borderColor: widget.border_color || 'transparent',
        boxShadow: widget.shadow_width 
          ? `0 0 ${widget.shadow_width}px ${widget.shadow_color || widget.color || '#FF0000'}`
          : `0 0 10px ${widget.color || '#FF0000'}80`
      }"
    ></div>
  </div>

  <!-- QR Code Widget -->
  <div v-else-if="widget.type === 'qrcode'" class="w-full h-full flex items-center justify-center p-2">
    <div class="relative bg-white rounded shadow-sm" :style="{ 
      width: 'fit-content',
      height: 'fit-content',
      backgroundColor: widget.light_color || '#FFFFFF',
      borderWidth: widget.border_width ? `${widget.border_width}px` : '0',
      borderStyle: 'solid',
      borderColor: widget.border_color || 'transparent',
      borderRadius: widget.radius ? `${widget.radius}px` : '0',
      padding: widget.pad_all ? `${widget.pad_all}px` : '8px'
    }">
      <div class="grid gap-px w-fit h-fit">
        <!-- QR Code pattern simulation (8x8 simplified grid) -->
        <div class="grid grid-cols-8 gap-px">
          <div v-for="i in 64" :key="i" 
            class="w-2 h-2"
            :style="{ 
              backgroundColor: (i % 3 === 0 || i === 1 || i === 8 || i === 57 || i === 64) 
                ? (widget.dark_color || '#000000') 
                : (widget.light_color || '#FFFFFF')
            }"
          ></div>
        </div>
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <Icon icon="qr_code_2" size="32" class="text-gray-500 opacity-30" />
      </div>
    </div>
  </div>

  <!-- Container Widget -->
  <div v-else-if="widget.type === 'container'" class="w-full h-full border-2 border-dashed border-gray-600 rounded bg-gray-800/30"></div>

  <!-- Dropdown Widget -->
  <div v-else-if="widget.type === 'dropdown'" class="w-full h-full flex items-center justify-between px-2 bg-gray-700 rounded border border-gray-600">
    <span class="text-xs text-gray-300 truncate">{{ widget.options?.[widget.selected_index || 0] || 'Select...' }}</span>
    <Icon icon="chevron-down" size="14" class="text-gray-400 shrink-0" />
  </div>

  <!-- Roller Widget -->
  <div v-else-if="widget.type === 'roller'" class="w-full h-full flex flex-col items-center justify-center overflow-hidden rounded"
    :style="{
      backgroundColor: widget.bg_color || '#374151',
      borderWidth: widget.border_width ? `${widget.border_width}px` : '1px',
      borderStyle: 'solid',
      borderColor: widget.border_color || '#4B5563',
      borderRadius: widget.radius ? `${widget.radius}px` : '0.25rem'
    }">
    <!-- Scrollable options list -->
    <div class="flex-1 w-full flex flex-col items-center justify-center relative">
      <!-- Options display -->
      <div class="w-full flex flex-col items-center" 
        :style="{ 
          color: widget.text_color || '#D1D5DB',
          gap: widget.text_line_space ? `${widget.text_line_space}px` : '4px'
        }">
        <template v-if="widget.options && widget.options.length > 0">
          <!-- Show visible rows centered around selected index -->
          <div 
            v-for="(option, index) in widget.options.slice(
              Math.max(0, (widget.selected_index || 0) - Math.floor((widget.visible_row_count || 3) / 2)),
              Math.min(widget.options.length, (widget.selected_index || 0) + Math.ceil((widget.visible_row_count || 3) / 2) + 1)
            )"
            :key="index"
            class="text-xs py-1 px-2 w-full text-center transition-all"
            :class="{
              'font-bold bg-indigo-600/30': Math.max(0, (widget.selected_index || 0) - Math.floor((widget.visible_row_count || 3) / 2)) + index === (widget.selected_index || 0),
              'opacity-50': Math.max(0, (widget.selected_index || 0) - Math.floor((widget.visible_row_count || 3) / 2)) + index !== (widget.selected_index || 0)
            }"
          >
            {{ option }}
          </div>
        </template>
        <div v-else class="text-xs opacity-50 py-1">No options</div>
      </div>
      <!-- Selection indicator (middle line) -->
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 border-t border-b border-indigo-500/30 pointer-events-none"></div>
    </div>
    <!-- Scroll arrows hint -->
    <div class="absolute top-1 right-1">
      <Icon icon="unfold_more" size="12" class="text-gray-500 opacity-50" />
    </div>
  </div>

  <!-- Textarea Widget -->
  <div 
    v-else-if="widget.type === 'textarea'" 
    class="w-full h-full p-2 rounded border text-xs font-mono overflow-hidden relative"
    :style="{
      backgroundColor: widget.bg_color || '#2d3748',
      color: widget.text_color || '#e2e8f0',
      borderColor: widget.border_color || '#4a5568',
      borderWidth: `${widget.border_width || 1}px`,
      borderRadius: `${widget.radius || 4}px`,
      padding: `${widget.pad_all || 8}px`,
      opacity: `${(widget.bg_opa || 100) / 100}`
    }"
  >
    <div :class="{ 'truncate': widget.one_line, 'whitespace-pre-wrap': !widget.one_line }">
      <template v-if="widget.text">
        <span v-if="widget.password_mode">{{ '•'.repeat(widget.text.length) }}</span>
        <span v-else>{{ widget.text }}</span>
        <span class="inline-block w-px h-3.5 bg-current animate-pulse ml-0.5"></span>
      </template>
      <template v-else-if="widget.placeholder_text">
        <span class="opacity-50">{{ widget.placeholder_text }}</span>
        <span class="inline-block w-px h-3.5 bg-current animate-pulse ml-0.5"></span>
      </template>
      <template v-else>
        <span class="opacity-50">Text area...</span>
      </template>
    </div>
    <!-- Show limits hint if max_length is set -->
    <div v-if="widget.max_length" class="absolute bottom-1 right-2 text-[10px] opacity-30">
      {{ (widget.text || '').length }}/{{ widget.max_length }}
    </div>
    <!-- Icon overlay -->
    <div class="absolute top-1 right-1 opacity-20">
      <Icon icon="text_fields" size="12" class="text-current" />
    </div>
  </div>

  <!-- Spinner Widget -->
  <div v-else-if="widget.type === 'spinner'" class="w-full h-full flex items-center justify-center relative"
    :style="{
      backgroundColor: widget.bg_color || 'transparent',
      opacity: widget.bg_opa !== undefined ? widget.bg_opa / 100 : 1
    }">
    <!-- SVG Spinner -->
    <svg class="w-full h-full animate-spin" 
      :style="{ 
        animationDuration: `${(widget.spin_time || 1000) / 1000}s` 
      }"
      viewBox="0 0 100 100">
      <!-- Background ring -->
      <circle
        cx="50"
        cy="50"
        :r="45 - (widget.arc_width || 8) / 2"
        fill="none"
        :stroke="widget.bg_color || '#4B5563'"
        :stroke-width="widget.arc_width || 8"
        opacity="0.2"
      />
      <!-- Spinning arc -->
      <circle
        cx="50"
        cy="50"
        :r="45 - (widget.arc_width || 8) / 2"
        fill="none"
        :stroke="widget.indicator?.arc_color || widget.arc_color || '#818CF8'"
        :stroke-width="widget.indicator?.arc_width || widget.arc_width || 8"
        :stroke-opacity="(widget.indicator?.arc_opa || widget.arc_opa || 100) / 100"
        :stroke-linecap="widget.arc_rounded ? 'round' : 'butt'"
        :stroke-dasharray="`${(widget.arc_length || 60) * 2.827} ${360 * 2.827 - (widget.arc_length || 60) * 2.827}`"
        transform="rotate(-90 50 50)"
      />
    </svg>
  </div>

  <!-- Spinbox Widget -->
  <div v-else-if="widget.type === 'spinbox'" class="w-full h-full flex items-center justify-center px-2 rounded"
    :style="{
      backgroundColor: widget.bg_color || '#374151',
      borderWidth: widget.border_width ? `${widget.border_width}px` : '1px',
      borderStyle: 'solid',
      borderColor: widget.border_color || '#4B5563',
      borderRadius: widget.radius ? `${widget.radius}px` : '0.25rem',
      color: widget.text_color || '#D1D5DB'
    }">
    <div class="flex items-center gap-1 font-mono text-sm">
      <!-- Show negative sign if range includes negatives -->
      <span v-if="(widget.range_from || 0) < 0" class="opacity-70">
        {{ (typeof widget.value === 'number' ? widget.value : 0) < 0 ? '-' : ' ' }}
      </span>
      <!-- Value display with formatting -->
      <span class="font-semibold tracking-wider">
        {{ formatSpinboxValue(widget) }}
      </span>
      <!-- Cursor indicator at selected digit -->
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-0.5 bg-indigo-500 animate-pulse"></div>
    </div>
    <!-- Increment/Decrement hint icons -->
    <div class="absolute top-0.5 right-1 flex flex-col gap-0">
      <Icon icon="keyboard_arrow_up" size="12" class="text-gray-500 opacity-40" />
      <Icon icon="keyboard_arrow_down" size="12" class="text-gray-500 opacity-40" />
    </div>
  </div>

  <!-- Tileview Widget -->
  <div 
    v-else-if="widget.type === 'tileview'" 
    class="w-full h-full relative overflow-hidden rounded border transition-all"
    :class="{
      'ring-2 ring-green-400 border-green-400': props.hoveredDropTargetId === widget.id
    }"
    :style="{
      backgroundColor: widget.bg_color || '#1e293b',
      opacity: (widget.bg_opa || 100) / 100,
      borderColor: props.hoveredDropTargetId === widget.id ? '#4ade80' : (widget.border_color || '#475569'),
      borderWidth: `${widget.border_width || 1}px`,
      borderRadius: `${widget.radius || 4}px`,
      padding: `${widget.pad_all || 4}px`
    }"
    :data-tileview-content="true"
    :data-parent-id="widget.id"
  >
    <!-- Grid visualization -->
    <div class="w-full h-full grid gap-0.5" 
         :style="{ 
           gridTemplateColumns: `repeat(${getMaxColumn(widget) + 1}, 1fr)`,
           gridTemplateRows: `repeat(${getMaxRow(widget) + 1}, 1fr)`
         }">
      <template v-if="widget.tiles && widget.tiles.length > 0">
        <div 
          v-for="tile in widget.tiles" 
          :key="tile.id"
          class="text-[10px] rounded transition-all relative overflow-hidden"
          :class="{
            'bg-indigo-600/40 border-2 border-indigo-500': tile.row === (widget.current_tile_row || 0) && tile.column === (widget.current_tile_column || 0),
            'bg-green-600/40 border-2 border-green-400 ring-2 ring-green-400': props.hoveredDropTargetId === tile.id,
            'bg-gray-700/50 border border-gray-600/50': tile.row !== (widget.current_tile_row || 0) || tile.column !== (widget.current_tile_column || 0) && props.hoveredDropTargetId !== tile.id
          }"
          :style="{
            gridRow: tile.row + 1,
            gridColumn: tile.column + 1
          }"
          :data-tile-id="tile.id"
          :data-tile-row="tile.row"
          :data-tile-column="tile.column"
        >
          <!-- Nested widgets in tile -->
          <template v-if="tile.widgets && tile.widgets.length > 0">
            <div
              v-for="childWidget in tile.widgets"
              :key="childWidget.id"
              draggable="true"
              @click="!props.isPreview ? handleNestedWidgetClick($event, childWidget) : null"
              @dragstart="!props.isPreview ? handleNestedWidgetDragStart($event, childWidget, widget) : null"
              :class="[
                'absolute border rounded-md cursor-move select-none min-w-5 min-h-5 shadow-md hover:shadow-lg transition-all',
                props.isPreview && 'pointer-events-none',
                store.selectedWidgetId === childWidget.id && !props.isPreview
                  ? 'border-2 border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.3)] ring-2 ring-indigo-400/50'
                  : 'border-gray-500 hover:border-gray-400'
              ]"
              :style="{
                left: childWidget.x + 'px',
                top: childWidget.y + 'px',
                width: childWidget.width !== undefined ? childWidget.width + 'px' : 'auto',
                height: childWidget.height !== undefined ? childWidget.height + 'px' : 'auto',
                zIndex: store.selectedWidgetId === childWidget.id ? 100 : childWidget.zIndex
              }"
              :data-widget-id="childWidget.id"
              :data-widget-type="childWidget.type"
              :title="`${childWidget.type} (nested in tile ${tile.id})`">
              <WidgetRenderer :widget="childWidget" :isNested="true" :hoveredDropTargetId="props.hoveredDropTargetId" :isPreview="props.isPreview" />
              
              <!-- Resize handle for nested widgets -->
              <div
                v-if="store.selectedWidgetId === childWidget.id && !props.isPreview"
                @mousedown="handleNestedResizeStart($event, childWidget)"
                class="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 border border-white cursor-se-resize hover:bg-indigo-400 transition-colors"
                style="transform: translate(50%, 50%)"
                title="Drag to resize"
              ></div>
            </div>
          </template>
          
          <!-- Tile info overlay (only show when no widgets or tile is not current) -->
          <div 
            v-if="!tile.widgets || tile.widgets.length === 0"
            class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="text-center">
              <div class="font-mono font-semibold">{{ tile.label || tile.id }}</div>
              <div class="text-[8px] opacity-50 mt-0.5">{{ tile.row }},{{ tile.column }}</div>
              <!-- Direction indicators -->
              <div class="flex gap-0.5 justify-center mt-1 opacity-30">
                <Icon v-if="tile.dir?.includes('ALL') || tile.dir?.includes('LEFT') || tile.dir?.includes('HOR')" icon="arrow_back" size="8" />
                <Icon v-if="tile.dir?.includes('ALL') || tile.dir?.includes('RIGHT') || tile.dir?.includes('HOR')" icon="arrow_forward" size="8" />
                <Icon v-if="tile.dir?.includes('ALL') || tile.dir?.includes('TOP') || tile.dir?.includes('VER')" icon="arrow_upward" size="8" />
                <Icon v-if="tile.dir?.includes('ALL') || tile.dir?.includes('BOTTOM') || tile.dir?.includes('VER')" icon="arrow_downward" size="8" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="col-span-full row-span-full flex items-center justify-center text-xs opacity-50">
        No tiles
      </div>
    </div>
    <!-- Icon overlay -->
    <div class="absolute top-1 right-1 opacity-20 pointer-events-none">
      <Icon icon="grid_view" size="12" class="text-current" />
    </div>
    <!-- Swipe hint -->
    <div class="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] opacity-20 pointer-events-none">
      <Icon icon="swipe" size="12" class="text-current" />
    </div>
  </div>

  <!-- Meter/Gauge Widget -->
  <svg v-else-if="widget.type === 'meter'" class="w-full h-full" :viewBox="`0 0 ${widget.width || 100} ${widget.height || 100}`">
    <path
      :d="getArcPath(widget)"
      fill="none"
      stroke="currentColor"
      stroke-width="12"
      stroke-linecap="round"
      class="text-indigo-400"
    />
    <text
      :x="(widget.width || 100) / 2"
      :y="(widget.height || 100) / 2 + 5"
      text-anchor="middle"
      class="text-xs fill-current"
    >
      {{ widget.value || 50 }}
    </text>
  </svg>

  <!-- Image Widget -->
  <div v-else-if="widget.type === 'image' || widget.type === 'imagebutton'" class="w-full h-full flex items-center justify-center bg-gray-700 rounded border border-gray-600">
    <Icon icon="image" size="24" class="text-gray-500" />
  </div>

  <!-- Calendar Widget -->
  <div v-else-if="widget.type === 'calendar'" class="w-full h-full bg-gray-700 rounded border border-gray-600 p-1 grid grid-cols-7 gap-0.5 text-[8px] text-center">
    <div v-for="i in 7" :key="i" class="text-gray-400">{{ ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i - 1] }}</div>
    <div v-for="i in 28" :key="i + 7" class="text-gray-300">{{ i }}</div>
  </div>

  <!-- Chart Widget -->
  <svg v-else-if="widget.type === 'chart'" class="w-full h-full" :viewBox="`0 0 ${widget.width || 100} ${widget.height || 100}`">
    <polyline
      :points="`10,${(widget.height || 100) - 10} 25,${(widget.height || 100) - 30} 40,${(widget.height || 100) - 20} 55,${(widget.height || 100) - 40} 70,${(widget.height || 100) - 35} ${(widget.width || 100) - 10},${(widget.height || 100) - 50}`"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      class="text-indigo-400"
    />
  </svg>

  <!-- Line Widget -->
  <svg v-else-if="widget.type === 'line'" class="w-full h-full">
    <line
      x1="10%"
      y1="50%"
      x2="90%"
      y2="50%"
      stroke="currentColor"
      :stroke-width="widget.line_width || 2"
      class="text-gray-400"
    />
  </svg>

  <!-- Table Widget -->
  <div v-else-if="widget.type === 'table'" class="w-full h-full bg-gray-700 rounded border border-gray-600 grid grid-cols-3 grid-rows-3 gap-px overflow-hidden">
    <div v-for="i in 9" :key="i" class="bg-gray-800 flex items-center justify-center text-[8px] text-gray-400">{{ i }}</div>
  </div>

  <!-- Button Matrix Widget -->
  <div v-else-if="widget.type === 'buttonmatrix'" class="w-full h-full bg-gray-700 rounded border border-gray-600 flex flex-col gap-0.5 p-1">
    <div v-for="(row, rowIndex) in (widget.rows || [{buttons: [{id: 'btn1', text: 'Btn 1'}]}])" :key="rowIndex" class="flex gap-0.5 flex-1">
      <button
        v-for="button in row.buttons"
        :key="button.id"
        :style="{ flex: button.width || 1 }"
        :class="[
          'rounded text-[10px] font-medium transition-colors border',
          button.control?.disabled 
            ? 'bg-gray-600 text-gray-500 cursor-not-allowed' 
            : button.control?.checked 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-750',
          button.control?.hidden ? 'invisible' : ''
        ]"
        :title="`${button.id}${button.control?.checkable ? ' (checkable)' : ''}`">
        <span v-if="button.control?.recolor" v-html="button.text"></span>
        <span v-else>{{ button.text || button.id }}</span>
      </button>
    </div>
  </div>

  <!-- Keyboard Widget -->
  <div v-else-if="widget.type === 'keyboard'" class="w-full h-full bg-gray-700 rounded border border-gray-600 flex flex-col gap-0.5 p-1">
    <!-- Row 1 -->
    <div class="flex gap-0.5 flex-1">
      <button v-for="key in ['Q','W','E','R','T','Y','U','I','O','P']" :key="key" 
        class="flex-1 rounded text-[9px] font-medium bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-750">
        {{ widget.keyboard_mode === 'NUMBER' ? '1' : (widget.keyboard_mode === 'TEXT_UPPER' ? key : key.toLowerCase()) }}
      </button>
    </div>
    <!-- Row 2 -->
    <div class="flex gap-0.5 flex-1">
      <button v-for="key in ['A','S','D','F','G','H','J','K','L']" :key="key"
        class="flex-1 rounded text-[9px] font-medium bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-750">
        {{ widget.keyboard_mode === 'NUMBER' ? '2' : (widget.keyboard_mode === 'TEXT_UPPER' ? key : key.toLowerCase()) }}
      </button>
    </div>
    <!-- Row 3 -->
    <div class="flex gap-0.5 flex-1">
      <button class="flex-[1.5] rounded text-[9px] font-medium bg-gray-800 text-gray-200 border border-gray-600">
        <Icon icon="keyboard_capslock" :size="10" />
      </button>
      <button v-for="key in ['Z','X','C','V','B','N','M']" :key="key"
        class="flex-1 rounded text-[9px] font-medium bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-750">
        {{ widget.keyboard_mode === 'NUMBER' ? '3' : (widget.keyboard_mode === 'TEXT_UPPER' ? key : key.toLowerCase()) }}
      </button>
      <button class="flex-[1.5] rounded text-[9px] font-medium bg-gray-800 text-gray-200 border border-gray-600">
        <Icon icon="backspace" :size="10" />
      </button>
    </div>
    <!-- Row 4 -->
    <div class="flex gap-0.5 flex-1">
      <button class="flex-[1.5] rounded text-[8px] font-medium bg-gray-800 text-gray-200 border border-gray-600">
        {{ widget.keyboard_mode === 'NUMBER' ? '0' : (widget.keyboard_mode === 'TEXT_SPECIAL' ? '!@#' : 'ABC') }}
      </button>
      <button class="flex-5 rounded text-[9px] font-medium bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-750">
        {{ widget.keyboard_mode === 'NUMBER' ? '.' : 'Space' }}
      </button>
      <button class="flex-[1.5] rounded text-[9px] font-medium bg-indigo-600 text-white border border-indigo-500">
        <Icon icon="check" :size="10" />
      </button>
      <button class="flex-[1.5] rounded text-[9px] font-medium bg-gray-800 text-gray-200 border border-gray-600">
        <Icon icon="keyboard" :size="10" />
      </button>
    </div>
    <!-- Mode indicator -->
    <div class="text-[8px] text-gray-400 text-center mt-0.5">
      {{ widget.keyboard_mode || 'TEXT_LOWER' }} 
      <span v-if="widget.textarea" class="text-indigo-400">→ {{ widget.textarea }}</span>
    </div>
  </div>

  <!-- Tabview Widget -->
  <div v-else-if="widget.type === 'tabview'" class="w-full h-full bg-gray-800 rounded border border-gray-600 flex" 
    :class="{
      'flex-col': (widget.position || widget.tab_pos) === 'TOP' || !(widget.position || widget.tab_pos),
      'flex-col-reverse': (widget.position || widget.tab_pos) === 'BOTTOM',
      'flex-row': (widget.position || widget.tab_pos) === 'LEFT',
      'flex-row-reverse': (widget.position || widget.tab_pos) === 'RIGHT'
    }">
    <!-- Tab buttons -->
    <div class="flex bg-gray-700 border-gray-600"
      :class="{
        'flex-row border-b': (widget.position || widget.tab_pos) === 'TOP' || !(widget.position || widget.tab_pos),
        'flex-row border-t': (widget.position || widget.tab_pos) === 'BOTTOM',
        'flex-col border-r': (widget.position || widget.tab_pos) === 'LEFT',
        'flex-col border-l': (widget.position || widget.tab_pos) === 'RIGHT',
      }">
      <div 
        v-for="(tab, index) in (widget.tabs || [{id: '1', name: 'Tab 1', widgets: []}])" 
        :key="tab.id"
        @click="switchTab($event, widget, index)"
        class="px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer border-gray-600"
        :class="{
          'flex-1': widget.spread_tabs,
          'bg-gray-800 text-indigo-400': index === (widget.selectedTabIndex || 0),
          'text-gray-400 hover:text-gray-300 hover:bg-gray-750': index !== (widget.selectedTabIndex || 0),
          'border-r': ((widget.position || widget.tab_pos) === 'TOP' || (widget.position || widget.tab_pos) === 'BOTTOM' || !(widget.position || widget.tab_pos)),
          'border-b': ((widget.position || widget.tab_pos) === 'LEFT' || (widget.position || widget.tab_pos) === 'RIGHT'),
        }"
        :title="`Switch to ${tab.name}`">
        {{ tab.name }}
      </div>
    </div>
    <!-- Tab content area -->
    <div 
      class="flex-1 relative overflow-hidden transition-all" 
      :class="{
        'ring-2 ring-green-400 border border-green-400': props.hoveredDropTargetId === widget.id
      }"
      :data-tabview-content="true"
      :data-parent-id="widget.id">
      <!-- Nested widgets in active tab -->
      <template v-if="widget.tabs && widget.tabs[widget.selectedTabIndex || 0]?.widgets">
        <div
          v-for="childWidget in (widget.tabs[widget.selectedTabIndex || 0]?.widgets || [])"
          :key="childWidget.id"
          draggable="true"
          @click="!props.isPreview ? handleNestedWidgetClick($event, childWidget) : null"
          @dragstart="!props.isPreview ? handleNestedWidgetDragStart($event, childWidget, widget) : null"
          :class="[
            'absolute border rounded-md cursor-move select-none min-w-5 min-h-5 shadow-md hover:shadow-lg transition-all',
            props.isPreview && 'pointer-events-none',
            store.selectedWidgetId === childWidget.id && !props.isPreview
              ? 'border-2 border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.3)] ring-2 ring-indigo-400/50'
              : 'border-gray-500 hover:border-gray-400'
          ]"
          :style="{
            left: childWidget.x + 'px',
            top: childWidget.y + 'px',
            width: childWidget.width !== undefined ? childWidget.width + 'px' : 'auto',
            height: childWidget.height !== undefined ? childWidget.height + 'px' : 'auto',
            zIndex: store.selectedWidgetId === childWidget.id ? 100 : childWidget.zIndex
          }"
          :data-widget-id="childWidget.id"
          :data-widget-type="childWidget.type"
          :title="`${childWidget.type} (nested in tab)`">
          <WidgetRenderer :widget="childWidget" :isNested="true" :hoveredDropTargetId="props.hoveredDropTargetId" :isPreview="props.isPreview" />
          <div
            v-if="store.selectedWidgetId === childWidget.id && !props.isPreview"
            @mousedown="handleNestedResizeStart($event, childWidget)"
            class="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 border border-white cursor-se-resize hover:bg-indigo-400 transition-colors"
            style="transform: translate(50%, 50%)"
            title="Drag to resize"
          ></div>
        </div>
      </template>
      <!-- Drop hint -->
      <div v-else class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="text-center">
          <div class="text-[10px] text-gray-500">Tab Content Area</div>
          <div class="text-[8px] text-gray-600">(Drop widgets here)</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Default fallback -->
  <div v-else class="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-800/50 rounded border border-gray-700">
    {{ widget.text || widget.type }}
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
