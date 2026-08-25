<template>
  <div class="relative h-full w-full overflow-hidden bg-white">

    <!-- ============ Workspace (Figma: 24:20960) — under the landing during the morph ============ -->
    <div v-if="phase !== 'landing'" class="absolute inset-0 flex">

      <!-- Docked Studio sidebar (Figma: 47:7739) — pushes the content -->
      <div
        class="shrink-0 h-full overflow-hidden"
        :class="sidebarDocked ? 'border-r border-[#e5e6ea]' : ''"
        :style="{ width: sidebarDocked ? '220px' : '0px', transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)' }"
      >
        <StudioSidebar :apps="apps" :active-app-id="currentApp?.id" @new-app="startNewApp" @select-app="selectApp" />
      </div>

      <!-- Chat panel (Figma: 24:21294 — 425px, border-right).
           Collapses away in full-screen mode (Figma: 2001:9463) -->
      <div
        class="shrink-0 h-full overflow-hidden"
        :class="isFullscreen ? '' : 'border-r border-[#e5e6ea]'"
        :style="{ width: isFullscreen ? '0px' : '425px', transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)' }"
      >
      <aside class="ws-stagger flex flex-col w-[425px] h-full shrink-0 bg-white" style="--wd: 0ms;">
        <!-- Head -->
        <div class="flex items-center gap-[16px] h-[48px] shrink-0 p-[12px] border-b border-[#e5e6ea]">
          <button
            class="flex items-center justify-center size-[24px] -m-[4px] rounded-[4px] transition-colors duration-150 hover:bg-[#f0f1f5]"
            aria-label="Toggle Studio sidebar"
            :aria-expanded="sidebarDocked"
            @click="toggleSidebar"
          >
            <img :src="panelSidebarIcon" alt="" class="size-[16px]" />
          </button>
          <span class="flex-1 text-[13px] font-medium text-[#03102f] leading-[1.5] truncate">{{ currentApp?.title }}</span>
        </div>

        <!-- Chat room (Figma: 42:3516 / 47:9097 — bottom-anchored, newest message on top) -->
        <div class="flex-1 flex flex-col justify-end gap-[8px] px-[16px] overflow-hidden min-h-0">
          <Transition name="thinking-fade" :duration="220">
          <div v-if="currentApp && !currentApp.built" class="ws-msg flex items-center gap-[4px] pr-[12px] w-full" style="--wd: 1050ms;">
            <!-- Thinking icon (Figma: 52:11838) — star and outer ring both rotate clockwise -->
            <svg class="size-[20px] shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Ring painted first so it slips BEHIND the star as it scales down -->
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
            <div class="p-[8px] rounded-[16px] max-w-[336px]">
              <p class="text-[13px] leading-[1.5] text-[#61667c]">I’m thinking while initiating your workspace...</p>
            </div>
          </div>
          </Transition>
          <template v-for="m in currentApp?.messages || []" :key="m.id">
            <!-- AI reply row (Figma: 47:9099) -->
            <div v-if="m.role === 'ai'" class="ws-msg flex flex-col items-start w-full" :style="{ '--wd': `${m.delay}ms` }">
              <div class="p-[8px] rounded-[16px] w-full">
                <p class="text-[13px] leading-[1.5] text-[#03102f] max-w-[320px]">{{ m.text }}</p>
              </div>
            </div>
            <!-- User row -->
            <div v-else class="ws-msg flex flex-col items-end w-full" :style="{ '--wd': `${m.delay}ms` }">
              <div class="bg-[#4c8afd] px-[12px] py-[8px] rounded-[16px] max-w-[324px]">
                <p class="text-[13px] leading-[1.5] text-white">{{ m.text }}</p>
              </div>
            </div>
          </template>
        </div>

        <!-- Docked chat input (Figma: 24:21318 — the morph ghost lands here).
             Dynamic height: grows with attachments (2001:3524) and text -->
        <div class="shrink-0 py-[8px] mx-[12px] mb-[4px]" :style="{ visibility: inputMorphDone ? 'visible' : 'hidden' }">
          <div
            ref="wsInputRef"
            class="flex flex-col gap-[12px] w-full bg-white rounded-[16px] p-[12px] overflow-hidden"
            style="border: 1.5px solid rgba(0,0,0,0.05);"
          >
            <!-- Attached files/images (Figma: 2001:3527 — 64px rounded-12 thumbs) -->
            <div v-if="wsFiles.length" class="flex flex-wrap gap-[8px] w-full shrink-0">
              <div
                v-for="(f, i) in wsFiles"
                :key="`${f.name}-${i}`"
                class="att-thumb relative size-[64px] rounded-[12px] overflow-hidden shrink-0"
              >
                <img v-if="f.previewUrl" :src="f.previewUrl" alt="" class="size-full object-cover" />
                <div v-else class="size-full bg-[#f2f2f4] flex items-center justify-center">
                  <img :src="attachmentIcon" alt="" class="size-[20px]" />
                </div>
                <button
                  class="att-remove absolute inset-0 flex items-center justify-center text-white text-[18px] leading-none"
                  :aria-label="`Remove ${f.name}`"
                  @click="removeFile(wsFiles, i)"
                >&times;</button>
              </div>
            </div>
            <textarea
              v-model="wsPrompt"
              rows="1"
              placeholder="Build anything..."
              class="w-full resize-none outline-none bg-transparent text-[13px] leading-[1.5] text-[#03102f] placeholder-[#9295a5]"
              style="height: 49px;"
              @input="autoGrow"
              @keydown.enter.exact.prevent="sendWsMessage"
            />
            <div class="flex items-center justify-between w-full shrink-0">
              <StudioAttachButton @files="addFiles(wsFiles, $event)" />
              <button
                class="flex items-center justify-center size-[28px] rounded-full transition-[filter] duration-150 hover:brightness-105"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); border: 1px solid #2465de; box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                aria-label="Send"
                @click="sendWsMessage"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.4714 2.42411C8.21107 2.16375 7.78893 2.16375 7.5286 2.4241L3.75735 6.19534C3.49701 6.45569 3.49701 6.8778 3.75735 7.13813C4.01771 7.39847 4.43981 7.39847 4.70017 7.13813L7.33333 4.50498V13.3334C7.33333 13.7016 7.6318 14.0001 8 14.0001C8.3682 14.0001 8.66667 13.7016 8.66667 13.3334V4.50499L11.2998 7.13813C11.5602 7.39847 11.9823 7.39847 12.2427 7.13813C12.503 6.8778 12.503 6.45569 12.2427 6.19534L8.4714 2.42411Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
      </div>

      <!-- Preview area (Figma: 24:21353) -->
      <section class="ws-stagger relative flex flex-col flex-1 h-full min-w-0 bg-white" style="--wd: 120ms;">
        <!-- Head — collapses away in full-screen mode -->
        <div
          class="shrink-0 overflow-hidden"
          :style="{ height: isFullscreen ? '0px' : '48px', transition: 'height 250ms cubic-bezier(0.4, 0, 0.2, 1)' }"
        >
        <div class="flex items-center justify-between h-[48px] px-[12px] py-[8px] border-b border-[#e5e6ea]">
          <!-- User chip with usage meter (Figma: 52:11926) -->
          <div class="flex items-center gap-[8px] bg-[#fcfcfd] border border-[#e5e6ea] rounded-[40px] px-[8px] py-[4px]">
            <img :src="user2Icon" alt="" class="size-[14px]" />
            <span class="text-[12px] leading-[1.5] text-[#03102f] whitespace-nowrap">Cherry QA</span>
            <div
              class="relative w-[120px] h-[8px] bg-white rounded-[16px] overflow-hidden"
              style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
            >
              <div class="usage-fill absolute left-0 top-1/2 -translate-y-1/2 h-[9px] w-[26px] bg-[#4c8afd]" />
            </div>
          </div>
          <div class="flex items-center gap-[8px]">
            <!-- Last published time (Figma: 2008:13804) -->
            <Transition name="published-fade">
              <span
                v-if="lastPublishedLabel"
                class="pr-[8px] text-[12px] leading-[1.5] text-[#61667c] whitespace-nowrap"
              >Last published: {{ lastPublishedLabel }}</span>
            </Transition>
            <button
              class="flex items-center justify-center size-[28px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f1f5]"
              aria-label="Full screen"
              @click="enterFullscreen"
            >
              <img :src="arrowFullscreenIcon" alt="" class="size-[16px]" />
            </button>
            <button
              class="flex items-center justify-center w-[80px] h-[28px] rounded-[8px] text-[12px] font-medium text-white transition-[filter] duration-150 hover:brightness-105 disabled:cursor-default disabled:hover:brightness-100"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); border: 1px solid #2465de; box-shadow: 0px 1.5px 0px 0px #1d5fd9; text-shadow: 0px 1px 1px rgba(0,0,0,0.12);"
              :disabled="publishing"
              @click="publishApp"
            >
              <span v-if="publishing" class="publish-spinner" aria-label="Publishing" />
              <template v-else>Publish</template>
            </button>
          </div>
        </div>
        </div>

        <!-- IFRAME area: stacking-cube loader while building, the built app after
             (Figma: 24:21361 / 42:3616 → 47:9109) -->
        <Transition name="loader-fade" mode="out-in" :duration="260">
        <div v-if="!currentApp?.built" class="flex-1 min-h-0 bg-[#fcfcfd] flex flex-col items-center justify-center gap-[12px]">
          <svg class="cube-loader" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="cube-lid" d="M22.5517 6.62667L15.2367 2.68333C14.4667 2.26333 13.5333 2.26333 12.7633 2.68333L5.44833 6.62667C4.91167 6.91833 4.585 7.47833 4.585 8.12C4.585 8.75 4.91167 9.32167 5.44833 9.61333L12.7633 13.5567C13.1483 13.7667 13.58 13.8717 14 13.8717C14.42 13.8717 14.8517 13.7667 15.2367 13.5567L22.5517 9.61333C23.0883 9.32167 23.415 8.76167 23.415 8.12C23.415 7.47833 23.0883 6.91833 22.5517 6.62667Z" fill="#9295A5"/>
            <path class="cube-left" opacity="0.4" d="M11.5617 14.9217L4.74833 11.515C4.22333 11.2583 3.61583 11.2817 3.12583 11.585C2.62417 11.9 2.33333 12.425 2.33333 13.0083V19.4367C2.33333 20.545 2.95167 21.5483 3.94333 22.05L10.745 25.4567C10.9783 25.5733 11.235 25.6317 11.4917 25.6317C11.795 25.6317 12.0983 25.55 12.3667 25.3867C12.8683 25.0833 13.16 24.5467 13.16 23.9633V17.535C13.1717 16.415 12.5533 15.4117 11.5617 14.9217Z" fill="#9295A5"/>
            <path class="cube-right" opacity="0.4" d="M24.8742 11.585C24.3725 11.2817 23.7658 11.2467 23.2525 11.515L16.4508 14.9217C15.4592 15.4233 14.8408 16.415 14.8408 17.535V23.9633C14.8408 24.5467 15.1325 25.0833 15.6342 25.3867C15.9025 25.55 16.2058 25.6317 16.5092 25.6317C16.7658 25.6317 17.0225 25.5733 17.2558 25.4567L24.0575 22.05C25.0492 21.5483 25.6675 20.5567 25.6675 19.4367V13.0083C25.6675 12.425 25.3758 11.9 24.8742 11.585Z" fill="#9295A5"/>
          </svg>
          <p class="text-[13px] leading-[1.5] text-[#61667c]">Setting up your workspace</p>
        </div>

        <!-- Built app preview (Figma: 47:9109 "IFRAME") -->
        <div v-else class="flex-1 min-h-0 bg-[#fcfcfd] overflow-y-auto">
          <div class="flex flex-col gap-[32px] min-h-full" :class="compactApp ? 'p-[16px]' : 'p-[24px]'">
            <!-- Header row -->
            <div class="app-in flex flex-wrap gap-y-[12px] items-center justify-between w-full shrink-0" style="--ad: 0ms;">
              <div class="flex flex-col gap-[4px]">
                <p class="text-[28px] font-extrabold text-[#03102f] whitespace-nowrap" style="line-height: normal;">Good morning, Sarah</p>
                <p class="text-[14px] text-[#61667c] whitespace-nowrap" style="line-height: normal;">Here is your shift breakdown for today • Tech &amp; Design Team</p>
              </div>
              <div class="flex items-center gap-[12px] bg-white border border-[#e5e6ea] rounded-[12px] p-[12px]">
                <p class="text-[13px] text-[#61667c] whitespace-nowrap" style="line-height: normal;">Current status:</p>
                <div class="flex items-center gap-[6px] bg-[#fef2f2] rounded-[20px] px-[12px] py-[6px]">
                  <span class="size-[6px] rounded-full bg-[#ef4444]" />
                  <p class="text-[12px] font-bold text-[#ef4444] whitespace-nowrap" style="line-height: normal;">Clocked Out</p>
                </div>
              </div>
            </div>

            <!-- Dashboard grid: side-by-side normally, stacked when the sidebar is docked (Figma: 47:8005) -->
            <div class="flex gap-[32px] items-stretch flex-1 min-h-0 w-full" :class="compactApp ? 'flex-col' : ''">
              <!-- Left column -->
              <div class="flex flex-col gap-[24px]" :class="compactApp ? 'w-full shrink-0' : 'flex-1 min-w-0'">
                <!-- Clock card -->
                <div class="app-in flex flex-col gap-[32px] items-center justify-center bg-white border border-[#e5e6ea] rounded-[24px] p-[40px]" :class="compactApp ? '' : 'flex-1'" style="--ad: 90ms;">
                  <div class="flex flex-col gap-[8px] items-center">
                    <p class="text-[56px] font-extrabold text-[#03102f] whitespace-nowrap" style="line-height: normal;">{{ liveTime }}</p>
                    <p class="text-[16px] font-medium text-[#61667c] whitespace-nowrap" style="line-height: normal;">{{ liveDate }}</p>
                  </div>
                  <div class="flex items-center justify-center size-[220px] rounded-full bg-[#eaf0fe]">
                    <button
                      class="flex flex-col gap-[10px] items-center justify-center size-[180px] rounded-full bg-[#2465de] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                      style="filter: drop-shadow(0px 8px 12px rgba(36,101,222,0.3));"
                    >
                      <img :src="fingerprintIcon" alt="" class="size-[72px]" />
                      <p class="text-[18px] font-bold text-white whitespace-nowrap" style="line-height: normal;">Clock In</p>
                    </button>
                  </div>
                  <p class="text-[14px] text-[#61667c] text-center w-full" style="line-height: normal;">Click to log your attendance. Location: HQ - New York Office</p>
                </div>
                <!-- Shift metrics -->
                <div class="app-in flex gap-[20px] items-start w-full shrink-0" style="--ad: 180ms;">
                  <div class="flex flex-col gap-[8px] flex-1 min-w-0 bg-white border border-[#e5e6ea] rounded-[16px] p-[20px]">
                    <p class="text-[13px] text-[#61667c] whitespace-nowrap" style="line-height: normal;">Today's Hours</p>
                    <p class="font-extrabold text-[#03102f] whitespace-nowrap" :class="compactApp ? 'text-[24px]' : 'text-[20px]'" style="line-height: normal;">0.00h</p>
                  </div>
                  <div class="flex flex-col gap-[8px] flex-1 min-w-0 bg-white border border-[#e5e6ea] rounded-[16px] p-[20px]">
                    <p class="text-[13px] text-[#61667c] whitespace-nowrap" style="line-height: normal;">Scheduled Shift</p>
                    <p class="font-extrabold text-[#03102f] whitespace-nowrap" :class="compactApp ? 'text-[20px]' : 'text-[13px]'" style="line-height: normal;">09:00 - 18:00</p>
                  </div>
                  <div class="flex flex-col gap-[8px] flex-1 min-w-0 bg-white border border-[#e5e6ea] rounded-[16px] p-[20px]">
                    <p class="text-[13px] text-[#61667c] whitespace-nowrap" style="line-height: normal;">Break Allowed</p>
                    <p class="font-extrabold text-[#03102f] whitespace-nowrap" :class="compactApp ? 'text-[24px]' : 'text-[20px]'" style="line-height: normal;">1.00h</p>
                  </div>
                </div>
              </div>
              <!-- Right column: activity log (full width when stacked) -->
              <div class="app-in flex flex-col gap-[20px] shrink-0 bg-white border border-[#e5e6ea] rounded-[24px] p-[24px]" :class="compactApp ? 'w-full' : 'w-[420px]'" style="--ad: 270ms;">
                <p class="text-[18px] font-bold text-[#03102f] whitespace-nowrap" style="line-height: normal;">Recent Log Activity</p>
                <div class="flex flex-col gap-[16px] w-full">
                  <div v-for="(a, i) in activityLog" :key="i" class="flex gap-[12px] items-start w-full">
                    <span
                      class="flex items-center justify-center size-[36px] rounded-full shrink-0"
                      :style="{ background: a.type === 'in' ? '#ecfdf5' : '#fef2f2' }"
                    >
                      <span class="size-[6px] rounded-full" :style="{ background: a.type === 'in' ? '#10b981' : '#ef4444' }" />
                    </span>
                    <div class="flex flex-col gap-[2px] flex-1 min-w-0">
                      <p class="text-[14px] font-semibold text-[#03102f] whitespace-nowrap" style="line-height: normal;">{{ a.title }}</p>
                      <p class="text-[12px] text-[#61667c] whitespace-nowrap" style="line-height: normal;">{{ a.meta }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Transition>

        <!-- Exit full screen: floating pencil, expands to "Edit" on hover
             (Figma: 2001:9670 rest / 2008:14017 hover) -->
        <Transition name="fab-pop">
          <button
            v-if="isFullscreen"
            class="fab-edit absolute bottom-[24px] right-[24px] flex items-center gap-[8px] h-[44px] rounded-full bg-[#03102f] z-30 overflow-hidden whitespace-nowrap"
            aria-label="Exit full screen"
            @click="exitFullscreen"
          >
            <img :src="pencilIcon" alt="" class="size-[20px] shrink-0" />
            <span class="fab-label text-[16px] font-medium text-white" style="line-height: 1.4;">Edit</span>
          </button>
        </Transition>
      </section>
    </div>

    <!-- ============ Landing (Figma: 20:8569, with existing apps: 42:4809) —
         fades out over the workspace ============ -->
    <div
      v-if="phase !== 'workspace'"
      class="absolute inset-0 bg-white overflow-hidden flex"
      :class="phase === 'leaving' ? 'landing-leave' : ''"
    >
      <!-- Docked Studio sidebar once the user has apps (Figma: 42:4838) -->
      <div v-if="apps.length" class="shrink-0 h-full border-r border-[#e5e6ea]">
        <StudioSidebar
          :apps="apps"
          :active-app-id="null"
          new-app-active
          @new-app="focusPrompt"
          @select-app="openAppFromLanding"
        />
      </div>

      <div class="relative flex-1 min-w-0 h-full overflow-hidden">
      <!-- Animated background (Figma: 23:20959 "BG"). The white bg here matters:
           the animated wrapper is a stacking context, so the overlay-blended
           halftone needs a white backdrop inside it (like Figma's frame fill). -->
      <div class="studio-bg absolute inset-0 bg-white pointer-events-none" aria-hidden="true">
        <!-- Blurred gradient blobs, anchored to the bottom (1347x576 in the 784-tall design) -->
        <div class="absolute bottom-0 left-0 right-0" style="height: 73.5%;">
          <!-- Blue blob -->
          <img
            :src="bg1"
            alt=""
            class="bg-blob bg-blob-1 absolute max-w-none"
            style="left: -14.85%; top: -34.72%; width: 129.7%; height: 169.44%;"
          />
          <!-- Cream blob — mirrored horizontally (rotate-180 + scaleY(-1) in Figma) -->
          <div class="absolute inset-0" style="transform: scaleX(-1);">
            <img
              :src="bg2"
              alt=""
              class="bg-blob bg-blob-2 absolute max-w-none"
              style="left: -14.85%; top: -34.72%; width: 129.7%; height: 169.44%;"
            />
          </div>
        </div>
        <!-- Halftone dot pattern (3.5px tiles, overlay blend) -->
        <div class="absolute inset-0 mix-blend-overlay">
          <div class="absolute inset-0 opacity-20" :style="halftoneStyle1" />
          <div class="absolute inset-0 opacity-50" :style="halftoneStyle1" />
          <div class="absolute inset-0" :style="halftoneStyle2" />
        </div>
      </div>

      <!-- Centered build form (Figma: 23:20953 "Build Form", 500px column) -->
      <div class="relative z-10 h-full w-full flex items-center justify-center">
        <div class="flex flex-col gap-[8px] w-[500px] max-w-[calc(100%-48px)]">

          <div class="flex flex-col gap-[24px] items-center w-full">
            <!-- Title -->
            <h1
              class="stagger w-full text-center text-[24px] font-medium text-[#03102f]"
              style="--d: 0ms; line-height: 1.35;"
            >What do you want to build, Cherry?</h1>

            <!-- Chat input with animated gradient glow — grows with attachments/text -->
            <div class="stagger relative w-full py-[8px]" style="--d: 100ms;">
              <!-- Glow (Figma: 21:20863 "Blur" — radial blue→yellow, blur 18, 40%) -->
              <div class="input-glow absolute left-0 right-0 top-[8px] bottom-[8px] rounded-[16px]" />

              <div
                ref="landingInputRef"
                class="relative flex flex-col gap-[12px] w-full bg-white rounded-[16px] p-[12px] overflow-hidden"
                style="border: 3px solid rgba(0,0,0,0.05);"
                :style="{ visibility: ghost.active ? 'hidden' : 'visible' }"
              >
                <!-- Attached files/images (Figma: 2001:3527 — 64px rounded-12 thumbs) -->
                <div v-if="landingFiles.length" class="flex flex-wrap gap-[8px] w-full shrink-0">
                  <div
                    v-for="(f, i) in landingFiles"
                    :key="`${f.name}-${i}`"
                    class="att-thumb relative size-[64px] rounded-[12px] overflow-hidden shrink-0"
                  >
                    <img v-if="f.previewUrl" :src="f.previewUrl" alt="" class="size-full object-cover" />
                    <div v-else class="size-full bg-[#f2f2f4] flex items-center justify-center">
                      <img :src="attachmentIcon" alt="" class="size-[20px]" />
                    </div>
                    <button
                      class="att-remove absolute inset-0 flex items-center justify-center text-white text-[18px] leading-none"
                      :aria-label="`Remove ${f.name}`"
                      @click="removeFile(landingFiles, i)"
                    >&times;</button>
                  </div>
                </div>
                <textarea
                  ref="promptRef"
                  v-model="prompt"
                  rows="1"
                  :placeholder="animatedPlaceholder"
                  class="w-full resize-none outline-none bg-transparent text-[14px] leading-[1.5] text-[#03102f] placeholder-[#9295a5]"
                  style="height: 49px;"
                  @input="autoGrow"
                  @keydown.enter.exact.prevent="startBuild"
                />
                <div class="flex items-center justify-between w-full shrink-0">
                  <!-- Attach (+) button with dropdown (Figma: 50:11449) -->
                  <StudioAttachButton @files="addFiles(landingFiles, $event)" />
                  <!-- Send button -->
                  <button
                    class="flex items-center justify-center size-[28px] rounded-full transition-[filter] duration-150 hover:brightness-105"
                    style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); border: 1px solid #2465de; box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                    aria-label="Send"
                    @click="startBuild"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.4714 2.42411C8.21107 2.16375 7.78893 2.16375 7.5286 2.4241L3.75735 6.19534C3.49701 6.45569 3.49701 6.8778 3.75735 7.13813C4.01771 7.39847 4.43981 7.39847 4.70017 7.13813L7.33333 4.50498V13.3334C7.33333 13.7016 7.6318 14.0001 8 14.0001C8.3682 14.0001 8.66667 13.7016 8.66667 13.3334V4.50499L11.2998 7.13813C11.5602 7.39847 11.9823 7.39847 12.2427 7.13813C12.503 6.8778 12.503 6.45569 12.2427 6.19534L8.4714 2.42411Z" fill="white"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Suggestions (Figma: 23:20952) -->
          <div class="flex flex-col gap-[8px] w-full">
            <div class="stagger px-[8px]" style="--d: 200ms;">
              <span
                class="text-[10px] font-medium uppercase text-[#61667c]"
                style="letter-spacing: 0.3px; line-height: 18px;"
              >Example that you can build</span>
            </div>
            <div class="flex flex-col gap-[8px] items-start">
              <button
                v-for="(suggestion, i) in suggestions"
                :key="suggestion"
                class="stagger bg-white px-[12px] py-[8px] rounded-[40px] text-[12px] leading-[1.5] text-[#61667c] whitespace-nowrap transition-colors duration-150 hover:bg-[#f8f9fc]"
                style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.03));"
                :style="{ '--d': `${260 + i * 70}ms` }"
                @click="useSuggestion(suggestion)"
              >{{ suggestion }}</button>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>

    <!-- Success snackbar (same recipe as CardsPage / BalancePage) -->
    <Teleport to="body">
      <div class="fixed top-[24px] inset-x-0 z-[80] flex justify-center pointer-events-none">
        <Transition name="snackbar">
          <div
            v-if="toast"
            class="flex items-center gap-[8px] p-[12px] rounded-[8px] bg-[#e6f9f0] border border-[#b3eed2] pointer-events-auto"
            style="filter: drop-shadow(0px 8px 6px rgba(42,50,82,0.04));"
          >
            <img :src="snackbarCheckIcon" width="24" height="24" alt="" class="shrink-0" />
            <span class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ toast }}</span>
          </div>
        </Transition>
      </div>
    </Teleport>

    <!-- ============ Morph ghost: the input card flying to its docked position ============ -->
    <div
      v-if="ghost.active"
      class="fixed z-50 pointer-events-none flex flex-col gap-[12px] bg-white rounded-[16px] p-[12px] overflow-hidden"
      :class="ghost.anim ? 'ghost-anim' : ''"
      :style="ghost.style"
    >
      <p class="flex-1 w-full text-left text-[#03102f] overflow-hidden" style="font-size: 13.5px; line-height: 1.5;">{{ ghost.text }}</p>
      <div class="flex items-center justify-between w-full shrink-0">
        <span
          class="flex items-center justify-center size-[28px] rounded-full"
          style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); border: 1px solid #f2f2f4; box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.33333 13.3333C7.33333 13.7015 7.6318 14 8 14C8.3682 14 8.66667 13.7015 8.66667 13.3333V8.66667H13.3333C13.7015 8.66667 14 8.3682 14 8C14 7.6318 13.7015 7.33333 13.3333 7.33333H8.66667V2.66667C8.66667 2.29848 8.3682 2 8 2C7.6318 2 7.33333 2.29848 7.33333 2.66667V7.33333H2.66667C2.29848 7.33333 2 7.6318 2 8C2 8.3682 2.29848 8.66667 2.66667 8.66667H7.33333V13.3333Z" fill="#61667C"/>
          </svg>
        </span>
        <span
          class="flex items-center justify-center size-[28px] rounded-full"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); border: 1px solid #2465de; box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.4714 2.42411C8.21107 2.16375 7.78893 2.16375 7.5286 2.4241L3.75735 6.19534C3.49701 6.45569 3.49701 6.8778 3.75735 7.13813C4.01771 7.39847 4.43981 7.39847 4.70017 7.13813L7.33333 4.50498V13.3334C7.33333 13.7016 7.6318 14.0001 8 14.0001C8.3682 14.0001 8.66667 13.7016 8.66667 13.3334V4.50499L11.2998 7.13813C11.5602 7.39847 11.9823 7.39847 12.2427 7.13813C12.503 6.8778 12.503 6.45569 12.2427 6.19534L8.4714 2.42411Z" fill="white"/>
          </svg>
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'
import { activeProduct } from '../../composables/useNav.js'
import StudioAttachButton from '../content/StudioAttachButton.vue'
import StudioSidebar from '../navigation/StudioSidebar.vue'
import attachmentIcon from '../../assets/icons/icon-attachment.svg'

