<template>
  <div class="flex flex-1 flex-col items-center justify-center bg-white min-w-0 gap-[24px] px-[24px]">

    <div class="flex flex-col items-center gap-[16px] max-w-[400px] text-center">
      <!-- Lock badge -->
      <div class="flex items-center justify-center size-[56px] rounded-full bg-[#f0f4fc]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4.75" y="10" width="14.5" height="10" rx="2.2" stroke="#2465de" stroke-width="1.6" />
          <path d="M8 10V7.8A4 4 0 0112 3.8v0a4 4 0 014 4V10" stroke="#2465de" stroke-width="1.6" />
          <circle cx="12" cy="14.6" r="1.3" fill="#2465de" />
          <path d="M12 15.6v1.6" stroke="#2465de" stroke-width="1.4" stroke-linecap="round" />
        </svg>
      </div>

      <div class="flex flex-col gap-[8px] items-center">
        <p class="text-[18px] font-medium text-[#03102f] leading-[1.35]">Finance is protected</p>
        <p class="text-[14px] font-normal text-[#61667c] leading-[1.5]">
          Enter the Finance passcode to continue. Ask the HitPay team if you don't have it.
        </p>
      </div>
    </div>

    <!-- Passcode form -->
    <form class="flex flex-col items-center gap-[12px] w-[280px]" @submit.prevent="submit">
      <div
        class="gate-input flex items-center w-full h-[36px] rounded-[8px] border bg-white"
        :class="error ? 'gate-input--error border-[#dc3545]' : 'border-[#e5e6ea]'"
        style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
      >
        <input
          ref="inputEl"
          v-model="code"
          type="password"
          placeholder="Passcode"
          autocomplete="off"
          class="flex-1 min-w-0 h-full px-[8px] bg-transparent border-none outline-none text-[14px] font-normal text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
          @input="error = false"
        />
      </div>

      <button
        type="submit"
        class="flex items-center justify-center h-[36px] w-full rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
        style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
      >
        <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Unlock Finance</span>
      </button>

      <p v-if="error" class="text-[13px] font-normal text-[#d92d20] leading-[1.5] text-center">
        That passcode isn't right. Please try again.
      </p>
    </form>

    <button
      type="button"
      class="flex items-center gap-[6px] text-[13px] font-medium text-[#61667c] leading-[1.5] hover:text-[#03102f] transition-colors duration-150"
      @click="activeProduct = 0"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.8 3.5L5.3 7l3.5 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
      Back to Payments
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { activeProduct } from '../../composables/useNav.js'
import { tryUnlockFinance } from '../../composables/useFinanceAuth.js'

const code = ref('')
const error = ref(false)
const inputEl = ref(null)

function submit() {
  if (!tryUnlockFinance(code.value)) {
    error.value = true
    code.value = ''
    inputEl.value?.focus()
  }
}

onMounted(() => inputEl.value?.focus())
</script>

<style scoped>
.gate-input {
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.gate-input:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
}

/* Wrong passcode: quick shake */
.gate-input--error {
  animation: gate-shake 300ms ease-in-out;
}
@keyframes gate-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
}
@media (prefers-reduced-motion: reduce) {
  .gate-input--error { animation: none; }
}
</style>
