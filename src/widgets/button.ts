import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const buttonWidget: WidgetPlugin = {
  type: 'button',
  label: 'Button',
  icon: 'button',
  category: 'input',
  
  defaultProps: {
    type: 'button',
    text: 'Button',
    width: 100,
    height: 40,
    checkable: false,
  },
  
  properties: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
      default: 'Button',
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
      name: 'checkable',
      label: 'Checkable',
      type: 'boolean',
      default: false,
    },
    {
      name: 'checked',
      label: 'Checked',
      type: 'boolean',
      condition: (widget) => widget.checkable === true,
    },
    {
      name: 'align',
      label: 'Text Align',
      type: 'select',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      default: 'center',
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    // Button styles
    if (widget.bg_color) {
      const bgColor = convertHexColor(widget.bg_color)
      yaml += `${indent}bg_color: ${bgColor}\n`
    }
    
    // Checkable state
    if (widget.checkable) {
      yaml += `${indent}checkable: ${widget.checkable}\n`
    }
    
    // Checked state
    if (widget.checked) {
      yaml += `${indent}state:\n`
      yaml += `${indent}  checked: ${widget.checked}\n`
    }
    
    // If button has text, add it as a child label widget
    if (widget.text && widget.text.trim() !== '') {
      yaml += `${indent}widgets:\n`
      yaml += `${indent}  - label:\n`
      yaml += `${indent}      align: ${widget.align || 'center'}\n`
      yaml += `${indent}      text: "${widget.text}"\n`
      if (widget.text_color) {
        const textColor = convertHexColor(widget.text_color)
        yaml += `${indent}      text_color: ${textColor}\n`
      }
    }
    
    return yaml
  },
}
