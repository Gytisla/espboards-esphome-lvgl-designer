import type { WidgetPlugin, PropertyGroup } from './types'
import type { Widget } from '../types/widget'

export const barWidget: WidgetPlugin = {
  type: 'bar',
  label: 'Bar',
  icon: 'bar-chart',
  category: 'display',
  
  defaultProps: {
    type: 'bar',
    width: 200,
    height: 30,
    value: 0,
    min_value: 0,
    max_value: 100,
    mode: 'NORMAL',
    animated: true,
  },
  
  properties: [
    // Basic group
    {
      name: 'basic',
      label: 'Basic',
      fields: [
        {
          name: 'value',
          label: 'Value',
          type: 'number',
          default: 0,
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
      ],
    },
    // Mode group
    {
      name: 'mode',
      label: 'Mode',
      fields: [
        {
          name: 'mode',
          label: 'Mode',
          type: 'select',
          options: [
            { value: 'NORMAL', label: 'Normal - Min to Value' },
            { value: 'SYMMETRICAL', label: 'Symmetrical - Center to Value' },
            { value: 'RANGE', label: 'Range - Start to Value' },
          ],
          default: 'NORMAL',
        },
        {
          name: 'start_value',
          label: 'Start Value',
          type: 'number',
          default: 0,
          condition: (widget) => widget.mode === 'RANGE',
        },
      ],
    },
    // Animation group
    {
      name: 'animation',
      label: 'Animation',
      fields: [
        {
          name: 'animated',
          label: 'Animated',
          type: 'boolean',
          default: true,
        },
      ],
    },
    // Style group
    {
      name: 'style',
      label: 'Style',
      fields: [
        {
          name: 'bg_color',
          label: 'Background Color',
          type: 'color',
        },
      ],
    },
    // Indicator group
    {
      name: 'indicator',
      label: 'Indicator',
      fields: [
        {
          name: 'indicator.bg_color',
          label: 'Color',
          type: 'color',
        },
        {
          name: 'indicator.border_width',
          label: 'Border Width',
          type: 'number',
          min: 0,
        },
        {
          name: 'indicator.border_color',
          label: 'Border Color',
          type: 'color',
        },
        {
          name: 'indicator.radius',
          label: 'Radius',
          type: 'number',
          min: 0,
        },
      ],
    },
  ] as PropertyGroup[],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    // Basic properties
    if (widget.value !== undefined) yaml += `${indent}value: ${widget.value}\n`
    if (widget.min_value !== undefined) yaml += `${indent}min_value: ${widget.min_value}\n`
    if (widget.max_value !== undefined) yaml += `${indent}max_value: ${widget.max_value}\n`
    
    // Mode
    if (widget.mode && widget.mode !== 'NORMAL') {
      yaml += `${indent}mode: ${widget.mode}\n`
    }
    
    // Start value for RANGE mode
    if (widget.mode === 'RANGE' && widget.start_value !== undefined) {
      yaml += `${indent}start_value: ${widget.start_value}\n`
    }
    
    // Animation
    if (widget.animated === false) {
      yaml += `${indent}animated: false\n`
    }
    
    // Indicator styles
    if (widget.indicator) {
      yaml += `${indent}indicator:\n`
      if (widget.indicator.bg_color) yaml += `${indent}  bg_color: ${widget.indicator.bg_color}\n`
      if (widget.indicator.border_width !== undefined) yaml += `${indent}  border_width: ${widget.indicator.border_width}\n`
      if (widget.indicator.border_color) yaml += `${indent}  border_color: ${widget.indicator.border_color}\n`
      if (widget.indicator.radius !== undefined) yaml += `${indent}  radius: ${widget.indicator.radius}\n`
    }
    
    // Background color
    if (widget.bg_color) yaml += `${indent}bg_color: ${widget.bg_color}\n`
    
    return yaml
  },
}
