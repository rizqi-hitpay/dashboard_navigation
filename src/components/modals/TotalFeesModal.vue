<template>
  <Teleport to="body">
    <Transition name="pm-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style="background: rgba(3, 16, 47, 0.45); backdrop-filter: blur(4px);"
        @click.self="close"
      >
        <Transition name="pm-card">
          <div
            v-if="modelValue"
            class="relative bg-white flex flex-col overflow-hidden"
            style="width: 320px; max-width: 100%; border-radius: 16px; box-shadow: 0px 3px 11px rgba(38,42,50,0.09), 0px 0px 0px 1px rgba(3,16,47,0.04);"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div class="flex items-start gap-8 p-[16px] border-b border-[#e5e6ea]">
              <div class="flex-1 min-w-px pt-[2px]">
                <p class="text-[16px] font-medium leading-[1.4] text-[#03102f]">Total fees breakdown</p>
              </div>
              <button
                class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]"
                aria-label="Close"
                @click="close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex flex-col gap-[8px] p-[24px]">
              <div
                v-for="row in rows"
                :key="row.label"
                class="flex items-center justify-between h-[20px] w-full"
              >
                <span class="text-[12px] font-medium leading-[1.5] text-[#61667c] whitespace-nowrap">{{ row.label }}</span>
                <span class="text-[14px] leading-[1.4] text-[#03102f]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ row.value }}</span>
              </div>
              <!-- Total -->
              <div class="flex items-center justify-between h-[20px] w-full">
                <span class="text-[12px] font-medium leading-[1.5] text-[#03102f] whitespace-nowrap">Total</span>
                <span class="text-[16px] font-medium leading-[1.4] text-[#03102f]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ total }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#2465de] transition-transform duration-100 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="close"
              >
                <span class="text-[14px] font-medium leading-[1.5] text-white" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">OK</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  rows: { type: Array, default: () => [] }, // [{ label, value }]
  total: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* Shared modal motion — matches PaymentMethodModal and the /motion spec */
.pm-backdrop-enter-active { transition: opacity 220ms ease-out; }
.pm-backdrop-leave-active { transition: opacity 160ms ease-in; }
.pm-backdrop-enter-from,
.pm-backdrop-leave-to { opacity: 0; }

.pm-card-enter-active {
  transition: opacity 240ms ease-out, transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1);
}
.pm-card-leave-active {
  transition: opacity 160ms ease-in, transform 160ms ease-in;
}
.pm-card-enter-from,
.pm-card-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .pm-backdrop-enter-active, .pm-backdrop-leave-active,
  .pm-card-enter-active, .pm-card-leave-active { transition: none; }
  .pm-card-enter-from, .pm-card-leave-to { transform: none; }
}
</style>
