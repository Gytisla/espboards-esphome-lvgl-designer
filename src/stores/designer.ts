import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Widget, WidgetType } from '@/types/widget'
import { widgetRegistry, getWidget } from '@/widgets'
import { convertHexColor } from '@/widgets/utils'
import yaml from 'js-yaml'

const STORAGE_KEY = 'lvglDesignerState'

export interface HistorySnapshot {
  widgets: Widget[]
  canvasWidth: number
  canvasHeight: number
  canvasResolution: string
}

export interface CanvasTab {
  id: string
  name: string
  widgets: Widget[]
  canvasWidth: number
  canvasHeight: number
  canvasResolution: string
  // Canvas styling
  bg_color?: string // Canvas background color
  bg_opa?: number // Canvas background opacity (0-100)
  pad_all?: number // Canvas padding (all sides)
  flags?: string[] // Canvas flags (e.g., ['SCROLLABLE'])
  historyStack?: HistorySnapshot[] // History for this specific tab
  currentHistoryIndex?: number // Current position in history for this tab
}

export const useDesignerStore = defineStore('designer', () => {
  // Canvas tabs state
  const canvasTabs = ref<CanvasTab[]>([
    {
      id: 'canvas_1',
      name: 'Screen 1',
      widgets: [],
      canvasWidth: 320,
      canvasHeight: 240,
      canvasResolution: '320x240',
      historyStack: [],
      currentHistoryIndex: -1
    }
  ])
  // Initialize activeCanvasTabId - will be set by loadState()
  const activeCanvasTabId = ref('canvas_1')
  const nextCanvasId = ref(2)
  const maxHistorySize = 50
  const isUndoRedoAction = ref(false)
  
  // Legacy state - now computed from active canvas tab
  const widgets = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      return activeTab ? activeTab.widgets : []
    },
    set: (newWidgets: Widget[]) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        activeTab.widgets = newWidgets
      }
    }
  })
  
  const selectedWidgetId = ref<string | null>(null)
  const nextWidgetId = ref(0)
  
  // Canvas settings - now computed from active canvas tab
  const canvasResolution = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      return activeTab ? activeTab.canvasResolution : '320x240'
    },
    set: (value: string) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        activeTab.canvasResolution = value
      }
    }
  })
  
  const canvasWidth = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      return activeTab ? activeTab.canvasWidth : 320
    },
    set: (value: number) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        activeTab.canvasWidth = value
      }
    }
  })
  
  const canvasHeight = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      return activeTab ? activeTab.canvasHeight : 240
    },
    set: (value: number) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        activeTab.canvasHeight = value
      }
    }
  })

  const canvasBgColor = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      const color = activeTab?.bg_color || '#111827'
      // Convert 0x format to # format for UI display
      if (typeof color === 'string' && (color.startsWith('0x') || color.startsWith('0X'))) {
        return '#' + color.slice(2)
      }
      return color
    },
    set: (value: string) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        // Store in 0x format for ESPHome export
        if (value.startsWith('#')) {
          activeTab.bg_color = '0x' + value.slice(1)
        } else {
          activeTab.bg_color = value
        }
      }
    }
  })

  const canvasBgOpa = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      return activeTab?.bg_opa ?? 100
    },
    set: (value: number) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        activeTab.bg_opa = value
      }
    }
  })

  const canvasPadding = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      return activeTab?.pad_all ?? 0
    },
    set: (value: number) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        activeTab.pad_all = value
      }
    }
  })

  const canvasFlags = computed({
    get: () => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      return activeTab?.flags ?? []
    },
    set: (value: string[]) => {
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      if (activeTab) {
        activeTab.flags = value
      }
    }
  })
  
  const currentScale = ref(2)
  
  // UI state
  const isToolboxVisible = ref(true)
  const showYamlModal = ref(false)
  const showImportModal = ref(false)
  const showShortcutsModal = ref(false)
  const showPreviewModal = ref(false)
  const showMobileToolbox = ref(false)
  const showMobileSidebar = ref(false)
  const theme = ref<'light' | 'dark'>('dark') // Theme preference
  
  // Drag state
  const draggedWidgetType = ref<WidgetType | null>(null)
  const isDraggingWidget = ref(false)
  const dragOffsetX = ref(0)
  const dragOffsetY = ref(0)
  
  // Import
  const yamlInput = ref('')
  const importError = ref('')
  
  // Clipboard for copy/paste
  const clipboard = ref<Widget | null>(null)
  const clipboardMode = ref<'copy' | 'cut' | null>(null)
  
  // Computed
  const selectedWidget = computed(() => {
    // Recursive function to search for widget in nested structures
    const findWidget = (widgetArray: Widget[]): Widget | null => {
      for (const widget of widgetArray) {
        // Check if this is the widget we're looking for
        if (widget.id === selectedWidgetId.value) {
          return widget
        }
        
        // Search in tabview tabs
        if (widget.type === 'tabview' && widget.tabs) {
          for (const tab of widget.tabs) {
            if (tab.widgets) {
              const nested = findWidget(tab.widgets)
              if (nested) return nested
            }
          }
        }
        
        // Search in tileview tiles
        if (widget.type === 'tileview' && widget.tiles) {
          for (const tile of widget.tiles) {
            if (tile.widgets) {
              const nested = findWidget(tile.widgets)
              if (nested) return nested
            }
          }
        }
      }
      return null
    }
    
    return findWidget(widgets.value)
  })

  // Recursively count all widgets including nested ones
  const countAllWidgets = (widgetList: Widget[]): number => {
    let count = 0
    for (const widget of widgetList) {
      count++ // Count the widget itself
      
      // Count widgets in tabview tabs
      if (widget.tabs && Array.isArray(widget.tabs)) {
        for (const tab of widget.tabs) {
          if (tab.widgets && Array.isArray(tab.widgets)) {
            count += countAllWidgets(tab.widgets)
          }
        }
      }
      
      // Count widgets in tileview tiles
      if (widget.tiles && Array.isArray(widget.tiles)) {
        for (const tile of widget.tiles) {
          if (tile.widgets && Array.isArray(tile.widgets)) {
            count += countAllWidgets(tile.widgets)
          }
        }
      }
    }
    return count
  }
  
  const widgetCount = computed(() => countAllWidgets(widgets.value))
  
  const generatedYAML = computed(() => generateYAML())
  
  const canUndo = computed(() => {
    const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
    return activeTab ? (activeTab.currentHistoryIndex ?? -1) > 0 : false
  })
  
  const canRedo = computed(() => {
    const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
    if (!activeTab) return false
    const historyLength = activeTab.historyStack?.length ?? 0
    const currentIndex = activeTab.currentHistoryIndex ?? -1
    return currentIndex < historyLength - 1
  })
  
  // Actions
  function saveHistory() {
    if (isUndoRedoAction.value) return
    
    const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
    if (!activeTab) return
    
    // Initialize history if needed
    if (!activeTab.historyStack) {
      activeTab.historyStack = []
    }
    if (activeTab.currentHistoryIndex === undefined) {
      activeTab.currentHistoryIndex = -1
    }
    
    // Create a deep clone of the current state including widgets and canvas dimensions
    const snapshot: HistorySnapshot = {
      widgets: JSON.parse(JSON.stringify(activeTab.widgets)),
      canvasWidth: activeTab.canvasWidth,
      canvasHeight: activeTab.canvasHeight,
      canvasResolution: activeTab.canvasResolution
    }
    
    // If we're in the middle of history (after undo), remove everything after current index
    if (activeTab.currentHistoryIndex < activeTab.historyStack.length - 1) {
      activeTab.historyStack = activeTab.historyStack.slice(0, activeTab.currentHistoryIndex + 1)
    }
    
    // Add new snapshot
    activeTab.historyStack.push(snapshot)
    
    // Limit history size
    if (activeTab.historyStack.length > maxHistorySize) {
      activeTab.historyStack.shift()
    } else {
      activeTab.currentHistoryIndex++
    }
  }
  
  function undo() {
    if (!canUndo.value) return
    
    const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
    if (!activeTab || !activeTab.historyStack || activeTab.currentHistoryIndex === undefined) return
    
    activeTab.currentHistoryIndex--
    isUndoRedoAction.value = true
    
    // Restore state from history
    const snapshot = activeTab.historyStack[activeTab.currentHistoryIndex]
    if (snapshot) {
      activeTab.widgets = JSON.parse(JSON.stringify(snapshot.widgets))
      activeTab.canvasWidth = snapshot.canvasWidth
      activeTab.canvasHeight = snapshot.canvasHeight
      activeTab.canvasResolution = snapshot.canvasResolution
    }
    
    // Clear selection if widget no longer exists
    if (selectedWidgetId.value) {
      const widgetExists = findWidgetRecursively(selectedWidgetId.value, activeTab.widgets)
      if (!widgetExists) {
        selectedWidgetId.value = null
      }
    }
    
    isUndoRedoAction.value = false
  }
  
  function redo() {
    if (!canRedo.value) return
    
    const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
    if (!activeTab || !activeTab.historyStack || activeTab.currentHistoryIndex === undefined) return
    
    activeTab.currentHistoryIndex++
    isUndoRedoAction.value = true
    
    // Restore state from history
    const snapshot = activeTab.historyStack[activeTab.currentHistoryIndex]
    if (snapshot) {
      activeTab.widgets = JSON.parse(JSON.stringify(snapshot.widgets))
      activeTab.canvasWidth = snapshot.canvasWidth
      activeTab.canvasHeight = snapshot.canvasHeight
      activeTab.canvasResolution = snapshot.canvasResolution
    }
    
    // Clear selection if widget no longer exists
    if (selectedWidgetId.value) {
      const widgetExists = findWidgetRecursively(selectedWidgetId.value, activeTab.widgets)
      if (!widgetExists) {
        selectedWidgetId.value = null
      }
    }
    
    isUndoRedoAction.value = false
  }
  
  function findWidgetRecursively(id: string, widgetList: Widget[]): Widget | null {
    for (const widget of widgetList) {
      if (widget.id === id) return widget
      
      // Search in tabview tabs
      if (widget.tabs) {
        for (const tab of widget.tabs) {
          if (tab.widgets) {
            const found = findWidgetRecursively(id, tab.widgets)
            if (found) return found
          }
        }
      }
      
      // Search in tileview tiles
      if (widget.tiles) {
        for (const tile of widget.tiles) {
          if (tile.widgets) {
            const found = findWidgetRecursively(id, tile.widgets)
            if (found) return found
          }
        }
      }
    }
    return null
  }
  
  function deleteWidgetRecursively(id: string, widgetList: Widget[]): boolean {
    // Try to delete from current level
    const index = widgetList.findIndex((w) => w.id === id)
    if (index > -1) {
      widgetList.splice(index, 1)
      return true
    }
    
    // Search in nested structures
    for (const widget of widgetList) {
      // Search in tabview tabs
      if (widget.tabs) {
        for (const tab of widget.tabs) {
          if (tab.widgets && deleteWidgetRecursively(id, tab.widgets)) {
            return true
          }
        }
      }
      
      // Search in tileview tiles
      if (widget.tiles) {
        for (const tile of widget.tiles) {
          if (tile.widgets && deleteWidgetRecursively(id, tile.widgets)) {
            return true
          }
        }
      }
    }
    
    return false
  }
  
  function generateUniqueId(type: WidgetType): string {
    return `${type.replace(/[^a-zA-Z0-9_]/g, '_')}_${nextWidgetId.value++}`
  }
  
  function getDefaultWidgetProps(type: WidgetType): Partial<Widget> {
    // Use widget registry for defaults
    const widgetPlugin = getWidget(type)
    if (widgetPlugin) {
      return widgetPlugin.defaultProps
    }
    
    // Fallback for unknown types
    return { width: 100, height: 30 }
  }
  
  function addWidget(type: WidgetType, x?: number, y?: number, loadedData?: Partial<Widget>) {
    const id = loadedData?.id || generateUniqueId(type)
    const finalX = x ?? Math.round(canvasWidth.value / 2 - 50)
    const finalY = y ?? Math.round(canvasHeight.value / 2 - 15)
    
    const widget: Widget = {
      id,
      type,
      x: finalX,
      y: finalY,
      zIndex: widgets.value.length + 1,
      ...getDefaultWidgetProps(type),
      ...loadedData
    }
    
    widgets.value.push(widget)
    selectedWidgetId.value = id
    saveState()
  }
  
  function createWidgetForTab(type: WidgetType, x: number, y: number): Widget {
    const id = generateUniqueId(type)
    const widget: Widget = {
      id,
      type,
      x,
      y,
      zIndex: 1,
      ...getDefaultWidgetProps(type)
    }
    return widget
  }
  
  function deleteWidget(id: string) {
    // Use recursive delete to handle widgets in tiles/tabs
    if (deleteWidgetRecursively(id, widgets.value)) {
      if (selectedWidgetId.value === id) {
        selectedWidgetId.value = null
      }
      saveState()
    }
  }
  
  function selectWidget(id: string | null) {
    selectedWidgetId.value = id
  }
  
  function updateWidgetProperty(id: string, property: keyof Widget, value: any) {
    // Use recursive search to find widget in any location
    const widget = findWidgetRecursively(id, widgets.value)
    if (widget) {
      ;(widget as any)[property] = value
      saveState()
    }
  }
  
  function updateButtonMatrixButton(widgetId: string, rowIndex: number, buttonIndex: number, property: string, value: any) {
    const widget = widgets.value.find((w) => w.id === widgetId)
    if (widget && widget.rows && widget.rows[rowIndex]?.buttons[buttonIndex]) {
      const button = widget.rows[rowIndex].buttons[buttonIndex]
      
      if (property.startsWith('control.')) {
        const controlProp = property.substring(8)
        if (!button.control) {
          button.control = {}
        }
        (button.control as any)[controlProp] = value
      } else {
        (button as any)[property] = value
      }
      
      // Trigger reactivity by creating new array reference
      widget.rows = [...widget.rows]
      saveState()
    }
  }
  
  function moveWidget(id: string, direction: 'up' | 'down') {
    const currentIndex = widgets.value.findIndex((w) => w.id === id)
    if (currentIndex === -1) return
    
    let newIndex = currentIndex
    if (direction === 'up' && currentIndex < widgets.value.length - 1) {
      newIndex = currentIndex + 1
    } else if (direction === 'down' && currentIndex > 0) {
      newIndex = currentIndex - 1
    }
    
    if (newIndex !== currentIndex) {
      const [movedWidget] = widgets.value.splice(currentIndex, 1)
      if (movedWidget) {
        widgets.value.splice(newIndex, 0, movedWidget)
        updateZIndices()
        saveState()
      }
    }
  }
  
  function updateZIndices() {
    widgets.value.forEach((widget, index) => {
      widget.zIndex = index + 1
    })
  }
  
  function updateCanvasSize() {
    const parts = canvasResolution.value.split('x')
    const w = Number(parts[0])
    const h = Number(parts[1])
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      canvasWidth.value = w
      canvasHeight.value = h
      saveState()
    }
  }
  
  function setScale(scale: number) {
    currentScale.value = scale
    saveState()
  }
  
  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    saveState()
  }
  
  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }
  
  // YAML Generation
  function generateWidgetYAML(widget: Widget, indent: string): string {
    // Use the widget plugin's YAML generation if available
    const widgetPlugin = getWidget(widget.type)
    if (widgetPlugin) {
      return widgetPlugin.generateYAML(widget, indent)
    }
    
    // Fallback for unknown widget types
    let yamlString = ''
    if (widget.text) yamlString += `${indent}text: "${widget.text}"\n`
    if (widget.value !== undefined) yamlString += `${indent}value: ${widget.value}\n`
    return yamlString
  }
  
  // Helper function to generate nested widget YAML (recursive for containers)
  function generateNestedWidgetYAML(widget: Widget, baseIndent: string): string {
    let yamlString = `${baseIndent}- ${widget.type}:\n`
    const propIndent = baseIndent + '    '
    
    yamlString += `${propIndent}id: ${widget.id}\n`
    yamlString += `${propIndent}x: ${widget.x}\n`
    yamlString += `${propIndent}y: ${widget.y}\n`
    
    if (widget.width !== undefined) yamlString += `${propIndent}width: ${widget.width}\n`
    if (widget.height !== undefined) yamlString += `${propIndent}height: ${widget.height}\n`
    
    // Add widget-specific properties (but NOT container-specific nested content)
    const widgetProps = generateWidgetYAML(widget, propIndent)
    if (widgetProps.trim()) {
      yamlString += widgetProps
      // Ensure there's a newline after widget properties if it doesn't end with one
      if (!widgetProps.endsWith('\n')) {
        yamlString += '\n'
      }
    }
    
    // Handle container-specific nested content AFTER regular properties
    if (widget.type === 'tabview' && widget.tabs) {
      yamlString += `${propIndent}tabs:\n`
      widget.tabs.forEach((tab) => {
        yamlString += `${propIndent}  - name: "${tab.name}"\n`
        if (tab.widgets && tab.widgets.length > 0) {
          yamlString += `${propIndent}    widgets:\n`
          tab.widgets.forEach((childWidget) => {
            yamlString += generateNestedWidgetYAML(childWidget, propIndent + '      ')
          })
        }
      })
    }
    
    if (widget.type === 'tileview' && widget.tiles) {
      yamlString += `${propIndent}tiles:\n`
      widget.tiles.forEach((tile: any) => {
        yamlString += `${propIndent}  - id: ${tile.id}\n`
        yamlString += `${propIndent}    row: ${tile.row}\n`
        yamlString += `${propIndent}    column: ${tile.column}\n`
        
        // Add direction if not ALL
        if (tile.dir && tile.dir.length > 0 && !(tile.dir.length === 1 && tile.dir[0] === 'ALL')) {
          if (tile.dir.length === 1) {
            yamlString += `${propIndent}    dir: ${tile.dir[0]}\n`
          } else {
            yamlString += `${propIndent}    dir:\n`
            tile.dir.forEach((d: string) => {
              yamlString += `${propIndent}      - ${d}\n`
            })
          }
        }
        
        // Add layout configuration if present
        if (tile.layout) {
          if (tile.layout.type) {
            yamlString += `${propIndent}    layout:\n`
            yamlString += `${propIndent}      type: ${tile.layout.type}\n`
            
            if (tile.layout.type === 'FLEX') {
              if (tile.layout.flex_flow) {
                yamlString += `${propIndent}      flex_flow: ${tile.layout.flex_flow}\n`
              }
              if (tile.layout.flex_align_main) {
                yamlString += `${propIndent}      flex_align_main: ${tile.layout.flex_align_main}\n`
              }
              if (tile.layout.flex_align_cross) {
                yamlString += `${propIndent}      flex_align_cross: ${tile.layout.flex_align_cross}\n`
              }
            }
            
            if (tile.layout.pad_row !== undefined) {
              yamlString += `${propIndent}      pad_row: ${tile.layout.pad_row}\n`
            }
            if (tile.layout.pad_column !== undefined) {
              yamlString += `${propIndent}      pad_column: ${tile.layout.pad_column}\n`
            }
          }
        }
        
        // Add nested widgets
        if (tile.widgets && tile.widgets.length > 0) {
          yamlString += `${propIndent}    widgets:\n`
          tile.widgets.forEach((childWidget: Widget) => {
            yamlString += generateNestedWidgetYAML(childWidget, propIndent + '      ')
          })
        }
      })
    }
    
    return yamlString
  }
  
  function generateYAML(): string {
      // Export only active canvas tab
      let yamlString = 'lvgl:\n  pages:\n    - id: main_page\n'
      
      const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
      
      // Export canvas flags (only if explicitly set)
      if (activeTab?.flags && activeTab.flags.length > 0) {
        yamlString += '      flags:\n'
        activeTab.flags.forEach(flag => {
          yamlString += `        - ${flag}\n`
        })
      }
      
      // Export bg_color (only if explicitly set)
      if (activeTab?.bg_color !== undefined) {
        yamlString += '      bg_color: ' + convertHexColor(activeTab.bg_color) + '\n'
      }
      
      // Export bg_opa (only if explicitly set)
      if (activeTab?.bg_opa !== undefined) {
        yamlString += '      bg_opa: ' + activeTab.bg_opa + '%\n'
      }
      
      // Export pad_all (only if explicitly set and greater than 0)
      if (activeTab?.pad_all !== undefined && activeTab.pad_all > 0) {
        yamlString += '      pad_all: ' + activeTab.pad_all + '\n'
      }
      
      yamlString += '      widgets:'
      
      if (widgets.value.length === 0) {
        yamlString += '\n        # No widgets placed yet'
      } else {
        widgets.value.forEach((widget) => {
          yamlString += '\n'
          yamlString += generateNestedWidgetYAML(widget, '        ')
        })
      }
      
      return yamlString
  }
  
  async function copyYAML(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(generateYAML())
      return true
    } catch (err) {
      console.error('Failed to copy YAML:', err)
      return false
    }
  }
  
  // YAML Import
  function importYAML(yamlText?: string): boolean {
    const input = yamlText || yamlInput.value
    importError.value = ''
    try {
      const data = yaml.load(input) as any
      
      if (data?.lvgl?.pages?.[0]) {
        const pageData = data.lvgl.pages[0]
        const widgetConfigs = pageData.widgets || []
        
        // Clear widgets FIRST
        widgets.value = []
        
        // Helper function to normalize color to 0x format for storage
        const normalizeColorTo0x = (color: any): string | undefined => {
          if (!color) return undefined
          
          // Convert to string if it's a number
          const colorStr = typeof color === 'number' 
            ? `0x${color.toString(16).toUpperCase().padStart(6, '0')}` 
            : String(color)
          
          // If it's in # format, convert to 0x format
          if (colorStr.startsWith('#')) {
            return '0x' + colorStr.slice(1).toUpperCase()
          }
          
          // If it's already in 0x format, ensure uppercase
          if (colorStr.startsWith('0x') || colorStr.startsWith('0X')) {
            return '0x' + colorStr.slice(2).toUpperCase()
          }
          
          return colorStr
        }
        
        // Import canvas properties if present
        const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
        if (activeTab) {
          // Import flags if present
          if (pageData.flags && Array.isArray(pageData.flags)) {
            activeTab.flags = pageData.flags
          }
          
          // Import bg_color if present - store in 0x format for ESPHome export
          if (pageData.bg_color !== undefined) {
            activeTab.bg_color = normalizeColorTo0x(pageData.bg_color)
          }
          
          // Import bg_opa if present
          if (pageData.bg_opa !== undefined) {
            // Handle both "100%" and 100 formats
            const opaValue = typeof pageData.bg_opa === 'string' 
              ? parseInt(pageData.bg_opa) 
              : pageData.bg_opa
            activeTab.bg_opa = opaValue
          }
          
          // Import pad_all if present
          if (pageData.pad_all !== undefined) {
            activeTab.pad_all = pageData.pad_all
          }
        }
        
        let maxIdNum = -1

        function buildWidgetTree(widgetConfig: any): any {
          const type = Object.keys(widgetConfig)[0] as WidgetType
          const props = widgetConfig[type]
          if (!props || !type) return null;

          // Clone props to avoid mutation
          const widgetProps = { ...props }

          // Recursively process children for containers
          if (type === 'tabview' && Array.isArray(widgetProps.tabs)) {
            widgetProps.tabs = widgetProps.tabs.map((tab: any) => {
              if (Array.isArray(tab.widgets)) {
                tab.widgets = tab.widgets.map(buildWidgetTree)
              }
              return tab
            })
          }
          if (type === 'tileview' && Array.isArray(widgetProps.tiles)) {
            widgetProps.tiles = widgetProps.tiles.map((tile: any) => {
              if (Array.isArray(tile.widgets)) {
                tile.widgets = tile.widgets.map(buildWidgetTree)
              }
              return tile
            })
          }
          if (Array.isArray(widgetProps.widgets)) {
            widgetProps.widgets = widgetProps.widgets.map(buildWidgetTree)
          }

          // Update next ID
          const idParts = String(widgetProps.id).split('_')
          const numPartStr = idParts[idParts.length - 1]
          if (numPartStr) {
            const numPart = parseInt(numPartStr)
            if (!isNaN(numPart) && numPart > maxIdNum) {
              maxIdNum = numPart
            }
          }
          return { type, ...widgetProps }
        }

        widgetConfigs.forEach((widgetConfig: any) => {
          const tree = buildWidgetTree(widgetConfig)
          if (tree) {
            // Directly push the root widget to the canvas array
            widgets.value.push({
              ...getDefaultWidgetProps(tree.type),
              ...tree,
              zIndex: widgets.value.length + 1
            })
          }
        })
        
        nextWidgetId.value = Math.max(nextWidgetId.value, maxIdNum + 1)
        selectedWidgetId.value = null
        showImportModal.value = false
        yamlInput.value = ''
        saveState()
        return true
      } else {
        importError.value = 'Invalid YAML structure. Expected lvgl -> pages.'
        return false
      }
    } catch (e: any) {
      importError.value = `Error parsing YAML: ${e.message}`
      return false
    }
  }
  
  // Canvas Tab Management
  function addCanvasTab(name?: string) {
    const newId = `canvas_${nextCanvasId.value++}`
    const newTab: CanvasTab = {
      id: newId,
      name: name || `Screen ${nextCanvasId.value - 1}`,
      widgets: [],
      canvasWidth: 320,
      canvasHeight: 240,
      canvasResolution: '320x240',
      historyStack: [
        {
          widgets: [],
          canvasWidth: 320,
          canvasHeight: 240,
          canvasResolution: '320x240'
        }
      ],
      currentHistoryIndex: 0
    }
    canvasTabs.value.push(newTab)
    activeCanvasTabId.value = newId
    selectedWidgetId.value = null
    // Don't call saveState() here to avoid tracking tab creation in history
  }
  
  function removeCanvasTab(tabId: string) {
    if (canvasTabs.value.length <= 1) {
      return // Don't remove the last tab
    }
    
    const index = canvasTabs.value.findIndex(tab => tab.id === tabId)
    if (index === -1) return
    
    canvasTabs.value.splice(index, 1)
    
    // Switch to another tab if we removed the active one
    if (activeCanvasTabId.value === tabId) {
      const newIndex = Math.max(0, index - 1)
      const newTab = canvasTabs.value[newIndex]
      if (newTab) {
        activeCanvasTabId.value = newTab.id
        selectedWidgetId.value = null
      }
    }
    
    // Don't call saveState() - tab management is not tracked in widget history
  }
  
  function switchCanvasTab(tabId: string) {
    if (canvasTabs.value.some(tab => tab.id === tabId)) {
      activeCanvasTabId.value = tabId
      selectedWidgetId.value = null
    }
  }
  
  function renameCanvasTab(tabId: string, newName: string) {
    const tab = canvasTabs.value.find(tab => tab.id === tabId)
    if (tab) {
      tab.name = newName
      // Don't call saveState() - tab management is not tracked in widget history
    }
  }
  
  // Copy/Paste functions
  function generateNewWidgetId(): string {
    return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  function regenerateWidgetIds(widget: Widget): Widget {
    // Deep clone the widget and regenerate all IDs (including nested widgets)
    const clonedWidget = JSON.parse(JSON.stringify(widget))
    clonedWidget.id = generateNewWidgetId()
    
    // Regenerate IDs for nested widgets based on widget type
    if (clonedWidget.type === 'tabview' && clonedWidget.tabs) {
      clonedWidget.tabs = clonedWidget.tabs.map((tab: any) => ({
        ...tab,
        widgets: tab.widgets.map((w: Widget) => regenerateWidgetIds(w))
      }))
    } else if (clonedWidget.type === 'tileview' && clonedWidget.tiles) {
      clonedWidget.tiles = clonedWidget.tiles.map((tile: any) => ({
        ...tile,
        widgets: tile.widgets.map((w: Widget) => regenerateWidgetIds(w))
      }))
    } else if (clonedWidget.widgets) {
      clonedWidget.widgets = clonedWidget.widgets.map((w: Widget) => regenerateWidgetIds(w))
    }
    
    return clonedWidget
  }
  
  function copyWidget(widgetId: string) {
    const widget = findWidgetRecursively(widgetId, widgets.value)
    if (widget) {
      clipboard.value = JSON.parse(JSON.stringify(widget)) // Deep clone
      clipboardMode.value = 'copy'
    }
  }
  
  function cutWidget(widgetId: string) {
    const widget = findWidgetRecursively(widgetId, widgets.value)
    if (widget) {
      clipboard.value = JSON.parse(JSON.stringify(widget)) // Deep clone
      clipboardMode.value = 'cut'
      deleteWidget(widgetId) // Remove from current canvas
    }
  }
  
  function pasteWidget() {
    if (!clipboard.value) return
    
    // Regenerate IDs for the pasted widget and all nested widgets
    const pastedWidget = regenerateWidgetIds(clipboard.value)
    
    // Offset position slightly so it doesn't paste exactly on top
    pastedWidget.x = (clipboard.value.x || 0) + 20
    pastedWidget.y = (clipboard.value.y || 0) + 20
    
    // Add to current canvas
    const activeTab = canvasTabs.value.find(tab => tab.id === activeCanvasTabId.value)
    if (activeTab) {
      activeTab.widgets.push(pastedWidget)
      selectedWidgetId.value = pastedWidget.id
      
      // Clear clipboard if it was a cut operation
      if (clipboardMode.value === 'cut') {
        clipboard.value = null
        clipboardMode.value = null
      }
      
      saveState()
    }
  }
  
  function clearClipboard() {
    clipboard.value = null
    clipboardMode.value = null
  }
  
  // LocalStorage
  function saveState() {
    // Save history snapshot for undo/redo
    saveHistory()
    
    const state = {
      canvasTabs: canvasTabs.value,
      activeCanvasTabId: activeCanvasTabId.value,
      nextCanvasId: nextCanvasId.value,
      scale: currentScale.value,
      nextWidgetId: nextWidgetId.value,
      isToolboxVisible: isToolboxVisible.value,
      theme: theme.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const state = JSON.parse(saved)
        
        // Load canvas tabs if available
        if (state.canvasTabs) {
          canvasTabs.value = state.canvasTabs
          activeCanvasTabId.value = state.activeCanvasTabId || canvasTabs.value[0]?.id || 'canvas_1'
          nextCanvasId.value = state.nextCanvasId || 2
          
          // Initialize history for each tab if not present
          canvasTabs.value.forEach(tab => {
            if (!tab.historyStack) {
              tab.historyStack = [JSON.parse(JSON.stringify(tab.widgets))]
            }
            if (tab.currentHistoryIndex === undefined) {
              tab.currentHistoryIndex = tab.historyStack.length > 0 ? 0 : -1
            }
          })
        } else {
          // Legacy: migrate old single-canvas data to first tab
          canvasTabs.value = [{
            id: 'canvas_1',
            name: 'Screen 1',
            widgets: state.widgets || [],
            canvasWidth: 320,
            canvasHeight: 240,
            canvasResolution: state.resolution || '320x240',
            historyStack: [state.widgets || []],
            currentHistoryIndex: 0
          }]
          activeCanvasTabId.value = 'canvas_1'
          nextCanvasId.value = 2
        }
        
        currentScale.value = state.scale || 2
        nextWidgetId.value = state.nextWidgetId || 0
        isToolboxVisible.value = state.isToolboxVisible !== false
        
        // Load theme and apply it
        const savedTheme = state.theme || 'dark'
        setTheme(savedTheme)
        
        updateCanvasSize()
      }
    } catch (e) {
      console.error('Failed to load state:', e)
    }
  }

  // Save state when active tab changes
  watch(activeCanvasTabId, () => {
    saveState()
  })

  return {
    // State
    canvasTabs,
    activeCanvasTabId,
    widgets,
    selectedWidgetId,
    canvasResolution,
    canvasWidth,
    canvasHeight,
    canvasBgColor,
    canvasBgOpa,
    canvasPadding,
    canvasFlags,
    currentScale,
    isToolboxVisible,
    showYamlModal,
    showImportModal,
    showShortcutsModal,
    showPreviewModal,
    showMobileToolbox,
    showMobileSidebar,
    theme,
    draggedWidgetType,
    isDraggingWidget,
    dragOffsetX,
    dragOffsetY,
    yamlInput,
    importError,
    clipboard,
    clipboardMode,
    // Computed
    selectedWidget,
    widgetCount,
    generatedYAML,
    canUndo,
    canRedo,
    // Actions
    addWidget,
    createWidgetForTab,
    deleteWidget,
    selectWidget,
    updateWidgetProperty,
    updateButtonMatrixButton,
    moveWidget,
    updateCanvasSize,
    setScale,
    setTheme,
    toggleTheme,
    generateYAML,
    copyYAML,
    importYAML,
    addCanvasTab,
    removeCanvasTab,
    switchCanvasTab,
    renameCanvasTab,
    copyWidget,
    cutWidget,
    pasteWidget,
    clearClipboard,
    undo,
    redo,
    saveState,
    loadState
  }
})
