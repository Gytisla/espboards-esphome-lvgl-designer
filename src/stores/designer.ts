import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Widget, WidgetType } from '@/types/widget'
import { widgetRegistry, getWidget } from '@/widgets'
import yaml from 'js-yaml'

const STORAGE_KEY = 'lvglDesignerState'

export const useDesignerStore = defineStore('designer', () => {
  // State
  const widgets = ref<Widget[]>([])
  const selectedWidgetId = ref<string | null>(null)
  const nextWidgetId = ref(0)
  
  // Canvas settings
  const canvasResolution = ref('320x240')
  const canvasWidth = ref(320)
  const canvasHeight = ref(240)
  const currentScale = ref(2)
  
  // UI state
  const isToolboxVisible = ref(true)
  const showYamlModal = ref(false)
  const showImportModal = ref(false)
  const showShortcutsModal = ref(false)
  const showPreviewModal = ref(false)
  
  // Drag state
  const draggedWidgetType = ref<WidgetType | null>(null)
  const isDraggingWidget = ref(false)
  const dragOffsetX = ref(0)
  const dragOffsetY = ref(0)
  
  // Import
  const yamlInput = ref('')
  const importError = ref('')
  
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
  
  const widgetCount = computed(() => widgets.value.length)
  
  const generatedYAML = computed(() => generateYAML())
  
  // Actions
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
    const index = widgets.value.findIndex((w) => w.id === id)
    if (index > -1) {
      widgets.value.splice(index, 1)
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
    // First check top-level widgets
    const widget = widgets.value.find((w) => w.id === id)
    if (widget) {
      ;(widget as any)[property] = value
      saveState()
      return
    }
    
    // If not found, search in tabview nested widgets
    for (const tabviewWidget of widgets.value) {
      if (tabviewWidget.type === 'tabview' && tabviewWidget.tabs) {
        for (const tab of tabviewWidget.tabs) {
          if (tab.widgets) {
            const nestedWidget = tab.widgets.find((w) => w.id === id)
            if (nestedWidget) {
              ;(nestedWidget as any)[property] = value
              saveState()
              return
            }
          }
        }
      }
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
    let yamlString = 'lvgl:\n  pages:\n    - id: main_page\n      widgets:'
    
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
      
      if (data?.lvgl?.pages?.[0]?.widgets) {
        widgets.value = []
        const widgetConfigs = data.lvgl.pages[0].widgets
        
        let maxIdNum = -1
        widgetConfigs.forEach((widgetConfig: any) => {
          const type = Object.keys(widgetConfig)[0] as WidgetType
          const props = widgetConfig[type]
          
          if (props && type) {
            addWidget(type, props.x, props.y, props)
            
            // Update next ID
            const idParts = String(props.id).split('_')
            const numPartStr = idParts[idParts.length - 1]
            if (numPartStr) {
              const numPart = parseInt(numPartStr)
              if (!isNaN(numPart) && numPart > maxIdNum) {
                maxIdNum = numPart
              }
            }
          }
        })
        
        nextWidgetId.value = Math.max(nextWidgetId.value, maxIdNum + 1)
        selectedWidgetId.value = null
        showImportModal.value = false
        yamlInput.value = ''
        return true
      } else {
        importError.value = 'Invalid YAML structure. Expected lvgl -> pages -> widgets.'
        return false
      }
    } catch (e: any) {
      importError.value = `Error parsing YAML: ${e.message}`
      return false
    }
  }
  
  // LocalStorage
  function saveState() {
    const state = {
      widgets: widgets.value,
      resolution: canvasResolution.value,
      scale: currentScale.value,
      nextWidgetId: nextWidgetId.value,
      isToolboxVisible: isToolboxVisible.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
  
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const state = JSON.parse(saved)
        widgets.value = state.widgets || []
        canvasResolution.value = state.resolution || '320x240'
        currentScale.value = state.scale || 2
        nextWidgetId.value = state.nextWidgetId || 0
        isToolboxVisible.value = state.isToolboxVisible !== false
        updateCanvasSize()
      }
    } catch (e) {
      console.error('Failed to load state:', e)
    }
  }
  
  return {
    // State
    widgets,
    selectedWidgetId,
    canvasResolution,
    canvasWidth,
    canvasHeight,
    currentScale,
    isToolboxVisible,
    showYamlModal,
    showImportModal,
    showShortcutsModal,
    showPreviewModal,
    draggedWidgetType,
    isDraggingWidget,
    dragOffsetX,
    dragOffsetY,
    yamlInput,
    importError,
    // Computed
    selectedWidget,
    widgetCount,
    generatedYAML,
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
    generateYAML,
    copyYAML,
    importYAML,
    saveState,
    loadState
  }
})
