<template>
  <div class="flex flex-col w-full">
    <!-- Sidebar v4 menu row (Figma 6416:16678 — "-> Sidebar/Menu") -->
    <div
      class="menu-row flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors duration-150"
      :class="active ? 'menu-row--active' : ''"
      @click="toggle"
    >
      <img
        :src="icon"
        :alt="label"
        width="14"
        height="14"
        class="shrink-0 size-[14px]"
        :style="iconTint ? { filter: TINT_61667C } : null"
      />
      <span
        class="flex-1 min-w-0 truncate text-[12px] leading-[1.5] transition-colors duration-150"
        :class="active ? 'text-[#03102f]' : 'text-[#61667c] menu-row__label'"
      >{{ label }}</span>

      <div v-if="hasTrailing" class="flex items-center gap-1 shrink-0">
        <NavBadge v-if="showNew" variant="new" />
        <NavBadge v-if="showCount" variant="count" :text="countText" />
        <NavBadge v-if="showBeta || showBetaChip" variant="beta-warning" />
        <NavBadge v-if="showNewChip" variant="new-chip" />
        <NavBadge v-if="showWarning" variant="warning" />
        <img
          v-if="expandable"
          :src="chevronIcon"
          alt="expand"
          class="w-[14px] h-[14px] transition-transform duration-200"
          :style="{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', filter: TINT_61667C }"
        />
      </div>
    </div>

    <!-- Submenu — reveals when the parent is active (animated accordion) -->
    <div
      v-if="submenuItems.length"
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :style="{ gridTemplateRows: submenuOpen ? '1fr' : '0fr' }"
    >
      <div class="overflow-hidden">
        <div class="flex flex-col">
          <div
            v-for="item in submenuItems"
            :key="item.label"
            class="sub-row relative flex items-center gap-2 pl-[28px] pr-2 py-1 rounded-lg cursor-pointer transition-colors duration-150"
            :class="activeSub === item.label ? 'sub-row--active' : ''"
            @click.stop="selectSub(item)"
          >
            <img
              v-if="activeSub === item.label"
              :src="dotIcon"
              alt=""
              width="14"
              height="14"
              class="absolute left-2 top-1/2 -translate-y-1/2 size-[14px]"
            />
            <span
              class="flex-1 min-w-0 truncate text-[12px] leading-[1.5] transition-colors duration-150 sub-row__label"
              :class="activeSub === item.label ? 'text-[#03102f]' : 'text-[#61667c]'"
            >{{ item.label }}</span>
            <div v-if="item.showBeta || item.showBetaChip || item.showCount || item.showWarning" class="flex items-center gap-1 shrink-0">
              <NavBadge v-if="item.showBeta || item.showBetaChip" variant="beta-warning" />
              <NavBadge v-if="item.showCount" variant="count" :text="item.countText || '9+'" />
              <NavBadge v-if="item.showWarning" variant="warning" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBadge from './NavBadge.vue'
import chevronIcon from '../../assets/icons/icon-chevron-right.svg'
import dotIcon from '../../assets/icons/sidebar-v4/dot.svg'

// Recolours a black / currentColor <img> icon to text/400 #61667c. Figma's own
// sidebar-v4 assets already ship in #61667c, so they opt out via iconTint=false.
const TINT_61667C = 'brightness(0) saturate(100%) invert(41%) sepia(9%) saturate(860%) hue-rotate(191deg) brightness(92%) contrast(86%)'

const props = defineProps({
  icon: { type: String, required: true },
  iconTint: { type: Boolean, default: true },
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
  showBetaChip: { type: Boolean, default: false },
  showNewChip: { type: Boolean, default: false },
  showWarning: { type: Boolean, default: false },
})

const router = useRouter()
const isOpen = ref(props.defaultOpen)

const hasTrailing = computed(() =>
  props.showNew || props.showCount || props.showBeta || props.showBetaChip ||
  props.showNewChip || props.showWarning || props.expandable
)

// Chevron items toggle on click; submenu items reveal when the parent is active.
const submenuOpen = computed(() => (props.expandable ? isOpen.value : props.active))

// Track the active sub-item locally (defaults to the flagged item, else the first).
const activeSub = ref(
  props.submenuItems.find((i) => i.active)?.label || props.submenuItems[0]?.label || null
)

// Derive a route slug from a label, e.g. "Payouts & Balances" → "payouts-balances"
function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Keep the active sub-item in sync with the route, so arriving via other
// entry points highlights correctly.
const route = useRoute()
watch(
  () => route.path,
  (path) => {
    const match = props.submenuItems.find((i) => {
      const url = i.url || '/' + slug(i.label)
      return path === url || path.startsWith(url + '/')
    })
    if (match) activeSub.value = match.label
  },
  { immediate: true }
)

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
</script>

<style scoped>
/* Default → Hover: dark-blue/50tr fill, text/500 label.
   Active: same fill + grey/100 1px stroke (inset so rows don't shift). */
.menu-row:hover,
.menu-row--active,
.sub-row:hover,
.sub-row--active {
  background: rgba(0, 39, 113, 0.04);
}
.menu-row--active {
  box-shadow: inset 0 0 0 1px #f2f2f4;
}
.menu-row:hover .menu-row__label,
.sub-row:hover .sub-row__label {
  color: #03102f;
}
</style>
