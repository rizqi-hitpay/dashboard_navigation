<template>
  <div>
    <div
      ref="rowRef"
      class="flex items-center py-1 rounded-lg cursor-pointer transition-colors duration-150 group"
      :class="[
        active ? 'bg-white border border-[#f2f2f4]' : 'hover:bg-[rgba(0,39,113,0.04)]',
        sidebarExpanded ? 'gap-2 px-2' : 'justify-center px-0',
      ]"
      :style="active ? { boxShadow: '0px 1.5px 1.5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.06)' } : {}"
      @click="toggle"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
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

    <!-- Submenu — reveals when the parent is active (animated accordion) -->
    <div
      v-if="sidebarExpanded && submenuItems.length"
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :style="{ gridTemplateRows: submenuOpen ? '1fr' : '0fr' }"
    >
      <div class="overflow-hidden">
        <div class="flex flex-col gap-0.5 pt-0.5">
          <div
            v-for="item in submenuItems"
            :key="item.label"
            class="group/sub relative flex items-center gap-4 pl-8 pr-2 py-1 rounded cursor-pointer transition-colors duration-150"
            :class="activeSub === item.label ? '' : 'hover:bg-[rgba(0,39,113,0.04)]'"
            @click.stop="selectSub(item)"
          >
            <span
              v-if="activeSub === item.label"
              class="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-[18px] h-[18px]"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-[#2364dd]" />
            </span>
            <span
              class="flex-1 truncate text-[13px] transition-colors duration-150"
              :class="activeSub === item.label
                ? 'text-[#03102f] font-medium'
                : 'text-[#61667c] group-hover/sub:text-[#03102f]'"
            >{{ item.label }}</span>
            <div class="flex items-center gap-1 shrink-0">
              <NavBadge v-if="item.showBeta" variant="beta" />
              <NavBadge v-if="item.showCount" variant="count" :text="item.countText || '9+'" />
              <NavBadge v-if="item.showWarning" variant="warning" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsed-mode hover tooltip -->
    <NavTooltip :label="label" :anchor="rowRef" :visible="!sidebarExpanded && hovered" />
  </div>
</template>

<script setup>
import { ref, computed, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import NavBadge from './NavBadge.vue'
import NavTooltip from './NavTooltip.vue'
import chevronIcon from '../../assets/icons/icon-chevron-right.svg'
import { sidebarExpanded } from '../../composables/useSidebarCollapsed.js'

const props = defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  url: { type: String, default: '' },
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

const router = useRouter()
const isOpen = ref(props.defaultOpen)
const hovered = ref(false)
const rowRef = useTemplateRef('rowRef')

// Chevron items (e.g. Settings) toggle on click; submenu items reveal when active.
const submenuOpen = computed(() => (props.expandable ? isOpen.value : props.active))

// Track the active sub-item locally (defaults to the flagged item, else the first).
const activeSub = ref(
  props.submenuItems.find((i) => i.active)?.label || props.submenuItems[0]?.label || null
)

// Derive a route slug from a label, e.g. "Payouts & Balances" → "payouts-balances"
function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function toggle() {
  if (props.expandable) { isOpen.value = !isOpen.value; return }
  if (props.url) { router.push(props.url); return }
  if (props.submenuItems.length) return // parent category → just reveals its submenu
  router.push('/' + slug(props.label)) // leaf link → real page or "coming soon"
}

function selectSub(item) {
  activeSub.value = item.label
  router.push(item.url || '/' + slug(item.label))
}

const iconSizeClass = computed(() => props.iconSize === 'md' ? 'w-[18px] h-[18px]' : 'w-[15px] h-[15px]')
const labelSizeClass = computed(() => props.iconSize === 'md' ? 'text-[14px]' : 'text-[13px]')

const iconFilter = computed(() =>
  props.active
    ? 'invert(27%) sepia(90%) saturate(1285%) hue-rotate(200deg) brightness(95%) contrast(97%)'
    : 'invert(39%) sepia(21%) saturate(657%) hue-rotate(185deg) brightness(88%) contrast(84%)'
)
</script>
