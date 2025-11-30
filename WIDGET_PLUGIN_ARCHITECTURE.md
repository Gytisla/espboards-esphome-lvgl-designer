# Widget Plugin Architecture

This document describes the plugin-based widget system that allows for clean separation of widget definitions into maintainable, modular files.

## Overview

The widget system is now organized as a **plugin architecture** where each widget type is defined in its own file with all related configuration, properties, and YAML generation logic.

## Directory Structure

```
src/widgets/
├── types.ts          # Core interfaces and types
├── index.ts          # Widget registry and exports
├── label.ts          # Label widget definition
├── button.ts         # Button widget definition
├── slider.ts         # Slider widget definition
├── bar.ts            # Bar widget definition
├── arc.ts            # Arc widget definition
├── dropdown.ts       # Dropdown widget definition
├── line.ts           # Line widget definition
└── tabview.ts        # Tabview widget definition
```

## Core Concepts

### WidgetPlugin Interface

Each widget is defined as a `WidgetPlugin` with the following properties:

```typescript
interface WidgetPlugin {
  type: string                    // Widget type identifier
  label: string                   // Display name
  icon: string                    // Emoji icon for toolbox
  category: 'basic' | 'input' | 'display' | 'container'
  
  defaultProps: Partial<Widget>   // Default properties when creating
  properties: PropertyField[]     // Property fields for sidebar
  generateYAML: (widget, indent) => string  // YAML generation
  validate?: (widget) => string | null      // Optional validation
}
```

### Property Fields

Properties are defined with rich metadata:

```typescript
interface PropertyField {
  name: string        // Property name in widget
  label: string       // Display label
  type: PropertyType  // 'text' | 'number' | 'boolean' | 'color' | 'select' | 'range'
  
  // Optional configuration
  options?: Array<{ value: string; label: string }>  // For select type
  min?: number        // For number/range
  max?: number
  step?: number
  default?: any
  group?: string      // Group properties together
  condition?: (widget: Widget) => boolean  // Conditional display
}
```

### Property Groups

For complex widgets like Arc, properties can be organized into groups:

```typescript
properties: [
  {
    name: 'basic',
    label: 'Basic',
    fields: [
      { name: 'value', label: 'Value', type: 'number' },
      // ... more fields
    ]
  },
  {
    name: 'angles',
    label: 'Angles',
    fields: [
      { name: 'start_angle', label: 'Start Angle', type: 'range', min: 0, max: 360 },
      // ... more fields
    ]
  }
]
```

## Widget Registry

The central registry in `src/widgets/index.ts` provides:

```typescript
// Access widget definitions
import { widgetRegistry, getWidget, getAllWidgets } from '@/widgets'

// Get specific widget
const arcWidget = getWidget('arc')

// Get all widgets
const allWidgets = getAllWidgets()

// Get widgets by category
const inputWidgets = getWidgetsByCategory('input')
```

## Creating a New Widget

To add a new widget type:

### 1. Create widget file (e.g., `src/widgets/chart.ts`)

```typescript
import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'

export const chartWidget: WidgetPlugin = {
  type: 'chart',
  label: 'Chart',
  icon: '📈',
  category: 'display',
  
  defaultProps: {
    type: 'chart',
    width: 200,
    height: 150,
    series: [],
  },
  
  properties: [
    {
      name: 'series_count',
      label: 'Series Count',
      type: 'number',
      min: 1,
      max: 10,
      default: 1,
    },
    // ... more properties
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    // Generate YAML specific to this widget
    if (widget.series) {
      yaml += `${indent}series:\n`
      // ... generate series YAML
    }
    return yaml
  },
}
```

### 2. Register in `src/widgets/index.ts`

```typescript
import { chartWidget } from './chart'

export const widgetRegistry: WidgetRegistry = {
  // ... existing widgets
  chart: chartWidget,
}
```

### 3. Add type to `src/types/widget.ts` (if needed)

```typescript
export type WidgetType = 
  | 'label'
  | 'button'
  // ... existing types
  | 'chart'  // Add new type
```

That's it! The widget is now available throughout the application.

## Benefits

### 1. **Maintainability**
- Each widget is self-contained in one file
- Easy to find and modify widget-specific code
- Clear separation of concerns

### 2. **Scalability**
- Adding new widgets doesn't clutter existing code
- Plugin files can be independently developed
- Easy to enable/disable widgets

### 3. **Consistency**
- All widgets follow the same interface
- YAML generation is standardized
- Property definitions are type-safe

### 4. **Discoverability**
- Registry provides single source of truth
- Easy to list all available widgets
- Category-based organization

### 5. **Testing**
- Widget definitions can be unit tested independently
- YAML generation can be tested per widget
- Property validation is isolated

## Integration Points

The widget plugins integrate with:

1. **Designer Store** (`src/stores/designer.ts`)
   - `getDefaultWidgetProps()` uses `widgetPlugin.defaultProps`
   - `generateWidgetYAML()` calls `widgetPlugin.generateYAML()`

2. **Toolbox** (`src/components/Toolbox.vue`)
   - Gets widgets via `getAllWidgets()`
   - Displays `widget.label` and `widget.icon`

3. **Sidebar** (`src/components/Sidebar.vue`)
   - Can use `widget.properties` for dynamic property panels
   - Groups properties by `PropertyGroup`

4. **YAML Export**
   - Each widget generates its own YAML
   - Consistent indentation and formatting

## Example: Arc Widget

The arc widget demonstrates advanced features:

```typescript
export const arcWidget: WidgetPlugin = {
  type: 'arc',
  label: 'Arc',
  icon: '⭕',
  category: 'input',
  
  // Complex default props with nested objects
  defaultProps: {
    type: 'arc',
    width: 150,
    height: 150,
    value: 50,
    indicator: {
      arc_color: '0x818cf8',
      arc_width: 8,
    },
  },
  
  // Grouped properties for better UX
  properties: [
    { name: 'basic', label: 'Basic', fields: [...] },
    { name: 'angles', label: 'Angles', fields: [...] },
    { name: 'arc_settings', label: 'Arc Settings', fields: [...] },
    { name: 'background', label: 'Background Arc', fields: [...] },
  ],
  
  // Comprehensive YAML generation
  generateYAML: (widget, indent) => {
    // Handles all arc properties including nested indicator/knob
    // Returns formatted YAML string
  },
}
```

## Future Enhancements

Potential improvements to the plugin system:

1. **Dynamic Property Panels**: Generate sidebar UI from `properties` array
2. **Widget Validation**: Use `validate()` function for real-time validation
3. **Widget Presets**: Allow multiple preset configurations per widget
4. **Plugin Metadata**: Add version, author, documentation URL
5. **External Plugins**: Load widgets from external packages
6. **Widget Marketplace**: Share custom widget plugins

## Migration Notes

The refactoring from hardcoded widget logic to plugins:

- **Before**: Widget logic scattered across store, components
- **After**: Each widget self-contained in one file
- **Backward Compatible**: Existing widgets work unchanged
- **YAML Output**: Identical to previous implementation
