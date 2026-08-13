<template>
  <!-- HitPay Labs — category listing (Figma: HitPay-Labs 1:16662) -->
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="flex h-[48px] items-center px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">{{ title }}</p>
      </div>

      <!-- App grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-[24px] gap-y-[12px] w-full px-[24px] pt-[12px] pb-[24px]">
        <div
          v-for="(app, i) in apps"
          :key="i"
          class="flex items-center gap-[16px] w-full rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#fcfcfd]"
        >
          <img :src="appIconImg" width="64" height="64" alt="" class="shrink-0 rounded-[16px]" />
          <!-- Each line sits in a 20px box like the design (content block = 60px in a 64px row) -->
          <div class="flex flex-1 min-w-0 flex-col">
            <p class="flex items-center h-[20px] text-[13px] font-medium text-[#03102f] leading-[1.5] w-full whitespace-nowrap overflow-hidden text-ellipsis">{{ app.name }}</p>
            <p class="flex items-center h-[20px] text-[12px] font-normal text-[#61667c] leading-[1.5] w-full whitespace-nowrap overflow-hidden text-ellipsis">{{ app.desc }}</p>
            <p class="flex items-center h-[20px] text-[10px] font-medium uppercase text-[#61667c] tracking-[0.3px] w-full whitespace-nowrap overflow-hidden text-ellipsis" style="line-height: 18px;">By {{ app.author }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import appIconImg from '../../assets/images/labs-app-icon.png'

const route = useRoute()

const TITLES = {
  productivity: 'Productivity apps',
  people: 'People apps',
  others: 'Other apps',
  'recently-added': 'Recently added apps',
}

const title = computed(() => {
  const slug = route.params.category
  if (TITLES[slug]) return TITLES[slug]
  // Fallback: humanize the slug
  return slug ? slug.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) + ' apps' : 'Apps'
})

const apps = Array.from({ length: 6 }, () => ({
  name: 'App name here',
  desc: 'Help you organize your everyday tasks. No stress, all checked!',
  author: 'Raymond Handoko',
}))
</script>
