<template>
  <div
    ref="scrollEl"
    class="flex md:flex-col gap-[4px] items-start w-full md:w-[280px] shrink-0 px-[16px] md:px-0 pb-0 md:pb-[24px] overflow-x-auto md:overflow-x-visible hide-scrollbar"
  >
    <button
      v-for="item in staticItems"
      :key="item"
      class="flex gap-[8px] items-center w-auto md:w-full rounded-[8px] text-left shrink-0 cursor-not-allowed"
      style="padding: 4px 8px; min-height: 29px;"
    >
      <span class="text-[14px] leading-[1.5] whitespace-nowrap md:whitespace-normal text-[#61667c]">{{ item }}</span>
    </button>

    <div class="flex flex-col gap-[0px] items-start w-auto md:w-full shrink-0">
      <button
        class="flex gap-[8px] items-center w-auto md:w-full rounded-[8px] text-left cursor-pointer transition-colors duration-150 shrink-0"
        style="padding: 4px 8px; min-height: 29px;"
        :class="active ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-[rgba(0,39,113,0.04)]'"
        @click="$emit('select-header')"
      >
        <span class="text-[14px] font-medium leading-[1.5] whitespace-nowrap text-[#002771]">Additional documents</span>
        <span
          v-if="badge === 'warning'"
          class="inline-flex items-center justify-center shrink-0 rounded-[4px] bg-[#f8f9fc]"
          style="width: 20px; height: 20px; box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2.5L1.8 11h10.4L7 2.5z" stroke="#f4b840" stroke-width="1.2" stroke-linejoin="round" fill="none"/>
            <path d="M7 6.5v2.5" stroke="#f4b840" stroke-width="1.2" stroke-linecap="round"/>
            <circle cx="7" cy="10.5" r="0.6" fill="#f4b840"/>
          </svg>
        </span>
        <span
          v-else-if="badge === 'in_review'"
          class="inline-flex items-center justify-center shrink-0 whitespace-nowrap"
          style="background: #fff9ec; min-height: 24px; min-width: 32px; padding: 2px 8px; border-radius: 24px;"
        >
          <span class="text-[12px] font-medium text-[#bd8400] leading-[1.5]">In review</span>
        </span>
      </button>

      <div v-if="showSubmenu" class="hidden md:flex flex-col gap-[4px] items-start w-full pl-[16px]">
        <div class="flex flex-col gap-[4px] items-start w-full border-l-[1.5px] border-[rgba(0,39,113,0.04)] pl-[8px] py-[4px]">
          <button
            v-for="item in subItems"
            :key="item.key"
            class="flex gap-[8px] items-center w-full rounded-[8px] text-left shrink-0"
            style="padding: 4px 8px; min-height: 29px;"
            :class="clickableSub ? 'cursor-pointer hover:bg-[rgba(0,39,113,0.04)]' : 'cursor-default'"
            @click="clickableSub && $emit('select-sub', item.key)"
          >
            <span
              class="text-[14px] leading-[1.5] whitespace-nowrap"
              :style="{ color: subActive === item.key ? '#2465de' : '#61667c' }"
            >{{ item.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  active: { type: Boolean, default: true },
  badge: { type: String, default: null }, // 'warning' | 'in_review' | null
  showSubmenu: { type: Boolean, default: false },
  clickableSub: { type: Boolean, default: false },
  subActive: { type: String, default: null },
})

defineEmits(['select-header', 'select-sub'])

const staticItems = ['Business type', 'Documents', 'Business details', 'Identity verification', 'Personnel']
const subItems = [
  { key: 'business_explanation', label: 'Business explanation' },
  { key: 'sales_report', label: 'Sales report' },
  { key: 'marketing_docs', label: 'Marketing documentation' },
]
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
