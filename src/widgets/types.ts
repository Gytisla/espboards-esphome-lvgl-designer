import type { Widget } from '../types/widget'

export type PropertyType = 'text' | 'number' | 'boolean' | 'color' | 'select' | 'range'

export interface PropertyField {
  name: string
  label: string
  type: PropertyType
  options?: Array<{ value: string; label: string }>
  min?: number
  max?: number
  step?: number
  default?: any
  group?: string // For grouping properties in UI
  condition?: (widget: Widget) => boolean // Show field conditionally
}

export interface PropertyGroup {
  name: string
  label: string
  fields: PropertyField[]
}

export interface WidgetPlugin {
  type: string
  label: string
  icon: string
  category: 'basic' | 'input' | 'display' | 'container'
  
  // Default properties when creating new widget
  defaultProps: Partial<Widget>
  
  // Property fields for the properties panel
  properties: PropertyField[] | PropertyGroup[]
  
  // Generate YAML for this widget type
  generateYAML: (widget: Widget, indent: string) => string
  
  // Validate widget data
  validate?: (widget: Widget) => string | null
}

export interface WidgetRegistry {
  [key: string]: WidgetPlugin
}
