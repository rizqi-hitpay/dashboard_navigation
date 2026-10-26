<template>
  <!-- Pick claims for a reimbursement (Figma: Select claims, used by Create new and Edit) -->
  <div class="flex flex-col gap-[16px] flex-1 min-w-0 pt-[24px] px-[24px] overflow-y-auto">
    <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ title }}</p>
    <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-x-auto mb-[24px]">
      <table class="w-full border-collapse min-w-[560px]" style="table-layout: fixed;">
        <colgroup>
          <col style="width: 32px;" /><col style="width: 112px;" /><col /><col style="width: 132px;" /><col style="width: 140px;" /><col />
        </colgroup>
        <thead>
          <tr>
            <th class="th p-[8px]">
              <button type="button" class="checkbox" :class="{ 'is-on': allSelected, 'is-partial': partial }" role="checkbox" :aria-checked="allSelected ? 'true' : partial ? 'mixed' : 'false'" aria-label="Select all claims" @click="toggleAll">
                <img v-if="allSelected" :src="checkWhite" width="10" height="10" alt="" />
                <img v-else-if="partial" :src="checkPartial" width="8" height="1" alt="" class="mt-[1px]" />
              </button>
            </th>
            <th v-for="col in COLS" :key="col" class="th px-[12px] py-[8px] text-left">
              <span class="flex items-center gap-[8px]">
                <span class="flex-1 text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f]">{{ col }}</span>
                <svg v-if="col !== 'Description'" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.9v8.2M3.8 7.9L7 11.1l3.2-3.2" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in claims" :key="c.id" class="cursor-pointer transition-colors duration-150 hover:bg-[#fcfcfd] [&:last-child>td]:border-b-0" @click="toggle(c.id)">
            <td class="td px-[4px]">
              <span class="checkbox mx-auto" :class="{ 'is-on': isSelected(c.id) }" role="checkbox" :aria-checked="isSelected(c.id)" :aria-label="`Select ${c.merchant}`">
                <img v-if="isSelected(c.id)" :src="checkWhite" width="10" height="10" alt="" />
              </span>
            </td>
            <td class="td px-[12px]"><span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap mono">{{ c.date }}</span></td>
            <td class="td px-[12px]"><p class="text-[13px] text-[#03102f] leading-[1.5] truncate">{{ c.merchant }}</p></td>
            <td class="td px-[12px]">
              <span class="flex items-center gap-[4px]">
                <img v-if="c.fx" :src="exchangeIcon" width="16" height="16" alt="Foreign currency" class="shrink-0" />
                <span class="flex-1 text-right text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap mono">{{ c.amount }}</span>
              </span>
            </td>
            <td class="td px-[12px]"><span class="category-chip">{{ c.category }}</span></td>
            <td class="td px-[12px] !border-r-0"><p class="text-[13px] text-[#03102f] leading-[1.5] truncate">{{ c.description }}</p></td>
          </tr>
          <tr v-if="!claims.length">
            <td colspan="6" class="py-[32px] text-center text-[14px] text-[#61667c]">{{ emptyText }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import checkWhite from '../../assets/images/reimb-check-white.svg'
import checkPartial from '../../assets/images/reimb-check-partial.svg'
import exchangeIcon from '../../assets/icons/icon-exchange.svg'

const props = defineProps({
  title: { type: String, required: true },
  claims: { type: Array, required: true },
  // Selected claim ids
  modelValue: { type: Array, required: true },
  emptyText: { type: String, default: 'No approved claims waiting to be paid.' },
})
const emit = defineEmits(['update:modelValue'])

const COLS = ['Date', 'Merchant', 'Amount', 'Category', 'Description']

const isSelected = (id) => props.modelValue.includes(id)
const allSelected = computed(() => props.claims.length > 0 && props.claims.every((c) => isSelected(c.id)))
// Some but not all rows ticked (Figma: Checkbox / State=Partial)
const partial = computed(() => !allSelected.value && props.claims.some((c) => isSelected(c.id)))

function toggle(id) {
  emit('update:modelValue', isSelected(id) ? props.modelValue.filter((x) => x !== id) : [...props.modelValue, id])
}
function toggleAll() {
  emit('update:modelValue', allSelected.value ? [] : props.claims.map((c) => c.id))
}
</script>

<style scoped>
.mono { font-family: 'Reddit Mono', ui-monospace, monospace; }
.th {
  height: 34px;
  background: #fcfcfd;
  border-bottom: 0.5px solid #cbcdd4;
  border-right: 1px solid #e5e6ea;
  vertical-align: middle;
}
.th:last-child { border-right: none; }
.td {
  height: 44px;
  border-bottom: 1px solid #e5e6ea;
  border-right: 1px solid #e5e6ea;
  vertical-align: middle;
  overflow: hidden;
}
.category-chip {
  display: inline-block;
  max-width: 100%;
  min-height: 24px;
  padding: 2px 8px;
  border: 1px solid #cbcdd4;
  border-radius: 24px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #e5e6ea;
  background: white;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: background-color 150ms ease, border-color 150ms ease;
}
.checkbox.is-on { background: #2465de; border-color: #2465de; }
.checkbox.is-partial { background: #ccdefe; border-color: #2465de; box-shadow: none; }
</style>
