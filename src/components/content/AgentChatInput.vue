<template>
  <!-- Chat box — visually matches the AI Assistant panel input. On send, hands
       the message off to the AI Assistant and opens the panel. Rises into view
       the first time it scrolls onto screen. -->
  <div ref="rootEl" class="chat-input" :class="{ 'is-shown': shown }" style="position: relative;">
    <!-- Animated gradient glow blob -->
    <div class="chat-glow" :class="{ 'chat-glow--hidden': isFocused }" />
    <div
      class="flex items-center bg-white"
      style="position: relative; z-index: 1; border: 1px solid #e5e6ea; border-radius: 16px; padding: 12px 12px 12px 16px; gap: 12px; min-height: 52px;"
    >
      <input
        v-model="chatInput"
        class="flex-1 outline-none bg-transparent"
        style="font-size: 14px; color: #03102f;"
        placeholder="Ask the AI Assistant anything..."
        @keydown.enter="send"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <button
        class="shrink-0 flex items-center justify-center rounded-full transition-opacity"
        :class="chatInput.trim() ? 'hover:opacity-80' : ''"
        style="width: 28px; height: 28px; border: 1px solid #f2f2f4; background: white;"
        @click="send"
      >
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
          <path d="M5 11V1M1 5l4-4 4 4" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { agentPanelOpen, pendingAgentMessage } from '../../composables/useAgentPanel.js'

const chatInput = ref('')
const isFocused = ref(false)

// Rise-in each time the input enters the viewport (resets when it leaves so it
// replays on the next scroll-in). A short delay lets the entrance read clearly.
const RISE_DELAY = 200 // ms before the animation plays after entering view

const rootEl = ref(null)
const shown = ref(false)
let observer = null
let riseTimer = null

onMounted(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) { shown.value = true; return }
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry.isIntersecting) {
      // Delay the reveal, then play
      riseTimer = setTimeout(() => { shown.value = true }, RISE_DELAY)
    } else {
      // Left the viewport — reset so the animation can replay on re-entry
      clearTimeout(riseTimer)
      shown.value = false
    }
  }, { threshold: 0.2 })
  if (rootEl.value) observer.observe(rootEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(riseTimer)
})

function send() {
  const msg = chatInput.value.trim()
  if (!msg) return
  pendingAgentMessage.value = msg
  agentPanelOpen.value = true
  chatInput.value = ''
}
</script>

<style scoped>
input::placeholder {
  color: #9295a5;
}

/* Rise-in entrance — fades up from the bottom while growing from narrow to
   full width. Matches the carousel's onboarding ease. */
.chat-input { opacity: 0; transform-origin: center; }
.chat-input.is-shown {
  animation: chat-rise 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes chat-rise {
  from { opacity: 0; transform: translateY(12px) scaleX(0.85); }
  to   { opacity: 1; transform: translateY(0)    scaleX(1);    }
}

@media (prefers-reduced-motion: reduce) {
  .chat-input { opacity: 1; }
  .chat-input.is-shown { animation: none; }
}

.chat-glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(115deg, #9333ea 0%, #22d3ee 100%);
  filter: blur(14px);
  opacity: 0.25;
  z-index: 0;
  pointer-events: none;
  transition: opacity 200ms ease-out;
  animation: chat-glow-drift 6s ease-in-out infinite alternate;
}

.chat-glow--hidden {
  opacity: 0;
}

@keyframes chat-glow-drift {
  from { transform: rotate(-6deg) scaleX(1.0); }
  to   { transform: rotate(6deg)  scaleX(1.08); }
}
</style>
