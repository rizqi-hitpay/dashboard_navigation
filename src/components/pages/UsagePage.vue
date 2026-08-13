<template>
  <!-- Settings › Billing › Usage — "Pay as you go" (Figma: Usage-Billing 1:2719) -->
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="flex flex-col gap-[8px] px-[24px] py-[12px] w-full shrink-0">
        <p class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap">Pay as you go</p>
        <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Enable features and pay only for what you use. Rates decrease as your volume grows.</p>
      </div>

      <!-- Content with sub-sidebar -->
      <div class="flex items-start gap-[32px] w-full flex-1 pl-[16px] pr-[24px] py-[12px]">

        <!-- Feature sub-menu -->
        <div class="flex flex-col gap-[8px] w-[280px] shrink-0">
          <button
            v-for="f in features"
            :key="f.key"
            type="button"
            class="flex items-center px-[8px] py-[4px] rounded-[8px] w-full text-left transition-colors duration-150"
            :class="activeKey === f.key ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-[rgba(0,39,113,0.04)]'"
            @click="activeKey = f.key"
          >
            <span
              class="text-[14px] leading-[1.5] whitespace-nowrap"
              :class="activeKey === f.key ? 'font-medium text-[#002771]' : 'font-normal text-[#61667c]'"
            >{{ f.label }}</span>
          </button>
        </div>

        <!-- Main content -->
        <div class="flex flex-1 min-w-0 flex-col gap-[24px] pb-[12px]">
          <div class="flex flex-col gap-[4px] w-full">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ feature.label }}</p>
            <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">{{ feature.desc }}</p>
          </div>

          <!-- Plan list: tiers + estimator -->
          <div class="flex items-stretch w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden">

            <!-- Tier rows -->
            <div class="flex flex-1 min-w-0 flex-col bg-white">
              <div
                v-for="(tier, i) in feature.tiers"
                :key="tier.label"
                class="flex flex-col gap-[4px] px-[12px] py-[8px] w-full"
                :class="i < feature.tiers.length - 1 || feature.baseFee ? 'border-b border-[#e5e6ea]' : ''"
              >
                <div class="flex items-center gap-[8px] w-full">
                  <!-- All blue at rest; narrows to the matching tier while the cursor is on the estimator -->
                  <img :src="!highlightTier || i === activeTierIndex ? checkActiveIcon : checkIcon" width="14" height="14" alt="" class="shrink-0" />
                  <p class="flex-1 min-w-0 text-[14px] font-medium text-black leading-[1.5]">{{ tier.label }}</p>
                </div>
                <div class="flex items-center pl-[22px] w-full">
                  <p class="flex-1 min-w-0 text-[12px] font-normal text-[#03102f] leading-[1.5]">{{ tier.price }}</p>
                </div>
              </div>

              <!-- Monthly base fee band (eGiro) -->
              <div v-if="feature.baseFee" class="flex flex-1 flex-col items-center justify-center gap-[2px] px-[12px] py-[16px] w-full bg-[#f8f9fc]">
                <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] text-center">Monthly base fee</p>
                <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] text-center">{{ feature.baseFeeLabel }}</p>
              </div>
            </div>

            <!-- Estimator -->
            <div
              class="flex flex-1 min-w-0 flex-col justify-between self-stretch bg-[#f8f9fc] border-l border-[#e5e6ea]"
              @mouseenter="estimatorHover = true"
              @mouseleave="estimatorHover = false"
            >
              <div class="flex flex-col gap-[12px] px-[12px] py-[8px] w-full">
                <div class="flex items-center gap-[8px] pr-[8px] w-full">
                  <p class="flex-1 min-w-0 text-[14px] font-medium text-black leading-[1.5]">Estimate your cost</p>
                  <p class="shrink-0 text-[14px] font-medium text-[#2465de] leading-[1.5] text-right whitespace-nowrap">{{ fmtCount(units) }} {{ feature.countUnit }}</p>
                </div>

                <div class="flex flex-col w-full rounded-[8px] border border-[#f2f2f4] bg-white">
                  <!-- Slider card -->
                  <div class="flex flex-col px-[8px] pt-[8px] pb-[16px] w-full rounded-[8px] bg-white" style="box-shadow: 0px 3px 11px 0px rgba(38,42,50,0.09);">
                    <div class="relative flex flex-col gap-[4px] w-full">
                      <input
                        v-model.number="units"
                        type="range"
                        min="0"
                        :max="feature.max"
                        :step="feature.step"
                        class="usage-slider w-full"
                        :style="{ '--pct': sliderPct }"
                        @pointerdown="sliding = true"
                      />
                      <div class="flex items-center justify-between w-full text-[13px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">
                        <span>0</span>
                        <span class="text-right">{{ feature.maxLabel }}</span>
                      </div>
                      <!-- Value tooltip: 2px below the knob, only while dragging (Figma: Indicator top 16 vs knob bottom 14) -->
                      <Transition name="slider-tip">
                        <div
                          v-if="sliding"
                          class="absolute top-[22px] z-10 flex flex-col items-center justify-center px-[6px] py-[3px] rounded-[4px] bg-[#03102f] -translate-x-1/2 pointer-events-none"
                          :style="{ left: `calc(${sliderPct} * (100% - 20px) + 10px)` }"
                        >
                          <p class="text-[12px] font-medium text-white leading-[20px] whitespace-nowrap">{{ fmtCount(units) }}</p>
                        </div>
                      </Transition>
                    </div>
                  </div>
                  <div class="flex items-center gap-[8px] p-[12px] w-full">
                    <p class="flex-1 min-w-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Estimated monthly cost</p>
                    <p class="shrink-0 text-[14px] font-semibold text-[#2465de] leading-[1.4] text-right whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">SGD {{ estimatedCost }}</p>
                  </div>
                </div>
              </div>

              <!-- Turn on -->
              <div class="flex flex-col items-end justify-center p-[12px] w-full bg-white border-t border-[#e5e6ea]">
                <button
                  v-if="!feature.enabled"
                  type="button"
                  class="flex items-center justify-center min-w-[100px] h-[28px] px-[8px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                  @click="turnOn"
                >
                  <span class="text-[12px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Turn on</span>
                </button>
                <button
                  v-else
                  type="button"
                  class="flex items-center justify-center min-w-[100px] h-[28px] px-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                  @click="feature.enabled = false"
                >
                  <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Turn off</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success snackbar -->
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
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import checkIcon from '../../assets/icons/icon-check-tier.svg'
import checkActiveIcon from '../../assets/icons/icon-check-tier-active.svg'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'

