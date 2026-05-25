import { ref, computed } from 'vue'

export const sidebarCollapsed = ref(false)
export const sidebarHovered = ref(false)
export const sidebarPinned = ref(false)
export const sidebarExpanded = computed(() => !sidebarCollapsed.value || sidebarHovered.value || sidebarPinned.value)
