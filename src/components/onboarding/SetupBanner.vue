<template>
  <!-- Sticky top banner (Figma: warning/300 fill, centered status + right actions) -->
  <div
    class="relative flex items-center justify-center w-full"
    style="height: 40px; background: #ffe0a2;"
  >
    <!-- Centered status -->
    <p class="text-[12px] font-medium" style="line-height: 1.5;">
      <span class="text-[#03102f]">Finish your setup — </span><span class="text-[#61667c]">1 of 4 completed</span>
    </p>

    <!-- Right-aligned actions: Close | Add Bank Account -->
    <div class="absolute flex items-center" style="right: 24px; top: 3px; gap: 8px; padding: 8px;">
      <button
        class="text-[12px] font-medium text-[#61667c] hover:opacity-80 transition-opacity duration-150"
        style="line-height: 1.5;"
        @click="$emit('restore')"
      >Close</button>
      <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5;">|</span>
      <button
        class="text-[12px] font-medium text-[#2465de] hover:opacity-80 transition-opacity duration-150"
        style="line-height: 1.5;"
        @click="$emit('action')"
      >
        <span class="underline" style="text-underline-position: from-font;">Add Bank Account</span> →
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['restore', 'action'])
</script>
