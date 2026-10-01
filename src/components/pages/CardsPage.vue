<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-x-hidden" :class="createCardOpen ? 'overflow-y-hidden' : 'overflow-y-auto'">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex h-[60px] items-center justify-between gap-[32px] px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Cards</p>
        <button
          type="button"
          class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          @click="createCardOpen = true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#fff" stroke-width="1.5" stroke-linecap="round" /></svg>
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Create card</span>
        </button>
      </div>

      <Transition name="cards-fade" mode="out-in">

      <!-- Empty state (Figma: 266:18620) -->
      <div v-if="isEmpty" key="empty" class="bg-white flex flex-1 flex-col gap-[40px] items-center justify-center min-h-[600px] px-[24px] py-[12px] w-full">

        <!-- Paper card — hovering warms the blurred backdrop (Figma: Card-Issuing 322:22878) -->
        <div
          class="empty-hero bg-white border border-[#e5e6ea] flex flex-col items-center justify-end p-[32px] rounded-[12px] shrink-0 w-full max-w-[900px]"
          style="filter: drop-shadow(0px 16px 16px rgba(0,0,0,0.05));"
        >
          <div class="flex gap-[24px] items-center justify-center w-full shrink-0">

            <!-- Left: copy + CTA -->
            <div class="flex flex-1 flex-col gap-[24px] items-start justify-center min-w-px">
              <div class="flex flex-col gap-[8px] items-start w-full shrink-0">
                <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] w-full">Spend management</p>
                <p class="font-normal text-[16px] text-[#61667c] leading-[1.4] w-full">You can pay your vendors and suppliers directly from HitPay using the HitPay balance</p>
              </div>
              <div class="flex items-start justify-center pt-[12px] shrink-0">
                <button
                  type="button"
                  class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                  @click="createCardOpen = true"
                >
                  <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Create your first card</span>
                </button>
              </div>
            </div>

            <!-- Right: card illustration (Figma: Card-Issuing 322:22886) — the card
                 rises in from the bottom, then floats; on hover it tilts toward the
                 cursor in 3D and its lighting follows, and the backdrop warms -->
            <div
              ref="cardArtEl"
              class="relative hidden md:block w-[411px] h-[184px] shrink-0 overflow-hidden rounded-[8px]"
              aria-hidden="true"
              @pointermove="onCardArtMove"
              @pointerleave="onCardArtLeave"
            >
              <!-- Blurred backdrop crossfades to the warm/mint variant on hover -->
              <img :src="emptyBlurImg" alt="" class="empty-blur empty-blur--idle absolute pointer-events-none select-none max-w-none left-[-115.8px] top-[-96.7px]" width="821.015" height="702.168" />
              <img :src="emptyBlurHoverImg" alt="" class="empty-blur empty-blur--hover absolute pointer-events-none select-none max-w-none left-[-115.8px] top-[-96.7px]" width="821.015" height="702.168" />

              <div class="empty-card-enter absolute left-1/2 top-1/2 ml-[-110px] mt-[-69.25px]">
                <div class="empty-card-tilt">
                <div
                  class="empty-card-float relative w-[220px] h-[137.5px] overflow-hidden rounded-[9.621px] backdrop-blur-[13.75px]"
                  style="background-image: linear-gradient(90deg, #2465de 0%, #2465de 100%), linear-gradient(-58.27deg, rgba(255,255,255,0) 0.78%, rgba(246,248,250,0.6) 44.26%); box-shadow: 0px 108.35px 30.25px 0px rgba(23,29,109,0), 0px 69.3px 28.05px 0px rgba(23,29,109,0.01), 0px 39.05px 23.65px 0px rgba(23,29,109,0.04), 0px 17.6px 17.6px 0px rgba(23,29,109,0.07), 0px 4.4px 9.35px 0px rgba(23,29,109,0.08);"
                >
                  <!-- Soft light blobs on the card face -->
                  <div class="empty-card-blob absolute flex items-center justify-center mix-blend-hard-light left-[-31.22px] top-[77.69px] w-[224.088px] h-[156.899px]">
                    <div class="relative w-[212.63px] h-[138.577px] rotate-[5.09deg]">
                      <img :src="cardEllipse1Img" alt="" class="absolute max-w-none left-[-110px] top-[-110px]" width="432.63" height="358.577" />
                    </div>
                  </div>
                  <div class="empty-card-blob empty-card-blob--far absolute flex items-center justify-center mix-blend-hard-light left-[86.83px] top-[-10.4px] w-[278.671px] h-[255.06px]">
                    <div class="relative w-[227.749px] h-[162.763px] rotate-[30.11deg]">
                      <img :src="cardEllipse2Img" alt="" class="absolute max-w-none left-[-110px] top-[-110px]" width="447.749" height="382.763" />
                    </div>
                  </div>

                  <!-- Halftone texture -->
                  <div class="absolute inset-0 mix-blend-overlay opacity-10 pointer-events-none">
                    <div class="absolute inset-0 opacity-20" :style="{ backgroundImage: `url(${cardHalftoneImg})`, backgroundSize: '1.65px 1.65px' }" />
                    <div class="absolute inset-0 opacity-50" :style="{ backgroundImage: `url(${cardHalftoneImg})`, backgroundSize: '1.65px 1.65px' }" />
                    <div class="absolute inset-0" :style="{ backgroundImage: `url(${cardHalftone2Img})`, backgroundSize: '1.65px 1.65px' }" />
                  </div>

                  <img :src="cardMastercardImg" alt="" class="absolute left-[13.2px] top-[11px]" width="32.0354" height="19.8003" />
                  <div class="absolute flex items-end gap-[5.776px] right-[9.7px] top-[11px]">
                    <img :src="cardLogogramImg" alt="" width="17.6228" height="17.6" />
                    <img :src="cardLogotextImg" alt="" width="48.8467" height="14.959" />
                  </div>

                  <p class="absolute left-[13.27px] top-[51.06px] font-medium text-[6.6px] text-white leading-[1.5] whitespace-nowrap" style="font-family: 'Reddit Mono', monospace;">TRAVEL CARD</p>
                  <div class="absolute flex items-center gap-[5.5px] left-[13.27px] top-[67.65px]">
                    <img :src="cardDots1Img" alt="" width="19.8001" height="3.30004" />
                    <img :src="cardDots2Img" alt="" width="19.8" height="3.30004" />
                    <img :src="cardDots3Img" alt="" width="19.8" height="3.30004" />
                    <p class="font-medium text-[9.9px] text-white leading-[1.35] whitespace-nowrap" style="font-family: 'Reddit Mono', monospace;">4567</p>
                  </div>

                  <div class="absolute flex items-center gap-[17.6px] left-[13.27px] top-[102.85px] font-medium text-white leading-[1.5] whitespace-nowrap">
                    <div v-for="item in cardDetails" :key="item.label" class="flex flex-col items-start">
                      <p class="text-[6.6px]" style="font-family: 'Reddit Mono', monospace;">{{ item.label }}</p>
                      <p class="text-[7.7px]">{{ item.value }}</p>
                    </div>
                  </div>

                  <!-- Specular glare that tracks the cursor on hover -->
                  <div class="empty-card-glare absolute inset-0 pointer-events-none" />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- How it works — same recipe as BillsPage -->
        <div class="flex flex-col gap-[16px] items-center pb-[24px] shrink-0 w-full max-w-[1084px]">
          <div class="flex items-center justify-center px-[32px] w-full shrink-0">
            <p class="flex-1 font-medium text-[16px] text-[#03102f] text-center leading-[1.4] min-w-px">How it works</p>
          </div>
          <div class="flex h-[158px] items-start w-full max-w-[960px] px-[2px] rounded-[8px] border border-[#e5e6ea] shrink-0">
            <div
              v-for="(step, i) in steps"
              :key="step.title"
              class="flex flex-1 h-full items-start min-w-px overflow-hidden pt-[32px] pb-[8px] px-[32px]"
              :class="i < steps.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
            >
              <div class="flex flex-1 flex-col gap-[12px] items-start min-w-px">
                <div class="bg-[#f5f6f9] flex flex-col items-center justify-center p-[8px] rounded-[8px] shrink-0 size-[38px]">
                  <p class="font-medium text-[16px] text-[#03102f] text-center leading-[1.4] w-full">{{ i + 1 }}</p>
                </div>
                <div class="flex flex-col gap-[2px] items-start w-full shrink-0">
                  <p class="font-medium text-[14px] text-[#000501] leading-[1.5]">{{ step.title }}</p>
                  <p class="font-normal text-[12px] text-[#61667c] opacity-75 leading-[1.5] w-full">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Card list (Figma: Card-Issuing 322:18723) -->
      <div v-else key="filled" class="flex flex-col gap-[24px] w-full px-[24px] py-[12px]">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full items-start">
          <div
            v-for="card in cards"
            :key="card.id"
            role="button"
            tabindex="0"
            class="card-tile group relative flex flex-col overflow-hidden rounded-[12px] border border-[#e5e6ea] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2465de]/40"
            :class="isActive(card) ? 'bg-white' : 'bg-[#f2f2f4]'"
            @click="viewCard(card)"
            @keydown.enter="viewCard(card)"
          >
            <!-- Hover glow behind the content (Figma: hover state, 322:22533) -->
            <img
              v-if="isActive(card)"
              :src="tileHoverBlurImg"
              alt=""
              aria-hidden="true"
              class="card-tile__blur absolute left-[59.4px] top-[-62.6px] max-w-none pointer-events-none select-none"
              width="453.554"
              height="480.579"
            />

            <!-- Header: brand + nickname + status -->
            <div class="relative flex items-center gap-[8px] p-[12px] border-b border-[#e5e6ea]">
              <span class="relative shrink-0 w-[35px] h-[24px] rounded-[4px] overflow-hidden" :class="isActive(card) ? 'bg-white' : ''">
                <img :src="tileMastercardImg" alt="Mastercard" class="absolute left-[6.5px] top-[5px]" width="22.5" height="13.8057" />
              </span>
              <p
                class="flex-1 min-w-px text-[14px] font-medium leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis"
                :class="isActive(card) ? 'text-[#03102f]' : 'text-[#9295a5]'"
              >{{ card.nickname }}</p>
              <span
                class="inline-flex items-center justify-center shrink-0 min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                :class="isActive(card) ? 'bg-[#e6f9f0] text-[#238b5b]' : 'bg-white border border-[#e5e6ea] text-[#61667c]'"
              >{{ STATUS[card.status].label }}</span>
            </div>

            <!-- Body: masked number, holder, monthly spend -->
            <div class="relative flex flex-col gap-[16px] px-[20px] py-[16px]" :class="isActive(card) ? 'text-[#03102f]' : 'text-[#9295a5]'">
              <div class="flex flex-col gap-[4px] min-w-0">
                <div class="flex items-center gap-[10px]">
                  <img v-for="n in 3" :key="n" :src="isActive(card) ? tileDotsImg : tileDotsMutedImg" alt="" width="28" height="4" />
                  <p class="text-[16px] font-medium leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ last4(card) }}</p>
                  <button
                    v-if="isActive(card)"
                    type="button"
                    class="card-tile__copy flex items-center justify-center shrink-0 size-[16px] cursor-pointer hover:opacity-70"
                    aria-label="Copy card number"
                    @click.stop="copyNumber(card, $event)"
                  >
                    <img :src="tileCopyImg" alt="" width="16" height="16" />
                  </button>
                </div>
                <p class="text-[14px] font-medium leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ card.holder }}</p>
              </div>
              <div class="flex flex-col gap-[8px] font-medium whitespace-nowrap">
                <p class="text-[10px] uppercase tracking-[0.3px] leading-[18px]" :class="isActive(card) ? 'text-[#61667c]' : ''">Spent this month</p>
                <p class="text-[16px] leading-[1.4] overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ card.spent }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Transition>
    </div>

    <!-- Floating preview switcher: empty state ↔ cards list (same recipe as BillsPage) -->
    <div
      v-if="!createCardOpen"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-[4px] p-[4px] rounded-full bg-white border border-[#e5e6ea]"
      style="box-shadow: 0px 8px 24px rgba(3,16,47,0.16);"
    >
      <span class="px-[8px] text-[11px] font-medium text-[#8093b8] select-none">Preview</span>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="isEmpty ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="isEmpty = true"
      >Empty state</button>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="!isEmpty ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="isEmpty = false"
      >With cards</button>
    </div>

    <!-- Create card page — fills the main content area so the sidebar stays visible -->
    <Transition name="full-page">
      <CreateCardPage v-if="createCardOpen" @close="createCardOpen = false" @create="onCardCreated" />
    </Transition>

    <!-- "Copied" confirmation beside the tile's copy button -->
    <NavTooltip label="Copied" :anchor="copiedAnchor" :visible="!!copiedAnchor" />

    <!-- Success snackbar (Figma: Snackbar/Default) -->
    <Teleport to="body">
      <div class="fixed top-[24px] inset-x-0 z-[80] flex justify-center pointer-events-none">
        <Transition name="snackbar">
          <div
            v-if="toast"
            class="flex items-center gap-[8px] p-[12px] rounded-[8px] bg-[#e6f9f0] border border-[#b3eed2] pointer-events-auto"
            style="filter: drop-shadow(0px 8px 6px rgba(42,50,82,0.04));"
          >
            <img :src="snackbarCheckIcon" width="24" height="24" alt="" class="shrink-0" />
            <span class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ toast }}</span>
          </div>
        </Transition>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { cards, addCard, pendingToast } from '../../composables/useCards.js'
