<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Troubleshooting</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Solutions to common problems you might encounter while using the designer.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">🖥️ General Issues</h3>
      <div class="space-y-4">
        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Designer won't load or is blank</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Try the following:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Refresh the page (Ctrl+R or Cmd+R)</li>
            <li>Clear browser cache (Ctrl+Shift+Delete)</li>
            <li>Try a different browser</li>
            <li>Check your internet connection</li>
            <li>Open browser Developer Tools (F12) and check the Console tab for errors</li>
          </ul>
        </div>

        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Designer is running slowly</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">If performance is poor:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Close other browser tabs to free up memory</li>
            <li>Reduce the number of widgets on your canvas</li>
            <li>Split complex designs into multiple canvas tabs</li>
            <li>Try a different browser with better performance</li>
            <li>Check if your browser has extensions interfering</li>
          </ul>
        </div>

        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">My designs disappeared</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Don't panic! Try:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Check if you're using Private/Incognito mode (storage is cleared on close)</li>
            <li>Refresh the page to reload from local storage</li>
            <li>Check if you imported a different project (overwriting the current design)</li>
            <li>If lost, try to recreate from memory</li>
          </ul>
          <p class="text-xs text-orange-600 dark:text-orange-400 mt-3 font-semibold">
            💡 Always export your designs regularly as backup!
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎨 Design Issues</h3>
      <div class="space-y-4">
        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Widgets not appearing on canvas</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">If added widgets don't show up:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Check if the widget is positioned outside canvas bounds</li>
            <li>Verify the widget's width and height are greater than 0</li>
            <li>Check the Properties panel to see the widget's position</li>
            <li>The widget might be hidden behind another item - check the z-index (stacking order)</li>
            <li>Try clicking on the widget in the element tree (left sidebar)</li>
            <li>Refresh the page to redraw the canvas</li>
          </ul>
        </div>

        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Colors not displaying correctly</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Regarding color issues:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Ensure you're using valid hex format: #RRGGBB or 0xRRGGBB</li>
            <li>The preview shows colors as they'll appear on the device</li>
            <li>Note: LVGL color format might differ from standard RGB on some devices</li>
            <li>Test on your actual device to verify colors are as expected</li>
          </ul>
        </div>

        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Widget overlapping or not fitting</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">To fix layout issues:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Use the Properties panel to precisely set position and size</li>
            <li>Use Container widgets to group related elements</li>
            <li>Consider breaking large layouts into multiple screens</li>
            <li>Use the grid system: plan your layout on graph paper first</li>
            <li>The preview mode can help visualize the final layout</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📥 Import/Export Issues</h3>
      <div class="space-y-4">
        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Can't import YAML file</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">If YAML import fails:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Ensure the file is valid YAML/JSON format</li>
            <li>Check that the YAML uses the correct structure</li>
            <li>Try exporting an existing design to see the correct format</li>
            <li>Look for error messages in the import dialog</li>
            <li>Try importing a simpler file first to test</li>
          </ul>
        </div>

        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">YAML export contains errors</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">If your YAML has issues:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Validate YAML syntax using an online YAML validator</li>
            <li>Copy the YAML exactly - don't modify unless necessary</li>
            <li>Check for special characters that need escaping</li>
            <li>Report the issue if you suspect a designer bug</li>
          </ul>
        </div>

        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">YAML doesn't work in ESPHome</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">When deploying YAML:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Ensure your ESPHome version supports LVGL</li>
            <li>Check for YAML formatting issues in ESPHome logs</li>
            <li>Verify all referenced fonts and images exist</li>
            <li>Test with a simple design first</li>
            <li>Check ESPHome documentation for LVGL integration requirements</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">👆 Interaction Issues</h3>
      <div class="space-y-4">
        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Can't select a widget</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">If widget selection isn't working:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Try clicking directly on the widget on the canvas</li>
            <li>Use the element tree in the right sidebar to click the widget</li>
            <li>Check if another widget is covering it</li>
            <li>Try zooming the canvas to make the widget larger</li>
          </ul>
        </div>

        <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Drag and drop not working</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">For drag issues:</p>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
            <li>Try dragging from the center of the widget</li>
            <li>Use the Properties panel to set position instead of dragging</li>
            <li>Try a different mouse or input device</li>
            <li>Ensure no browser extensions are interfering</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">ℹ️ Still Having Issues?</h3>
      <div class="space-y-3">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>Check the FAQ:</strong> Your question might be answered in the <router-link to="/help/faq" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Frequently Asked Questions</router-link> section.
          </p>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p class="text-sm text-gray-700 dark:text-gray-200">
            <strong>Report on GitHub:</strong> If none of these solutions work, <router-link to="/help/issues" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold">report the issue on GitHub</router-link> with detailed information.
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p class="text-sm text-gray-700 dark:text-gray-200">
          <strong>💡 Pro Tip:</strong> Always keep backups of your designs by exporting them as YAML files. This ensures you never lose your work!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed
</script>
