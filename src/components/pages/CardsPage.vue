<template>
  <!-- Root stays fixed so overlays (create card page, quick-view panel) pin to
       the content card; the page itself scrolls inside -->
  <div class="relative bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 min-h-0 flex-col items-start w-full pt-[4px] overflow-x-hidden" :class="createCardOpen ? 'overflow-y-hidden' : 'overflow-y-auto'">

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

        <!-- Paper card — hovering warms the blurred backdrop (Figma: Card-Issuing 322:22878).
             The paper clips, not the illustration, so the gradient bleeds across it -->
        <div
          class="empty-hero relative overflow-hidden bg-white border border-[#e5e6ea] flex flex-col items-center justify-end p-[32px] rounded-[12px] shrink-0 w-full max-w-[900px]"
          style="box-shadow: 0px 16px 32px 0px rgba(0,0,0,0.05);"
        >
          <div class="flex gap-[24px] items-center justify-center w-full shrink-0">

            <!-- Left: copy + CTA — stacked above the bleeding gradient -->
            <div class="relative z-[1] flex flex-1 flex-col gap-[24px] items-start justify-center min-w-px">
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

            <!-- Right: card illustration (Figma: Card-Issuing 322:22886) — shared
                 HitPayCard at 0.55 scale (220px); the backdrop warms on hover -->
            <div class="relative hidden md:block w-[411px] h-[184px] shrink-0">
              <!-- Blurred backdrop crossfades to the warm/mint variant on hover -->
              <img :src="emptyBlurImg" alt="" class="empty-blur empty-blur--idle absolute pointer-events-none select-none max-w-none left-[-115.8px] top-[-96.7px]" width="821.015" height="702.168" />
              <img :src="emptyBlurHoverImg" alt="" class="empty-blur empty-blur--hover absolute pointer-events-none select-none max-w-none left-[-115.8px] top-[-96.7px]" width="821.015" height="702.168" />
              <HitPayCard class="absolute inset-0" nickname="Travel card" holder="John Almaz" number="5412 7534 8821 4567" masked :scale="0.55" />
            </div>
          </div>
        </div>

      </div>

      <!-- Card list (Figma: Card-Issuing 387:10164) — makes room for the
           quick-view panel: 480px panel + 24px gap, like Virtual Accounts -->
      <div
        v-else
        key="filled"
        class="flex flex-col gap-[24px] w-full px-[24px] py-[12px]"
        :style="{ paddingRight: quickCard ? '504px' : '24px', transition: 'padding-right 280ms cubic-bezier(0.4, 0, 0.2, 1)' }"
      >
        <!-- While a row is out as the panel it leaves the list, and the rows
             below slide up to close the gap (and back down when it returns) -->
        <TransitionGroup tag="div" name="row-shift" class="relative flex flex-col gap-[16px] w-full">
          <div
            v-for="card in listedCards"
            :key="card.id"
            role="button"
            tabindex="0"
            class="card-row group flex items-center gap-[16px] h-[76px] px-[17px] py-px bg-white rounded-[12px] border border-[#e5e6ea] overflow-hidden cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2465de]/40"
            :aria-pressed="quickCard?.id === card.id"
            :data-card-id="card.id"
            :class="{ 'opacity-0': liftedRowId === card.id }"
            @click="openQuickView(card)"
            @keydown.enter="openQuickView(card)"
          >
            <!-- Card thumbnail — the HitPay card at 0.16 scale, details swapped
                 for placeholder bars (Figma: Card-Issuing 467:16842) -->
            <span class="relative shrink-0 size-[64px]" aria-hidden="true">
              <span class="card-thumb absolute left-0 top-[12px] w-[64px] h-[40px] overflow-hidden rounded-[6px] backdrop-blur-[4px]">
                <span class="absolute flex items-center justify-center mix-blend-hard-light left-[-9.08px] top-[22.6px] w-[65.189px] h-[45.643px]">
                  <span class="relative w-[61.856px] h-[40.313px] rotate-[5.09deg]">
                    <img :src="thumbEllipse1Img" alt="" class="absolute max-w-none left-[-32px] top-[-32px]" width="125.856" height="104.313" />
                  </span>
                </span>
                <span class="absolute flex items-center justify-center mix-blend-hard-light left-[25.26px] top-[-3.03px] w-[81.068px] h-[74.199px]">
                  <span class="relative w-[66.254px] h-[47.349px] rotate-[30.11deg]">
                    <img :src="thumbEllipse2Img" alt="" class="absolute max-w-none left-[-32px] top-[-32px]" width="130.254" height="111.349" />
                  </span>
                </span>
                <span class="absolute inset-0 mix-blend-overlay opacity-10">
                  <span class="absolute inset-0 opacity-20" :style="{ backgroundImage: `url(${thumbHalftoneImg})`, backgroundSize: '0.48px 0.48px' }" />
                  <span class="absolute inset-0 opacity-50" :style="{ backgroundImage: `url(${thumbHalftoneImg})`, backgroundSize: '0.48px 0.48px' }" />
                  <span class="absolute inset-0" :style="{ backgroundImage: `url(${thumbHalftone2Img})`, backgroundSize: '0.48px 0.48px' }" />
                </span>
                <img :src="thumbMastercardImg" alt="" class="absolute left-[4px] top-[5px]" width="19.4154" height="12" />
                <span class="absolute right-[4.82px] top-[5.2px] w-[20px] h-[5px] rounded-[40px] bg-white/20" />
                <span class="absolute left-[5px] top-[25px] w-[20px] h-[3px] rounded-[40px] bg-white/20" />
                <span class="absolute left-[5px] top-[30px] w-[41px] h-[3px] rounded-[40px] bg-white/20" />
              </span>
            </span>

            <!-- Masked number + nickname · holder · status -->
            <div class="flex flex-1 flex-col justify-center gap-[4px] min-w-0 py-[12px]">
              <div class="flex items-center gap-[10px]">
                <img v-for="n in 3" :key="n" :src="tileDotsImg" alt="" width="28" height="4" />
                <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ last4(card) }}</p>
                <button
                  type="button"
                  class="card-row__copy flex items-center justify-center shrink-0 size-[16px] cursor-pointer hover:opacity-70"
                  aria-label="Copy card number"
                  @click.stop="copyNumber(card, $event)"
                >
                  <img :src="tileCopyImg" alt="" width="16" height="16" />
                </button>
              </div>
              <div class="flex items-center gap-[8px] min-w-0 text-[13px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">
                <p class="min-w-0 overflow-hidden text-ellipsis">{{ card.nickname }}</p>
                <img :src="rowSeparatorImg" alt="" class="shrink-0" width="4" height="4" />
                <p class="min-w-0 overflow-hidden text-ellipsis">{{ card.holder }}</p>
                <img :src="rowSeparatorImg" alt="" class="shrink-0" width="4" height="4" />
                <span
                  class="inline-flex items-center justify-center shrink-0 min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5]"
                  :style="{ background: STATUS[card.status].bg, color: STATUS[card.status].color }"
                >{{ STATUS[card.status].label }}</span>
              </div>
            </div>

            <!-- Monthly spend -->
            <div class="flex flex-col gap-[8px] shrink-0 min-w-[121.714px] font-medium whitespace-nowrap">
              <p class="text-[10px] uppercase tracking-[0.3px] leading-[18px] text-[#61667c]">Spent this month</p>
              <p class="text-[16px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ card.spent }}</p>
            </div>
          </div>
        </TransitionGroup>
      </div>
      </Transition>
    </div>

    <!-- Floating preview switcher: empty state ↔ cards list (same recipe as BillsPage) -->
    <div
      v-if="!createCardOpen && !createdCard"
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

    <!-- Quick-view panel (Figma: Card-Issuing 390:12174). The clicked row
         expands into the panel (and collapses back into it on close) — see
         morphShell; the panel stays hidden until the shell lands on it -->
    <div
      v-if="quickCard && !isEmpty && !createCardOpen && !createdCard"
      ref="quickPanelEl"
      class="quick-panel absolute top-[8px] right-[8px] bottom-[8px] z-40 w-[480px] max-w-[calc(100%-16px)] bg-white flex flex-col rounded-[8px] overflow-hidden"
      :class="{ 'is-landed': panelLanded, invisible: !panelLanded }"
      style="box-shadow: -16px 24px 120px 0px rgba(38,42,50,0.2);"
      role="dialog"
      :aria-label="renderCard.nickname + ' details'"
    >
        <!-- Header: label + brand + nickname + status -->
        <div class="quick-panel__fade shrink-0 flex items-start gap-[16px] border-b border-[#e5e6ea] p-[16px]">
          <div class="flex-1 flex flex-col gap-[2px] min-w-0 pt-[2px]">
            <span class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#61667c] leading-[18px]">Card</span>
            <div class="flex items-center gap-[8px] min-w-0">
              <span class="relative shrink-0 w-[24px] h-[16px] rounded-[4px] bg-white border border-[#e5e6ea] overflow-hidden">
                <img :src="panelMastercardImg" alt="Mastercard" class="absolute left-[3.46px] top-[2.34px] max-w-none" width="15.4287" height="9.2041" />
              </span>
              <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] truncate">{{ renderCard.nickname }}</p>
              <span
                class="inline-flex items-center justify-center shrink-0 min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                :style="{ background: STATUS[renderCard.status].bg, color: STATUS[renderCard.status].color }"
              >{{ STATUS[renderCard.status].label }}</span>
            </div>
          </div>
          <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Close" @click="closeQuickView">
            <img :src="closeIcon" width="20" height="20" alt="" />
          </button>
        </div>

        <div class="quick-panel__fade quick-panel__fade--late flex-1 overflow-y-auto flex flex-col items-center gap-[12px] px-[16px] py-[20px]">
          <!-- Card + reveal toggle -->
          <div class="flex flex-col items-center gap-[8px] w-[400px] max-w-full">
            <div class="w-[400px] h-[250px] shrink-0">
              <HitPayCard
                :key="renderCard.id"
                :nickname="renderCard.nickname"
                :holder="renderCard.holder"
                :number="renderCard.number"
                :masked="!quickRevealed"
                :cvc="quickRevealed ? '824' : '***'"
                :animate-in="false"
              />
            </div>
            <button
              type="button"
              class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#f6f7f9]"
              :aria-pressed="quickRevealed"
              @click="quickRevealed = !quickRevealed"
            >
              <img :src="panelEyeImg" width="18" height="18" alt="" class="shrink-0 -mx-[2px]" />
              <span class="text-[14px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap">{{ quickRevealed ? 'Hide card details' : 'Show card details' }}</span>
            </button>
          </div>

          <div class="flex flex-col items-center gap-[12px] w-full">
            <!-- Card details table -->
            <div class="flex flex-col gap-[8px] w-full">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Card details</p>
              <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden">
                <div
                  v-for="(f, i) in quickFields"
                  :key="f.label"
                  class="flex items-center gap-[8px] bg-white"
                  :class="{ 'border-b border-[#e5e6ea]': i < quickFields.length - 1 }"
                >
                  <span class="flex-1 min-w-0 px-[12px] py-[8px] text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ f.label }}</span>
                  <span
                    class="min-w-[88px] px-[12px] py-[4px] text-right whitespace-nowrap overflow-hidden text-ellipsis"
                    :class="f.status ? 'text-[12px] font-medium leading-[1.5]' : 'text-[14px] font-normal text-[#03102f] leading-[1.5]'"
                    :style="f.status ? { color: STATUS[renderCard.status].color } : null"
                  >{{ f.value }}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="flex items-center justify-center h-[28px] px-[8px] mb-[8px] rounded-[8px] cursor-pointer hover:opacity-75 transition-opacity"
              @click="viewCard(renderCard)"
            >
              <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">View more →</span>
            </button>

            <!-- Spend this month -->
            <div class="flex items-center gap-[8px] w-full rounded-[8px] border border-[#e5e6ea] p-[12px] text-[#03102f] font-medium">
              <p class="flex-1 min-w-0 text-[14px] leading-[1.5]">Spend this month</p>
              <p class="text-[16px] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ renderCard.spent }}</p>
            </div>
          </div>
        </div>
      </div>

    <!-- Create card page — fills the main content area so the sidebar stays visible -->
    <Transition name="full-page">
      <CreateCardPage v-if="createCardOpen" @close="createCardOpen = false" @create="onCardCreated" />
    </Transition>

    <!-- Card created success (Figma: Card-Issuing 467:17054) -->
    <Transition name="full-page">
      <CardCreatedPage
        v-if="createdCard"
        :card="createdCard"
        @close="createdCard = null"
        @view="viewCard"
        @create-another="createAnotherCard"
      />
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
import CardCreatedPage from './CardCreatedPage.vue'
import HitPayCard from '../content/HitPayCard.vue'
import NavTooltip from '../navigation/NavTooltip.vue'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'
import emptyBlurImg from '../../assets/images/cards-empty-blur.svg'
import emptyBlurHoverImg from '../../assets/images/cards-empty-blur-hover.svg'
import thumbEllipse1Img from '../../assets/images/cards-thumb-ellipse-1.svg'
import thumbEllipse2Img from '../../assets/images/cards-thumb-ellipse-2.svg'
import thumbMastercardImg from '../../assets/images/cards-thumb-mastercard.svg'
import thumbHalftoneImg from '../../assets/images/cards-empty-halftone.png'
import thumbHalftone2Img from '../../assets/images/cards-empty-halftone-2.png'
import rowSeparatorImg from '../../assets/images/cards-list-separator.svg'
import tileDotsImg from '../../assets/images/cards-list-dots.svg'
import tileCopyImg from '../../assets/images/cards-list-copy.svg'
import panelEyeImg from '../../assets/images/cards-panel-eye.svg'
import panelMastercardImg from '../../assets/images/cards-panel-mastercard.svg'
import closeIcon from '../../assets/icons/icon-modal-x.svg'

