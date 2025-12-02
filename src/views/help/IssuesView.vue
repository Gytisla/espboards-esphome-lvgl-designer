<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reporting Issues</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Found a bug or have a feature request? Help us improve by reporting it on GitHub.
      </p>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📍 Where to Report Issues</h3>
      <div class="p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p class="text-sm text-gray-700 dark:text-gray-200 mb-4">
          All issues are tracked on GitHub. Click the button below to visit the repository:
        </p>
        <a
          href="https://github.com/Gytisla/espboards-esphome-lvgl-designer/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
        >
          <Icon icon="github" size="18" />
          Go to GitHub Issues
        </a>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">🐛 Reporting Bugs</h3>
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-300">
          When reporting a bug, please include the following information:
        </p>
        <div class="space-y-3">
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Description</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Clear description of the bug and what you expected to happen.
            </p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Steps to Reproduce</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Detailed steps to reproduce the issue. Include any specific widgets or settings involved.
            </p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Browser & OS</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Your browser name and version, and operating system (Windows, macOS, Linux).
            </p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Screenshots</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              If applicable, include screenshots or screen recordings showing the issue.
            </p>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">YAML/Project File</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              If relevant, attach the YAML configuration or exported project that reproduces the bug.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Feature Requests</h3>
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-300">
          Have an idea for a new feature? Please share it!
        </p>
        <div class="space-y-3">
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Use Case</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Describe what you're trying to accomplish and why you need this feature.
            </p>
          </div>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Expected Behavior</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Explain how you'd like the feature to work.
            </p>
          </div>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 rounded">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">Alternative Solutions</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              If you've considered alternatives, please describe them.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">✅ Before Reporting</h3>
      <div class="space-y-2 text-gray-600 dark:text-gray-300">
        <div class="flex items-start gap-3 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <span class="text-lg shrink-0">🔍</span>
          <span>Check if the issue already exists in the issue tracker</span>
        </div>
        <div class="flex items-start gap-3 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <span class="text-lg shrink-0">📖</span>
          <span>Read the documentation and FAQ to ensure it's not a usage question</span>
        </div>
        <div class="flex items-start gap-3 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <span class="text-lg shrink-0">🔄</span>
          <span>Try clearing your browser cache and reloading the page</span>
        </div>
        <div class="flex items-start gap-3 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <span class="text-lg shrink-0">🌐</span>
          <span>Test in a different browser if possible</span>
        </div>
        <div class="flex items-start gap-3 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <span class="text-lg shrink-0">⚙️</span>
          <span>Check the browser console for any error messages (F12 to open Developer Tools)</span>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Issue Labels</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div class="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded text-xs font-semibold">
          🐛 bug
        </div>
        <div class="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded text-xs font-semibold">
          ✨ enhancement
        </div>
        <div class="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-semibold">
          📚 documentation
        </div>
        <div class="px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded text-xs font-semibold">
          ❓ question
        </div>
        <div class="px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded text-xs font-semibold">
          ⚠️ help wanted
        </div>
        <div class="px-3 py-2 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 rounded text-xs font-semibold">
          🔄 in progress
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">❤️ Contributing</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-3">
        Thanks for helping us improve! If you want to contribute code, documentation, or translations:
      </p>
      <ol class="space-y-2 text-gray-600 dark:text-gray-300 list-decimal list-inside">
        <li>Fork the repository on GitHub</li>
        <li>Create a feature branch for your changes</li>
        <li>Make your improvements</li>
        <li>Submit a pull request with a clear description</li>
      </ol>
    </div>

    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <p class="text-sm text-gray-700 dark:text-gray-200">
          <strong>Questions?</strong> Check the <router-link to="/help/faq" class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">FAQ</router-link> or create a question issue on GitHub.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '../../components/Icon.vue'
</script>
