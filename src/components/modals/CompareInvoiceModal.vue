<template>
  <!-- Compare with original invoice (Figma BillPay 15118:555060): the bill as entered (left)
       next to the uploaded invoice (right). BaseModal gives the shared backdrop + card rise. -->
  <BaseModal :open="open" :width="1132" :radius="8" @close="$emit('close')">
    <template #header>
      <div class="flex items-center justify-between px-[16px] py-[8px] border-b border-[#e5e6ea] bg-white">
        <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Compare with original invoice</p>
        <button type="button" class="flex items-center gap-[6px] h-[28px] px-[8px] rounded-[8px] hover:bg-[#f5f6f9] transition-colors duration-150" @click="$emit('close')">
          <img :src="closeIcon" width="16" height="16" alt="" />
          <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Close</span>
        </button>
      </div>
    </template>

    <div class="flex w-full h-[690px] max-h-[calc(100vh-108px)] bg-[#fcfcfd]">
      <!-- Left: what was entered -->
      <div class="flex flex-1 min-w-0 flex-col gap-[12px] px-[40px] py-[24px] overflow-y-auto bg-white border-r border-[#e5e6ea]">
        <BillAmountSummary v-bind="summary" />
        <span class="separator" aria-hidden="true" />
        <BillDetailsList :beneficiary-rows="beneficiaryRows" :invoice-rows="invoiceRows" />
      </div>

      <!-- Right: original invoice viewer -->
      <div class="relative flex flex-1 min-w-0 flex-col">
        <div class="flex items-center justify-between h-[38px] px-[16px] py-[4px] shrink-0 bg-white border-b border-[#e5e6ea] relative">
          <div class="flex items-center gap-[8px]">
            <button type="button" class="viewer-btn" aria-label="Document settings"><img :src="docSettingsIcon" width="22" height="22" alt="" /></button>
          </div>
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-[8px]">
            <button type="button" class="viewer-btn" :disabled="zoom <= 50" aria-label="Zoom out" @click="zoom = Math.max(50, zoom - 10)"><img :src="minusIcon" width="22" height="22" alt="" /></button>
            <span class="w-[36px] text-center text-[13px] font-medium text-[#03102f] leading-[1.5]">{{ zoom }}%</span>
            <button type="button" class="viewer-btn" :disabled="zoom >= 200" aria-label="Zoom in" @click="zoom = Math.min(200, zoom + 10)"><img :src="plusIcon" width="22" height="22" alt="" /></button>
          </div>
          <button type="button" class="viewer-btn" aria-label="Download invoice"><img :src="downloadIcon" width="22" height="22" alt="" /></button>
        </div>
        <div class="flex-1 min-h-0 overflow-auto">
          <div class="flex justify-center px-[40px] pt-[18px] pb-[24px]">
            <img
              :src="invoiceImg"
              :alt="`Original invoice ${invoiceName}`"
              class="block bg-white shrink-0 max-w-none transition-[width] duration-200 ease-out"
              style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
              :style="{ width: (449 * zoom) / 100 + 'px' }"
            />
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import BillAmountSummary from '../content/BillAmountSummary.vue'
import BillDetailsList from '../content/BillDetailsList.vue'
import invoiceImg from '../../assets/images/billreview/invoice.png'
import closeIcon from '../../assets/icons/bill-detail/close-x.svg'
import docSettingsIcon from '../../assets/icons/bill-detail/doc-settings.svg'
import downloadIcon from '../../assets/icons/bill-detail/download-2.svg'
import minusIcon from '../../assets/icons/bill-detail/minus-circle.svg'
import plusIcon from '../../assets/icons/bill-detail/plus-circle.svg'

const props = defineProps({
  open: { type: Boolean, default: false },
  summary: { type: Object, required: true },        // BillAmountSummary props
  beneficiaryRows: { type: Array, required: true },
  invoiceRows: { type: Array, required: true },
  invoiceName: { type: String, default: '' },
})
defineEmits(['close'])

const zoom = ref(100)
watch(() => props.open, (o) => { if (o) zoom.value = 100 })
</script>

<style scoped>
.separator { display: block; width: 100%; height: 16px; flex-shrink: 0; background: linear-gradient(#e5e6ea, #e5e6ea) center / 100% 1px no-repeat; }
.viewer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 150ms ease, opacity 150ms ease;
}
.viewer-btn:hover:not(:disabled) { background: #f0f1f5; }
.viewer-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
