<template>
  <div
    class="flex flex-col overflow-hidden rounded-[12px]"
    style="width: 314px; background: #fcfcfd; border: 3px solid #f8bfbc; box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
  >
    <!-- Head -->
    <div
      class="flex flex-col items-center w-full"
      style="background: #f5f6f9; padding: 8px 12px; gap: 8px; border-bottom: 4px solid #f2f2f4;"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex items-end flex-1 min-w-0" style="gap: 8px;">
          <span class="text-[14px] font-medium text-[#03102f] whitespace-nowrap" style="line-height: 1.5;">Finish your setup</span>
          <span class="text-[13px] text-[#61667c]" style="line-height: 1.5;">1 of 4 completed</span>
        </div>
        <!-- Actions (Figma: minus + full-screen arrow when minimized) -->
        <div class="shrink-0 flex items-center" style="gap: 9px;">
          <!-- Minus → minimize the card into the sticky top banner -->
          <Transition name="icon-swap">
            <button
              v-if="minimized"
              class="shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity duration-150"
              style="width: 14px; height: 14px;"
              aria-label="Minimize to banner"
              @click="setupBannerVisible = true"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.91667 7H11.0833" stroke="#9295A5" stroke-width="1.16667" stroke-linecap="round"/>
              </svg>
            </button>
          </Transition>

          <!-- Minimize (expanded) / restore (minimized) toggle -->
          <button
            class="shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity duration-150"
            style="width: 14px; height: 14px;"
            :aria-label="minimized ? 'Expand' : 'Minimize'"
            @click="toggleMinimize"
          >
            <Transition name="icon-swap" mode="out-in">
              <!-- Expanded → arrows inward (minimize) -->
              <svg v-if="!minimized" key="minimize" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6.41667 7C6.55955 7.00002 6.69745 7.05247 6.80422 7.14742C6.91099 7.24236 6.9792 7.37319 6.99592 7.51508L7 7.58333V10.5C6.99984 10.6487 6.9429 10.7917 6.84084 10.8998C6.73877 11.0079 6.59928 11.073 6.45085 11.0817C6.30243 11.0904 6.15628 11.0421 6.04227 10.9467C5.92825 10.8513 5.85498 10.7159 5.83742 10.5683L5.83333 10.5V8.9915L2.74575 12.0791C2.64077 12.1837 2.49991 12.2444 2.35178 12.249C2.20364 12.2535 2.05933 12.2015 1.94817 12.1034C1.83701 12.0054 1.76732 11.8688 1.75327 11.7212C1.73921 11.5737 1.78184 11.4263 1.8725 11.3091L1.92092 11.2542L5.0085 8.16667H3.5C3.35132 8.1665 3.20831 8.10957 3.1002 8.00751C2.99209 7.90544 2.92703 7.76594 2.91832 7.61752C2.9096 7.4691 2.95789 7.32295 3.05332 7.20893C3.14875 7.09492 3.28411 7.02164 3.43175 7.00408L3.5 7H6.41667ZM11.2542 1.92092C11.3592 1.8163 11.5001 1.75556 11.6482 1.75103C11.7964 1.74651 11.9407 1.79854 12.0518 1.89656C12.163 1.99458 12.2327 2.13124 12.2467 2.27878C12.2608 2.42632 12.2182 2.57367 12.1275 2.69092L12.0791 2.74575L8.9915 5.83333H10.5C10.6487 5.8335 10.7917 5.89043 10.8998 5.9925C11.0079 6.09456 11.073 6.23406 11.0817 6.38248C11.0904 6.53091 11.0421 6.67706 10.9467 6.79107C10.8513 6.90508 10.7159 6.97836 10.5683 6.99592L10.5 7H7.58333C7.44046 6.99998 7.30255 6.94753 7.19578 6.85258C7.08901 6.75764 7.0208 6.62681 7.00408 6.48492L7 6.41667V3.5C7.00017 3.35132 7.0571 3.20831 7.15916 3.1002C7.26123 2.99209 7.40072 2.92703 7.54915 2.91832C7.69757 2.9096 7.84372 2.95789 7.95774 3.05332C8.07175 3.14875 8.14502 3.28411 8.16258 3.43175L8.16667 3.5V5.0085L11.2542 1.92092Z" fill="#9295A5"/>
              </svg>
              <!-- Minimized → arrows outward (full screen / restore) -->
              <svg v-else key="expand" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.71258 7.46258C5.81756 7.35796 5.95842 7.29722 6.10656 7.2927C6.25469 7.28818 6.399 7.34021 6.51016 7.43823C6.62133 7.53625 6.69101 7.67291 6.70507 7.82044C6.71912 7.96798 6.67649 8.11534 6.58583 8.23258L6.53742 8.28742L3.7415 11.0833H5.25C5.39868 11.0835 5.54169 11.1404 5.6498 11.2425C5.75791 11.3446 5.82297 11.4841 5.83168 11.6325C5.8404 11.7809 5.79211 11.9271 5.69668 12.0411C5.60125 12.1551 5.46589 12.2284 5.31825 12.2459L5.25 12.25H2.33333C2.19046 12.25 2.05255 12.1975 1.94578 12.1026C1.83901 12.0076 1.7708 11.8768 1.75408 11.7349L1.75 11.6667V8.75C1.75017 8.60132 1.8071 8.45831 1.90916 8.3502C2.01123 8.24209 2.15072 8.17703 2.29915 8.16832C2.44757 8.1596 2.59372 8.20789 2.70774 8.30332C2.82175 8.39875 2.89502 8.53411 2.91258 8.68175L2.91667 8.75V10.2585L5.71258 7.46258ZM11.6667 1.75C11.8095 1.75002 11.9474 1.80247 12.0542 1.89742C12.161 1.99236 12.2292 2.12319 12.2459 2.26508L12.25 2.33333V5.25C12.2498 5.39868 12.1929 5.54169 12.0908 5.6498C11.9888 5.75791 11.8493 5.82297 11.7009 5.83168C11.5524 5.8404 11.4063 5.79211 11.2923 5.69668C11.1783 5.60125 11.105 5.46589 11.0874 5.31825L11.0833 5.25V3.7415L8.28742 6.53742C8.18244 6.64204 8.04158 6.70278 7.89344 6.7073C7.74531 6.71182 7.601 6.65979 7.48984 6.56177C7.37867 6.46375 7.30899 6.3271 7.29493 6.17956C7.28088 6.03202 7.32351 5.88466 7.41417 5.76742L7.46258 5.71258L10.2585 2.91667H8.75C8.60132 2.9165 8.45831 2.85957 8.3502 2.75751C8.24209 2.65544 8.17703 2.51594 8.16832 2.36752C8.1596 2.2191 8.20789 2.07295 8.30332 1.95893C8.39875 1.84492 8.53411 1.77164 8.68175 1.75408L8.75 1.75H11.6667Z" fill="#9295A5"/>
              </svg>
            </Transition>
          </button>
        </div>
      </div>

      <!-- Progress -->
      <div class="w-full overflow-hidden rounded-[24px] bg-white" style="height: 4px;">
        <div style="height: 100%; width: 87px; background: #2465de; transition: width 400ms cubic-bezier(0.32, 0.72, 0, 1);"></div>
      </div>

      <!-- Next step (minimized only, Figma: "Next: …") -->
      <div v-if="minimized && nextStep" class="flex items-center w-full text-[13px]" style="gap: 4px;">
        <span class="text-[#03102f] whitespace-nowrap" style="line-height: 1.5;">Next:</span>
        <button
          class="flex-1 min-w-0 text-left truncate text-[#2465de] hover:opacity-75 transition-opacity duration-150"
          style="line-height: 1.5;"
          @click="nextStep.onClick?.()"
        >{{ nextStep.label }}</button>
      </div>
    </div>

    <!-- Body (collapses when minimized) -->
    <div class="accordion-grid" :style="{ gridTemplateRows: minimized ? '0fr' : '1fr' }">
      <div style="min-height: 0; overflow: hidden;">
        <div class="flex flex-col" style="padding: 8px; gap: 4px;">

          <!-- Accordion sections -->
          <div
            v-for="section in sections"
            :key="section.title"
            class="flex flex-col w-full bg-white rounded-[8px]"
            style="padding: 4px; filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.03));"
          >
            <!-- Section head -->
            <button
              class="flex items-center w-full text-left"
              style="padding: 4px 12px; gap: 16px;"
              @click="toggle(section)"
            >
              <span class="flex-1 min-w-0 text-[14px] font-medium text-[#03102f] truncate" style="line-height: 1.5;">{{ section.title }}</span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none" class="shrink-0"
                :style="{ transform: section.open ? 'none' : 'rotate(180deg)', transition: 'transform 200ms ease' }"
              >
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5286 5.52853C7.78893 5.26819 8.21107 5.26819 8.4714 5.52853L12.2427 9.2998C12.503 9.56013 12.503 9.9822 12.2427 10.2426C11.9823 10.5029 11.5602 10.5029 11.2998 10.2426L8 6.94273L4.70017 10.2426C4.43982 10.5029 4.01771 10.5029 3.75736 10.2426C3.49701 9.9822 3.49701 9.56013 3.75736 9.2998L7.5286 5.52853Z" fill="#9295A5"/>
              </svg>
            </button>

            <!-- Section checklist -->
            <div class="accordion-grid" :style="{ gridTemplateRows: section.open ? '1fr' : '0fr' }">
              <div style="min-height: 0; overflow: hidden;">
                <div class="flex flex-col" style="padding: 0 12px 8px; gap: 2px;">
                  <div
                    v-for="item in section.items"
                    :key="item.label"
                    class="flex flex-col justify-center w-full"
                    style="padding: 4px 0; gap: 4px;"
                  >
                    <div class="flex items-center w-full" style="gap: 8px;">
                      <!-- Check indicator -->
                      <span
                        v-if="item.done"
                        class="shrink-0 flex items-center justify-center rounded-full"
                        style="width: 12px; height: 12px; background: #2bc37d;"
                      >
                        <svg width="7.5" height="7.5" viewBox="0 0 7.5 7.5" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.62253 1.70767C6.74456 1.82971 6.74456 2.02757 6.62253 2.14961L3.10909 5.66306C2.97485 5.79728 2.7572 5.79728 2.62295 5.66306L0.877284 3.91737C0.755247 3.79534 0.755247 3.59747 0.877284 3.47544C0.999322 3.35341 1.19719 3.35341 1.31922 3.47544L2.86602 5.02222L6.18059 1.70767C6.30263 1.58563 6.5005 1.58563 6.62253 1.70767Z" fill="white"/>
                        </svg>
                      </span>
                      <span
                        v-else
                        class="shrink-0 rounded-full bg-white"
                        style="width: 12px; height: 12px; border: 1px solid #80acfe;"
                      ></span>

                      <span class="flex-1 min-w-0 text-[13px]" :class="item.done ? 'text-[#9295a5]' : 'text-[#03102f]'" style="line-height: 1.5;">{{ item.label }}</span>

                      <button
                        v-if="item.action"
                        class="shrink-0 text-[12px] font-medium text-[#2465de] hover:opacity-75 transition-opacity duration-150 whitespace-nowrap"
                        style="line-height: 1.5;"
                        @click="item.onClick?.()"
                      >{{ item.action }} →</button>
                    </div>

                    <!-- Payment method chips -->
                    <div v-if="item.chips" class="flex items-center" style="gap: 4px; padding-left: 16px;">
                      <span
                        v-for="chip in item.chips"
                        :key="chip.label"
                        class="flex items-center justify-center text-[12px] font-medium rounded-[24px]"
                        :style="chip.enabled
                          ? 'min-height: 24px; padding: 2px 8px; background: white; border: 1px solid #81e3b6; color: #238b5b;'
                          : 'min-height: 24px; padding: 2px 8px; background: #f2f2f4; color: #484d61;'"
                      >
                        <svg v-if="chip.enabled" width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 2px; margin-left: -2px;">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1281 3.64303C14.3884 3.90338 14.3884 4.32549 14.1281 4.58584L6.63273 12.0812C6.34634 12.3675 5.88202 12.3675 5.59563 12.0812L1.87154 8.35707C1.61119 8.09673 1.61119 7.6746 1.87154 7.41427C2.13189 7.15393 2.554 7.15393 2.81435 7.41427L6.11418 10.7141L13.1853 3.64303C13.4456 3.38268 13.8677 3.38268 14.1281 3.64303Z" fill="#238B5B"/>
                        </svg>
                        {{ chip.label }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useNewUser } from '../../composables/useNewUser'