// Tier `rate` is the marginal price per unit inside [from, to]; the estimator
// sums each band, so cost grows piecewise like the real billing engine would
const features = reactive([
  {
    key: 'manual',
    label: 'Manual payments',
    desc: 'Cash, offline, and bank transfer payments recorded via POS or Invoice.',
    countUnit: 'transactions',
    maxLabel: '5,001+',
    max: 6000,
    step: 1,
    default: 4321,
    enabled: false,
    tiers: [
      { label: '1–10 transactions', price: 'FREE', from: 1, to: 10, rate: 0 },
      { label: '11–50 transactions', price: 'SGD 0.10/transaction', from: 11, to: 50, rate: 0.1 },
      { label: '51–500 transactions', price: 'SGD 0.02/transaction', from: 51, to: 500, rate: 0.02 },
      { label: '501–5,000 transaction', price: 'SGD 0.01/transaction', from: 501, to: 5000, rate: 0.01 },
      { label: '5,001+ transaction', price: 'SGD 0.005/transaction', from: 5001, to: Infinity, rate: 0.005 },
    ],
  },
  {
    key: 'sms',
    label: 'SMS receipts',
    desc: 'Send receipts via SMS to your customers.',
    countUnit: 'send',
    maxLabel: '5,001+',
    max: 6000,
    step: 1,
    default: 4321,
    enabled: false,
    tiers: [
      { label: '1–5 SMS', price: 'FREE', from: 1, to: 5, rate: 0 },
      { label: '6–500 SMS', price: 'SGD 0.025/SMS', from: 6, to: 500, rate: 0.025 },
      { label: '501–5,000 SMS', price: 'SGD 0.02/SMS', from: 501, to: 5000, rate: 0.02 },
      { label: '5,001+ SMS', price: 'SGD 0.01/SMS', from: 5001, to: Infinity, rate: 0.01 },
    ],
  },
  {
    key: 'egiro',
    label: 'eGiro (DBS direct debit)',
    desc: 'Accept direct debit payments via DBS eGiro.',
    countUnit: 'auth',
    maxLabel: '500+',
    max: 600,
    step: 1,
    default: 411,
    enabled: false,
    baseFee: 15,
    baseFeeLabel: 'SGD 15.00/month',
    tiers: [
      { label: '1–100 auths', price: 'FREE', from: 1, to: 100, rate: 0 },
      { label: '101+ auths', price: 'SGD 0.10/auth', from: 101, to: Infinity, rate: 0.1 },
    ],
  },
])

