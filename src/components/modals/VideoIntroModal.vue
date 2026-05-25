<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        style="background: rgba(3, 16, 47, 0.55); backdrop-filter: blur(6px);"
        @click.self="$emit('update:modelValue', false)"
      >
        <Transition name="modal-card">
          <div
            v-if="modelValue"
            class="relative bg-white rounded-[12px] overflow-hidden flex flex-col"
            style="
              width: 600px;
              box-shadow: 0px 24px 48px -8px rgba(3,16,47,0.28), 0px 0px 0px 1px rgba(3,16,47,0.06);
            "
          >
            <!-- Close button -->
            <button
              class="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-150"
              style="background: rgba(255,255,255,0.9); box-shadow: 0 1px 4px rgba(3,16,47,0.12);"
              :class="'hover:bg-[#f0f1f5]'"
              @click="$emit('update:modelValue', false)"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="#61667c" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>

            <!-- Video area -->
            <div
              class="relative w-full overflow-hidden"
              style="aspect-ratio: 16/9; background: #03102f;"
            >
              <!-- Video element (hidden until src provided) -->
              <video
                v-if="videoSrc"
                ref="videoEl"
                class="w-full h-full object-cover"
                :src="videoSrc"
                :poster="videoPoster"
                preload="metadata"
                autoplay
                loop
                muted
                playsinline
                @play="isPlaying = true"
                @pause="isPlaying = false"
                @click="togglePlay"
              />

              <!-- Placeholder screen when no video yet -->
              <div v-else class="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                <!-- Subtle grid pattern -->
                <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 24px 24px;"></div>

                <!-- Glow -->
                <div class="absolute" style="width: 320px; height: 320px; background: radial-gradient(circle, rgba(35,100,221,0.18) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>

                <!-- Mock sidebar preview -->
                <div class="relative flex items-stretch rounded-[8px] overflow-hidden border border-white/10" style="height: 148px; width: 320px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                  <!-- Mini NavRail -->
                  <div class="flex flex-col items-center gap-2 pt-3 px-2 shrink-0" style="width: 40px; background: #040d22; border-right: 1px solid rgba(255,255,255,0.06);">
                    <div class="w-5 h-5 rounded-[4px] flex items-center justify-center" style="background: #2364dd;">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <rect x="1" y="1" width="3.5" height="3.5" rx="0.5" fill="white"/>
                        <rect x="5.5" y="1" width="3.5" height="3.5" rx="0.5" fill="rgba(255,255,255,0.4)"/>
                        <rect x="1" y="5.5" width="3.5" height="3.5" rx="0.5" fill="rgba(255,255,255,0.4)"/>
                        <rect x="5.5" y="5.5" width="3.5" height="3.5" rx="0.5" fill="rgba(255,255,255,0.4)"/>
                      </svg>
                    </div>
                    <div class="w-5 h-5 rounded-[4px]" style="background: rgba(255,255,255,0.06);"></div>
                    <div class="w-5 h-5 rounded-[4px]" style="background: rgba(255,255,255,0.06);"></div>
                  </div>

                  <!-- Mini Sidebar -->
                  <div class="flex flex-col pt-3 px-2 gap-1 shrink-0" style="width: 100px; background: #07153b; border-right: 1px solid rgba(255,255,255,0.06);">
                    <div class="h-[5px] rounded-full mb-1" style="width: 60%; background: rgba(255,255,255,0.12);"></div>
                    <div class="flex items-center gap-1.5 rounded-[3px] px-1.5 py-1" style="background: rgba(35,100,221,0.25);">
                      <div class="w-2.5 h-2.5 rounded-[2px]" style="background: #2364dd;"></div>
                      <div class="h-[4px] rounded-full flex-1" style="background: rgba(255,255,255,0.5);"></div>
                    </div>
                    <div class="flex items-center gap-1.5 px-1.5 py-1">
                      <div class="w-2.5 h-2.5 rounded-[2px]" style="background: rgba(255,255,255,0.15);"></div>
                      <div class="h-[4px] rounded-full flex-1" style="background: rgba(255,255,255,0.2);"></div>
                    </div>
                    <div class="flex items-center gap-1.5 px-1.5 py-1">
                      <div class="w-2.5 h-2.5 rounded-[2px]" style="background: rgba(255,255,255,0.15);"></div>
                      <div class="h-[4px] rounded-full flex-1" style="background: rgba(255,255,255,0.2);"></div>
                    </div>
                    <div class="flex items-center gap-1.5 px-1.5 py-1">
                      <div class="w-2.5 h-2.5 rounded-[2px]" style="background: rgba(255,255,255,0.15);"></div>
                      <div class="h-[4px] rounded-full" style="width: 50%; background: rgba(255,255,255,0.2);"></div>
                    </div>
                  </div>

                  <!-- Mini Content -->
                  <div class="flex-1 p-3 flex flex-col gap-2" style="background: #f8f9fc;">
                    <div class="grid grid-cols-3 gap-1.5">
                      <div class="rounded-[3px] p-1.5" style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                        <div class="h-[3px] rounded-full mb-1" style="width: 70%; background: #e5e6ea;"></div>
                        <div class="h-[6px] rounded-full" style="width: 50%; background: #03102f;"></div>
                      </div>
                      <div class="rounded-[3px] p-1.5" style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                        <div class="h-[3px] rounded-full mb-1" style="width: 70%; background: #e5e6ea;"></div>
                        <div class="h-[6px] rounded-full" style="width: 40%; background: #03102f;"></div>
                      </div>
                      <div class="rounded-[3px] p-1.5" style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                        <div class="h-[3px] rounded-full mb-1" style="width: 70%; background: #e5e6ea;"></div>
                        <div class="h-[6px] rounded-full" style="width: 60%; background: #03102f;"></div>
                      </div>
                    </div>
                    <div class="flex-1 rounded-[3px]" style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.08);"></div>
                  </div>
                </div>

                <!-- "Coming soon" label -->
                <div class="mt-4 flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: #2364dd;"></div>
                  <span class="text-[11px] font-medium" style="color: rgba(255,255,255,0.5); letter-spacing: 0.06em;">INTRO VIDEO COMING SOON</span>
                </div>
              </div>

              <!-- Play/Pause overlay (shown when video is provided) -->
              <Transition name="play-btn">
                <button
                  v-if="videoSrc && !isPlaying"
                  class="absolute inset-0 flex items-center justify-center group"
                  style="background: rgba(3,16,47,0.35);"
                  @click="togglePlay"
                >
                  <div
                    class="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-150 group-hover:scale-110"
                    style="background: rgba(255,255,255,0.95); box-shadow: 0 4px 16px rgba(3,16,47,0.3);"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="margin-left: 2px;">
                      <path d="M5 3.5L17 10L5 16.5V3.5Z" fill="#03102f"/>
                    </svg>
                  </div>
                </button>
              </Transition>

              <!-- Duration badge -->
              <div
                v-if="videoDuration"
                class="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style="background: rgba(3,16,47,0.7); color: white; backdrop-filter: blur(4px);"
              >
                {{ videoDuration }}
              </div>
            </div>

            <!-- Content -->
            <div class="px-6 pt-5 pb-6">
              <!-- Tag -->
              <div class="flex items-center gap-1.5 mb-3">
                <div class="w-1.5 h-1.5 rounded-full" style="background: #2364dd;"></div>
                <span class="text-[11px] font-semibold uppercase tracking-widest" style="color: #2364dd; letter-spacing: 0.08em;">What's new</span>
              </div>

              <!-- Title -->
              <h2 class="text-[18px] font-semibold leading-snug mb-2" style="color: #03102f;">
                Meet your new navigation
              </h2>

              <!-- Description -->
              <p class="text-[13px] leading-relaxed mb-5" style="color: #61667c;">
                We've redesigned the HitPay dashboard to make every workflow faster and more intuitive.
                Here's what's changed:
              </p>

              <!-- Feature list -->
              <div class="flex flex-col gap-3">
                <div v-for="item in featureItems" :key="item.title" class="flex items-start gap-3">
                  <!-- Icon bubble -->
                  <div
                    class="shrink-0 w-7 h-7 rounded-[7px] flex items-center justify-center mt-0.5"
                    style="background: #f0f4ff;"
                  >
                    <svg :viewBox="item.viewBox" width="14" height="14" fill="none" v-html="item.svg" />
                  </div>
                  <!-- Text -->
                  <div>
                    <p class="text-[13px] font-semibold leading-tight mb-0.5" style="color: #03102f;">{{ item.title }}</p>
                    <p class="text-[12px] leading-relaxed" style="color: #8093b8;">{{ item.desc }}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  videoSrc:   { type: String, default: '/intro-video.webm' },
  videoPoster: { type: String, default: '' },
  videoDuration: { type: String, default: '0:22' },
})

