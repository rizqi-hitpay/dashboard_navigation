<template>
  <!-- Full-page routes (/login, /choose-business, /motion) render standalone;
       dashboard routes render inside DashboardLayout (a nested-route parent).
       Page swaps cross-fade (no transform, so h-screen pages never overflow
       into a scrollbar). Shared keys keep components mounted across related
       routes: the auth flow animates login ↔ business selection internally,
       and the dashboard shell persists across its child routes. -->
  <router-view v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="pageKey" />
    </Transition>
  </router-view>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageKey = computed(() => {
  if (route.meta.authFlow) return 'auth-flow'
  if (route.meta.fullPage) return route.path
  return 'dashboard'
})
</script>

<style>
/* Page swap — see /motion: fade only (enter 250ms decelerate, leave 130ms),
   opacity-only so full-height pages never spill into a scrollbar */
.page-enter-active { transition: opacity 250ms cubic-bezier(0.32, 0.72, 0, 1); }
.page-leave-active { transition: opacity 130ms ease; }
.page-enter-from,
.page-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .page-enter-active, .page-leave-active { transition: none; }
}
</style>
