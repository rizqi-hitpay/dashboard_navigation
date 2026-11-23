<template>
  <div class="flex flex-col gap-5 pb-2 w-full">
    <!-- Settings menu (Figma 6421:57327): groups 20px apart, header → list 2px -->
    <div v-for="section in sections" :key="section.header" class="flex flex-col gap-0.5 w-full">
      <!-- "Sidebar Head" -->
      <div class="flex items-center pb-1 px-2">
        <span class="section-head flex-1 min-w-0">{{ section.header }}</span>
      </div>
      <!-- "list" -->
      <div class="flex flex-col w-full">
        <div
          v-for="item in section.items"
          :key="item.label"
          class="setting-row flex items-center gap-4 px-2 py-1 cursor-pointer transition-colors duration-150"
          :class="activeItem === item.label ? 'setting-row--active' : ''"
          @click="selectSetting(item)"
        >
          <span class="setting-row__label flex-1 min-w-0 truncate text-[12px] leading-[1.5] transition-colors duration-150">{{ item.label }}</span>
          <!-- "Has Warning" -->
          <span
            v-if="item.warning"
            class="flex items-center justify-center shrink-0 size-5 rounded-[4px] bg-white"
          >
            <img :src="alertIcon" alt="Needs attention" width="14" height="14" class="size-[14px]" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import alertIcon from '../../assets/icons/sidebar-v4/alert.svg'

const router = useRouter()
const route = useRoute()

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const sections = [
  {
    header: 'Account',
    items: [
      { label: 'Business Details', warning: true },
      { label: 'Account Verification' },
      { label: 'Request for Information', warning: true },
      { label: 'Bank Accounts' },
    ],
  },
  // Not in Figma 6421:51182 — kept so the prototype's Usage / Billing pages stay reachable
  {
    header: 'Billing',
    items: [
      { label: 'Usage' },
      { label: 'Billing' },
    ],
  },
  {
    header: 'Team',
    items: [
      { label: 'Staff' },
      { label: 'Audit Logs' },
    ],
  },
  {
    header: 'Online Store',
    items: [
      { label: 'Store Settings' },
    ],
  },
  {
    header: 'Branding',
    items: [
      { label: 'Checkout Customisation' },
      { label: 'Order Form Customisation' },
    ],
  },
  {
    header: 'Communications',
    items: [
      { label: 'Email Templates' },
      { label: 'Notifications' },
    ],
  },
  {
    header: 'Tax & Fees',
    items: [
      { label: 'Taxes' },
      { label: 'Surcharges' },
    ],
  },
  {
    header: 'Partners',
    items: [
      { label: 'Partners' },
      { label: 'Platform' },
    ],
  },
]

// Highlight the item matching the current /settings/<slug> route
const activeItem = ref(null)
watch(() => route.path, (path) => {
  const match = path.match(/^\/settings\/([^/]+)/)
  const found = match && sections.flatMap((s) => s.items).find((i) => slug(i.label) === match[1])
  activeItem.value = found ? found.label : (match ? null : 'Business Details')
}, { immediate: true })

function selectSetting(item) {
  activeItem.value = item.label
  router.push('/settings/' + slug(item.label))
}
</script>

<style scoped>
/* Reddit Mono Medium 10 / 1.5, text/300 */
.section-head {
  font-family: 'Reddit Mono', ui-monospace, monospace;
  font-weight: 500;
  font-size: 10px;
  line-height: 1.5;
  color: #9295a5;
  text-transform: uppercase;
}
/* "-> Sidebar/Submenu": Default text/400, 4px radius; Hover / Active dark-blue/50tr + text/500, 8px radius */
.setting-row {
  border-radius: 4px;
}
.setting-row__label {
  color: #61667c;
}
.setting-row:hover,
.setting-row--active {
  background: rgba(0, 39, 113, 0.04);
  border-radius: 8px;
}
.setting-row:hover .setting-row__label,
.setting-row--active .setting-row__label {
  color: #03102f;
}
</style>
