<template>
  <!-- Full-page routes (e.g. /motion) render standalone, without the dashboard shell -->
  <router-view v-if="route.meta.fullPage" />
  <DashboardLayout v-else />
</template>

<script setup>
import { useRoute } from 'vue-router'
import DashboardLayout from './components/layout/DashboardLayout.vue'

const route = useRoute()
</script>
