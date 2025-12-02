import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const dropdownWidget: WidgetPlugin = {
  type: 'dropdown',
  label: 'Dropdown',
  icon: 'arrow-drop-down-circle',
  category: 'input',
  
  defaultProps: {
    type: 'dropdown',
    width: 150,
    height: 40,
    options: ['Option 1', 'Option 2', 'Option 3'],
    selected_index: 0,
  },
  
  properties: [
    {
      name: 'selected_index',
      label: 'Selected Index',
      type: 'number',
      default: 0,
    },
    {
      name: 'bg_color',
      label: 'Background Color',
      type: 'color',
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    if (widget.options && widget.options.length > 0) {
      yaml += `${indent}options:\n`
      widget.options.forEach((opt) => {
        yaml += `${indent}  - "${opt}"\n`
      })
    }
    
    if (widget.selected_index !== undefined) {
      yaml += `${indent}selected_index: ${widget.selected_index}\n`
    }
    
    if (widget.bg_color) yaml += `${indent}bg_color: ${convertHexColor(widget.bg_color)}\n`
    
    return yaml
  },
}
