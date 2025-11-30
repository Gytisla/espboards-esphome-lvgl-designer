import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'

export const rollerWidget: WidgetPlugin = {
  type: 'roller',
  label: 'Roller',
  icon: 'view-list',
  category: 'input',
  
  defaultProps: {
    type: 'roller',
    width: 120,
    height: 150,
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    selected_index: 0,
    mode: 'NORMAL',
    visible_row_count: 3,
  },
  
  properties: [
    {
      name: 'selected_index',
      label: 'Selected Index',
      type: 'number',
      min: 0,
      default: 0,
    },
    {
      name: 'mode',
      label: 'Mode',
      type: 'select',
      options: [
        { value: 'NORMAL', label: 'Normal' },
        { value: 'INFINITE', label: 'Infinite' },
      ],
      default: 'NORMAL',
    },
    {
      name: 'visible_row_count',
      label: 'Visible Rows',
      type: 'number',
      min: 1,
      max: 10,
      default: 3,
    },
    {
      name: 'anim_time',
      label: 'Animation Time (ms)',
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
    {
      name: 'text_line_space',
      label: 'Line Spacing',
      type: 'number',
      min: 0,
      max: 50,
    },
  ],
  
  generateYAML: (widget: Widget) => {
    const lines: string[] = []
    
    // Options (required)
    if (widget.options && Array.isArray(widget.options) && widget.options.length > 0) {
      lines.push('  options:')
      widget.options.forEach((option: string) => {
        lines.push(`    - ${option}`)
      })
    }
    
    // Selected index
    if (widget.selected_index !== undefined && widget.selected_index !== 0) {
      lines.push(`  selected_index: ${widget.selected_index}`)
    }
    
    // Mode (only if not NORMAL)
    if (widget.mode && widget.mode !== 'NORMAL') {
      lines.push(`  mode: ${widget.mode}`)
    }
    
    // Visible row count (only if not default)
    if (widget.visible_row_count && widget.visible_row_count !== 3) {
      lines.push(`  visible_row_count: ${widget.visible_row_count}`)
    }
    
    // Animation time
    if (widget.anim_time) {
      lines.push(`  anim_time: ${widget.anim_time}ms`)
    }
    
    // Text styling
    if (widget.text_color) {
      lines.push(`  text_color: ${widget.text_color}`)
    }
    
    if (widget.text_line_space) {
      lines.push(`  text_line_space: ${widget.text_line_space}`)
    }
    
    // Background styling
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
    if (!widget.options || !Array.isArray(widget.options) || widget.options.length === 0) {
      return 'Roller must have at least one option'
    }
    
    if (widget.selected_index !== undefined && widget.selected_index >= widget.options.length) {
      return `Selected index (${widget.selected_index}) must be less than the number of options (${widget.options.length})`
    }
    
    return null
  },
}
