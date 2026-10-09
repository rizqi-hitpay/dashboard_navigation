<template>
  <button
    type="button"
    class="flex items-center justify-center gap-[8px] h-[36px] min-w-[100px] px-[12px] py-[8px] rounded-[8px] border shrink-0 cursor-pointer active:translate-y-[1px] transition-transform"
    :class="variant === 'primary' ? 'border-[#2465de]' : 'border-[#f2f2f4]'"
    :style="variant === 'primary'
      ? { background: 'linear-gradient(to bottom, #4179e2, #1f5bcc)', boxShadow: '0px 1.5px 0px 0px #1d5fd9' }
      : { background: 'linear-gradient(to bottom, #ffffff, #f2f2f2)', boxShadow: '0px 1.5px 0px 0px #e5e5e5' }"
  >
    <img v-if="icon" :src="icon" width="18" height="18" alt="" class="block shrink-0" />
    <span
      class="text-[14px] font-medium leading-[1.5] whitespace-nowrap"
      :class="variant === 'primary' ? 'text-white' : 'text-[#61667c]'"
      :style="{ textShadow: variant === 'primary' ? '0px 1px 1px rgba(0,0,0,0.12)' : '0px 1px 1px rgba(0,0,0,0.08)' }"
    ><slot /></span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'secondary'
  icon: { type: String, default: '' },          // optional 18px leading icon (imported SVG URL)
})
</script>
