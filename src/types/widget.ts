export type WidgetType =
  | 'arc'
  | 'bar'
  | 'button'
  | 'buttonmatrix'
  | 'calendar'
  | 'canvas'
  | 'chart'
  | 'checkbox'
  | 'container'
  | 'dropdown'
  | 'image'
  | 'imagebutton'
  | 'keyboard'
  | 'label'
  | 'led'
  | 'line'
  | 'list'
  | 'meter'
  | 'msgbox'
  | 'obj'
  | 'qrcode'
  | 'roller'
  | 'slider'
  | 'spinbox'
  | 'spinner'
  | 'switch'
  | 'table'
  | 'tabview'
  | 'textarea'
  | 'tileview'
  | 'window'

export interface Widget {
  id: string
  type: WidgetType
  x: number
  y: number
  width?: number
  height?: number
  zIndex: number
  // Common properties
  text?: string
  value?: number | boolean
  min_value?: number
  max_value?: number
  text_color?: string
  text_opa?: number
  text_font?: string
  bg_color?: string
  bg_opa?: number
  // Button properties
  align?: 'left' | 'center' | 'right'
  checkable?: boolean
  checked?: boolean
  // Bar properties
  mode?: 'NORMAL' | 'REVERSE' | 'SYMMETRICAL' | 'RANGE' | 'INFINITE' // Bar mode + Roller mode
  start_value?: number
  animated?: boolean
  anim_time?: number
  // Arc properties
  angle?: number
  rotation?: number
  arc_mode?: 'NORMAL' | 'REVERSE' | 'SYMMETRICAL'
  adjustable?: boolean
  start_angle?: number
  end_angle?: number
  change_rate?: number
  arc_color?: string
  arc_opa?: number
  arc_rounded?: boolean
  arc_width?: number
  arc_length?: number // Spinner arc length in degrees
  spin_time?: number // Spinner animation duration in ms
  indicator?: {
    // Arc indicator properties
    arc_color?: string
    arc_width?: number
    arc_opa?: number
    arc_rounded?: boolean
    pressed?: {
      arc_color?: string
    }
    focused?: {
      arc_color?: string
    }
    // Bar indicator properties
    bg_color?: string
    border_width?: number
    border_color?: string
    radius?: number
    // Checkbox indicator properties
    bg_opa?: number
    border_opa?: number
    pad_all?: number
    pad_top?: number
    pad_bottom?: number
    pad_left?: number
    pad_right?: number
  }
  knob?: {
    bg_color?: string
    bg_opa?: number
    border_color?: string
    border_width?: number
    border_opa?: number
    radius?: number
    pad_all?: number
    pad_top?: number
    pad_bottom?: number
    pad_left?: number
    pad_right?: number
  }
  // Image properties
  url?: string
  // LED properties
  color?: string // LED color
  brightness?: number // LED brightness (0-100)
  border_width?: number
  border_color?: string
  radius?: number
  shadow_width?: number
  shadow_color?: string
  // QR Code properties
  qr_size?: number // QR code size in pixels
  light_color?: string // Color for light areas
  dark_color?: string // Color for dark areas
  pad_all?: number // Padding around QR code
  // Line properties
  points?: Array<{ x: number; y: number }>
  line_width?: number
  line_color?: string
  line_rounded?: boolean
  line_dash_width?: number
  line_dash_gap?: number
  // Dropdown properties
  options?: string[]
  selected_index?: number
  dir?: 'BOTTOM' | 'TOP' | 'LEFT' | 'RIGHT'
  symbol?: string
  // Roller properties
  visible_row_count?: number
  text_line_space?: number
  // Spinbox properties
  range_from?: number
  range_to?: number
  digits?: number
  decimal_places?: number
  selected_digit?: number
  rollover?: boolean
  // Textarea properties
  placeholder_text?: string
  one_line?: boolean
  password_mode?: boolean
  max_length?: number
  accepted_chars?: string
  // Tileview properties
  tiles?: Array<{
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
  }>
  current_tile_row?: number
  current_tile_column?: number
  obj_id?: string // ESPHome object ID
  // Tabview properties
  position?: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' // Tab position (replaces tab_pos)
  size?: number // Tab size as percentage (replaces tab_size)
  spread_tabs?: boolean // Spread tabs across full width/height
  // Legacy properties for backward compatibility
  tab_pos?: 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT'
  tab_size?: number
  tabs?: Array<{
    id: string
    name: string
    widgets: Widget[]
  }>
  selectedTabIndex?: number
  // Buttonmatrix properties
  one_checked?: boolean
  pad_row?: number
  pad_column?: number
  rows?: Array<{
    buttons: Array<{
      id: string
      text?: string
      width?: number
      key_code?: string
      selected?: boolean
      control?: {
        checkable?: boolean
        checked?: boolean
        click_trig?: boolean
        custom_1?: boolean
        custom_2?: boolean
        disabled?: boolean
        hidden?: boolean
        no_repeat?: boolean
        popover?: boolean
        recolor?: boolean
      }
    }>
  }>
  items?: {
    bg_color?: string
    text_color?: string
    pressed?: {
      bg_color?: string
    }
    checked?: {
      bg_color?: string
    }
    disabled?: {
      bg_color?: string
    }
  }
  // Keyboard properties
  textarea?: string // ID of textarea to associate with keyboard
  keyboard_mode?: 'TEXT_LOWER' | 'TEXT_UPPER' | 'TEXT_SPECIAL' | 'NUMBER'
}

