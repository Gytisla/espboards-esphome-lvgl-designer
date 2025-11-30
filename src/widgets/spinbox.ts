import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'

export const spinboxWidget: WidgetPlugin = {
  type: 'spinbox',
  label: 'Spinbox',
  icon: 'dialpad',
  category: 'input',
  
  defaultProps: {
    type: 'spinbox',
    width: 120,
    height: 40,
    value: 0,
    range_from: 0,
    range_to: 100,
    digits: 4,
    decimal_places: 0,
    selected_digit: 0,
    rollover: false,
  },
  
  properties: [
    {
      name: 'value',
      label: 'Value',
      type: 'number',
      default: 0,
    },
    {
      name: 'range_from',
      label: 'Range From',
      type: 'number',
      default: 0,
    },
    {
      name: 'range_to',
      label: 'Range To',
      type: 'number',
      default: 100,
    },
    {
      name: 'digits',
      label: 'Digits',
      type: 'number',
      min: 1,
      max: 10,
      default: 4,
    },
    {
      name: 'decimal_places',
      label: 'Decimal Places',
      type: 'number',
      min: 0,
      max: 6,
      default: 0,
    },
    {
      name: 'selected_digit',
      label: 'Selected Digit',
      type: 'number',
      min: 0,
      default: 0,
    },
    {
      name: 'rollover',
      label: 'Rollover',
      type: 'boolean',
      default: false,
    },
    {
      name: 'anim_time',
      label: 'Cursor Blink Time (ms)',
      type: 'number',
      min: 0,
      max: 5000,
    },
    {
      name: 'text_color',
      label: 'Text Color',
      type: 'color',
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
      label: 'Corner Radius',
      type: 'number',
      min: 0,
      max: 50,
    },
  ],
  
  generateYAML: (widget: Widget) => {
    const lines: string[] = []
    
    // Value
    if (widget.value !== undefined && widget.value !== 0) {
      lines.push(`  value: ${widget.value}`)
    }
    
    // Range
    if (widget.range_from !== undefined && widget.range_from !== 0) {
      lines.push(`  range_from: ${widget.range_from}`)
    }
    
    if (widget.range_to !== undefined && widget.range_to !== 100) {
      lines.push(`  range_to: ${widget.range_to}`)
    }
    
    // Digits configuration
    if (widget.digits && widget.digits !== 4) {
      lines.push(`  digits: ${widget.digits}`)
    }
    
    if (widget.decimal_places !== undefined && widget.decimal_places !== 0) {
      lines.push(`  decimal_places: ${widget.decimal_places}`)
    }
    
    // Selected digit
    if (widget.selected_digit !== undefined && widget.selected_digit !== 0) {
      lines.push(`  selected_digit: ${widget.selected_digit}`)
    }
    
    // Rollover
    if (widget.rollover) {
      lines.push(`  rollover: true`)
    }
    
    // Animation time
    if (widget.anim_time) {
      lines.push(`  anim_time: ${widget.anim_time}ms`)
    }
    
    // Styling
    if (widget.text_color) {
      lines.push(`  text_color: ${widget.text_color}`)
    }
    
    if (widget.bg_color) {
      lines.push(`  bg_color: ${widget.bg_color}`)
    }
    
    if (widget.border_width) {
      lines.push(`  border_width: ${widget.border_width}`)
    }
    
    if (widget.border_color) {
      lines.push(`  border_color: ${widget.border_color}`)
    }
    
    if (widget.radius !== undefined) {
      lines.push(`  radius: ${widget.radius}`)
    }
    
    return lines.join('\n')
  },
  
  validate: (widget: Widget) => {
    if (widget.range_from !== undefined && widget.range_to !== undefined && widget.range_from >= widget.range_to) {
      return 'Range From must be less than Range To'
    }
    
    const numValue = typeof widget.value === 'number' ? widget.value : 0
    
    if (widget.range_from !== undefined && numValue < widget.range_from) {
      return `Value (${numValue}) must be greater than or equal to Range From (${widget.range_from})`
    }
    
    if (widget.range_to !== undefined && numValue > widget.range_to) {
      return `Value (${numValue}) must be less than or equal to Range To (${widget.range_to})`
    }
    
    if (widget.digits && widget.selected_digit !== undefined && widget.selected_digit >= widget.digits) {
      return `Selected digit (${widget.selected_digit}) must be less than total digits (${widget.digits})`
    }
    
    return null
  },
}
