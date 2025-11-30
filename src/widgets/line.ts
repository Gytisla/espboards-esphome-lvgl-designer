import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const lineWidget: WidgetPlugin = {
  type: 'line',
  label: 'Line',
  icon: 'show-chart',
  category: 'display',
  
  defaultProps: {
    type: 'line',
    width: 200,
    height: 100,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 50 },
      { x: 200, y: 0 },
    ],
    line_width: 2,
    line_color: '#FFFFFF',
    line_rounded: false,
  },
  
  properties: [
    {
      name: 'line_width',
      label: 'Line Width',
      type: 'number',
      default: 2,
      min: 1,
      max: 50,
    },
    {
      name: 'line_color',
      label: 'Line Color',
      type: 'color',
      default: '#FFFFFF',
    },
    {
      name: 'line_rounded',
      label: 'Rounded Endpoints',
      type: 'boolean',
      default: false,
    },
    {
      name: 'line_dash_width',
      label: 'Dash Width',
      type: 'number',
      min: 0,
      max: 50,
    },
    {
      name: 'line_dash_gap',
      label: 'Dash Gap',
      type: 'number',
      min: 0,
      max: 50,
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    // Points - use simplified format (x, y pairs on single line)
    if (widget.points && widget.points.length > 0) {
      yaml += `${indent}points:\n`
      widget.points.forEach((p) => {
        yaml += `${indent}  - ${p.x}, ${p.y}\n`
      })
    }
    
    // Line styling
    if (widget.line_width !== undefined && widget.line_width !== 2) {
      yaml += `${indent}line_width: ${widget.line_width}\n`
    }
    if (widget.line_color) {
      const hexColor = convertHexColor(widget.line_color)
      yaml += `${indent}line_color: ${hexColor}\n`
    }
    if (widget.line_rounded) {
      yaml += `${indent}line_rounded: ${widget.line_rounded}\n`
    }
    
    // Dash properties
    if (widget.line_dash_width !== undefined && widget.line_dash_width > 0) {
      yaml += `${indent}line_dash_width: ${widget.line_dash_width}\n`
    }
    if (widget.line_dash_gap !== undefined && widget.line_dash_gap > 0) {
      yaml += `${indent}line_dash_gap: ${widget.line_dash_gap}\n`
    }
    
    return yaml
  },
}
