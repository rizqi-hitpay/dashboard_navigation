<template>
  <!-- Product intro illustration frame (Figma: Product Image/*, 132×112) -->
  <div
    class="flex shrink-0 overflow-hidden rounded-[16px]"
    style="width: 132px; height: 112px; padding: 4px 4px 12px; background: linear-gradient(to bottom, #e5eeff, #c2d7ff);"
  >
    <div
      class="relative flex-1 min-w-0 overflow-hidden rounded-[12px]"
      style="
        background: rgba(240, 243, 248, 0.7);
        border: 0.698px solid white;
        box-shadow:
          0px 40.491px 24.434px 0px rgba(70, 145, 226, 0.05),
          0px 18.151px 18.151px 0px rgba(70, 145, 226, 0.09),
          0px 4.189px 9.774px 0px rgba(70, 145, 226, 0.1);
      "
    >
      <slot />
    </div>
  </div>
</template>
