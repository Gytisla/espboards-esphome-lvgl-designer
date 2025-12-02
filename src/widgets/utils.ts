/**
 * Utility functions for widget YAML generation
 */

/**
 * Convert hex color from #RRGGBB format to 0xRRGGBB format for ESPHome
 * @param color - Color string or number in #RRGGBB or 0xRRGGBB format
 * @returns Color in 0xRRGGBB format
 */
export function convertHexColor(color: string | number | undefined): string | undefined {
  if (color === undefined || color === null) return undefined
  
  // Convert to string if it's a number
  const colorStr = typeof color === 'number' ? `0x${color.toString(16).toLowerCase().padStart(6, '0')}` : String(color)
  
  // If already in 0x format, return as is
  if (colorStr.startsWith('0x')) {
    return colorStr.toLowerCase()
  }
  
  // Convert # format to 0x format
  if (colorStr.startsWith('#')) {
    return '0x' + colorStr.slice(1).toLowerCase()
  }
  
  return colorStr
}