import bg1 from '../../assets/images/studio-bg-1.svg'
import bg2 from '../../assets/images/studio-bg-2.svg'
import halftone1 from '../../assets/images/studio-halftone-1.png'
import halftone2 from '../../assets/images/studio-halftone-2.png'
import panelSidebarIcon from '../../assets/icons/icon-panel-sidebar.svg'
import user2Icon from '../../assets/icons/icon-user-2.svg'
import arrowFullscreenIcon from '../../assets/icons/icon-arrow-fullscreen.svg'
import fingerprintIcon from '../../assets/icons/studio-app-fingerprint.svg'
import pencilIcon from '../../assets/icons/icon-pencil-white-20.svg'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'

// Deep links to /studio activate the Studio product in the nav rail
onMounted(() => { activeProduct.value = 3 })

const halftoneStyle1 = {
  backgroundImage: `url("${halftone1}")`,
  backgroundSize: '3.5px 3.5px',
  backgroundPosition: 'top left',
}
const halftoneStyle2 = {
  backgroundImage: `url("${halftone2}")`,
  backgroundSize: '3.5px 3.5px',
  backgroundPosition: 'top left',
}

const prompt = ref('')
const promptRef = useTemplateRef('promptRef')

const suggestions = [
  'Create a stock reminder for most sold products',
  'Create a clock-in and clock-out app for my staff',
  'Create a custom report and product suggestion for my business',
]

