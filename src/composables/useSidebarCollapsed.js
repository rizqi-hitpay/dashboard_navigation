import { ref, computed } from 'vue'

export const sidebarCollapsed = ref(false)
export const sidebarHovered = ref(false)
export const sidebarPinned = ref(false)
// Collapsed sidebar now shows icon-only items with hover tooltips (see NavTooltip)
// instead of expanding on hover, so expansion tracks the collapsed flag only.
export const sidebarExpanded = computed(() => !sidebarCollapsed.value)
