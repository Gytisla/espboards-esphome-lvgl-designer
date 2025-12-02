<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'

const router = useRouter()
const route = useRoute()

// Help pages structure
const helpPages = [
  {
    id: 'overview',
    title: 'Overview',
    icon: 'information',
    path: '/help/overview',
    description: 'Learn about ESPHome LVGL UI Builder'
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'play-circle',
    path: '/help/getting-started',
    description: 'Quick start guide for beginners'
  },
  {
    id: 'user-guide',
    title: 'User Guide',
    icon: 'book-open',
    path: '/help/user-guide',
    description: 'Complete guide to all features'
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: 'keyboard',
    path: '/help/keyboard-shortcuts',
    description: 'Quick reference for keyboard shortcuts'
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: 'help-circle',
    path: '/help/faq',
    description: 'Frequently asked questions'
  },
  {
    id: 'issues',
    title: 'Report Issues',
    icon: 'bug',
    path: '/help/issues',
    description: 'How to report bugs and submit issues'
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'wrench',
    path: '/help/troubleshooting',
    description: 'Common problems and solutions'
  },
  {
    id: 'widget-support',
    title: 'Widget Support',
    icon: 'grid',
    path: '/help/widget-support',
    description: 'Status of widget implementations'
  }
]

// Extract the current page name from the route name or path
const currentPageId = computed(() => {
  if (route.name) {
    const nameParts = String(route.name).split('-')
    return nameParts[nameParts.length - 1] || 'overview'
  }
  const pathParts = route.path.split('/')
  return pathParts[pathParts.length - 1] || 'overview'
})

function isActive(pageId: string): boolean {
  return currentPageId.value === pageId
}

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-0">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <router-link to="/" class="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 text-sm font-medium">
          <Icon icon="chevron-left" size="16" />
          Back to Designer
        </router-link>
        <div class="flex items-center gap-3">
          <Icon icon="help-circle" size="32" class="text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Help & Documentation</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Learn how to use the ESPHome LVGL UI Builder</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-2 sticky top-12">
            <button
              v-for="page in helpPages"
              :key="page.id"
              @click="navigateTo(page.path)"
              :class="[
                'w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 font-medium text-sm',
                isActive(page.id)
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              ]"
            >
              <Icon :icon="page.icon" size="18" />
              {{ page.title }}
            </button>
          </nav>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-3">
          <div class="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <!-- Page content will be inserted by router -->
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling as needed */
</style>
