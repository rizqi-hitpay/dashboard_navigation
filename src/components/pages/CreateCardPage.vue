<template>
  <div class="absolute inset-0 z-30 bg-white flex flex-col overflow-x-hidden">

    <!-- Header: Close / esc + Cancel / Create -->
    <div class="flex items-center justify-between px-[24px] py-[12px] w-full border-b border-[#e5e6ea] shrink-0">
      <button type="button" class="flex items-start gap-[4px] cursor-pointer" @click="close">
        <span class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Close</span>
        <span class="flex items-center justify-center px-[8px] py-[2px] rounded-[4px] border border-[#e5e6ea] bg-white">
          <span class="text-[12px] font-medium text-[#9295a5] leading-[1.5] whitespace-nowrap">esc</span>
        </span>
      </button>
      <div class="flex items-center gap-[8px] pl-[12px]">
        <button
          type="button"
          class="btn-secondary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#61667c]"
          style="height: 36px; min-width: 100px; padding: 8px 12px;"
          @click="close"
        >Cancel</button>
        <button
          type="button"
          class="btn-primary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-white"
          style="height: 36px; min-width: 100px; padding: 8px 12px;"
          :style="filled ? {} : { opacity: 0.5, cursor: 'not-allowed' }"
          @click="create"
        >{{ isEdit ? 'Save' : 'Create' }}</button>
      </div>
    </div>

    <!-- Body: form on the left, live card preview on the right -->
    <div class="flex flex-1 min-h-0 w-full">

      <!-- Form panel -->
      <div class="flex flex-col flex-1 min-w-0 border-r border-[#e5e6ea] overflow-y-auto pt-[12px]">
        <div class="flex flex-col gap-[2px] px-[40px] py-[12px] w-full">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">{{ isEdit ? 'Edit card' : 'Create a card' }}</p>
          <p class="text-[14px] font-normal text-[#61667c] leading-[1.5]">{{ isEdit ? 'Update the details of this card.' : 'Fill in the details below to issue a new card.' }}</p>
        </div>

        <div class="flex flex-col gap-[16px] px-[40px] py-[12px] w-full">
          <FieldRows :rows="fieldRows" :values="values" />

          <!-- Advance settings accordion -->
          <div
            class="flex flex-col w-full rounded-[8px] overflow-hidden bg-white"
            :class="advancedOpen ? 'border border-[#e5e6ea]' : ''"
          >
            <button
              type="button"
              class="flex items-center gap-[8px] px-[12px] py-[8px] w-full cursor-pointer bg-[#f5f6f9]"
              :aria-expanded="advancedOpen"
              @click="advancedOpen = !advancedOpen"
            >
              <span class="flex-1 min-w-0 text-left text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">Advance settings</span>
              <svg
                class="shrink-0 transition-transform duration-200"
                :style="{ transform: advancedOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
                width="16" height="16" viewBox="0 0 16 16" fill="none"
              ><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
            </button>
            <div
              class="grid transition-[grid-template-rows] duration-200 ease-out"
              :style="{ gridTemplateRows: advancedOpen ? '1fr' : '0fr' }"
            >
              <div class="overflow-hidden" :class="advancedOpen ? 'border-t border-[#e5e6ea]' : ''">
                <div class="flex flex-col gap-[20px] p-[12px]">
                  <div class="flex flex-col gap-[12px] w-full">
                    <p class="text-[13px] font-medium text-[#03102f] leading-[1.5] w-full">Spending limit</p>
                    <div class="flex flex-col gap-[16px] w-full">
                      <FieldRows :rows="spendingLimitRows" :values="values" />
                    </div>
                  </div>
                  <FieldRows :rows="merchantTypeRows" :values="values" />
                  <FieldRows :rows="expirationRows" :values="values" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Card preview panel -->
      <div class="relative flex-1 min-w-0 bg-white overflow-hidden hidden md:flex justify-center">
        <!-- Blurred decorative backdrops — grey while empty, warm once filled -->
        <img
          :src="blurBackdrop"
          alt=""
          aria-hidden="true"
          class="absolute pointer-events-none select-none max-w-none pc-backdrop"
          :style="{ opacity: filled ? 0 : 1 }"
          style="width: 846px; height: 608px; left: -132px; top: 69px;"
        />
        <img
          :src="blurBackdropFilled"
          alt=""
          aria-hidden="true"
          class="absolute pointer-events-none select-none max-w-none pc-backdrop"
          :style="{ opacity: filled ? 1 : 0 }"
          style="width: 1116px; height: 963px; left: -196px; top: -216px;"
        />

        <!-- Merchant balance bar -->
        <div
          class="absolute left-1/2 -translate-x-1/2 flex flex-col gap-[4px] px-[12px] py-[8px] rounded-[8px] border border-[#f2f2f4]"
          style="top: 16px; width: min(516px, calc(100% - 48px)); background: linear-gradient(161.7deg, rgba(255,255,255,0) 0.5%, rgba(230,239,240,0.57) 82.7%);"
        >
          <p class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">MERCHANT CARD BALANCE</p>
          <div class="flex items-center justify-between w-full">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">SGD 10,320.00</p>
            <button
              type="button"
              class="btn-secondary flex items-center justify-center gap-[6px] h-[28px] px-[8px] rounded-[8px] shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 4.5l-7 7M10 11.8H4.2V6" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Fund</span>
            </button>
          </div>
        </div>

        <!-- Card — glass placeholder that turns into the blue textured card when filled -->
        <div class="preview-card shrink-0" :class="{ 'preview-card--filled': filled }">

          <!-- Glass sheen (empty state) — fades out as the blue takes over -->
          <div
            class="pc-fade absolute inset-0 pointer-events-none"
            :style="{ opacity: filled ? 0 : 1 }"
            style="background: linear-gradient(-58deg, rgba(255,255,255,0) 0.8%, rgba(246,248,250,0.6) 44.3%);"
            aria-hidden="true"
          />

          <!-- Filled-state layers: inner gradient blobs + halftone texture -->
          <div class="pc-fade absolute inset-0 pointer-events-none" :style="{ opacity: filled ? 1 : 0 }" aria-hidden="true">
            <img :src="cardInnerBlur" alt="" class="absolute max-w-none" style="width: 1021px; height: 820px; left: -238px; top: -194px; mix-blend-mode: hard-light;" />
            <div class="pc-halftone">
              <div class="pc-halftone__layer" :style="{ backgroundImage: `url(${halftoneA})`, opacity: 0.2 }" />
              <div class="pc-halftone__layer" :style="{ backgroundImage: `url(${halftoneA})`, opacity: 0.5 }" />
              <div class="pc-halftone__layer" :style="{ backgroundImage: `url(${halftoneB})` }" />
            </div>
          </div>

          <!-- Mastercard: muted while empty, full colour when filled -->
          <img :src="mastercardMutedLogo" alt="" class="pc-fade absolute" :style="{ opacity: filled ? 0 : 1 }" style="left: 24px; top: 20px; width: 58px; height: 36px;" />
          <img :src="mastercardCardLogo" alt="Mastercard" class="pc-fade absolute" :style="{ opacity: filled ? 1 : 0 }" style="left: 24px; top: 20px; width: 58px; height: 36px;" />

          <!-- HitPay logo: dark watermark while empty, white when filled -->
          <div class="pc-fade absolute flex items-end gap-[10.5px]" :style="{ opacity: filled ? 0 : 0.2 }" style="right: 18px; top: 20px;">
            <img :src="hitpayLogogram" width="32" height="32" alt="" />
            <img :src="hitpayLogotext" width="89" height="27" alt="HitPay" />
          </div>
          <div class="pc-fade absolute flex items-end gap-[10.5px]" :style="{ opacity: filled ? 1 : 0 }" style="right: 18px; top: 20px;">
            <img :src="hitpayLogogramWhite" width="32" height="32" alt="" />
            <img :src="hitpayLogotextWhite" width="89" height="27" alt="HitPay" />
          </div>

          <!-- Nickname label (filled only) -->
          <p
            class="pc-rise absolute text-[12px] font-medium text-white leading-[1.5] uppercase whitespace-nowrap"
            :class="{ 'pc-rise--hidden': !filled }"
            style="left: 24px; top: 93px; font-family: 'Reddit Mono', ui-monospace, monospace;"
          >{{ values['Nickname'] }}</p>

          <!-- Card number: placeholder zeros ↔ masked dots + last 4 -->
          <div
            class="pc-fade absolute flex items-center gap-[10px] text-[18px] font-medium text-[#cbcdd4] leading-[1.35] whitespace-nowrap"
            :style="{ opacity: filled ? 0 : 1 }"
            style="left: 24px; top: 123px; font-family: 'Reddit Mono', ui-monospace, monospace;"
          >
            <span>0000</span><span>0000</span><span>0000</span><span>0000</span>
          </div>
          <div
            class="pc-rise absolute flex items-center gap-[10px] text-[18px] font-medium text-white leading-[1.35] whitespace-nowrap"
            :class="{ 'pc-rise--hidden': !filled }"
            style="left: 24px; top: 123px; font-family: 'Reddit Mono', ui-monospace, monospace;"
          >
            <span v-for="(group, gi) in cardNumber" :key="gi">{{ group }}</span>
          </div>

          <!-- Details -->
          <div class="absolute flex items-center gap-[32px] whitespace-nowrap" style="left: 24px; top: 187px;">
            <div class="flex flex-col">
              <p class="pc-color text-[12px] font-medium leading-[1.5]" :class="filled ? 'text-white' : 'text-[#cbcdd4]'" style="font-family: 'Reddit Mono', ui-monospace, monospace;">VALID THRU</p>
              <p class="pc-color text-[14px] font-medium leading-[1.5]" :class="filled ? 'text-white' : 'text-[#cbcdd4]'">{{ filled ? '10/30' : '00/00' }}</p>
            </div>
            <div class="flex flex-col">
              <p class="pc-color text-[12px] font-medium leading-[1.5]" :class="filled ? 'text-white' : 'text-[#cbcdd4]'" style="font-family: 'Reddit Mono', ui-monospace, monospace;">CARD HOLDER</p>
              <p class="pc-color text-[14px] font-medium leading-[1.5]" :class="filled ? 'text-white' : (values['Card holder'] ? 'text-[#61667c]' : 'text-[#cbcdd4]')">{{ values['Card holder'] || 'Not set' }}</p>
            </div>
            <div class="pc-rise flex flex-col" :class="{ 'pc-rise--hidden': !filled }">
              <p class="text-[12px] font-medium text-white leading-[1.5]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">CVC</p>
              <p class="text-[14px] font-medium text-white leading-[1.5]">***</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted, onUnmounted } from 'vue'
