<template>
  <span
    class="inline-flex items-center justify-center shrink-0"
    :style="{
      background: meta.bg,
      minHeight: '24px',
      minWidth: '32px',
      padding: '2px 8px',
      borderRadius: '24px',
      gap: '4px',
    }"
  >
    <img v-if="icon" :src="icon" width="16" height="16" alt="" />
    <span class="text-[12px] font-medium leading-[1.5] whitespace-nowrap" :style="{ color: meta.color }">{{ meta.label }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { RFI_STATUS } from '../../composables/useRfi.js'
import loadingIcon from '../../assets/icons/rfi-status-loading.svg'
import docCheckIcon from '../../assets/icons/rfi-status-doc-check.svg'
import xIcon from '../../assets/icons/rfi-status-x.svg'
import checkIcon from '../../assets/icons/rfi-status-check.svg'

const props = defineProps({
  status: { type: String, required: true },
})

const icons = { loading: loadingIcon, 'doc-check': docCheckIcon, x: xIcon, check: checkIcon }

const meta = computed(() => RFI_STATUS[props.status])
const icon = computed(() => icons[meta.value.icon])
</script>