// Preview switcher: true = empty/onboarding state, false = cards list (Figma: 266:18620)
const isEmpty = ref(true)

const STATUS = {
  active: { label: 'Active', bg: '#e6f9f0', color: '#238b5b' },
  frozen: { label: 'Frozen', bg: '#f2f2f4', color: '#484d61' },
  canceled: { label: 'Canceled', bg: '#f9e9e9', color: '#c20a1c' },
}

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

// ── Quick-view panel (Figma: Card-Issuing 390:12174) ──
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
// renderCard keeps the last card rendered while the panel fades out
const quickCard = ref(null)
const renderCard = ref(null)

// Sensitive details start hidden and re-hide whenever another card opens
const quickRevealed = ref(false)

// Container transform: a white shell grows out of the clicked row into the
// panel's frame (row content fading out inside it), then the panel takes
// over and its content fades in. Closing runs it backwards into the row.
// The shell is a fixed element on <body> so nothing on the page clips it.
const quickPanelEl = ref(null)
const panelLanded = ref(false)
// The row that "became" the panel is taken out of the list (removedRowId)
// so the others close the gap. On close it comes back invisible
// (liftedRowId) to give the panel a slot to collapse into, then shows.
const removedRowId = ref(null)
const liftedRowId = ref(null)
const listedCards = computed(() => cards.filter((c) => c.id !== removedRowId.value))
let activeShell = null