import FieldRows from '../forms/FieldRows.vue'
import mastercardMutedLogo from '../../assets/icons/logo-mastercard-muted.svg'
import mastercardCardLogo from '../../assets/icons/logo-mastercard-card.svg'
import hitpayLogogram from '../../assets/icons/logo-hitpay.svg'
import hitpayLogotext from '../../assets/icons/hitpay-logotext.svg'
import hitpayLogogramWhite from '../../assets/icons/logo-hitpay-white.svg'
import hitpayLogotextWhite from '../../assets/icons/hitpay-logotext-white.svg'
import blurBackdrop from '../../assets/images/create-card-blur.svg'
import blurBackdropFilled from '../../assets/images/create-card-blur-filled.svg'
import cardInnerBlur from '../../assets/images/card-inner-blur.svg'
import halftoneA from '../../assets/images/card-halftone-a.png'
import halftoneB from '../../assets/images/card-halftone-b.png'

const props = defineProps({
  // When set, the page edits this card instead of creating a new one
  card: { type: Object, default: null },
})

const emit = defineEmits(['close', 'create', 'save'])

const isEdit = computed(() => !!props.card)

const fieldRows = [
  [{ label: 'Nickname', placeholder: 'e.g. Travel card' }],
  [{ label: 'Card holder', placeholder: 'Select staff member', options: ['John Dean', 'Juan Pablo', 'Andrea Hill', 'Tim Miller'] }],
  [{ label: 'Billing address', placeholder: '30 Cecil Street, #19-08, Singapore 049712' }],
  [
    { label: 'City', placeholder: 'City' },
    { label: 'Region', placeholder: 'Region' },
  ],
  [
    { label: 'State', placeholder: 'State' },
    { label: 'Zip code', placeholder: 'Zip code' },
  ],
  [{ label: 'Phone number', type: 'phone', placeholder: '81988819' }],
]

