import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'

export const keyboardWidget: WidgetPlugin = {
  type: 'keyboard',
  label: 'Keyboard',
  icon: 'keyboard',
  category: 'input',
  
  defaultProps: {
    type: 'keyboard',
    width: 300,
    height: 120,
    keyboard_mode: 'TEXT_LOWER',
  },
  
  properties: [
    {
      name: 'textarea',
      label: 'Textarea ID',
      type: 'text',
      default: '',
    },
    {
      name: 'keyboard_mode',
      label: 'Mode',
      type: 'select',
      options: [
        { value: 'TEXT_LOWER', label: 'Text Lower' },
        { value: 'TEXT_UPPER', label: 'Text Upper' },
        { value: 'TEXT_SPECIAL', label: 'Text Special' },
        { value: 'NUMBER', label: 'Number' },
      ],
      default: 'TEXT_LOWER',
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    // Textarea association
    if (widget.textarea) {
      yaml += `${indent}textarea: ${widget.textarea}\n`
    }
    
    // Keyboard mode
    if (widget.keyboard_mode && widget.keyboard_mode !== 'TEXT_LOWER') {
      yaml += `${indent}mode: ${widget.keyboard_mode}\n`
    }
    
    return yaml
  },
  
  validate(widget: Widget): string | null {
    // Keyboard doesn't require any specific validation
    return null
  }
}
