import type { Widget } from '../types/widget'
import type { WidgetPlugin } from './types'
import { convertHexColor } from './utils'

export interface Tile {
  id: string
  row: number
  column: number
  dir?: string[]
  label?: string
  widgets?: Widget[]
  layout?: {
    type?: 'FLEX' | 'GRID' | 'NONE'
    flex_flow?: 'ROW' | 'COLUMN' | 'ROW_WRAP' | 'COLUMN_WRAP' | 'ROW_REVERSE' | 'COLUMN_REVERSE'
    flex_align_main?: 'START' | 'END' | 'CENTER' | 'SPACE_EVENLY' | 'SPACE_AROUND' | 'SPACE_BETWEEN'
    flex_align_cross?: 'START' | 'END' | 'CENTER'
    pad_row?: number
    pad_column?: number
  }
}

export const tileviewWidget: WidgetPlugin = {
  type: 'tileview',
  label: 'Tileview',
  icon: 'apps',
  category: 'container',
  
  defaultProps: {
    width: 300,
    height: 250,
    tiles: [
      { id: 'tile_0_0', row: 0, column: 0, dir: ['ALL'], label: 'Tile 0,0', widgets: [] },
      { id: 'tile_0_1', row: 0, column: 1, dir: ['ALL'], label: 'Tile 0,1', widgets: [] },
      { id: 'tile_1_0', row: 1, column: 0, dir: ['ALL'], label: 'Tile 1,0', widgets: [] },
      { id: 'tile_1_1', row: 1, column: 1, dir: ['ALL'], label: 'Tile 1,1', widgets: [] },
    ] as Tile[],
    current_tile_row: 0,
    current_tile_column: 0,
    bg_color: '#1e293b',
    bg_opa: 100,
  },
  
  properties: [
    {
      name: 'obj_id',
      label: 'Object ID',
      type: 'text',
      default: '',
    },
    {
      name: 'current_tile_row',
      label: 'Current Row',
      type: 'number',
      default: 0,
    },
    {
      name: 'current_tile_column',
      label: 'Current Column',
      type: 'number',
      default: 0,
    },
  ],
  
  generateYAML(widget: Widget, indent: string = ''): string {
    const lines: string[] = []
    
    // Note: Tiles and nested widgets are handled by the store's generateYAML function
    // This only handles the tileview-specific styling properties
    
    // Add object ID if present
    if (widget.obj_id) {
      lines.push(`${indent}id: ${widget.obj_id}`)
    }
    
    // Styling
    if (widget.bg_color) {
      lines.push(`${indent}bg_color: ${convertHexColor(widget.bg_color)}`)
    }
    
    if (widget.bg_opa !== undefined && widget.bg_opa !== 100) {
      lines.push(`${indent}bg_opa: ${Math.round(widget.bg_opa)}%`)
    }
    
    if (widget.border_color) {
      lines.push(`${indent}border_color: ${convertHexColor(widget.border_color)}`)
    }
    
    if (widget.border_width !== undefined && widget.border_width > 0) {
      lines.push(`${indent}border_width: ${widget.border_width}`)
    }
    
    if (widget.radius !== undefined && widget.radius > 0) {
      lines.push(`${indent}radius: ${widget.radius}`)
    }
    
    if (widget.pad_all !== undefined && widget.pad_all > 0) {
      lines.push(`${indent}pad_all: ${widget.pad_all}`)
    }
    
    return lines.join('\n')
  },
  validate(widget: Widget): string | null {
    // Must have at least one tile
    if (!widget.tiles || !Array.isArray(widget.tiles) || widget.tiles.length === 0) {
      return 'Tileview must have at least one tile'
    }
    
    // Validate each tile
    for (const tile of widget.tiles) {
      if (!tile.id || tile.id.trim() === '') {
        return 'Each tile must have an ID'
      }
      
      if (tile.row === undefined || tile.row < 0) {
        return 'Each tile must have a valid row (>= 0)'
      }
      
      if (tile.column === undefined || tile.column < 0) {
        return 'Each tile must have a valid column (>= 0)'
      }
    }
    
    // Check for duplicate tile IDs
    const tileIds = widget.tiles.map((t: Tile) => t.id)
    const uniqueIds = new Set(tileIds)
    if (tileIds.length !== uniqueIds.size) {
      return 'Tile IDs must be unique'
    }
    
    // Check for duplicate positions
    const positions = widget.tiles.map((t: Tile) => `${t.row},${t.column}`)
    const uniquePositions = new Set(positions)
    if (positions.length !== uniquePositions.size) {
      return 'Each tile must have a unique row/column position'
    }
    
    return null
  },
}
