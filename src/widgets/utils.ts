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

/**
 * Convert color to CSS format (#RRGGBB)
 * Handles 0xRRGGBB, #RRGGBB, and decimal number formats
 * @param color - Color in any format (0x, #, or decimal)
 * @returns Color in #RRGGBB CSS format
 */
export function convertColorToCss(color: any): string {
  if (!color) return '#ffffff'
  
  // If it's already a hex string starting with #
  if (typeof color === 'string' && color.startsWith('#')) {
    return color
  }
  
  // If it's a hex string with 0x prefix
  if (typeof color === 'string' && (color.startsWith('0x') || color.startsWith('0X'))) {
    return '#' + color.slice(2).toLowerCase()
  }
  
  // If it's a decimal number, convert to hex
  if (typeof color === 'number') {
    return '#' + color.toString(16).padStart(6, '0').toLowerCase()
  }
  
  // If it's already a string hex without prefix, ensure it's valid
  if (typeof color === 'string' && /^[0-9a-fA-F]{6}$/.test(color)) {
    return '#' + color.toLowerCase()
  }
  
  return '#ffffff'
}

/**
 * Convert hex color format from #RRGGBB to 0xRRGGBB for ESPHome
 * No byte swapping - just replace # with 0x
 * @param hexColor - Color in #RRGGBB or 0xRRGGBB format
 * @returns Color in 0xRRGGBB format - always 6 hex digits
 */
function rgbToBgr565(hexColor: string): string {
  // Remove # or 0x prefix
  let colorHex = hexColor.startsWith('0x') ? hexColor.slice(2) : hexColor.startsWith('#') ? hexColor.slice(1) : hexColor
  
  // Ensure lowercase and padded to 6 digits
  colorHex = colorHex.toLowerCase().padStart(6, '0')
  
  // Return as 0xRRGGBB (no conversion, just format)
  return '0x' + colorHex
}

/**
 * Convert color to ESPHome format
 * Returns color in BGR565 format as used by ESP32 LVGL displays
 * @param color - Color string or number in #RRGGBB or 0xRRGGBB format
 * @returns Hex string in BGR565 format: 0xBGR565
 */
export function convertHexColorToLambda(color: string | number | undefined): string | undefined {
  if (color === undefined || color === null) return undefined
  
  const hexColor = convertHexColor(color)
  if (!hexColor) return undefined
  
  // Convert RGB888 to BGR565 for ESP32 LVGL display
  return rgbToBgr565(hexColor)
}
