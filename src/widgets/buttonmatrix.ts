import type { WidgetPlugin, PropertyGroup } from './types'
import type { Widget } from '../types/widget'

export const buttonmatrixWidget: WidgetPlugin = {
  type: 'buttonmatrix',
  label: 'Button Matrix',
  icon: 'grid-on',
  category: 'input',
  
  defaultProps: {
    type: 'buttonmatrix',
    width: 220,
    height: 120,
    one_checked: false,
    rows: [
      {
        buttons: [
          { id: 'btn_1', text: 'Btn 1', width: 1 },
          { id: 'btn_2', text: 'Btn 2', width: 1 },
          { id: 'btn_3', text: 'Btn 3', width: 1 },
        ],
      },
      {
        buttons: [
          { id: 'btn_4', text: 'Btn 4', width: 1 },
          { id: 'btn_5', text: 'Btn 5', width: 1 },
          { id: 'btn_6', text: 'Btn 6', width: 1 },
        ],
      },
    ],
  },
  
  properties: [
    // Matrix settings group
    {
      name: 'matrix',
      label: 'Matrix Settings',
      fields: [
        {
          name: 'one_checked',
          label: 'One Checked (Radio Mode)',
          type: 'boolean',
          default: false,
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
        {
          name: 'pad_row',
          label: 'Row Padding',
          type: 'number',
          min: 0,
        },
        {
          name: 'pad_column',
          label: 'Column Padding',
          type: 'number',
          min: 0,
        },
      ],
    },
    // Items style group
    {
      name: 'items',
      label: 'Button Items Style',
      fields: [
        {
          name: 'items.bg_color',
          label: 'Item Background',
          type: 'color',
        },
        {
          name: 'items.text_color',
          label: 'Item Text Color',
          type: 'color',
        },
        {
          name: 'items.pressed.bg_color',
          label: 'Pressed Background',
          type: 'color',
        },
        {
          name: 'items.checked.bg_color',
          label: 'Checked Background',
          type: 'color',
        },
        {
          name: 'items.disabled.bg_color',
          label: 'Disabled Background',
          type: 'color',
        },
      ],
    },
  ] as PropertyGroup[],
  
  generateYAML: (widget: Widget, indent: string): string => {
    let yaml = ''
    
    // One checked option
    if (widget.one_checked) {
      yaml += `${indent}one_checked: ${widget.one_checked}\n`
    }
    
    // Style properties
    if (widget.bg_color) yaml += `${indent}bg_color: ${widget.bg_color}\n`
    if (widget.pad_row !== undefined) yaml += `${indent}pad_row: ${widget.pad_row}\n`
    if (widget.pad_column !== undefined) yaml += `${indent}pad_column: ${widget.pad_column}\n`
    
    // Items styles
    if (widget.items) {
      yaml += `${indent}items:\n`
      if (widget.items.bg_color) yaml += `${indent}  bg_color: ${widget.items.bg_color}\n`
      if (widget.items.text_color) yaml += `${indent}  text_color: ${widget.items.text_color}\n`
      
      if (widget.items.pressed) {
        yaml += `${indent}  pressed:\n`
        if (widget.items.pressed.bg_color) yaml += `${indent}    bg_color: ${widget.items.pressed.bg_color}\n`
      }
      
      if (widget.items.checked) {
        yaml += `${indent}  checked:\n`
        if (widget.items.checked.bg_color) yaml += `${indent}    bg_color: ${widget.items.checked.bg_color}\n`
      }
      
      if (widget.items.disabled) {
        yaml += `${indent}  disabled:\n`
        if (widget.items.disabled.bg_color) yaml += `${indent}    bg_color: ${widget.items.disabled.bg_color}\n`
      }
    }
    
    // Rows and buttons
    if (widget.rows && widget.rows.length > 0) {
      yaml += `${indent}rows:\n`
      widget.rows.forEach((row) => {
        yaml += `${indent}  - buttons:\n`
        if (row.buttons && row.buttons.length > 0) {
          row.buttons.forEach((button) => {
            yaml += `${indent}    - id: ${button.id}\n`
            if (button.text) yaml += `${indent}      text: "${button.text}"\n`
            if (button.width && button.width !== 1) yaml += `${indent}      width: ${button.width}\n`
            if (button.key_code) yaml += `${indent}      key_code: "${button.key_code}"\n`
            if (button.selected) yaml += `${indent}      selected: ${button.selected}\n`
            
            // Control flags
            if (button.control) {
              const hasAnyControl = Object.values(button.control).some(v => v === true)
              if (hasAnyControl) {
                yaml += `${indent}      control:\n`
                if (button.control.checkable) yaml += `${indent}        checkable: true\n`
                if (button.control.checked) yaml += `${indent}        checked: true\n`
                if (button.control.click_trig) yaml += `${indent}        click_trig: true\n`
                if (button.control.disabled) yaml += `${indent}        disabled: true\n`
                if (button.control.hidden) yaml += `${indent}        hidden: true\n`
                if (button.control.no_repeat) yaml += `${indent}        no_repeat: true\n`
                if (button.control.popover) yaml += `${indent}        popover: true\n`
                if (button.control.recolor) yaml += `${indent}        recolor: true\n`
                if (button.control.custom_1) yaml += `${indent}        custom_1: true\n`
                if (button.control.custom_2) yaml += `${indent}        custom_2: true\n`
              }
            }
          })
        }
      })
    }
    
    return yaml
  },
}