import CreateCardPage from './CreateCardPage.vue'
import NavTooltip from '../navigation/NavTooltip.vue'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'
import emptyBlurImg from '../../assets/images/cards-empty-blur.svg'
import emptyBlurHoverImg from '../../assets/images/cards-empty-blur-hover.svg'
import cardEllipse1Img from '../../assets/images/cards-empty-ellipse-1.svg'
import cardEllipse2Img from '../../assets/images/cards-empty-ellipse-2.svg'
import cardHalftoneImg from '../../assets/images/cards-empty-halftone.png'
import cardHalftone2Img from '../../assets/images/cards-empty-halftone-2.png'
import cardMastercardImg from '../../assets/images/cards-empty-mastercard.svg'
import cardLogogramImg from '../../assets/images/cards-empty-hitpay-logogram.svg'
import cardLogotextImg from '../../assets/images/cards-empty-hitpay-logotext.svg'
import cardDots1Img from '../../assets/images/cards-empty-dots-1.svg'
import cardDots2Img from '../../assets/images/cards-empty-dots-2.svg'
import cardDots3Img from '../../assets/images/cards-empty-dots-3.svg'
import tileMastercardImg from '../../assets/images/cards-list-mastercard.svg'
import tileDotsImg from '../../assets/images/cards-list-dots.svg'
import tileDotsMutedImg from '../../assets/images/cards-list-dots-muted.svg'
import tileHoverBlurImg from '../../assets/images/cards-list-hover-blur.svg'
import tileCopyImg from '../../assets/images/cards-list-copy.svg'

