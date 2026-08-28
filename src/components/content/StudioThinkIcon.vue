<template>
  <!-- Thinking icon (Figma: 52:11838) — star spins clockwise, outer ring
       counter-rotates while breathing down until it hides behind the star -->
  <svg class="size-[20px] shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g class="think-ring-scale">
    <g class="think-ring">
      <path d="M5 19.1667C4.53976 19.1667 4.16667 18.7936 4.16667 18.3333C4.16667 17.8731 4.53976 17.5 5 17.5C5.46024 17.5 5.83333 17.8731 5.83333 18.3333C5.83333 18.7936 5.46024 19.1667 5 19.1667Z" fill="url(#thinkGrad1)"/>
      <path d="M15 2.5C14.5398 2.5 14.1667 2.1269 14.1667 1.66667C14.1667 1.20643 14.5398 0.833333 15 0.833333C15.4602 0.833333 15.8333 1.20643 15.8333 1.66667C15.8333 2.1269 15.4602 2.5 15 2.5Z" fill="url(#thinkGrad1)"/>
      <path d="M18.3333 5.83333C17.8731 5.83333 17.5 5.46024 17.5 5C17.5 4.53976 17.8731 4.16667 18.3333 4.16667C18.7936 4.16667 19.1667 4.53976 19.1667 5C19.1667 5.46024 18.7936 5.83333 18.3333 5.83333Z" fill="url(#thinkGrad1)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5956 12.4961C18.9837 12.641 19.1808 13.073 19.036 13.461C18.0978 15.9747 16.1501 17.9939 13.6857 19.0252C13.3036 19.1851 12.8642 19.005 12.7043 18.6229C12.5444 18.2408 12.7245 17.8014 13.1066 17.6415C15.1895 16.7698 16.8377 15.0612 17.6307 12.9365C17.7755 12.5485 18.2075 12.3513 18.5956 12.4961Z" fill="url(#thinkGrad1)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.51731 1.40386C7.66245 1.79182 7.46562 2.22397 7.07766 2.36912C4.94129 3.16838 3.2256 4.83575 2.36043 6.9422C2.20306 7.32536 1.76487 7.50839 1.38172 7.35102C0.998566 7.19365 0.815533 6.75546 0.972905 6.37231C1.99612 3.88108 4.02332 1.91027 6.55206 0.964217C6.94001 0.819076 7.37217 1.01591 7.51731 1.40386Z" fill="url(#thinkGrad1)"/>
      <path d="M1.66667 15.8333C1.20643 15.8333 0.833333 15.4602 0.833333 15C0.833333 14.5398 1.20643 14.1667 1.66667 14.1667C2.1269 14.1667 2.5 14.5398 2.5 15C2.5 15.4602 2.1269 15.8333 1.66667 15.8333Z" fill="url(#thinkGrad1)"/>
    </g>
    </g>
    <path class="think-star" d="M8.9123 4.18879C9.18888 3.04817 10.8111 3.04817 11.0877 4.18879L11.8487 7.3273C11.9475 7.73454 12.2655 8.0525 12.6727 8.15125L15.8112 8.91229C16.9518 9.18888 16.9518 10.8111 15.8112 11.0877L12.6727 11.8487C12.2655 11.9475 11.9475 12.2654 11.8487 12.6727L11.0877 15.8112C10.8111 16.9518 9.18888 16.9518 8.9123 15.8112L8.15126 12.6727C8.05251 12.2654 7.73455 11.9475 7.32731 11.8487L4.1888 11.0877C3.04818 10.8111 3.04818 9.18888 4.1888 8.91229L7.32731 8.15125C7.73455 8.0525 8.05251 7.73454 8.15126 7.3273L8.9123 4.18879Z" fill="url(#thinkGrad0)"/>
    <defs>
      <radialGradient id="thinkGrad0" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.06061 5.75757) rotate(71.9958) scale(12.7453 12.7453)">
        <stop stop-color="#9295A5"/>
        <stop offset="1" stop-color="#CBCDD4"/>
      </radialGradient>
      <radialGradient id="thinkGrad1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.58333 4.16667) rotate(71.9958) scale(17.5248)">
        <stop stop-color="#9295A5"/>
        <stop offset="1" stop-color="#CBCDD4"/>
      </radialGradient>
    </defs>
  </svg>
</template>

<style scoped>
.think-star,
.think-ring,
.think-ring-scale {
  transform-box: fill-box;
  transform-origin: 50% 50%;
}
.think-star {
  animation: think-spin 4s linear infinite;
}
.think-ring {
  animation: think-spin-ccw 2.4s linear infinite;
}
.think-ring-scale {
  animation: think-ring-breathe 2.4s ease-in-out infinite;
}
@keyframes think-spin {
  to { transform: rotate(360deg); }
}
@keyframes think-spin-ccw {
  to { transform: rotate(-360deg); }
}
@keyframes think-ring-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(0.15); }
}

@media (prefers-reduced-motion: reduce) {
  .think-star, .think-ring, .think-ring-scale { animation: none; }
}
</style>
