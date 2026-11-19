<template>
  <div class="bg-white flex flex-col items-center h-full w-full overflow-y-auto overflow-x-hidden">

    <!-- Inner -->
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="flex gap-[32px] items-center px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-1 flex-col gap-[8px] items-start justify-center min-w-px">
          <div class="flex gap-[8px] items-center shrink-0">
            <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Bill Pay</p>
          </div>
          <!-- Mail forwarder (hover: copy tooltip + Settings link, click to copy) -->
          <div v-if="!isEmpty" class="group flex gap-[4px] items-center shrink-0">
            <div
              ref="emailChipEl"
              class="flex gap-[4px] items-center cursor-pointer"
              @mouseenter="emailTooltipVisible = true"
              @mouseleave="onEmailChipLeave"
              @click="copyForwardingEmail"
            >
              <img :src="mailForwardIcon" width="16" height="16" alt="" class="shrink-0" />
              <span class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">{{ forwardingEmail }}</span>
            </div>
            <a
              href="#"
              class="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 text-[12px] font-normal text-[#2465de] leading-[1.5] underline whitespace-nowrap"
              @click.prevent="$router.push({ path: '/settings', query: { section: 'bill-inbox' } })"
            >Settings</a>
          </div>
        </div>

        <!-- Header actions (list state only) -->
        <div v-if="!isEmpty" class="flex gap-[8px] items-center self-stretch shrink-0">
          <button
            type="button"
            class="flex items-center justify-center h-[36px] px-[12px] py-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          >
            <span class="font-medium text-[14px] text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Export Transaction</span>
          </button>
          <button
            type="button"
            class="relative flex items-center justify-center h-[36px] min-w-[36px] overflow-hidden px-[12px] py-[8px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-110 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="$router.push('/bills/new')"
          >
            <span class="font-medium text-[14px] text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Upload Bill</span>
          </button>
        </div>
      </div>

      <!-- Row "More" dropdown (same pattern as the Cards ⋯ menu), anchored below-right of the ⋮ button -->
      <Teleport to="body">
        <div v-if="rowMenu" class="fixed inset-0 z-40" @click="rowMenu = null" />
        <Transition name="row-menu">
          <div
            v-if="rowMenu"
            role="menu"
            class="fixed z-50 rounded-[8px] bg-white overflow-hidden"
            style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
            :style="{ left: rowMenu.left + 'px', top: rowMenu.top + 'px', width: rowMenu.width + 'px' }"
            @keydown.esc="rowMenu = null"
          >
            <template v-for="(group, gi) in rowMenu.groups" :key="gi">
              <div v-if="gi > 0" class="h-px w-full bg-[#e5e6ea]" />
              <div class="flex flex-col p-[4px] w-full">
                <!-- Dropdown Title (Figma: Dropdown Menu/Default/Dropdown Title) -->
                <p v-if="gi === 0 && rowMenu.title" class="px-[8px] py-[4px] text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#61667c] whitespace-nowrap">{{ rowMenu.title }}</p>
                <button
                  v-for="item in group"
                  :key="item.label"
                  type="button"
                  role="menuitem"
                  class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left transition-colors duration-100"
                  :class="item.danger ? 'hover:bg-[#fdf2f3]' : 'hover:bg-[#f5f6f9]'"
                  @click="onMenuItem(item)"
                >
                  <img v-if="item.icon" :src="item.icon" width="16" height="16" alt="" class="shrink-0" />
                  <span class="flex-1 min-w-px text-[12px] font-normal leading-[1.5]" :class="item.danger ? 'text-[#dc3545]' : 'text-[#03102f]'">
                    {{ item.label }}
                    <span v-if="item.sub" class="block text-[#61667c]">{{ item.sub }}</span>
                  </span>
                </button>
              </div>
            </template>
          </div>
        </Transition>
      </Teleport>

      <!-- Row-action tooltip — Tooltip/Dark (teleported above the hovered button, arrow points down) -->
      <Teleport to="body">
        <!-- Anchoring uses the CSS `translate` property so the motion's `transform` slide composes with it -->
        <Transition name="action-tooltip">
          <div
            v-if="actionTip"
            :key="actionTip.id"
            class="fixed z-50 pointer-events-none"
            :style="{ left: actionTip.left + 'px', top: actionTip.top + 'px', translate: '-50% -100%' }"
          >
            <div
              class="relative flex items-center justify-center px-[8px] py-[4px] rounded-[4px] bg-[#343848]"
              style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
            >
              <img :src="tooltipArrowDarkIcon" width="12" height="7.33333" alt="" class="absolute left-1/2 -translate-x-1/2 bottom-[-7px] rotate-180" />
              <p class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5] whitespace-nowrap text-center">{{ actionTip.label }}</p>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Copy tooltip (teleported: anchored above the mail forwarder) -->
      <Teleport to="body">
        <Transition name="email-tooltip">
          <div
            v-if="emailTooltipVisible"
            class="fixed z-50 pointer-events-none"
            :style="{ left: emailTooltipPos.left + 'px', top: emailTooltipPos.top + 'px' }"
          >
            <div class="relative -translate-x-1/2 -translate-y-full">
              <div
                class="flex items-center justify-center px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd]"
                style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
              >
                <p class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap text-center">{{ emailCopied ? 'Copied!' : 'Copy your bill forwarding email' }}</p>
              </div>
              <span class="email-tooltip__arrow" />
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Content -->
      <Transition name="bills-fade" mode="out-in">
      <div v-if="isEmpty" key="empty" class="bg-white flex flex-1 flex-col gap-[40px] items-center justify-center min-h-[655px] px-[24px] py-[12px] w-full">

        <!-- Paper card -->
        <div
          class="bg-white border border-[#e5e6ea] flex flex-col items-center justify-end p-[32px] rounded-[12px] shrink-0 w-full max-w-[900px]"
          style="filter: drop-shadow(0px 16px 16px rgba(0,0,0,0.05));"
        >
          <div class="flex gap-[24px] items-center justify-center w-full shrink-0">

            <!-- Left: copy + CTA -->
            <div class="flex flex-1 flex-col gap-[24px] items-start justify-center min-w-px">
              <div class="flex flex-col gap-[8px] items-start w-full shrink-0">
                <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] w-full">Pay and manage suppliers bills in one place</p>
                <p class="font-normal text-[16px] text-[#61667c] leading-[1.4] w-full">You can pay your vendors and suppliers directly from HitPay using the HitPay balance</p>
              </div>

              <div class="flex items-start justify-center pt-[12px] shrink-0">
                <a
                  href="#"
                  class="relative flex gap-[8px] h-[36px] items-center justify-center min-w-[36px] overflow-hidden px-[12px] py-[8px] rounded-[8px] border border-[#2465de] cursor-pointer shrink-0"
                  style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                  @click.prevent="$router.push('/bills/new')"
                >
                  <div class="flex gap-[8px] items-center shrink-0">
                    <p
                      class="font-medium text-[14px] text-white leading-[1.5] whitespace-nowrap"
                      style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);"
                    >Add your first bill</p>
                  </div>
                  <!-- Keyboard shortcut caps (clipped by the button's overflow) -->
                  <div
                    class="absolute flex gap-[2px] h-[28px] items-center justify-center px-[6px] py-[8px] right-[-54px] top-[-1px] border-l border-[#2465de]"
                    style="background: rgba(255,255,255,0.05);"
                  >
                    <div
                      class="flex flex-col items-center justify-center p-[8px] rounded-[6px] shrink-0 size-[20px] border border-[rgba(242,242,244,0.15)]"
                      style="background: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(250,250,250,0.15));"
                    >
                      <p class="font-medium text-[12px] text-white leading-[1.5] whitespace-nowrap">⌘</p>
                    </div>
                    <div
                      class="flex flex-col items-center justify-center p-[8px] rounded-[6px] shrink-0 size-[20px] border border-[rgba(242,242,244,0.15)]"
                      style="background: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(250,250,250,0.15));"
                    >
                      <p class="font-medium text-[12px] text-white leading-[1.5] whitespace-nowrap">W</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <!-- Right: wiring illustration -->
            <div class="relative h-[184px] w-[410.933px] overflow-hidden shrink-0">

              <!-- Green/blue glow behind the Paid card -->
              <div
                class="absolute blur-[19.55px] h-[67.467px] left-[289.42px] top-[48.68px] w-[78.583px]"
                :style="{ backgroundImage: glowBg }"
              />

              <!-- Full DASHED document (un-scanned state — sits beneath the solid reveal) -->
              <div class="absolute left-[123.25px] top-[15.33px] w-[124px] h-[152.567px] overflow-hidden rounded-[7.667px] border-[0.767px] border-dashed border-[#9295a5]">
                <div class="absolute left-[8.66px] top-[8.6px] size-[23.476px] rounded-full border-[0.767px] border-dashed border-[#9295a5]" />
                <div class="absolute flex flex-col gap-[2.348px] items-start left-[80.17px] top-[13.29px]">
                  <div class="border-[0.767px] border-dashed border-[#9295a5] h-[3.521px] rounded-[9.39px] shrink-0 w-[21.129px]" />
                  <div class="border-[0.767px] border-dashed border-[#9295a5] h-[3.521px] rounded-[9.39px] shrink-0 w-[25.824px]" />
                  <div class="border-[0.767px] border-dashed border-[#9295a5] h-[3.521px] rounded-[9.39px] shrink-0 w-[34.04px]" />
                </div>
                <div class="absolute flex items-center justify-center left-[80.17px] top-[133.02px]">
                  <div class="-scale-y-100 rotate-180">
                    <div class="flex flex-col gap-[2.348px] items-start">
                      <div class="border-[0.767px] border-dashed border-[#9295a5] h-[3.521px] rounded-[9.39px] w-[34.04px]" />
                      <div class="border-[0.767px] border-dashed border-[#9295a5] h-[3.521px] rounded-[9.39px] w-[34.04px]" />
                    </div>
                  </div>
                </div>
                <div class="absolute flex gap-[9.39px] items-start left-[9.83px] top-[40.29px] w-[100.948px]">
                  <div class="border-[0.767px] border-dashed border-[#9295a5] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                  <div class="border-[0.767px] border-dashed border-[#9295a5] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                  <div class="border-[0.767px] border-dashed border-[#9295a5] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                </div>
                <div class="absolute border-[0.767px] border-dashed border-[#9295a5] h-[64.56px] left-[8.66px] overflow-hidden rounded-[4.695px] top-[50.85px] w-[104.469px]">
                  <div
                    v-for="row in solidTableRows"
                    :key="'fd' + row.top"
                    class="absolute -translate-x-1/2 flex gap-[4.695px] items-start left-1/2 w-[95.079px]"
                    :style="{ top: row.top }"
                  >
                    <div class="border-[0.767px] border-dashed border-[#9295a5] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                    <div class="border-[0.767px] border-dashed border-[#9295a5] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                    <div class="border-[0.767px] border-dashed border-[#9295a5] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                  </div>
                </div>
              </div>

              <!-- Full SOLID document (revealed left→right behind the scanner line) -->
              <div
                class="doc-reveal z-10 absolute bg-white border-[0.767px] border-[#e5e6ea] h-[152.567px] left-[123.25px] overflow-hidden rounded-[7.667px] top-[15.33px] w-[124px]"
                style="box-shadow: 0px 0.767px 1.533px 0px rgba(0,0,0,0.05), 0px 3.521px 25.824px 0px rgba(38,42,50,0.03);"
              >
                <div class="absolute left-[8.66px] size-[23.476px] top-[8.6px]">
                  <img alt="" class="absolute block inset-0 max-w-none size-full" :src="ellipse37" />
                </div>
                <div class="absolute flex flex-col gap-[2.348px] items-start left-[80.17px] top-[13.29px]">
                  <div class="bg-[#e4e9f1] h-[3.521px] rounded-[9.39px] shrink-0 w-[21.129px]" />
                  <div class="bg-[#e4e9f1] h-[3.521px] rounded-[9.39px] shrink-0 w-[25.824px]" />
                  <div class="bg-[#e4e9f1] h-[3.521px] rounded-[9.39px] shrink-0 w-[34.04px]" />
                </div>
                <div class="absolute flex items-center justify-center left-[80.17px] top-[133.02px]">
                  <div class="-scale-y-100 rotate-180">
                    <div class="flex flex-col gap-[2.348px] items-start">
                      <div class="bg-[#e4e9f1] h-[3.521px] rounded-[9.39px] shrink-0 w-[34.04px]" />
                      <div class="bg-[#e4e9f1] h-[3.521px] rounded-[9.39px] shrink-0 w-[34.04px]" />
                    </div>
                  </div>
                </div>
                <div class="absolute flex gap-[9.39px] items-start left-[9.83px] top-[40.29px] w-[100.948px]">
                  <div class="bg-[#e4e9f1] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                  <div class="bg-[#e4e9f1] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                  <div class="bg-[#e4e9f1] flex-1 h-[3.521px] min-w-px rounded-[9.39px]" />
                </div>
                <div class="absolute border-[0.587px] border-[#e4e9f1] h-[64.56px] left-[8.66px] overflow-hidden rounded-[4.695px] top-[50.85px] w-[104.469px]">
                  <div
                    v-for="row in solidTableRows"
                    :key="'st' + row.top"
                    class="absolute -translate-x-1/2 flex gap-[4.695px] items-start left-1/2 w-[95.079px]"
                    :style="{ top: row.top }"
                  >
                    <div class="flex-1 h-[3.521px] min-w-px rounded-[9.39px]" :class="row.head ? 'bg-[#a6b3cd]' : 'bg-[#e4e9f1]'" />
                    <div class="flex-1 h-[3.521px] min-w-px rounded-[9.39px]" :class="row.head ? 'bg-[#a6b3cd]' : 'bg-[#e4e9f1]'" />
                    <div class="flex-1 h-[3.521px] min-w-px rounded-[9.39px]" :class="row.head ? 'bg-[#a6b3cd]' : 'bg-[#e4e9f1]'" />
                  </div>
                </div>
              </div>

              <!-- File: PDF -->
              <div class="absolute contents">
                <div
                  class="absolute bg-white border-[0.767px] border-[#e5e6ea] h-[46.767px] left-[39.1px] rounded-[4.6px] top-[13.61px] w-[36.8px]"
                  style="box-shadow: 0px 0.767px 1.533px 0px rgba(0,0,0,0.05), 0px 3.067px 9.2px 0px rgba(38,42,50,0.08);"
                />
                <div class="absolute bg-[#e4e9f1] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[20.95px] w-[17.348px]" />
                <div class="absolute bg-[#585a5d] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[40.72px] w-[10.448px]" />
                <div class="absolute bg-[#e4e9f1] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[27.54px] w-[24.823px]" />
                <div class="absolute bg-[#e4e9f1] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[34.13px] w-[20.99px]" />
                <div
                  class="absolute flex items-center justify-center left-[60.57px] pb-[3.833px] pt-[3.067px] px-[4.6px] rounded-[4.6px] top-[38.52px] border-[0.767px] border-[#bc1818]"
                  style="background: linear-gradient(to bottom, #fc4848, #ea2f2f); filter: drop-shadow(0px 4.6px 5.367px rgba(82,14,14,0.26));"
                >
                  <p class="font-semibold text-[8.433px] text-white leading-none tracking-[-0.1687px] whitespace-nowrap" style="text-shadow: 0px 0.767px 0.767px rgba(0,0,0,0.2);">PDF</p>
                </div>
              </div>

              <!-- File: JPG -->
              <div class="absolute contents">
                <div
                  class="absolute bg-white border-[0.767px] border-[#e5e6ea] h-[46.767px] left-[39.1px] rounded-[4.6px] top-[68.81px] w-[36.8px]"
                  style="box-shadow: 0px 0.767px 1.533px 0px rgba(0,0,0,0.05), 0px 3.067px 9.2px 0px rgba(38,42,50,0.08);"
                />
                <div class="absolute -translate-y-1/2 left-[48.3px] size-[18.4px] top-[calc(50%-0.58px)]">
                  <img alt="" class="absolute block inset-0 max-w-none size-full" :src="image" />
                </div>
                <div
                  class="absolute flex items-center justify-center left-[60.57px] pb-[3.833px] pt-[3.067px] px-[4.6px] rounded-[4.6px] top-[93.72px] border-[0.767px] border-[#494949]"
                  style="background: linear-gradient(to bottom, #5b5c5d, #4b4747); filter: drop-shadow(0px 4.6px 5.367px rgba(0,0,0,0.26));"
                >
                  <p class="font-semibold text-[8.433px] text-white leading-none tracking-[-0.1687px] whitespace-nowrap" style="text-shadow: 0px 0.767px 0.767px rgba(0,0,0,0.2);">JPG</p>
                </div>
              </div>

              <!-- File: DOC -->
              <div class="absolute contents">
                <div
                  class="absolute bg-white border-[0.767px] border-[#e5e6ea] h-[46.767px] left-[39.1px] rounded-[4.6px] top-[124.01px] w-[36.8px]"
                  style="box-shadow: 0px 0.767px 1.533px 0px rgba(0,0,0,0.05), 0px 3.067px 9.2px 0px rgba(38,42,50,0.08);"
                />
                <div class="absolute bg-[#e4e9f1] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[131.35px] w-[17.348px]" />
                <div class="absolute bg-[#585a5d] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[151.12px] w-[10.448px]" />
                <div class="absolute bg-[#e4e9f1] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[137.94px] w-[24.823px]" />
                <div class="absolute bg-[#e4e9f1] h-[1.986px] left-[43.22px] rounded-[9.39px] top-[144.53px] w-[20.99px]" />
                <div
                  class="absolute flex items-center justify-center left-[60.57px] pb-[3.833px] pt-[3.067px] px-[4.6px] rounded-[4.6px] top-[148.93px] border-[0.767px] border-[#1758b2]"
                  style="background: linear-gradient(to bottom, #1a85e9, #1b72eb); filter: drop-shadow(0px 4.6px 5.367px rgba(5,32,76,0.26));"
                >
                  <p class="font-semibold text-[8.433px] text-white leading-none tracking-[-0.1687px] whitespace-nowrap" style="text-shadow: 0px 0.767px 0.767px rgba(0,0,0,0.2);">DOC</p>
                </div>
              </div>

              <!-- Scanner line + trailing glow. The container's left edge is the line;
                   translateX sweeps it 0→124px across the document. The glow flips sides
                   at each end so it always trails BEHIND the direction of travel. -->
              <div class="scan-beam z-20 absolute h-[161.383px] left-[123.25px] top-[11.5px] w-0">
                <div
                  class="scan-trail absolute top-0 right-0 h-full w-[106.367px]"
                  style="transform-origin: right center; background: linear-gradient(to left, rgba(100,141,246,0.25), rgba(255,255,255,0));"
                />
                <div class="absolute top-0 left-[-0.77px] h-full w-[1.533px] bg-[#406fee]" />
              </div>

              <!-- Paid card -->
              <div
                class="absolute h-[65.933px] left-[289.03px] overflow-hidden rounded-[10px] top-[49.07px] w-[78.967px]"
                style="background: linear-gradient(to bottom, #393a40, #111318); box-shadow: 0px 0.767px 1.533px 0px rgba(0,0,0,0.52), 0px 5.367px 16.867px 0px rgba(0,0,0,0.25);"
              >
                <p class="absolute font-medium text-[7.667px] text-white leading-none left-[calc(50%-20.7px)] top-[49.51px] tracking-[-0.1533px] whitespace-nowrap">Vendor LLC</p>
                <div class="absolute flex flex-col gap-[6.133px] items-center font-medium leading-none left-[18.78px] top-[9.97px] w-[41.4px]">
                  <p class="text-[#acf7ad] text-[6.133px] text-center tracking-[-0.1227px] w-full">You paid</p>
                  <p class="text-[10.733px] text-white tracking-[-0.2147px] w-full" style="font-family: 'Reddit Mono', ui-monospace, monospace; text-shadow: 0px 0.767px 0.767px rgba(0,0,0,0.4);">$ 1,200</p>
                </div>
                <div class="absolute h-[0.767px] left-0 top-[41.4px] w-[78.967px]">
                  <img alt="" class="block max-w-none size-full" :src="line15" />
                </div>
              </div>

              <!-- Connector lines (with traveling "data" dots flowing toward the scanner) -->
              <div class="absolute h-[0.767px] left-[75.8px] top-[91.19px] w-[47.35px]">
                <img alt="" class="absolute block inset-0 max-w-none size-full" :src="vector47a" />
                <span class="flow-dot" style="offset-path: path('M0 0.383 H47.35'); animation-delay: 0.45s;" />
              </div>
              <div class="absolute h-[0.711px] left-[245.15px] top-[84.36px] w-[43.883px]">
                <img alt="" class="absolute block inset-0 max-w-none size-full" :src="vector47b" />
                <span class="flow-dot flow-dot--paid" style="offset-path: path('M0 0.355 H43.883');" />
              </div>
              <div class="absolute h-[56.542px] left-[76.09px] top-[35.08px] w-[46.958px]">
                <img alt="" class="block max-w-none size-full" :src="vector48" />
                <span class="flow-dot" style="offset-path: path('M0 0.383333H16.2917C20.5258 0.383333 23.9583 3.81582 23.9583 8.05V49.2583C23.9583 53.4925 27.3908 56.925 31.625 56.925H46.9583');" />
              </div>
              <div class="absolute flex h-[54.433px] items-center justify-center left-[76.09px] top-[91.62px] w-[46.958px]">
                <div class="-scale-y-100 rotate-180">
                  <div class="relative h-[54.433px] w-[46.958px]">
                    <img alt="" class="block max-w-none size-full" :src="vector49" />
                    <span class="flow-dot" style="offset-path: path('M0 0.383333H16.2917C20.5258 0.383333 23.9583 3.81582 23.9583 8.05V47.15C23.9583 51.3842 27.3908 54.8167 31.625 54.8167H46.9583'); animation-delay: 0.9s;" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- How it works -->
        <div class="flex flex-col gap-[16px] items-center pb-[24px] shrink-0 w-full max-w-[1084px]">
          <div class="flex items-center justify-center px-[32px] w-full shrink-0">
            <p class="flex-1 font-medium text-[16px] text-[#03102f] text-center leading-[1.4] min-w-px">How it works</p>
          </div>
          <div class="flex h-[158px] items-start w-full max-w-[960px] px-[2px] rounded-[8px] border border-[#e5e6ea] shrink-0">
            <div
              v-for="(step, i) in steps"
              :key="step.title"
              class="flex flex-1 h-full items-start min-w-px overflow-hidden pt-[32px] pb-[8px] px-[32px]"
              :class="i < steps.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
            >
              <div class="flex flex-1 flex-col gap-[12px] items-start min-w-px">
                <div class="bg-[#f5f6f9] flex flex-col items-center justify-center p-[8px] rounded-[8px] shrink-0 size-[38px]">
                  <p class="font-medium text-[16px] text-[#03102f] text-center leading-[1.4] w-full">{{ i + 1 }}</p>
                </div>
                <div class="flex flex-col gap-[2px] items-start w-full shrink-0">
                  <p class="font-medium text-[14px] text-[#000501] leading-[1.5]">{{ step.title }}</p>
                  <p class="font-normal text-[12px] text-[#61667c] opacity-75 leading-[1.5] w-full">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Non-empty state: overview + bills table (Figma 13:7237) -->
      <div v-else key="filled" class="flex flex-1 flex-col items-start w-full px-[24px] pt-[12px] pb-[12px]">

        <!-- Overview cards -->
        <div class="flex gap-[16px] items-start shrink-0">
          <div
            v-for="card in overviewCards"
            :key="card.label"
            class="bg-white border border-[#e5e6ea] rounded-[8px] flex flex-col gap-px shrink-0"
          >
            <div class="flex gap-[8px] items-center min-w-[250px] pl-[12px] pr-[16px] py-[8px] border-b border-[#e5e6ea]">
              <img :src="card.icon" width="18" height="18" alt="" class="shrink-0" />
              <p class="flex-1 min-w-px text-[12px] font-normal text-[#03102f] leading-[1.5]">{{ card.label }}</p>
            </div>
            <div class="flex items-center px-[16px] py-[12px] w-full">
              <p class="flex-1 min-w-px text-[18px] font-medium text-[#03102f] leading-[1.35] truncate" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ card.value }}</p>
            </div>
          </div>
        </div>

        <!-- Table card -->
        <div class="mt-[24px] w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: segmented filter + actions -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] px-[12px] border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px]">
              <button
                v-for="t in tabs"
                :key="t"
                type="button"
                class="min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeTab === t ? 'bg-[#e5e6ea] text-[#03102f] font-medium' : 'text-[#61667c] font-normal hover:bg-[#f2f2f4]'"
                @click="activeTab = t"
              >{{ t }}</button>
            </div>
            <div class="flex items-center gap-[8px] shrink-0">
              <button type="button" class="tool-btn" aria-label="Search">
                <img :src="searchIcon" width="16" height="16" alt="" />
              </button>
              <button type="button" class="tool-btn" aria-label="Filter">
                <img :src="filterIcon" width="16" height="16" alt="" />
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[1000px] table-fixed">
              <colgroup>
                <col style="width: 21%" />
                <col style="width: 21%" />
                <col style="width: 21%" />
                <col style="width: 14%" />
                <col style="width: 17%" />
                <col style="width: 76px" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="col in columns"
                    :key="col.key"
                    class="bg-[#fcfcfd] border-b border-[#e5e6ea] px-[12px] py-[8px] text-left align-middle"
                    :class="col.key !== 'status' ? 'border-r' : ''"
                  >
                    <div class="flex items-center gap-[8px]">
                      <span class="flex-1 text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f] whitespace-nowrap">{{ col.label }}</span>
                      <img v-if="col.sortable" :src="arrowDownIcon" width="14" height="14" alt="" class="shrink-0" />
                    </div>
                  </th>
                  <th class="bg-[#fcfcfd] border-b-[0.5px] border-[#cbcdd4]" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="b in filteredBills"
                  :key="b.id"
                  class="bill-row cursor-pointer [&:last-child>td]:border-b-0"
                  @click="viewBill(b)"
                >
                  <td class="cell border-r">{{ b.recipient }}</td>
                  <td class="cell border-r">{{ b.invoice }}</td>
                  <td class="cell border-r font-semibold" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ b.amount }}</td>
                  <td class="cell border-r" style="font-family: 'Reddit Mono', ui-monospace, monospace;">
                    <div class="flex items-center gap-[4px]">
                      <span class="flex-1 min-w-px truncate leading-[1.4]" :class="b.status === 'Overdue' ? 'text-[#bd8400]' : 'text-[#03102f]'">{{ formatDue(b.due) }}</span>
                      <img v-if="b.status === 'Overdue'" :src="alertIcon" width="14" height="14" alt="Overdue" class="shrink-0" />
                    </div>
                  </td>
                  <td class="cell">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: chipStyle(b.status).bg, color: chipStyle(b.status).text }"
                    >{{ chipLabel(b.status) }}</span>
                  </td>
                  <td class="h-[44px] px-[4px] py-[8px] border-b border-[#e5e6ea] align-middle">
                    <div class="flex items-center justify-end gap-[4px]">
                      <button
                        v-for="a in rowActions(b.status)"
                        :key="a.key"
                        type="button"
                        class="act-btn"
                        :class="{ 'act-btn--open': isMenuOpen(b, a) }"
                        :style="{ borderColor: a.border }"
                        :aria-label="a.label"
                        :aria-haspopup="menuFor(a, b) ? 'menu' : undefined"
                        :aria-expanded="menuFor(a, b) ? isMenuOpen(b, a) : undefined"
                        @mouseenter="!isMenuOpen(b, a) && showActionTip($event, a.label)"
                        @mouseleave="actionTip = null"
                        @click.stop="onRowAction($event, a, b)"
                      >
                        <img :src="a.icon" width="16" height="16" alt="" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="relative flex items-center justify-center w-full h-[36px] mt-[24px] px-[12px] shrink-0">
          <div class="flex items-start gap-[20px]">
            <button type="button" class="flex items-center gap-[2px] h-[36px] px-[2px] rounded-[4px] text-[13px] leading-[1.5] text-[#61667c] hover:text-[#03102f] transition-colors duration-150" @click="page = Math.max(1, page - 1)">
              <img :src="chevronLeftIcon" width="14" height="14" alt="" />
              Prev
            </button>
            <button type="button" class="flex items-center gap-[2px] h-[36px] px-[2px] rounded-[4px] text-[13px] leading-[1.5] text-[#61667c] hover:text-[#03102f] transition-colors duration-150" @click="page = page + 1">
              Next
              <img :src="chevronRightIcon" width="14" height="14" alt="" />
            </button>
          </div>
          <div class="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-[8px] h-[36px] w-[167px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white cursor-pointer">
            <div class="flex flex-1 min-w-px items-center gap-[4px] text-[14px] leading-[20px] whitespace-nowrap">
              <span class="text-[#9295a5] tracking-[0.15px]">Item per page:</span>
              <span class="flex-1 min-w-px font-medium text-[#03102f] tracking-[0.1px]">{{ perPage }}</span>
            </div>
            <img :src="chevronDownIcon" width="18" height="18" alt="" class="shrink-0" />
          </div>
        </div>
      </div>
      </Transition>
    </div>

    <!-- Floating preview switcher: empty state ↔ bills list -->
    <div
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-[4px] p-[4px] rounded-full bg-white border border-[#e5e6ea]"
      style="box-shadow: 0px 8px 24px rgba(3,16,47,0.16);"
    >
      <span class="px-[8px] text-[11px] font-medium text-[#8093b8] select-none">Preview</span>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="isEmpty ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="isEmpty = true"
      >Empty state</button>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="!isEmpty ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="isEmpty = false"
      >With bills</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { bills } from '../../composables/useBills.js'
import mailForwardIcon from '../../assets/icons/bills-list/mail-forward.svg'
import dotPaidIcon from '../../assets/icons/bills-list/dot-paid.svg'
import dotNeedApprovalIcon from '../../assets/icons/bills-list/dot-need-approval.svg' // Purple/500 #b14aed
import searchIcon from '../../assets/icons/bills-list/search.svg'
import filterIcon from '../../assets/icons/bills-list/filter.svg'
import arrowDownIcon from '../../assets/icons/bills-list/arrow-down.svg'
import alertIcon from '../../assets/icons/bills-list/alert.svg'
import pencilIcon from '../../assets/icons/bills-list/pencil.svg'
import checkIcon from '../../assets/icons/bills-list/check.svg'
import telegramIcon from '../../assets/icons/bills-list/telegram.svg'
import downloadIcon from '../../assets/icons/bills-list/download.svg'
import tooltipArrowDarkIcon from '../../assets/icons/bills-list/tooltip-arrow-dark.svg'
import dotsIcon from '../../assets/icons/bills-list/dots-vertical.svg'
import documentIcon from '../../assets/icons/icon-document.svg'
import menuPencilIcon from '../../assets/icons/icon-pencil.svg'
import calendarIcon from '../../assets/icons/icon-calendar.svg'
import menuDownloadIcon from '../../assets/icons/icon-download.svg'
import xRedIcon from '../../assets/icons/icon-x-red.svg'
import chevronLeftIcon from '../../assets/icons/bills-list/chevron-left.svg'
import chevronRightIcon from '../../assets/icons/bills-list/chevron-right.svg'
import chevronDownIcon from '../../assets/icons/bills-list/chevron-down.svg'
import ellipse37 from '../../assets/images/billpay/ellipse37.svg'
import ellipse38 from '../../assets/images/billpay/ellipse38.png'
import image from '../../assets/images/billpay/image.svg'
import line15 from '../../assets/images/billpay/line15.svg'
import vector47a from '../../assets/images/billpay/vector47a.svg'
import vector47b from '../../assets/images/billpay/vector47b.svg'
import vector48 from '../../assets/images/billpay/vector48.svg'
import vector49 from '../../assets/images/billpay/vector49.svg'

// Radial green→blue glow behind the Paid card (kept verbatim from the design)
const glowBg = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 78.583 67.467' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-7.65 4.4916e-14 -1.9105e-8 -16.941 77.55 33.733)'><stop stop-color='rgba(166,251,117,1)' offset='0'/><stop stop-color='rgba(149,220,149,1)' offset='0.25'/><stop stop-color='rgba(132,189,181,1)' offset='0.5'/><stop stop-color='rgba(116,159,213,1)' offset='0.75'/><stop stop-color='rgba(99,128,245,1)' offset='1'/></radialGradient></defs></svg>")`

// Mini-table rows inside the solid invoice icon; first row uses the darker header color
const solidTableRows = [
  { top: '4.11px', head: true },
  { top: '17.02px', head: false },
  { top: '28.76px', head: false },
  { top: '40.5px', head: false },
  { top: '52.23px', head: false },
]

const steps = [
  { title: 'Upload invoice', desc: 'Upload a file or enter detail manually' },
  { title: 'Review and approve', desc: 'Route bill for approve if required' },
  { title: 'Pay or schedule', desc: 'Pay instantly or set future date' },
]

// Preview switcher: true = empty/onboarding state, false = bills list (default)
const isEmpty = ref(false)

// Overview cards (mock totals from the design)
const overviewCards = [
  { label: 'Paid bills', value: 'SGD 11,170.00', icon: dotPaidIcon },
  { label: 'Need approval', value: 'SGD 1,870.00', icon: dotNeedApprovalIcon },
]

// Filter tabs
const tabs = ['All', 'Draft', 'Need approval', 'Scheduled', 'Completed']
const activeTab = ref('All')

// Table columns (first four are sortable); a trailing actions column is rendered separately
const columns = [
  { key: 'recipient', label: 'Recepient', sortable: true },
  { key: 'invoice', label: '# Invoice', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'due', label: 'Due date', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
]

// Status chips (design tokens). Pending + Overdue bills are shown as "Need approval"
// (Overdue keeps the amber due date + warning icon).
const chipColors = {
  Pending: { bg: '#fff9ec', text: '#bd8400' },
  Scheduled: { bg: '#fff9ec', text: '#bd8400' },
  Failed: { bg: '#f9e9e9', text: '#c20a1c' },
  Rejected: { bg: '#f9e9e9', text: '#c20a1c' },
  Cancel: { bg: '#f9e9e9', text: '#c20a1c' },
  'Need approval': { bg: '#f7edfd', text: '#7d1ab7' },
  Draft: { bg: '#f2f2f4', text: '#484d61' },
  Processing: { bg: '#e5eeff', text: '#2465de' },
  Completed: { bg: '#e6f9f0', text: '#238b5b' },
}
const AWAITING_APPROVAL = ['Pending', 'Overdue', 'Need approval']
const chipLabel = (status) => (AWAITING_APPROVAL.includes(status) ? 'Need approval' : status)
const chipStyle = (status) => chipColors[chipLabel(status)] || chipColors.Draft

// "2025-08-15" → "Aug 15"
function formatDue(due) {
  const d = new Date(due + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return due
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
}

// Row quick actions per status
const BORDER = { grey: '#cbcdd4', blue: '#2465de' }
const ACT = {
  edit: { key: 'edit', label: 'Edit', icon: pencilIcon, border: BORDER.grey },
  more: { key: 'more', label: 'More', icon: dotsIcon, border: BORDER.grey },
  approve: { key: 'approve', label: 'Approve', icon: checkIcon, border: BORDER.blue },
  send: { key: 'send', label: 'Send Payment Confirmation', icon: telegramIcon, border: BORDER.blue },
  download: { key: 'download', label: 'Download Payment Confirmation', icon: downloadIcon, border: BORDER.grey },
}
const actionsByStatus = {
  Overdue: [ACT.approve, ACT.more],
  Pending: [ACT.approve, ACT.more],
  Draft: [ACT.edit, ACT.more],
  'Need approval': [ACT.approve, ACT.more],
  Scheduled: [ACT.more],
  Processing: [ACT.send, ACT.download],
  Completed: [ACT.send, ACT.download],
}
const rowActions = (status) => actionsByStatus[status] || []

// Action tooltip (anchored above the hovered button)
const actionTip = ref(null)
function showActionTip(e, label) {
  const r = e.currentTarget.getBoundingClientRect()
  actionTip.value = { id: `${label}@${r.left},${r.top}`, label, left: r.left + r.width / 2, top: r.top - 8 }
}

// "More" dropdown items per status, grouped (destructive group last, below a divider)
const MENU = {
  view: { key: 'view', label: 'View details', icon: documentIcon },
  edit: { key: 'edit', label: 'Edit bill', icon: menuPencilIcon },
  reschedule: { key: 'reschedule', label: 'Reschedule', icon: calendarIcon },
  invoice: { key: 'invoice', label: 'Download invoice', icon: menuDownloadIcon },
  cancel: { key: 'cancel', label: 'Cancel bill', icon: xRedIcon, danger: true },
  reject: { key: 'reject', label: 'Reject', icon: xRedIcon, danger: true },
  cancelSchedule: { key: 'cancel', label: 'Cancel payment', icon: xRedIcon, danger: true },
  deleteDraft: { key: 'delete', label: 'Delete draft', icon: xRedIcon, danger: true },
}
const menuByStatus = {
  Overdue: [[MENU.view, MENU.edit, MENU.invoice], [MENU.reject]],
  Pending: [[MENU.view, MENU.edit, MENU.invoice], [MENU.reject]],
  Draft: [[MENU.view], [MENU.deleteDraft]],
  'Need approval': [[MENU.view, MENU.edit, MENU.invoice], [MENU.reject]],
  Scheduled: [[MENU.view, MENU.edit, MENU.reschedule], [MENU.cancelSchedule]],
}

// Approve dropdown (Figma 15866:228559) — text-only, 162px
const approveMenu = {
  width: 162,
  groups: [
    [{ key: 'review', label: 'Review' }, { key: 'approve', label: 'Approve' }],
    [{ key: 'reject', label: 'Reject', danger: true }],
  ],
}
// Send Payment Confirmation dropdown (Figma 15866:228523) — titled, two-line items, 190px
const sendMenu = {
  width: 190,
  title: 'Payment confirmation',
  groups: [[
    { key: 'send-full', label: 'Full version', sub: '(Perfect for record keeping)' },
    { key: 'send-simple', label: 'Simplified version', sub: '(Share with recipients)' },
  ]],
}

// Which dropdown (if any) a row-action button opens
function menuFor(action, bill) {
  if (action.key === 'approve') return approveMenu
  if (action.key === 'send') return sendMenu
  if (action.key === 'more') return { width: 180, groups: menuByStatus[bill.status] || [[MENU.view]] }
  return null
}

const rowMenu = ref(null)
const isMenuOpen = (bill, action) => rowMenu.value?.billId === bill.id && rowMenu.value?.actionKey === action.key
function onRowAction(e, action, bill) {
  actionTip.value = null
  const menu = menuFor(action, bill)
  if (!menu) return
  if (isMenuOpen(bill, action)) { rowMenu.value = null; return }
  const r = e.currentTarget.getBoundingClientRect()
  rowMenu.value = {
    ...menu,
    billId: bill.id,
    actionKey: action.key,
    bill,
    left: r.right - menu.width,
    top: r.bottom + 4,
  }
}
function onMenuItem(item) {
  const bill = rowMenu.value?.bill
  rowMenu.value = null
  if ((item.key === 'view' || item.key === 'review') && bill) viewBill(bill)
}

// Close the menu if the page scrolls (it's fixed-positioned to the button)
function closeRowMenu() { rowMenu.value = null }
function onKeydown(e) { if (e.key === 'Escape') closeRowMenu() }
onMounted(() => {
  window.addEventListener('scroll', closeRowMenu, true)
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', closeRowMenu, true)
  window.removeEventListener('keydown', onKeydown)
})

// Tab → matching statuses (visual filtering)
const tabStatus = { Draft: ['Draft'], 'Need approval': AWAITING_APPROVAL, Scheduled: ['Scheduled'], Completed: ['Completed'] }
const filteredBills = computed(() => {
  if (activeTab.value === 'All') return bills
  return bills.filter((b) => tabStatus[activeTab.value].includes(b.status))
})

// Email forwarding chip: hover tooltip (anchored above the chip) + click to copy
const forwardingEmail = 'locally-email@bills.hitpay.com'
const emailChipEl = ref(null)
const emailTooltipVisible = ref(false)
const emailTooltipPos = ref({ left: 0, top: 0 })
const emailCopied = ref(false)

watch(emailTooltipVisible, (open) => {
  if (open && emailChipEl.value) {
    const rect = emailChipEl.value.getBoundingClientRect()
    emailTooltipPos.value = { left: rect.left + rect.width / 2, top: rect.top - 8 }
  }
})

function onEmailChipLeave() {
  emailTooltipVisible.value = false
  emailCopied.value = false
}

function copyForwardingEmail() {
  navigator.clipboard?.writeText(forwardingEmail)
  emailCopied.value = true
}

const router = useRouter()
function viewBill(b) {
  router.push({ path: '/bills/view', query: { id: b.id } })
}

// Pagination (visual)
const page = ref(1)
const perPage = 10
</script>

<style scoped>
/* Table body cell (Figma Table Row/Cell) */
.cell {
  height: 44px;
  padding: 8px 12px;
  vertical-align: middle;
  border-bottom: 1px solid #e5e6ea;
  border-color: #e5e6ea;
  font-size: 13px;
  line-height: 1.5;
  color: #03102f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bill-row td { transition: background-color 150ms ease; }
.bill-row:hover td { background-color: #f8f9fc; }

/* Toolbar search/filter (Button/Secondary 28px) */
.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  transition: filter 150ms ease;
}
.tool-btn:hover { filter: brightness(0.95); }
.tool-btn:active { transform: translateY(1px); }

/* Row quick-action (outline 28px icon button; border color per action) */
.act-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid;
  background: #ffffff;
  transition: background-color 150ms ease;
}
.act-btn:hover,
.act-btn--open { background: #f5f6f9; }

/* Row-action tooltip motion (Motion guideline · Hint tooltip): fast in (140ms ease-out)
   with a 4px rise from below, even faster out (100ms, opacity only). */
.action-tooltip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.action-tooltip-leave-active { transition: opacity 100ms ease-in; }
.action-tooltip-enter-from { opacity: 0; transform: translateY(4px); }
.action-tooltip-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .action-tooltip-enter-active, .action-tooltip-leave-active { transition: none; }
  .action-tooltip-enter-from { transform: none; }
}

/* Row "More" dropdown motion — matches the Cards ⋯ menu */
.row-menu-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.row-menu-leave-active { transition: opacity 100ms ease-in; transform-origin: top right; }
.row-menu-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.row-menu-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .row-menu-enter-active, .row-menu-leave-active { transition: none; }
  .row-menu-enter-from { transform: none; }
}
.act-btn:active { transform: translateY(1px); }

/* Down-pointing arrow centered under the tooltip body */
.email-tooltip__arrow {
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #fcfcfd;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06));
}

/* Tooltip motion (motion guide): fast in with a 4px slide toward the pointer,
   even faster out, fade only — tooltips should never linger. */
.email-tooltip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.email-tooltip-leave-active { transition: opacity 100ms ease-in; }
.email-tooltip-enter-from { opacity: 0; transform: translateY(4px); }
.email-tooltip-leave-to { opacity: 0; }

/* Empty ↔ bills-list state swap (preview switcher) */
.bills-fade-enter-active { transition: opacity 220ms ease-out, transform 220ms ease-out; }
.bills-fade-leave-active { transition: opacity 130ms ease-in, transform 130ms ease-in; }
.bills-fade-enter-from { opacity: 0; transform: translateY(8px); }
.bills-fade-leave-to { opacity: 0; transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) {
  .bills-fade-enter-active, .bills-fade-leave-active { transition: none; }
  .bills-fade-enter-from, .bills-fade-leave-to { transform: none; }
}

/* Scanner line sweeping across the document: hold left → sweep right →
   hold right → sweep left → hold left. The line is the container's left edge,
   so it travels translateX 0 (x123.25) → 124px (x247.25). */
@keyframes scan-sweep {
  0%, 6%    { transform: translateX(0); }
  42%       { transform: translateX(124px); }
  56%       { transform: translateX(124px); }
  90%, 100% { transform: translateX(0); }
}
.scan-beam {
  animation: scan-sweep 4.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  will-change: transform;
}

/* Solid document revealed/erased by a straight clip whose right edge tracks the
   scanner line exactly (inset right 124px → 0). Same keyframe %s and easing as
   scan-sweep, so the cut and the line stay perfectly aligned both ways. */
@keyframes doc-reveal {
  0%, 6%    { clip-path: inset(0 124px 0 0); }
  42%       { clip-path: inset(0 0 0 0); }
  56%       { clip-path: inset(0 0 0 0); }
  90%, 100% { clip-path: inset(0 124px 0 0); }
}
.doc-reveal {
  animation: doc-reveal 4.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  will-change: clip-path;
}

/* Trailing glow flips around the line at each end (during the holds, while the
   line is stationary) so it always trails behind the direction of travel:
   scaleX(1) = glow to the left (behind a rightward sweep),
   scaleX(-1) = glow to the right (behind a leftward sweep). */
@keyframes scan-trail-flip {
  0%, 42%  { transform: scaleX(1); }
  56%, 90% { transform: scaleX(-1); }
  100%     { transform: scaleX(1); }
}
.scan-trail {
  animation: scan-trail-flip 4.4s ease-in-out infinite;
  will-change: transform;
}

/* "Data" dots travelling along each connector wire toward the scanner */
.flow-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 5px;
  border-radius: 9999px;
  background: #6380f5;
  box-shadow: 0 0 6px 1.5px rgba(99, 128, 245, 0.65);
  offset-anchor: 50% 50%;
  offset-rotate: 0deg;
  animation: flow-travel 1.8s linear infinite;
  pointer-events: none;
  will-change: offset-distance, opacity;
}
/* The dot leaving the scanner toward the "You paid" card glows green */
.flow-dot--paid {
  background: #8fe39a;
  box-shadow: 0 0 6px 1.5px rgba(143, 227, 154, 0.6);
  animation-duration: 2s;
  animation-delay: 0.6s;
}
@keyframes flow-travel {
  0%   { offset-distance: 0%;   opacity: 0; }
  12%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  /* Settle on the finished, fully-scanned document with no motion */
  .scan-beam { animation: none; opacity: 0; }
  .scan-trail { animation: none; }
  .doc-reveal { animation: none; clip-path: none; }
  .flow-dot { animation: none; opacity: 0; }
}
</style>
