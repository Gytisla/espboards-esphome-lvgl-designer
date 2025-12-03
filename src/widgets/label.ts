import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColorToLambda } from './utils'

export const labelWidget: WidgetPlugin = {
  type: 'label',
  label: 'Label',
  icon: 'label',
  category: 'basic',
  
  defaultProps: {
    type: 'label',
    text: 'Label',
    width: 100,
    height: 30,
    text_color: '#FFFFFF',
  },
  
  properties: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
      default: 'Label',
    },
    {
      name: 'text_color',
      label: 'Text Color',
      type: 'color',
      default: '#FFFFFF',
    },
    {
      name: 'bg_color',
      label: 'Background Color',
      type: 'color',
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    if (widget.text) yaml += `${indent}text: "${widget.text}"\n`
    if (widget.text_color) yaml += `${indent}text_color: ${convertHexColorToLambda(widget.text_color)}\n`
    if (widget.bg_color) yaml += `${indent}bg_color: ${convertHexColorToLambda(widget.bg_color)}\n`
    return yaml
  },
}
