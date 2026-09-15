<template>
  <!-- Animated VA hero illustration (Figma: 2261:31121).
       Story: customers around SEA send money home in their local currency.
       Three 6.4s phases (SG→$, ID→Rp, PH→₱) in a 19.2s loop. Each phase:
       the customer chip charges up (animated gradient border) → a curved
       line carries the money to its currency key → the key presses with a
       ripple → home ripples green (received) → the photo flips to a check. -->
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

    <!-- Money paths: customer chips → currency keys (one per phase) -->
    <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 411 184" fill="none">
      <defs>
        <linearGradient
          v-for="f in flows"
          :id="'va-grad-' + f.id"
          :key="'g' + f.id"
          :x1="f.gradFrom.x" :y1="f.gradFrom.y" :x2="f.gradTo.x" :y2="f.gradTo.y"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#99adec" stop-opacity="0" />
          <stop offset="0.55" stop-color="#99adec" stop-opacity="0.4" />
          <stop offset="1" stop-color="#99adec" stop-opacity="1" />
        </linearGradient>
      </defs>
      <path
        v-for="f in flows"
        :key="'p' + f.id"
        class="va-line"
        :d="f.path"
        :style="{ '--phase': f.phase + 's' }"
        pathLength="1"
        :stroke="'url(#va-grad-' + f.id + ')'"
        stroke-width="1.25"
        stroke-linecap="round"
      />
    </svg>
    <span
      v-for="f in flows"
      :key="'d' + f.id"
      class="va-line-dot"
      :style="{ 'offset-path': `path('${f.path}')`, '--phase': f.phase + 's' }"
    />

    <!-- Home (merchant) — periwinkle at rest, turns green with each receive ripple -->
    <div class="va-home" style="left: 4px; top: 80px;">
      <span class="va-home-ripple" />
      <span class="va-home-ripple va-home-ripple--late" />
      <img :src="homeIconBlue" width="20" height="20" alt="" class="va-home__blue absolute inset-0" />
      <img :src="homeIcon" width="20" height="20" alt="" class="va-home__green relative" />
    </div>

    <!-- Currency keys — each receives its phase's transfer -->
    <div
      v-for="f in flows"
      :key="'k' + f.id"
      class="va-key-wrap"
      :style="{ left: f.key.x + 'px', top: f.key.y + 'px', '--phase': f.phase + 's' }"
    >
      <span class="va-key-ripple" />
      <span class="va-key-ripple va-key-ripple--late" />
      <div class="va-key">{{ f.key.label }}</div>
    </div>

    <!-- Customer chips on the globe (Figma: 2261:38859) -->
    <div
      v-for="f in flows"
      :key="'c' + f.id"
      class="va-chip-ring"
      :style="{ left: f.chip.x + 'px', top: f.chip.y + 'px', '--phase': f.phase + 's' }"
    >
      <span class="va-chip-ring__sweep" />
      <div class="va-chip">
        <span class="relative size-[24px] shrink-0">
          <img :src="f.chip.photo" width="24" height="24" alt="" class="va-chip__photo absolute inset-0 rounded-full" />
          <img :src="checkIcon" width="24" height="24" alt="" class="va-chip__check absolute inset-0" />
        </span>
        <img :src="f.chip.flag" width="24" height="16" alt="" class="shrink-0 rounded-[1px]" style="box-shadow: 0px 0px 0px 0.5px rgba(3,16,47,0.08);" />
      </div>
    </div>
  </div>
</template>

<script setup>
import globeDots from '../../assets/images/va-globe-dots.png'
import ellipseGlow from '../../assets/images/va-ellipse-glow.svg'
import ellipseGlowWarm from '../../assets/images/va-ellipse-glow-warm.svg'
import homeIcon from '../../assets/icons/icon-home-green.svg'
import homeIconBlue from '../../assets/icons/icon-home-blue.svg'
import checkIcon from '../../assets/icons/icon-check-circle-green.svg'
import customerSg from '../../assets/images/va-customer-sg.png'
import customerId from '../../assets/images/va-customer-id.png'
import customerPh from '../../assets/images/va-customer-ph.png'
import flagSg from '../../assets/images/flag-sg.png'
import flagId from '../../assets/images/flag-id.png'
import flagPh from '../../assets/images/flag-ph.png'

