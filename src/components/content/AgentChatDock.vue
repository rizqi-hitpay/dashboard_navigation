<template>
  <!-- Floating AI chat dock pinned to the bottom of the Overview (Figma Row
       4801:52523: blurred strip, 32px vertical padding, centered input).
       Once the dashboard data has landed it plays a one-time intro:
         1. rises in as a compact sparkle chip        (rise-in, 720ms expo)
         2. unrolls into the full "Ask anything" box  (decelerate, 600ms)
         3. Close fades in 1s later                   (hint, 140ms)
       Stays in flow at the end of the scroll container so it never covers the
       last row of content. -->
  <Transition name="dock">
    <div v-if="!dismissed" class="dock" :class="{ 'dock--shown': stage !== 'idle' && !dissolving }">
      <!-- Progressive blur: stacked backdrop-blur layers, each masked to a band,
           doubling in strength toward the bottom — content melts gradually
           into the dock instead of hitting a hard blurred edge -->
      <div class="dock-blur" aria-hidden="true">
        <div v-for="n in 6" :key="n" class="dock-blur__layer" />
      </div>
      <div class="dock-chat">
        <Transition name="dock-rise">
          <div v-if="stage !== 'idle'" ref="chatWrap" class="relative">
            <AgentChatInput :compact="stage === 'compact'" :dissolving="dissolving" @expand="expand" />

            <Transition name="dock-close">
              <button v-if="closeVisible && !dissolving" type="button" class="dock-close-btn" @click="close">
                Close
              </button>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref as moduleRef } from 'vue'
// Module state so the intro plays once per session and a dismissal survives
// navigating away from Overview and back
let introPlayed = false
const dismissed = moduleRef(false)
</script>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import AgentChatInput from './AgentChatInput.vue'
import { useDashboardData } from '../../composables/useDashboardData.js'
import { aiAssistantRevealed, aiAssistantRailEl, agentChatReady } from '../../composables/useAgentPanel.js'
import { streamParticles, BURST_MS } from '../../utils/particleStream.js'

const ARRIVE_DELAY = 400  // beat after the last data source lands
const COMPACT_HOLD = 2200 // rise-in (720) → sparkle twinkle → rest as a chip, then expand
const MORPH        = 600  // width morph, matches AgentChatInput
const CLOSE_DELAY  = 1000 // Close appears 1s after the full form settles

const { allLoaded } = useDashboardData()

const stage = ref(introPlayed ? 'full' : 'idle') // idle → compact → full
const closeVisible = ref(introPlayed)
// Full form reached → let the page's AI nudges come in
watch(stage, (s) => { if (s === 'full') agentChatReady.value = true }, { immediate: true })

let timers = []
const later = (fn, ms) => timers.push(setTimeout(fn, ms))
const clearTimers = () => { timers.forEach(clearTimeout); timers = [] }

function expand() {
  if (stage.value === 'full') return
  clearTimers()
  stage.value = 'full'
  later(() => { closeVisible.value = true }, MORPH + CLOSE_DELAY)
}

function playIntro() {
  introPlayed = true
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) { stage.value = 'full'; closeVisible.value = true; return }
  later(() => { stage.value = 'compact' }, ARRIVE_DELAY)
  later(expand, ARRIVE_DELAY + COMPACT_HOLD)
}

if (!introPlayed) {
  watch(allLoaded, (loaded) => {
    if (loaded && !introPlayed) playIntro()
  }, { immediate: true })
}

// Leaving mid-intro → show the settled state next time
onBeforeUnmount(clearTimers)

// Close → the chat bursts into particles that stream into the nav rail and
// condense into the (previously hidden) AI Assistant item: "it lives here now".
const chatWrap = ref(null)
const dissolving = ref(false)

