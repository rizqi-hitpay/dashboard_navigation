<template>
  <!-- Pointer stage: the whole box tracks the cursor, not just the card -->
  <div
    ref="stageEl"
    class="hp-card-stage flex items-center justify-center"
    aria-hidden="true"
    :style="stageStyle"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <!-- Rise in → tilt toward cursor → idle float; separate layers so the
         transforms don't fight -->
    <div class="shrink-0" :class="{ 'hp-card-enter': animateIn }" :style="{ width: W * scale + 'px', height: H * scale + 'px' }" @animationend.self="emit('entered')">
      <div class="hp-card-tilt">
        <div :class="{ 'hp-card-float': idle }" :style="{ width: W * scale + 'px', height: H * scale + 'px' }">
          <!-- Card face, drawn at the Figma 400×250 size and scaled to fit
               (Figma: Card-Issuing 467:17735) -->
          <div
            class="hp-card-face relative overflow-hidden backdrop-blur-[25px] rounded-[17.493px]"
            :style="{ width: W + 'px', height: H + 'px', transform: `scale(${scale})` }"
          >
            <!-- Soft light blobs (drift opposite the cursor) -->
            <div class="hp-card-blob absolute flex items-center justify-center mix-blend-hard-light left-[-56.76px] top-[141.26px] w-[407.433px] h-[285.27px]">
              <div class="relative w-[386.6px] h-[251.957px] rotate-[5.09deg]">
                <img :src="ellipse1Img" alt="" class="absolute max-w-none left-[-200px] top-[-200px]" width="786.6" height="651.957" />
              </div>
            </div>
            <div class="hp-card-blob hp-card-blob--far absolute flex items-center justify-center mix-blend-hard-light left-[157.86px] top-[-18.91px] w-[506.675px] h-[463.745px]">
              <div class="relative w-[414.089px] h-[295.933px] rotate-[30.11deg]">
                <img :src="ellipse2Img" alt="" class="absolute max-w-none left-[-200px] top-[-200px]" width="814.089" height="695.933" />
              </div>
            </div>

            <!-- Halftone texture -->
            <div class="absolute inset-0 mix-blend-overlay opacity-10 pointer-events-none">
              <div class="absolute inset-0 opacity-20" :style="{ backgroundImage: `url(${halftoneImg})`, backgroundSize: '3px 3px' }" />
              <div class="absolute inset-0 opacity-50" :style="{ backgroundImage: `url(${halftoneImg})`, backgroundSize: '3px 3px' }" />
              <div class="absolute inset-0" :style="{ backgroundImage: `url(${halftone2Img})`, backgroundSize: '3px 3px' }" />
            </div>

            <img :src="mastercardImg" alt="" class="absolute left-[24px] top-[20px]" width="58.2461" height="36.0001" />
            <div class="absolute flex items-end gap-[10.501px] right-[17.65px] top-[20px]">
              <img :src="logogramImg" alt="" width="32.0415" height="32" />
              <img :src="logotextImg" alt="" width="88.8121" height="27.1982" />
            </div>

            <p class="absolute left-[24.13px] top-[92.83px] text-[12px] font-medium text-white leading-[1.5] uppercase whitespace-nowrap" :style="mono">{{ nickname }}</p>

            <!-- Card number: masked dots + last 4, or the full number -->
            <div class="absolute flex items-center gap-[10px] left-[24.13px] top-[123px] text-[18px] font-medium text-white leading-[1.35] whitespace-nowrap" :style="mono">
              <template v-if="masked">
                <img v-for="n in 3" :key="n" :src="dotsImg" alt="" width="36" height="6" />
                <span>{{ groups[groups.length - 1] }}</span>
              </template>
              <span v-for="(g, i) in groups" v-else :key="i">{{ g }}</span>
            </div>

            <div class="absolute flex items-center gap-[32px] left-[24.13px] top-[187px] font-medium text-white leading-[1.5] whitespace-nowrap">
              <div v-for="d in details" :key="d.label" class="flex flex-col">
                <p class="text-[12px]" :style="mono">{{ d.label }}</p>
                <p class="text-[14px]">{{ d.value }}</p>
              </div>
            </div>

            <!-- Specular glare that tracks the cursor -->
            <div class="hp-card-glare absolute inset-0 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ellipse1Img from '../../assets/images/hitpay-card-ellipse-1.svg'
import ellipse2Img from '../../assets/images/hitpay-card-ellipse-2.svg'
import halftoneImg from '../../assets/images/cards-empty-halftone.png'
import halftone2Img from '../../assets/images/cards-empty-halftone-2.png'
import mastercardImg from '../../assets/icons/logo-mastercard-card.svg'
import logogramImg from '../../assets/icons/logo-hitpay-white.svg'
import logotextImg from '../../assets/icons/hitpay-logotext-white.svg'
import dotsImg from '../../assets/icons/card-dots.svg'

// HitPay card art with its signature motion: rises in from below, floats,
// and on hover tilts toward the cursor in 3D while a glare and the light
// blobs follow it. Used by the Cards empty state (scaled down) and the
// card-created success screen (full size).
const props = defineProps({
  nickname: { type: String, default: 'Travel card' },
  holder: { type: String, default: '' },
  number: { type: String, default: '' },
  expiry: { type: String, default: '10/30' },
  masked: { type: Boolean, default: false },
  cvc: { type: String, default: '***' },
  // Rise in from below on mount
  animateIn: { type: Boolean, default: true },
  // Gentle idle float + hover tilt (off for a card that's only in transit)
  idle: { type: Boolean, default: true },
  scale: { type: Number, default: 1 },
})
// 'entered' fires once the rise-in animation has landed
const emit = defineEmits(['entered'])

