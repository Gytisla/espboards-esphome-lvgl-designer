<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Find answers to common questions about the ESPHome LVGL UI Builder.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ What is the difference between this designer and coding LVGL directly?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          This visual designer makes it much easier to create UI layouts without writing code. You can drag and drop widgets, see your changes in real-time, and generate YAML configuration automatically. It's perfect for non-technical users or rapid prototyping.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Can I edit the generated YAML manually?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Yes! The generated YAML is standard ESPHome format. You can edit it manually and then import it back into the designer. The designer will preserve your manual edits if you re-import the YAML.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Is my design data stored on a server?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          No, all your designs are stored locally in your browser's storage. Nothing is sent to any server. Your data is always under your control.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ What happens if I clear my browser history or cookies?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Your designs will be lost if you clear browser data. We recommend exporting your designs as YAML files regularly as a backup. You can always re-import them later.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Can I create multiple screens or pages?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Yes! Use canvas tabs to create multiple screens. Each tab can have a different layout. When you export to YAML, all screens are included in the configuration.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ What screen sizes are supported?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Any size! The default is 240×320 pixels, but you can change the canvas dimensions to match your ESP32 display. Common sizes include 480×320 (TFT_eSPI), 800×480 (larger displays), and 128×64 (OLED displays).
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Which widgets support custom properties?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Most widgets support customization. Buttons, sliders, switches, and other interactive elements have specific properties. Container widgets can group other widgets together. Check the properties panel when you select a widget to see all available options.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ How do I use colors in the designer?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          You can use either a color picker (click the colored square) or enter color values directly. Supports both hex format (#RRGGBB) and LVGL format (0xRRGGBB). The preview shows colors exactly as they'll appear.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Can I import a YAML file from an existing ESPHome project?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          If the YAML is in the LVGL format, yes! Click the Import button and select your YAML file. The designer will load the configuration and you can continue editing visually.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Does the designer work offline?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Yes! The designer is a web application that works entirely in your browser. Once loaded, it doesn't require an internet connection to function.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ What browsers are supported?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          The designer works on all modern browsers: Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Can I use custom fonts?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Font support depends on your LVGL setup in ESPHome. The designer generates standard YAML that supports any fonts configured in your ESPHome instance.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ Is there a size limit for designs?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          There's no strict limit, but keep in mind that ESP32 devices have limited memory. The complexity of your UI should match your device's capabilities. Test on your target device to ensure it runs smoothly.
        </p>
      </div>

      <div>
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2 text-lg">❓ How do I handle interactions and callbacks?</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Currently, the designer focuses on layout and styling. For complex interactions and event handling, you'll need to add logic to your ESPHome YAML configuration manually. The designer generates the UI structure which you can then enhance with automation.
        </p>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📚 External Resources</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-3">
        For more information about LVGL widgets, ESPHome integration, and configuration options:
      </p>
      <div class="space-y-2">
        <a
          href="https://esphome.io/components/lvgl/"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          <div class="font-semibold text-indigo-600 dark:text-indigo-400">ESPHome LVGL Component Documentation</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Official ESPHome LVGL integration guide</div>
        </a>
        <a
          href="https://esphome.io/components/lvgl/widgets/"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
        >
          <div class="font-semibold text-indigo-600 dark:text-indigo-400">LVGL Widget Properties Reference</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Complete widget and property documentation</div>
        </a>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p class="text-sm text-gray-700 dark:text-gray-200">
          <strong>Didn't find your answer?</strong> Check the <router-link to="/help/troubleshooting" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Troubleshooting</router-link> guide or <router-link to="/help/issues" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">report an issue</router-link> on GitHub.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed
</script>
