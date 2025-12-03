<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const showDialog = ref(false)
const dismissed = ref(false)

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const isSmallResolution = () => {
  // Show warning for screens smaller than 1024px width (typical tablet/small laptop size)
  return window.innerWidth < 1024
}

const handleDismiss = () => {
  dismissed.value = true
  showDialog.value = false
  localStorage.setItem('mobileDismissed', 'true')
}

const goToHelp = () => {
  showDialog.value = false
  router.push('/help/overview')
}

onMounted(() => {
  const isDismissed = localStorage.getItem('mobileDismissed') === 'true'
  const shouldShow = isMobileDevice() || isSmallResolution()
  if (shouldShow && !isDismissed) {
    showDialog.value = true
  }
})
</script>

<template>
  <!-- Mobile Warning Dialog -->
  <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-300">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
          <Icon icon="mdi:laptop" class="text-3xl text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        Best Experience on Larger Screens
      </h2>

      <!-- Description -->
      <p class="text-center text-gray-600 dark:text-gray-300 mb-6">
        The esphome LVGL Designer works best on larger screens. For the best experience with the full
        interface, toolbox, canvas, and properties panel, please use a screen with at least 1024px width.
      </p>

      <!-- Features List -->
      <div class="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-300">
        <div class="flex items-start">
          <Icon icon="mdi:check-circle" class="text-green-500 mr-2 shrink-0 mt-0.5" />
          <span>Full designer interface</span>
        </div>
        <div class="flex items-start">
          <Icon icon="mdi:check-circle" class="text-green-500 mr-2 shrink-0 mt-0.5" />
          <span>Complete toolbox and properties panel</span>
        </div>
        <div class="flex items-start">
          <Icon icon="mdi:check-circle" class="text-green-500 mr-2 shrink-0 mt-0.5" />
          <span>Keyboard shortcuts support</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          @click="goToHelp"
          class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:help-circle" class="text-lg" />
          Learn More
        </button>
        <button
          @click="handleDismiss"
          class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>
