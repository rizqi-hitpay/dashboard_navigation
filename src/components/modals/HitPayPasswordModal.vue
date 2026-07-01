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
                <p class="text-[16px] font-medium leading-[1.4] text-[#03102f]">Enter HitPay Password</p>
              </div>
              <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" aria-label="Close" @click="close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex flex-col items-center gap-[12px] p-[24px]">
              <span class="flex items-center justify-center p-[8px] rounded-full" style="background: rgba(0,39,113,0.04);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="15" r="4.5" stroke="#2465de" stroke-width="1.6" />
                  <path d="M12.2 11.8l6.8-6.8M16.8 5h2.5v2.5M15 7l2 2" stroke="#2465de" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <p class="text-[14px] text-[#03102f] leading-[1.5] text-center w-full">Enter your HitPay password to confirm your authorization for this action.</p>
              <div class="flex flex-col gap-[4px] items-start w-full">
                <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Password</span>
                <div class="aba-control" style="gap: 8px;">
                  <input
                    v-model="password"
                    :type="visible ? 'text' : 'password'"
                    placeholder="HitPay password"
                    class="aba-input"
                    @keyup.enter="submit"
                  />
                  <button type="button" class="shrink-0 flex items-center justify-center pr-[8px]" :style="{ opacity: visible ? 1 : 0.75 }" aria-label="Toggle password" @click="visible = !visible">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.2 8S3.6 3.8 8 3.8 14.8 8 14.8 8 12.4 12.2 8 12.2 1.2 8 1.2 8z" stroke="#61667c" stroke-width="1.3" /><circle cx="8" cy="8" r="2" stroke="#61667c" stroke-width="1.3" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-center gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea]">
              <button
                type="button"
                class="flex-1 flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-transform duration-100 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="close"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex-1 flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#2465de] transition-transform duration-100 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="submit"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Submit</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue', 'confirm'])

const password = ref('')
const visible = ref(false)

watch(() => props.modelValue, (open) => {
  if (open) { password.value = ''; visible.value = false }
})

function close() { emit('update:modelValue', false) }
function submit() { emit('confirm'); emit('update:modelValue', false) }
</script>

<style scoped>
.pm-backdrop-enter-active { transition: opacity 220ms ease-out; }
.pm-backdrop-leave-active { transition: opacity 160ms ease-in; }
.pm-backdrop-enter-from,
.pm-backdrop-leave-to { opacity: 0; }
.pm-card-enter-active { transition: opacity 240ms ease-out, transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1); }
.pm-card-leave-active { transition: opacity 160ms ease-in, transform 160ms ease-in; }
.pm-card-enter-from,
.pm-card-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }
@media (prefers-reduced-motion: reduce) {
  .pm-backdrop-enter-active, .pm-backdrop-leave-active, .pm-card-enter-active, .pm-card-leave-active { transition: none; }
  .pm-card-enter-from, .pm-card-leave-to { transform: none; }
}

/* Local copy of the shared form-field control (this modal is teleported to body,
   outside BillDetailsPage's scoped styles) */
.aba-control {
  position: relative; display: flex; align-items: center; width: 100%; height: 36px;
  background: white; border: 1px solid #e5e6ea; border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.aba-control:focus-within { border-color: #2465de; box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0,0,0,0.24); }
.aba-input { flex: 1; min-width: 0; height: 100%; background: transparent; border: none; outline: none; padding: 0 8px; font-size: 14px; line-height: 1.5; color: #03102f; }
.aba-input::placeholder { color: #9295a5; }
</style>
