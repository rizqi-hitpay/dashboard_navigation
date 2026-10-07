<template>
  <!-- Chat input with glow (Figma Analytics-with-AI: 1:6358) -->
  <div class="relative py-[8px]">
    <div class="prompt-glow" :class="{ 'prompt-glow--hidden': focused }" />
    <form
      class="relative flex items-end gap-[12px] p-[12px] rounded-[16px] bg-white border-[1.5px] border-[rgba(0,0,0,0.05)] overflow-hidden"
      @submit.prevent="submit"
    >
      <input
        ref="inputRef"
        v-model="text"
        class="flex-1 min-w-0 min-h-[28px] bg-transparent outline-none text-[14px] text-[#03102f] leading-[1.5]"
        :placeholder="placeholder"
        :aria-label="'Ask AI to create a chart'"
        @focus="focused = true"
        @blur="focused = false"
        @keydown.esc="$emit('escape')"
      />
      <button
        type="submit"
        class="shrink-0 flex items-center justify-center size-[28px] rounded-[40px] border border-[#f2f2f4] hover:brightness-95 transition"
        style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
        aria-label="Send"
      >
        <img :src="arrowTopIcon" width="16" height="16" alt="" class="block" />
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import arrowTopIcon from '../../assets/icons/icon-arrow-top.svg'

const props = defineProps({
  autofocus: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'escape'])

const text = ref('')
const focused = ref(false)
const inputRef = useTemplateRef('inputRef')

function submit() {
  const value = text.value.trim()
  if (!value) return
  emit('submit', value)
  text.value = ''
}

// Placeholder types out example prompts one after another
const EXAMPLES = [
  'Create a line chart of my monthly sales this year',
  'Show my refunds by week this month',
  'Compare card and PayNow sales this quarter',
  'Create a table of my top customers',
]
const STATIC_PLACEHOLDER = 'Create a line chart of my....'
const placeholder = ref(STATIC_PLACEHOLDER)

let timer = null
function typewriter(index = 0, chars = 0, deleting = false) {
  const full = EXAMPLES[index]
  placeholder.value = full.slice(0, chars) || '​'
  let next
  if (!deleting && chars < full.length) next = () => typewriter(index, chars + 1, false)
  else if (!deleting) { timer = setTimeout(() => typewriter(index, chars, true), 1600); return }
  else if (chars > 0) next = () => typewriter(index, chars - 1, true)
  else next = () => typewriter((index + 1) % EXAMPLES.length, 0, false)
  timer = setTimeout(next, deleting ? 22 : 45)
}

onMounted(() => {
  if (props.autofocus) inputRef.value?.focus()
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) typewriter()
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
input::placeholder {
  color: #9295a5;
}

.prompt-glow {
  position: absolute;
  inset: 8px -0.5px 8px 0;
  border-radius: 16px;
  background: radial-gradient(ellipse 60% 140% at 20% 20%, rgba(160, 98, 247, 1) 0%, rgba(156, 134, 248, 1) 25%, rgba(152, 170, 249, 1) 50%, rgba(144, 242, 250, 1) 100%);
  filter: blur(18px);
  opacity: 0.4;
  pointer-events: none;
  transition: opacity 200ms ease-out;
}
.prompt-glow--hidden {
  opacity: 0.15;
}
</style>
