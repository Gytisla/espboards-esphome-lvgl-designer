<script setup lang="ts">
import { Icon as IconifyIcon } from '@iconify/vue'

interface Props {
  icon: string
  size?: string | number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '1em',
  class: ''
})

// Convert icon name to Iconify format
// e.g., "menu" -> "mdi:menu", "widgets" -> "mdi:widgets"
const iconName = props.icon.startsWith('mdi:') ? props.icon : `mdi:${props.icon}`
</script>

<template>
  <IconifyIcon 
    :icon="iconName" 
    :width="size" 
    :height="size"
    :class="props.class"
  />
</template>