function close() {
  const box = chatWrap.value?.querySelector('.chat-box')
  const target = aiAssistantRailEl.value?.querySelector('img')
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // No visible rail (mobile) or reduced motion → skip the flourish
  if (!box || !target || !target.offsetParent || reduce) {
    dismissed.value = true
    aiAssistantRevealed.value = true
    return
  }
  const from = box.getBoundingClientRect()
  const t = target.getBoundingClientRect()
  dissolving.value = true
  streamParticles({
    from,
    to: { x: t.left + t.width / 2, y: t.top + t.height / 2 },
    onArrive: () => { aiAssistantRevealed.value = true },
  })
  // Drop the dock once the box has popped (particles fly on)
  later(() => { dismissed.value = true }, BURST_MS + 40)
}
</script>

<style scoped>
.dock {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 28px;
  /* Bleed past the scroller's 28px side padding so the blur spans edge to edge */
  margin: 0 -28px;
  pointer-events: none;
}
.dock--shown .dock-chat { pointer-events: auto; }

.dock-blur {
  position: absolute;
  inset: 0;
  /* Figma tint (rgba(237,239,239,0.12)), faded in from the top */
  background: linear-gradient(to bottom, rgba(237, 239, 239, 0), rgba(237, 239, 239, 0.12));
  opacity: 0;
  transition: opacity 400ms ease-out;
}
.dock--shown .dock-blur { opacity: 1; }
.dock-blur__layer { position: absolute; inset: 0; }
.dock-blur__layer:nth-child(1) { --b: 0.5px; --m: linear-gradient(to bottom, transparent 0%,  #000 16%, #000 33%, transparent 50%); }
.dock-blur__layer:nth-child(2) { --b: 1px;   --m: linear-gradient(to bottom, transparent 16%, #000 33%, #000 50%, transparent 66%); }
.dock-blur__layer:nth-child(3) { --b: 2px;   --m: linear-gradient(to bottom, transparent 33%, #000 50%, #000 66%, transparent 83%); }
.dock-blur__layer:nth-child(4) { --b: 4px;   --m: linear-gradient(to bottom, transparent 50%, #000 66%, #000 83%, transparent 100%); }
.dock-blur__layer:nth-child(5) { --b: 8px;   --m: linear-gradient(to bottom, transparent 66%, #000 83%); }
.dock-blur__layer:nth-child(6) { --b: 18px;  --m: linear-gradient(to bottom, transparent 83%, #000 100%); }
.dock-blur__layer {
  backdrop-filter: blur(var(--b));
  -webkit-backdrop-filter: blur(var(--b));
  mask-image: var(--m);
  -webkit-mask-image: var(--m);
}

.dock-chat { position: relative; display: flex; justify-content: center; width: 100%; min-height: 68px; }

/* 1 — Rise-in: chip floats up from below the dock with a slight grow */
.dock-rise-enter-active { transition: opacity 720ms cubic-bezier(0.16, 1, 0.3, 1), transform 720ms cubic-bezier(0.16, 1, 0.3, 1); }
.dock-rise-enter-from   { opacity: 0; transform: translateY(48px) scale(0.85); }

/* Close button — Figma 4801:56238: top 12px of the row, 9.5px in from the
   input's right edge */
.dock-close-btn {
  position: absolute;
  top: -20px;
  right: 9.5px;
  height: 28px;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #484d61;
}

/* 3 — Close: hint-style, slides 4px down into place */
.dock-close-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.dock-close-leave-active { transition: opacity 100ms ease-in; }
.dock-close-enter-from   { opacity: 0; transform: translateY(-4px); }
.dock-close-leave-to     { opacity: 0; }

/* Dismiss — quick exit: strip fades, chat sinks back down */
.dock-leave-active { transition: opacity 160ms ease-in; }
.dock-leave-active .dock-chat { transition: transform 160ms ease-in; }
.dock-leave-to { opacity: 0; }
.dock-leave-to .dock-chat { transform: translateY(12px); }

@media (prefers-reduced-motion: reduce) {
  .dock, .dock-rise-enter-active, .dock-close-enter-active, .dock-close-leave-active,
  .dock-leave-active, .dock-leave-active .dock-chat { transition: none; }
}
</style>
