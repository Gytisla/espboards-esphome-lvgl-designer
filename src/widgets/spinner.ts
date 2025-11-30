import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const spinnerWidget: WidgetPlugin = {
  type: 'spinner',
  label: 'Spinner',
  icon: 'autorenew',
  category: 'display',
  
  defaultProps: {
    type: 'spinner',
    width: 60,
    height: 60,
    spin_time: 1000,
    arc_length: 60,
    arc_width: 8,
    arc_color: '#818CF8',
    arc_rounded: false,
  },
  
  properties: [
    {
      name: 'spin_time',
      label: 'Spin Time (ms)',
      type: 'number',
      min: 100,
      max: 10000,
      default: 1000,
    },
    {
      name: 'arc_length',
      label: 'Arc Length (deg)',
      type: 'number',
      min: 0,
      max: 360,
      default: 60,
    },
    {
      name: 'arc_width',
      label: 'Arc Width',
      type: 'number',
      min: 1,
      max: 50,
      default: 8,
    },
    {
      name: 'arc_color',
      label: 'Arc Color',
      type: 'color',
      default: '#818CF8',
    },
    {
      name: 'arc_opa',
      label: 'Arc Opacity (%)',
      type: 'range',
      min: 0,
      max: 100,
      step: 5,
      default: 100,
    },
    {
      name: 'arc_rounded',
      label: 'Rounded Ends',
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
  ],
  
  generateYAML: (widget: Widget) => {
    const lines: string[] = []
    
    // Required: spin_time
    const spinTime = widget.spin_time || 1000
    lines.push(`  spin_time: ${spinTime}ms`)
    
    // Required: arc_length
    const arcLength = widget.arc_length !== undefined ? widget.arc_length : 60
    lines.push(`  arc_length: ${arcLength}deg`)
    
    // Arc styling
    if (widget.arc_width && widget.arc_width !== 8) {
      lines.push(`  arc_width: ${widget.arc_width}`)
    }
    
    if (widget.arc_color) {
      lines.push(`  arc_color: ${convertHexColor(widget.arc_color)}`)
    }
    
    if (widget.arc_opa !== undefined && widget.arc_opa !== 100) {
      lines.push(`  arc_opa: ${widget.arc_opa}%`)
    }
    
    if (widget.arc_rounded) {
      lines.push(`  arc_rounded: true`)
    }
    
    // Background styling
    if (widget.bg_color) {
      lines.push(`  bg_color: ${convertHexColor(widget.bg_color)}`)
    }
    
    if (widget.bg_opa !== undefined && widget.bg_opa !== 100) {
      lines.push(`  bg_opa: ${widget.bg_opa}%`)
    }
    
    // Indicator styling (if different from main arc)
    const hasIndicatorStyles = widget.indicator?.arc_color || widget.indicator?.arc_opa !== undefined || widget.indicator?.arc_width
    if (hasIndicatorStyles) {
      lines.push('  indicator:')
      if (widget.indicator?.arc_color) {
        lines.push(`    arc_color: ${convertHexColor(widget.indicator.arc_color)}`)
      }
      if (widget.indicator?.arc_opa !== undefined) {
        lines.push(`    arc_opa: ${widget.indicator.arc_opa}%`)
      }
      if (widget.indicator?.arc_width) {
        lines.push(`    arc_width: ${widget.indicator.arc_width}`)
      }
    }
    
    return lines.join('\n')
  },
  
  validate: (widget: Widget) => {
    if (!widget.spin_time || widget.spin_time <= 0) {
      return 'Spin time must be greater than 0'
    }
    
    if (widget.arc_length !== undefined && (widget.arc_length < 0 || widget.arc_length > 360)) {
      return 'Arc length must be between 0 and 360 degrees'
    }
    
    return null
  },
}
