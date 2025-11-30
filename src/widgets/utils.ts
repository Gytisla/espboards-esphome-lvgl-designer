/**
 * Utility functions for widget YAML generation
 */

/**
 * Convert hex color from #RRGGBB format to 0xRRGGBB format for ESPHome
 * @param color - Color string in #RRGGBB or 0xRRGGBB format
 * @returns Color in 0xRRGGBB format
 */
export function convertHexColor(color: string | undefined): string | undefined {
  if (!color) return undefined
  
  // If already in 0x format, return as is
  if (color.startsWith('0x')) {
    return color.toUpperCase()
  }
  
  // Convert # format to 0x format
  if (color.startsWith('#')) {
    return '0x' + color.slice(1).toUpperCase()
  }
  
  return color
}
