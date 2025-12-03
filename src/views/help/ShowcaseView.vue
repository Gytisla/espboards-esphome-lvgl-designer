<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Design Showcase</h1>
      <p class="text-gray-600 dark:text-gray-400">See how designs created in the designer look on real ESP32 devices</p>
    </div>

    <!-- Smart Home Dashboard Example -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Smart Home Dashboard</h2>
        <p class="text-gray-600 dark:text-gray-400">A responsive dashboard with cards, progress bar, and action buttons</p>
      </div>

      <div class="p-6">
        <!-- Comparison Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Designer View -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">📐 Designer Preview</h3>
            <div class="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-md">
              <img 
                src="/img/design-in-designer.png" 
                alt="Design in LVGL Designer"
                class="w-full h-auto"
              />
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Live preview in the designer with full editing capabilities</p>
          </div>

          <!-- Device View -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">📱 ESP32 Display (CYD)</h3>
            <div class="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-md">
              <img 
                src="/img/rendeder-on-esphome.jpeg" 
                alt="Rendered on ESP32 CYD display"
                class="w-full h-auto"
              />
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Live on 
              <a 
                href="https://www.espboards.dev/esp32/cyd-esp32-2432s028/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                CYD ESP32-2432S028
              </a>
              device
            </p>
          </div>
        </div>

        <!-- Key Features -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">✨ Features Demonstrated</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm font-bold">✓</div>
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200">Color Export</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Colors export correctly to ESPHome (screen quality may vary)</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm font-bold">✓</div>
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200">Responsive Layout</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Layouts scale correctly to 320x240 resolution</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm font-bold">✓</div>
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200">Multiple Widgets</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">Objects, labels, buttons, cards, progress bars, and more</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm font-bold">✓</div>
              <div>
                <h4 class="font-semibold text-gray-800 dark:text-gray-200">WYSIWYG Editor</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">What you see in designer is what you get on device</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">🔧 Technical Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Device Specs</h4>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Display: 2.4" TFT LCD</li>
                <li>• Resolution: 320x240 pixels</li>
                <li>• Touch Screen: Capacitive</li>
                <li>• Microcontroller: ESP32-S3</li>
              </ul>
            </div>

            <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Export Format</h4>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Format: ESPHome YAML</li>
                <li>• Color Format: 0xRRGGBB</li>
                <li>• Framework: LVGL</li>
                <li>• Platform: ESP32 IDF</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Getting Started CTA -->
    <div class="bg-linear-to-r from-indigo-600 to-blue-600 text-white rounded-lg p-8 shadow-lg">
      <h3 class="text-2xl font-bold mb-3">Ready to Create Your Own UI?</h3>
      <p class="mb-6 opacity-90">Start designing with the visual editor and export to ESPHome in seconds</p>
      <router-link 
        to="/"
        class="inline-block bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Go to Designer →
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Showcase view component - displays real-world examples
// of designs created in the designer and deployed on devices
</script>

<style scoped>
img {
  border-radius: 0.5rem;
}
</style>
