<template>
  <TileFrame>
    <!-- Transfer card (blue) -->
    <div
      class="absolute flex flex-col items-center"
      style="left: 50%; top: 32px; transform: translateX(-50%); width: 112px; height: 63px; padding: 2px; gap: 4px; border-radius: 6px; background: #5469f5;"
    >
      <!-- Amount field -->
      <div
        class="relative flex items-center justify-between overflow-hidden w-full"
        style="padding: 5px 8px; border: 1px solid #5469f5; border-radius: 4px;"
      >
        <div class="absolute inset-0 bg-white" style="border-radius: 4px;"></div>
        <div class="relative overflow-hidden shrink-0" style="width: 18px; height: 12px; border-radius: 1px;">
          <img :src="flag" class="absolute inset-0 w-full h-full object-cover" alt="" />
        </div>
        <p class="relative" style="font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 16px; line-height: 1.4; color: #000;">$100</p>
        <div class="absolute inset-0 pointer-events-none" style="border-radius: 4px; box-shadow: inset 0px 2px 2px 0px rgba(0,0,0,0.16);"></div>
      </div>
      <!-- Send icon -->
      <div class="shrink-0" style="width: 20px; height: 20px;">
        <img :src="sendIcon" class="block w-full h-full" alt="" />
      </div>
    </div>

    <!-- Recipient avatar -->
    <div
      class="absolute overflow-hidden"
      style="left: 48px; top: 9px; width: 32px; height: 32px; border: 3px solid #fdfdfc; border-radius: 100px; background: #dde1e9;"
    >
      <img :src="avatar" class="absolute inset-0 w-full h-full object-cover" alt="" />
    </div>
  </TileFrame>
</template>

<script setup>
import TileFrame from './TileFrame.vue'
import flag from '../../../assets/images/intro/flag-sg.svg'
import sendIcon from '../../../assets/images/intro/send-icon.svg'
import avatar from '../../../assets/images/intro/send-avatar.png'
</script>
