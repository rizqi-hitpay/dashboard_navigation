<template>
  <!-- Design-system form rows (Figma: Input / State=Default → Filled → Focused).
       Each row holds 1–2 fields; selects carry `options`, the dial-code phone
       field carries `type: 'phone'`. Values live in the parent's reactive bag,
       keyed by field label. -->
  <div
    v-for="(row, ri) in rows"
    :key="ri"
    class="flex w-full"
    :class="row.some(f => f.helper) ? 'items-start' : 'items-center'"
    :style="{ gap: '12px', padding: inset ? '0 16px' : '0' }"
  >
    <div v-for="field in row" :key="field.label" class="flex flex-col flex-1 min-w-0" style="gap: 4px;">
      <!-- Label -->
      <span class="flex items-center" style="height: 20px; gap: 2px;">
        <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5;">{{ field.label }}</span>
        <span v-if="field.required" class="text-[14px] text-[#dc3545]" style="line-height: 20px; letter-spacing: 0.035px;">*</span>
      </span>

      <!-- Select -->
      <div v-if="field.options" class="aba-control">
        <select
          v-model="values[field.label]"
          class="aba-select"
          :class="{ 'aba-placeholder': !values[field.label] }"
        >
          <option value="" disabled>{{ field.placeholder }}</option>
          <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <svg class="aba-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/>
        </svg>
      </div>

      <!-- Phone (dial-code prefix) -->
      <div v-else-if="field.type === 'phone'" class="aba-control">
        <button type="button" class="flex items-center gap-[4px] h-full pl-[8px] pr-[8px] border-r border-[#e5e6ea] shrink-0 cursor-pointer">
          <svg class="shrink-0 rounded-[2px]" width="22" height="15" viewBox="0 0 22 15" style="filter: drop-shadow(0px 1px 1.5px rgba(16,24,40,0.1));"><rect width="22" height="15" fill="#fff" /><rect width="22" height="7.5" fill="#EF3340" /><circle cx="4.6" cy="3.75" r="2.3" fill="#fff" /><circle cx="5.5" cy="3.75" r="2" fill="#EF3340" /><g fill="#fff"><circle cx="6.4" cy="2.1" r="0.4" /><circle cx="5" cy="3.1" r="0.4" /><circle cx="7.8" cy="3.1" r="0.4" /><circle cx="5.5" cy="4.7" r="0.4" /><circle cx="7.3" cy="4.7" r="0.4" /></g></svg>
          <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">+65</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
        </button>
        <input
          v-model="values[field.label]"
          type="tel"
          :placeholder="field.placeholder"
          class="aba-input"
        />
      </div>

      <!-- Text input -->
      <div v-else class="aba-control">
        <input
          v-model="values[field.label]"
          type="text"
          :placeholder="field.placeholder"
          class="aba-input"
        />
      </div>

      <!-- Helper -->
      <span v-if="field.helper" class="text-[12px] text-[#61667c] w-full" style="line-height: 1.5;">{{ field.helper }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // Array of rows, each an array of 1–2 field configs
  rows: { type: Array, required: true },
  // Reactive bag keyed by field label; mutated in place via v-model
  values: { type: Object, required: true },
  // Extra 16px horizontal padding per row (Figma "Payment details" variant)
  inset: { type: Boolean, default: false },
})
</script>

<style scoped>
/* ── Input control (Figma: Input / State=Default → Focused) ── */
.aba-control {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
/* Focused: blue border + 3px ring + inner shadow (Figma: Input Shadow/Focused) */
.aba-control:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}

.aba-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 32px 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.aba-select.aba-placeholder {
  color: #9295a5;
}

.aba-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.aba-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.aba-input::placeholder {
  color: #9295a5;
}

@media (prefers-reduced-motion: reduce) {
  .aba-control { transition: none; }
}
</style>
