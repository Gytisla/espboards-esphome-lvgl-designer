import type { WidgetPlugin } from './types'
import type { Widget } from '../types/widget'
import { convertHexColor } from './utils'

export const qrcodeWidget: WidgetPlugin = {
  type: 'qrcode',
  label: 'QR Code',
  icon: 'code',
  category: 'display',
  
  defaultProps: {
    type: 'qrcode',
    x: 50,
    y: 50,
    width: 120,
    height: 120,
    text: 'esphome.io',
    qr_size: 100,
    light_color: '#FFFFFF',
    dark_color: '#000000',
  },
  
  properties: [
    {
      name: 'text',
      label: 'Text',
      type: 'text',
      default: 'esphome.io',
    },
    {
      name: 'qr_size',
      label: 'QR Size (px)',
      type: 'number',
      min: 50,
      max: 500,
      default: 100,
    },
    {
      name: 'light_color',
      label: 'Light Color',
      type: 'color',
      default: '#FFFFFF',
    },
    {
      name: 'dark_color',
      label: 'Dark Color',
      type: 'color',
      default: '#000000',
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
      max: 20,
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
  
  generateYAML: (widget, indent) => {
    const lines: string[] = []
    
    // Required text property
    if (widget.text) {
      lines.push(`${indent}text: "${widget.text}"`)
    }
    
    // Required size property (export as 'size' for ESPHome)
    lines.push(`${indent}size: ${widget.qr_size || 100}`)
    
    // Light color (defaults to white if not specified)
    if (widget.light_color && widget.light_color !== '#FFFFFF') {
      lines.push(`${indent}light_color: ${convertHexColor(widget.light_color)}`)
    }
    
    // Dark color (defaults to black if not specified)
    if (widget.dark_color && widget.dark_color !== '#000000') {
      lines.push(`${indent}dark_color: ${convertHexColor(widget.dark_color)}`)
    }
    
    // Additional styling options
    if (widget.bg_color) {
      lines.push(`${indent}bg_color: ${convertHexColor(widget.bg_color)}`)
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
    if (!widget.text || widget.text.trim() === '') {
      return 'Text is required for QR code generation'
    }
    
    if (!widget.qr_size || widget.qr_size < 50) {
      return 'Size must be at least 50 pixels'
    }
    
    return null
  },
}