const emit = defineEmits(['update:modelValue'])

const videoEl = ref(null)
const isPlaying = ref(false)

const featureItems = [
  {
    title: 'Collapsible sidebar',
    desc: 'Collapse the sidebar to icons-only to reclaim screen space, then hover to preview it instantly without losing your place.',
    viewBox: '0 0 14 14',
    svg: `<rect x="1" y="1" width="12" height="12" rx="2" stroke="#2364dd" stroke-width="1.2"/>
          <line x1="5" y1="1" x2="5" y2="13" stroke="#2364dd" stroke-width="1.2"/>`,
  },
  {
    title: 'Product switcher',
    desc: 'Jump between Payments, Commerce, and Finance from the left rail. Each product has its own focused menu so you always see what matters.',
    viewBox: '0 0 14 14',
    svg: `<rect x="1" y="1" width="5" height="5" rx="1" fill="#2364dd"/>
          <rect x="8" y="1" width="5" height="5" rx="1" fill="#2364dd" opacity=".4"/>
          <rect x="1" y="8" width="5" height="5" rx="1" fill="#2364dd" opacity=".4"/>
          <rect x="8" y="8" width="5" height="5" rx="1" fill="#2364dd" opacity=".4"/>`,
  },
  {
    title: 'Quick actions',
    desc: 'Create a payment link, invoice, or transfer in one click from the + button — no need to navigate to a separate page first.',
    viewBox: '0 0 14 14',
    svg: `<circle cx="7" cy="7" r="6" stroke="#2364dd" stroke-width="1.2"/>
          <line x1="7" y1="4" x2="7" y2="10" stroke="#2364dd" stroke-width="1.2" stroke-linecap="round"/>
          <line x1="4" y1="7" x2="10" y2="7" stroke="#2364dd" stroke-width="1.2" stroke-linecap="round"/>`,
  },
  {
    title: 'AI Sidekick',
    desc: 'Open the Sidekick panel to ask questions about your data, get summaries, or take actions — all without leaving the current page.',
    viewBox: '0 0 14 14',
    svg: `<path d="M5.5 3.5L6.7 5.8L9 7L6.7 8.2L5.5 10.5L4.3 8.2L2 7L4.3 5.8Z" fill="#2364dd"/>
          <path d="M11.5 1.5L12 2.5L13 3L12 3.5L11.5 4.5L11 3.5L10 3L11 2.5Z" fill="#2364dd" opacity=".7"/>
          <circle cx="12" cy="11" r="0.9" fill="#2364dd" opacity=".5"/>`,
  },
]

