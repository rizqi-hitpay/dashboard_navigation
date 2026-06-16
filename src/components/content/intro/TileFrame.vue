<template>
  <!-- Product intro illustration frame (Figma: Wrap 148×132 → Container 132×116) -->
  <div
    class="relative flex flex-col items-center shrink-0 rounded-[20px] bg-white"
    style="width: 148px; height: 132px; padding: 8px; border: 1px solid #e5e6ea;"
  >
    <!-- Hover glow (Figma: Shadow — pink left, yellow right; revealed on card hover) -->
    <div
      class="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      aria-hidden="true"
    >
      <div style="position: absolute; left: 53.52px; top: 0; width: 94.482px; height: 132px; border-radius: 120px; background: #faf7cd; filter: blur(28px);"></div>
      <div style="position: absolute; left: 0; top: 0; width: 94.482px; height: 132px; border-radius: 120px; background: #f7d1e0; filter: blur(28px);"></div>
    </div>

    <div
      class="relative z-10 w-full flex-1 min-h-0 overflow-hidden rounded-[12px]"
      style="background: #fdfdfc; border: 1px solid #f3f3ed; box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.08);"
    >
      <slot />
    </div>
  </div>
</template>
