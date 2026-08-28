<template>
  <!-- Stacking cube loader (Figma: 42:3616) — the bulk 3dcube's three parts
       stack into place one after another, hold, scatter, repeat -->
  <svg class="cube-loader" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="cube-lid" d="M22.5517 6.62667L15.2367 2.68333C14.4667 2.26333 13.5333 2.26333 12.7633 2.68333L5.44833 6.62667C4.91167 6.91833 4.585 7.47833 4.585 8.12C4.585 8.75 4.91167 9.32167 5.44833 9.61333L12.7633 13.5567C13.1483 13.7667 13.58 13.8717 14 13.8717C14.42 13.8717 14.8517 13.7667 15.2367 13.5567L22.5517 9.61333C23.0883 9.32167 23.415 8.76167 23.415 8.12C23.415 7.47833 23.0883 6.91833 22.5517 6.62667Z" :fill="color"/>
    <path class="cube-left" opacity="0.4" d="M11.5617 14.9217L4.74833 11.515C4.22333 11.2583 3.61583 11.2817 3.12583 11.585C2.62417 11.9 2.33333 12.425 2.33333 13.0083V19.4367C2.33333 20.545 2.95167 21.5483 3.94333 22.05L10.745 25.4567C10.9783 25.5733 11.235 25.6317 11.4917 25.6317C11.795 25.6317 12.0983 25.55 12.3667 25.3867C12.8683 25.0833 13.16 24.5467 13.16 23.9633V17.535C13.1717 16.415 12.5533 15.4117 11.5617 14.9217Z" :fill="color"/>
    <path class="cube-right" opacity="0.4" d="M24.8742 11.585C24.3725 11.2817 23.7658 11.2467 23.2525 11.515L16.4508 14.9217C15.4592 15.4233 14.8408 16.415 14.8408 17.535V23.9633C14.8408 24.5467 15.1325 25.0833 15.6342 25.3867C15.9025 25.55 16.2058 25.6317 16.5092 25.6317C16.7658 25.6317 17.0225 25.5733 17.2558 25.4567L24.0575 22.05C25.0492 21.5483 25.6675 20.5567 25.6675 19.4367V13.0083C25.6675 12.425 25.3758 11.9 24.8742 11.585Z" :fill="color"/>
  </svg>
</template>

<script setup>
defineProps({
  color: { type: String, default: '#9295A5' },
})
</script>

<style scoped>
.cube-loader .cube-lid,
.cube-loader .cube-left,
.cube-loader .cube-right {
  transform-box: fill-box;
  transform-origin: 50% 50%;
}
.cube-loader .cube-left {
  animation: cube-stack-left 2.8s ease-in-out infinite;
}
.cube-loader .cube-right {
  animation: cube-stack-right 2.8s ease-in-out infinite;
}
.cube-loader .cube-lid {
  animation: cube-stack-lid 2.8s ease-in-out infinite;
}
@keyframes cube-stack-left {
  0%        { opacity: 0; transform: translate(-8px, 7px) scale(0.7); }
  10%       { opacity: 0.42; transform: translate(1px, -1px) scale(1.06); }
  15%, 80%  { opacity: 0.4; transform: translate(0, 0) scale(1); }
  92%, 100% { opacity: 0; transform: translate(-4px, 4px) scale(0.8); }
}
@keyframes cube-stack-right {
  0%, 16%   { opacity: 0; transform: translate(8px, 7px) scale(0.7); }
  26%       { opacity: 0.42; transform: translate(-1px, -1px) scale(1.06); }
  31%, 80%  { opacity: 0.4; transform: translate(0, 0) scale(1); }
  92%, 100% { opacity: 0; transform: translate(4px, 4px) scale(0.8); }
}
@keyframes cube-stack-lid {
  0%, 34%   { opacity: 0; transform: translateY(-9px) scale(0.8); }
  46%       { opacity: 1; transform: translateY(1.5px) scale(1.04); }
  52%, 80%  { opacity: 1; transform: translateY(0) scale(1); }
  92%, 100% { opacity: 0; transform: translateY(-4px) scale(0.85); }
}

@media (prefers-reduced-motion: reduce) {
  .cube-loader .cube-lid, .cube-loader .cube-left, .cube-loader .cube-right { animation: none; }
}
</style>
