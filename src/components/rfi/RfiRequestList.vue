<template>
  <div class="flex flex-col flex-1 min-h-0 w-full bg-[#f8f9fc] rounded-[12px] p-[4px]">

    <!-- Title -->
    <div class="flex flex-col gap-[2px] items-start justify-center p-[16px] w-full shrink-0">
      <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Additional information</p>
      <p class="text-[12px] text-[#61667c] leading-[1.5]">Submit any extra documents needed for verifications</p>
    </div>

    <!-- White card with request rows -->
    <div
      class="bg-white flex flex-col flex-1 min-h-0 items-start rounded-[8px] w-full overflow-y-auto"
      style="filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.06)) drop-shadow(0px 1px 0.5px rgba(0,0,0,0.06));"
    >
      <button
        v-for="req in rfiRequests"
        :key="req.id"
        class="relative flex gap-[12px] items-start p-[12px] w-full text-left border-b border-[#e5e6ea] transition-colors duration-150 cursor-pointer"
        :class="req.unread ? 'bg-white hover:bg-[#fcfcfd]' : 'bg-[#fcfcfd] hover:bg-[#f8f9fc]'"
        @click="$emit('open', req.id)"
      >
        <!-- Avatar -->
        <img :src="avatars[req.avatar]" class="size-[48px] rounded-full object-cover shrink-0" alt="" />

        <!-- Content -->
        <div class="flex flex-col flex-1 gap-[4px] items-start min-w-0">
          <!-- Mobile: chip stacks above the title (which can wrap); desktop: inline, single line -->
          <div class="flex flex-col-reverse md:flex-row gap-[4px] md:gap-[8px] md:items-center w-full">
            <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] md:whitespace-nowrap">{{ req.title }}</p>
            <RfiStatusChip :status="req.status" />
          </div>
          <div class="flex gap-[40px] items-center w-full">
            <p class="flex-1 min-w-0 h-[16px] text-[12px] text-[#61667c] leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">{{ req.preview }}</p>
            <p
              class="text-[10px] font-medium uppercase whitespace-nowrap shrink-0"
              :style="{ letterSpacing: '0.3px', lineHeight: '18px', color: req.overdue ? '#eaa00c' : '#9295a5' }"
            >{{ req.lastUpdate }}</p>
          </div>
        </div>

        <!-- Unread dot -->
        <span
          v-if="req.unread"
          class="absolute size-[8px] rounded-full"
          style="top: 12px; right: 12px; background: #dc3545;"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { rfiRequests } from '../../composables/useRfi.js'
import RfiStatusChip from './RfiStatusChip.vue'
import avatarJohn from '../../assets/images/rfi-avatar-john.jpg'
import avatarElies from '../../assets/images/rfi-avatar-elies.jpg'

defineEmits(['open'])

const avatars = { john: avatarJohn, elies: avatarElies }
</script>