// Mock details printed on the empty-state card illustration
const cardDetails = [
  { label: 'VALID THRU', value: '10/30' },
  { label: 'CARD HOLDER', value: 'John Almaz' },
  { label: 'CVC', value: '***' },
]

// Preview switcher: true = empty/onboarding state, false = cards list (Figma: 266:18620)
const isEmpty = ref(true)

const steps = [
  { title: 'Upload invoice', desc: 'Upload a file or enter detail manually' },
  { title: 'Review and approve', desc: 'Route bill for approve if required' },
  { title: 'Pay or schedule', desc: 'Pay instantly or set future date' },
]

const STATUS = {
  active: { label: 'Active' },
  frozen: { label: 'Frozen' },
  canceled: { label: 'Canceled' },
}

// Only active cards get the full-colour tile; frozen/canceled render muted
const isActive = (card) => card.status === 'active'
const last4 = (card) => card.number.replace(/\s/g, '').slice(-4)

// Copy → brief "Copied" tooltip anchored to the button that was clicked
const copiedAnchor = ref(null)
let copiedTimer = null

async function copyNumber(card, event) {
  const button = event.currentTarget
  navigator.clipboard?.writeText(card.number.replace(/\s/g, '')).catch(() => {})
  clearTimeout(copiedTimer)
  // NavTooltip positions itself when it opens, so close first to re-anchor
  // if another tile's copy is clicked while it's still showing
  copiedAnchor.value = null
  await nextTick()
  copiedAnchor.value = button
  copiedTimer = setTimeout(() => { copiedAnchor.value = null }, 1500)
}

