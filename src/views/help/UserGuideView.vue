<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Guide</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Complete documentation for all features and functionality of the ESPHome LVGL UI Builder.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interface Overview</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Header Bar</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Contains the main title and action buttons:
          </p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
            <li>• <strong>YAML</strong> - Export current design as YAML</li>
            <li>• <strong>Preview</strong> - Open interactive preview mode</li>
            <li>• <strong>Import</strong> - Import YAML configuration</li>
            <li>• <strong>Help</strong> - Access help and information</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Toolbox (Left Panel)</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Contains all available widgets organized by category. Drag widgets onto the canvas to add them to your design.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Canvas (Center Area)</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            The main editing area where you place and arrange your widgets. Represents your display.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Properties Panel (Right Sidebar)</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Shows properties of the selected widget. Adjust position, size, colors, and other widget-specific settings.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Working with Widgets</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Adding Widgets</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Drag any widget from the Toolbox onto the canvas to add it. You'll see a preview of the widget as you drag.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Selecting Widgets</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Click on any widget to select it. Selected widgets show a blue highlight. Use the properties panel to modify the selected widget.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Moving Widgets</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Drag a selected widget to move it. You can also use arrow keys (←, →, ↑, ↓) to move in 1-pixel increments.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Resizing Widgets</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Use the Width and Height fields in the properties panel to resize widgets. Most widgets can be resized by entering new values.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Deleting Widgets</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Select a widget and press Delete or Backspace to remove it from your design.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Canvas Management</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Canvas Tabs</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
            You can create multiple canvases (tabs) to organize different screens or layouts:
          </p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
            <li>• Click "+" to add a new canvas</li>
            <li>• Click the X to delete a canvas</li>
            <li>• Click a tab to switch between canvases</li>
            <li>• Customize canvas dimensions in the left sidebar</li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Canvas Properties</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Each canvas has adjustable width and height in pixels. This represents the target display size for your ESP32 device.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Types</h3>
      <div class="space-y-3">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>Position (X, Y):</strong> Coordinates in pixels from the top-left corner of the canvas.
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>Size (Width, Height):</strong> Dimensions in pixels.
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>Colors:</strong> Use the color picker or enter hex values (#RRGGBB) or LVGL hex format (0xRRGGBB).
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>Text:</strong> Text content for labels, buttons, and other text widgets.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Widgets</h3>
      <div class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <p class="mb-3">The following widgets are available in the Toolbox:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>• <strong>Button</strong> - Clickable button with text</div>
          <div>• <strong>Label</strong> - Text display</div>
          <div>• <strong>Container</strong> - Group related widgets</div>
          <div>• <strong>Slider</strong> - Value selection</div>
          <div>• <strong>Switch</strong> - Toggle control</div>
          <div>• <strong>Checkbox</strong> - Boolean input</div>
          <div>• <strong>Dropdown</strong> - Select from options</div>
          <div>• <strong>Roller</strong> - Scrollable list</div>
          <div>• <strong>Spinbox</strong> - Numeric input</div>
          <div>• <strong>Keyboard</strong> - Text input keyboard</div>
          <div>• <strong>TextArea</strong> - Multi-line text</div>
          <div>• <strong>Bar</strong> - Progress indicator</div>
          <div>• <strong>Arc</strong> - Arc gauge</div>
          <div>• <strong>Line</strong> - Drawing line</div>
          <div>• <strong>LED</strong> - Light indicator</div>
          <div>• <strong>QR Code</strong> - QR code display</div>
          <div>• <strong>Tabview</strong> - Tab navigation</div>
          <div>• <strong>Tileview</strong> - Tile-based layout</div>
          <div>• <strong>Button Matrix</strong> - Grid of buttons</div>
          <div>• <strong>Spinner</strong> - Loading spinner</div>
        </div>
        <div class="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p class="text-xs text-gray-700 dark:text-gray-200 mb-2"><strong>📚 Widget Documentation:</strong></p>
          <p class="text-xs text-gray-600 dark:text-gray-300 mb-2">
            For detailed information about each widget and its properties, refer to the official ESPHome LVGL documentation:
          </p>
          <a href="https://esphome.io/components/lvgl/widgets/" target="_blank" rel="noopener noreferrer" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            ESPHome LVGL Widgets Reference →
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saving and Loading</h3>
      <div class="space-y-3">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Auto-Save</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Your designs are automatically saved to your browser's local storage whenever you make changes.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Export YAML</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Click the YAML button to generate ESPHome-compatible YAML code that you can integrate into your ESPHome configuration.
          </p>
        </div>
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Import YAML</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Click Import to load a previously exported YAML file back into the designer for editing.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed
</script>
