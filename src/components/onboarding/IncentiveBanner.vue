<template>
  <Transition name="banner-swap" mode="out-in">

    <!-- Minimized: slim pill bar (Figma 193:20483) -->
    <div
      v-if="incentiveMinimized"
      key="mini"
      class="rounded-full overflow-hidden mb-5"
      style="border: 1px solid #e5e6ea;"
    >
      <div
        class="flex items-center"
        style="padding: 8px 16px; gap: 16px; background: linear-gradient(90deg, #f4fbee 0%, #effbf5 15%, #f7fcf9 55%, #f1fcf7 100%);"
      >
        <div class="text-[14px] font-medium text-[#03102f] whitespace-nowrap" style="line-height: 1.5;">
          Unlock free transaction fees
        </div>

        <!-- Progress pill -->
        <div class="flex items-center bg-white rounded-full shrink-0" style="width: 273px; padding: 4px 8px; gap: 4px;">
          <div class="flex-1 rounded-full overflow-hidden" style="height: 8px; background: #f2f2f4;">
            <div
              class="h-full rounded-full"
              style="background: #2364dd; transition: width 600ms cubic-bezier(0.32, 0.72, 0, 1);"
              :style="{ width: (incentiveTxCount / 10) * 100 + '%' }"
            ></div>
          </div>
          <div class="text-[12px] font-medium whitespace-nowrap" style="line-height: 1.5;">
            <span class="text-[#03102f]">{{ incentiveTxCount }}</span><span class="text-[#61667c]">/10 transactions</span>
          </div>
        </div>
        <!-- Countdown -->
        <div class="flex flex-1 items-center justify-end min-w-0" style="padding: 4px 16px;">
          <span class="whitespace-nowrap" style="font-family: 'Reddit Mono', monospace; font-size: 14px; font-weight: 600; color: #03102f; line-height: 1.4;">
            {{ countdown.d }}d : {{ countdown.h }}h : {{ countdown.m }}m : {{ countdown.s }}s
          </span>
        </div>
      </div>
    </div>

    <!-- Expanded: full banner -->
    <div v-else key="full" class="rounded-[12px] overflow-hidden mb-5" style="border: 1px solid #e9eaee;">

        <!-- Gradient hero section -->
        <div
          class="flex items-center justify-between"
          style="padding: 20px 24px; gap: 32px; background: linear-gradient(90deg, #f4fbee 0%, #effbf5 15%, #f7fcf9 55%, #f1fcf7 100%);"
        >
          <!-- In-progress copy + countdown (0/10 and 4/10 states) -->
          <template v-if="incentiveState !== 'completed'">
            <div class="flex flex-col" style="gap: 6px; max-width: 460px;">
              <div class="text-[16px] font-semibold text-[#03102f]">Unlock free transaction fees</div>
              <div class="text-[13px] text-[#61667c]" style="line-height: 1.55;">
                Accept 10 PayNow payments in your first 14 days and we'll waive the fee on all 10
              </div>
            </div>

            <!-- Countdown + progress card -->
            <div class="shrink-0 rounded-[12px] bg-white" style="padding: 12px 16px; box-shadow: 0px 3px 14px 0px rgba(37,41,49,0.06);">
              <div
                class="flex items-center justify-center rounded-full"
                style="background: #f8f9fc; padding: 6px 16px; gap: 10px; font-family: 'Reddit Mono', monospace; font-size: 15px; font-weight: 500; color: #03102f;"
              >
                <span>{{ countdown.d }}d</span><span class="cd-sep">:</span>
                <span>{{ countdown.h }}h</span><span class="cd-sep">:</span>
                <span>{{ countdown.m }}m</span><span class="cd-sep">:</span>
                <span>{{ countdown.s }}s</span>
              </div>
              <div class="flex items-center" style="gap: 10px; margin-top: 10px;">
                <div class="flex-1 rounded-full overflow-hidden" style="height: 6px; background: #e9ebf0; min-width: 130px;">
                  <div
                    class="h-full rounded-full"
                    style="background: #2364dd; transition: width 600ms cubic-bezier(0.32, 0.72, 0, 1);"
                    :style="{ width: (incentiveTxCount / 10) * 100 + '%' }"
                  ></div>
                </div>
                <div class="text-[12px] text-[#61667c] shrink-0 leading-none">
                  <span class="font-semibold text-[#03102f]">{{ incentiveTxCount }}</span>/10 transactions
                </div>
              </div>
            </div>
          </template>

          <!-- Completed: Total Saved widget + congrats copy -->
          <template v-else>
            <div class="flex items-center" style="gap: 28px;">
              <!-- Animated gradient border -->
              <div class="saved-border shrink-0">
                <div class="saved-inner flex flex-col items-center justify-center">
                  <div class="flex flex-col items-center w-full" style="gap: 4px; padding: 4px 0;">
                    <div class="text-[12px] text-[#03102f]" style="line-height: 1.5;">Total saved</div>
                    <div style="font-family: 'Reddit Mono', monospace; font-size: 16px; font-weight: 500; color: #238b5b; line-height: 1.4;">
                      SGD 18.90
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col" style="gap: 6px;">
                <div class="text-[16px] font-semibold text-[#03102f]">Your first 10 transactions were on us — congrats!</div>
                <div class="text-[13px] text-[#61667c]" style="line-height: 1.55; max-width: 480px;">
                  You hit 10 PayNow payments within 14 days, so we waived the fee on every one of them.
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- "Start accepting payment with" chips (in-progress states only) -->
        <div v-if="incentiveState !== 'completed'" class="bg-white" style="border-top: 1px solid #eef0f3; padding: 14px 24px 16px;">
          <div class="text-[11px] font-medium" style="letter-spacing: 0.08em; color: #8093b8;">START ACCEPTING PAYMENT WITH</div>
          <div class="flex flex-wrap items-center" style="gap: 8px; margin-top: 10px;">
            <button
              v-for="chip in chips"
              :key="chip.label"
              class="flex items-center rounded-full bg-white text-[13px] text-[#03102f] hover:bg-[#f8f9fc] transition-colors duration-150"
              style="gap: 7px; padding: 6px 14px 6px 11px; border: 1px solid #e5e6ea;"
            >
              <img :src="chip.icon" width="15" height="15" style="opacity: 0.75;" />
              {{ chip.label }}
            </button>
          </div>
        </div>

    </div>

  </Transition>