// Tile click → card details page
const router = useRouter()
function viewCard(card) {
  router.push({ path: '/cards/details', query: { id: card.id } })
}

// Create card full-page overlay
const createCardOpen = ref(false)

// New card lands in the grid; snackbar confirms and fades after a moment
const toast = ref('')
let toastTimer = null

function onCardCreated({ nickname, holder, number }) {
  addCard({ nickname, holder, number })
  createCardOpen.value = false
  isEmpty.value = false // a card now exists — show the list
  showToast(`${nickname} has been created successfully`)
}

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

// Arriving with a queued message (e.g. after cancelling a card) shows it here
onMounted(() => {
  if (pendingToast.value) {
    showToast(pendingToast.value)
    pendingToast.value = ''
  }
})

// Empty-state card: 3D tilt + cursor-tracked lighting on hover. The pointer
// sets a target (-1..1 on each axis), and a rAF loop eases toward it so the
// card glides rather than snapping; values reach the CSS through custom props.
const cardArtEl = ref(null)
const tiltTarget = { x: 0, y: 0, hover: 0 }
const tiltCurrent = { x: 0, y: 0, hover: 0 }
let tiltRaf = 0
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function stepTilt() {
  const el = cardArtEl.value
  if (!el) { tiltRaf = 0; return }
  let settled = true
  for (const k of ['x', 'y', 'hover']) {
    const delta = tiltTarget[k] - tiltCurrent[k]
    tiltCurrent[k] += delta * 0.12
    if (Math.abs(delta) > 0.001) settled = false
    else tiltCurrent[k] = tiltTarget[k]
  }
  const { x, y, hover } = tiltCurrent
  el.style.setProperty('--tilt-rx', `${(-y * 12).toFixed(2)}deg`)
  el.style.setProperty('--tilt-ry', `${(x * 16).toFixed(2)}deg`)
  el.style.setProperty('--tilt-lift', `${(hover * 28).toFixed(2)}px`)
  el.style.setProperty('--glare-x', `${((x + 1) * 50).toFixed(1)}%`)
  el.style.setProperty('--glare-y', `${((y + 1) * 50).toFixed(1)}%`)
  el.style.setProperty('--glare-o', hover.toFixed(3))
  el.style.setProperty('--blob-x', `${(-x * 14).toFixed(2)}px`)
  el.style.setProperty('--blob-y', `${(-y * 10).toFixed(2)}px`)
  tiltRaf = settled ? 0 : requestAnimationFrame(stepTilt)
}
function kickTilt() {
  if (!tiltRaf) tiltRaf = requestAnimationFrame(stepTilt)
}
function onCardArtMove(e) {
  if (prefersReducedMotion() || !cardArtEl.value) return
  const r = cardArtEl.value.getBoundingClientRect()
  tiltTarget.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
  tiltTarget.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
  tiltTarget.hover = 1
  kickTilt()
}
function onCardArtLeave() {
  tiltTarget.x = 0
  tiltTarget.y = 0
  tiltTarget.hover = 0
  kickTilt()
}

