import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'

export const tabviewWidget: WidgetPlugin = {
  type: 'tabview',
  label: 'Tabview',
  icon: 'tab',
  category: 'container',
  
  defaultProps: {
    type: 'tabview',
    width: 300,
    height: 200,
    position: 'TOP',
    size: 10,
    spread_tabs: false,
    tabs: [
      { id: 'tab1', name: 'Tab 1', widgets: [] },
    ],
    selectedTabIndex: 0,
  },
  
  properties: [
    {
      name: 'position',
      label: 'Position',
      type: 'select',
      options: [
        { value: 'TOP', label: 'Top' },
        { value: 'BOTTOM', label: 'Bottom' },
        { value: 'LEFT', label: 'Left' },
        { value: 'RIGHT', label: 'Right' },
      ],
      default: 'TOP',
    },
    {
      name: 'size',
      label: 'Size (%)',
      type: 'number',
      default: 10,
      min: 5,
      max: 50,
    },
    {
      name: 'spread_tabs',
      label: 'Spread Tabs',
      type: 'boolean',
      default: false,
    },
  ],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    if (widget.position && widget.position !== 'TOP') {
      yaml += `${indent}position: ${widget.position}\n`
    }
    if (widget.size !== undefined && widget.size !== 10) {
      yaml += `${indent}size: ${widget.size}%\n`
    }
    
    // Note: tabs and nested widgets are handled by the main YAML generation logic
    // This is intentionally left to the store's generateYAML function
    
    return yaml
  },
}
