<template>
  <div class="flex flex-1 items-start justify-center w-full self-stretch md:px-[40px]">
    <div
      class="bg-[#f8f9fc] flex flex-col items-start w-full"
      :class="mobileFullBleed ? 'p-0 rounded-none md:p-[4px] md:rounded-[12px]' : 'p-[4px] rounded-[12px]'"
      :style="{ maxWidth: width + 'px' }"
    >
      <div
        v-if="title"
        class="flex items-start gap-[16px] p-[16px] w-full"
        :class="titleCenter ? 'justify-center text-center' : 'justify-between text-left'"
      >
        <div class="flex flex-col gap-[2px]" :class="titleCenter ? 'items-center' : 'items-start'">
          <p
            class="font-medium text-[#03102f]"
            :class="titleLarge ? 'text-[18px] leading-[1.35]' : 'text-[16px] leading-[1.4]'"
          >{{ title }}</p>
          <p
            v-if="subtitle"
            class="text-[#61667c]"
            :class="titleLarge ? 'text-[14px] leading-[1.5]' : 'text-[12px] leading-[1.5]'"
          >{{ subtitle }}</p>
        </div>
        <span
          v-if="titleChip"
          class="inline-flex items-center justify-center rounded-[24px] shrink-0"
          :style="{ background: titleChip.bg, minHeight: '24px', minWidth: '32px', padding: '2px 8px' }"
        >
          <span class="text-[12px] font-medium leading-[1.5] whitespace-nowrap" :style="{ color: titleChip.color }">{{ titleChip.label }}</span>
        </span>
      </div>
      <div
        class="bg-white flex flex-col gap-[24px] items-start justify-center pt-[16px] w-full"
        :class="mobileFullBleed
          ? 'rounded-none shadow-none md:rounded-[8px] md:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06),0px_1px_0.5px_0px_rgba(0,0,0,0.06)]'
          : 'rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.06),0px_1px_0.5px_0px_rgba(0,0,0,0.06)]'"
      >
        <div class="flex flex-col gap-[16px] items-start px-[16px] w-full">
          <slot />
        </div>
        <div
          v-if="$slots.footer"
          class="flex items-center justify-between p-[16px] w-full border-t border-[#e5e6ea] bg-white"
          :class="mobileFullBleed ? 'sticky md:static bottom-0 z-10' : ''"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  titleChip: { type: Object, default: null }, // { label, bg, color }
  width: { type: Number, default: 764 },
  titleLarge: { type: Boolean, default: false },
  titleCenter: { type: Boolean, default: false },
  mobileFullBleed: { type: Boolean, default: false },
})
</script>