onUnmounted(() => {
  clearTimeout(toastTimer)
  clearTimeout(copiedTimer)
  cancelAnimationFrame(tiltRaf)
})
</script>

<style scoped>
/* Card tile hover (Figma: 322:19560 "Hover state"): lift with the normal
   shadow, fade in the soft colour glow, reveal the copy-number button */
.card-tile {
  transition: box-shadow 200ms ease;
}
.card-tile:hover {
  box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
.card-tile__blur,
.card-tile__copy {
  opacity: 0;
  transition: opacity 250ms ease;
}
.card-tile:hover .card-tile__blur,
.card-tile:hover .card-tile__copy,
.card-tile:focus-visible .card-tile__copy {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .card-tile, .card-tile__blur, .card-tile__copy { transition: none; }
}

/* Create card full page: gentle rise + fade in, quicker fade out */
.full-page-enter-active {
  transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1), transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: opacity, transform;
}
.full-page-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
  will-change: opacity, transform;
}
.full-page-enter-from { opacity: 0; transform: translateY(24px); }
.full-page-leave-to   { opacity: 0; transform: translateY(12px); }

/* Snackbar motion — same as the Approval Rules success snackbar */
/* Empty-state card: rises in from below the frame, then drifts in a slow,
   continuous float. Enter and float live on separate layers so their
   transforms don't fight. */
