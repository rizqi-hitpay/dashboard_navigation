<template>
  <div class="flex flex-col h-full w-[220px] bg-[#fcfcfd]">
    <!-- Title (Figma: 47:8181) -->
    <div class="flex items-center gap-[8px] h-[48px] shrink-0 px-[16px] border-b border-[#f2f2f4]">
      <span class="flex-1 text-[14px] font-medium leading-[1.5] text-[#03102f] truncate">HitPay Studio</span>
      <button
        class="flex items-center justify-center size-[24px] rounded-[4px] transition-colors duration-150 hover:bg-[#f0f1f5]"
        aria-label="Studio settings"
      >
        <img :src="settingGearIcon" alt="" class="size-[16px]" />
      </button>
    </div>

    <!-- Main menu (Figma: 47:8185) -->
    <div class="flex-1 min-h-0 overflow-y-auto p-[8px]">
      <div class="flex flex-col gap-[16px]">
        <button
          class="flex items-center gap-[8px] w-full px-[8px] py-[4px] rounded-[8px] transition-colors duration-150"
          :class="newAppActive
            ? 'bg-white border border-[#f2f2f4]'
            : 'border border-transparent hover:bg-[#f0f1f5]'"
          :style="newAppActive
            ? { filter: 'drop-shadow(0px 1px 5px rgba(0,0,0,0.06)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.04))' }
            : {}"
          @click="emit('new-app')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.33333 13.3333C7.33333 13.7015 7.6318 14 8 14C8.3682 14 8.66667 13.7015 8.66667 13.3333V8.66667H13.3333C13.7015 8.66667 14 8.3682 14 8C14 7.6318 13.7015 7.33333 13.3333 7.33333H8.66667V2.66667C8.66667 2.29848 8.3682 2 8 2C7.6318 2 7.33333 2.29848 7.33333 2.66667V7.33333H2.66667C2.29848 7.33333 2 7.6318 2 8C2 8.3682 2.29848 8.66667 2.66667 8.66667H7.33333V13.3333Z" fill="#61667C"/>
          </svg>
          <span class="flex-1 text-left text-[13px] font-medium leading-[1.5] text-[#03102f]">New app</span>
        </button>

        <div v-if="apps.length" class="flex flex-col">
          <div class="pl-[8px] pb-[4px]">
            <span class="text-[12px] font-medium leading-[1.5] text-[#8093b8]" style="font-family: 'Reddit Mono', monospace;">YOUR APP</span>
          </div>
          <div class="flex flex-col gap-[4px]">
            <button
              v-for="app in apps"
              :key="app.id"
              class="flex items-center gap-[8px] w-full px-[8px] py-[4px] rounded-[8px] transition-colors duration-150"
              :class="app.id === activeAppId
                ? 'bg-white border border-[#f2f2f4]'
                : 'border border-transparent hover:bg-[#f0f1f5]'"
              :style="app.id === activeAppId
                ? { filter: 'drop-shadow(0px 1px 5px rgba(0,0,0,0.06)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.04))' }
                : {}"
              @click="emit('select-app', app)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="2.66667" :fill="app.id === activeAppId ? '#2465DE' : '#4C689C'"/>
              </svg>
              <span class="flex-1 text-left text-[13px] leading-[1.5] text-[#03102f] truncate">{{ app.title }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Location + Account (Figma: 47:8275) -->
    <div class="flex items-center gap-[8px] h-[48px] shrink-0 px-[8px] border-t border-[#e5e6ea] bg-[#fcfcfd]">
      <div class="flex items-center justify-center size-[32px] rounded-[5px] bg-[#343848] shrink-0 overflow-hidden">
        <span class="text-[14px] font-medium text-white" style="text-shadow: 0px 0.5px 0.5px rgba(0,0,0,0.06);">C</span>
      </div>
      <div class="flex-1 min-w-0 flex flex-col justify-center">
        <span class="text-[13px] leading-[1.5] text-[#03102f] truncate">My Cat Shop</span>
        <span class="text-[12px] leading-[1.5] text-[#61667c] truncate">Cherry Test QA</span>
      </div>
      <img
        :src="arrowUpDownIcon"
        alt=""
        class="size-[16px] shrink-0"
        style="filter: invert(38%) sepia(7%) saturate(1126%) hue-rotate(192deg) brightness(101%) contrast(88%);"
      />
    </div>
  </div>
</template>

<script setup>
import settingGearIcon from '../../assets/icons/icon-setting-gear.svg'
import arrowUpDownIcon from '../../assets/icons/icon-arrow-up-down.svg'

defineProps({
  apps: { type: Array, default: () => [] },
  activeAppId: { type: [Number, String], default: null },
  newAppActive: { type: Boolean, default: false },
})

const emit = defineEmits(['new-app', 'select-app'])
</script>
