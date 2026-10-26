<template>
  <!-- Edit reimbursement (Figma: Reimbursement - Edit, 158:96695) — covers the detail page;
       opens on the details form, "Edit" brings in the recipient's claims table -->
  <div class="absolute inset-0 z-30 bg-white flex flex-col overflow-hidden" role="dialog" aria-label="Edit reimbursement">

    <!-- Header (Figma: Header/Add or Edit) -->
    <div class="flex items-center justify-between px-[24px] py-[12px] border-b border-[#e5e6ea] shrink-0">
      <button type="button" class="flex items-center gap-[4px] rounded-[4px] transition-opacity duration-150 hover:opacity-75" @click="emit('close')">
        <span class="text-[14px] text-[#61667c] leading-[1.5]">Close</span>
        <kbd class="kbd">esc</kbd>
      </button>
      <div class="flex items-center gap-[8px] pl-[12px]">
        <button type="button" class="btn-secondary" @click="emit('close')">Cancel</button>
        <button type="button" class="btn-primary" :class="{ 'is-disabled': !canUpdate }" :aria-disabled="!canUpdate" @click="update">Update</button>
      </div>
    </div>

    <Transition name="edit-mode" mode="out-in">
      <!-- Details only (Figma: 158:92744) -->
      <div v-if="!claimsOpen" key="details" class="flex flex-1 min-h-0 justify-center">
        <div class="flex flex-col w-[566px] max-w-full border-x border-[#e5e6ea]">
          <ReimbursementClaimsPanel
            v-model:name="name"
            v-model:description="description"
            :claims="selectedClaims"
            :total="total"
            :currency="PAY_CURRENCY"
            :visible="7"
            show-edit
            pin-total
            @remove="remove"
            @edit="claimsOpen = true"
          />
        </div>
      </div>

      <!-- Details + claims table (Figma: 158:94424) -->
      <div v-else key="claims" class="flex flex-1 min-h-0">
        <ReimbursementClaimsTable
          v-model="selectedIds"
          :title="`${reimbursement.recipient} claims`"
          :claims="pool"
          :empty-text="`${reimbursement.recipient} has no approved claims waiting to be paid.`"
        />
        <aside class="relative flex flex-col w-[491px] shrink-0 border-l border-[#e5e6ea] bg-white">
          <ReimbursementClaimsPanel
            v-model:name="name"
            v-model:description="description"
            :claims="selectedClaims"
            :total="total"
            :currency="PAY_CURRENCY"
            :visible="7"
            pin-total
            @remove="remove"
          />
        </aside>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import ReimbursementClaimsTable from '../content/ReimbursementClaimsTable.vue'
import ReimbursementClaimsPanel from '../content/ReimbursementClaimsPanel.vue'
import { payableClaims, PAY_CURRENCY } from '../../composables/useReimbursements.js'
import { convert, splitAmount } from '../../composables/useFx.js'

const props = defineProps({
  reimbursement: { type: Object, required: true },
})
const emit = defineEmits(['close', 'update'])

const name = ref(props.reimbursement.title)
const description = ref(props.reimbursement.description ?? '')
const claimsOpen = ref(false)

// The claims already in it come first, then whatever else the recipient can be paid for
const pool = [
  ...props.reimbursement.items,
  ...payableClaims(props.reimbursement.recipient).filter((c) => !props.reimbursement.items.some((i) => i.id === c.id)),
]
const selectedIds = ref(props.reimbursement.items.map((c) => c.id))
const selectedClaims = computed(() => pool.filter((c) => selectedIds.value.includes(c.id)))
const total = computed(() => selectedClaims.value.reduce((sum, c) => {
  const { currency, value } = splitAmount(c.amount)
  return sum + convert(value, currency, PAY_CURRENCY)
}, 0))

const canUpdate = computed(() => name.value.trim() !== '' && selectedClaims.value.length > 0)

function remove(id) {
  selectedIds.value = selectedIds.value.filter((x) => x !== id)
}

function update() {
  if (!canUpdate.value) return
  emit('update', { title: name.value.trim(), description: description.value.trim(), items: selectedClaims.value })
}

// esc closes (Figma: Close esc); ⌘/Ctrl + Enter updates
function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) update()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border: 1px solid #e5e6ea;
  border-radius: 4px;
  background: white;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #9295a5;
}

.btn-secondary,
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  min-width: 100px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  transition: filter 150ms ease, opacity 150ms ease;
}
.btn-secondary {
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  color: #61667c;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
}
.btn-primary {
  border: 1px solid #2465de;
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  color: white;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
}
.btn-secondary:hover { filter: brightness(0.95); }
.btn-primary:hover { filter: brightness(1.05); }
.btn-secondary:active, .btn-primary:active { transform: translateY(1px); }
.btn-primary.is-disabled { opacity: 0.5; cursor: not-allowed; filter: none; transform: none; }

/* Details ↔ details + table: quick cross-fade */
.edit-mode-enter-active { transition: opacity 180ms ease-out; }
.edit-mode-leave-active { transition: opacity 120ms ease-in; }
.edit-mode-enter-from, .edit-mode-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .edit-mode-enter-active, .edit-mode-leave-active { transition: none; }
}
</style>
