import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const textareaWidget: WidgetPlugin = {
  type: 'textarea',
  label: 'Textarea',
  icon: 'notes',
  category: 'input',
  
  defaultProps: {
    type: 'textarea',
    width: 200,
    height: 100,
    text: '',
    placeholder_text: 'Enter text here',
    one_line: false,
    password_mode: false,
  },
  
  properties: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
      default: '',
    },
    {
      name: 'placeholder_text',
      label: 'Placeholder Text',
      type: 'text',
      default: 'Enter text here',
    },
    {
      name: 'one_line',
      label: 'One Line Mode',
      type: 'boolean',
      default: false,
    },
    {
      name: 'password_mode',
      label: 'Password Mode',
      type: 'boolean',
      default: false,
    },
    {
      name: 'max_length',
      label: 'Max Length',
      type: 'number',
      min: 1,
      max: 10000,
    },
    {
      name: 'accepted_chars',
      label: 'Accepted Characters',
      type: 'text',
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
    {
      name: 'pad_all',
      label: 'Padding',
      type: 'number',
      min: 0,
      max: 50,
    },
  ],
  
  generateYAML: (widget: Widget, indent: string = ''): string => {
    const lines: string[] = []
    
    // Text content
    if (widget.text) {
      lines.push(`${indent}text: "${widget.text}"`)
    }
    
    // Placeholder text
    if (widget.placeholder_text) {
      lines.push(`${indent}placeholder_text: "${widget.placeholder_text}"`)
    }
    
    // One line mode
    if (widget.one_line) {
      lines.push(`${indent}one_line: true`)
    }
    
    // Password mode
    if (widget.password_mode) {
      lines.push(`${indent}password_mode: true`)
    }
    
    // Max length
    if (widget.max_length) {
      lines.push(`${indent}max_length: ${widget.max_length}`)
    }
    
    // Accepted characters
    if (widget.accepted_chars) {
      lines.push(`${indent}accepted_chars: "${widget.accepted_chars}"`)
    }
    
    // Text styling
    if (widget.text_color) {
      lines.push(`${indent}text_color: ${convertHexColor(widget.text_color)}`)
    }
    
    // Background styling
    if (widget.bg_color) {
      lines.push(`${indent}bg_color: ${convertHexColor(widget.bg_color)}`)
    }
    
    if (widget.bg_opa !== undefined && widget.bg_opa !== 100) {
      lines.push(`${indent}bg_opa: ${widget.bg_opa}%`)
    }
    
    if (widget.border_width) {
      lines.push(`${indent}border_width: ${widget.border_width}`)
    }
    
    if (widget.border_color) {
      lines.push(`${indent}border_color: ${convertHexColor(widget.border_color)}`)
    }
    
    if (widget.radius !== undefined) {
      lines.push(`${indent}radius: ${widget.radius}`)
    }
    
    if (widget.pad_all) {
      lines.push(`${indent}pad_all: ${widget.pad_all}`)
    }
    
    return lines.join('\n')
  },
  
  validate: (widget: Widget) => {
    if (widget.max_length !== undefined && widget.max_length < 1) {
      return 'Max length must be at least 1'
    }
    
    return null
  },
}