// One transfer per 6.4s phase; chips sit on their market's globe position,
// each line flies to that market's local-currency key
const flows = [
  {
    id: 'sg', phase: 0,
    chip: { x: 275, y: 62, flag: flagSg, photo: customerSg },
    key: { label: '$', x: 90, y: 22 },
    path: 'M278 88 C 228 104 164 86 129 46',
    gradFrom: { x: 278, y: 88 }, gradTo: { x: 129, y: 46 },
  },
  {
    id: 'id', phase: 6.4,
    chip: { x: 290, y: 102, flag: flagId, photo: customerId },
    key: { label: 'Rp', x: 55, y: 74 },
    path: 'M292 123 C 235 145 155 125 94 93',
    gradFrom: { x: 292, y: 123 }, gradTo: { x: 94, y: 93 },
  },
  {
    id: 'ph', phase: 12.8,
    chip: { x: 294, y: 20, flag: flagPh, photo: customerPh },
    key: { label: '₱', x: 90, y: 126 },
    path: 'M296 41 C 240 25 175 105 129 140',
    gradFrom: { x: 296, y: 41 }, gradTo: { x: 129, y: 140 },
  },
]
</script>

<style scoped>
/* Three 6.4s phases per 19.2s loop; phase windows are scaled into the
   first third of the keyframes and offset per element via --phase */
.va-anim {
  --cycle: 19.2s;
  --beat: 6.4s;
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

/* ── Money path: draws toward its key in the phase's first half, then fades ── */
.va-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  animation: va-line-draw var(--cycle) cubic-bezier(0.45, 0, 0.55, 1) var(--phase) infinite;
}
@keyframes va-line-draw {
  0%, 5% { stroke-dashoffset: 1; opacity: 0; }
  5.7% { opacity: 1; }
  10% { stroke-dashoffset: 0; opacity: 1; }
  15.3% { stroke-dashoffset: 0; opacity: 1; }
  18.7%, 100% { stroke-dashoffset: 0; opacity: 0; }
}
.va-line-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2465de;
  offset-distance: 0%;
  opacity: 0;
  animation: va-dot-travel var(--cycle) cubic-bezier(0.45, 0, 0.55, 1) var(--phase) infinite;
}
@keyframes va-dot-travel {
  0%, 5% { offset-distance: 0%; opacity: 0; }
  5.7% { opacity: 1; }
  9.7% { opacity: 1; }
  10%, 100% { offset-distance: 100%; opacity: 0; }
}

/* ── Home: green receive ripple + periwinkle→green swap every phase ── */
.va-home {
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.va-home-ripple {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px solid #41ba5b;
  opacity: 0;
  animation: va-home-ripple var(--beat) ease-out infinite;
}
.va-home-ripple--late { animation-name: va-home-ripple-late; }
@keyframes va-home-ripple {
  0%, 40% { transform: scale(0.8); opacity: 0; }
  44% { opacity: 0.5; }
  60%, 100% { transform: scale(2.4); opacity: 0; }
}
@keyframes va-home-ripple-late {
  0%, 44% { transform: scale(0.8); opacity: 0; }
  48% { opacity: 0.35; }
  64%, 100% { transform: scale(2.4); opacity: 0; }
}
.va-home__blue { animation: va-home-blue var(--beat) ease-in-out infinite; }
.va-home__green { opacity: 0; animation: va-home-green var(--beat) ease-in-out infinite; }
@keyframes va-home-blue {
  0%, 40% { opacity: 1; }
  44%, 92% { opacity: 0; }
  98%, 100% { opacity: 1; }
}
@keyframes va-home-green {
  0%, 40% { opacity: 0; }
  44%, 92% { opacity: 1; }
  98%, 100% { opacity: 0; }
}

/* ── Currency keys (Figma: 2261:30654) ── */
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
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 6px;
  box-shadow: 0px 1px 1.5px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(38,42,50,0.08);
  font-size: 14px;
  font-weight: 500;
  color: #61667c;
  animation: va-key-press var(--cycle) cubic-bezier(0.45, 0, 0.55, 1) var(--phase) infinite;
}
@keyframes va-key-press {
  0%, 9.7% { transform: translateY(0); box-shadow: 0px 1px 1.5px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(38,42,50,0.08); }
  10.7% { transform: translateY(2px) scale(0.95); box-shadow: 0px 0.5px 1px 0px rgba(0,0,0,0.04), 0px 1px 3px 0px rgba(38,42,50,0.06); }
  12%, 100% { transform: translateY(0); box-shadow: 0px 1px 1.5px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(38,42,50,0.08); }
}
.va-key-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid #2465de;
  opacity: 0;
  animation: va-key-ripple var(--cycle) ease-out var(--phase) infinite;
}
.va-key-ripple--late { animation-name: va-key-ripple-late; }
@keyframes va-key-ripple {
  0%, 10.3% { transform: scale(1); opacity: 0; }
  11.3% { opacity: 0.4; }
  15.7%, 100% { transform: scale(2.3); opacity: 0; }
}
@keyframes va-key-ripple-late {
  0%, 11.3% { transform: scale(1); opacity: 0; }
  12.3% { opacity: 0.3; }
  16.7%, 100% { transform: scale(2.3); opacity: 0; }
}

