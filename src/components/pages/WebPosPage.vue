<template>
  <!-- Commerce → Web POS (Figma 6436:63146) -->
  <div class="h-full flex flex-col bg-white min-w-0">
    <!-- Top title: page name, Keypad / Products tabs, terminal + location -->
    <div class="relative flex items-center gap-4 pl-6 pr-2 shrink-0">
      <div class="flex flex-1 min-w-0 h-14 items-end justify-center border-b border-[#e5e6ea]">
        <button
          v-for="t in tabs"
          :key="t.key"
          type="button"
          class="flex h-full min-w-[88px] items-center justify-center gap-1 px-3"
          :class="tab === t.key ? 'border-b-2 border-[#2465de]' : ''"
          @click="tab = t.key"
        >
          <img :src="t.icon" alt="" width="16" height="16" class="block shrink-0" />
          <span
            class="text-[12px] leading-[1.5] whitespace-nowrap"
            :class="tab === t.key ? 'font-medium text-[#03102f]' : 'text-[#61667c]'"
          >{{ t.label }}</span>
        </button>
      </div>

      <div class="flex w-[388px] shrink-0 items-center gap-2">
        <button type="button" class="pos-input flex-1 min-w-0">
          <img :src="terminalIcon" alt="" width="16" height="16" class="block shrink-0" />
          <span class="flex-1 min-w-0 truncate text-left text-[14px] leading-[1.5] text-[#9295a5]">Connect to terminal</span>
        </button>
        <button type="button" class="pos-input flex-1 min-w-0">
          <img :src="locationIcon" alt="" width="16" height="16" class="block shrink-0" />
          <span class="flex-1 min-w-0 truncate text-left text-[14px] leading-[1.5] text-[#03102f]">Centara Mall</span>
          <img :src="chevronDownIcon" alt="" width="16" height="16" class="block shrink-0" />
        </button>
      </div>

      <h1 class="absolute left-6 top-4 text-[18px] font-medium leading-[1.35] text-[#03102f] whitespace-nowrap">Point of Sales</h1>
    </div>

    <!-- Content: keypad + checkout -->
    <div class="flex flex-1 min-h-0 border-t border-[#e5e6ea] pl-6">
      <!-- Keypad -->
      <div v-if="tab === 'keypad'" class="flex flex-1 min-w-0 h-full items-start justify-center overflow-hidden py-10">
        <div class="flex flex-col items-center gap-6 py-0.5">
          <div class="flex items-center justify-center gap-2">
            <button type="button" class="flex items-center gap-1">
              <span class="text-[18px] font-medium leading-[1.35] text-[#61667c]">SGD</span>
              <img :src="chevronDown18Icon" alt="" width="18" height="18" class="block shrink-0" />
            </button>
            <span class="text-[48px] leading-none tracking-[0.12px] text-[#03102f] whitespace-nowrap">{{ amountDisplay }}</span>
          </div>

          <div class="flex flex-col items-end gap-3">
            <div v-for="(row, r) in KEY_ROWS" :key="r" class="flex justify-end gap-3">
              <button
                v-for="k in row"
                :key="k"
                type="button"
                class="pos-key"
                :aria-label="k === 'back' ? 'Delete' : k"
                @click="press(k)"
              >
                <img v-if="k === 'back'" :src="deleteBackIcon" alt="" width="24" height="24" class="block" />
                <span v-else class="text-[20px] font-medium leading-[1.35] text-[#61667c]">{{ k }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products (not designed yet) -->
      <div v-else class="flex flex-1 min-w-0 h-full items-center justify-center">
        <p class="text-[14px] leading-[1.5] text-[#61667c]">Products are coming soon.</p>
      </div>

      <!-- Checkout -->
      <aside class="flex w-[400px] shrink-0 h-full flex-col justify-between overflow-hidden border-l border-[#e5e6ea] bg-[#fbfbf9]">
        <div class="flex flex-col min-h-0">
          <!-- Customer + description -->
          <div class="flex flex-col gap-2 p-2 bg-white border-b border-[#e5e6ea]">
            <button type="button" class="pos-field">
              <img :src="user2Icon" alt="" width="16" height="16" class="block shrink-0" />
              <span class="flex-1 min-w-0 truncate text-left text-[14px] leading-[1.5] text-[#03102f]">Anna Key</span>
              <img :src="chevronDownIcon" alt="" width="16" height="16" class="block shrink-0" />
            </button>
            <label class="pos-field cursor-text">
              <img :src="pencilIcon" alt="" width="16" height="16" class="block shrink-0" />
              <input
                v-model="description"
                type="text"
                placeholder="Add description"
                class="flex-1 min-w-0 bg-transparent outline-none text-[14px] leading-[1.5] text-[#03102f] placeholder:text-[#9295a5]"
              />
            </label>
          </div>

          <!-- Cart -->
          <div class="flex flex-col gap-0.5 p-2 overflow-y-auto">
            <div v-for="(item, i) in cart" :key="item.name" class="cart-card group">
              <div class="relative flex flex-1 min-w-0 items-center gap-3">
                <div class="relative size-12 shrink-0 overflow-hidden rounded-lg border border-[#e5e6ea]">
                  <img :src="item.image" alt="" class="absolute inset-0 size-full object-cover" />
                </div>
                <div class="absolute left-[38px] -top-[3px] size-4">
                  <img :src="qtyBadge" alt="" width="16" height="16" class="absolute inset-0 block" />
                  <span class="absolute inset-0 flex items-center justify-center text-[10px] font-medium leading-[18px] tracking-[0.3px] text-white">{{ item.qty }}</span>
                </div>
                <span class="flex-1 min-w-0 truncate text-[14px] font-medium leading-[1.5] text-[#03102f]">{{ item.name }}</span>
              </div>
              <span class="shrink-0 text-[16px] font-medium leading-[1.4] text-[#03102f] whitespace-nowrap">SGD {{ money(item.qty * item.price) }}</span>

              <!-- Hover actions -->
              <div class="absolute right-2 top-2 flex items-center gap-0.5 p-0.5 rounded bg-white border border-[#ccd4e3] opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" class="p-1 rounded hover:bg-[#f2f2f4]" aria-label="Edit item">
                  <img :src="pencilIcon" alt="" width="16" height="16" class="block" />
                </button>
                <div class="relative self-stretch w-0">
                  <img :src="actionDivider" alt="" width="24" height="1" class="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rotate-90" />
                </div>
                <button type="button" class="p-1 rounded hover:bg-[#f2f2f4]" aria-label="Remove item" @click="cart.splice(i, 1)">
                  <img :src="binIcon" alt="" width="16" height="16" class="block" />
                </button>
              </div>
            </div>
            <p v-if="!cart.length" class="py-6 text-center text-[14px] leading-[1.5] text-[#9295a5]">No items yet</p>
          </div>
        </div>

        <!-- Discount, total, charge -->
        <div class="flex flex-col gap-2 shrink-0">
          <div class="flex items-start justify-center gap-2 px-2">
            <button type="button" class="pos-secondary flex-1 min-w-0 gap-2 px-3">
              <span class="relative h-[18px] w-[14px] shrink-0">
                <img :src="discountIcon" alt="" width="18" height="18" class="absolute -left-[2px] top-0 block" />
              </span>
              <span class="text-[14px] font-medium leading-[1.5] text-[#61667c] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Add discount</span>
            </button>
            <button type="button" class="pos-secondary size-9 shrink-0" aria-label="More options">
              <span class="relative h-[18px] w-[14px] shrink-0">
                <img :src="dotsVerticalIcon" alt="" width="18" height="18" class="absolute -left-[2px] top-0 block" />
              </span>
            </button>
          </div>

          <div class="flex flex-col gap-4 p-4 bg-white" style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.03);">
            <div class="flex items-center justify-between text-[#03102f] whitespace-nowrap">
              <span class="text-[14px] leading-[1.5]">Total</span>
              <span class="text-[18px] font-medium leading-[1.35]">{{ money(total) }} SGD</span>
            </div>
            <button type="button" class="pos-primary">Charge</button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import counterIcon from '../../assets/icons/web-pos/counter.svg'
