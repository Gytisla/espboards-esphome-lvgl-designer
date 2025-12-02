import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const checkbox: WidgetPlugin = {
  type: 'checkbox',
  label: 'Checkbox',
  icon: 'check-box',
  category: 'input',
  
  defaultProps: {
    type: 'checkbox',
    text: 'Checkbox',
    checked: false,
    pad_column: 10
  },

  properties: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
      default: 'Checkbox'
    },
    {
      name: 'checked',
      label: 'Checked',
      type: 'boolean',
      default: false
    },
    {
      name: 'pad_column',
      label: 'Pad Column',
      type: 'number',
      default: 10,
      min: 0,
      max: 100,
      group: 'Layout'
    },
    {
      name: 'indicator.bg_color',
      label: 'Indicator Background Color',
      type: 'color',
      group: 'Indicator'
    },
    {
      name: 'indicator.bg_opa',
      label: 'Indicator Background Opacity',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      group: 'Indicator'
    },
    {
      name: 'indicator.border_color',
      label: 'Indicator Border Color',
      type: 'color',
      group: 'Indicator'
    },
    {
      name: 'indicator.border_width',
      label: 'Indicator Border Width',
      type: 'number',
      min: 0,
      max: 10,
      group: 'Indicator'
    },
    {
      name: 'indicator.border_opa',
      label: 'Indicator Border Opacity',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      group: 'Indicator'
    },
    {
      name: 'indicator.radius',
      label: 'Indicator Radius',
      type: 'number',
      min: 0,
      max: 50,
      group: 'Indicator'
    },
    {
      name: 'indicator.pad_all',
      label: 'Indicator Padding (All)',
      type: 'number',
      min: 0,
      max: 50,
      group: 'Indicator'
    },
    {
      name: 'indicator.pad_top',
      label: 'Indicator Padding Top',
      type: 'number',
      min: 0,
      max: 50,
      group: 'Indicator'
    },
    {
      name: 'indicator.pad_bottom',
      label: 'Indicator Padding Bottom',
      type: 'number',
      min: 0,
      max: 50,
      group: 'Indicator'
    },
    {
      name: 'indicator.pad_left',
      label: 'Indicator Padding Left',
      type: 'number',
      min: 0,
      max: 50,
      group: 'Indicator'
    },
    {
      name: 'indicator.pad_right',
      label: 'Indicator Padding Right',
      type: 'number',
      min: 0,
      max: 50,
      group: 'Indicator'
    },
    {
      name: 'text_color',
      label: 'Text Color',
      type: 'color',
      group: 'Text Style'
    },
    {
      name: 'text_opa',
      label: 'Text Opacity',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      group: 'Text Style'
    },
    {
      name: 'text_font',
      label: 'Text Font',
      type: 'text',
      group: 'Text Style'
    }
  ],

  generateYAML(widget: any, indent: string): string {
    const lines: string[] = []
    
    // Text
    if (widget.text) lines.push(`${indent}text: "${widget.text}"`)
    
    // Checked state
    if (widget.checked !== undefined) {
      lines.push(`${indent}state:`)
      lines.push(`${indent}  checked: ${widget.checked}`)
    }
    
    // Layout spacing
    if (widget.pad_column !== undefined) {
      lines.push(`${indent}pad_column: ${widget.pad_column}`)
    }
    
    // Text style
    const textStyles: string[] = []
    if (widget.text_color) textStyles.push(`${indent}  text_color: ${convertHexColor(widget.text_color)}`)
    if (widget.text_opa !== undefined) textStyles.push(`${indent}  text_opa: ${widget.text_opa}%`)
    if (widget.text_font) textStyles.push(`${indent}  text_font: ${widget.text_font}`)
    
    if (textStyles.length > 0) {
      lines.push(`${indent}styles:`)
      textStyles.forEach(style => lines.push(style))
    }
    
    // Indicator (tick box) styles
    if (widget.indicator) {
      const indicatorStyles: string[] = []
      
      if (widget.indicator.bg_color) indicatorStyles.push(`${indent}    bg_color: ${convertHexColor(widget.indicator.bg_color)}`)
      if (widget.indicator.bg_opa !== undefined) indicatorStyles.push(`${indent}    bg_opa: ${widget.indicator.bg_opa}%`)
      if (widget.indicator.border_color) indicatorStyles.push(`${indent}    border_color: ${convertHexColor(widget.indicator.border_color)}`)
      if (widget.indicator.border_width !== undefined) indicatorStyles.push(`${indent}    border_width: ${widget.indicator.border_width}`)
      if (widget.indicator.border_opa !== undefined) indicatorStyles.push(`${indent}    border_opa: ${widget.indicator.border_opa}%`)
      if (widget.indicator.radius !== undefined) indicatorStyles.push(`${indent}    radius: ${widget.indicator.radius}`)
      
      // Padding
      if (widget.indicator.pad_all !== undefined) {
        indicatorStyles.push(`${indent}    pad_all: ${widget.indicator.pad_all}`)
      } else {
        if (widget.indicator.pad_top !== undefined) indicatorStyles.push(`${indent}    pad_top: ${widget.indicator.pad_top}`)
        if (widget.indicator.pad_bottom !== undefined) indicatorStyles.push(`${indent}    pad_bottom: ${widget.indicator.pad_bottom}`)
        if (widget.indicator.pad_left !== undefined) indicatorStyles.push(`${indent}    pad_left: ${widget.indicator.pad_left}`)
        if (widget.indicator.pad_right !== undefined) indicatorStyles.push(`${indent}    pad_right: ${widget.indicator.pad_right}`)
      }
      
      if (indicatorStyles.length > 0) {
        lines.push(`${indent}indicator:`)
        indicatorStyles.forEach(style => lines.push(style))
      }
    }
    
    return lines.join('\n')
  },

  validate(widget: Widget): string | null {
    if (!widget.text || widget.text.trim() === '') {
      return 'Checkbox text is required'
    }
    
    return null
  }
}