/* ── Customer chip: white pill, photo + flag (Figma: 2261:38859) ── */
.va-chip-ring {
  position: absolute;
  padding: 1.5px;
  border-radius: 42px;
  overflow: hidden;
  /* Chips take the stage one by one: pop in at their phase, bow out at its end */
  opacity: 0;
  animation: va-chip-appear var(--cycle) cubic-bezier(0.45, 0, 0.55, 1) var(--phase) infinite;
}
@keyframes va-chip-appear {
  0% { opacity: 0; transform: scale(0.6); }
  1.6% { opacity: 1; transform: scale(1.05); }
  2.4% { transform: scale(1); }
  31% { opacity: 1; transform: scale(1); }
  33.3%, 100% { opacity: 0; transform: scale(0.85); }
}
.va-chip-ring__sweep {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  opacity: 0;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(43, 195, 125, 0.15) 40deg,
    #2bc37d 90deg,
    #7fe0ae 120deg,
    rgba(43, 195, 125, 0.15) 160deg,
    transparent 210deg
  );
  animation:
    va-chip-sweep-rotate 1.4s linear infinite,
    va-chip-sweep-show var(--cycle) linear var(--phase) infinite;
}
@keyframes va-chip-sweep-rotate {
  to { transform: rotate(360deg); }
}
@keyframes va-chip-sweep-show {
  0% { opacity: 0; }
  1.3%, 10% { opacity: 1; }
  12.7%, 100% { opacity: 0; }
}
.va-chip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid #fcfcfd;
  border-radius: 40px;
  box-shadow: 0px 1px 1.5px 0px rgba(0,0,0,0.05), 0px 3px 9px 0px rgba(38,42,50,0.08);
}

/* Photo ↔ green check crossfade — the check lands after home ripples green */
.va-chip__photo {
  animation: va-chip-photo var(--cycle) ease-in-out var(--phase) infinite;
}
.va-chip__check {
  opacity: 0;
  animation: va-chip-check var(--cycle) ease-in-out var(--phase) infinite;
}
@keyframes va-chip-photo {
  0%, 17.3% { opacity: 1; }
  19.3%, 28.7% { opacity: 0; }
  30.7%, 100% { opacity: 1; }
}
@keyframes va-chip-check {
  0%, 17.3% { opacity: 0; transform: scale(0.7); }
  19.3% { opacity: 1; transform: scale(1.08); }
  20.3%, 28.7% { opacity: 1; transform: scale(1); }
  30.7%, 100% { opacity: 0; transform: scale(0.7); }
}

@media (prefers-reduced-motion: reduce) {
  .va-ring, .va-line, .va-line-dot, .va-home-ripple, .va-key,
  .va-key-ripple, .va-chip-ring__sweep, .va-chip__photo, .va-chip__check,
  .va-home__blue, .va-home__green, .va-chip-ring { animation: none; }
  .va-line, .va-line-dot, .va-home-ripple, .va-key-ripple, .va-chip-ring__sweep { opacity: 0; }
  .va-chip__photo, .va-home__green, .va-chip-ring { opacity: 1; }
  .va-chip__check, .va-home__blue { opacity: 0; }
}
</style>