.empty-card-enter {
  animation: empty-card-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both;
}
.empty-card-float {
  animation: empty-card-float 6s ease-in-out 1050ms infinite;
  will-change: transform;
}
@keyframes empty-card-rise {
  from { opacity: 0; transform: translateY(140px) rotate(-6deg); }
  60%  { opacity: 1; }
  to   { opacity: 1; transform: translateY(0) rotate(0deg); }
}
@keyframes empty-card-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25%      { transform: translateY(-5px) rotate(-1.2deg); }
  75%      { transform: translateY(4px) rotate(1.2deg); }
}
@media (prefers-reduced-motion: reduce) {
  .empty-card-enter, .empty-card-float { animation: none; }
}

/* Hover: the card tilts toward the cursor and lifts off the page (custom
   props are eased in JS — see stepTilt). The light blobs drift opposite the
   cursor for parallax, and a soft glare follows it like a light source. */
.empty-card-tilt {
  transform: perspective(700px) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg)) translateZ(var(--tilt-lift, 0px));
  transform-style: preserve-3d;
  will-change: transform;
}
.empty-card-blob {
  transform: translate(var(--blob-x, 0px), var(--blob-y, 0px));
}
.empty-card-blob--far {
  transform: translate(calc(var(--blob-x, 0px) * -0.6), calc(var(--blob-y, 0px) * -0.6));
}
.empty-card-glare {
  background: radial-gradient(
    circle at var(--glare-x, 50%) var(--glare-y, 50%),
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.18) 28%,
    rgba(255, 255, 255, 0) 60%
  );
  mix-blend-mode: overlay;
  opacity: var(--glare-o, 0);
}

/* Blurred backdrop: grey-and-blue at rest, mint-and-amber on hover */
.empty-blur {
  transition: opacity 400ms ease;
}
.empty-blur--hover { opacity: 0; }
.empty-hero:hover .empty-blur--idle { opacity: 0; }
.empty-hero:hover .empty-blur--hover { opacity: 1; }

/* Empty ↔ cards-list state swap (preview switcher, same as BillsPage) */
.cards-fade-enter-active { transition: opacity 220ms ease-out, transform 220ms ease-out; }
.cards-fade-leave-active { transition: opacity 130ms ease-in, transform 130ms ease-in; }
.cards-fade-enter-from { opacity: 0; transform: translateY(8px); }
.cards-fade-leave-to { opacity: 0; transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) {
  .cards-fade-enter-active, .cards-fade-leave-active { transition: none; }
  .cards-fade-enter-from, .cards-fade-leave-to { transform: none; }
}

.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .full-page-enter-active, .full-page-leave-active,
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .full-page-enter-from { transform: none; }
}
</style>
