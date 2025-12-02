<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDesignerStore } from '../stores/designer'
import type { Widget } from '../types/widget'
import { widgetIconMap } from '../types/widget'
import Icon from './Icon.vue'

const store = useDesignerStore()

// Get active canvas tab
const activeTab = computed(() => {
  return store.canvasTabs.find(tab => tab.id === store.activeCanvasTabId)
})

// Vertical resizer functionality (between Elements and Properties)
const elementsHeight = ref(400) // Default height in pixels
const isResizing = ref(false)
const startY = ref(0)
const startHeight = ref(0)

// Horizontal resizer functionality (sidebar width)
const sidebarWidth = ref(320) // Default width in pixels (w-80 = 320px)
const isResizingWidth = ref(false)
const startX = ref(0)
const startWidth = ref(0)

function startResize(event: MouseEvent) {
  isResizing.value = true
  startY.value = event.clientY
  startHeight.value = elementsHeight.value
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  event.preventDefault()
}

function handleResize(event: MouseEvent) {
  if (!isResizing.value) return
  
  const deltaY = event.clientY - startY.value
  const newHeight = startHeight.value + deltaY
  
  // Constrain between 200px and 80% of viewport height
  const minHeight = 200
  const maxHeight = window.innerHeight * 0.8
  elementsHeight.value = Math.max(minHeight, Math.min(newHeight, maxHeight))
}

function stopResize() {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

function startResizeWidth(event: MouseEvent) {
  isResizingWidth.value = true
  startX.value = event.clientX
  startWidth.value = sidebarWidth.value
  
  document.addEventListener('mousemove', handleResizeWidth)
  document.addEventListener('mouseup', stopResizeWidth)
  event.preventDefault()
}

function handleResizeWidth(event: MouseEvent) {
  if (!isResizingWidth.value) return
  
  const deltaX = startX.value - event.clientX // Inverted because we're on the left edge
  const newWidth = startWidth.value + deltaX
  
  // Constrain between 280px and 600px
  const minWidth = 280
  const maxWidth = 600
  sidebarWidth.value = Math.max(minWidth, Math.min(newWidth, maxWidth))
}

function stopResizeWidth() {
  isResizingWidth.value = false
  document.removeEventListener('mousemove', handleResizeWidth)
  document.removeEventListener('mouseup', stopResizeWidth)
}

function handleInputChange(property: string, value: any) {
  if (store.selectedWidget) {
    // Validate that certain properties cannot be negative
    // Note: width, height, and start_value must be >= 0, but value, min_value, max_value can be negative
    const nonNegativeProps = ['width', 'height', 'start_value']
    if (nonNegativeProps.includes(property)) {
      const numValue = Number(value)
      if (!isNaN(numValue) && numValue < 0) {
        console.warn(`Property '${property}' cannot be negative. Setting to 0.`)
        value = 0
      }
    }
    
    // Constrain width and height to canvas/tab boundaries
    if (property === 'width' || property === 'height') {
      const numValue = Number(value)
      if (!isNaN(numValue) && numValue > 0) {
        if (property === 'width') {
          const maxWidth = store.canvasWidth - store.selectedWidget.x
          value = Math.min(numValue, maxWidth)
        } else if (property === 'height') {
          const maxHeight = store.canvasHeight - store.selectedWidget.y
          value = Math.min(numValue, maxHeight)
        }
      }
    }
    
    // Type-safe property update
    (store.selectedWidget as any)[property] = value
    store.saveState()
  }
}

function handleNumberInput(property: string, event: Event) {
  const value = (event.target as HTMLInputElement).value
  handleInputChange(property, value ? Number(value) : undefined)
}

function handleArcColorInput(property: string, event: Event) {
  const value = (event.target as HTMLInputElement).value.trim()
  if (store.selectedWidget) {
    if (!store.selectedWidget.indicator) {
      store.selectedWidget.indicator = {}
    }
    store.selectedWidget.indicator.arc_color = value
    store.saveState()
  }
}

function handleColorPickerInput(event: Event) {
  const hexColor = (event.target as HTMLInputElement).value // #RRGGBB
  const lvglHex = '0x' + hexColor.substring(1).toUpperCase() // Convert #RRGGBB to 0xRRGGBB
  if (store.selectedWidget) {
    if (!store.selectedWidget.indicator) {
      store.selectedWidget.indicator = {}
    }
    store.selectedWidget.indicator.arc_color = lvglHex
    store.saveState()
  }
}

function getLvglColorAsHex(): string {
  if (!store.selectedWidget?.indicator?.arc_color && !store.selectedWidget?.arc_color) {
    return '#818cf8' // indigo-400 default
  }
  const color = store.selectedWidget.indicator?.arc_color || store.selectedWidget.arc_color || '0x818cf8'
  const cleaned = color.toString().replace('0x', '').padStart(6, '0')
  return '#' + cleaned
}

function handleArcWidthInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  if (store.selectedWidget) {
    if (!store.selectedWidget.indicator) {
      store.selectedWidget.indicator = {}
    }
    store.selectedWidget.indicator.arc_width = value ? Number(value) : 8
    store.saveState()
  }
}

function handleArcPropertyInput(property: string, value: any) {
  if (store.selectedWidget) {
    if (!store.selectedWidget.indicator) {
      store.selectedWidget.indicator = {}
    }
    (store.selectedWidget.indicator as any)[property] = value
    store.saveState()
  }
}

// Tabview helper functions
function handleTabNameChange(index: number, newName: string) {
  if (store.selectedWidget?.tabs && store.selectedWidget.tabs[index]) {
    store.selectedWidget.tabs[index].name = newName
    store.saveState()
  }
}

function setActiveTab(index: number) {
  if (store.selectedWidget) {
    store.selectedWidget.selectedTabIndex = index
    store.saveState()
  }
}

function addTab() {
  if (store.selectedWidget) {
    // Initialize tabs array if it doesn't exist
    if (!store.selectedWidget.tabs) {
      store.selectedWidget.tabs = []
    }
    const newTabId = `tab${store.selectedWidget.tabs.length + 1}`
    const newTabName = `Tab ${store.selectedWidget.tabs.length + 1}`
    store.selectedWidget.tabs.push({
      id: newTabId,
      name: newTabName,
      widgets: []
    })
    store.saveState()
  }
}

function removeTab(index: number) {
  if (store.selectedWidget?.tabs && store.selectedWidget.tabs.length > 1) {
    store.selectedWidget.tabs.splice(index, 1)
    // Adjust selected tab index if necessary
    if ((store.selectedWidget.selectedTabIndex || 0) >= store.selectedWidget.tabs.length) {
      store.selectedWidget.selectedTabIndex = store.selectedWidget.tabs.length - 1
    }
    store.saveState()
  }
}

function selectTabWidget(tabviewWidget: Widget, tabIndex: number, widgetId: string) {
  // Switch to the tab containing this widget
  if (tabviewWidget.selectedTabIndex !== tabIndex) {
    tabviewWidget.selectedTabIndex = tabIndex
  }
  // Select the widget
  store.selectWidget(widgetId)
}

function removeTabWidget(tabviewWidget: Widget, tabIndex: number, widgetId: string) {
  if (tabviewWidget.tabs && tabviewWidget.tabs[tabIndex]?.widgets) {
    const widgetIndex = tabviewWidget.tabs[tabIndex].widgets.findIndex(w => w.id === widgetId)
    if (widgetIndex > -1) {
      tabviewWidget.tabs[tabIndex].widgets.splice(widgetIndex, 1)
      if (store.selectedWidgetId === widgetId) {
        store.selectWidget(null)
      }
      store.saveState()
    }
  }
}

function selectTileWidget(tileviewWidget: Widget, tileIndex: number, widgetId: string) {
  // Switch to the tile containing this widget
  if (tileviewWidget.tiles && tileviewWidget.tiles[tileIndex]) {
    const tile = tileviewWidget.tiles[tileIndex]
    if (tileviewWidget.current_tile_row !== tile.row || tileviewWidget.current_tile_column !== tile.column) {
      tileviewWidget.current_tile_row = tile.row
      tileviewWidget.current_tile_column = tile.column
    }
  }
  // Select the widget
  store.selectWidget(widgetId)
}

function removeTileWidget(tileviewWidget: Widget, tileIndex: number, widgetId: string) {
  if (tileviewWidget.tiles && tileviewWidget.tiles[tileIndex]?.widgets) {
    const widgetIndex = tileviewWidget.tiles[tileIndex].widgets!.findIndex((w: any) => w.id === widgetId)
    if (widgetIndex > -1) {
      tileviewWidget.tiles[tileIndex].widgets!.splice(widgetIndex, 1)
      if (store.selectedWidgetId === widgetId) {
        store.selectWidget(null)
      }
      // Trigger reactivity
      tileviewWidget.tiles = [...tileviewWidget.tiles]
      store.saveState()
    }
  }
}

// Tile layout configuration
const showTileLayoutModal = ref(false)
const currentTileConfig = ref<{ tileview: Widget | null, tileIndex: number }>({ tileview: null, tileIndex: -1 })

const currentTile = computed(() => {
  if (!currentTileConfig.value.tileview?.tiles || currentTileConfig.value.tileIndex < 0) {
    return null
  }
  return currentTileConfig.value.tileview.tiles[currentTileConfig.value.tileIndex]
})

function openTileLayoutConfig(tileviewWidget: Widget, tileIndex: number) {
  currentTileConfig.value = { tileview: tileviewWidget, tileIndex }
  
  // Initialize layout if not present
  if (tileviewWidget.tiles && tileviewWidget.tiles[tileIndex]) {
    if (!tileviewWidget.tiles[tileIndex].layout) {
      tileviewWidget.tiles[tileIndex].layout = {
        type: 'NONE'
      }
    }
  }
  
  showTileLayoutModal.value = true
}

function closeTileLayoutModal() {
  showTileLayoutModal.value = false
  currentTileConfig.value = { tileview: null, tileIndex: -1 }
}

function saveTileLayout() {
  if (currentTileConfig.value.tileview?.tiles) {
    // Trigger reactivity
    const tileview = currentTileConfig.value.tileview
    if (tileview.tiles) {
      tileview.tiles = [...tileview.tiles]
    }
    store.saveState()
  }
  closeTileLayoutModal()
}

// Buttonmatrix helper functions
function addButtonRow() {
  if (store.selectedWidget) {
    if (!store.selectedWidget.rows) {
      store.selectedWidget.rows = []
    }
    const rowIndex = store.selectedWidget.rows.length + 1
    store.selectedWidget.rows.push({
      buttons: [
        { id: `btn_${rowIndex}_1`, text: `Btn ${rowIndex}.1`, width: 1 },
        { id: `btn_${rowIndex}_2`, text: `Btn ${rowIndex}.2`, width: 1 },
      ]
    })
    // Trigger reactivity
    store.selectedWidget.rows = [...store.selectedWidget.rows]
    store.saveState()
  }
}

function removeButtonRow(rowIndex: number) {
  if (store.selectedWidget?.rows && store.selectedWidget.rows.length > 1) {
    store.selectedWidget.rows.splice(rowIndex, 1)
    // Trigger reactivity
    store.selectedWidget.rows = [...store.selectedWidget.rows]
    store.saveState()
  }
}

// Tileview helper functions
function getMaxTileRow(widget: Widget): number {
  if (!widget.tiles || widget.tiles.length === 0) return 0
  return Math.max(...widget.tiles.map((t: any) => t.row))
}

function getMaxTileColumn(widget: Widget): number {
  if (!widget.tiles || widget.tiles.length === 0) return 0
  return Math.max(...widget.tiles.map((t: any) => t.column))
}

function selectTile(row: number, column: number) {
  if (store.selectedWidget) {
    store.selectedWidget.current_tile_row = row
    store.selectedWidget.current_tile_column = column
    store.saveState()
  }
}

function selectTileFromList(tileviewWidget: Widget, row: number, column: number) {
  // First select the tileview widget
  store.selectWidget(tileviewWidget.id)
  // Then switch to the specified tile
  tileviewWidget.current_tile_row = row
  tileviewWidget.current_tile_column = column
  store.saveState()
}

// Roller/Dropdown option management
function addOption() {
  if (store.selectedWidget) {
    if (!store.selectedWidget.options) {
      store.selectedWidget.options = []
    }
    const optionCount = store.selectedWidget.options.length + 1
    store.selectedWidget.options.push(`Option ${optionCount}`)
    // Trigger reactivity
    store.selectedWidget.options = [...store.selectedWidget.options]
    store.saveState()
  }
}

function removeOption(index: number) {
  if (store.selectedWidget?.options && store.selectedWidget.options.length > 1) {
    store.selectedWidget.options.splice(index, 1)
    // Adjust selected_index if needed
    if (store.selectedWidget.selected_index !== undefined && store.selectedWidget.selected_index >= store.selectedWidget.options.length) {
      store.selectedWidget.selected_index = store.selectedWidget.options.length - 1
    }
    // Trigger reactivity
    store.selectedWidget.options = [...store.selectedWidget.options]
    store.saveState()
  }
}

function updateOption(index: number, value: string) {
  if (store.selectedWidget?.options && store.selectedWidget.options[index] !== undefined) {
    store.selectedWidget.options[index] = value
    // Trigger reactivity
    store.selectedWidget.options = [...store.selectedWidget.options]
    store.saveState()
  }
}