function useSuggestion(text) {
  prompt.value = text
  promptRef.value?.focus()
}

// ---------------------------------------------------------------------------
// Landing → workspace transition
// phase: 'landing' → 'leaving' (both layers + morph ghost) → 'workspace'
// ---------------------------------------------------------------------------
const phase = ref('landing')
const wsPrompt = ref('')
const landingFiles = ref([])
const wsFiles = ref([])

// Attachments render as 64px thumbnails inside the input (Figma: 2001:3527);
// images get an object-URL preview, other files a paperclip tile.
function addFiles(list, files) {
  list.push(...files.map((file) => ({
    file,
    name: file.name,
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
  })))
}

function removeFile(list, i) {
  const [removed] = list.splice(i, 1)
  if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
}

// The input textarea grows with its content (base height: one design row)
function autoGrow(e) {
  const el = e.target
  el.style.height = '49px'
  el.style.height = `${Math.max(49, Math.min(el.scrollHeight, 140))}px`
}

// Apps built this session (listed in the Studio sidebar: 47:8307). Each app
// keeps its own chat (messages are newest first, per the design: 47:9097).
const apps = ref([])
const currentApp = ref(null)
let msgId = 0
let appId = 0

// Each app "builds" a few seconds after its workspace opens (Figma: 47:8854)
const BUILD_DURATION_MS = 7000
let buildTimer = null

