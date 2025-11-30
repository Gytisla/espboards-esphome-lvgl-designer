<script setup lang="ts">
import type { Widget } from '../types/widget'
import Icon from './Icon.vue'
import WidgetRenderer from './WidgetRenderer.vue'

interface Props {
  widget: Widget
  onTabClick: (tabIndex: number) => void
}

const props = defineProps<Props>()
</script>

<template>
  <div class="w-full h-full bg-gray-800 rounded border border-gray-600 flex" 
    :class="{
      'flex-col': widget.tab_pos === 'TOP' || !widget.tab_pos,
      'flex-col-reverse': widget.tab_pos === 'BOTTOM',
      'flex-row': widget.tab_pos === 'LEFT',
      'flex-row-reverse': widget.tab_pos === 'RIGHT'
    }">
    <!-- Tab buttons -->
    <div class="flex bg-gray-700 border-gray-600"
      :class="{
        'flex-row border-b': widget.tab_pos === 'TOP' || !widget.tab_pos,
        'flex-row border-t': widget.tab_pos === 'BOTTOM',
        'flex-col border-r': widget.tab_pos === 'LEFT',
        'flex-col border-l': widget.tab_pos === 'RIGHT',
      }">
      <div 
        v-for="(tab, index) in (widget.tabs || [{id: '1', name: 'Tab 1', widgets: []}])" 
        :key="tab.id"
        @click="onTabClick(index)"
        class="px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer border-gray-600"
        :class="{
          'bg-gray-800 text-indigo-400': index === (widget.selectedTabIndex || 0),
          'text-gray-400 hover:text-gray-300 hover:bg-gray-750': index !== (widget.selectedTabIndex || 0),
          'border-r': (widget.tab_pos === 'TOP' || widget.tab_pos === 'BOTTOM' || !widget.tab_pos),
          'border-b': (widget.tab_pos === 'LEFT' || widget.tab_pos === 'RIGHT'),
        }">
        {{ tab.name }}
      </div>
    </div>
    
    <!-- Tab content area with nested widgets -->
    <div class="flex-1 relative overflow-hidden">
      <template v-if="widget.tabs && widget.tabs.length > 0 && widget.tabs[widget.selectedTabIndex || 0]">
        <div
          v-for="childWidget in (widget.tabs[widget.selectedTabIndex || 0]?.widgets || [])"
          :key="childWidget.id"
          class="absolute"
          :style="{
            left: childWidget.x + 'px',
            top: childWidget.y + 'px',
            width: childWidget.width !== undefined ? childWidget.width + 'px' : 'auto',
            height: childWidget.height !== undefined ? childWidget.height + 'px' : 'auto',
            zIndex: childWidget.zIndex
          }">
          <WidgetRenderer :widget="childWidget" />
        </div>
      </template>
      <div v-else class="flex items-center justify-center h-full text-xs text-gray-500">
        Empty Tab
      </div>
    </div>
  </div>
</template>
