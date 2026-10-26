<template>
  <!-- Prototype role switcher for Claims: full-width strip pinned above the whole dashboard -->
  <div class="flex items-center justify-center gap-[12px] h-[44px] px-[24px] w-full shrink-0 bg-[#03102f]">
    <span class="text-[12px] font-medium text-[#a6b3cd] leading-[1.5] select-none">View as</span>
    <div class="flex items-center gap-[2px] p-[2px] rounded-[8px] bg-[rgba(255,255,255,0.08)]">
      <button
        v-for="r in roles"
        :key="r.value"
        type="button"
        class="px-[12px] h-[28px] rounded-[6px] text-[12px] font-medium leading-[1.5] transition-colors duration-150"
        :class="claimsRole === r.value ? 'bg-white text-[#03102f]' : 'text-[#a6b3cd] hover:text-white hover:bg-[rgba(255,255,255,0.08)]'"
        @click="setRole(r.value)"
      >{{ r.label }}</button>
    </div>
  </div>
</template>

<script setup>
import { claimsRole } from '../../composables/useClaimsRole.js'

const roles = [
  { value: 'employee', label: 'Employee' },
  { value: 'admin', label: 'Admin' },
]

function setRole(role) {
  claimsRole.value = role
}
</script>