// Advance settings (Figma: _advance_settings accordion content)
const spendingLimitRows = [
  [
    { label: 'Daily max', prefix: 'SGD', labelInfo: true, placeholder: 'No limit' },
    { label: 'Monthly max', prefix: 'SGD', labelInfo: true, placeholder: 'No limit' },
  ],
  [
    { label: 'Per transaction', prefix: 'SGD', labelInfo: true, placeholder: 'No limit' },
    { label: 'Per card', prefix: 'SGD', labelInfo: true, placeholder: 'No limit' },
  ],
]
const merchantTypeRows = [
  [{ label: 'Restrict to merchant types', placeholder: 'Select merchant type', options: ['Automotive', 'Travel', 'Dining', 'Retail', 'Software'], value: 'Automotive' }],
]
const expirationRows = [
  [{ label: 'Expiration date', type: 'date', placeholder: 'MM/YYYY', value: '08/2030' }],
]

const values = reactive(Object.fromEntries(
  [...fieldRows, ...spendingLimitRows, ...merchantTypeRows, ...expirationRows]
    .flat()
    .map(f => [f.label, f.value ?? ''])
))

// Editing: prefill the form from the card being edited
if (props.card) {
  const s = props.card.stats
  Object.assign(values, {
    Nickname: props.card.nickname,
    'Card holder': props.card.holder,
    'Billing address': '30 Cecil Street, #19-08, Singapore 049712',
    City: 'Singapore',
    Region: 'Singapore',
    State: 'Singapore',
    'Zip code': '182900',
    'Phone number': '81988819',
    'Daily max': Math.round(s.monthlyLimit / 6).toFixed(2),
    'Monthly max': s.monthlyLimit.toFixed(2),
    'Per transaction': Math.round(s.monthlyLimit / 15).toFixed(2),
    'Per card': s.cardLimit != null ? s.cardLimit.toFixed(2) : '',
  })
}

