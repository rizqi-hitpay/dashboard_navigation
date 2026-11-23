<template>
  <div class="flex flex-col gap-3 w-full">
    <!-- Sidebar v4 "Sidemenu_Group": groups 12px apart, header → items 2px -->
    <div
      v-for="(section, i) in sections"
      :key="section.header || 'main-' + i"
      class="flex flex-col gap-0.5 w-full"
    >
      <!-- "Sidebar Head" -->
      <div v-if="section.header" class="flex items-center gap-2 pb-1 pl-2">
        <span class="section-head flex-1 min-w-0">{{ section.header }}</span>
        <NavBadge v-if="section.headerNew" variant="new-chip" />
      </div>
      <!-- "Menu Group" -->
      <div class="flex flex-col w-full">
        <SidebarMenuItem
          v-for="item in section.items"
          :key="item.id || item.label"
          :icon="item.icon"
          :icon-tint="item.iconTint !== false"
          :label="item.label"
          :url="item.url"
          :active="activeKey === (item.id || item.label)"
          :expandable="item.expandable"
          :default-open="item.defaultOpen"
          :show-new="item.showNew"
          :show-beta="item.showBeta"
          :show-beta-chip="item.showBetaChip"
          :show-new-chip="item.showNewChip"
          :submenu-items="item.submenuItems || []"
          @click="$emit('select', item)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SidebarMenuItem from './SidebarMenuItem.vue'
import NavBadge from './NavBadge.vue'

defineProps({
  sections: { type: Array, required: true },
  activeKey: { type: String, default: null },
})
defineEmits(['select'])
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
</style>
