<template>
  <!-- Uploaded invoice preview + zoom bar (Figma 42:11478 / 42:12409).
       Rendered ONCE by UploadBillFlow over the steps' left column, so it never re-mounts
       when moving between Bill details and Review — the invoice stays perfectly still. -->
  <section class="flex flex-col h-full min-h-0 bg-[#fcfcfd]">
    <div class="flex-1 min-h-0 overflow-auto">
      <div class="flex justify-center px-[24px] pt-[24px] pb-[24px]">
        <img
          :src="invoiceImg"
          alt="Uploaded invoice preview"
          class="block bg-white shrink-0 transition-[width] duration-200 ease-out"
          style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
          :style="{ width: (432 * zoom) / 100 + 'px' }"
        />
      </div>
    </div>
    <div class="flex items-center justify-center gap-[8px] py-[8px] h-[68px] shrink-0 bg-white border-t border-[#e5e6ea]">
      <div class="flex items-center gap-[8px] h-[36px] px-[4px] rounded-[8px] border border-[#e5e6ea] bg-white" style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);">
        <button type="button" class="zoom-btn" :disabled="zoom <= ZOOM_MIN" aria-label="Zoom out" @click="zoom = Math.max(ZOOM_MIN, zoom - 10)">
          <img :src="zoomOutIcon" width="16" height="16" alt="" />
        </button>
        <span class="min-w-[44px] text-center text-[14px] text-[#03102f] leading-[1.5]">{{ zoom }}%</span>
        <button type="button" class="zoom-btn" :disabled="zoom >= ZOOM_MAX" aria-label="Zoom in" @click="zoom = Math.min(ZOOM_MAX, zoom + 10)">
          <img :src="zoomInIcon" width="16" height="16" alt="" />
        </button>
      </div>
      <!-- Remove only on Bill details (the step that owns the upload) -->
      <Transition name="remove-fade">
        <button
          v-if="canRemove"
          type="button"
          class="flex items-center gap-[6px] h-[28px] px-[8px] rounded-[8px] hover:bg-[#f5f6f9] transition-colors duration-150"
          @click="$emit('remove')"
        >
          <img :src="binIcon" width="16" height="16" alt="" />
          <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Remove</span>
        </button>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import invoiceImg from '../../assets/images/billreview/invoice.png'
import zoomInIcon from '../../assets/icons/upload-bill/zoom-in.svg'
import zoomOutIcon from '../../assets/icons/upload-bill/zoom-out.svg'
import binIcon from '../../assets/icons/upload-bill/bin.svg'
import { flowZoom as zoom } from '../../composables/useUploadBillFlow.js'

defineProps({ canRemove: { type: Boolean, default: false } })
defineEmits(['remove'])

const ZOOM_MIN = 50
const ZOOM_MAX = 200
</script>

<style scoped>
.zoom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  transition: filter 150ms ease;
}
.zoom-btn:hover:not(:disabled) { filter: brightness(0.96); }
.zoom-btn:active:not(:disabled) { transform: translateY(1px); }
.zoom-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.remove-fade-enter-active { transition: opacity 160ms ease-out; }
.remove-fade-leave-active { transition: opacity 100ms ease-in; }
.remove-fade-enter-from, .remove-fade-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .remove-fade-enter-active, .remove-fade-leave-active { transition: none; }
}
</style>
