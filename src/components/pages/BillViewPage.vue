<template>
  <!-- Bill detail — revamped design, with the previous version kept for comparison -->
  <Transition name="view-fade" mode="out-in">
    <component :is="useNewDesign ? BillViewPageNew : BillViewPageOld" :key="useNewDesign ? 'new' : 'old'" />
  </Transition>

  <!-- Floating preview switcher: new design ↔ old design -->
  <div
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-[4px] p-[4px] rounded-full bg-white border border-[#e5e6ea]"
    style="box-shadow: 0px 8px 24px rgba(3,16,47,0.16);"
  >
    <span class="px-[8px] text-[11px] font-medium text-[#8093b8] select-none">Preview</span>
    <button
      type="button"
      class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
      :class="useNewDesign ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
      @click="useNewDesign = true"
    >New design</button>
    <button
      type="button"
      class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
      :class="!useNewDesign ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
      @click="useNewDesign = false"
    >Old design</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BillViewPageNew from './BillViewPageNew.vue'
import BillViewPageOld from './BillViewPageOld.vue'

// Preview switcher: true = revamped detail page, false = previous version
const useNewDesign = ref(true)
</script>

<style scoped>
/* New ↔ old design swap (matches the bills-list switcher motion) */
.view-fade-enter-active { transition: opacity 220ms ease-out, transform 220ms ease-out; }
.view-fade-leave-active { transition: opacity 130ms ease-in, transform 130ms ease-in; }
.view-fade-enter-from { opacity: 0; transform: translateY(8px); }
.view-fade-leave-to { opacity: 0; transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) {
  .view-fade-enter-active, .view-fade-leave-active { transition: none; }
  .view-fade-enter-from, .view-fade-leave-to { transform: none; }
}
</style>
