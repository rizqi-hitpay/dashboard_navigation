<template>
  <!-- Add tile: idle (Figma: 1:3514) → hover/focus reveals prompts + input (Figma: 1:6345) -->
  <div
    class="relative flex flex-col min-h-[326px] rounded-[8px] border border-dashed bg-white overflow-hidden transition-colors duration-200"
    :class="active ? 'border-[#2465de]' : 'border-[#cbcdd4]'"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @focusin="focusWithin = true"
    @focusout="onFocusOut"
  >
    <div
      class="flex flex-1 flex-col items-center justify-center gap-[16px] p-[16px] transition-[padding] duration-200"
      :style="{ paddingBottom: active ? '84px' : '16px' }"
    >
      <button type="button" class="flex flex-col items-center gap-[8px]" @click="focusInput">
        <span
          class="flex items-center p-[8px] rounded-[32px] transition-colors duration-200"
          :class="active ? 'bg-[#e5eeff]' : 'bg-[#f2f2f4]'"
        >
          <img :src="active ? plusBlueIcon : plusGreyIcon" width="18" height="18" alt="" class="block" />
        </span>
        <span
          class="text-[13px] leading-[1.5] whitespace-nowrap transition-colors duration-200"
          :class="active ? 'text-[#03102f]' : 'text-[#61667c]'"
        >Add chart or table</span>
      </button>

      <Transition name="tile-reveal">
        <div v-if="active" class="flex flex-col items-center gap-[8px] w-full pb-[8px]">
          <button
            v-for="(prompt, i) in prompts"
            :key="prompt"
            type="button"
            class="tile-chip flex items-center w-full px-[12px] py-[4px] rounded-[40px] border border-[#e5e6ea] bg-white hover:bg-[#f6f7f9] hover:border-[#cbcdd4] transition-colors duration-150 text-left"
            :style="{ transitionDelay: `${i * 40}ms` }"
            @click="$emit('ask', prompt)"
          >
            <span class="flex-1 min-w-0 text-[12px] text-[#61667c] leading-[1.5]">{{ prompt }}</span>
          </button>
        </div>
      </Transition>
    </div>

    <Transition name="tile-input">
      <div v-if="active" class="absolute left-[9px] right-[10px] bottom-[7.5px]">
        <AnalyticsPromptInput ref="promptRef" @submit="(text) => $emit('ask', text)" @escape="blurAll" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, useTemplateRef } from 'vue'
import AnalyticsPromptInput from './AnalyticsPromptInput.vue'
import plusGreyIcon from '../../assets/icons/icon-plus-circle-grey.svg'
import plusBlueIcon from '../../assets/icons/chart-plus-blue-18.svg'

defineProps({
  prompts: { type: Array, required: true },
})
defineEmits(['ask'])

const hovered = ref(false)
const focusWithin = ref(false)
const active = computed(() => hovered.value || focusWithin.value)
const promptRef = useTemplateRef('promptRef')

function onFocusOut(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) focusWithin.value = false
}

async function focusInput() {
  hovered.value = true
  await nextTick()
  promptRef.value?.$el.querySelector('input')?.focus()
}

function blurAll() {
  document.activeElement?.blur()
  focusWithin.value = false
}
</script>

<style scoped>
.tile-reveal-enter-active,
.tile-reveal-leave-active {
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.tile-reveal-enter-from,
.tile-reveal-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.tile-input-enter-active,
.tile-input-leave-active {
  transition: opacity 220ms ease, transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
}
.tile-input-enter-from,
.tile-input-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (prefers-reduced-motion: reduce) {
  .tile-reveal-enter-active, .tile-reveal-leave-active,
  .tile-input-enter-active, .tile-input-leave-active { transition: none; }
}
</style>
