import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const ledWidget: WidgetPlugin = {
  type: 'led',
  label: 'LED',
  icon: 'lightbulb',
  category: 'display',
  
  defaultProps: {
    type: 'led',
    width: 40,
    height: 40,
    color: '#FF0000',
    brightness: 100,
  },
  
  properties: [
    {
      name: 'color',
      label: 'Color',
      type: 'color',
      default: '#FF0000',
    },
    {
      name: 'brightness',
      label: 'Brightness (%)',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      default: 100,
    },
    {
      name: 'bg_color',
      label: 'Background Color',
      type: 'color',
    },
    {
      name: 'border_width',
      label: 'Border Width',
      type: 'number',
      min: 0,
      max: 10,
    },
    {
      name: 'border_color',
      label: 'Border Color',
      type: 'color',
    },
    {
      name: 'radius',
      label: 'Radius',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'shadow_width',
      label: 'Shadow Width',
      type: 'number',
      min: 0,
      max: 50,
    },
    {
      name: 'shadow_color',
      label: 'Shadow Color',
      type: 'color',
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    // LED color
    if (widget.color) {
      const ledColor = convertHexColor(widget.color)
      yaml += `${indent}color: ${ledColor}\n`
    }
    
    // Brightness
    if (widget.brightness !== undefined && widget.brightness !== 100) {
      yaml += `${indent}brightness: ${widget.brightness}%\n`
    }
    
    // Background styling
    if (widget.bg_color) {
      const bgColor = convertHexColor(widget.bg_color)
      yaml += `${indent}bg_color: ${bgColor}\n`
    }
    
    // Border styling
    if (widget.border_width !== undefined) {
      yaml += `${indent}border_width: ${widget.border_width}\n`
    }
    if (widget.border_color) {
      const borderColor = convertHexColor(widget.border_color)
      yaml += `${indent}border_color: ${borderColor}\n`
    }
    
    // Radius
    if (widget.radius !== undefined) {
      yaml += `${indent}radius: ${widget.radius}\n`
    }
    
    // Shadow styling
    if (widget.shadow_width !== undefined) {
      yaml += `${indent}shadow_width: ${widget.shadow_width}\n`
    }
    if (widget.shadow_color) {
      const shadowColor = convertHexColor(widget.shadow_color)
      yaml += `${indent}shadow_color: ${shadowColor}\n`
    }
    
    return yaml
  },
  
  validate(widget: Widget): string | null {
    if (widget.brightness !== undefined && (widget.brightness < 0 || widget.brightness > 100)) {
      return 'Brightness must be between 0 and 100'
    }
    return null
  }
}
