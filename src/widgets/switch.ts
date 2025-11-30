import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const switchWidget: WidgetPlugin = {
  type: 'switch',
  label: 'Switch',
  icon: 'settings-input-component',
  category: 'input',
  
  defaultProps: {
    type: 'switch',
    width: 60,
    height: 30,
    checked: false,
  },
  
  properties: [
    {
      name: 'checked',
      label: 'Checked',
      type: 'boolean',
      default: false,
    },
    {
      name: 'bg_color',
      label: 'Background Color',
      type: 'color',
    },
    {
      name: 'bg_opa',
      label: 'Background Opacity (%)',
      type: 'range',
      min: 0,
      max: 100,
      step: 5,
      default: 100,
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
      label: 'Corner Radius',
      type: 'number',
      min: 0,
      max: 50,
    },
  ],
  
  generateYAML: (widget: Widget) => {
    const lines: string[] = []
    
    // State - checked
    if (widget.checked) {
      lines.push('  state:')
      lines.push('    checked: true')
    }
    
    // Background styling
    if (widget.bg_color) {
      lines.push(`  bg_color: ${convertHexColor(widget.bg_color)}`)
    }
    
    if (widget.bg_opa !== undefined && widget.bg_opa !== 100) {
      lines.push(`  bg_opa: ${widget.bg_opa}%`)
    }
    
    if (widget.border_width) {
      lines.push(`  border_width: ${widget.border_width}`)
    }
    
    if (widget.border_color) {
      lines.push(`  border_color: ${convertHexColor(widget.border_color)}`)
    }
    
    if (widget.radius !== undefined) {
      lines.push(`  radius: ${widget.radius}`)
    }
    
    // Indicator styling (when checked)
    const hasIndicatorStyles = widget.indicator?.bg_color || widget.indicator?.bg_opa !== undefined
    if (hasIndicatorStyles) {
      lines.push('  indicator:')
      if (widget.indicator?.bg_color) {
        lines.push(`    bg_color: ${convertHexColor(widget.indicator.bg_color)}`)
      }
      if (widget.indicator?.bg_opa !== undefined) {
        lines.push(`    bg_opa: ${widget.indicator.bg_opa}%`)
      }
    }
    
    // Knob styling
    const hasKnobStyles = widget.knob?.bg_color || widget.knob?.radius !== undefined
    if (hasKnobStyles) {
      lines.push('  knob:')
      if (widget.knob?.bg_color) {
        lines.push(`    bg_color: ${convertHexColor(widget.knob.bg_color)}`)
      }
      if (widget.knob?.radius !== undefined) {
        lines.push(`    radius: ${widget.knob.radius}`)
      }
    }
    
    return lines.join('\n')
  },
  
  validate: (widget: Widget) => {
    // Switch widget has no required validation
    return null
  },
}
