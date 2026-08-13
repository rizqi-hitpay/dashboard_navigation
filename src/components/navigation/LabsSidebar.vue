<template>
  <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
    <!-- HitPay Labs sidebar (Figma: HitPay-Labs 1:11649) -->
    <!-- Title bar -->
    <div
      class="flex items-center shrink-0"
      :class="sidebarExpanded ? 'justify-between' : 'justify-center'"
      :style="{
        minHeight: '48px',
        borderBottom: '1px solid #f0f1f5',
        padding: sidebarExpanded ? '8px 16px' : '0',
      }"
    >
      <span v-if="sidebarExpanded" class="text-[14px] font-medium text-[#03102f]">HitPay Labs</span>
    </div>

    <!-- Scrollable menu -->
    <div class="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
      <!-- Category items collapse in the 2-apps preview (Figma: 1:17127) -->
      <SidebarMenuItem
        v-for="item in visibleMenuItems"
        :key="item.label"
        :icon="item.icon"
        :label="item.label"
        :url="item.url"
        :active="activeItem === item.label"
        @click="activeItem = item.label"
      />

      <!-- Starred app -->
      <template v-if="sidebarExpanded">
        <div class="pt-3 pb-1 px-2">
          <span class="text-[10px] font-medium tracking-widest uppercase" style="color: #8093b8;">Starred app</span>
        </div>
      </template>
      <div v-else class="py-2">
        <div class="h-px w-full bg-[#e5e6ea]" />
      </div>
      <SidebarMenuItem
        :icon="starIcon"
        label="To-do list"
        url="/labs/app/to-do-list"
        :active="activeItem === 'To-do list'"
        @click="activeItem = 'To-do list'"
      />

      <!-- Submit yours — outlined CTA row (Figma: 1:11791) -->
      <div class="pt-2">
        <button
          type="button"
          class="flex items-center gap-2 w-full bg-white border border-[#2465de] transition-colors duration-150 hover:bg-[#f0f4fd]"
          :class="sidebarExpanded ? 'px-2' : 'justify-center px-0'"
          style="border-radius: 6px; min-height: 28px; padding-top: 4px; padding-bottom: 4px;"
        >
          <img :src="plusLabsIcon" width="16" height="16" alt="" class="shrink-0" />
          <span v-if="sidebarExpanded" class="flex-1 text-left text-[13px] font-normal text-[#03102f] truncate">Submit yours</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SidebarMenuItem from './SidebarMenuItem.vue'
import { sidebarExpanded } from '../../composables/useSidebarCollapsed.js'
import { activeItems } from '../../composables/useSidebarActiveItem.js'
import { labsFewApps } from '../../composables/useLabsPreview.js'

import gridIcon from '../../assets/icons/icon-grid-labs.svg'
import check2Icon from '../../assets/icons/icon-check-2.svg'
import peopleIcon from '../../assets/icons/icon-people-labs.svg'
import puzzleIcon from '../../assets/icons/icon-puzzle-labs.svg'
import starIcon from '../../assets/icons/icon-star.svg'
import plusLabsIcon from '../../assets/icons/icon-plus-labs.svg'

const activeItem = activeItems.labs

const menuItems = [
  { icon: gridIcon, label: 'All apps', url: '/labs' },
  { icon: check2Icon, label: 'Productivity', url: '/labs/productivity' },
  { icon: peopleIcon, label: 'People', url: '/labs/people' },
  { icon: puzzleIcon, label: 'Others', url: '/labs/others' },
]

// With only 2 apps in the catalog there are no categories to browse
const visibleMenuItems = computed(() =>
  labsFewApps.value ? menuItems.filter((m) => m.label === 'All apps') : menuItems,
)

// Arriving at Labs (rail click or unlock) lands on the app directory;
// deep links to /labs/* keep their page and highlight the matching item
const route = useRoute()
const router = useRouter()
onMounted(() => {
  if (!route.path.startsWith('/labs')) {
    activeItem.value = 'All apps'
    router.push('/labs')
    return
  }
  if (route.path === '/labs/app/to-do-list') {
    activeItem.value = 'To-do list'
    return
  }
  const match = menuItems.find((m) => m.url === route.path)
  if (match) activeItem.value = match.label
})

</script>