</template>

<script>
// Module-level deadline so the countdown survives remounts (state switching)
const DEADLINE = Date.now() + ((12 * 24 + 12) * 60 * 60 + 32 * 60 + 21) * 1000
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useIncentive } from '../../composables/useIncentive'
import linkIcon from '../../assets/icons/icon-link.svg'
import puzzleIcon from '../../assets/icons/icon-puzzle.svg'
import counterIcon from '../../assets/icons/icon-counter.svg'
import terminalIcon from '../../assets/icons/icon-terminal.svg'
import codeIcon from '../../assets/icons/icon-code.svg'
import qrCodeIcon from '../../assets/icons/icon-qr-code.svg'
import repeatIcon from '../../assets/icons/icon-repeat.svg'
import receiptIcon from '../../assets/icons/icon-receipt.svg'
import mallIcon from '../../assets/icons/icon-mall.svg'

const { incentiveState, incentiveMinimized, incentiveTxCount } = useIncentive()

const chips = [
  { label: 'Payment Links',      icon: linkIcon },
  { label: 'Ecommerce Plugins',  icon: puzzleIcon },
  { label: 'Point of Sales',     icon: counterIcon },
  { label: 'Card Terminals',     icon: terminalIcon },
  { label: 'APIs',               icon: codeIcon },
  { label: 'Static QRs',         icon: qrCodeIcon },
  { label: 'Recurring Billings', icon: repeatIcon },
  { label: 'Invoicing',          icon: receiptIcon },
  { label: 'Online Store',       icon: mallIcon },
]

// Live countdown to the 14-day deadline
const countdown = ref({ d: 12, h: 12, m: 32, s: 21 })
let timer = null
function tick() {
  const remain = Math.max(0, Math.floor((DEADLINE - Date.now()) / 1000))
  countdown.value = {
    d: Math.floor(remain / 86400),
    h: Math.floor((remain % 86400) / 3600),
    m: Math.floor((remain % 3600) / 60),
    s: remain % 60,
  }
}
onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
/* Minimize/expand — quick out-in swap between the full banner and the pill bar */
.banner-swap-enter-active {
  transition: opacity 220ms ease-out, transform 260ms cubic-bezier(0.32, 0.72, 0, 1);
}
.banner-swap-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.banner-swap-enter-from,
.banner-swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.cd-sep {
  color: #a6b3cd;
  font-weight: 400;
}

/* ── Total Saved: animated gradient border ──
   Conic gradient sweep rotating around the card via a registered custom
   property; the inner card sits 1.5px inset so only the ring animates. */
@property --spin {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.saved-border {
  /* Figma: 1px border success/400 #4dd898 — animated as a rotating sweep */
  padding: 1px;
  border-radius: 8px;
  /* Pale-green ring with one brighter green arc — a visible highlight
     sweeping around the card without washing the border out to white */
  background: conic-gradient(
    from var(--spin),
    #4dd898 0deg,
    #a5ecce 60deg,
    #e6f9f0 130deg,
    #e6f9f0 230deg,
    #a5ecce 300deg,
    #4dd898 360deg
  );
  animation: spin-border 3.2s linear infinite;
}

@keyframes spin-border {
  to { --spin: 360deg; }
}

.saved-inner {
  border-radius: 7px;
  /* Figma: gradient-to-top, white → success/50 */
  background: linear-gradient(0deg, #ffffff 0%, #e6f9f0 100%);
  padding: 16px;
}

@media (prefers-reduced-motion: reduce) {
  .banner-swap-enter-active,
  .banner-swap-leave-active { transition: none; }
  .saved-border { animation: none; }
}
</style>
