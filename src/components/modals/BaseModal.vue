<template>
  <!-- Standard modal shell — appearance and step motion follow FundCardModal -->
  <Teleport to="body">
    <Transition name="hp-modal">
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
        <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="emit('close')" />
        <div
          ref="cardEl"
          class="hp-modal__card relative bg-white rounded-[16px] max-w-full flex flex-col overflow-hidden"
          :style="{ width: width + 'px', boxShadow: '0px 3px 22px 0px rgba(38,42,50,0.09)' }"
          role="dialog"
          aria-modal="true"
        >
          <slot name="header" />
          <!-- Keyed steps cross-fade while the card animates to its new height -->
          <Transition v-if="stepKey !== undefined" name="hp-step" mode="out-in" @before-leave="lockHeight" @after-enter="releaseHeight">
            <div :key="stepKey" class="flex flex-col min-h-0">
              <slot />
            </div>
          </Transition>
          <slot v-else />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  open: { type: Boolean, default: false },
  width: { type: Number, default: 480 },
  // Changing this key cross-fades the default slot and animates the card size
  stepKey: { type: [String, Number], default: undefined },
})

const emit = defineEmits(['close'])

const cardEl = ref(null)
let lockedHeight = 0

// Height is auto in the resting state; on a step change we pin the current
// pixel height, let the new content mount, then tween to its natural height
function lockHeight() {
  const el = cardEl.value
  if (!el) return
  lockedHeight = el.offsetHeight
  el.style.height = lockedHeight + 'px'
}

function releaseHeight() {
  const el = cardEl.value
  if (!el) return
  el.style.height = 'auto'
  const target = el.offsetHeight
  el.style.height = lockedHeight + 'px'
  void el.offsetHeight
  el.style.height = target + 'px'
  // Return to auto height once the tween lands (timeout covers a missed event)
  const done = () => {
    el.style.height = ''
    el.removeEventListener('transitionend', onEnd)
    clearTimeout(doneTimer)
  }
  const onEnd = (e) => {
    if (e.target === el && e.propertyName === 'height') done()
  }
  const doneTimer = setTimeout(done, 340)
  el.addEventListener('transitionend', onEnd)
}
</script>

<style scoped>
/* Card resizes between steps like the Fund modal's width change */
.hp-modal__card {
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1), height 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modal: backdrop fade + card rise (Fund recipe) */
.hp-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.hp-modal-leave-active { transition: opacity 150ms ease-in; }
.hp-modal-enter-from,
.hp-modal-leave-to { opacity: 0; }
.hp-modal-enter-active .hp-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.hp-modal-enter-from .hp-modal__card { transform: translateY(12px); }

/* Step content cross-fade */
.hp-step-enter-active { transition: opacity 150ms ease-out, transform 150ms ease-out; }
.hp-step-leave-active { transition: opacity 120ms ease-in, transform 120ms ease-in; }
.hp-step-enter-from { opacity: 0; transform: translateY(6px); }
.hp-step-leave-to { opacity: 0; transform: translateY(-6px); }

@media (prefers-reduced-motion: reduce) {
  .hp-modal__card,
  .hp-modal-enter-active, .hp-modal-leave-active,
  .hp-step-enter-active, .hp-step-leave-active { transition: none; }
  .hp-modal-enter-from .hp-modal__card,
  .hp-step-enter-from, .hp-step-leave-to { transform: none; }
}
</style>