const { verificationPageOpen, bankAccountPageOpen, setupBannerVisible, setupCardMinimized: minimized } = useNewUser()

function toggleMinimize() {
  minimized.value = !minimized.value
}

const sections = reactive([
  {
    title: 'Verify your account',
    open: true,
    items: [
      { label: 'Create account', done: true },
      { label: 'Account verification', done: false, action: 'Proceed', onClick: () => { verificationPageOpen.value = true } },
    ],
  },
  {
    title: 'Setup payments',
    open: true,
    items: [
      { label: 'Link bank account', done: false, action: 'Proceed', onClick: () => { bankAccountPageOpen.value = true } },
      {
        label: 'Enable payment method',
        done: false,
        action: 'Manage',
        chips: [
          { label: 'Local QR', enabled: true },
          { label: 'Cards', enabled: false },
          { label: 'Cross-border', enabled: false },
        ],
      },
    ],
  },
])

// First incomplete step — surfaced as the "Next:" action while minimized
const nextStep = computed(() => {
  for (const section of sections) {
    const item = section.items.find((it) => !it.done)
    if (item) return item
  }
  return null
})

function toggle(section) {
  section.open = !section.open
}
</script>

<style scoped>
/* Height auto-animation via grid rows — transform-free, no measuring */
.accordion-grid {
  display: grid;
  transition: grid-template-rows 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Quick crossfade + scale when the minimize/expand icon swaps */
.icon-swap-enter-active { transition: opacity 120ms ease-out, transform 120ms ease-out; }
.icon-swap-leave-active { transition: opacity 80ms ease, transform 80ms ease; }
.icon-swap-enter-from,
.icon-swap-leave-to { opacity: 0; transform: scale(0.6); }

@media (prefers-reduced-motion: reduce) {
  .accordion-grid { transition: none; }
  .icon-swap-enter-active,
  .icon-swap-leave-active { transition: none; }
}
</style>