// Auto-play when modal opens; pause and reset when it closes
watch(() => props.modelValue, (open) => {
  nextTick(() => {
    if (!videoEl.value) return
    if (open) {
      videoEl.value.play().catch(() => {})
    } else {
      videoEl.value.pause()
      videoEl.value.currentTime = 0
    }
  })
})

function togglePlay() {
  if (!videoEl.value) return
  if (isPlaying.value) {
    videoEl.value.pause()
  } else {
    videoEl.value.play().catch(() => {})
  }
}

</script>

<style scoped>
/* Backdrop fade */
.modal-backdrop-enter-active { transition: opacity 220ms ease-out; }
.modal-backdrop-leave-active { transition: opacity 160ms ease-in; }
.modal-backdrop-enter-from,
.modal-backdrop-leave-to { opacity: 0; }

/* Card: scale up from center + fade */
.modal-card-enter-active {
  transition: opacity 240ms ease-out, transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1);
}
.modal-card-leave-active {
  transition: opacity 160ms ease-in, transform 160ms ease-in;
}
.modal-card-enter-from {
  opacity: 0;
  transform: scale(0.93) translateY(12px);
}
.modal-card-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}

/* Play button fade */
.play-btn-enter-active { transition: opacity 150ms ease-out; }
.play-btn-leave-active { transition: opacity 100ms ease-in; }
.play-btn-enter-from,
.play-btn-leave-to { opacity: 0; }
</style>
