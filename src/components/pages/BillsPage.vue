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
        </div>
      </div>

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

      <!-- Non-empty state: bills history table -->
      <div v-else key="filled" class="flex flex-1 flex-col gap-[16px] items-start w-full px-[24px] py-[12px]">

        <!-- Table card -->
        <div class="w-full rounded-[12px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: tabs + actions -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] pl-[12px] pr-[12px] border-b border-[#e5e6ea]">
            <div class="flex items-center gap-[4px]">
              <button
                v-for="t in tabs"
                :key="t"
                type="button"
                class="h-[26px] px-[12px] rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-colors duration-150"
                :class="activeTab === t ? 'bg-[#f0f1f5] text-[#03102f]' : 'text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeTab = t"
              >{{ t }}</button>
            </div>
            <div class="flex items-center gap-[8px] shrink-0">
              <!-- Email forwarding chip + settings -->
              <div class="flex items-center gap-[8px] pr-[8px]">
                <div
                  ref="emailChipEl"
                  class="flex items-center justify-center gap-[8px] min-h-[24px] px-[8px] py-[2px] rounded-full bg-[#f2f2f4] cursor-pointer"
                  @mouseenter="emailTooltipVisible = true"
                  @mouseleave="onEmailChipLeave"
                  @click="copyForwardingEmail"
                >
                  <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="#484d61" stroke-width="1.2" /><path d="M2.5 4.5L8 8.5l5.5-4" stroke="#484d61" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  <span class="text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap">{{ forwardingEmail }}</span>
                </div>
                <!-- Copy tooltip (teleported: the table card clips overflow) -->
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
                <button
                  type="button"
                  class="flex items-center justify-center size-[16px] shrink-0 cursor-pointer"
                  aria-label="Email forwarding settings"
                  @click="$router.push({ path: '/settings', query: { section: 'bill-inbox' } })"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.60633 1.52835C10.2615 1.69046 10.8782 1.94933 11.4405 2.28869C11.6741 2.42965 11.7981 2.69869 11.7538 2.96785C11.6781 3.42719 11.7923 3.77848 12.007 3.99316C12.2217 4.20784 12.573 4.32205 13.0323 4.24636C13.3015 4.20201 13.5705 4.32611 13.7115 4.55967C14.0508 5.12194 14.3097 5.73869 14.4718 6.39379C14.5373 6.6587 14.4348 6.9368 14.213 7.0958C13.8345 7.36713 13.6667 7.6964 13.6667 8.00007C13.6667 8.30373 13.8345 8.633 14.213 8.90433C14.4348 9.06326 14.5373 9.3414 14.4718 9.60633C14.3097 10.2615 14.0508 10.8782 13.7114 11.4405C13.5705 11.6741 13.3015 11.7982 13.0323 11.7538C12.5729 11.6781 12.2217 11.7923 12.007 12.007C11.7923 12.2217 11.6781 12.573 11.7538 13.0323C11.7981 13.3015 11.6741 13.5705 11.4405 13.7115C10.8782 14.0508 10.2615 14.3097 9.60633 14.4718C9.3414 14.5373 9.06333 14.4348 8.90433 14.213C8.633 13.8345 8.30373 13.6667 8.00007 13.6667C7.6964 13.6667 7.36713 13.8345 7.0958 14.213C6.9368 14.4348 6.65871 14.5373 6.3938 14.4718C5.73868 14.3097 5.12191 14.0508 4.55964 13.7115C4.32609 13.5705 4.20197 13.3015 4.24633 13.0323C4.32201 12.573 4.2078 12.2217 3.99313 12.007C3.77845 11.7923 3.42717 11.6781 2.96785 11.7538C2.69869 11.7982 2.42966 11.6741 2.2887 11.4405C1.94933 10.8782 1.69046 10.2615 1.52835 9.60633C1.46279 9.3414 1.56531 9.06326 1.78713 8.90433C2.16566 8.633 2.3334 8.30373 2.3334 8.00007C2.3334 7.6964 2.16566 7.36713 1.78712 7.0958C1.56531 6.9368 1.46279 6.65871 1.52835 6.3938C1.69045 5.73869 1.94931 5.12194 2.28866 4.55968C2.42962 4.32612 2.69866 4.20201 2.96783 4.24637C3.42715 4.32206 3.77845 4.20785 3.99313 3.99317C4.20781 3.77848 4.32203 3.42719 4.24633 2.96786C4.20197 2.69869 4.32608 2.42965 4.55963 2.28869C5.12191 1.94933 5.73868 1.69046 6.3938 1.52835C6.65871 1.46279 6.9368 1.56531 7.0958 1.78713C7.36713 2.16566 7.6964 2.33339 8.00007 2.33339C8.30373 2.33339 8.633 2.16566 8.90433 1.78713C9.06333 1.56531 9.3414 1.46279 9.60633 1.52835ZM9.6746 2.93473C9.2368 3.37401 8.6614 3.66673 8.00007 3.66673C7.33873 3.66673 6.76327 3.37401 6.3255 2.93473C6.07585 3.01721 5.83432 3.11767 5.60243 3.23459C5.60341 3.85468 5.40347 4.46844 4.93594 4.93597C4.46841 5.4035 3.85465 5.60345 3.23458 5.60247C3.11766 5.83434 3.01721 6.07586 2.93473 6.3255C3.37401 6.76327 3.66673 7.33873 3.66673 8.00007C3.66673 8.6614 3.37401 9.2368 2.93473 9.6746C3.01721 9.92426 3.11767 10.1658 3.23461 10.3977C3.85467 10.3967 4.46841 10.5967 4.93593 11.0642C5.40345 11.5317 5.60339 12.1455 5.60243 12.7655C5.83432 12.8825 6.07585 12.9829 6.32551 13.0654C6.76327 12.6261 7.33873 12.3334 8.00007 12.3334C8.6614 12.3334 9.2368 12.6261 9.6746 13.0654C9.92427 12.9829 10.1658 12.8825 10.3977 12.7655C10.3967 12.1455 10.5967 11.5317 11.0642 11.0642C11.5317 10.5967 12.1455 10.3967 12.7655 10.3977C12.8825 10.1658 12.9829 9.92426 13.0654 9.6746C12.6261 9.2368 12.3334 8.6614 12.3334 8.00007C12.3334 7.33873 12.6261 6.76327 13.0654 6.3255C12.9829 6.07586 12.8825 5.83435 12.7655 5.60246C12.1455 5.60344 11.5317 5.4035 11.0642 4.93597C10.5967 4.46843 10.3967 3.85467 10.3977 3.2346C10.1658 3.11767 9.92427 3.01721 9.6746 2.93473ZM8.00007 5.33339C9.4728 5.33339 10.6667 6.5273 10.6667 8.00006C10.6667 9.4728 9.4728 10.6667 8.00007 10.6667C6.52731 10.6667 5.3334 9.4728 5.3334 8.00006C5.3334 6.5273 6.52731 5.33339 8.00007 5.33339ZM8.00007 6.66673C7.26367 6.66673 6.66673 7.26367 6.66673 8.00007C6.66673 8.73646 7.26367 9.3334 8.00007 9.3334C8.73647 9.3334 9.3334 8.73646 9.3334 8.00007C9.3334 7.26367 8.73647 6.66673 8.00007 6.66673Z" fill="#484d61" /></svg>
                </button>
              </div>
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Search"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
              </button>
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Filter"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 4h11M4.5 8h7M6.5 12h3" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in columns"
                    :key="col.key"
                    class="bg-[#fcfcfd] border-b border-[#e5e6ea] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < columns.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
                  >
                    <div class="flex items-center gap-[8px]">
                      <span class="flex-1 text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f] whitespace-nowrap">{{ col.label }}</span>
                      <svg v-if="col.sortable" class="shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 4v8M5 9l3 3 3-3" stroke="#8093b8" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in filteredBills" :key="b.id" class="hover:bg-[#f8f9fc] transition-colors duration-150 cursor-pointer [&:last-child>td]:border-b-0" @click="viewBill(b)">
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea] text-[13px] text-[#03102f] whitespace-nowrap">{{ b.recipient }}</td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea] text-[13px] text-[#03102f] whitespace-nowrap">{{ b.invoice }}</td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea] text-[13px] text-[#03102f] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ b.amount }}</td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea] text-[13px] text-[#03102f] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ b.due }}</td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center px-[10px] py-[3px] rounded-full text-[12px] font-medium whitespace-nowrap border bg-white"
                      :style="{ borderColor: fundingStyle(b.funding).border, color: fundingStyle(b.funding).text }"
                    >{{ b.funding }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center px-[10px] py-[3px] rounded-full text-[12px] font-medium whitespace-nowrap"
                      :style="{ background: statusStyle(b.status).bg, color: statusStyle(b.status).text }"
                    >{{ b.status }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea] text-right whitespace-nowrap">
                    <!-- Approve (split) for items needing approval -->
                    <span
                      v-if="b.status === 'Need approval'"
                      class="inline-flex items-center h-[28px] rounded-[8px] border border-[#2465de] overflow-hidden align-middle"
                      style="box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                    >
                      <button type="button" class="h-full pl-[12px] pr-[8px] text-[13px] font-medium text-white" style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); text-shadow: 0px 1px 1px rgba(0,0,0,0.12);" @click.stop>Approve</button>
                      <button type="button" class="h-full w-[24px] flex items-center justify-center border-l border-[rgba(255,255,255,0.25)]" style="background: linear-gradient(to bottom, #4179e2, #1f5bcc);" aria-label="More approve options" @click.stop>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 6.5l3 3 3-3" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
                      </button>
                    </span>
                    <!-- Send again for completed items -->
                    <button
                      v-else-if="b.status === 'Completed'"
                      type="button"
                      class="h-[28px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[13px] font-medium text-[#61667c] align-middle"
                      style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
                      @click.stop="viewBill(b)"
                    >Send again</button>
                    <!-- See details for everything else -->
                    <a
                      v-else
                      href="#"
                      class="text-[13px] font-medium text-[#2465de] hover:underline cursor-pointer align-middle"
                      @click.prevent.stop="viewBill(b)"
                    >See details</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center w-full shrink-0">
          <div class="flex-1" />
          <div class="flex items-center gap-[2px]">
            <button type="button" class="flex items-center gap-[4px] h-[32px] px-[10px] rounded-[8px] text-[13px] font-medium text-[#61667c] hover:bg-[#f0f1f5] transition-colors duration-150" @click="page = Math.max(1, page - 1)">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 4l-4 4 4 4" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
              Prev
            </button>
            <template v-for="p in pages" :key="p">
              <span v-if="p === '…'" class="flex items-center justify-center min-w-[32px] h-[32px] text-[13px] text-[#8093b8]">…</span>
              <button
                v-else
                type="button"
                class="flex items-center justify-center min-w-[32px] h-[32px] px-[8px] rounded-[8px] text-[13px] font-medium transition-colors duration-150"
                :class="page === p ? 'bg-[#eceef2] text-[#03102f]' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
                @click="page = p"
              >{{ p }}</button>
            </template>
            <button type="button" class="flex items-center gap-[4px] h-[32px] px-[10px] rounded-[8px] text-[13px] font-medium text-[#61667c] hover:bg-[#f0f1f5] transition-colors duration-150" @click="page = Math.min(15, page + 1)">
              Next
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>
          <div class="flex-1 flex justify-end">
            <div class="flex items-center gap-[6px] h-[36px] px-[12px] rounded-[8px] border border-[#e5e6ea] bg-white" style="box-shadow: 0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09);">
              <span class="text-[13px] text-[#61667c] leading-[1.5]">Item per page:</span>
              <span class="text-[13px] font-medium text-[#03102f] leading-[1.5]">{{ perPage }}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6.5l4 4 4-4" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </div>
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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { bills, fundingStyle, statusStyle } from '../../composables/useBills.js'
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

// Preview switcher: true = empty/onboarding state (current), false = bills list
const isEmpty = ref(true)

// Filter tabs
const tabs = ['All', 'Draft', 'Need Approval', 'Scheduled', 'Completed']
const activeTab = ref('All')

// Table columns (first four are sortable)
const columns = [
  { key: 'recipient', label: 'Recipient', sortable: true },
  { key: 'invoice', label: '# Invoice', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'due', label: 'Due date', sortable: true },
  { key: 'funding', label: 'Funding', sortable: false },
  { key: 'status', label: 'Bill status', sortable: false },
  { key: 'action', label: '', sortable: false },
]

// Tab → matching status (visual filtering)
const tabStatus = { Draft: 'Draft', 'Need Approval': 'Need approval', Scheduled: 'Scheduled', Completed: 'Completed' }
const filteredBills = computed(() => {
  if (activeTab.value === 'All') return bills
  return bills.filter((b) => b.status === tabStatus[activeTab.value])
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
const pages = [1, 2, 3, 4, '…', 15]
const page = ref(2)
const perPage = 10
</script>

<style scoped>
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