const AI_RESPONSE =
  "Here's your staff clock-in/clock-out app — 4 screens covering the core workflow: " +
  'It includes a home screen with a prominent clock-in button, a weekly timesheet, ' +
  'a monthly history view, and a profile/settings screen.'

function finishBuild(app) {
  app.built = true
  app.messages.unshift({ id: ++msgId, role: 'ai', text: AI_RESPONSE, delay: 0 })
}

function sendWsMessage() {
  const text = wsPrompt.value.trim()
  if (!text || !currentApp.value) return
  currentApp.value.messages.unshift({ id: ++msgId, role: 'me', text, delay: 0 })
  wsPrompt.value = ''
}

// ---------------------------------------------------------------------------
// Studio sidebar: click the panel icon to dock/undock it (47:7739)
// ---------------------------------------------------------------------------
const sidebarDocked = ref(false)

function toggleSidebar() {
  sidebarDocked.value = !sidebarDocked.value
}

// Full-screen preview (Figma: 2001:9463): the chat panel and preview head
// collapse away and the app fills the content; a pencil FAB exits.
// Entering always shows the sidebar menu; exiting restores how it was.
const isFullscreen = ref(false)
let dockedBeforeFullscreen = false

function enterFullscreen() {
  dockedBeforeFullscreen = sidebarDocked.value
  sidebarDocked.value = true
  isFullscreen.value = true
}
function exitFullscreen() {
  isFullscreen.value = false
  sidebarDocked.value = dockedBeforeFullscreen
}

