<template>
  <!-- Chat box (Figma 4801:49767 compact · 4801:50940 full). On send, hands the
       message off to the AI Assistant and opens the panel.
       Compact: a 52px sparkle chip. Full: 500px "Ask anything..." input. The
       width morph is driven by the parent via `compact`; the box is
       justify-end + clipped, so the button stays pinned right while the text
       field unrolls to its left. -->
  <div
    class="chat-input"
    :class="{ 'is-compact': compact, 'is-dissolving': dissolving }"
    :style="{ width: compact ? '52px' : width }"
    @click="onClick"
  >
    <!-- Brand glow behind the box (inset 8px 0, blur 18) -->
    <div class="chat-glow" />

    <div class="chat-box">
      <input
        ref="inputEl"
        v-model="chatInput"
        class="chat-field"
        :placeholder="typedPlaceholder"
        :tabindex="compact ? -1 : 0"
        @keydown.enter="send"
      />
      <button
        type="button"
        class="chat-send"
        :aria-label="compact ? 'Open chat' : 'Send'"
        @click.stop="compact ? $emit('expand') : send()"
      >
        <!-- Sparkle (compact) turns into the send arrow (full) -->
        <img :src="sparkleIcon" width="16" height="16" alt="" class="chat-icon chat-icon--sparkle" />
        <img :src="arrowTopIcon" width="16" height="16" alt="" class="chat-icon chat-icon--arrow" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { agentPanelOpen, pendingAgentMessage } from '../../composables/useAgentPanel.js'
import sparkleIcon from '../../assets/icons/icon-sparkle-2-fill-blue.svg'
import arrowTopIcon from '../../assets/icons/icon-arrow-top.svg'

const props = defineProps({
  compact: { type: Boolean, default: false },
  width:   { type: String,  default: '500px' },
  // Pops the box away as it bursts into the particle stream
  dissolving: { type: Boolean, default: false },
})
const emit = defineEmits(['expand'])

const chatInput = ref('')
const inputEl = ref(null)

function onClick() {
  if (props.compact) emit('expand')
  else inputEl.value?.focus()
}

// ---------------------------------------------------------------------------
// Typing-effect placeholder (same as /studio): each prompt is typed out, held,
// then deleted before the next. Starts once the box has reached its full form.
// ---------------------------------------------------------------------------
const placeholderIdeas = [
  'Ask anything...',
  'Create a payment link',
  'What happened to this week sales?',
  'Show me pending invoice',
  'Compare last month activity',
]

const typedPlaceholder = ref(placeholderIdeas[0])
let placeholderStarted = false
let placeholderStopped = false
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runPlaceholderLoop() {
  // Let the morph + placeholder fade settle, then hold the default text
  await sleep(2400)
  let i = 0
  while (!placeholderStopped) {
    // Delete, slightly faster than typing
    while (typedPlaceholder.value.length > 0 && !placeholderStopped) {
      typedPlaceholder.value = typedPlaceholder.value.slice(0, -1)
      await sleep(18)
    }
    if (placeholderStopped) break
    await sleep(300)

    // Type the next prompt character by character
    i = (i + 1) % placeholderIdeas.length
    for (const ch of placeholderIdeas[i]) {
      if (placeholderStopped) break
      typedPlaceholder.value += ch
      await sleep(38)
    }
    await sleep(2000)
  }
}

watch(() => props.compact, (compact) => {
  if (compact || placeholderStarted) return
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  placeholderStarted = true
  runPlaceholderLoop()
}, { immediate: true })

onUnmounted(() => { placeholderStopped = true })

function send() {
  const msg = chatInput.value.trim()
  if (!msg) return
  pendingAgentMessage.value = msg
  agentPanelOpen.value = true
  chatInput.value = ''
}
</script>

<style scoped>
/* Morph timing — decelerate (motion guide: content settling into place) */
.chat-input {
  --morph: 600ms cubic-bezier(0.32, 0.72, 0, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  max-width: 100%;
  transition: width var(--morph);
}
.chat-input.is-compact { cursor: pointer; }

.chat-glow {
  position: absolute;
  inset: 8px 0;
  border-radius: 16px;
  background: radial-gradient(ellipse 120% 160% at 20% 20%, #a062f7 0%, #9c86f8 25%, #98aaf9 50%, #90f2fa 100%);
  filter: blur(18px);
  opacity: 0.6;
  pointer-events: none;
  transition: opacity var(--morph);
}
.is-compact .chat-glow { opacity: 0.4; }

/* Border drawn as an inset ring so, like Figma's inside stroke, it never
   changes the 52px box height */
.chat-box {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px;
  overflow: clip;
  border-radius: 16px;
  background: #fff;
  box-shadow: inset 0 0 0 1.5px rgba(0, 0, 0, 0.05);
  transition: background-color var(--morph), box-shadow var(--morph);
}
.is-compact .chat-box {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.chat-field {
  flex: 1 0 0;
  min-width: 0;
  min-height: 28px;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  /* Placeholder settles in once the box has mostly opened */
  transition: opacity 300ms ease-out 250ms, transform 300ms ease-out 250ms;
}
.chat-field::placeholder { color: #9295a5; }
.is-compact .chat-field {
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 120ms ease-in, transform 120ms ease-in;
}

.chat-send {
  position: relative;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 40px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #fff, #f2f2f2);
  box-shadow: 0 1.5px 0 0 #e5e5e5;
  overflow: clip;
}

.chat-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  transition: opacity 240ms ease-out, transform 300ms cubic-bezier(0.34, 1.3, 0.64, 1);
}
/* Full: sparkle spins away, the arrow pops up in its place */
.chat-icon--sparkle { opacity: 0; transform: rotate(90deg) scale(0.4); }
.chat-icon--arrow   { opacity: 1; transform: none; transition-delay: 120ms; }
/* Compact: sparkle, with one twinkle after it arrives */
.is-compact .chat-icon--sparkle {
  opacity: 1;
  transform: none;
  /* after the rise-in settles, mid-way through the chip's rest */
  animation: sparkle-twinkle 560ms cubic-bezier(0.34, 1.3, 0.64, 1) 1000ms both;
}
.is-compact .chat-icon--arrow { opacity: 0; transform: translateY(6px) scale(0.6); transition-delay: 0ms; }

@keyframes sparkle-twinkle {
  0%   { transform: scale(1)    rotate(0deg); }
  45%  { transform: scale(1.25) rotate(18deg); }
  100% { transform: scale(1)    rotate(0deg); }
}

/* Burst — the box swells for a beat (charge), then blows out into a blur as
   the particles fly off. Matches particleStream's BURST_MS (280). */
.chat-input.is-dissolving {
  pointer-events: none;
  animation: chat-burst 280ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.chat-input.is-dissolving .chat-glow {
  animation: chat-burst-glow 280ms ease-out forwards;
}
@keyframes chat-burst {
  0%   { transform: scale(1);    opacity: 1; filter: blur(0); }
  35%  { transform: scale(1.03); opacity: 1; filter: blur(0); }
  100% { transform: scale(1.1);  opacity: 0; filter: blur(8px); }
}
@keyframes chat-burst-glow {
  35%  { opacity: 1; }
  100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .chat-input, .chat-glow, .chat-box, .chat-field, .chat-icon { transition: none !important; }
  .is-compact .chat-icon--sparkle { animation: none; }
}
</style>
