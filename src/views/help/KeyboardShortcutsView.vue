<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Keyboard Shortcuts</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Learn keyboard shortcuts to work more efficiently with the designer.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Widget Manipulation</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 font-mono bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded font-semibold">↑ ↓ ← →</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Move selected widget by 1 pixel (when selected)</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 font-mono bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded font-semibold">Delete / Backspace</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Delete selected widget</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 font-mono bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded font-semibold">Click</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Select widget and show properties</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 font-mono bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded font-semibold">Drag</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Move selected widget</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Shortcuts</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 font-mono bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded font-semibold">Escape</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Close all modals and dialogs</td>
            </tr>
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 font-mono bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded font-semibold">Ctrl/Cmd + P</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-300">Open preview mode</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">UI Controls</h3>
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Header Buttons</h4>
          <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• <strong>YAML Button</strong> - Export current design as YAML configuration</p>
            <p>• <strong>Preview Button</strong> - Open interactive preview mode (or use Ctrl/Cmd + P)</p>
            <p>• <strong>Import Button</strong> - Load YAML configuration from file</p>
            <p>• <strong>Help Button</strong> - Access help and documentation</p>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Modals and Dialogs</h4>
          <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• Press <strong>Escape</strong> to close any open modal</p>
            <p>• Click outside the modal to close it</p>
            <p>• Click the X button to close modals</p>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tips for Efficiency</h3>
      <div class="space-y-3">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>💡 Quick Navigation:</strong> Use arrow keys to nudge widgets into precise positions instead of dragging.
          </p>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>💡 Fast Deletion:</strong> Select a widget and press Delete to quickly remove unwanted elements.
          </p>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>💡 Preview Testing:</strong> Use Ctrl/Cmd + P to quickly open preview and test your layout without using the mouse.
          </p>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>💡 Input Focus:</strong> Click directly in any text field to edit values - no need to click a separate button.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p class="text-sm text-gray-700 dark:text-gray-200">
          <strong>Note:</strong> The exact keys may vary slightly depending on your keyboard layout. The shortcuts above are for a standard QWERTY keyboard.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed
</script>