const activeKey = ref('manual')
const feature = computed(() => features.find((f) => f.key === activeKey.value))

// Per-feature slider position, seeded from each feature's default
const unitsByKey = reactive(Object.fromEntries(features.map((f) => [f.key, f.default])))

// Checks are all-blue at rest; while the cursor is over the estimator (or the
// knob is mid-drag), the highlight narrows to the tier matching the slider value
const estimatorHover = ref(false)
const sliding = ref(false)
const highlightTier = computed(() => estimatorHover.value || sliding.value)

const stopSliding = () => { sliding.value = false }
onMounted(() => window.addEventListener('pointerup', stopSliding))
const units = computed({
  get: () => unitsByKey[activeKey.value],
  set: (v) => { unitsByKey[activeKey.value] = v },
})

const sliderPct = computed(() => (feature.value.max ? units.value / feature.value.max : 0))

const activeTierIndex = computed(() =>
  feature.value.tiers.findIndex((t) => units.value >= t.from && units.value <= t.to),
)

const estimatedCost = computed(() => {
  const cost = feature.value.tiers.reduce((sum, t) => {
    if (units.value < t.from) return sum
    const upper = Math.min(units.value, t.to)
    return sum + (upper - t.from + 1) * t.rate
  }, feature.value.baseFee || 0)
  return cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

function fmtCount(n) {
  return n.toLocaleString('en-US')
}

function turnOn() {
  feature.value.enabled = true
  showToast(`${feature.value.label} has been turned on`)
}

// Snackbar — same one-shot toast recipe as the card pages
const toast = ref('')
let toastTimer = null

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

onUnmounted(() => {
  clearTimeout(toastTimer)
  window.removeEventListener('pointerup', stopSliding)
})
</script>

<style scoped>
/* Range slider — 8px track with blue fill up to --pct, 20px white knob (Figma: Slider 2233:18119) */
.usage-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  background: transparent;
  outline: none;
  cursor: pointer;
  margin: 0;
}
.usage-slider::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 16px;
  background: linear-gradient(to right, #2465de 0%, #2465de calc(var(--pct) * 100%), #f2f2f4 calc(var(--pct) * 100%), #f2f2f4 100%);
}
.usage-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  margin-top: -6px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0px 0px 0px 1px rgba(3, 16, 47, 0.08), 0px 2px 6px 0px rgba(38, 42, 50, 0.24);
}
.usage-slider::-moz-range-track {
  height: 8px;
  border-radius: 16px;
  background: #f2f2f4;
}
.usage-slider::-moz-range-progress {
  height: 8px;
  border-radius: 16px;
  background: #2465de;
}
.usage-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0px 0px 0px 1px rgba(3, 16, 47, 0.08), 0px 2px 6px 0px rgba(38, 42, 50, 0.24);
}

/* Slider tooltip fade */
.slider-tip-enter-active { transition: opacity 120ms ease-out; }
.slider-tip-leave-active { transition: opacity 100ms ease-in; }
.slider-tip-enter-from,
.slider-tip-leave-to { opacity: 0; }

/* Snackbar motion — same as CardsPage */
.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .snackbar-enter-active, .snackbar-leave-active,
  .slider-tip-enter-active, .slider-tip-leave-active { transition: none; }
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
}
</style>
