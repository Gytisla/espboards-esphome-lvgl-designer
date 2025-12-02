<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Getting Started</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Follow these steps to create your first ESPHome LVGL UI with the designer.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Step 1: Create a New Canvas</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        When you start the designer, you'll see the main canvas area in the center. The default canvas is 240×320 pixels (typical for small displays).
      </p>
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 mb-4">
        <strong>Tip:</strong> You can adjust canvas dimensions in the properties panel on the right if needed.
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Step 2: Add Widgets</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-3">
        Click on the "Toolbox" panel on the left side to see available widgets:
      </p>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
        <li>• <strong>Button</strong> - Interactive clickable buttons</li>
        <li>• <strong>Label</strong> - Text display elements</li>
        <li>• <strong>Slider</strong> - Value selection control</li>
        <li>• <strong>Switch</strong> - Toggle on/off control</li>
        <li>• <strong>Container</strong> - Group widgets together</li>
        <li>• <strong>And many more...</strong></li>
      </ul>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Drag a widget from the toolbox onto the canvas to add it.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Step 3: Configure Properties</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-3">
        Click on any widget to select it, then use the properties panel on the right to:
      </p>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
        <li>• Set position (X, Y coordinates)</li>
        <li>• Set dimensions (width, height)</li>
        <li>• Change colors and styling</li>
        <li>• Add text or other content</li>
        <li>• Configure widget-specific options</li>
      </ul>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Step 4: Preview Your Design</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-3">
        Click the <strong>Preview</strong> button in the header to see an interactive preview of your UI:
      </p>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
        <li>• Interact with buttons and controls</li>
        <li>• See how your design looks and functions</li>
        <li>• Test responsiveness and layout</li>
      </ul>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Step 5: Export YAML</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-3">
        When you're happy with your design:
      </p>
      <ol class="space-y-2 text-gray-600 dark:text-gray-300 mb-4 list-decimal list-inside">
        <li>Click the <strong>YAML</strong> button in the header</li>
        <li>Copy the generated YAML code</li>
        <li>Paste it into your ESPHome configuration file</li>
        <li>Deploy to your ESP32 device</li>
      </ol>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Useful Tips</h3>
      <div class="space-y-3">
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>💾 Save Your Work:</strong> Your designs are automatically saved to your browser's local storage. You can also export and import YAML files to backup your projects.
          </p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>⌨️ Keyboard Shortcuts:</strong> Use arrow keys to move selected widgets, Delete to remove them. Check the keyboard shortcuts modal for more.
          </p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>🌓 Dark Mode:</strong> Toggle dark/light mode in the top-right corner for comfortable work in any lighting condition.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📚 External Resources</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-3">
        For more in-depth information about LVGL and ESPHome integration, check these official resources:
      </p>
      <div class="space-y-2">
        <a
          href="https://esphome.io/components/lvgl/"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          <div class="font-semibold text-indigo-600 dark:text-indigo-400">ESPHome LVGL Component</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">General documentation and configuration options</div>
        </a>
        <a
          href="https://esphome.io/components/lvgl/widgets/"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          <div class="font-semibold text-indigo-600 dark:text-indigo-400">LVGL Widgets Reference</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Detailed widget properties and configuration</div>
        </a>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm text-gray-700 dark:text-gray-200">
        <strong>Next Steps:</strong> Ready to learn more? Check out the <router-link to="/help/user-guide" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">complete User Guide</router-link> for detailed feature documentation.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed
</script>