const advancedOpen = ref(isEdit.value)

// Card preview flips to the coloured state once the card has an identity
const filled = computed(() => !!(values['Nickname'].trim() && values['Card holder']))

// Existing number when editing; fresh Mastercard-style number for new cards
const cardNumber = props.card
  ? props.card.number.split(' ')
  : [
      '5' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
      ...Array.from({ length: 3 }, () => String(Math.floor(Math.random() * 10000)).padStart(4, '0')),
    ]

function close() {
  emit('close')
}

// Create/Save needs the card identity that drives the preview; ignore clicks until then
function create() {
  if (!filled.value) return
  emit(isEdit.value ? 'save' : 'create', {
    nickname: values['Nickname'].trim(),
    holder: values['Card holder'],
    number: cardNumber.join(' '),
  })
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* ── Buttons (Figma: Button/Secondary, Button/Primary) ── */
.btn-secondary {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  border: 1px solid #f2f2f4;
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-secondary:hover { filter: brightness(0.98); }
.btn-secondary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #e5e5e5;
}

.btn-primary {
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  border: 1px solid #2465de;
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-primary:hover { filter: brightness(1.05); }
.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #1d5fd9;
}

/* ── Card preview (Figma: Card empty glass state ↔ 118:38060 filled state) ── */
.preview-card {
  position: relative;
  overflow: hidden;
  width: 400px;
  height: 250px;
  margin-top: 120px;
  border-radius: 17.5px;
  backdrop-filter: blur(25px);
  background-color: transparent;
  /* Empty state edge drawn as an inset ring, not a real border — the filled card has none */
  box-shadow: inset 0 0 0 1.5px white;
  transition: background-color 600ms ease, box-shadow 600ms ease;
}
.preview-card--filled {
  background-color: #2465de;
  box-shadow:
    0px 8px 17px 0px rgba(23, 29, 109, 0.08),
    0px 32px 32px 0px rgba(23, 29, 109, 0.07),
    0px 71px 43px 0px rgba(23, 29, 109, 0.04),
    0px 126px 51px 0px rgba(23, 29, 109, 0.01);
  animation: card-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes card-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

/* Backdrop + layer crossfades */
.pc-backdrop { transition: opacity 800ms ease; }
.pc-fade { transition: opacity 500ms ease; }
.pc-color { transition: color 500ms ease; }

/* Elements that appear with the filled state: fade + gentle rise, slightly delayed */
.pc-rise {
  transition: opacity 450ms ease 120ms, transform 450ms ease 120ms;
}
.pc-rise--hidden {
  opacity: 0;
  transform: translateY(4px);
  transition-delay: 0ms;
}

/* Halftone texture: three tiled 3px layers blended over the blue (Figma: Halftone) */
.pc-halftone {
  position: absolute;
  inset: 0;
  mix-blend-mode: overlay;
  opacity: 0.1;
  pointer-events: none;
}
.pc-halftone__layer {
  position: absolute;
  inset: 0;
  background-size: 3px 3px;
  background-position: top left;
  background-repeat: repeat;
}

@media (prefers-reduced-motion: reduce) {
  .btn-secondary,
  .btn-primary,
  .preview-card,
  .pc-backdrop,
  .pc-fade,
  .pc-color,
  .pc-rise { transition: none; }
  .preview-card--filled { animation: none; }
  .pc-rise--hidden { transform: none; }
}
</style>
