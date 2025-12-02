<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">About ESPHome LVGL UI Builder</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        ESPHome LVGL UI Builder is a visual designer for creating beautiful, interactive user interfaces for ESP32 devices running ESPHome with LVGL (Light and Versatile Graphics Library).
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">What is LVGL?</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-2">
        LVGL is a free and open-source embedded graphics library that provides a wide range of UI widgets, themes, and responsive design capabilities suitable for devices with limited resources.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Learn more at <a href="https://lvgl.io" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">lvgl.io</a>
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        <strong>ESPHome Integration:</strong> ESPHome provides excellent LVGL component support. Check the official documentation:
      </p>
      <ul class="space-y-2 mt-2 text-sm">
        <li>
          <a href="https://esphome.io/components/lvgl/" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2">
            <span>📖 ESPHome LVGL Component</span>
            <span class="text-xs">(General documentation)</span>
          </a>
        </li>
        <li>
          <a href="https://esphome.io/components/lvgl/widgets/" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2">
            <span>🎨 LVGL Widgets Reference</span>
            <span class="text-xs">(All available widgets and properties)</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎨 Visual Designer</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Drag-and-drop interface to create complex UI layouts without coding.
          </p>
        </div>
        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📦 Widget Library</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Comprehensive set of LVGL widgets including buttons, sliders, gauges, and more.
          </p>
        </div>
        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📋 YAML Export</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Generate YAML configuration ready for ESPHome integration.
          </p>
        </div>
        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">👁️ Live Preview</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Interactive preview mode to test your UI layouts in real-time.
          </p>
        </div>
        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">💾 Save & Load</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Save your projects locally and import existing YAML configurations.
          </p>
        </div>
        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🌓 Dark/Light Theme</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Comfortable design with support for both dark and light modes.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">System Requirements</h3>
      <ul class="space-y-2 text-gray-600 dark:text-gray-300">
        <li class="flex items-start gap-2">
          <span class="text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
          <span>Modern web browser (Chrome, Firefox, Safari, Edge)</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
          <span>ESP32 device with ESPHome and LVGL support</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
          <span>Basic understanding of ESPHome configuration</span>
        </li>
      </ul>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Getting Help</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        If you need help or have questions:
      </p>
      <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <li>📚 Check our <router-link to="/help/user-guide" class="text-indigo-600 dark:text-indigo-400 hover:underline">User Guide</router-link></li>
        <li>❓ Visit our <router-link to="/help/faq" class="text-indigo-600 dark:text-indigo-400 hover:underline">FAQ</router-link> section</li>
        <li>🐛 <router-link to="/help/issues" class="text-indigo-600 dark:text-indigo-400 hover:underline">Report issues</router-link> on GitHub</li>
        <li>🔧 Try our <router-link to="/help/troubleshooting" class="text-indigo-600 dark:text-indigo-400 hover:underline">Troubleshooting</router-link> guide</li>
      </ul>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Support the Project</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        If you enjoy using ESPHome LVGL UI Builder and would like to support its development, consider buying us a coffee! ☕
      </p>
      <div class="flex justify-center py-2">
        <a href="https://www.buymeacoffee.com/espboards" target="_blank" rel="noopener noreferrer" class="inline-block hover:opacity-90 transition-opacity">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px; width: auto;" />
        </a>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        Your support helps us maintain and improve the tool! 🙏
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for overview page
</script>
