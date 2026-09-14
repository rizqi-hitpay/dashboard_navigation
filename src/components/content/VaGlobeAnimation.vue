<template>
  <!-- Animated VA hero illustration (Figma: 2227:20384).
       Loop: home pulses; each currency key "presses"; a check pill pops
       on the globe where that currency settles (SGD→SG, Rp→ID, ₱→PH). -->
  <div class="va-anim" aria-hidden="true">
    <!-- Warm bottom-left glow (Figma: Ellipse 42) -->
    <img :src="ellipseGlowWarm" alt="" class="absolute max-w-none" style="left: -232px; top: -134px; width: 678px; height: 678px;" />

    <!-- Orbit rings — gradient strokes, slowly rotating (Figma: 2261:22924/22925) -->
    <div class="va-ring va-ring--slow" style="left: -108px; top: -25px; width: 233px; height: 233px;" />
    <div class="va-ring va-ring--fast" style="left: -58px; top: 25px; width: 133px; height: 133px;" />

    <!-- Blue glow behind the globe (Figma: Ellipse 38) -->
    <img :src="ellipseGlow" alt="" class="absolute max-w-none" style="left: -51px; top: -254px; width: 678px; height: 678px;" />

    <!-- Dot globe — multiply lets the glow show through its white ground -->
    <img :src="globeDots" alt="" class="absolute max-w-none" style="left: 139px; top: 0; width: 273px; height: 184px; mix-blend-mode: multiply;" />

    <!-- Home (merchant) — 55px radial disc (Figma: Ellipse 39) -->
    <div class="va-home" style="left: -14px; top: 64px;">
      <img :src="homeDisc" alt="" class="absolute inset-0 w-full h-full" />
      <img :src="homeIcon" width="20" height="20" alt="" class="relative" />
    </div>

    <!-- Currency keys -->
    <div
      v-for="(k, i) in keys"
      :key="k.label"
      class="va-key-wrap"
      :style="{ left: k.x + 'px', top: k.y + 'px', '--phase': i * PHASE + 's' }"
    >
      <span class="va-key-ripple" />
      <span class="va-key-ripple va-key-ripple--late" />
      <div class="va-key">{{ k.label }}</div>
    </div>

    <!-- Success pills on the globe -->
    <div
      v-for="(p, i) in pills"
      :key="p.name"
      class="va-pill"
      :style="{ left: p.x + 'px', top: p.y + 'px', '--phase': i * PHASE + 's' }"
    >
      <img :src="checkIcon" width="16" height="16" alt="" class="shrink-0" />
      <img :src="p.flag" width="24" height="16" alt="" class="shrink-0 rounded-[1px]" style="box-shadow: 0px 0px 0px 0.5px rgba(3,16,47,0.08);" />
    </div>
  </div>
</template>

<script setup>
import globeDots from '../../assets/images/va-globe-dots.png'
import ellipseGlow from '../../assets/images/va-ellipse-glow.svg'
import ellipseGlowWarm from '../../assets/images/va-ellipse-glow-warm.svg'
import homeIcon from '../../assets/icons/icon-home-green.svg'
import homeDisc from '../../assets/images/va-home-disc.svg'
import checkIcon from '../../assets/icons/icon-check-circle-green.svg'
import flagSg from '../../assets/images/flag-sg.png'
import flagId from '../../assets/images/flag-id.png'
import flagPh from '../../assets/images/flag-ph.png'

// One phase per currency; the CSS cycle is 3 × PHASE seconds
const PHASE = 2.4

// Key positions from the Figma frame (411×184)
const keys = [
  { label: '$', x: 90, y: 22 },
  { label: 'Rp', x: 55, y: 74 },
  { label: '₱', x: 90, y: 126 },
]

// SG pill matches the design; ID/PH placed on their map regions
const pills = [
  { name: 'sg', flag: flagSg, x: 277, y: 64 },
  { name: 'id', flag: flagId, x: 292, y: 104 },
  { name: 'ph', flag: flagPh, x: 296, y: 24 },
]
</script>

<style scoped>
.va-anim {
  position: relative;
  width: 411px;
  height: 184px;
  flex-shrink: 0;
  overflow: hidden;
}

/* Gradient-stroke ring (#EAEBF2 → #99ADEC), rotating so the gradient travels */
.va-ring {
  position: absolute;
  border-radius: 50%;
  padding: 1px;
  background: linear-gradient(to bottom, #eaebf2, #99adec);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
.va-ring--slow { animation: va-ring-rotate 9s linear infinite; }
.va-ring--fast { animation: va-ring-rotate 6s linear infinite reverse; }
@keyframes va-ring-rotate {
  to { transform: rotate(360deg); }
}

/* ── Home: 55px radial disc, exact Ellipse 39 SVG behind the glyph ── */
.va-home {
  position: absolute;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Currency keys: keyboard-press + pulse ring, one per phase ── */
.va-key-wrap {
  position: absolute;
  width: 36px;
  height: 36px;
}
.va-key {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* White key with the design's border and soft shadow (Figma: 2261:30654) */
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 6px;
  box-shadow: 0px 1px 1.5px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(38,42,50,0.08);
  font-size: 14px;
  font-weight: 500;
  color: #61667c;
  animation: va-key-press 7.2s cubic-bezier(0.45, 0, 0.55, 1) var(--phase) infinite;
}
@keyframes va-key-press {
  0%, 1.4% { transform: translateY(0); box-shadow: 0px 1px 1.5px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(38,42,50,0.08); }
  4.2% { transform: translateY(2px) scale(0.95); box-shadow: 0px 0.5px 1px 0px rgba(0,0,0,0.04), 0px 1px 3px 0px rgba(38,42,50,0.06); }
  8.3%, 100% { transform: translateY(0); box-shadow: 0px 1px 1.5px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(38,42,50,0.08); }
}
.va-key-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid #2465de;
  opacity: 0;
  animation: va-key-ripple 7.2s ease-out infinite;
  animation-delay: var(--phase);
}
.va-key-ripple--late {
  animation-name: va-key-ripple-late;
}
@keyframes va-key-ripple {
  0%, 3% { transform: scale(1); opacity: 0; }
  5.5% { opacity: 0.4; }
  19%, 100% { transform: scale(2.3); opacity: 0; }
}
@keyframes va-key-ripple-late {
  0%, 6% { transform: scale(1); opacity: 0; }
  8.5% { opacity: 0.3; }
  22%, 100% { transform: scale(2.3); opacity: 0; }
}

/* ── Success pills: pop in after the key press, hold, fade ── */
.va-pill {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border: 0.77px solid #e5e6ea;
  border-radius: 24px;
  box-shadow: 0px 0.77px 1.53px 0px rgba(0,0,0,0.05), 0px 3.07px 9.2px 0px rgba(38,42,50,0.08);
  opacity: 0;
  transform: scale(0.5);
  animation: va-pill-pop 7.2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  animation-delay: var(--phase);
}
@keyframes va-pill-pop {
  0%, 8.3% { opacity: 0; transform: scale(0.5); }
  11% { opacity: 1; transform: scale(1.06); }
  12.5% { transform: scale(1); }
  26.4% { opacity: 1; transform: scale(1); }
  31.9%, 100% { opacity: 0; transform: scale(0.94); }
}

@media (prefers-reduced-motion: reduce) {
  .va-key, .va-key-ripple, .va-pill, .va-ring { animation: none; }
  .va-key-ripple { opacity: 0; }
  /* Static fallback matches the Figma frame: the SG pill visible */
  .va-pill { opacity: 0; transform: none; }
  .va-pill:first-of-type { opacity: 1; }
}
</style>
