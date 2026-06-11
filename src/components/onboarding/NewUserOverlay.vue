<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-40"
      :style="{ pointerEvents: setupIntroVisible ? 'auto' : 'none' }"
    >
      <!-- Gradient backdrop (Figma: Overlay fill) -->
      <Transition name="overlay-fade">
        <div
          v-if="setupIntroVisible"
          class="absolute inset-0 overlay-gradient"
          style="background: linear-gradient(163.45deg, rgba(229,238,255,0) 35.235%, rgba(229,238,255,0.5) 53.002%, #e5eeff 70.768%);"
        ></div>
      </Transition>

      <!-- Text block + Got it -->
      <Transition name="overlay-text">
        <div
          v-if="setupIntroVisible"
          class="absolute flex flex-col items-start"
          style="bottom: 32px; right: 459px; width: 266px; gap: 16px;"
        >
          <h2 class="intro-rise text-[24px] font-medium text-[#03102f]" style="line-height: 1.35; animation-delay: 150ms;">
            Let's complete your account setup
          </h2>
          <p class="intro-rise text-[14px] text-[#61667c]" style="line-height: 1.5; animation-delay: 230ms;">
            A few quick steps to unlock payments, payouts, and the full HitPay experience.
          </p>
          <button
            class="intro-rise got-it-btn flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#61667c]"
            style="width: 100px; height: 36px; animation-delay: 310ms;"
            @click="setupIntroVisible = false"
          >
            Got it
          </button>
        </div>
      </Transition>

      <!-- Setup guide card: docked bottom-right, persists after intro is dismissed -->
      <div class="absolute card-rise" style="bottom: 16px; right: 16px; pointer-events: auto;">
        <SetupGuideCard />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import SetupGuideCard from './SetupGuideCard.vue'
import { useNewUser } from '../../composables/useNewUser'

const { setupIntroVisible } = useNewUser()
</script>

<style scoped>
/* ── Entrance ──
   animations.dev: ease-out so motion starts fast and settles; transform +
   opacity only; small distances; stagger via animation-delay. */

.overlay-gradient {
  animation: overlay-in 600ms ease-out both;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.intro-rise {
  animation: rise-in 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes rise-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Card emanates from its docked corner — origin-aware motion */
.card-rise {
  transform-origin: bottom right;
  animation: card-in 650ms cubic-bezier(0.32, 0.72, 0, 1) 350ms both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Exit (Got it) — faster than entrance ── */

.overlay-fade-leave-active {
  /* The entrance animation's fill (opacity: 1) would override the
     transition — drop it so the fade-out can take effect */
  animation: none;
  transition: opacity 450ms ease;
}
.overlay-fade-leave-to {
  opacity: 0;
}

.overlay-text-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.overlay-text-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ── Got it button (Figma: secondary button) ── */
.got-it-btn {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  border: 1px solid #f2f2f4;
  box-shadow: 0px 1.5px 0px 0px rgba(0, 0, 0, 0.1);
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.got-it-btn:hover {
  filter: brightness(0.98);
}
.got-it-btn:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px rgba(0, 0, 0, 0.1);
}

@media (prefers-reduced-motion: reduce) {
  .overlay-gradient,
  .intro-rise,
  .card-rise {
    animation: none;
  }
  .overlay-fade-leave-active,
  .overlay-text-leave-active,
  .got-it-btn {
    transition: none;
  }
}
</style>
