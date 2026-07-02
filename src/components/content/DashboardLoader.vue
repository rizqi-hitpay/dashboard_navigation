<template>
  <div class="loader relative size-[72px] overflow-hidden rounded-full" role="status" aria-label="Loading dashboard">
    <!-- Base: pale blue circle with white logogram -->
    <div class="absolute inset-0 overflow-hidden rounded-full" style="background: rgba(36, 101, 222, 0.1);">
      <img :src="logogramWhite" alt="" class="absolute left-[12px] top-[12px] max-w-none" style="width: 48.82px; height: 48.756px;" />
    </div>

    <!-- Water: one height animation drives everything. The body clips the navy
         logogram at the waterline (two logos in registration, Figma 3973:3329);
         the wave cap sits on the body's top edge and drifts sideways. -->
    <div class="water absolute bottom-0 left-0 w-[72px]">
      <!-- Body: white below the waterline -->
      <div class="absolute inset-0 overflow-hidden bg-white">
        <img :src="logogramNavy" alt="" class="absolute bottom-[11.244px] left-[12px] max-w-none" style="width: 48.82px; height: 48.756px;" />
      </div>
      <!-- Surface: two irregular wave layers drifting in opposite directions —
           their interference keeps the surface from looking mechanical. Each
           svg is two identical 72px periods (irregular within the period but
           tiling smoothly), so a 72px translate loops seamlessly. -->
      <div class="water-cap absolute bottom-full left-0 h-[12px] w-[72px] overflow-hidden">
        <!-- Back swell: softer, semi-transparent, drifts right, slower -->
        <svg class="water-wave water-wave--back absolute bottom-0 left-0 block" width="144" height="12" viewBox="0 0 144 12" fill="none" aria-hidden="true">
          <path id="wave-back" d="M0 7 C 5 9.5, 9 10, 15 9 S 22 3.6, 29 4.4 S 36 10.2, 43 9.4 S 52 3.2, 58 4.6 S 67 4.5, 72 7 L 72 12 L 0 12 Z" fill="white" />
          <use href="#wave-back" x="72" />
        </svg>
        <!-- Front surface: full white, drifts left -->
        <svg class="water-wave water-wave--front absolute bottom-0 left-0 block" width="144" height="12" viewBox="0 0 144 12" fill="none" aria-hidden="true">
          <path id="wave-front" d="M0 7 C 6 4.5, 9 4, 14 4.6 S 20 10, 26 9.2 S 31 3, 38 4.2 S 47 9, 52 8.2 S 58 4.6, 63 5.4 S 66 9.5, 72 7 L 72 12 L 0 12 Z" fill="white" />
          <use href="#wave-front" x="72" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import logogramWhite from '../../assets/images/loader/logogram-white.svg'
import logogramNavy from '../../assets/images/loader/logogram-navy.svg'
</script>

<style scoped>
.loader { --cycle: 3000ms; }

/* Tide loop: water rises to the top (logo fully navy), pauses, then recedes
   back to the bottom — no fill-to-100% implied, it just breathes. */
.water { animation: water-rise var(--cycle) cubic-bezier(0.45, 0, 0.55, 1) infinite; }
@keyframes water-rise {
  0%       { height: 0px; }
  42%, 58% { height: 72px; }
  100%     { height: 0px; }
}

/* Horizontal drift of the surface — constant speed, independent of the rise.
   The two layers move in opposite directions at different speeds, so their
   overlap pattern never repeats visibly. */
.water-wave--front { animation: water-drift 1900ms linear infinite; }
.water-wave--back { animation: water-drift 3100ms linear infinite reverse; opacity: 0.55; }
@keyframes water-drift {
  from { transform: translateX(0); }
  to   { transform: translateX(-72px); }
}

@media (prefers-reduced-motion: reduce) {
  .water { animation: none; height: 72px; }
  .water-wave--front, .water-wave--back { animation: none; }
}
</style>
