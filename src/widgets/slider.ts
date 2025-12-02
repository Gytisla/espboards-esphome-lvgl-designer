import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const sliderWidget: WidgetPlugin = {
  type: 'slider',
  label: 'Slider',
  icon: 'tune',
  category: 'input',
  
  defaultProps: {
    type: 'slider',
    width: 200,
    height: 20,
    value: 50,
    min_value: 0,
    max_value: 100,
  },
  
  properties: [
    {
      name: 'value',
      label: 'Value',
      type: 'number',
      default: 50,
    },
    {
      name: 'min_value',
      label: 'Min Value',
      type: 'number',
      default: 0,
    },
    {
      name: 'max_value',
      label: 'Max Value',
      type: 'number',
      default: 100,
    },
    {
      name: 'bg_color',
      label: 'Background Color',
      type: 'color',
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    if (widget.value !== undefined) yaml += `${indent}value: ${widget.value}\n`
    if (widget.min_value !== undefined) yaml += `${indent}min_value: ${widget.min_value}\n`
    if (widget.max_value !== undefined) yaml += `${indent}max_value: ${widget.max_value}\n`
    if (widget.bg_color) yaml += `${indent}bg_color: ${convertHexColor(widget.bg_color)}\n`
    return yaml
  },
}
