<template>
  <!-- "Claims details" (Figma: 127:24497 in Create new, 158:94248 in Edit) — name, description,
       the selected claims and what they add up to -->
  <div class="relative flex flex-col flex-1 min-h-0">
    <!-- Empty -->
    <div v-if="!claims.length && !loading" class="flex flex-1 flex-col items-center justify-center gap-[12px] px-[24px]">
      <div class="flex flex-col items-center gap-[2px] w-[124px]">
        <span class="empty-row w-full"><img :src="emptyCircle" width="12" height="12" alt="" /><span class="empty-bar w-[90px]" /></span>
        <span class="empty-row empty-row--on w-[132px]"><img :src="emptyCheck" width="12.774" height="12.774" alt="" /><span class="empty-bar h-[8.516px] w-[95.806px]" /></span>
        <span class="empty-row w-full"><img :src="emptyCircle" width="12" height="12" alt="" /><span class="empty-bar w-[90px]" /></span>
      </div>
      <div class="flex flex-col items-center gap-[4px] text-center">
        <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Please select claims</p>
        <p class="text-[12px] text-[#61667c] leading-[1.5]">Select claims from the table and pay them afterward.</p>
      </div>
    </div>

    <!-- Details -->
    <div v-else class="flex flex-col gap-[16px] flex-1 min-h-0 overflow-y-auto px-[24px] pt-[24px]" :class="pinned ? 'pb-[88px]' : 'pb-[24px]'">
      <template v-if="!expanded">
        <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Claims details</p>
        <label class="flex flex-col gap-[4px]">
          <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Reimbursement name</span>
          <span class="field flex items-center h-[36px] px-[8px]"><input :value="name" class="field-input" @input="emit('update:name', $event.target.value)" /></span>
        </label>
        <label class="flex flex-col gap-[4px]">
          <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Description</span>
          <textarea :value="description" rows="3" placeholder="Add any notes or context for this reimbursement" class="field field-input h-[100px] p-[8px] resize-none" @input="emit('update:description', $event.target.value)" />
        </label>
      </template>

      <div class="flex flex-col gap-[8px]">
        <div class="flex items-center justify-between">
          <p :class="expanded ? 'text-[16px] text-[#03102f] leading-[1.4]' : 'text-[12px] text-[#61667c] leading-[1.5]'" class="font-medium">Selected claims ({{ claims.length }})</p>
          <button v-if="expanded" type="button" class="flex items-center gap-[8px] text-[12px] font-medium text-[#2465de] leading-[1.5]" @click="expanded = false">
            Show less <img :src="arrowDown" width="12" height="12" alt="" />
          </button>
          <!-- Edit: open the claims table to add or remove claims -->
          <button v-else-if="showEdit" type="button" class="text-[12px] font-medium text-[#2465de] leading-[1.5] hover:underline" @click="emit('edit')">Edit</button>
        </div>

        <!-- Skeleton while the first selection "loads" (Figma: 143:61468) -->
        <div v-if="loading" class="flex flex-col gap-[8px]">
          <div v-for="n in 3" :key="n" class="flex items-center gap-[16px] h-[54px] px-[8px] rounded-[8px] border border-[#e5e6ea]">
            <div class="flex flex-col gap-[8px] flex-1"><span class="skeleton h-[16px] w-[122px]" /><span class="skeleton h-[10px] w-[255px] max-w-full" /></div>
            <span class="skeleton h-[12px] w-[122px]" />
          </div>
        </div>
        <TransitionGroup v-else tag="div" name="claim-card" class="flex flex-col gap-[4px]">
          <div v-for="c in shown" :key="c.id" class="flex items-center gap-[16px] p-[8px] rounded-[8px] border border-[#e5e6ea] bg-white">
            <div class="flex flex-col gap-[4px] flex-1 min-w-0">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] truncate">{{ c.merchant }}</p>
              <p class="text-[12px] text-[#61667c] leading-[1.5] truncate">{{ c.date }} • {{ c.category }}</p>
            </div>
            <span class="text-[14px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap mono">{{ c.amount }}</span>
            <button type="button" class="flex shrink-0 rounded-[4px] transition-opacity hover:opacity-70" :aria-label="`Remove ${c.merchant}`" @click="emit('remove', c.id)">
              <img :src="removeIcon" width="16" height="16" alt="" />
            </button>
          </div>
        </TransitionGroup>
        <button v-if="!expanded && !loading && claims.length > visible" type="button" class="flex items-center justify-center gap-[8px] text-[12px] font-medium text-[#2465de] leading-[1.5]" @click="expanded = true">
          {{ claims.length - visible }} more claim{{ claims.length - visible === 1 ? '' : 's' }} <img :src="arrowDown" width="12" height="12" alt="" />
        </button>
      </div>

      <div v-if="!pinned" class="total-bar">
        <span class="flex-1 text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">Total to pay</span>
        <span class="pt-[4px] text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ currency }}</span>
        <span class="text-[24px] font-medium text-white leading-[1.35] whitespace-nowrap mono">{{ money(total) }}</span>
      </div>
    </div>

    <!-- Pinned total floats over the list's last rows (Figma: Edit › Bottom) -->
    <div v-if="pinned && (claims.length || loading)" class="total-dock absolute inset-x-0 bottom-0 p-[16px]">
      <div class="total-bar">
        <span class="flex-1 text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">Total to pay</span>
        <span class="pt-[4px] text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ currency }}</span>
        <span class="text-[24px] font-medium text-white leading-[1.35] whitespace-nowrap mono">{{ money(total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { money } from '../../composables/useFx.js'
import removeIcon from '../../assets/images/reimb-claim-remove.svg'
import arrowDown from '../../assets/images/reimb-arrow-down.svg'
import emptyCircle from '../../assets/images/reimb-empty-circle.svg'
import emptyCheck from '../../assets/images/reimb-empty-check.svg'

const props = defineProps({
  // Selected claims, in table order
  claims: { type: Array, required: true },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  total: { type: Number, default: 0 },
  currency: { type: String, default: 'SGD' },
  loading: { type: Boolean, default: false },
  // How many cards show before "N more claims"
  visible: { type: Number, default: 3 },
  // "Edit" link beside Selected claims (Edit flow, before the table is open)
  showEdit: { type: Boolean, default: false },
  // Keep the total pinned to the bottom (Edit flow); otherwise it follows the list
  pinTotal: { type: Boolean, default: false },
})
const emit = defineEmits(['update:name', 'update:description', 'remove', 'edit'])

const expanded = ref(false)
const pinned = computed(() => props.pinTotal || expanded.value)
const shown = computed(() => (expanded.value ? props.claims : props.claims.slice(0, props.visible)))

watch(() => props.claims.length, (n) => { if (n === 0) expanded.value = false })
</script>

<style scoped>
.mono { font-family: 'Reddit Mono', ui-monospace, monospace; }

/* Inputs (Figma: Input / State=Default → Focused) */
.field {
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.field:focus-within,
textarea.field:focus {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
  outline: none;
}
.field-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
textarea.field-input { background: white; border: 1px solid #e5e6ea; }
.field-input::placeholder { color: #b2b4bf; }

/* Empty state art (Figma: Select Image) */
.empty-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  background: white;
}
.empty-row--on {
  gap: 8.516px;
  padding: 6.387px;
  border: 1.065px solid #4c8afd;
  box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.12);
}
.empty-bar { height: 8px; border-radius: 12px; background: #e5e6ea; }

.skeleton {
  display: block;
  border-radius: 4px;
  background: linear-gradient(90deg, #f2f2f4 0%, #e5e6ea 50%, #f2f2f4 100%);
  background-size: 200% 100%;
  animation: skeleton-sheen 1.2s ease-in-out infinite;
}
@keyframes skeleton-sheen { from { background-position: 100% 0; } to { background-position: -100% 0; } }

.total-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #03102f;
}
.total-dock {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5));
  backdrop-filter: blur(4px);
}

/* Selected claim cards slide in/out */
.claim-card-enter-active, .claim-card-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.claim-card-enter-from, .claim-card-leave-to { opacity: 0; transform: translateX(8px); }
.claim-card-move { transition: transform 200ms ease; }

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
  .claim-card-enter-active, .claim-card-leave-active, .claim-card-move { transition: none; }
}
</style>