import productIcon from '../../assets/icons/web-pos/product.svg'
import terminalIcon from '../../assets/icons/web-pos/terminal.svg'
import locationIcon from '../../assets/icons/web-pos/location.svg'
import chevronDownIcon from '../../assets/icons/web-pos/chevron-down.svg'
import chevronDown18Icon from '../../assets/icons/web-pos/chevron-down-18.svg'
import deleteBackIcon from '../../assets/icons/web-pos/delete-back.svg'
import user2Icon from '../../assets/icons/web-pos/user-2.svg'
import pencilIcon from '../../assets/icons/web-pos/pencil.svg'
import qtyBadge from '../../assets/icons/web-pos/qty-badge.svg'
import actionDivider from '../../assets/icons/web-pos/action-divider.svg'
import binIcon from '../../assets/icons/web-pos/bin.svg'
import discountIcon from '../../assets/icons/web-pos/discount.svg'
import dotsVerticalIcon from '../../assets/icons/web-pos/dots-vertical.svg'
import productWatch from '../../assets/icons/web-pos/product-watch.jpg'

const tabs = [
  { key: 'keypad', label: 'Keypad', icon: counterIcon },
  { key: 'products', label: 'Products', icon: productIcon },
]
const tab = ref('keypad')

// Keypad: digits fill the amount from the cents up (e.g. 1, 2, 5 → 1.25)
const KEY_ROWS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['0', 'back']]
const MAX_DIGITS = 9
const digits = ref('')
const money = (n) => n.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const amountDisplay = computed(() => money(Number(digits.value || 0) / 100))

function press(k) {
  if (k === 'back') { digits.value = digits.value.slice(0, -1); return }
  if (digits.value.length >= MAX_DIGITS) return
  if (!digits.value && k === '0') return
  digits.value += k
}

// Typing on the keyboard works too, unless the focus is in a text field
function onKey(e) {
  if (tab.value !== 'keypad' || e.metaKey || e.ctrlKey || e.altKey) return
  if (e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable]')) return
  if (/^\d$/.test(e.key)) press(e.key)
  else if (e.key === 'Backspace') press('back')
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const description = ref('')
const cart = ref([{ name: 'Quick Sale', qty: 2, price: 5, image: productWatch }])
const total = computed(() => cart.value.reduce((sum, i) => sum + i.qty * i.price, 0))
</script>

<style scoped>
/* Basic input / select with Input Shadow/Default */
.pos-input,
.pos-field {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 8px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
}
.pos-input {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
}
.pos-field {
  width: 100%;
}

/* Keyboard button */
.pos-key {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 60px;
  padding: 8px;
  border: 1px solid #f2f2f4;
  border-radius: 12px;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  filter: drop-shadow(0px 1.5px 0px #e5e5e5);
  transition: transform 80ms ease;
}
.pos-key:active {
  transform: translateY(1px);
  filter: none;
}

/* Product card in the cart */
.cart-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  filter: drop-shadow(0px 3px 11px rgba(38, 42, 50, 0.03));
}

/* Button/Secondary/Default */
.pos-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  overflow: hidden;
  border: 1px solid #f2f2f4;
  border-radius: 8px;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
}

/* Button/Primary/Default, large */
.pos-primary {
  width: 100%;
  height: 44px;
  padding: 8px 14px;
  border: 1px solid #2465de;
  border-radius: 8px;
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
}
</style>
