<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Widget Support</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Overview of supported widgets in the ESPHome LVGL UI Builder.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supported Widgets</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
        The following table shows which LVGL widgets are currently implemented in the designer (✓) and which are planned for future releases (✗).
      </p>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Widget</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white w-20">Status</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Arc</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Arc gauge display</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Bar</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Progress bar indicator</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Button</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Clickable button with text</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Button Matrix</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Grid of buttons</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Checkbox</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Boolean checkbox input</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Dropdown</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Dropdown list selector</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Keyboard</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Text input keyboard</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Label</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Text display element</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">LED</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">LED indicator light</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Line</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Drawing line element</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">QR Code</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">QR code display</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Roller</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Scrollable list selection</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Slider</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Value selection slider</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Spinbox</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Numeric value input</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Spinner</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Loading spinner animation</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Switch</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Toggle on/off control</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Tabview</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Tab-based navigation</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Textarea</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Multi-line text input</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Tileview</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-bold text-xs">✓</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Tile-based layout navigation</td>
            </tr>
            <!-- Not yet implemented -->
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Animimg</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-bold text-xs">✗</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Animated image display</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Canvas</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-bold text-xs">✗</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Drawing canvas</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Container</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-bold text-xs">✗</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Widget container/group</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Image</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-bold text-xs">✗</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Image display</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Meter</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-bold text-xs">✗</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Meter gauge display</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 opacity-60">
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">Msgbox</td>
              <td class="px-4 py-3 text-center"><span class="inline-flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded font-bold text-xs">✗</span></td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Message box dialog</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">External Documentation</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
        For detailed information about LVGL widgets and their properties, refer to the official ESPHome documentation:
      </p>
      <div class="space-y-3">
        <a
          href="https://esphome.io/components/lvgl/"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">ESPHome LVGL Component</h4>
              <p class="text-sm text-indigo-800 dark:text-indigo-200">General LVGL component documentation and configuration</p>
            </div>
            <span class="text-indigo-600 dark:text-indigo-400 text-xl">↗</span>
          </div>
        </a>

        <a
          href="https://esphome.io/components/lvgl/widgets/"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-semibold text-indigo-900 dark:text-indigo-100 mb-1">LVGL Widgets Reference</h4>
              <p class="text-sm text-indigo-800 dark:text-indigo-200">Complete documentation of all available widgets and their properties</p>
            </div>
            <span class="text-indigo-600 dark:text-indigo-400 text-xl">↗</span>
          </div>
        </a>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Implementation Notes</h3>
      <div class="space-y-3">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>✓ Implemented Widgets:</strong> These widgets are fully supported in the designer and can be used to create your UI layouts. All properties are editable through the properties panel.
          </p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>✗ Planned Widgets:</strong> These widgets are part of LVGL but not yet implemented in the designer. You can still use them by manually editing the exported YAML file.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p class="text-sm text-gray-700 dark:text-gray-200">
          <strong>Want to see more widgets?</strong> <router-link to="/help/issues" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Request a widget</router-link> or <router-link to="/help/issues" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">contribute</router-link> to the project on GitHub!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for widget support page
</script>
