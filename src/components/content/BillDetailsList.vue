<template>
  <!-- "Details" + "Invoice details" lists (Figma BillPay "Detail") — shared by the bill
       detail page and the Compare-with-original-invoice modal -->
  <div class="flex flex-col gap-[20px] w-full">
    <p class="text-[16px] font-medium text-black leading-[1.4]">Details</p>
    <dl class="flex flex-col gap-[12px] w-full">
      <div v-for="r in beneficiaryRows" :key="r.label" class="detail-row">
        <dt>{{ r.label }}</dt><dd>{{ r.value }}</dd>
      </div>
    </dl>
    <dl class="flex flex-col gap-[12px] w-full">
      <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Invoice details</p>
      <div v-for="r in invoiceRows" :key="r.label" class="detail-row">
        <dt>{{ r.label }}</dt><dd>{{ r.value }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
defineProps({
  beneficiaryRows: { type: Array, required: true }, // [{ label, value }]
  invoiceRows: { type: Array, required: true },
})
</script>

<style scoped>
.detail-row { display: flex; gap: 16px; align-items: flex-start; width: 100%; }
.detail-row dt { width: 160px; flex-shrink: 0; font-size: 14px; line-height: 1.5; color: #61667c; }
.detail-row dd { flex: 1; min-width: 0; font-size: 14px; line-height: 1.5; color: #03102f; }
</style>
