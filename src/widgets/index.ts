import type { WidgetRegistry } from './types'
import { labelWidget } from './label'
import { buttonWidget } from './button'
import { sliderWidget } from './slider'
import { barWidget } from './bar'
import { arcWidget } from './arc'
import { dropdownWidget } from './dropdown'
import { lineWidget } from './line'
import { tabviewWidget } from './tabview'
import { buttonmatrixWidget } from './buttonmatrix'
import { checkbox } from './checkbox'
import { keyboardWidget } from './keyboard'
import { ledWidget } from './led'
import { objWidget } from './obj'
import { qrcodeWidget } from './qrcode'
import { rollerWidget } from './roller'
import { spinboxWidget } from './spinbox'
import { switchWidget } from './switch'
import { spinnerWidget } from './spinner'
import { textareaWidget } from './textarea'
import { tileviewWidget } from './tileview'

// Widget registry - all available widgets
export const widgetRegistry: WidgetRegistry = {
  label: labelWidget,
  button: buttonWidget,
  slider: sliderWidget,
  bar: barWidget,
  arc: arcWidget,
  dropdown: dropdownWidget,
  line: lineWidget,
  tabview: tabviewWidget,
  buttonmatrix: buttonmatrixWidget,
  checkbox: checkbox,
  keyboard: keyboardWidget,
  led: ledWidget,
  obj: objWidget,
  qrcode: qrcodeWidget,
  roller: rollerWidget,
  spinbox: spinboxWidget,
  switch: switchWidget,
  spinner: spinnerWidget,
  textarea: textareaWidget,
  tileview: tileviewWidget,
}

// Helper functions
export function getWidget(type: string) {
  return widgetRegistry[type]
}

export function getAllWidgets() {
  return Object.values(widgetRegistry)
}

export function getWidgetsByCategory(category: string) {
  return Object.values(widgetRegistry).filter((w) => w.category === category)
}

// Export types
export * from './types'