// Switch indicator/knob management
function handleIndicatorChange(property: string, value: any) {
  if (store.selectedWidget) {
    if (!store.selectedWidget.indicator) {
      store.selectedWidget.indicator = {}
    }
    ;(store.selectedWidget.indicator as any)[property] = value
    store.saveState()
  }
}

function handleKnobChange(property: string, value: any) {
  if (store.selectedWidget) {
    if (!store.selectedWidget.knob) {
      store.selectedWidget.knob = {}
    }
    ;(store.selectedWidget.knob as any)[property] = value
    store.saveState()
  }
}

// Tile management functions
function addTile() {
  if (store.selectedWidget) {
    if (!store.selectedWidget.tiles) {
      store.selectedWidget.tiles = []
    }
    const maxRow = store.selectedWidget.tiles.reduce((max: number, t: any) => Math.max(max, t.row), -1)
    const maxCol = store.selectedWidget.tiles.reduce((max: number, t: any) => Math.max(max, t.column), -1)
    const newRow = maxRow + 1
    const newCol = 0
    const tileCount = store.selectedWidget.tiles.length
    store.selectedWidget.tiles.push({
      id: `tile_${newRow}_${newCol}`,
      row: newRow,
      column: newCol,
      dir: ['ALL'],
      label: `Tile ${newRow},${newCol}`,
      widgets: []
    })
    store.selectedWidget.tiles = [...store.selectedWidget.tiles]
    store.saveState()
  }
}

function removeTile(index: number) {
  if (store.selectedWidget?.tiles && store.selectedWidget.tiles.length > 1) {
    store.selectedWidget.tiles.splice(index, 1)
    store.selectedWidget.tiles = [...store.selectedWidget.tiles]
    store.saveState()
  }
}

function updateTile(index: number, property: string, value: any) {
  if (store.selectedWidget?.tiles && store.selectedWidget.tiles[index]) {
    ;(store.selectedWidget.tiles[index] as any)[property] = value
    store.selectedWidget.tiles = [...store.selectedWidget.tiles]
    store.saveState()
  }
}

function toggleTileDirection(index: number, direction: string) {
  if (store.selectedWidget?.tiles && store.selectedWidget.tiles[index]) {
    const tile = store.selectedWidget.tiles[index]
    if (!tile.dir) {
      tile.dir = []
    }
    
    const dirIndex = tile.dir.indexOf(direction)
    if (dirIndex > -1) {
      tile.dir.splice(dirIndex, 1)
    } else {
      // If adding ALL, remove other directions
      if (direction === 'ALL') {
        tile.dir = ['ALL']
      } else {
        // If adding specific direction, remove ALL
        const allIndex = tile.dir.indexOf('ALL')
        if (allIndex > -1) {
          tile.dir.splice(allIndex, 1)
        }
        tile.dir.push(direction)
      }
    }
    
    store.selectedWidget.tiles = [...store.selectedWidget.tiles]
    store.saveState()
  }
}

function addButtonToRow(rowIndex: number) {
  if (store.selectedWidget?.rows && store.selectedWidget.rows[rowIndex]) {
    const row = store.selectedWidget.rows[rowIndex]
    const btnCount = row.buttons.length + 1
    row.buttons.push({
      id: `btn_${rowIndex + 1}_${btnCount}`,
      text: `Btn ${rowIndex + 1}.${btnCount}`,
      width: 1
    })
    // Trigger reactivity
    store.selectedWidget.rows = [...store.selectedWidget.rows]
    store.saveState()
  }
}

function removeButton(rowIndex: number, buttonIndex: number) {
  if (store.selectedWidget?.rows && 
      store.selectedWidget.rows[rowIndex]?.buttons &&
      store.selectedWidget.rows[rowIndex].buttons.length > 1) {
    store.selectedWidget.rows[rowIndex].buttons.splice(buttonIndex, 1)
    // Trigger reactivity
    store.selectedWidget.rows = [...store.selectedWidget.rows]
    store.saveState()
  }
}

function updateButtonProperty(rowIndex: number, buttonIndex: number, property: string, value: any) {
  if (store.selectedWidget?.id) {
    store.updateButtonMatrixButton(store.selectedWidget.id, rowIndex, buttonIndex, property, value)
  }
}

// Drag and drop state for reordering widgets in sidebar
const draggedItem = ref<{
  type: 'widget' | 'tab-widget' | 'tile-widget',
  widgetId: string,
  parentId?: string, // For nested widgets (parent tabview/tileview ID)
  tabIndex?: number, // For tab widgets
  tileIndex?: number // For tile widgets
} | null>(null)

// Hover state for drop target visualization
const hoveredDropTargetId = ref<string | null>(null)

// Drop indicator state for showing line indicators when reordering
const dropIndicatorId = ref<string | null>(null) // Widget ID showing drop indicator
const dropIndicatorPosition = ref<'before' | 'after' | null>(null) // Line position relative to widget
const isReordering = ref(false) // True when reordering widgets at same level

// Collapse state maps
const collapsedWidgets = ref<Record<string, boolean>>({})
const collapsedTabs = ref<Record<string, Record<string, boolean>>>({}) // widgetId -> { tabId: boolean }
const collapsedTiles = ref<Record<string, Record<string, boolean>>>({}) // widgetId -> { tileId: boolean }

function toggleWidgetCollapse(widgetId: string) {
  collapsedWidgets.value[widgetId] = !collapsedWidgets.value[widgetId]
}

function isWidgetCollapsed(widgetId: string) {
  return !!collapsedWidgets.value[widgetId]
}

function toggleTabCollapse(widgetId: string, tabId: string) {
  if (!collapsedTabs.value[widgetId]) collapsedTabs.value[widgetId] = {}
  collapsedTabs.value[widgetId][tabId] = !collapsedTabs.value[widgetId][tabId]
}

function isTabCollapsed(widgetId: string, tabId: string) {
  return !!(collapsedTabs.value[widgetId] && collapsedTabs.value[widgetId][tabId])
}

// Helper function to determine drop position when reordering
function handleWidgetReorderDragOver(event: DragEvent, widgetId: string) {
  if (!isReordering.value || !draggedItem.value || draggedItem.value.widgetId === widgetId) {
    return
  }
  
  // Get the mouse Y position relative to the element
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const mouseY = event.clientY - rect.top
  const midpoint = rect.height / 2
  
  // Determine if drop should be before or after based on mouse position
  dropIndicatorId.value = widgetId
  dropIndicatorPosition.value = mouseY < midpoint ? 'before' : 'after'
}

// Helper function to determine drop position when reordering tab widgets
function handleTabWidgetReorderDragOver(event: DragEvent, widgetId: string) {
  if (!isReordering.value || !draggedItem.value || draggedItem.value.widgetId === widgetId) {
    return
  }
  
  // Get the mouse Y position relative to the element
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const mouseY = event.clientY - rect.top
  const midpoint = rect.height / 2
  
  // Determine if drop should be before or after based on mouse position
  dropIndicatorId.value = widgetId
  dropIndicatorPosition.value = mouseY < midpoint ? 'before' : 'after'
}

// Helper function to determine drop position when reordering tile widgets
function handleTileWidgetReorderDragOver(event: DragEvent, widgetId: string) {
  if (!isReordering.value || !draggedItem.value || draggedItem.value.widgetId === widgetId) {
    return
  }
  
  // Get the mouse Y position relative to the element
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const mouseY = event.clientY - rect.top
  const midpoint = rect.height / 2
  
  // Determine if drop should be before or after based on mouse position
  dropIndicatorId.value = widgetId
  dropIndicatorPosition.value = mouseY < midpoint ? 'before' : 'after'
}

function toggleTileCollapse(widgetId: string, tileId: string) {
  if (!collapsedTiles.value[widgetId]) collapsedTiles.value[widgetId] = {}
  collapsedTiles.value[widgetId][tileId] = !collapsedTiles.value[widgetId][tileId]
}

function isTileCollapsed(widgetId: string, tileId: string) {
  return !!(collapsedTiles.value[widgetId] && collapsedTiles.value[widgetId][tileId])
}

// Helper function to find a widget by ID anywhere in the hierarchy
function findWidgetById(widgetId: string, widgets: Widget[] = store.widgets): Widget | null {
  for (const widget of widgets) {
    if (widget.id === widgetId) return widget
    
    // Search in tabs
    if (widget.type === 'tabview' && widget.tabs) {
      for (const tab of widget.tabs) {
        if (tab.widgets) {
          const found = findWidgetById(widgetId, tab.widgets)
          if (found) return found
        }
      }
    }
    
    // Search in tiles
    if (widget.type === 'tileview' && widget.tiles) {
      for (const tile of widget.tiles) {
        if (tile.widgets) {
          const found = findWidgetById(widgetId, tile.widgets)
          if (found) return found
        }
      }
    }
  }
  return null
}

// Top-level widget drag handlers
function handleWidgetDragStart(event: DragEvent, widget: Widget) {
  draggedItem.value = {
    type: 'widget',
    widgetId: widget.id
  }
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/plain', widget.id)
}

function handleWidgetDragOver(event: DragEvent) {
  // Allow any widget type to be dropped at root level
  if (draggedItem.value) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
    
    // Detect if this is a reordering scenario (dragging widget at root level)
    if (draggedItem.value.type === 'widget') {
      isReordering.value = true
    } else {
      isReordering.value = false
    }
  }
}

function handleWidgetDragEnd() {
  hoveredDropTargetId.value = null
  dropIndicatorId.value = null
  dropIndicatorPosition.value = null
  isReordering.value = false
  draggedItem.value = null
}