const W = 400
const H = 250
const mono = { fontFamily: "'Reddit Mono', ui-monospace, monospace" }

const groups = computed(() => props.number.trim().split(/\s+/))
const details = computed(() => [
  { label: 'VALID THRU', value: props.expiry },
  { label: 'CARD HOLDER', value: props.holder },
  { label: 'CVC', value: props.cvc },
])

// Motion was tuned on the 220px empty-state card (scale 0.55); k keeps it
// proportional at any size
const k = computed(() => props.scale / 0.55)
const stageStyle = computed(() => ({
  '--hp-rise': `${140 * k.value}px`,
  '--hp-float': `${5 * k.value}px`,
  '--hp-perspective': `${700 * k.value}px`,
}))

// Tilt: the pointer sets a target (-1..1 per axis) and a rAF loop eases
// toward it, writing custom props the CSS reads
const stageEl = ref(null)
const target = { x: 0, y: 0, hover: 0 }
const current = { x: 0, y: 0, hover: 0 }
let raf = 0
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function step() {
  const el = stageEl.value
  if (!el) { raf = 0; return }
  let settled = true
  for (const key of ['x', 'y', 'hover']) {
    const delta = target[key] - current[key]
    current[key] += delta * 0.12
    if (Math.abs(delta) > 0.001) settled = false
    else current[key] = target[key]
  }
  const { x, y, hover } = current
  el.style.setProperty('--tilt-rx', `${(-y * 12).toFixed(2)}deg`)
  el.style.setProperty('--tilt-ry', `${(x * 16).toFixed(2)}deg`)
  el.style.setProperty('--tilt-lift', `${(hover * 28 * k.value).toFixed(2)}px`)
  el.style.setProperty('--glare-x', `${((x + 1) * 50).toFixed(1)}%`)
  el.style.setProperty('--glare-y', `${((y + 1) * 50).toFixed(1)}%`)
  el.style.setProperty('--glare-o', hover.toFixed(3))
  // Blobs live inside the scaled face, so their shift is in face pixels
  el.style.setProperty('--blob-x', `${(-x * 14 / 0.55).toFixed(2)}px`)
  el.style.setProperty('--blob-y', `${(-y * 10 / 0.55).toFixed(2)}px`)
  raf = settled ? 0 : requestAnimationFrame(step)
}
function kick() {
  if (!raf) raf = requestAnimationFrame(step)
}
function onMove(e) {
  if (!props.idle || reducedMotion() || !stageEl.value) return
  const r = stageEl.value.getBoundingClientRect()
  target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
  target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
  target.hover = 1
  kick()
}
function onLeave() {
  target.x = 0
  target.y = 0
  target.hover = 0
  kick()
}

// No rise-in under reduced motion, so the card has "landed" straight away
onMounted(() => { if (!props.animateIn || reducedMotion()) emit('entered') })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<style scoped>
.hp-card-enter {
  animation: hp-card-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) 150ms both;
}
.hp-card-tilt {
  transform: perspective(var(--hp-perspective, 700px)) rotateX(var(--tilt-rx, 0deg)) rotateY(var(--tilt-ry, 0deg)) translateZ(var(--tilt-lift, 0px));
  transform-style: preserve-3d;
  will-change: transform;
}
.hp-card-float {
  animation: hp-card-float 6s ease-in-out 1050ms infinite;
  will-change: transform;
}
.hp-card-face {
  transform-origin: top left;
  background-image:
    linear-gradient(90deg, #2465de 0%, #2465de 100%),
    linear-gradient(-58.27deg, rgba(255, 255, 255, 0) 0.78%, rgba(246, 248, 250, 0.6) 44.26%);
  box-shadow:
    0px 197px 55px 0px rgba(23, 29, 109, 0),
    0px 126px 51px 0px rgba(23, 29, 109, 0.01),
    0px 71px 43px 0px rgba(23, 29, 109, 0.04),
    0px 32px 32px 0px rgba(23, 29, 109, 0.07),
    0px 8px 17px 0px rgba(23, 29, 109, 0.08);
}
.hp-card-blob {
  transform: translate(var(--blob-x, 0px), var(--blob-y, 0px));
}
.hp-card-blob--far {
  transform: translate(calc(var(--blob-x, 0px) * -0.6), calc(var(--blob-y, 0px) * -0.6));
}
.hp-card-glare {
  background: radial-gradient(
    circle at var(--glare-x, 50%) var(--glare-y, 50%),
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.18) 28%,
    rgba(255, 255, 255, 0) 60%
  );
  mix-blend-mode: overlay;
  opacity: var(--glare-o, 0);
}

@keyframes hp-card-rise {
  from { opacity: 0; transform: translateY(var(--hp-rise, 140px)) rotate(-6deg); }
  60%  { opacity: 1; }
  to   { opacity: 1; transform: translateY(0) rotate(0deg); }
}
@keyframes hp-card-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25%      { transform: translateY(calc(var(--hp-float, 5px) * -1)) rotate(-1.2deg); }
  75%      { transform: translateY(calc(var(--hp-float, 5px) * 0.8)) rotate(1.2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .hp-card-enter, .hp-card-float { animation: none; }
}
</style>