export interface WidgetTypeInfo {
  type: WidgetType
  name: string
  icon: string
}

export const widgetTypes: WidgetTypeInfo[] = [
  { type: 'arc', name: 'Arc', icon: 'chart-donut' },
  { type: 'bar', name: 'Bar', icon: 'chart-bar' },
  { type: 'button', name: 'Button', icon: 'gesture-tap-button' },
  { type: 'buttonmatrix', name: 'Button Matrix', icon: 'view-grid' },
  { type: 'calendar', name: 'Calendar', icon: 'calendar' },
  { type: 'canvas', name: 'Canvas', icon: 'palette' },
  { type: 'chart', name: 'Chart', icon: 'chart-line' },
  { type: 'checkbox', name: 'Checkbox', icon: 'checkbox-marked' },
  { type: 'container', name: 'Container', icon: 'square-outline' },
  { type: 'dropdown', name: 'Dropdown', icon: 'chevron-down-circle' },
  { type: 'image', name: 'Image', icon: 'image' },
  { type: 'imagebutton', name: 'Image Button', icon: 'image-plus' },
  { type: 'keyboard', name: 'Keyboard', icon: 'keyboard' },
  { type: 'label', name: 'Label', icon: 'text-short' },
  { type: 'led', name: 'LED', icon: 'lightbulb' },
  { type: 'line', name: 'Line', icon: 'minus' },
  { type: 'list', name: 'Menu', icon: 'format-list-bulleted' },
  { type: 'meter', name: 'Meter', icon: 'speedometer' },
  { type: 'msgbox', name: 'Message Box', icon: 'message-text' },
  { type: 'obj', name: 'Object', icon: 'square' },
  { type: 'roller', name: 'Roller', icon: 'unfold-more-horizontal' },
  { type: 'slider', name: 'Slider', icon: 'tune' },
  { type: 'spinbox', name: 'Spinbox', icon: 'numeric' },
  { type: 'spinner', name: 'Spinner', icon: 'loading' },
  { type: 'switch', name: 'Switch', icon: 'toggle-switch' },
  { type: 'table', name: 'Table', icon: 'table' },
  { type: 'tabview', name: 'Tab View', icon: 'tab' },
  { type: 'textarea', name: 'Text Area', icon: 'text-box' },
  { type: 'tileview', name: 'Tile View', icon: 'view-grid-outline' },
  { type: 'window', name: 'Window', icon: 'application' }
]

export const widgetIconMap: Record<string, string> = {
  arc: 'chart-donut',
  bar: 'chart-bar',
  button: 'gesture-tap-button',
  buttonmatrix: 'view-grid',
  calendar: 'calendar',
  canvas: 'palette',
  chart: 'chart-line',
  checkbox: 'checkbox-marked',
  container: 'square-outline',
  dropdown: 'chevron-down-circle',
  image: 'image',
  imagebutton: 'image-plus',
  keyboard: 'keyboard',
  label: 'text-short',
  led: 'lightbulb',
  line: 'minus',
  list: 'format-list-bulleted',
  menu: 'menu',
  meter: 'speedometer',
  msgbox: 'message-text',
  obj: 'square',
  qrcode: 'qr_code_2',
  roller: 'unfold-more-horizontal',
  slider: 'tune',
  spinbox: 'numeric',
  spinner: 'loading',
  switch: 'toggle-switch',
  table: 'table',
  tabview: 'tab',
  textarea: 'text-box',
  tileview: 'view-grid-outline',
  window: 'application',
  default: 'widgets'
}