function handleWidgetDrop(event: DragEvent, targetWidget: Widget) {
  event.preventDefault()
  event.stopPropagation()
  
  if (!draggedItem.value) return
  
  const draggedId = draggedItem.value.widgetId
  if (draggedId === targetWidget.id) return
  
  // Handle different source types
  if (draggedItem.value.type === 'widget') {
    // Moving within root level
    const draggedIndex = store.widgets.findIndex(w => w.id === draggedId)
    const targetIndex = store.widgets.findIndex(w => w.id === targetWidget.id)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    const widgets = [...store.widgets]
    const [draggedWidget] = widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    widgets.splice(targetIndex, 0, draggedWidget)
    
    store.widgets = widgets
    store.saveState()
  } else if (draggedItem.value.type === 'tab-widget') {
    // Moving from tab to root
    const parentTabview = store.widgets.find(w => w.id === draggedItem.value!.parentId)
    if (!parentTabview?.tabs) return
    
    const sourceTab = parentTabview.tabs[draggedItem.value.tabIndex!]
    if (!sourceTab?.widgets) return
    
    const draggedIndex = sourceTab.widgets.findIndex(w => w.id === draggedId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTab.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Add to root at target position
    const targetIndex = store.widgets.findIndex(w => w.id === targetWidget.id)
    if (targetIndex === -1) {
      store.widgets.push(draggedWidget)
    } else {
      store.widgets.splice(targetIndex, 0, draggedWidget)
    }
    
    parentTabview.tabs = [...parentTabview.tabs]
    store.saveState()
  } else if (draggedItem.value.type === 'tile-widget') {
    // Moving from tile to root
    const parentTileview = findWidgetById(draggedItem.value.parentId!)
    if (!parentTileview?.tiles) return
    
    const sourceTile = parentTileview.tiles[draggedItem.value.tileIndex!]
    if (!sourceTile?.widgets) return
    
    const draggedIndex = sourceTile.widgets.findIndex(w => w.id === draggedId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTile.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Add to root at target position
    const targetIndex = store.widgets.findIndex(w => w.id === targetWidget.id)
    if (targetIndex === -1) {
      store.widgets.push(draggedWidget)
    } else {
      store.widgets.splice(targetIndex, 0, draggedWidget)
    }
    
    parentTileview.tiles = [...parentTileview.tiles]
    store.saveState()
  }
  
  draggedItem.value = null
}

// Handle dropping into root container
function handleRootDrop(event: DragEvent) {
  event.preventDefault()
  event.stopPropagation()
  
  if (!draggedItem.value) return
  
  const draggedId = draggedItem.value.widgetId
  
  // Only handle tab-widget and tile-widget drops to root
  if (draggedItem.value.type === 'tab-widget') {
    // Moving from tab to root
    const parentTabview = store.widgets.find(w => w.id === draggedItem.value!.parentId)
    if (!parentTabview?.tabs) return
    
    const sourceTab = parentTabview.tabs[draggedItem.value.tabIndex!]
    if (!sourceTab?.widgets) return
    
    const draggedIndex = sourceTab.widgets.findIndex(w => w.id === draggedId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTab.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Add to root
    store.widgets.push(draggedWidget)
    
    parentTabview.tabs = [...parentTabview.tabs]
    store.saveState()
  } else if (draggedItem.value.type === 'tile-widget') {
    // Moving from tile to root
    const parentTileview = findWidgetById(draggedItem.value.parentId!)
    if (!parentTileview?.tiles) return
    
    const sourceTile = parentTileview.tiles[draggedItem.value.tileIndex!]
    if (!sourceTile?.widgets) return
    
    const draggedIndex = sourceTile.widgets.findIndex(w => w.id === draggedId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTile.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Add to root
    store.widgets.push(draggedWidget)
    
    parentTileview.tiles = [...parentTileview.tiles]
    store.saveState()
  }
  
  draggedItem.value = null
}

// Tab widget drag handlers
function handleTabWidgetDragStart(event: DragEvent, tabviewWidget: Widget, tabIndex: number, widget: Widget) {
  draggedItem.value = {
    type: 'tab-widget',
    widgetId: widget.id,
    parentId: tabviewWidget.id,
    tabIndex
  }
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/plain', widget.id)
  event.stopPropagation()
}

function handleTabWidgetDragOver(event: DragEvent, tabviewWidget: Widget, tabIndex: number) {
  // Allow any widget type to be dropped into tabs
  if (draggedItem.value) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
    
    // Detect if this is a reordering scenario (dragging tab-widget within same tab)
    if (draggedItem.value.type === 'tab-widget' && draggedItem.value.parentId === tabviewWidget.id && draggedItem.value.tabIndex === tabIndex) {
      isReordering.value = true
    } else {
      isReordering.value = false
    }
  }
}

function handleTabWidgetDrop(event: DragEvent, tabviewWidget: Widget, tabIndex: number, targetWidget: Widget) {
  event.preventDefault()
  event.stopPropagation()
  
  if (!draggedItem.value) return
  if (draggedItem.value.widgetId === targetWidget.id) return
  
  const targetTab = tabviewWidget.tabs?.[tabIndex]
  if (!targetTab?.widgets) return
  
  // Handle different source types
  if (draggedItem.value.type === 'widget') {
    // Moving from root to tab
    const draggedIndex = store.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = store.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0 when moving from root to tab
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    // Add to target tab
    const targetIndex = targetTab.widgets.findIndex(w => w.id === targetWidget.id)
    if (targetIndex === -1) {
      targetTab.widgets.push(draggedWidget)
    } else {
      targetTab.widgets.splice(targetIndex, 0, draggedWidget)
    }
    
    tabviewWidget.tabs = [...tabviewWidget.tabs!]
    store.saveState()
  } else if (draggedItem.value.type === 'tab-widget') {
    // Moving within tabs, between tabs in same tabview, or between different tabviews
    const sourceTabview = store.widgets.find(w => w.id === draggedItem.value!.parentId)
    if (!sourceTabview?.tabs) return
    
    const sourceTab = sourceTabview.tabs[draggedItem.value.tabIndex!]
    if (!sourceTab?.widgets) return
    
    const draggedIndex = sourceTab.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTab.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // If moving within the same tab and same tabview
    if (draggedItem.value.parentId === tabviewWidget.id && draggedItem.value.tabIndex === tabIndex) {
      const targetIndex = sourceTab.widgets.findIndex(w => w.id === targetWidget.id)
      if (targetIndex === -1) {
        sourceTab.widgets.push(draggedWidget)
      } else {
        sourceTab.widgets.splice(targetIndex, 0, draggedWidget)
      }
    } else {
      // Moving to a different tab (same or different tabview)
      // Reset position to 0,0 when moving between tabs
      draggedWidget.x = 0
      draggedWidget.y = 0
      
      const targetIndex = targetTab.widgets.findIndex(w => w.id === targetWidget.id)
      if (targetIndex === -1) {
        targetTab.widgets.push(draggedWidget)
      } else {
        targetTab.widgets.splice(targetIndex, 0, draggedWidget)
      }
    }
    
    sourceTabview.tabs = [...sourceTabview.tabs]
    tabviewWidget.tabs = [...tabviewWidget.tabs!]
    store.saveState()
  } else if (draggedItem.value.type === 'tile-widget') {
    // Moving from tile to tab
    const parentTileview = findWidgetById(draggedItem.value.parentId!)
    if (!parentTileview?.tiles) return
    
    const sourceTile = parentTileview.tiles[draggedItem.value.tileIndex!]
    if (!sourceTile?.widgets) return
    
    const draggedIndex = sourceTile.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTile.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Add to target tab
    const targetIndex = targetTab.widgets.findIndex(w => w.id === targetWidget.id)
    if (targetIndex === -1) {
      targetTab.widgets.push(draggedWidget)
    } else {
      targetTab.widgets.splice(targetIndex, 0, draggedWidget)
    }
    
    parentTileview.tiles = [...parentTileview.tiles]
    tabviewWidget.tabs = [...tabviewWidget.tabs!]
    store.saveState()
  }
  
  draggedItem.value = null
}

// Allow dropping on tab container (when empty or between widgets)
function handleTabContainerDragOver(event: DragEvent, tabviewWidget: Widget, tabIndex: number) {
  if (draggedItem.value) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
  }
}

function handleTabContainerDrop(event: DragEvent, tabviewWidget: Widget, tabIndex: number) {
  event.preventDefault()
  event.stopPropagation()
  
  if (!draggedItem.value) return
  
  const targetTab = tabviewWidget.tabs?.[tabIndex]
  if (!targetTab) return
  
  // Handle different source types
  if (draggedItem.value.type === 'widget') {
    // Moving from root to tab (at the end)
    const draggedIndex = store.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = store.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0 when moving from root to tab
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    if (!targetTab.widgets) {
      targetTab.widgets = []
    }
    targetTab.widgets.push(draggedWidget)
    
    tabviewWidget.tabs = [...tabviewWidget.tabs!]
    store.saveState()
  } else if (draggedItem.value.type === 'tab-widget') {
    // Moving between tabs (same or different tabview)
    const sourceTabview = store.widgets.find(w => w.id === draggedItem.value!.parentId)
    if (!sourceTabview?.tabs) return
    
    // Don't do anything if dropping in the same tab with no target
    if (draggedItem.value.parentId === tabviewWidget.id && draggedItem.value.tabIndex === tabIndex) {
      draggedItem.value = null
      return
    }
    
    const sourceTab = sourceTabview.tabs[draggedItem.value.tabIndex!]
    if (!sourceTab?.widgets) return
    
    const draggedIndex = sourceTab.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTab.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0 when moving between tabs or tabviews
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    if (!targetTab.widgets) {
      targetTab.widgets = []
    }
    targetTab.widgets.push(draggedWidget)
    
    sourceTabview.tabs = [...sourceTabview.tabs]
    tabviewWidget.tabs = [...tabviewWidget.tabs!]
    store.saveState()
  } else if (draggedItem.value.type === 'tile-widget') {
    // Moving from tile to tab (at the end)
    const parentTileview = findWidgetById(draggedItem.value.parentId!)
    if (!parentTileview?.tiles) return
    
    const sourceTile = parentTileview.tiles[draggedItem.value.tileIndex!]
    if (!sourceTile?.widgets) return
    
    const draggedIndex = sourceTile.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTile.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    if (!targetTab.widgets) {
      targetTab.widgets = []
    }
    targetTab.widgets.push(draggedWidget)
    
    parentTileview.tiles = [...parentTileview.tiles]
    tabviewWidget.tabs = [...tabviewWidget.tabs!]
    store.saveState()
  }
  
  draggedItem.value = null
}

// Tile widget drag handlers
function handleTileWidgetDragStart(event: DragEvent, tileviewWidget: Widget, tileIndex: number, widget: Widget) {
  draggedItem.value = {
    type: 'tile-widget',
    widgetId: widget.id,
    parentId: tileviewWidget.id,
    tileIndex
  }
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/plain', widget.id)
  event.stopPropagation()
}

function handleTileWidgetDragOver(event: DragEvent, tileviewWidget: Widget, tileIndex: number) {
  // Allow any widget type to be dropped into tiles
  if (draggedItem.value) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
    
    // Detect if this is a reordering scenario (dragging tile-widget within same tile)
    if (draggedItem.value.type === 'tile-widget' && draggedItem.value.parentId === tileviewWidget.id && draggedItem.value.tileIndex === tileIndex) {
      isReordering.value = true
    } else {
      isReordering.value = false
    }
  }
}

function handleTileWidgetDrop(event: DragEvent, tileviewWidget: Widget, tileIndex: number, targetWidget: Widget) {
  event.preventDefault()
  event.stopPropagation()
  
  if (!draggedItem.value) return
  if (draggedItem.value.widgetId === targetWidget.id) return
  
  const targetTile = tileviewWidget.tiles?.[tileIndex]
  if (!targetTile?.widgets) return
  
  // Handle different source types
  if (draggedItem.value.type === 'widget') {
    // Moving from root to tile
    const draggedIndex = store.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = store.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0 when moving from root
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    // Add to target tile
    const targetIndex = targetTile.widgets.findIndex(w => w.id === targetWidget.id)
    if (targetIndex === -1) {
      targetTile.widgets.push(draggedWidget)
    } else {
      targetTile.widgets.splice(targetIndex, 0, draggedWidget)
    }
    
    tileviewWidget.tiles = [...tileviewWidget.tiles!]
    store.saveState()
  } else if (draggedItem.value.type === 'tab-widget') {
    // Moving from tab to tile
    const parentTabview = findWidgetById(draggedItem.value.parentId!)
    if (!parentTabview?.tabs) return
    
    const sourceTab = parentTabview.tabs[draggedItem.value.tabIndex!]
    if (!sourceTab?.widgets) return
    
    const draggedIndex = sourceTab.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTab.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    // Add to target tile
    const targetIndex = targetTile.widgets.findIndex(w => w.id === targetWidget.id)
    if (targetIndex === -1) {
      targetTile.widgets.push(draggedWidget)
    } else {
      targetTile.widgets.splice(targetIndex, 0, draggedWidget)
    }
    
    parentTabview.tabs = [...parentTabview.tabs]
    tileviewWidget.tiles = [...tileviewWidget.tiles!]
    store.saveState()
  } else if (draggedItem.value.type === 'tile-widget') {
    // Moving within tiles or between tiles
    if (draggedItem.value.parentId !== tileviewWidget.id) return
    
    const sourceTile = tileviewWidget.tiles?.[draggedItem.value.tileIndex!]
    if (!sourceTile?.widgets) return
    
    const draggedIndex = sourceTile.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTile.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // If moving within the same tile, find target index after removal
    if (draggedItem.value.tileIndex === tileIndex) {
      const targetIndex = sourceTile.widgets.findIndex(w => w.id === targetWidget.id)
      if (targetIndex === -1) {
        sourceTile.widgets.push(draggedWidget)
      } else {
        sourceTile.widgets.splice(targetIndex, 0, draggedWidget)
      }
    } else {
      // Moving to a different tile - reset position to 0,0
      draggedWidget.x = 0
      draggedWidget.y = 0
      
      const targetIndex = targetTile.widgets.findIndex(w => w.id === targetWidget.id)
      if (targetIndex === -1) {
        targetTile.widgets.push(draggedWidget)
      } else {
        targetTile.widgets.splice(targetIndex, 0, draggedWidget)
      }
    }
    
    tileviewWidget.tiles = [...tileviewWidget.tiles!]
    store.saveState()
  }
  
  draggedItem.value = null
}

// Allow dropping on tile container (when empty or between widgets)
function handleTileContainerDragOver(event: DragEvent, tileviewWidget: Widget, tileIndex: number) {
  if (draggedItem.value) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = 'move'
  }
}

function handleTileContainerDrop(event: DragEvent, tileviewWidget: Widget, tileIndex: number) {
  event.preventDefault()
  event.stopPropagation()
  
  if (!draggedItem.value) return
  
  const targetTile = tileviewWidget.tiles?.[tileIndex]
  if (!targetTile) return
  
  // Handle different source types
  if (draggedItem.value.type === 'widget') {
    // Moving from root to tile (at the end)
    const draggedIndex = store.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = store.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    if (!targetTile.widgets) {
      targetTile.widgets = []
    }
    targetTile.widgets.push(draggedWidget)
    
    tileviewWidget.tiles = [...tileviewWidget.tiles!]
    store.saveState()
  } else if (draggedItem.value.type === 'tab-widget') {
    // Moving from tab to tile (at the end)
    const parentTabview = findWidgetById(draggedItem.value.parentId!)
    if (!parentTabview?.tabs) return
    
    const sourceTab = parentTabview.tabs[draggedItem.value.tabIndex!]
    if (!sourceTab?.widgets) return
    
    const draggedIndex = sourceTab.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTab.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    if (!targetTile.widgets) {
      targetTile.widgets = []
    }
    targetTile.widgets.push(draggedWidget)
    
    parentTabview.tabs = [...parentTabview.tabs]
    tileviewWidget.tiles = [...tileviewWidget.tiles!]
    store.saveState()
  } else if (draggedItem.value.type === 'tile-widget') {
    // Moving between tiles
    if (draggedItem.value.parentId !== tileviewWidget.id) return
    
    // Don't do anything if dropping in the same tile with no target
    if (draggedItem.value.tileIndex === tileIndex) {
      draggedItem.value = null
      return
    }
    
    const sourceTile = tileviewWidget.tiles?.[draggedItem.value.tileIndex!]
    if (!sourceTile?.widgets) return
    
    const draggedIndex = sourceTile.widgets.findIndex(w => w.id === draggedItem.value!.widgetId)
    if (draggedIndex === -1) return
    
    const [draggedWidget] = sourceTile.widgets.splice(draggedIndex, 1)
    if (!draggedWidget) return
    
    // Reset position to 0,0 when moving to different tile
    draggedWidget.x = 0
    draggedWidget.y = 0
    
    if (!targetTile.widgets) {
      targetTile.widgets = []
    }
    targetTile.widgets.push(draggedWidget)
    
    tileviewWidget.tiles = [...tileviewWidget.tiles!]
    store.saveState()
  }
  
  draggedItem.value = null
}