// The app uses its narrow, stacked layout only when the docked sidebar
// actually squeezes it — full screen always gets the wide layout.
const compactApp = computed(() => sidebarDocked.value && !isFullscreen.value)

function selectApp(app) {
  currentApp.value = app
}

// Publishing shows a brief loading spinner, stamps the app, and confirms via
// snackbar; the head then shows "Last published: Today, 05:11PM" (2008:13804).
const publishing = ref(false)
let publishTimer = null

function publishApp() {
  if (!currentApp.value || publishing.value) return
  publishing.value = true
  const app = currentApp.value
  publishTimer = setTimeout(() => {
    publishing.value = false
    app.publishedAt = new Date()
    showToast('App published successfully')
  }, 1400)
}

// Snackbar — same one-shot toast recipe as CardsPage
const toast = ref('')
let toastTimer = null

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

const lastPublishedLabel = computed(() => {
  const d = currentApp.value?.publishedAt
  if (!d) return ''
  const time = d
    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    .replace(' ', '')
  const isToday = d.toDateString() === new Date().toDateString()
  const day = isToday ? 'Today' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${day}, ${time}`
})

// Opening an app from the landing's sidebar fades into its workspace
function openAppFromLanding(app) {
  placeholderStopped = true
  currentApp.value = app
  sidebarDocked.value = true
  inputMorphDone.value = true
  phase.value = 'leaving'
  setTimeout(() => { phase.value = 'workspace' }, 430)
}

function focusPrompt() {
  promptRef.value?.focus()
}

function startNewApp() {
  currentApp.value = null
  isFullscreen.value = false
  inputMorphDone.value = false
  prompt.value = ''
  wsPrompt.value = ''
  landingFiles.value = []
  wsFiles.value = []
  phase.value = 'landing'
  // Restart the typing placeholder for the fresh landing screen
  placeholderStopped = false
  typedIdea.value = placeholderIdeas[0]
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    runPlaceholderLoop()
  } else {
    placeholderStopped = true
  }
}

// Live clock for the built app (the design's node is named "live-time-display")
const now = ref(new Date())
let clockTimer = null
const liveTime = computed(() =>
  now.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
)
const liveDate = computed(() =>
  now.value.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
)

const activityLog = [
  { type: 'out', title: 'Clocked Out', meta: 'Oct 23, 06:02 PM • 8.2 hours logged' },
  { type: 'in', title: 'Clocked In', meta: 'Oct 23, 08:55 AM • On time' },
  { type: 'out', title: 'Clocked Out', meta: 'Oct 22, 06:12 PM • 8.1 hours logged' },
  { type: 'in', title: 'Clocked In', meta: 'Oct 22, 08:58 AM • On time' },
  { type: 'out', title: 'Clocked Out', meta: 'Oct 21, 05:58 PM • 7.9 hours logged' },
]

onMounted(() => { clockTimer = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => {
  clearInterval(clockTimer)
  clearTimeout(buildTimer)
  clearTimeout(publishTimer)
  clearTimeout(toastTimer)
  for (const f of [...landingFiles.value, ...wsFiles.value]) {
    if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
  }
})
const inputMorphDone = ref(false)
const landingInputRef = useTemplateRef('landingInputRef')
const wsInputRef = useTemplateRef('wsInputRef')

const ghost = reactive({ active: false, anim: false, text: '', style: {} })

const titleMap = {
  'create a stock reminder for most sold products': 'Stock Reminder',
  'create a clock-in and clock-out app for my staff': 'Clock-in Clock-out',
  'create a custom report and product suggestion for my business': 'Custom Report',
}

function deriveTitle(text) {
  const mapped = titleMap[text.toLowerCase()]
  if (mapped) return mapped
  const stripped = text.replace(/^(please\s+)?(create|build|make|design)\s+(an?\s+|the\s+)?/i, '')
  const words = stripped.split(/\s+/).filter(Boolean).slice(0, 3)
  if (!words.length) return 'New App'
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function rectToStyle(rect, borderWidth) {
  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.05)',
    borderWidth,
  }
}

async function startBuild() {
  const text = prompt.value.trim()
  if (!text || phase.value !== 'landing') return

  placeholderStopped = true
  // If the landing showed the docked sidebar (user already has apps),
  // keep it docked in the workspace for continuity (Figma: 42:4809)
  if (apps.value.length > 0) sidebarDocked.value = true
  const app = reactive({
    id: ++appId,
    title: deriveTitle(text),
    messages: [{ id: ++msgId, role: 'me', text, delay: 620 }],
    built: false,
  })
  apps.value.push(app)
  currentApp.value = app
  buildTimer = setTimeout(() => finishBuild(app), BUILD_DURATION_MS)

  const from = landingInputRef.value?.getBoundingClientRect()
  phase.value = 'leaving'
  await nextTick()
  const to = wsInputRef.value?.getBoundingClientRect()

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !from || !to) {
    inputMorphDone.value = true
    phase.value = 'workspace'
    return
  }

  ghost.text = text
  ghost.style = rectToStyle(from, '3px')
  ghost.anim = false
  ghost.active = true
  await nextTick()
  requestAnimationFrame(() => {
    ghost.anim = true
    ghost.style = rectToStyle(to, '1.5px')
  })
  setTimeout(() => {
    inputMorphDone.value = true
    ghost.active = false
    phase.value = 'workspace'
  }, 540)
}

// ---------------------------------------------------------------------------
// Typing-effect placeholder (Lovable-style): the "Build " prefix stays put
// while rotating ideas are typed out, held, then deleted back to the prefix.
// ---------------------------------------------------------------------------
const placeholderIdeas = [
  'anything...',
  'a stock reminder for most sold products...',
  'a clock-in and clock-out app for my staff...',
  'a custom report for my business...',
  'a loyalty program for my regulars...',
]

const typedIdea = ref(placeholderIdeas[0])
const animatedPlaceholder = computed(() => 'Build ' + typedIdea.value)

let placeholderStopped = false
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runPlaceholderLoop() {
  // Let the stagger entrance settle, then hold the design's default text
  await sleep(2400)
  let i = 0
  while (!placeholderStopped) {
    // Delete back to the "Build " prefix, slightly faster than typing
    while (typedIdea.value.length > 0 && !placeholderStopped) {
      typedIdea.value = typedIdea.value.slice(0, -1)
      await sleep(18)
    }
    if (placeholderStopped) break
    await sleep(300)

    // Type the next idea character by character
    i = (i + 1) % placeholderIdeas.length
    for (const ch of placeholderIdeas[i]) {
      if (placeholderStopped) break
      typedIdea.value += ch
      await sleep(38)
    }
    await sleep(2000)
  }
}

onMounted(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    runPlaceholderLoop()
  }
})
onUnmounted(() => { placeholderStopped = true })
</script>

<style scoped>
/* Stagger entrance: fade + rise, per-element delay via --d */
.stagger {
  opacity: 0;
  animation: studio-fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--d, 0ms);
}
@keyframes studio-fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Background fades in as a whole, then the blobs drift forever */
.studio-bg {
  animation: studio-bg-in 900ms ease-out both;
}
@keyframes studio-bg-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.bg-blob {
  will-change: transform;
}
.bg-blob-1 {
  animation: studio-blob-1 18s ease-in-out infinite alternate;
}
.bg-blob-2 {
  animation: studio-blob-2 23s ease-in-out infinite alternate;
}
@keyframes studio-blob-1 {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to   { transform: translate3d(3.5%, 2%, 0) scale(1.1); }
}
@keyframes studio-blob-2 {
  from { transform: translate3d(0, 0, 0) scale(1.08) rotate(1.5deg); }
  to   { transform: translate3d(-3%, 1.5%, 0) scale(1); }
}

/* Gradient glow behind the input — same palette as the Figma radial
   (#6284f7 → #889dd0 → #afb6a9 → #d5ce82 → #fce75b), flowing endlessly.
   The stops are mirrored so the loop is seamless. */
.input-glow {
  filter: blur(18px);
  opacity: 0.4;
  background: linear-gradient(
    100deg,
    #6284f7 0%, #889dd0 12.5%, #afb6a9 25%, #d5ce82 37.5%, #fce75b 50%,
    #d5ce82 62.5%, #afb6a9 75%, #889dd0 87.5%, #6284f7 100%
  );
  background-size: 200% 100%;
  animation: studio-glow-flow 12s linear infinite;
}
@keyframes studio-glow-flow {
  from { background-position: 0% 50%; }
  to   { background-position: 200% 50%; }
}

/* ---- Landing → workspace transition ---- */

/* Whole landing layer fades away, revealing the workspace beneath */
.landing-leave {
  animation: studio-landing-out 420ms ease both;
}
@keyframes studio-landing-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

/* Workspace panels fade in, per-panel delay via --wd.
   Opacity only — a transform here would shift the docked input's measured
   rect and make the morph ghost land offset from its final position. */
.ws-stagger {
  animation: studio-ws-in 480ms ease both;
  animation-delay: var(--wd, 0ms);
}
@keyframes studio-ws-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Chat messages pop in after the input has docked */
.ws-msg {
  animation: studio-msg-in 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--wd, 0ms);
}
@keyframes studio-msg-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Thinking row fades away when the build completes */
.thinking-fade-leave-active {
  transition: opacity 220ms ease;
}
.thinking-fade-leave-to {
  opacity: 0;
}

/* Loader hands off to the built app */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 260ms ease;
}
.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

/* Attachment thumbnails: dark overlay + remove appears on hover
   (Figma: 2001:3527 — rgba(0,0,0,0.3) over the image) */
.att-remove {
  opacity: 0;
  background: rgba(0, 0, 0, 0.3);
  transition: opacity 150ms ease;
}
.att-thumb:hover .att-remove,
.att-remove:focus-visible {
  opacity: 1;
}

/* Publish button loading spinner */
.publish-spinner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  animation: publish-spin 700ms linear infinite;
}
@keyframes publish-spin {
  to { transform: rotate(360deg); }
}

/* Snackbar motion — same as CardsPage */
.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

/* "Last published" label eases in next to the Publish button */
.published-fade-enter-active {
  transition: opacity 260ms ease-out, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}
.published-fade-enter-from {
  opacity: 0;
  transform: translateX(6px);
}

/* Exit-fullscreen FAB: a 44px circle that expands into an "Edit" pill on
   hover (Figma: 2008:14017 — px-14, 16px label, tighter shadow) */
.fab-edit {
  width: 44px;
  padding-left: 12px;
  box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);
  transition: width 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease;
}
.fab-edit:hover {
  width: 84px;
  box-shadow: 0px 3px 11px 0px rgba(38,42,50,0.09);
}
.fab-label {
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 160ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.fab-edit:hover .fab-label {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 40ms;
}

/* Exit-fullscreen pencil FAB pops in and out */
.fab-pop-enter-active {
  transition: opacity 200ms ease-out, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fab-pop-leave-active {
  transition: opacity 130ms ease, transform 130ms ease;
}
.fab-pop-enter-from,
.fab-pop-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

/* The usage meter fill grows in once when the workspace head appears */
.usage-fill {
  animation: usage-grow 700ms cubic-bezier(0.16, 1, 0.3, 1) 500ms both;
}
@keyframes usage-grow {
  from { width: 0; }
  to   { width: 26px; }
}

/* Built-app sections rise in with a stagger, per-section delay via --ad */
.app-in {
  animation: studio-msg-in 460ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--ad, 0ms);
}

/* The morphing input card */
.ghost-anim {
  transition:
    top 520ms cubic-bezier(0.22, 1, 0.36, 1),
    left 520ms cubic-bezier(0.22, 1, 0.36, 1),
    width 520ms cubic-bezier(0.22, 1, 0.36, 1),
    height 520ms cubic-bezier(0.22, 1, 0.36, 1),
    border-width 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* The thinking icon: the center star spins clockwise; the outer "Vector"
   ring spins the other way while breathing down in scale. Rotation and
   scale live on nested groups so each keeps its own easing. */
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

/* ---- Stacking cube loader (Figma: 42:3616) ----
   The bulk 3dcube's three parts stack into place one after another
   (left face, right face, then the lid drops in), hold, scatter, repeat. */
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

/* Respect reduced-motion preferences: show the final state, skip the loops */
@media (prefers-reduced-motion: reduce) {
  .stagger, .studio-bg, .landing-leave, .ws-stagger, .ws-msg, .app-in, .usage-fill { animation-duration: 1ms; }
  .bg-blob-1, .bg-blob-2, .input-glow, .think-star, .think-ring, .think-ring-scale,
  .cube-loader .cube-lid, .cube-loader .cube-left, .cube-loader .cube-right { animation: none; }
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
}
</style>
