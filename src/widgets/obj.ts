import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColorToLambda } from './utils'

export const objWidget: WidgetPlugin = {
  type: 'obj',
  label: 'Object',
  icon: 'square',
  category: 'container',
  
  defaultProps: {
    type: 'obj',
    width: 100,
    height: 100,
    bg_color: '#4f46e5',
    border_color: '#4b5563',
    border_width: 1,
    radius: 8,
  },
  
  properties: [
    {
      name: 'bg_color',
      label: 'Background Color',
      type: 'color',
      default: '#4f46e5',
    },
    {
      name: 'border_color',
      label: 'Border Color',
      type: 'color',
      default: '#4b5563',
    },
    {
      name: 'border_width',
      label: 'Border Width',
      type: 'number',
      default: 1,
    },
    {
      name: 'radius',
      label: 'Corner Radius',
      type: 'number',
      default: 8,
    },
  ],
  
  generateYAML(widget: Widget, indent: string = ''): string {
    const lines: string[] = []
    
    // Style properties
    if (widget.bg_color) lines.push(`${indent}bg_color: ${convertHexColorToLambda(widget.bg_color)}`)
    if (widget.border_color) lines.push(`${indent}border_color: ${convertHexColorToLambda(widget.border_color)}`)
    if (widget.border_width !== undefined) lines.push(`${indent}border_width: ${widget.border_width}`)
    if (widget.radius !== undefined) lines.push(`${indent}radius: ${widget.radius}`)
    
    return lines.join('\n')
  },
}
