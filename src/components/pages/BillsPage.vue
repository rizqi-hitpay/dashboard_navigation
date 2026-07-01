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
                <tr v-for="b in filteredBills" :key="b.id" class="hover:bg-[#f8f9fc] transition-colors duration-150 [&:last-child>td]:border-b-0">
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
                      <button type="button" class="h-full pl-[12px] pr-[8px] text-[13px] font-medium text-white" style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Approve</button>
                      <button type="button" class="h-full w-[24px] flex items-center justify-center border-l border-[rgba(255,255,255,0.25)]" style="background: linear-gradient(to bottom, #4179e2, #1f5bcc);" aria-label="More approve options">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 6.5l3 3 3-3" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
                      </button>
                    </span>
                    <!-- Send again for completed items -->
                    <button
                      v-else-if="b.status === 'Completed'"
                      type="button"
                      class="h-[28px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[13px] font-medium text-[#61667c] align-middle"
                      style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
                    >Send again</button>
                    <!-- See details for everything else -->
                    <a
                      v-else
                      href="#"
                      class="text-[13px] font-medium text-[#2465de] hover:underline cursor-pointer align-middle"
                      @click.prevent="$router.push('/bills/view')"
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
import { ref, computed } from 'vue'
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

const bills = [
  { id: 1, recipient: 'Berry Sharp', invoice: 'INV-83177', amount: 'SGD 1,870.00', due: '2025-08-15', funding: 'Returned', status: 'Failed' },
  { id: 2, recipient: 'David Tarigan', invoice: 'INV-98765', amount: 'SGD 870.00', due: '2025-11-05', funding: 'Collected', status: 'Pending' },
  { id: 3, recipient: 'Naomi Atkinson', invoice: 'N/A', amount: 'SGD 1,088.00', due: 'N/A', funding: 'Returned', status: 'Failed' },
  { id: 4, recipient: 'Naomi Atkinson', invoice: 'INV-67890', amount: 'SGD 1,088.00', due: '2025-09-10', funding: 'Awaiting funds', status: 'Need approval' },
  { id: 5, recipient: 'Liam Carter', invoice: 'INV-12345', amount: 'SGD 987.75', due: '2026-01-30', funding: 'Collected', status: 'Scheduled' },
  { id: 6, recipient: 'Sophia Bennett', invoice: 'INV-67891', amount: 'SGD 1,350.00', due: '2026-02-14', funding: 'Not funded', status: 'Draft' },
  { id: 7, recipient: 'Ethan Johnson', invoice: 'INV-54321', amount: 'SGD 750.25', due: '2026-03-01', funding: 'Collected', status: 'Processing' },
  { id: 8, recipient: 'Olivia Smith', invoice: 'INV-98765', amount: 'SGD 1,560.80', due: '2026-04-18', funding: 'Returned', status: 'Rejected' },
  { id: 9, recipient: 'Mason Lee', invoice: 'INV-24680', amount: 'SGD 1,100.00', due: '2026-05-25', funding: 'Returned', status: 'Cancel' },
  { id: 10, recipient: 'Ava Davis', invoice: 'N/A', amount: 'SGD 1,425.90', due: 'N/A', funding: 'Collected', status: 'Completed' },
  { id: 11, recipient: 'Naomi Atkinson', invoice: 'INV-12445', amount: 'SGD 1,245.50', due: '2025-10-22', funding: 'Collected', status: 'Completed' },
]

// Tab → matching status (visual filtering)
const tabStatus = { Draft: 'Draft', 'Need Approval': 'Need approval', Scheduled: 'Scheduled', Completed: 'Completed' }
const filteredBills = computed(() => {
  if (activeTab.value === 'All') return bills
  return bills.filter((b) => b.status === tabStatus[activeTab.value])
})

// Funding chips — outline pills
function fundingStyle(funding) {
  const map = {
    Returned: { border: '#80acfe', text: '#2465de' },
    Collected: { border: '#a6e5c3', text: '#1b8a4b' },
    'Awaiting funds': { border: '#ffe0a2', text: '#bd8400' },
    'Not funded': { border: '#dcdfe6', text: '#61667c' },
  }
  return map[funding] || { border: '#dcdfe6', text: '#61667c' }
}
// Bill status chips — soft-filled
function statusStyle(status) {
  const map = {
    Failed: { bg: '#fdecec', text: '#d92d20' },
    Rejected: { bg: '#fdecec', text: '#d92d20' },
    Cancel: { bg: '#fdecec', text: '#d92d20' },
    Pending: { bg: '#fff4e5', text: '#bd8400' },
    Scheduled: { bg: '#fff4e5', text: '#bd8400' },
    'Need approval': { bg: '#f4ecfe', text: '#7e3ff2' },
    Draft: { bg: '#f0f1f5', text: '#61667c' },
    Processing: { bg: '#eef2ff', text: '#2465de' },
    Completed: { bg: '#e8f7ee', text: '#1b8a4b' },
  }
  return map[status] || { bg: '#f0f1f5', text: '#61667c' }
}

// Pagination (visual)
const pages = [1, 2, 3, 4, '…', 15]
const page = ref(2)
const perPage = 10
</script>

<style scoped>
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
