<template>
  <div>
    <div
      class="flex items-center py-1 rounded-lg cursor-pointer transition-colors duration-150 group"
      :class="[
        active ? 'bg-white border border-[#f2f2f4]' : 'hover:bg-[rgba(0,39,113,0.04)]',
        sidebarExpanded ? 'gap-2 px-2' : 'justify-center px-0',
      ]"
      :style="active ? { boxShadow: '0px 1.5px 1.5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.06)' } : {}"
      @click="toggle"
    >
      <img
        :src="icon"
        :alt="label"
        class="shrink-0"
        :class="iconSizeClass"
        :style="{ color: active ? '#2364dd' : '#4c689c', filter: iconFilter }"
      />
      <template v-if="sidebarExpanded">
        <span
          class="flex-1 truncate"
          :class="[
            labelSizeClass,
            active ? 'text-[#03102f] font-medium' : 'text-[#03102f]'
          ]"
        >{{ label }}</span>

        <div class="flex items-center gap-1 shrink-0">
          <NavBadge v-if="showNew" variant="new" />
          <NavBadge v-if="showCount" variant="count" :text="countText" />
          <NavBadge v-if="showBeta" variant="beta" />
          <NavBadge v-if="showWarning" variant="warning" />
          <img
            v-if="expandable"
            :src="chevronIcon"
            alt="expand"
            class="w-[18px] h-[18px] transition-transform duration-200"
            :style="{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', filter: 'invert(39%) sepia(21%) saturate(657%) hue-rotate(185deg) brightness(88%) contrast(84%)' }"
          />
        </div>
      </template>
    </div>

    <div v-if="sidebarExpanded && expandable && isOpen && submenuItems.length" class="mt-0.5">
      <div
        v-for="item in submenuItems"
        :key="item.label"
        class="flex items-center gap-2 cursor-pointer rounded transition-colors duration-150 hover:bg-white/60"
        style="padding: 4px 8px 4px 38px;"
      >
        <span class="flex-1 text-[14px] text-[#61667c] truncate">{{ item.label }}</span>
        <div class="flex items-center gap-1 shrink-0">
          <NavBadge v-if="item.showBeta" variant="beta" />
          <NavBadge v-if="item.showCount" variant="count" :text="item.countText || '9+'" />
          <NavBadge v-if="item.showWarning" variant="warning" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBadge from './NavBadge.vue'
import chevronIcon from '../../assets/icons/icon-chevron-right.svg'
import { sidebarExpanded } from '../../composables/useSidebarCollapsed.js'

const props = defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  expandable: { type: Boolean, default: false },
  defaultOpen: { type: Boolean, default: false },
  submenuItems: { type: Array, default: () => [] },
  showNew: { type: Boolean, default: false },
  showCount: { type: Boolean, default: false },
  countText: { type: String, default: '9+' },
  showBeta: { type: Boolean, default: false },
  showWarning: { type: Boolean, default: false },
  iconSize: { type: String, default: 'sm' },
})

const isOpen = ref(props.defaultOpen)
function toggle() {
  if (props.expandable) isOpen.value = !isOpen.value
}

const iconSizeClass = computed(() => props.iconSize === 'md' ? 'w-[18px] h-[18px]' : 'w-[15px] h-[15px]')
const labelSizeClass = computed(() => props.iconSize === 'md' ? 'text-[14px]' : 'text-[13px]')

const iconFilter = computed(() =>
  props.active
    ? 'invert(27%) sepia(90%) saturate(1285%) hue-rotate(200deg) brightness(95%) contrast(97%)'
    : 'invert(39%) sepia(21%) saturate(657%) hue-rotate(185deg) brightness(88%) contrast(84%)'
)
</script>