const MORPH_MS = 460
const MORPH_EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
const ROW_SHADOW = '0px 3px 22px 0px rgba(38, 42, 50, 0.09)'
const PANEL_SHADOW = '-16px 24px 120px 0px rgba(38, 42, 50, 0.2)'
// The list gives the panel 480px more right padding (504 vs 24) while open
const LIST_PANEL_GUTTER = 480

// A static copy of a row for the shell (the live row may leave the list)
function copyRow(row) {
  const copy = row.cloneNode(true)
  copy.removeAttribute('data-card-id')
  copy.classList.remove('opacity-0')
  return copy
}
const rowFor = (card) => document.querySelector(`.card-row[data-card-id="${card.id}"]`)
const box = (r) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` })

// Animate a shell from one rect to another, with a copy of the row inside
// that fades out (opening) or in (closing). Resolves with the shell still on
// screen so the caller can swap in the real element before removing it.
async function morphShell(rowCopy, from, to, { opening }) {
  activeShell?.remove()
  const shell = document.createElement('div')
  shell.style.cssText = 'position:fixed;z-index:70;pointer-events:none;overflow:hidden;box-sizing:border-box;background:#fff;border:1px solid #e5e6ea;'
  Object.assign(shell.style, box(from))
  // The row's own markup (scoped styles still apply), pinned to the row's width
  const rowWidth = opening ? from.width : to.width
  const ghost = rowCopy
  Object.assign(ghost.style, { position: 'absolute', left: '-1px', top: '-1px', width: `${rowWidth}px`, margin: '0', borderColor: 'transparent', boxShadow: 'none' })
  shell.appendChild(ghost)
  document.body.appendChild(shell)
  activeShell = shell

  const rowLook = { borderRadius: '12px', boxShadow: ROW_SHADOW }
  const panelLook = { borderRadius: '8px', boxShadow: PANEL_SHADOW }
  const timing = { duration: MORPH_MS, easing: MORPH_EASE, fill: 'forwards' }
  const shellAnim = shell.animate([
    { ...box(from), ...(opening ? rowLook : panelLook) },
    { ...box(to), ...(opening ? panelLook : rowLook) },
  ], timing)
  // The row copy fades on its own short, linear clock so it's actually seen
  // leaving (opening) or arriving (closing) rather than snapping
  const FADE_MS = 200
  ghost.animate(
    opening ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
    { duration: FADE_MS, delay: opening ? 0 : MORPH_MS - FADE_MS, easing: 'linear', fill: 'both' },
  )
  try { await shellAnim.finished } catch { return null }
  return shell
}

function dropShell(shell) {
  if (!shell) return
  shell.remove()
  if (activeShell === shell) activeShell = null
}

async function openQuickView(card) {
  const switching = !!quickCard.value && panelLanded.value
  if (renderCard.value?.id !== card.id) quickRevealed.value = false
  quickCard.value = card
  renderCard.value = card
  // Already open: just swap what the panel shows (and which row it came from)
  if (switching) {
    removedRowId.value = card.id
    return
  }

  const row = rowFor(card)
  const from = row?.getBoundingClientRect()
  const rowCopy = row && copyRow(row)
  panelLanded.value = false
  removedRowId.value = card.id
  await nextTick()
  const to = quickPanelEl.value?.getBoundingClientRect()
  if (!row || !from || !to || prefersReducedMotion()) {
    panelLanded.value = true
    return
  }
  const shell = await morphShell(rowCopy, from, to, { opening: true })
  if (!shell) return
  if (quickCard.value?.id === card.id) panelLanded.value = true
  await nextTick()
  dropShell(shell)
}

async function closeQuickView() {
  const card = renderCard.value
  const from = quickPanelEl.value?.getBoundingClientRect()
  quickCard.value = null
  quickRevealed.value = false
  panelLanded.value = false
  // Put the row back (invisible) so the others slide apart around its slot
  if (card) liftedRowId.value = card.id
  removedRowId.value = null
  await nextTick()
  const row = card && rowFor(card)
  if (!row || !from || prefersReducedMotion()) {
    liftedRowId.value = null
    return
  }
  // Aim for where the row ends up once the list has widened back
  const r = row.getBoundingClientRect()
  const to = { left: r.left, top: r.top, width: r.width + LIST_PANEL_GUTTER, height: r.height }
  const shell = await morphShell(copyRow(row), from, to, { opening: false })
  if (!shell) return
  if (!quickCard.value) liftedRowId.value = null
  await nextTick()
  dropShell(shell)
}

function onQuickViewKeydown(e) {
  if (e.key === 'Escape' && quickCard.value) closeQuickView()
}

// Expiry and CVC mirror the mock values on the card details page
const quickFields = computed(() => {
  const c = renderCard.value
  if (!c) return []
  return [
    { label: 'Card number', value: quickRevealed.value ? c.number : `**** **** **** ${last4(c)}` },
    { label: 'Nickname', value: c.nickname },
    { label: 'Expiration', value: '10/2030' },
    { label: 'CVC', value: quickRevealed.value ? '824' : '***' },
    { label: 'Status', value: STATUS[c.status].label, status: true },
  ]
})

// "View more" → card details page

const router = useRouter()
function viewCard(card) {
  router.push({ path: '/cards/details', query: { id: card.id } })
}

// Create card full-page overlay, then the success screen for the new card
const createCardOpen = ref(false)
const createdCard = ref(null)

// New card lands in the grid; snackbar confirms and fades after a moment
const toast = ref('')
let toastTimer = null

function onCardCreated({ nickname, holder, number }) {
  createdCard.value = addCard({ nickname, holder, number })
  createCardOpen.value = false
  isEmpty.value = false // a card now exists — the list sits behind the success screen
}

// Success screen → straight back into a fresh create card form
function createAnotherCard() {
  createdCard.value = null
  createCardOpen.value = true
}

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

// Arriving with a queued message (e.g. after cancelling a card) shows it here
onMounted(() => {
  window.addEventListener('keydown', onQuickViewKeydown)
  if (pendingToast.value) {
    showToast(pendingToast.value)
    pendingToast.value = ''
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', onQuickViewKeydown)
  clearTimeout(toastTimer)
  clearTimeout(copiedTimer)
})
</script>

<style scoped>
/* Row card thumbnail — same face as HitPayCard, at 64×40 */
.card-thumb {
  background-image:
    linear-gradient(90deg, #2465de 0%, #2465de 100%),
    linear-gradient(-58.27deg, rgba(255, 255, 255, 0) 0.78%, rgba(246, 248, 250, 0.6) 44.26%);
  box-shadow:
    0px 31.52px 8.8px 0px rgba(23, 29, 109, 0),
    0px 20.16px 8.16px 0px rgba(23, 29, 109, 0.01),
    0px 11.36px 6.88px 0px rgba(23, 29, 109, 0.04),
    0px 5.12px 5.12px 0px rgba(23, 29, 109, 0.07),
    0px 1.28px 2.72px 0px rgba(23, 29, 109, 0.08);
}

/* Card row hover: lift with the normal shadow and reveal the copy button */
.card-row {
  transition: box-shadow 200ms ease;
}
.card-row:hover {
  box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
.card-row__copy {
  opacity: 0;
  transition: opacity 200ms ease;
}
.card-row:hover .card-row__copy,
.card-row:focus-visible .card-row__copy {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .card-row, .card-row__copy { transition: none; }
}

/* Card list reflow while a row is out as the panel: the leaving row drops
   out of the flow at once (the shell stands in for it), the rest glide */
.row-shift-move { transition: transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1); }
.row-shift-leave-active { position: absolute; width: 100%; opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .row-shift-move { transition: none; }
}

/* Quick-view panel content fades up once the row-to-panel shell lands */
.quick-panel__fade {
  opacity: 0;
  transform: translateY(6px);
}
.quick-panel.is-landed .quick-panel__fade {
  opacity: 1;
  transform: none;
  transition: opacity 220ms ease-out, transform 220ms ease-out;
}
.quick-panel.is-landed .quick-panel__fade--late { transition-delay: 60ms; }

@media (prefers-reduced-motion: reduce) {
  .quick-panel.is-landed .quick-panel__fade { transition: none; }
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
