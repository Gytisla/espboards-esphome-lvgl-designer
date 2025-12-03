import type { WidgetPlugin, PropertyGroup } from './types'
import type { Widget } from '../types/widget'
import { convertHexColorToLambda } from './utils'

export const arcWidget: WidgetPlugin = {
  type: 'arc',
  label: 'Arc',
  icon: 'circle',
  category: 'input',
  
  defaultProps: {
    type: 'arc',
    width: 150,
    height: 150,
    value: 50,
    min_value: 0,
    max_value: 100,
    start_angle: 135,
    end_angle: 45,
    rotation: 0,
    adjustable: true,
    arc_mode: 'NORMAL',
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
          name: 'adjustable',
          label: 'Adjustable',
          type: 'boolean',
          default: true,
        },
      ],
    },
    // Angles group
    {
      name: 'angles',
      label: 'Angles',
      fields: [
        {
          name: 'start_angle',
          label: 'Start Angle',
          type: 'range',
          min: 0,
          max: 360,
          default: 135,
        },
        {
          name: 'end_angle',
          label: 'End Angle',
          type: 'range',
          min: 0,
          max: 360,
          default: 45,
        },
        {
          name: 'rotation',
          label: 'Rotation',
          type: 'range',
          min: 0,
          max: 360,
          default: 0,
        },
      ],
    },
    // Arc settings group
    {
      name: 'arc_settings',
      label: 'Arc Settings',
      fields: [
        {
          name: 'arc_mode',
          label: 'Mode',
          type: 'select',
          options: [
            { value: 'NORMAL', label: 'Normal' },
            { value: 'REVERSE', label: 'Reverse' },
            { value: 'SYMMETRICAL', label: 'Symmetrical' },
          ],
          default: 'NORMAL',
        },
        {
          name: 'change_rate',
          label: 'Change Rate',
          type: 'number',
        },
      ],
    },
    // Background arc group
    {
      name: 'background',
      label: 'Background Arc',
      fields: [
        {
          name: 'arc_color',
          label: 'Arc Color',
          type: 'color',
        },
        {
          name: 'arc_width',
          label: 'Arc Width',
          type: 'number',
        },
        {
          name: 'arc_opa',
          label: 'Arc Opacity',
          type: 'range',
          min: 0,
          max: 255,
        },
        {
          name: 'arc_rounded',
          label: 'Arc Rounded',
          type: 'boolean',
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
    
    // Arc configuration
    if (widget.adjustable !== undefined) yaml += `${indent}adjustable: ${widget.adjustable}\n`
    if (widget.start_angle !== undefined && widget.start_angle !== 135) {
      yaml += `${indent}start_angle: ${widget.start_angle}\n`
    }
    if (widget.end_angle !== undefined && widget.end_angle !== 45) {
      yaml += `${indent}end_angle: ${widget.end_angle}\n`
    }
    if (widget.rotation !== undefined && widget.rotation !== 0) {
      yaml += `${indent}rotation: ${widget.rotation}\n`
    }
    if (widget.arc_mode && widget.arc_mode !== 'NORMAL') {
      yaml += `${indent}mode: ${widget.arc_mode}\n`
    }
    if (widget.change_rate !== undefined) {
      yaml += `${indent}change_rate: ${widget.change_rate}\n`
    }
    
    // Background arc properties
    if (widget.arc_color) {
      const arcColor = convertHexColorToLambda(widget.arc_color)
      yaml += `${indent}arc_color: ${arcColor}\n`
    }
    if (widget.arc_width) yaml += `${indent}arc_width: ${widget.arc_width}\n`
    if (widget.arc_opa !== undefined) yaml += `${indent}arc_opa: ${widget.arc_opa}\n`
    if (widget.arc_rounded !== undefined) yaml += `${indent}arc_rounded: ${widget.arc_rounded}\n`
    
    // Indicator properties
    if (widget.indicator) {
      yaml += `${indent}indicator:\n`
      if (widget.indicator.arc_color) {
        const indicatorColor = convertHexColorToLambda(widget.indicator.arc_color)
        yaml += `${indent}  arc_color: ${indicatorColor}\n`
      }
      if (widget.indicator.arc_width) yaml += `${indent}  arc_width: ${widget.indicator.arc_width}\n`
      if (widget.indicator.arc_opa !== undefined) yaml += `${indent}  arc_opa: ${widget.indicator.arc_opa}\n`
      if (widget.indicator.arc_rounded !== undefined) yaml += `${indent}  arc_rounded: ${widget.indicator.arc_rounded}\n`
      
      if (widget.indicator.pressed?.arc_color) {
        yaml += `${indent}  pressed:\n`
        const pressedColor = convertHexColorToLambda(widget.indicator.pressed.arc_color)
        yaml += `${indent}    arc_color: ${pressedColor}\n`
      }
      if (widget.indicator.focused?.arc_color) {
        yaml += `${indent}  focused:\n`
        const focusedColor = convertHexColorToLambda(widget.indicator.focused.arc_color)
        yaml += `${indent}    arc_color: ${focusedColor}\n`
      }
    }
    
    // Knob properties
    if (widget.knob) {
      yaml += `${indent}knob:\n`
      if (widget.knob.bg_color) {
        const knobColor = convertHexColorToLambda(widget.knob.bg_color)
        yaml += `${indent}  bg_color: ${knobColor}\n`
      }
      if (widget.knob.radius) yaml += `${indent}  radius: ${widget.knob.radius}\n`
    }
    
    return yaml
  },
}