function handleDragEnd() {
  draggedItem.value = null
  hoveredDropTargetId.value = null
  dropIndicatorId.value = null
  dropIndicatorPosition.value = null
  isReordering.value = false
}

function getWidgetIcon(widget: Widget): string {
  return widgetIconMap[widget.type] || 'widgets'
}
</script>

<template>
  <aside class="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex shrink-0 overflow-hidden relative" :style="{ width: sidebarWidth + 'px' }">
    <!-- Horizontal Resize Handle (Left Edge) -->
    <div
      @mousedown="startResizeWidth"
      class="absolute left-0 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-700 hover:bg-indigo-500 cursor-ew-resize transition-colors z-10 group"
      :class="{ 'bg-indigo-500': isResizingWidth }"
      title="Drag to resize sidebar width"
    >
      <div class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-400 dark:bg-gray-600 group-hover:bg-indigo-400 transition-colors"></div>
    </div>

    <!-- Sidebar Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Elements List Section -->
      <div class="shrink-0 border-b border-gray-200 dark:border-gray-700" :style="{ height: elementsHeight + 'px' }">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            Elements <span class="text-indigo-600 dark:text-indigo-400">({{ store.widgetCount }})</span>
          </h2>
        </div>
      
      <div class="h-[calc(100%-49px)] overflow-y-auto custom-scrollbar">
        <ul class="p-2 space-y-1">
          <!-- Root container header -->
          <li class="mb-2">
            <div
              @dragover.prevent="hoveredDropTargetId = '__root__'; handleWidgetDragOver($event)"
              @drop="handleRootDrop($event)"
              @click="store.selectWidget(null)"
              :class="[
                'flex items-center gap-2 p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                store.selectedWidgetId === null
                  ? 'bg-indigo-600 text-white'
                  : hoveredDropTargetId === '__root__'
                  ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border-2 border-green-500 ring-2 ring-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
              title="Root container - click to view canvas properties"
            >
              <Icon icon="dashboard" size="16" class="shrink-0 pointer-events-none" />
              <span class="pointer-events-none">Root</span>
              <span class="text-[10px] opacity-60 pointer-events-none">({{ store.widgets.length }} widgets)</span>
            </div>
          </li>

          <!-- Root widgets (shown as children of root) - only shown if there are widgets -->
          <ul v-if="store.widgetCount > 0" class="ml-2 space-y-1 border-l-2 border-gray-300 dark:border-gray-700 pl-2">
            <li v-for="widget in store.widgets" :key="widget.id" class="relative">
              <!-- Drop indicator line (shown when reordering) -->
              <div
                v-if="dropIndicatorId === widget.id && isReordering && draggedItem?.type === 'widget'"
                :class="[
                  'absolute left-0 right-0 h-0.5 bg-blue-500 pointer-events-none z-10',
                  dropIndicatorPosition === 'before' ? '-top-0.5' : '-bottom-0.5'
                ]"
              />
            <!-- Top-level widget -->
            <div
              draggable="true"
              @dragstart="handleWidgetDragStart($event, widget)"
              @dragover.prevent="hoveredDropTargetId = (isReordering || widget.type === 'tabview' || widget.type === 'tileview') ? null : widget.id; handleWidgetDragOver($event); handleWidgetReorderDragOver($event, widget.id)"
              @drop="handleWidgetDrop($event, widget)"
              @dragend="handleDragEnd"
              @click="store.selectWidget(widget.id)"
              :class="[
                'flex items-center justify-between p-2 rounded-lg cursor-move text-xs transition-all group',
                !isReordering && hoveredDropTargetId === widget.id
                  ? 'bg-green-600 dark:bg-green-700 text-white ring-2 ring-green-400 border-green-400'
                  : store.selectedWidgetId === widget.id
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              ]"
            >
              <span class="flex items-center gap-2 min-w-0 flex-1">
                <!-- Collapse button for tabview/tileview -->
                <button
                  v-if="(widget.type === 'tabview' && widget.tabs && widget.tabs.length > 0) || (widget.type === 'tileview' && widget.tiles && widget.tiles.length > 0)"
                  @click.stop="toggleWidgetCollapse(widget.id)"
                  @dragstart.stop
                  class="p-0 rounded hover:bg-gray-300 dark:hover:bg-gray-600 shrink-0 pointer-events-auto w-4 h-4 flex items-center justify-center"
                  :title="isWidgetCollapsed(widget.id) ? 'Expand' : 'Collapse'"
                >
                  <Icon :icon="isWidgetCollapsed(widget.id) ? 'chevron-right' : 'expand-more'" size="16" />
                </button>
                <Icon :icon="getWidgetIcon(widget)" size="16" class="shrink-0 pointer-events-none" />
                <span class="truncate pointer-events-none">{{ widget.text || widget.type }}</span>
                <span v-if="widget.type === 'tabview' && widget.tabs" class="text-[10px] opacity-60 pointer-events-none">
                  ({{ widget.tabs.length }} tabs)
                </span>
                <span v-if="widget.type === 'tileview' && widget.tiles" class="text-[10px] opacity-60 pointer-events-none">
                  ({{ widget.tiles.length }} tiles)
                </span>
              </span>
              <button
                @click.stop="store.deleteWidget(widget.id)"
                @dragstart.stop
                class="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all shrink-0 pointer-events-auto"
                title="Delete widget"
              >
                <Icon icon="delete" size="16" />
              </button>
            </div>

            <!-- Nested tabs and widgets for tabview -->
            <ul v-if="widget.type === 'tabview' && widget.tabs && widget.tabs.length > 0 && !isWidgetCollapsed(widget.id)" class="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-700 pl-2">
              <li v-for="(tab, tabIndex) in widget.tabs" :key="tab.id" class="space-y-1">
                <!-- Tab header -->
                <div 
                  class="flex items-center gap-1 px-1.5 py-1 text-[11px] font-medium -ml-2 rounded transition-all"
                  :class="[
                    hoveredDropTargetId === `tab_${widget.id}_${tab.id}`
                      ? 'bg-green-600 dark:bg-green-700 text-white ring-1 ring-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  ]"
                  @dragover.prevent="hoveredDropTargetId = `tab_${widget.id}_${tab.id}`; handleTabContainerDragOver($event, widget, tabIndex)"
                  @drop="handleTabContainerDrop($event, widget, tabIndex)"
                >
                  <button
                    @click.stop="toggleTabCollapse(widget.id, tab.id)"
                    class="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                    :title="isTabCollapsed(widget.id, tab.id) ? 'Expand tab' : 'Collapse tab'"
                  >
                    <Icon :icon="isTabCollapsed(widget.id, tab.id) ? 'chevron-right' : 'expand-more'" size="12" />
                  </button>
                  <Icon icon="tab" size="14" class="shrink-0" />
                  <span class="truncate">{{ tab.name }}</span>
                  <span v-if="tab.widgets && tab.widgets.length > 0" class="text-[9px] opacity-60">
                    ({{ tab.widgets.length }})
                  </span>
                </div>
                
                <!-- Widgets in this tab -->
                <ul 
                  v-if="tab.widgets && tab.widgets.length > 0 && !isTabCollapsed(widget.id, tab.id)" 
                  class="ml-4 space-y-0.5"
                  @dragover="handleTabContainerDragOver($event, widget, tabIndex)"
                  @drop="handleTabContainerDrop($event, widget, tabIndex)"
                >
                  <li
                    v-for="childWidget in tab.widgets"
                    :key="childWidget.id"
                    class="relative space-y-1"
                  >
                    <!-- Drop indicator line (shown when reordering) -->
                    <div
                      v-if="dropIndicatorId === childWidget.id && isReordering && draggedItem?.type === 'tab-widget' && draggedItem?.parentId === widget.id && draggedItem?.tabIndex === tabIndex"
                      :class="[
                        'absolute left-0 right-0 h-0.5 bg-blue-500 pointer-events-none z-10',
                        dropIndicatorPosition === 'before' ? '-top-0.5' : '-bottom-0.5'
                      ]"
                    />
                    <!-- Child widget item -->
                    <div
                      draggable="true"
                      @dragstart="handleTabWidgetDragStart($event, widget, tabIndex, childWidget)"
                      @dragover="handleTabWidgetDragOver($event, widget, tabIndex); handleTabWidgetReorderDragOver($event, childWidget.id)"
                      @drop="handleTabWidgetDrop($event, widget, tabIndex, childWidget)"
                      @dragend="handleDragEnd"
                      @click.stop="selectTabWidget(widget, tabIndex, childWidget.id)"
                      :class="[
                        'flex items-center justify-between px-2 py-1 rounded cursor-move text-[11px] transition-all group',
                        store.selectedWidgetId === childWidget.id
                          ? 'bg-indigo-600 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400'
                      ]"
                    >
                      <span class="flex items-center gap-1.5 min-w-0 flex-1 pointer-events-none">
                        <Icon :icon="getWidgetIcon(childWidget)" size="12" class="shrink-0" />
                        <span class="truncate">{{ childWidget.text || childWidget.type }}</span>
                        <span v-if="childWidget.type === 'tileview' && childWidget.tiles" class="text-[9px] opacity-60">
                          ({{ childWidget.tiles.length }} tiles)
                        </span>
                      </span>
                      <button
                        @click.stop="removeTabWidget(widget, tabIndex, childWidget.id)"
                        class="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all shrink-0 pointer-events-auto"
                        title="Delete widget"
                      >
                        <Icon icon="delete" size="12" />
                      </button>
                    </div>

                    <!-- If this child widget is a tileview, show its tiles -->
                    <ul v-if="childWidget.type === 'tileview' && childWidget.tiles && childWidget.tiles.length > 0" class="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-700 pl-3">
                      <li v-for="(tile, nestedTileIndex) in childWidget.tiles" :key="tile.id" class="space-y-1">
                        <!-- Tile header -->
                        <div 
                          @click.stop="selectTileFromList(childWidget, tile.row, tile.column)"
                          @dragover.prevent="hoveredDropTargetId = `tile_${childWidget.id}_${tile.id}`; handleTileContainerDragOver($event, childWidget, nestedTileIndex)"
                          @drop="handleTileContainerDrop($event, childWidget, nestedTileIndex)"
                          :class="[
                            'flex items-center gap-1 px-1.5 py-1 text-[10px] font-medium cursor-pointer rounded transition-all group -ml-2',
                            hoveredDropTargetId === `tile_${childWidget.id}_${tile.id}`
                              ? 'bg-green-600 dark:bg-green-700 text-white ring-1 ring-green-400'
                              : tile.row === (childWidget.current_tile_row || 0) && tile.column === (childWidget.current_tile_column || 0)
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          ]"
                          :title="`Click to view this tile [${tile.row},${tile.column}]`"
                        >
                          <button
                            @click.stop="toggleTileCollapse(childWidget.id, tile.id)"
                            class="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                            :title="isTileCollapsed(childWidget.id, tile.id) ? 'Expand tile' : 'Collapse tile'"
                          >
                            <Icon :icon="isTileCollapsed(childWidget.id, tile.id) ? 'chevron-right' : 'expand-more'" size="12" />
                          </button>
                          <Icon icon="more-horiz" size="12" class="shrink-0" />
                          <span class="truncate">{{ tile.label || tile.id }}</span>
                          <span class="text-[8px] opacity-40">[{{ tile.row }},{{ tile.column }}]</span>
                          <span v-if="tile.widgets && tile.widgets.length > 0" class="text-[8px] opacity-60">
                            ({{ tile.widgets.length }})
                          </span>
                          <button
                            @click.stop="openTileLayoutConfig(childWidget, nestedTileIndex)"
                            class="ml-auto opacity-0 group-hover:opacity-100 hover:text-indigo-400 transition-all shrink-0"
                            title="Configure tile layout"
                          >
                            <Icon icon="settings" size="12" />
                          </button>
                        </div>
                        
                        <!-- Widgets in this tile -->
                        <ul 
                          v-if="tile.widgets && tile.widgets.length > 0 && !isTileCollapsed(childWidget.id, tile.id)" 
                          class="ml-4 space-y-0.5"
                          @dragover="handleTileContainerDragOver($event, childWidget, nestedTileIndex)"
                          @drop="handleTileContainerDrop($event, childWidget, nestedTileIndex)"
                        >
                          <li
                            v-for="tileWidget in tile.widgets"
                            :key="tileWidget.id"
                            class="relative"
                          >
                            <!-- Drop indicator line (shown when reordering) -->
                            <div
                              v-if="dropIndicatorId === tileWidget.id && isReordering && draggedItem?.type === 'tile-widget' && draggedItem?.parentId === childWidget.id && draggedItem?.tileIndex === nestedTileIndex"
                              :class="[
                                'absolute left-0 right-0 h-0.5 bg-blue-500 pointer-events-none z-10',
                                dropIndicatorPosition === 'before' ? '-top-0.5' : '-bottom-0.5'
                              ]"
                            />
                            <div
                              draggable="true"
                              @dragstart="handleTileWidgetDragStart($event, childWidget, nestedTileIndex, tileWidget)"
                              @dragover="handleTileWidgetDragOver($event, childWidget, nestedTileIndex); handleTileWidgetReorderDragOver($event, tileWidget.id)"
                              @drop="handleTileWidgetDrop($event, childWidget, nestedTileIndex, tileWidget)"
                              @dragend="handleDragEnd"
                              @click.stop="selectTileWidget(childWidget, nestedTileIndex, tileWidget.id)"
                              :class="[
                                'flex items-center justify-between px-2 py-0.5 rounded cursor-move text-[10px] transition-all group',
                                store.selectedWidgetId === tileWidget.id
                                  ? 'bg-indigo-600 text-white'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                              ]"
                            >
                            <span class="flex items-center gap-1 min-w-0 flex-1 pointer-events-none">
                              <Icon :icon="getWidgetIcon(tileWidget)" size="10" class="shrink-0" />
                              <span class="truncate">{{ tileWidget.text || tileWidget.type }}</span>
                            </span>
                            <button
                              @click.stop="removeTileWidget(childWidget, nestedTileIndex, tileWidget.id)"
                              class="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all shrink-0 pointer-events-auto"
                              title="Delete widget"
                            >
                              <Icon icon="delete" size="10" />
                            </button>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>

            <!-- Nested tiles and widgets for tileview -->
            <ul v-if="widget.type === 'tileview' && widget.tiles && widget.tiles.length > 0 && !isWidgetCollapsed(widget.id)" class="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-700 pl-3">
              <li v-for="(tile, tileIndex) in widget.tiles" :key="tile.id" class="space-y-1">
                <!-- Tile header -->
                <div 
                  @click.stop="selectTileFromList(widget, tile.row, tile.column)"
                  @dragover="handleTileContainerDragOver($event, widget, tileIndex)"
                  @drop="handleTileContainerDrop($event, widget, tileIndex)"
                  :class="[
                    'flex items-center gap-1 px-1.5 py-1 text-[11px] font-medium cursor-pointer rounded transition-all group -ml-2',
                    tile.row === (widget.current_tile_row || 0) && tile.column === (widget.current_tile_column || 0)
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  ]"
                  :title="`Click to view this tile [${tile.row},${tile.column}]`"
                >
                  <button
                    @click.stop="toggleTileCollapse(widget.id, tile.id)"
                    class="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                    :title="isTileCollapsed(widget.id, tile.id) ? 'Expand tile' : 'Collapse tile'"
                  >
                    <Icon :icon="isTileCollapsed(widget.id, tile.id) ? 'chevron-right' : 'expand-more'" size="12" />
                  </button>
                  <Icon icon="more-horiz" size="14" class="shrink-0" />
                  <span class="truncate">{{ tile.label || tile.id }}</span>
                  <span class="text-[9px] opacity-40">[{{ tile.row }},{{ tile.column }}]</span>
                  <span v-if="tile.widgets && tile.widgets.length > 0" class="text-[9px] opacity-60">
                    ({{ tile.widgets.length }})
                  </span>
                </div>
                
                <!-- Widgets in this tile -->
                <ul 
                  v-if="tile.widgets && tile.widgets.length > 0 && !isTileCollapsed(widget.id, tile.id)" 
                  class="ml-4 space-y-0.5"
                  @dragover="handleTileContainerDragOver($event, widget, tileIndex)"
                  @drop="handleTileContainerDrop($event, widget, tileIndex)"
                >
                  <li
                    v-for="childWidget in tile.widgets"
                    :key="childWidget.id"
                    class="relative"
                  >
                    <!-- Drop indicator line (shown when reordering) -->
                    <div
                      v-if="dropIndicatorId === childWidget.id && isReordering && draggedItem?.type === 'tile-widget' && draggedItem?.parentId === widget.id && draggedItem?.tileIndex === tileIndex"
                      :class="[
                        'absolute left-0 right-0 h-0.5 bg-blue-500 pointer-events-none z-10',
                        dropIndicatorPosition === 'before' ? '-top-0.5' : '-bottom-0.5'
                      ]"
                    />
                    <div
                      draggable="true"
                      @dragstart="handleTileWidgetDragStart($event, widget, tileIndex, childWidget)"
                      @dragover="handleTileWidgetDragOver($event, widget, tileIndex); handleTileWidgetReorderDragOver($event, childWidget.id)"
                      @drop="handleTileWidgetDrop($event, widget, tileIndex, childWidget)"
                      @dragend="handleDragEnd"
                      @click.stop="selectTileWidget(widget, tileIndex, childWidget.id)"
                      :class="[
                        'flex items-center justify-between px-2 py-1 rounded cursor-move text-[11px] transition-all group',
                        store.selectedWidgetId === childWidget.id
                          ? 'bg-indigo-600 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      ]"
                    >
                    <span class="flex items-center gap-1.5 min-w-0 flex-1 pointer-events-none">
                      <Icon :icon="getWidgetIcon(childWidget)" size="12" class="shrink-0" />
                      <span class="truncate">{{ childWidget.text || childWidget.type }}</span>
                    </span>
                    <button
                      @click.stop="removeTileWidget(widget, tileIndex, childWidget.id)"
                      class="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all shrink-0 pointer-events-auto"
                      title="Delete widget"
                    >
                      <Icon icon="delete" size="12" />
                    </button>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            </li>
          </ul>
        </ul>
      </div>
    </div>

    <!-- Resize Handle -->
    <div
      @mousedown="startResize"
      class="h-1 bg-gray-300 dark:bg-gray-700 hover:bg-indigo-500 cursor-ns-resize transition-colors relative group"
      :class="{ 'bg-indigo-500': isResizing }"
      title="Drag to resize"
    >
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-400 dark:bg-gray-600 group-hover:bg-indigo-400 transition-colors"></div>
    </div>

    <!-- Properties Panel Section -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
          Properties
        </h2>
      </div>
      
      <div v-if="!store.selectedWidget" class="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto custom-scrollbar">
        <div>
          <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">Canvas Properties</h3>
          
          <!-- Canvas Background Color -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Background Color</label>
              <button
                v-if="activeTab?.bg_color !== undefined"
                @click="() => {
                  if (activeTab) {
                    activeTab.bg_color = undefined
                    store.saveState()
                  }
                }"
                class="text-xs px-2 py-0.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="Reset to default (remove from YAML)"
              >
                Reset
              </button>
            </div>
            <div class="flex gap-2">
              <input
                type="color"
                :value="activeTab?.bg_color || '#111827'"
                @input="(e) => {
                  if (activeTab) {
                    activeTab.bg_color = (e.target as HTMLInputElement).value
                    store.saveState()
                  }
                }"
                class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                title="Pick canvas background color"
              />
              <input
                type="text"
                :value="activeTab?.bg_color || '#111827'"
                @input="(e) => {
                  if (activeTab) {
                    activeTab.bg_color = (e.target as HTMLInputElement).value
                    store.saveState()
                  }
                }"
                placeholder="#111827"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1" :class="{ 'text-indigo-400': activeTab?.bg_color !== undefined }">
              {{ activeTab?.bg_color !== undefined ? '(custom - will be exported)' : '(using default)' }}
            </p>
          </div>

          <!-- Canvas Background Opacity -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Background Opacity: {{ activeTab?.bg_opa !== undefined ? activeTab.bg_opa : 100 }}%
              </label>
              <button
                v-if="activeTab?.bg_opa !== undefined"
                @click="() => {
                  if (activeTab) {
                    activeTab.bg_opa = undefined
                    store.saveState()
                  }
                }"
                class="text-xs px-2 py-0.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="Reset to default (remove from YAML)"
              >
                Reset
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              :value="activeTab?.bg_opa !== undefined ? activeTab.bg_opa : 100"
              @input="(e) => {
                if (activeTab) {
                  activeTab.bg_opa = Number((e.target as HTMLInputElement).value)
                  store.saveState()
                }
              }"
              class="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              title="Canvas background opacity"
            />
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1" :class="{ 'text-indigo-400': activeTab?.bg_opa !== undefined }">
              {{ activeTab?.bg_opa !== undefined ? '(custom - will be exported)' : '(using default)' }}
            </p>
          </div>

          <!-- Canvas Padding -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Padding (all sides)</label>
              <button
                v-if="activeTab?.pad_all !== undefined && activeTab.pad_all > 0"
                @click="() => {
                  if (activeTab) {
                    activeTab.pad_all = undefined
                    store.saveState()
                  }
                }"
                class="text-xs px-2 py-0.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="Reset to default (remove from YAML)"
              >
                Reset
              </button>
            </div>
            <input
              type="number"
              min="0"
              max="50"
              :value="activeTab?.pad_all !== undefined ? activeTab.pad_all : 0"
              @input="(e) => {
                if (activeTab) {
                  const val = Number((e.target as HTMLInputElement).value)
                  activeTab.pad_all = val > 0 ? val : undefined
                  store.saveState()
                }
              }"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1" :class="{ 'text-indigo-400': activeTab?.pad_all !== undefined && activeTab.pad_all > 0 }">
              {{ activeTab?.pad_all !== undefined && activeTab.pad_all > 0 ? `(custom - will be exported as ${activeTab.pad_all}px)` : '(using default)' }}
            </p>
          </div>

          <!-- Canvas Flags -->
          <div class="pt-4 border-t border-gray-300 dark:border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Flags</label>
              <button
                v-if="activeTab?.flags && activeTab.flags.length > 0"
                @click="() => {
                  if (activeTab) {
                    activeTab.flags = undefined
                    store.saveState()
                  }
                }"
                class="text-xs px-2 py-0.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="Reset to default (remove from YAML)"
              >
                Reset
              </button>
            </div>
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="activeTab?.flags?.includes('SCROLLABLE') || false"
                  @change="(e) => {
                    if (!activeTab) return
                    const isChecked = (e.target as HTMLInputElement).checked
                    let flags = activeTab.flags ? [...activeTab.flags] : []
                    if (isChecked && !flags.includes('SCROLLABLE')) {
                      flags.push('SCROLLABLE')
                    } else if (!isChecked && flags.includes('SCROLLABLE')) {
                      flags = flags.filter(f => f !== 'SCROLLABLE')
                    }
                    activeTab.flags = flags.length > 0 ? flags : undefined
                    store.saveState()
                  }"
                  class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span class="text-xs text-gray-600 dark:text-gray-400">SCROLLABLE</span>
              </label>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1" :class="{ 'text-indigo-400': activeTab?.flags && activeTab.flags.length > 0 }">
              {{ activeTab?.flags && activeTab.flags.length > 0 ? '(custom - will be exported)' : '(using default - not exported)' }}
            </p>
          </div>
        </div>
      </div>
      
      <form v-else @submit.prevent class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <!-- Position -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">X Position</label>
            <input
              type="number"
              :value="store.selectedWidget.x"
              @input="handleNumberInput('x', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Y Position</label>
            <input
              type="number"
              :value="store.selectedWidget.y"
              @input="handleNumberInput('y', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Size -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Width</label>
            <input
              type="number"
              min="0"
              :value="store.selectedWidget.width"
              @input="handleNumberInput('width', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="auto"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Height</label>
            <input
              type="number"
              min="0"
              :value="store.selectedWidget.height"
              @input="handleNumberInput('height', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="auto"
            />
          </div>
        </div>

        <!-- Text (if applicable) -->
        <div v-if="'text' in store.selectedWidget">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Text</label>
          <input
            type="text"
            :value="store.selectedWidget.text"
            @input="handleInputChange('text', ($event.target as HTMLInputElement).value)"
            class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Colors Section -->
        <div v-if="['button', 'label'].includes(store.selectedWidget.type)" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Colors</div>
          
          <div v-if="'text_color' in store.selectedWidget || store.selectedWidget.type === 'button' || store.selectedWidget.type === 'label'">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Text Color</label>
            <div class="flex gap-2">
              <input
                type="color"
                :value="store.selectedWidget.text_color || '#ffffff'"
                @input="handleInputChange('text_color', ($event.target as HTMLInputElement).value)"
                class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                title="Pick text color"
              />
              <input
                type="text"
                :value="store.selectedWidget.text_color || '#ffffff'"
                @input="handleInputChange('text_color', ($event.target as HTMLInputElement).value)"
                placeholder="#ffffff"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
          </div>
          
          <div v-if="'bg_color' in store.selectedWidget || store.selectedWidget.type === 'button'">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Background Color</label>
            <div class="flex gap-2">
              <input
                type="color"
                :value="store.selectedWidget.bg_color || '#4f46e5'"
                @input="handleInputChange('bg_color', ($event.target as HTMLInputElement).value)"
                class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                title="Pick background color"
              />
              <input
                type="text"
                :value="store.selectedWidget.bg_color || '#4f46e5'"
                @input="handleInputChange('bg_color', ($event.target as HTMLInputElement).value)"
                placeholder="#4f46e5"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
          </div>
        </div>

        <!-- Button-specific properties -->
        <div v-if="store.selectedWidget.type === 'button'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Button Settings</div>
          
          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="store.selectedWidget.checkable || false"
                @change="handleInputChange('checkable', ($event.target as HTMLInputElement).checked)"
                class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
              />
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Checkable (Toggle Button)</span>
            </label>
            <p class="text-[10px] text-gray-500 mt-1 ml-6">Makes the button remain pressed in checked state</p>
          </div>

          <div v-if="store.selectedWidget.checkable">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="store.selectedWidget.checked || false"
                @change="handleInputChange('checked', ($event.target as HTMLInputElement).checked)"
                class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
              />
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Initially Checked</span>
            </label>
          </div>
        </div>

        <!-- Text Align -->
        <div v-if="'text_align' in store.selectedWidget">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Text Align</label>
          <select
            :value="store.selectedWidget.text_align"
            @change="handleInputChange('text_align', ($event.target as HTMLSelectElement).value)"
            class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="LEFT">Left</option>
            <option value="CENTER">Center</option>
            <option value="RIGHT">Right</option>
          </select>
        </div>

        <!-- Min/Max/Value (for sliders, bars, etc) -->
        <div v-if="'min_value' in store.selectedWidget" class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Min</label>
            <input
              type="number"
              :value="store.selectedWidget.min_value"
              @input="handleNumberInput('min_value', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Max</label>
            <input
              type="number"
              :value="store.selectedWidget.max_value"
              @input="handleNumberInput('max_value', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Value</label>
            <input
              type="number"
              :value="store.selectedWidget.value"
              @input="handleNumberInput('value', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Bar Mode (for bars) -->
        <div v-if="store.selectedWidget.type === 'bar'">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mode</label>
          <select
            :value="store.selectedWidget.mode || 'NORMAL'"
            @change="handleInputChange('mode', ($event.target as HTMLSelectElement).value)"
            class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="NORMAL">NORMAL - Min to Value</option>
            <option value="RANGE">RANGE - Start to Value</option>
            <option value="SYMMETRICAL">SYMMETRICAL - Middle to Value</option>
          </select>
        </div>

        <!-- Start Value (for RANGE mode bars) -->
        <div v-if="store.selectedWidget.type === 'bar' && store.selectedWidget.mode === 'RANGE'">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Start Value</label>
          <input
            type="number"
            min="0"
            :value="store.selectedWidget.start_value"
            @input="handleNumberInput('start_value', $event)"
            class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Slider-specific properties -->
        <div v-if="store.selectedWidget.type === 'slider'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Slider Settings</div>
          
          <!-- Indicator settings -->
          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Indicator (Value Display)</div>
            <div class="space-y-2 pl-2 border-l-2 border-gray-300 dark:border-gray-700">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Background Color</label>
                <div class="flex gap-2">
                  <input
                    type="color"
                    :value="store.selectedWidget.indicator?.bg_color || '#4F46E5'"
                    @input="handleIndicatorChange('bg_color', ($event.target as HTMLInputElement).value)"
                    class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    :value="store.selectedWidget.indicator?.bg_color || ''"
                    @input="handleIndicatorChange('bg_color', ($event.target as HTMLInputElement).value)"
                    placeholder="Auto"
                    class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Opacity (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  :value="store.selectedWidget.indicator?.bg_opa || 100"
                  @input="handleIndicatorChange('bg_opa', Number(($event.target as HTMLInputElement).value))"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Knob settings -->
          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Knob (Control Handle)</div>
            <div class="space-y-2 pl-2 border-l-2 border-gray-300 dark:border-gray-700">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Background Color</label>
                <div class="flex gap-2">
                  <input
                    type="color"
                    :value="store.selectedWidget.knob?.bg_color || '#818CF8'"
                    @input="handleKnobChange('bg_color', ($event.target as HTMLInputElement).value)"
                    class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    :value="store.selectedWidget.knob?.bg_color || ''"
                    @input="handleKnobChange('bg_color', ($event.target as HTMLInputElement).value)"
                    placeholder="Auto"
                    class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Border Color</label>
                <div class="flex gap-2">
                  <input
                    type="color"
                    :value="store.selectedWidget.knob?.border_color || '#6366F1'"
                    @input="handleKnobChange('border_color', ($event.target as HTMLInputElement).value)"
                    class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    :value="store.selectedWidget.knob?.border_color || ''"
                    @input="handleKnobChange('border_color', ($event.target as HTMLInputElement).value)"
                    placeholder="Auto"
                    class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Border Width (pixels)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  :value="store.selectedWidget.knob?.border_width || 0"
                  @input="handleKnobChange('border_width', Number(($event.target as HTMLInputElement).value))"
                  class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Corner Radius (pixels)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  :value="store.selectedWidget.knob?.radius || 0"
                  @input="handleKnobChange('radius', Number(($event.target as HTMLInputElement).value))"
                  class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Padding (pixels)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  :value="store.selectedWidget.knob?.pad_all || 0"
                  @input="handleKnobChange('pad_all', Number(($event.target as HTMLInputElement).value))"
                  class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p class="text-[10px] text-gray-500 mt-1">Makes the knob larger in all directions</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Spinbox Settings -->
        <div v-if="store.selectedWidget.type === 'spinbox'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Spinbox Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Range From</label>
            <input
              type="number"
              :value="store.selectedWidget.range_from !== undefined ? store.selectedWidget.range_from : 0"
              @input="handleNumberInput('range_from', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Range To</label>
            <input
              type="number"
              :value="store.selectedWidget.range_to !== undefined ? store.selectedWidget.range_to : 100"
              @input="handleNumberInput('range_to', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Digits</label>
            <input
              type="number"
              :value="store.selectedWidget.digits !== undefined ? store.selectedWidget.digits : 4"
              @input="handleNumberInput('digits', $event)"
              min="1"
              max="10"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">Number of digits (1-10)</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Decimal Places</label>
            <input
              type="number"
              :value="store.selectedWidget.decimal_places !== undefined ? store.selectedWidget.decimal_places : 0"
              @input="handleNumberInput('decimal_places', $event)"
              min="0"
              max="6"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">Digits after decimal point (0-6)</p>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="store.selectedWidget.rollover || false"
              @change="handleInputChange('rollover', ($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-600 text-indigo-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
            <label class="text-xs font-medium text-gray-400">Rollover</label>
            <div class="group relative">
              <span class="text-gray-400 cursor-help">ⓘ</span>
              <div class="invisible group-hover:visible absolute z-10 bg-gray-900 text-gray-200 text-xs rounded p-2 bottom-full left-0 w-48 mb-2">
                When enabled, value wraps from max to min and vice versa. When disabled, value stays at limit.
              </div>
            </div>
          </div>
        </div>

        <!-- Textarea Settings -->
        <div v-if="store.selectedWidget.type === 'textarea'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Textarea Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Text</label>
            <textarea
              :value="store.selectedWidget.text || ''"
              @input="handleInputChange('text', ($event.target as HTMLTextAreaElement).value)"
              rows="3"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Placeholder Text</label>
            <input
              type="text"
              :value="store.selectedWidget.placeholder_text || ''"
              @input="handleInputChange('placeholder_text', ($event.target as HTMLInputElement).value)"
              placeholder="Enter placeholder text"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Max Length</label>
            <input
              type="number"
              :value="store.selectedWidget.max_length !== undefined ? store.selectedWidget.max_length : ''"
              @input="handleNumberInput('max_length', $event)"
              min="1"
              max="10000"
              placeholder="No limit"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Accepted Characters</label>
            <input
              type="text"
              :value="store.selectedWidget.accepted_chars || ''"
              @input="handleInputChange('accepted_chars', ($event.target as HTMLInputElement).value)"
              placeholder="e.g., 0-9 for digits only"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">Characters allowed in the textarea</p>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="store.selectedWidget.one_line || false"
              @change="handleInputChange('one_line', ($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-600 text-indigo-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
            <label class="text-xs font-medium text-gray-400">One Line Mode</label>
            <div class="group relative">
              <span class="text-gray-400 cursor-help">ⓘ</span>
              <div class="invisible group-hover:visible absolute z-10 bg-gray-900 text-gray-200 text-xs rounded p-2 bottom-full left-0 w-48 mb-2">
                Limits textarea to a single line. Line breaks are ignored and word wrap is disabled.
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="store.selectedWidget.password_mode || false"
              @change="handleInputChange('password_mode', ($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-600 text-indigo-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
            <label class="text-xs font-medium text-gray-400">Password Mode</label>
            <div class="group relative">
              <span class="text-gray-400 cursor-help">ⓘ</span>
              <div class="invisible group-hover:visible absolute z-10 bg-gray-900 text-gray-200 text-xs rounded p-2 bottom-full left-0 w-48 mb-2">
                Hides input characters using • (bullet) or * (asterisk).
              </div>
            </div>
          </div>
        </div>

        <!-- Checked (for checkbox/switch) -->
        <div v-if="'checked' in store.selectedWidget" class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="store.selectedWidget.checked"
            @change="handleInputChange('checked', ($event.target as HTMLInputElement).checked)"
            class="rounded border-gray-600 text-indigo-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
          />
          <label class="text-xs font-medium text-gray-400">Checked</label>
        </div>

        <!-- Angle (for arc, meter) -->
        <div v-if="'angle' in store.selectedWidget">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Angle</label>
          <input
            type="number"
            :value="store.selectedWidget.angle"
            @input="handleNumberInput('angle', $event)"
            class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Arc-specific properties -->
        <div v-if="store.selectedWidget.type === 'arc'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Arc Settings</div>
          
          <!-- Adjustable -->
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="store.selectedWidget.adjustable"
              @change="handleInputChange('adjustable', ($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-600 text-indigo-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
            <label class="text-xs font-medium text-gray-400">Adjustable (with knob)</label>
          </div>
          
          <!-- Mode -->
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mode</label>
            <select
              :value="store.selectedWidget.arc_mode || 'NORMAL'"
              @change="handleInputChange('arc_mode', ($event.target as HTMLSelectElement).value)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="NORMAL">Normal</option>
              <option value="REVERSE">Reverse</option>
              <option value="SYMMETRICAL">Symmetrical</option>
            </select>
          </div>
          
          <!-- Angles -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Start Angle</label>
              <input
                type="number"
                :value="store.selectedWidget.start_angle !== undefined ? store.selectedWidget.start_angle : 135"
                @input="handleNumberInput('start_angle', $event)"
                min="0"
                max="360"
                class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">End Angle</label>
              <input
                type="number"
                :value="store.selectedWidget.end_angle !== undefined ? store.selectedWidget.end_angle : 45"
                @input="handleNumberInput('end_angle', $event)"
                min="0"
                max="360"
                class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <!-- Rotation -->
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Rotation</label>
            <input
              type="number"
              :value="store.selectedWidget.rotation || 0"
              @input="handleNumberInput('rotation', $event)"
              min="0"
              max="360"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div class="text-xs font-semibold text-gray-300 uppercase tracking-wider mt-3">Arc Indicator</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color</label>
            <div class="flex gap-2">
              <!-- Color Picker -->
              <div class="relative">
                <input
                  type="color"
                  :value="getLvglColorAsHex()"
                  @input="handleColorPickerInput"
                  class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                  title="Pick a color"
                />
              </div>
              <!-- Hex Input -->
              <input
                type="text"
                :value="store.selectedWidget.indicator?.arc_color || store.selectedWidget.arc_color || '0x818cf8'"
                @input="handleArcColorInput('arc_color', $event)"
                placeholder="0xF000FF"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
            <p class="text-[10px] text-gray-500 mt-1">Use color picker or enter 0xRRGGBB format</p>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Width</label>
            <input
              type="number"
              :value="store.selectedWidget.indicator?.arc_width || store.selectedWidget.arc_width || 8"
              @input="handleArcWidthInput($event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <!-- Rounded -->
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="store.selectedWidget.indicator?.arc_rounded"
              @change="handleArcPropertyInput('arc_rounded', ($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-600 text-indigo-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
            <label class="text-xs font-medium text-gray-400">Rounded ends</label>
          </div>
        </div>

        <!-- Line-specific properties -->
        <div v-if="store.selectedWidget.type === 'line' && 'line_color' in store.selectedWidget" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Line Style</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color</label>
            <div class="flex gap-2">
              <!-- Color Picker -->
              <div class="relative">
                <input
                  type="color"
                  :value="store.selectedWidget.line_color || '#FFFFFF'"
                  @input="handleInputChange('line_color', ($event.target as HTMLInputElement).value)"
                  class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                  title="Pick a color"
                />
              </div>
              <!-- Hex Input -->
              <input
                type="text"
                :value="store.selectedWidget.line_color || '#FFFFFF'"
                @input="handleInputChange('line_color', ($event.target as HTMLInputElement).value)"
                placeholder="#FFFFFF"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
            <p class="text-[10px] text-gray-500 mt-1">Use color picker or enter #RRGGBB format</p>
          </div>
          
          <div v-if="'line_width' in store.selectedWidget">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Line Width (pixels)</label>
            <input
              type="number"
              min="1"
              :value="store.selectedWidget.line_width || 2"
              @input="handleNumberInput('line_width', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div v-if="'line_rounded' in store.selectedWidget" class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="store.selectedWidget.line_rounded"
              @change="handleInputChange('line_rounded', ($event.target as HTMLInputElement).checked)"
              class="rounded border-gray-600 text-indigo-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
            />
            <label class="text-xs font-medium text-gray-400">Rounded Endpoints</label>
          </div>

          <!-- Points Editor -->
          <div v-if="store.selectedWidget && 'points' in store.selectedWidget" class="border-t border-gray-700 pt-3">
            <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Line Points</div>
            <div class="space-y-2">
              <div v-for="(point, index) in (store.selectedWidget.points || [])" :key="index" class="grid grid-cols-3 gap-2 items-end">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">X{{ index }}</label>
                  <input
                    type="number"
                    :value="point.x"
                    @input="(e) => {
                      const widget = store.selectedWidget
                      if (widget?.points?.[index]) {
                        widget.points[index]!.x = Number((e.target as HTMLInputElement).value)
                        store.saveState()
                      }
                    }"
                    class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Y{{ index }}</label>
                  <input
                    type="number"
                    :value="point.y"
                    @input="(e) => {
                      const widget = store.selectedWidget
                      if (widget?.points?.[index]) {
                        widget.points[index]!.y = Number((e.target as HTMLInputElement).value)
                        store.saveState()
                      }
                    }"
                    class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <button
                  v-if="(store.selectedWidget?.points?.length || 0) > 2"
                  @click="() => {
                    const widget = store.selectedWidget
                    if (widget?.points) {
                      widget.points.splice(index, 1)
                      store.saveState()
                    }
                  }"
                  class="px-2 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <button
              @click="() => {
                const widget = store.selectedWidget
                if (widget?.points) {
                  const lastPoint = widget.points[widget.points.length - 1]
                  widget.points.push({ x: (lastPoint?.x || 0) + 10, y: (lastPoint?.y || 0) + 10 })
                  store.saveState()
                }
              }"
              class="mt-2 w-full px-3 py-2 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              + Add Point
            </button>
          </div>
        </div>

        <!-- Checkbox-specific properties -->
        <div v-if="store.selectedWidget.type === 'checkbox'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Checkbox Settings</div>
          
          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Indicator (Tick Box)</div>
            <div class="space-y-3 pl-2 border-l-2 border-gray-300 dark:border-gray-700">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Background Color</label>
                <div class="flex gap-2">
                  <input
                    type="color"
                    :value="store.selectedWidget.indicator?.bg_color || (store.selectedWidget.checked ? '#4f46e5' : '#374151')"
                    @input="handleIndicatorChange('bg_color', ($event.target as HTMLInputElement).value)"
                    class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                    title="Pick background color"
                  />
                  <input
                    type="text"
                    :value="store.selectedWidget.indicator?.bg_color || ''"
                    @input="handleIndicatorChange('bg_color', ($event.target as HTMLInputElement).value)"
                    placeholder="Auto"
                    class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Background Opacity (%)</label>
                <div class="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    :value="store.selectedWidget.indicator?.bg_opa || 100"
                    @input="handleIndicatorChange('bg_opa', Number(($event.target as HTMLInputElement).value))"
                    class="flex-1"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    :value="store.selectedWidget.indicator?.bg_opa || 100"
                    @input="handleIndicatorChange('bg_opa', Number(($event.target as HTMLInputElement).value))"
                    class="w-16 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Border Color</label>
                <div class="flex gap-2">
                  <input
                    type="color"
                    :value="store.selectedWidget.indicator?.border_color || (store.selectedWidget.checked ? '#4f46e5' : '#6b7280')"
                    @input="handleIndicatorChange('border_color', ($event.target as HTMLInputElement).value)"
                    class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                    title="Pick border color"
                  />
                  <input
                    type="text"
                    :value="store.selectedWidget.indicator?.border_color || ''"
                    @input="handleIndicatorChange('border_color', ($event.target as HTMLInputElement).value)"
                    placeholder="Auto"
                    class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Border Width (pixels)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  :value="store.selectedWidget.indicator?.border_width || 2"
                  @input="handleIndicatorChange('border_width', Number(($event.target as HTMLInputElement).value))"
                  class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Corner Radius (pixels)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  :value="store.selectedWidget.indicator?.radius || 4"
                  @input="handleIndicatorChange('radius', Number(($event.target as HTMLInputElement).value))"
                  class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Padding (pixels)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  :value="store.selectedWidget.indicator?.pad_all || 0"
                  @input="handleIndicatorChange('pad_all', Number(($event.target as HTMLInputElement).value))"
                  class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p class="text-[10px] text-gray-500 mt-1">Makes the tick box larger in all directions</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Keyboard-specific properties -->
        <div v-if="store.selectedWidget.type === 'keyboard'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Keyboard Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mode</label>
            <select
              :value="store.selectedWidget.keyboard_mode || 'TEXT_LOWER'"
              @change="handleInputChange('keyboard_mode', ($event.target as HTMLSelectElement).value)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="TEXT_LOWER">TEXT_LOWER - Lower case letters</option>
              <option value="TEXT_UPPER">TEXT_UPPER - Upper case letters</option>
              <option value="TEXT_SPECIAL">TEXT_SPECIAL - Special characters</option>
              <option value="NUMBER">NUMBER - Numbers and symbols</option>
            </select>
            <p class="text-[10px] text-gray-500 mt-1">TEXT layouts allow user to switch between them</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Textarea ID</label>
            <input
              type="text"
              :value="store.selectedWidget.textarea || ''"
              @input="handleInputChange('textarea', ($event.target as HTMLInputElement).value)"
              placeholder="my_textarea_id"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">ID of a textarea to associate with this keyboard</p>
          </div>
        </div>

        <!-- LED-specific properties -->
        <div v-if="store.selectedWidget.type === 'led'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">LED Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color</label>
            <div class="flex gap-2">
              <input
                type="color"
                :value="store.selectedWidget.color || '#FF0000'"
                @input="handleInputChange('color', ($event.target as HTMLInputElement).value)"
                class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                title="Pick LED color"
              />
              <input
                type="text"
                :value="store.selectedWidget.color || '#FF0000'"
                @input="handleInputChange('color', ($event.target as HTMLInputElement).value)"
                placeholder="#FF0000"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Brightness (%)</label>
            <div class="flex gap-2">
              <input
                type="range"
                min="0"
                max="100"
                :value="store.selectedWidget.brightness || 100"
                @input="handleNumberInput('brightness', $event)"
                class="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                :value="store.selectedWidget.brightness || 100"
                @input="handleNumberInput('brightness', $event)"
                class="w-16 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- QR Code-specific properties -->
        <div v-if="store.selectedWidget.type === 'qrcode'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">QR Code Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Text / URL</label>
            <input
              type="text"
              :value="store.selectedWidget.text || ''"
              @input="handleInputChange('text', ($event.target as HTMLInputElement).value)"
              placeholder="esphome.io"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">Text to encode in the QR code</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">QR Size (pixels)</label>
            <input
              type="number"
              min="50"
              max="500"
              :value="store.selectedWidget.qr_size || 100"
              @input="handleNumberInput('qr_size', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">Desired size of the QR code</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Light Color</label>
            <div class="flex gap-2">
              <input
                type="color"
                :value="store.selectedWidget.light_color || '#FFFFFF'"
                @input="handleInputChange('light_color', ($event.target as HTMLInputElement).value)"
                class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                title="Pick light color"
              />
              <input
                type="text"
                :value="store.selectedWidget.light_color || '#FFFFFF'"
                @input="handleInputChange('light_color', ($event.target as HTMLInputElement).value)"
                placeholder="#FFFFFF"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Dark Color</label>
            <div class="flex gap-2">
              <input
                type="color"
                :value="store.selectedWidget.dark_color || '#000000'"
                @input="handleInputChange('dark_color', ($event.target as HTMLInputElement).value)"
                class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                title="Pick dark color"
              />
              <input
                type="text"
                :value="store.selectedWidget.dark_color || '#000000'"
                @input="handleInputChange('dark_color', ($event.target as HTMLInputElement).value)"
                placeholder="#000000"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
          </div>
        </div>

        <!-- Tabview-specific properties -->
        <div v-if="store.selectedWidget.type === 'tabview'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tab View Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tab Position</label>
            <select
              :value="store.selectedWidget.tab_pos || 'TOP'"
              @change="handleInputChange('tab_pos', ($event.target as HTMLSelectElement).value)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="TOP">Top</option>
              <option value="BOTTOM">Bottom</option>
              <option value="LEFT">Left</option>
              <option value="RIGHT">Right</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tab Size (px)</label>
            <input
              type="number"
              :value="store.selectedWidget.tab_size || 40"
              @input="handleNumberInput('tab_size', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <!-- Spread Tabs is now always enabled -->
          <p class="text-xs text-gray-500 dark:text-gray-400">Tabs always spread to fill available width</p>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Tabs</label>
            <div v-if="store.selectedWidget.tabs && store.selectedWidget.tabs.length > 0" class="space-y-2 mb-2">
              <div v-for="(tab, index) in store.selectedWidget.tabs" :key="tab.id" 
                class="flex items-center gap-2 p-2 rounded border"
                :class="[
                  'bg-gray-100 dark:bg-gray-800',
                  index === (store.selectedWidget.selectedTabIndex || 0) ? 'border-indigo-500' : 'border-gray-300 dark:border-gray-700'
                ]">
                <input
                  type="text"
                  :value="tab.name"
                  @input="handleTabNameChange(index, ($event.target as HTMLInputElement).value)"
                  class="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  @click="setActiveTab(index)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="index === (store.selectedWidget.selectedTabIndex || 0) ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-400 dark:hover:bg-gray-600'"
                  title="Set as active tab">
                  <Icon :icon="index === (store.selectedWidget.selectedTabIndex || 0) ? 'check' : 'eye'" class="w-3 h-3" />
                </button>
                <button
                  @click="removeTab(index)"
                  :disabled="(store.selectedWidget.tabs?.length || 0) <= 1"
                  class="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Delete tab">
                  <Icon icon="delete" class="w-3 h-3" />
                </button>
              </div>
            </div>
            <button
              @click="addTab"
              class="w-full px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1">
              <Icon icon="plus" class="w-3 h-3" />
              Add Tab
            </button>
          </div>
        </div>

        <!-- Roller & Dropdown Options Management -->
        <div v-if="store.selectedWidget.type === 'roller' || store.selectedWidget.type === 'dropdown'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Options</div>
          
          <div v-if="store.selectedWidget.type === 'roller'">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mode</label>
            <select
              :value="store.selectedWidget.mode || 'NORMAL'"
              @change="handleInputChange('mode', ($event.target as HTMLSelectElement).value)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="NORMAL">NORMAL - Linear</option>
              <option value="INFINITE">INFINITE - Circular</option>
            </select>
            <p class="text-[10px] text-gray-500 mt-1">Make the roller circular (wraps around)</p>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Option List</label>
            <div v-if="store.selectedWidget.options && store.selectedWidget.options.length > 0" class="space-y-2 mb-2">
              <div v-for="(option, index) in store.selectedWidget.options" :key="index"
                class="flex items-center gap-2">
                <input
                  type="text"
                  :value="option"
                  @input="updateOption(index, ($event.target as HTMLInputElement).value)"
                  class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                  placeholder="Option text"
                />
                <button
                  @click="removeOption(index)"
                  :disabled="(store.selectedWidget.options?.length || 0) <= 1"
                  class="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Delete option">
                  <Icon icon="delete" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              @click="addOption"
              class="w-full px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
              <Icon icon="plus" class="w-3 h-3" />
              Add Option
            </button>
          </div>
        </div>

        <!-- Switch-specific properties -->
        <div v-if="store.selectedWidget.type === 'switch'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Switch Settings</div>
          
          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Indicator (Checked State)</div>
            <div class="space-y-2 pl-2 border-l-2 border-gray-300 dark:border-gray-700">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Background Color</label>
                <input
                  type="color"
                  :value="store.selectedWidget.indicator?.bg_color || '#4F46E5'"
                  @input="handleIndicatorChange('bg_color', ($event.target as HTMLInputElement).value)"
                  class="w-full h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Opacity (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  :value="store.selectedWidget.indicator?.bg_opa || 100"
                  @input="handleIndicatorChange('bg_opa', Number(($event.target as HTMLInputElement).value))"
                  class="w-full"
                />
                <div class="text-xs text-gray-600 dark:text-gray-500 mt-1">{{ store.selectedWidget.indicator?.bg_opa || 100 }}%</div>
              </div>
            </div>
          </div>

          <div>
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Knob</div>
            <div class="space-y-2 pl-2 border-l-2 border-gray-300 dark:border-gray-700">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Background Color</label>
                <input
                  type="color"
                  :value="store.selectedWidget.knob?.bg_color || '#FFFFFF'"
                  @input="handleKnobChange('bg_color', ($event.target as HTMLInputElement).value)"
                  class="w-full h-8 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Radius</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  :value="store.selectedWidget.knob?.radius ?? 9999"
                  @input="handleKnobChange('radius', Number(($event.target as HTMLInputElement).value))"
                  class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Spinner-specific properties -->
        <div v-if="store.selectedWidget.type === 'spinner'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Spinner Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Spin Time (ms)</label>
            <input
              type="number"
              min="100"
              max="10000"
              :value="store.selectedWidget.spin_time || 1000"
              @input="handleNumberInput('spin_time', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">Duration of one cycle of the spin</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Arc Length (degrees)</label>
            <input
              type="number"
              min="0"
              max="360"
              :value="store.selectedWidget.arc_length || 60"
              @input="handleNumberInput('arc_length', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p class="text-[10px] text-gray-500 mt-1">Length of the spinning arc (0-360)</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Arc Color</label>
            <div class="flex gap-2">
              <input
                type="color"
                :value="store.selectedWidget.arc_color || '#818CF8'"
                @input="handleInputChange('arc_color', ($event.target as HTMLInputElement).value)"
                class="w-10 h-9 rounded border border-gray-600 bg-gray-800 cursor-pointer"
                title="Pick arc color"
              />
              <input
                type="text"
                :value="store.selectedWidget.arc_color || '#818CF8'"
                @input="handleInputChange('arc_color', ($event.target as HTMLInputElement).value)"
                placeholder="#818CF8"
                class="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Arc Width (pixels)</label>
            <input
              type="number"
              min="1"
              max="50"
              :value="store.selectedWidget.arc_width || 8"
              @input="handleNumberInput('arc_width', $event)"
              class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Arc Opacity (%)</label>
            <div class="flex gap-2">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                :value="store.selectedWidget.arc_opa || 100"
                @input="handleNumberInput('arc_opa', $event)"
                class="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                :value="store.selectedWidget.arc_opa || 100"
                @input="handleNumberInput('arc_opa', $event)"
                class="w-16 px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="store.selectedWidget.arc_rounded || false"
                @change="handleInputChange('arc_rounded', ($event.target as HTMLInputElement).checked)"
                class="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500"
              />
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Rounded Arc Ends</span>
            </label>
          </div>
        </div>

        <!-- Tileview-specific properties -->
        <div v-if="store.selectedWidget.type === 'tileview'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tileview Settings</div>
          
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Tiles Grid</label>
            <div v-if="store.selectedWidget.tiles && store.selectedWidget.tiles.length > 0" class="space-y-2 mb-2">
              <div v-for="(tile, index) in store.selectedWidget.tiles" :key="index" 
                class="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ tile.label || tile.id }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-500">
                      ({{ tile.widgets?.length || 0 }} {{ tile.widgets?.length === 1 ? 'widget' : 'widgets' }})
                    </span>
                  </div>
                  <button
                    @click="removeTile(index)"
                    class="p-1 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    title="Remove tile"
                  >
                    <Icon icon="delete" size="14" />
                  </button>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-500 italic mb-2">
                  Drag widgets from the toolbox onto this tile in the canvas to add child widgets.
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">ID</label>
                    <input
                      type="text"
                      :value="tile.id"
                      @input="updateTile(index, 'id', ($event.target as HTMLInputElement).value)"
                      class="w-full px-2 py-1 text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Label</label>
                    <input
                      type="text"
                      :value="tile.label || ''"
                      @input="updateTile(index, 'label', ($event.target as HTMLInputElement).value)"
                      class="w-full px-2 py-1 text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Row</label>
                    <input
                      type="number"
                      min="0"
                      :value="tile.row"
                      @input="updateTile(index, 'row', Number(($event.target as HTMLInputElement).value))"
                      class="w-full px-2 py-1 text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Column</label>
                    <input
                      type="number"
                      min="0"
                      :value="tile.column"
                      @input="updateTile(index, 'column', Number(($event.target as HTMLInputElement).value))"
                      class="w-full px-2 py-1 text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-500 mb-1">Swipe Directions</label>
                  <div class="flex flex-wrap gap-1">
                    <label v-for="dir in ['LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'HOR', 'VER', 'ALL']" :key="dir"
                      class="flex items-center gap-1 px-2 py-1 text-xs rounded cursor-pointer transition-colors"
                      :class="tile.dir?.includes(dir) ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'"
                    >
                      <input
                        type="checkbox"
                        :checked="tile.dir?.includes(dir)"
                        @change="toggleTileDirection(index, dir)"
                        class="w-3 h-3"
                      />
                      {{ dir }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button
              @click="addTile"
              class="w-full px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-500/50 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors"
            >
              + Add Tile
            </button>
          </div>

          <!-- Visual Tile Selector -->
          <div v-if="store.selectedWidget.tiles && store.selectedWidget.tiles.length > 0">
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Active Tile (Click to select)</label>
            <div 
              class="grid gap-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700"
              :style="{ 
                gridTemplateColumns: `repeat(${getMaxTileColumn(store.selectedWidget) + 1}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${getMaxTileRow(store.selectedWidget) + 1}, minmax(0, 1fr))`
              }"
            >
              <button
                v-for="tile in store.selectedWidget.tiles"
                :key="tile.id"
                @click="selectTile(tile.row, tile.column)"
                :class="[
                  'aspect-square min-h-10 rounded text-xs font-medium transition-all',
                  tile.row === (store.selectedWidget.current_tile_row || 0) && tile.column === (store.selectedWidget.current_tile_column || 0)
                    ? 'bg-indigo-600 text-white border-2 border-indigo-400'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border border-gray-400 dark:border-gray-600 hover:bg-gray-400 dark:hover:bg-gray-600'
                ]"
                :style="{
                  gridRow: tile.row + 1,
                  gridColumn: tile.column + 1
                }"
                :title="`${tile.label || tile.id} [${tile.row},${tile.column}]`"
              >
                <div class="flex flex-col items-center justify-center">
                  <div class="text-[10px] font-semibold">{{ tile.label?.substring(0, 4) || tile.id.substring(0, 4) }}</div>
                  <div class="text-[8px] opacity-60">[{{ tile.row }},{{ tile.column }}]</div>
                </div>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Row</label>
              <input
                type="number"
                min="0"
                :value="store.selectedWidget.current_tile_row || 0"
                @input="handleInputChange('current_tile_row', Number(($event.target as HTMLInputElement).value))"
                class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Column</label>
              <input
                type="number"
                min="0"
                :value="store.selectedWidget.current_tile_column || 0"
                @input="handleInputChange('current_tile_column', Number(($event.target as HTMLInputElement).value))"
                class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <!-- Buttonmatrix-specific properties -->
        <div v-if="store.selectedWidget.type === 'buttonmatrix'" class="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Button Matrix Settings</div>
          
          <div>
            <label class="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                :checked="store.selectedWidget.one_checked || false"
                @change="handleInputChange('one_checked', ($event.target as HTMLInputElement).checked)"
                class="w-4 h-4 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              One Checked (Radio Mode)
            </label>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Button Rows & Buttons</label>
            <div v-if="store.selectedWidget.rows && store.selectedWidget.rows.length > 0" class="space-y-3 mb-2">
              <div v-for="(row, rowIndex) in store.selectedWidget.rows" :key="rowIndex" 
                class="p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Row {{ rowIndex + 1 }}</span>
                  <div class="flex gap-1">
                    <button
                      @click="addButtonToRow(rowIndex)"
                      class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      title="Add button to row">
                      <Icon icon="plus" class="w-3 h-3" />
                    </button>
                    <button
                      @click="removeButtonRow(rowIndex)"
                      :disabled="(store.selectedWidget.rows?.length || 0) <= 1"
                      class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Delete row">
                      <Icon icon="delete" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <!-- Buttons in this row -->
                <div class="space-y-2">
                  <div v-for="(button, btnIndex) in row.buttons" :key="btnIndex"
                    class="p-2 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Button {{ btnIndex + 1 }}</span>
                      <button
                        @click="removeButton(rowIndex, btnIndex)"
                        :disabled="row.buttons.length <= 1"
                        class="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete button">
                        <Icon icon="delete" class="w-3 h-3" />
                      </button>
                    </div>
                    
                    <!-- Button ID -->
                    <div class="mb-2">
                      <label class="block text-[10px] font-medium text-gray-600 dark:text-gray-500 mb-1">ID</label>
                      <input
                        type="text"
                        :value="button.id"
                        @input="updateButtonProperty(rowIndex, btnIndex, 'id', ($event.target as HTMLInputElement).value)"
                        class="w-full px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <!-- Button Text -->
                    <div class="mb-2">
                      <label class="block text-[10px] font-medium text-gray-600 dark:text-gray-500 mb-1">Text</label>
                      <input
                        type="text"
                        :value="button.text"
                        @input="updateButtonProperty(rowIndex, btnIndex, 'text', ($event.target as HTMLInputElement).value)"
                        class="w-full px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <!-- Button Width -->
                    <div class="mb-2">
                      <label class="block text-[10px] font-medium text-gray-600 dark:text-gray-500 mb-1">Width (1-15)</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        :value="button.width || 1"
                        @input="updateButtonProperty(rowIndex, btnIndex, 'width', Number(($event.target as HTMLInputElement).value))"
                        class="w-full px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    
                    <!-- Control Flags -->
                    <div class="space-y-1 pt-2 border-t border-gray-300 dark:border-gray-700">
                      <div class="text-[10px] font-medium text-gray-600 dark:text-gray-500 mb-1">Control Flags</div>
                      <label class="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          :checked="button.control?.checkable || false"
                          @change="updateButtonProperty(rowIndex, btnIndex, 'control.checkable', ($event.target as HTMLInputElement).checked)"
                          class="w-3 h-3 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-indigo-600"
                        />
                        Checkable
                      </label>
                      <label class="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          :checked="button.control?.checked || false"
                          @change="updateButtonProperty(rowIndex, btnIndex, 'control.checked', ($event.target as HTMLInputElement).checked)"
                          class="w-3 h-3 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-indigo-600"
                        />
                        Checked
                      </label>
                      <label class="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          :checked="button.control?.disabled || false"
                          @change="updateButtonProperty(rowIndex, btnIndex, 'control.disabled', ($event.target as HTMLInputElement).checked)"
                          class="w-3 h-3 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-indigo-600"
                        />
                        Disabled
                      </label>
                      <label class="flex items-center gap-2 text-[10px] text-gray-400">
                        <input
                          type="checkbox"
                          :checked="button.control?.hidden || false"
                          @change="updateButtonProperty(rowIndex, btnIndex, 'control.hidden', ($event.target as HTMLInputElement).checked)"
                          class="w-3 h-3 rounded bg-gray-800 border-gray-600 text-indigo-600"
                        />
                        Hidden
                      </label>
                      <label class="flex items-center gap-2 text-[10px] text-gray-400">
                        <input
                          type="checkbox"
                          :checked="button.control?.recolor || false"
                          @change="updateButtonProperty(rowIndex, btnIndex, 'control.recolor', ($event.target as HTMLInputElement).checked)"
                          class="w-3 h-3 rounded bg-gray-800 border-gray-600 text-indigo-600"
                        />
                        Recolor
                      </label>
                      <label class="flex items-center gap-2 text-[10px] text-gray-400">
                        <input
                          type="checkbox"
                          :checked="button.control?.popover || false"
                          @change="updateButtonProperty(rowIndex, btnIndex, 'control.popover', ($event.target as HTMLInputElement).checked)"
                          class="w-3 h-3 rounded bg-gray-800 border-gray-600 text-indigo-600"
                        />
                        Popover
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              @click="addButtonRow"
              class="w-full px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1">
              <Icon icon="plus" class="w-3 h-3" />
              Add Row
            </button>
          </div>
        </div>

        <!-- Mode (for meters, spinners) -->
        <div v-if="'mode' in store.selectedWidget">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Mode</label>
          <input
            type="text"
            :value="store.selectedWidget.mode"
            @input="handleInputChange('mode', ($event.target as HTMLInputElement).value)"
            class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <!-- Rows (for textarea) -->
        <div v-if="'rows' in store.selectedWidget">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Rows</label>
          <input
            type="number"
            :value="store.selectedWidget.rows"
            @input="handleNumberInput('rows', $event)"
            class="w-full px-2 py-1.5 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </form>
    </div>
    </div>
  </aside>

  <!-- Tile Layout Configuration Modal -->
  <div
    v-if="showTileLayoutModal && currentTile"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeTileLayoutModal"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tile Layout Configuration</h3>
      
      <div v-if="currentTile.layout" class="space-y-4">
        <!-- Layout Type -->
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Layout Type</label>
          <select
            v-model="currentTile.layout.type"
            class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
          >
            <option value="NONE">None (Absolute positioning)</option>
            <option value="FLEX">Flex Layout</option>
            <option value="GRID">Grid Layout</option>
          </select>
        </div>

        <!-- Flex Layout Options -->
        <template v-if="currentTile.layout.type === 'FLEX'">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Flex Flow</label>
            <select
              v-model="currentTile.layout.flex_flow"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ROW">Row</option>
              <option value="COLUMN">Column</option>
              <option value="ROW_WRAP">Row Wrap</option>
              <option value="COLUMN_WRAP">Column Wrap</option>
              <option value="ROW_REVERSE">Row Reverse</option>
              <option value="COLUMN_REVERSE">Column Reverse</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Main Axis Alignment</label>
            <select
              v-model="currentTile.layout.flex_align_main"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="START">Start</option>
              <option value="END">End</option>
              <option value="CENTER">Center</option>
              <option value="SPACE_EVENLY">Space Evenly</option>
              <option value="SPACE_AROUND">Space Around</option>
              <option value="SPACE_BETWEEN">Space Between</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Cross Axis Alignment</label>
            <select
              v-model="currentTile.layout.flex_align_cross"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
            >
              <option value="START">Start</option>
              <option value="END">End</option>
              <option value="CENTER">Center</option>
            </select>
          </div>
        </template>

        <!-- Padding Options -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pad Row</label>
            <input
              type="number"
              v-model.number="currentTile.layout.pad_row"
              min="0"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pad Column</label>
            <input
              type="number"
              v-model.number="currentTile.layout.pad_column"
              min="0"
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="closeTileLayoutModal"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveTileLayout"
          class="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
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
