<template>
  <!-- Settings › Billing › Billing (Figma: Usage-based-Billing 41:2953) -->
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="flex flex-col gap-[8px] px-[24px] py-[12px] w-full shrink-0">
        <p class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap">Billing</p>
        <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Manage invoices, payment, and spend alerts in one place.</p>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[32px] items-start w-full px-[24px] py-[12px]">

        <!-- Monthly spend -->
        <div class="flex flex-col gap-[8px] w-full rounded-[8px] border border-[#e5e6ea] pt-[16px] px-[16px] pb-[8px]">
          <div class="flex items-center justify-between w-full">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Monthly spend</p>
            <div class="flex items-center gap-[12px]">
              <div v-for="l in legends" :key="l.label" class="flex items-center gap-[4px]">
                <span class="size-[8px] rounded-full shrink-0" :style="{ background: l.color }"></span>
                <p class="text-[12px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ l.label }}</p>
              </div>
            </div>
          </div>

          <!-- Chart (Figma: MRR 41:3724 — 220px tall) -->
          <div class="relative h-[220px] w-full rounded-[8px]" @mouseleave="hoverBar = null">
            <!-- Y-axis labels -->
            <div class="absolute left-0 top-[16px] flex flex-col gap-[25px] items-start">
              <div v-for="a in ['1.5K', '1.0K', '0.5K', '0']" :key="a" class="flex items-center justify-center p-[4px]">
                <p class="w-[32px] text-[10px] font-medium text-[#9295a5] text-center tracking-[0.3px] uppercase leading-[18px]">{{ a }}</p>
              </div>
            </div>

            <!-- X-axis line + month labels -->
            <div class="absolute left-0 right-0 top-[186px]">
              <div class="absolute left-[56px] right-[16px] top-0 h-0 border-t border-[#f2f2f4]"></div>
              <div class="flex items-center justify-between pl-[56px] pr-[16px] w-full">
                <div v-for="m in months" :key="m.label" class="flex items-center justify-center p-[4px]">
                  <p class="w-[40px] text-[10px] font-medium text-[#9295a5] text-center tracking-[0.3px] uppercase leading-[18px]">{{ m.label }}</p>
                </div>
              </div>
            </div>

            <!-- Bars -->
            <div class="absolute bottom-[34px] left-0 right-[16px] pl-[56px] flex items-end justify-between">
              <div
                v-for="(m, i) in months"
                :key="m.label"
                class="relative flex flex-col w-[48px] px-[4px] shrink-0"
                :class="[
                  m.hidden ? 'opacity-0 pointer-events-none' : 'cursor-pointer transition-opacity duration-150',
                  !m.hidden && hoverBar !== null && hoverBar !== i ? 'opacity-30' : '',
                ]"
                :style="{ height: m.h + 'px' }"
                @mouseenter="hoverBar = i"
              >
                <div class="w-full min-h-px" :class="m.p === 'flex' ? 'flex-1' : 'shrink-0'" :style="m.p === 'flex' ? { background: '#c880f2' } : { background: '#c880f2', height: m.p + 'px' }"></div>
                <div class="w-full min-h-px" :class="m.y === 'flex' ? 'flex-1' : 'shrink-0'" :style="m.y === 'flex' ? { background: '#ffd47d' } : { background: '#ffd47d', height: m.y + 'px' }"></div>
                <div class="w-full min-h-px" :class="m.g === 'flex' ? 'flex-1' : 'shrink-0'" :style="m.g === 'flex' ? { background: '#4dd898' } : { background: '#4dd898', height: m.g + 'px' }"></div>
              </div>
            </div>

            <!-- Hover detail (Figma: Detail Chart 54:7692) -->
            <Transition name="chart-tip">
              <div
                v-if="hoverBar !== null && !months[hoverBar].hidden"
                class="absolute z-20 flex flex-col gap-[8px] justify-center p-[12px] rounded-[8px] bg-[#fcfcfd] pointer-events-none"
                style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09); top: -12px;"
                :style="{ left: detailLeft }"
              >
                <div class="flex flex-col items-start justify-center">
                  <p class="text-[10px] font-medium text-[#9295a5] tracking-[0.3px] uppercase leading-[18px] whitespace-nowrap">{{ months[hoverBar].full }}</p>
                  <p class="text-[14px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">SGD {{ fmtAmount(monthTotal(months[hoverBar])) }}</p>
                </div>
                <div class="flex flex-col gap-[4px] w-[220px]">
                  <div v-for="(l, li) in legendRows" :key="l.label" class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-[4px] w-[110px]">
                      <span class="size-[8px] rounded-full shrink-0" :style="{ background: l.color }"></span>
                      <p class="text-[12px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ l.label }}</p>
                    </div>
                    <p class="text-[12px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">SGD {{ fmtAmount(months[hoverBar].amounts[li]) }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Breakdown -->
        <div class="flex flex-col gap-[12px] items-start w-full">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Breakdown</p>
          <div class="flex items-start w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden">

            <!-- Invoice -->
            <div class="flex flex-1 min-w-0 flex-col border-r border-[#e5e6ea]">
              <div class="flex items-center px-[12px] py-[8px] bg-[#fcfcfd] border-b-[0.5px] border-[#cbcdd4]">
                <p class="text-[10px] font-medium text-[#03102f] tracking-[0.3px] uppercase leading-[18px] whitespace-nowrap">Invoice</p>
              </div>
              <div v-for="inv in invoices" :key="inv.id" class="flex flex-col justify-center min-h-[44px] px-[12px] py-[8px] bg-white border-b border-[#e5e6ea]">
                <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ inv.id }}</p>
              </div>
            </div>

            <!-- Date -->
            <div class="flex flex-1 min-w-0 flex-col border-r border-[#e5e6ea]">
              <div class="flex items-center px-[12px] py-[8px] bg-[#fcfcfd] border-b-[0.5px] border-[#cbcdd4]">
                <p class="text-[10px] font-medium text-[#03102f] tracking-[0.3px] uppercase leading-[18px] whitespace-nowrap">Date</p>
              </div>
              <div v-for="inv in invoices" :key="inv.id" class="flex flex-col justify-center min-h-[44px] px-[12px] py-[8px] bg-white border-b border-[#e5e6ea]">
                <p class="text-[13px] font-normal text-[#03102f] leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ inv.date }}</p>
              </div>
            </div>

            <!-- Amount -->
            <div class="flex flex-1 min-w-0 flex-col border-r border-[#e5e6ea]">
              <div class="flex items-center px-[12px] py-[8px] bg-[#fcfcfd] border-b-[0.5px] border-[#cbcdd4]">
                <p class="text-[10px] font-medium text-[#03102f] tracking-[0.3px] uppercase leading-[18px] whitespace-nowrap">Amount</p>
              </div>
              <div v-for="inv in invoices" :key="inv.id" class="flex flex-col justify-center min-h-[44px] px-[12px] py-[8px] bg-white border-b border-[#e5e6ea]">
                <p class="text-[13px] font-semibold text-[#03102f] leading-[1.4] text-right whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">SGD {{ inv.amount }}</p>
              </div>
            </div>

            <!-- Status -->
            <div class="flex flex-1 min-w-0 flex-col border-r border-[#e5e6ea]">
              <div class="flex items-center px-[12px] py-[8px] bg-[#fcfcfd] border-b-[0.5px] border-[#cbcdd4]">
                <p class="text-[10px] font-medium text-[#03102f] tracking-[0.3px] uppercase leading-[18px] whitespace-nowrap">Status</p>
              </div>
              <div v-for="inv in invoices" :key="inv.id" class="flex flex-col items-start justify-center min-h-[44px] px-[12px] py-[8px] bg-white border-b border-[#e5e6ea]">
                <div
                  class="relative flex items-center justify-center gap-[4px] min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px]"
                  :style="{ background: statusChip[inv.status].bg }"
                  @mouseenter="inv.status === 'canceled' && (cancelTipFor = inv.id)"
                  @mouseleave="cancelTipFor = null"
                >
                  <img v-if="inv.status === 'canceled'" :src="infoCircleRedIcon" width="16" height="16" alt="" class="shrink-0" />
                  <p class="text-[12px] font-medium leading-[1.5] text-center whitespace-nowrap" :style="{ color: statusChip[inv.status].text }">{{ statusChip[inv.status].label }}</p>

                  <!-- Cancelled tooltip (Figma: Tooltip 54:7663) -->
                  <Transition name="chart-tip">
                    <div
                      v-if="cancelTipFor === inv.id"
                      class="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-[195px] px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd]"
                      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
                    >
                      <p class="text-[12px] font-medium text-[#61667c] leading-[1.5] text-center">
                        Payment was not successful. Please
                        <button type="button" class="text-[#2465de] underline pointer-events-auto" style="text-underline-position: from-font;" @mousedown.prevent="openEditCard(cards.find((c) => c.default))">update your card</button><span class="underline" style="text-underline-position: from-font;">.</span>
                      </p>
                      <img :src="tooltipArrowIcon" alt="" class="absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-[12px] h-[8px] rotate-180" />
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Download -->
            <div class="flex flex-col w-[126px] shrink-0">
              <div class="flex items-center px-[12px] py-[8px] bg-[#fcfcfd] border-b-[0.5px] border-[#cbcdd4]">
                <p class="text-[10px] font-medium text-[#03102f] tracking-[0.3px] uppercase leading-[18px] whitespace-nowrap">Download</p>
              </div>
              <div v-for="inv in invoices" :key="inv.id" class="flex flex-col items-start justify-center min-h-[44px] px-[12px] py-[8px] bg-white border-b border-[#e5e6ea]">
                <button
                  type="button"
                  class="flex items-center justify-center h-[28px] p-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                  @click="showToast(`${inv.id} downloaded`)"
                >
                  <span class="flex items-center gap-[6px]">
                    <img :src="downloadCloudIcon" width="16" height="16" alt="" class="shrink-0" />
                    <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Download</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment details -->
        <div class="flex flex-col gap-[12px] items-start w-full">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Payment details</p>
          <div class="flex flex-col gap-[8px] w-full">
            <div
              v-for="card in cards"
              :key="card.key"
              class="flex items-center gap-[12px] w-full rounded-[8px] border border-[#e5e6ea] bg-white px-[16px] pt-[12px] pb-[16px]"
            >
              <!-- Card art -->
              <div class="relative size-[64px] shrink-0 rounded-[8px] border border-[#e5e6ea] bg-white overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                  <img :src="card.logo" :alt="card.brand" :style="{ width: card.logoWidth + 'px' }" />
                </div>
              </div>

              <!-- Details -->
              <div class="flex flex-1 min-w-0 flex-col gap-[4px] items-start justify-center">
                <div class="flex items-center gap-[8px] h-[24px]">
                  <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">**** **** **** {{ card.last4 }}</p>
                  <span
                    v-if="card.default"
                    class="flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-[#f5f6f9]"
                  >
                    <span class="text-[12px] font-medium text-[#002771] leading-[1.5] text-center">Default</span>
                  </span>
                </div>
                <p class="text-[12px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ card.holder }}</p>
              </div>

              <!-- Buttons -->
              <div class="flex items-start gap-[8px] shrink-0">
                <button
                  v-if="!card.default"
                  type="button"
                  class="flex items-center justify-center h-[28px] min-w-[36px] px-[8px] rounded-[8px] transition-colors duration-150 hover:bg-[rgba(36,101,222,0.06)]"
                  @click="setDefault(card)"
                >
                  <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">Set default</span>
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center h-[28px] p-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                  @click="openEditCard(card)"
                >
                  <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Edit details</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Add new card -->
          <button
            type="button"
            class="flex items-center justify-center h-[28px] p-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
            @click="openAddCard"
          >
            <span class="flex items-center gap-[6px]">
              <img :src="plusGreyIcon" width="16" height="16" alt="" class="shrink-0" />
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Add new card</span>
            </span>
          </button>
        </div>

        <!-- Billing email + Billing address -->
        <div class="flex items-start gap-[24px] w-full">
          <div class="flex flex-1 min-w-0 flex-col gap-[12px] items-start self-stretch">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Billing email</p>
            <div class="flex flex-1 flex-col w-full rounded-[8px] border border-[#e5e6ea] p-[16px]">
              <div class="relative flex flex-col gap-[8px] w-full">
                <p class="text-[14px] font-normal text-[#03102f] leading-[1.5]">Invoices will be sent to the following email address</p>
                <input
                  v-model="billingEmail"
                  type="email"
                  class="w-full h-[36px] rounded-[8px] border border-[#e5e6ea] bg-white px-[8px] pr-[72px] text-[14px] font-normal text-[#03102f] leading-[1.5] outline-none focus:border-[#2465de]"
                  style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                />
                <button
                  type="button"
                  class="absolute bottom-[4px] right-[4px] flex items-center justify-center h-[28px] min-w-[36px] p-[8px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                  @click="showToast('Billing email updated')"
                >
                  <span class="text-[12px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Update</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-1 min-w-0 flex-col gap-[12px] items-start">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Billing address</p>
            <div class="flex items-start gap-[8px] w-full rounded-[8px] border border-[#e5e6ea] p-[16px]">
              <div class="flex flex-1 min-w-0 flex-col gap-[8px] items-start">
                <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] w-full">{{ address.nickname }}</p>
                <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] w-full">{{ address.street }} {{ address.city }}<br />{{ address.state }}. {{ address.country }}. {{ address.zip }}</p>
              </div>
              <button
                type="button"
                class="flex items-center justify-center h-[28px] min-w-[36px] px-[8px] rounded-[8px] shrink-0 transition-colors duration-150 hover:bg-[rgba(36,101,222,0.06)]"
                @click="openAddressModal"
              >
                <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">Edit address</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing address modal (Figma: Modal 54:8672) -->
    <BaseModal :open="addressOpen" :width="480" @close="addressOpen = false">
      <!-- Header -->
              <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea] bg-white">
                <div class="flex flex-1 min-w-0 flex-col gap-[4px] items-start pt-[2px]">
                  <p class="text-[16px] font-medium leading-[1.4] text-[#03102f] whitespace-nowrap">Billing address</p>
                </div>
                <button
                  class="flex items-center justify-center size-[32px] p-[6px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]"
                  aria-label="Close"
                  @click="addressOpen = false"
                >
                  <img :src="modalXIcon" width="20" height="20" alt="" />
                </button>
              </div>

              <!-- Content -->
              <div class="flex flex-col gap-[16px] items-start p-[24px] w-full">
                <div v-for="f in addressFields" :key="f.key" class="flex flex-col gap-[4px] w-full" :class="f.row ? 'hidden' : ''">
                  <label class="flex items-center h-[20px] text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ f.label }}</label>
                  <input
                    v-model="addressDraft[f.key]"
                    type="text"
                    class="w-full h-[36px] rounded-[8px] border border-[#e5e6ea] bg-white px-[8px] text-[14px] font-normal text-[#03102f] leading-[1.5] outline-none focus:border-[#2465de]"
                    style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                  />
                </div>
                <div class="flex items-start gap-[12px] w-full">
                  <div v-for="f in [['city', 'City'], ['state', 'State']]" :key="f[0]" class="flex flex-1 min-w-0 flex-col gap-[4px]">
                    <label class="flex items-center h-[20px] text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ f[1] }}</label>
                    <input
                      v-model="addressDraft[f[0]]"
                      type="text"
                      class="w-full h-[36px] rounded-[8px] border border-[#e5e6ea] bg-white px-[8px] text-[14px] font-normal text-[#03102f] leading-[1.5] outline-none focus:border-[#2465de]"
                      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                    />
                  </div>
                </div>
                <div class="flex items-start gap-[12px] w-full">
                  <div v-for="f in [['country', 'Country'], ['zip', 'Zip code']]" :key="f[0]" class="flex flex-1 min-w-0 flex-col gap-[4px]">
                    <label class="flex items-center h-[20px] text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ f[1] }}</label>
                    <input
                      v-model="addressDraft[f[0]]"
                      type="text"
                      class="w-full h-[36px] rounded-[8px] border border-[#e5e6ea] bg-white px-[8px] text-[14px] font-normal text-[#03102f] leading-[1.5] outline-none focus:border-[#2465de]"
                      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                    />
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-start justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea] bg-white">
                <button
                  type="button"
                  class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] py-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                  @click="addressOpen = false"
                >
                  <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] py-[8px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                  @click="saveAddress"
                >
                  <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Update</span>
                </button>
              </div>
    </BaseModal>

    <!-- Add / edit card modal (Figma: Modal 125:16558) -->
    <BaseModal :open="!!cardModal" :width="480" @close="cardModal = null">
      <!-- Header -->
              <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea] bg-white">
                <div class="flex flex-1 min-w-0 flex-col gap-[4px] items-start pt-[2px]">
                  <p class="text-[16px] font-medium leading-[1.4] text-[#03102f] whitespace-nowrap">{{ cardModal === 'edit' ? 'Edit card details' : 'Add new card' }}</p>
                  <p class="text-[12px] font-normal leading-[1.5] text-[#61667c] whitespace-nowrap">{{ cardModal === 'edit' ? 'Update your card details' : 'Enter your card details to continue' }}</p>
                </div>
                <button
                  class="flex items-center justify-center size-[32px] p-[6px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]"
                  aria-label="Close"
                  @click="cardModal = null"
                >
                  <img :src="modalXIcon" width="20" height="20" alt="" />
                </button>
              </div>

              <!-- Content -->
              <div class="flex flex-col gap-[16px] items-start p-[24px] w-full">
                <div class="flex flex-col gap-[4px] w-full">
                  <label class="flex items-center h-[20px] text-[12px] font-medium text-[#61667c] leading-[1.5]">Card number</label>
                  <div
                    class="flex items-center gap-[8px] w-full h-[36px] rounded-[8px] border border-[#e5e6ea] bg-white px-[8px] focus-within:border-[#2465de]"
                    style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                  >
                    <img :src="bankCardGreyIcon" width="16" height="16" alt="" class="shrink-0" />
                    <input
                      v-model="newCard.number"
                      type="text"
                      inputmode="numeric"
                      placeholder="4444 3333 2222 1111"
                      class="flex-1 min-w-0 h-full bg-transparent text-[14px] font-normal text-[#03102f] leading-[1.5] outline-none placeholder:text-[#9295a5]"
                    />
                  </div>
                </div>
                <div class="flex items-start gap-[12px] w-full">
                  <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                    <label class="flex items-center h-[20px] text-[12px] font-medium text-[#61667c] leading-[1.5]">Expiry date</label>
                    <input
                      v-model="newCard.expiry"
                      type="text"
                      placeholder="MM/YY"
                      class="w-full h-[36px] rounded-[8px] border border-[#e5e6ea] bg-white px-[8px] text-[14px] font-normal text-[#03102f] leading-[1.5] outline-none placeholder:text-[#9295a5] focus:border-[#2465de]"
                      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                    />
                  </div>
                  <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                    <label class="flex items-center h-[20px] text-[12px] font-medium text-[#61667c] leading-[1.5]">Security code</label>
                    <input
                      v-model="newCard.cvc"
                      type="text"
                      inputmode="numeric"
                      placeholder="CVC"
                      class="w-full h-[36px] rounded-[8px] border border-[#e5e6ea] bg-white px-[8px] text-[14px] font-normal text-[#03102f] leading-[1.5] outline-none placeholder:text-[#9295a5] focus:border-[#2465de]"
                      style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                    />
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex items-start justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea] bg-white">
                <button
                  type="button"
                  class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] py-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
                  @click="cardModal = null"
                >
                  <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] py-[8px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                  style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                  @click="saveCard"
                >
                  <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">{{ cardModal === 'edit' ? 'Save' : 'Add card' }}</span>
                </button>
              </div>
    </BaseModal>

    <!-- Success snackbar -->
    <Teleport to="body">
      <div class="fixed top-[24px] inset-x-0 z-[110] flex justify-center pointer-events-none">
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

  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import BaseModal from '../modals/BaseModal.vue'
import { savedCards as cards, addSavedCard, setDefaultCard } from '../../composables/useBillingCards.js'
import infoCircleRedIcon from '../../assets/icons/icon-info-circle-red.svg'
import downloadCloudIcon from '../../assets/icons/icon-download-cloud.svg'
import modalXIcon from '../../assets/icons/icon-modal-x.svg'
import bankCardGreyIcon from '../../assets/icons/icon-bank-card-grey.svg'
import plusGreyIcon from '../../assets/icons/icon-plus-grey.svg'
import tooltipArrowIcon from '../../assets/icons/icon-tooltip-arrow.svg'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'

// ── Monthly spend chart ──────────────────────────────────────────────
const legends = [
  { label: 'Manual payments', color: '#c880f2' },
  { label: 'SMS Receipts', color: '#ffd47d' },
  { label: 'eGiro', color: '#4dd898' },
]
const legendRows = [
  { label: 'Manual payments', color: '#c880f2' },
  { label: 'SMS receipts', color: '#ffd47d' },
  { label: 'eGiro', color: '#4dd898' },
]

// Bar segment heights are lifted 1:1 from the Figma frame (41:3745); the
// last four months are future placeholders and stay hidden but keep their
// slot so justify-between spacing matches the design
const months = [
  { label: 'Jan’26', full: 'Jan 2026', h: 47, p: 'flex', y: 32, g: 6, amounts: [55.99, 32.0, 12.0] },
  { label: 'Feb’26', full: 'Feb 2026', h: 96, p: 12, y: 39, g: 45, amounts: [10.56, 33.0, 31.0] },
  { label: 'Mar’26', full: 'Mar 2026', h: 87, p: 41, y: 32, g: 14, amounts: [40.12, 31.0, 10.0] },
  { label: 'Apr’26', full: 'Apr 2026', h: 142, p: 65, y: 67, g: 10, amounts: [20.89, 39.0, 8.0] },
  { label: 'May’26', full: 'May 2026', h: 106, p: 24, y: 32, g: 50, amounts: [20.67, 30.0, 55.0] },
  { label: 'Jun’26', full: 'Jun 2026', h: 27, p: 'flex', y: 14, g: 6, amounts: [64.3, 20.0, 10.0] },
  { label: 'Jul’26', full: 'Jul 2026', h: 87, p: 'flex', y: 32, g: 6, amounts: [28.9, 20.0, 10.0] },
  { label: 'Aug’26', full: 'Aug 2026', h: 126, p: 'flex', y: 'flex', g: 'flex', amounts: [30.45, 27.0, 15.0] },
  { label: 'SEP’26', full: 'Sep 2026', h: 126, p: 'flex', y: 'flex', g: 'flex', hidden: true, amounts: [0, 0, 0] },
  { label: 'oct’26', full: 'Oct 2026', h: 82, p: 43, y: 'flex', g: 'flex', hidden: true, amounts: [0, 0, 0] },
  { label: 'nov’26', full: 'Nov 2026', h: 42, p: 'flex', y: 'flex', g: 28, hidden: true, amounts: [0, 0, 0] },
  { label: 'dec’26', full: 'Dec 2026', h: 68, p: 'flex', y: 32, g: 14, hidden: true, amounts: [0, 0, 0] },
]

const hoverBar = ref(null)

function monthTotal(m) {
  return m.amounts.reduce((a, b) => a + b, 0)
}
function fmtAmount(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Tooltip sits just past the hovered bar (Figma: Detail Chart x = bar.x + 48),
// flipping to the left side for the last bars so it never clips the card edge
const detailLeft = computed(() => {
  if (hoverBar.value === null) return '0px'
  const slot = (hoverBar.value + 0.5) / 12
  if (hoverBar.value >= 6) return `calc(56px + (100% - 72px) * ${slot} - 268px)`
  return `calc(56px + (100% - 72px) * ${slot} + 24px)`
})

// ── Breakdown table ──────────────────────────────────────────────────
const statusChip = {
  unpaid: { label: 'Unpaid', bg: '#fff9ec', text: '#bd8400' },
  canceled: { label: 'Canceled', bg: '#f9e9e9', text: '#c20a1c' },
  paid: { label: 'Paid', bg: '#e6f9f0', text: '#238b5b' },
}

const invoices = [
  { id: 'INV-AAYT0826', date: 'Aug 1, 2026', amount: '72.45', status: 'unpaid' },
  { id: 'INV-AAYT0726', date: 'Jul 1, 2026', amount: '58.90', status: 'canceled' },
  { id: 'INV-AAYT0626', date: 'Jun 1, 2026', amount: '94.30', status: 'paid' },
  { id: 'INV-AAYT0526', date: 'May 1, 2026', amount: '105.67', status: 'paid' },
  { id: 'INV-AAYT0426', date: 'Apr 1, 2026', amount: '67.89', status: 'paid' },
  { id: 'INV-AAYT0326', date: 'Mar 1, 2026', amount: '81.12', status: 'paid' },
  { id: 'INV-AAYT0226', date: 'Feb 1, 2026', amount: '74.56', status: 'paid' },
  { id: 'INV-AAYT0126', date: 'Jan 1, 2026', amount: '99.99', status: 'paid' },
]

const cancelTipFor = ref(null)

// ── Payment details ──────────────────────────────────────────────────
// Cards live in useBillingCards.js so the Usage subscribe flow sees the same list
function setDefault(card) {
  setDefaultCard(card)
  showToast(`${card.brand} card ending ${card.last4} is now your default`)
}

// One modal serves both flows: 'add' starts blank, 'edit' prefills from the card
const cardModal = ref(null) // null | 'add' | 'edit'
const newCard = reactive({ number: '', expiry: '', cvc: '' })

function openAddCard() {
  Object.assign(newCard, { number: '', expiry: '', cvc: '' })
  cardModal.value = 'add'
}

function openEditCard(card) {
  Object.assign(newCard, { number: `**** **** **** ${card.last4}`, expiry: card.expiry, cvc: '' })
  cardModal.value = 'edit'
}

function saveCard() {
  const editing = cardModal.value === 'edit'
  if (!editing) addSavedCard({ number: newCard.number, expiry: newCard.expiry })
  cardModal.value = null
  showToast(editing ? 'Card details updated' : 'Card added')
}

// ── Billing email + address ──────────────────────────────────────────
const billingEmail = ref('samlee@gmail.com')

const address = reactive({
  nickname: 'Sam Lee',
  street: 'Jl. Panglima Sudirman No.02',
  city: 'Bandung',
  state: 'Jawa Barat',
  country: 'Indonesia',
  zip: '65766',
})

const addressOpen = ref(false)
const addressDraft = reactive({ ...address })
const addressFields = [
  { key: 'nickname', label: 'Nickname' },
  { key: 'street', label: 'Billing address' },
]

function openAddressModal() {
  Object.assign(addressDraft, address)
  addressOpen.value = true
}

function saveAddress() {
  Object.assign(address, addressDraft)
  addressOpen.value = false
  showToast('Billing address updated')
}

// ── Snackbar — same one-shot toast recipe as UsagePage ───────────────
const toast = ref('')
let toastTimer = null

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

onUnmounted(() => clearTimeout(toastTimer))
</script>

<style scoped>
/* Chart + status tooltips fade */
.chart-tip-enter-active { transition: opacity 120ms ease-out; }
.chart-tip-leave-active { transition: opacity 100ms ease-in; }
.chart-tip-enter-from,
.chart-tip-leave-to { opacity: 0; }

/* Snackbar motion — same as CardsPage */
.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .chart-tip-enter-active, .chart-tip-leave-active,
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
}
</style>
