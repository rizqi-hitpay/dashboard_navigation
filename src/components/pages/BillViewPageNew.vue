<template>
  <div class="relative bg-white flex h-full w-full overflow-hidden" @click="menuOpen = false">
    <!-- Detail content (the invoice viewer overlays it, no reflow) -->
    <div class="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="flex flex-wrap gap-x-[16px] gap-y-[8px] items-center px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-1 flex-col gap-[8px] items-start justify-center min-w-[220px]">
          <button type="button" class="flex items-center gap-[6px] h-[28px] text-[12px] font-medium text-[#484d61] hover:text-[#03102f] transition-colors duration-150" @click="$router.push('/bills')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Back
          </button>
          <div class="flex gap-[8px] items-center">
            <h1 class="text-[18px] font-medium text-[#03102f] leading-[1.35] whitespace-nowrap">{{ bill.invoice }}</h1>
            <span
              class="inline-flex items-center justify-center min-h-[24px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium whitespace-nowrap"
              :style="{ background: statusStyle(bill.status).bg, color: statusStyle(bill.status).text }"
            >{{ bill.status }}</span>
          </div>
        </div>

        <!-- Amount -->
        <div class="flex flex-col gap-px items-end p-[8px] shrink-0">
          <span class="text-[10px] font-medium uppercase tracking-[0.3px] text-[#9295a5]" style="line-height: 18px;">Amount</span>
          <span class="text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ headerAmount }}</span>
        </div>

        <!-- Approve & Fund (only while the bill needs approval) -->
        <button
          v-if="bill.status === 'Need approval'"
          type="button"
          class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] shrink-0"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
        >
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Approve &amp; Fund</span>
        </button>
        <!-- Add funds (approved bill waiting on funds) -->
        <button
          v-else-if="fundingState === 'awaiting'"
          type="button"
          class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] shrink-0"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="#fff" stroke-width="1.3" /><circle cx="8" cy="8" r="3" stroke="#fff" stroke-width="1.3" /></svg>
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Add funds</span>
        </button>

        <!-- Actions dropdown -->
        <div class="relative shrink-0" @click.stop>
          <button
            type="button"
            class="flex items-center justify-center size-[36px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
            aria-label="Bill actions"
            @click="menuOpen = !menuOpen"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3.5" r="1.2" fill="#61667c" /><circle cx="8" cy="8" r="1.2" fill="#61667c" /><circle cx="8" cy="12.5" r="1.2" fill="#61667c" /></svg>
          </button>
          <Transition name="menu-pop">
            <div
              v-if="menuOpen"
              class="absolute right-0 top-[44px] z-30 w-[162px] rounded-[8px] border border-[#e5e6ea] bg-white py-[4px]"
              style="box-shadow: 0px 8px 24px rgba(3,16,47,0.12), 0px 1px 3px rgba(0,0,0,0.06);"
            >
              <button v-for="item in menuItems" :key="item.label" type="button" class="flex items-center gap-[8px] w-full px-[12px] py-[7px] text-left hover:bg-[#f6f7f9] transition-colors duration-100" @click="onMenuItem(item)">
                <span class="flex items-center justify-center size-[16px] shrink-0" :class="item.danger ? 'text-[#d92d20]' : 'text-[#61667c]'" v-html="item.icon" />
                <span class="text-[13px] leading-[1.5]" :class="item.danger ? 'text-[#d92d20]' : 'text-[#03102f]'">{{ item.label }}</span>
              </button>
              <div class="h-px my-[4px] bg-[#f2f2f4]" />
              <button type="button" class="flex items-center gap-[8px] w-full px-[12px] py-[7px] text-left hover:bg-[#fdecec] transition-colors duration-100" @click="menuOpen = false">
                <span class="flex items-center justify-center size-[16px] shrink-0 text-[#d92d20]"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" /></svg></span>
                <span class="text-[13px] leading-[1.5] text-[#d92d20]">Cancel</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Details grid (scrolls horizontally below its natural width, like the bills table) -->
      <div class="flex flex-col items-start px-[24px] pb-[12px] w-full shrink-0 overflow-x-auto">
        <div class="flex items-stretch w-full min-w-[880px] rounded-[8px] border border-[#e5e6ea] bg-[#fcfcfd]">
          <!-- Left: detail cells -->
          <div class="flex flex-1 flex-col min-w-px">
            <div class="flex items-stretch w-full border-b border-[#e5e6ea]">
              <div class="flex flex-1 flex-col gap-[2px] items-start min-w-px p-[12px]">
                <span class="text-[14px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Invoice date</span>
                <span class="text-[14px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">Aug 1, 2026</span>
              </div>
              <div class="flex flex-1 flex-col gap-[2px] items-start min-w-px p-[12px] border-l border-[#e5e6ea]">
                <span class="text-[14px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Due date</span>
                <span class="flex items-center gap-[6px]">
                  <span class="text-[14px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ formatDate(bill.due) }}</span>
                  <span v-if="bill.status === 'Overdue'" class="flex items-center gap-[4px]">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2.5L14.5 13h-13L8 2.5z" stroke="#bd8400" stroke-width="1.3" stroke-linejoin="round" /><path d="M8 6.8v2.8" stroke="#bd8400" stroke-width="1.3" stroke-linecap="round" /><circle cx="8" cy="11.6" r="0.7" fill="#bd8400" /></svg>
                    <span class="text-[14px] font-medium text-[#bd8400] leading-[1.4] whitespace-nowrap">Overdue</span>
                  </span>
                </span>
              </div>
              <!-- Funding: collected shows the timestamp; anything else shows the funding chip -->
              <div class="flex flex-1 flex-col gap-[2px] items-start min-w-px p-[12px] border-l border-[#e5e6ea]">
                <template v-if="fundingState === 'collected'">
                  <span class="text-[14px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Funding collected on</span>
                  <span class="text-[14px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">Aug 08, 2026 at 07:01 AM</span>
                </template>
                <template v-else>
                  <span class="text-[14px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Funding</span>
                  <span
                    class="inline-flex items-center px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium whitespace-nowrap border bg-white"
                    :style="{ borderColor: fundingStyle(bill.funding).border, color: fundingStyle(bill.funding).text }"
                  >{{ bill.funding }}</span>
                </template>
              </div>
            </div>
            <div class="flex items-stretch w-full flex-1">
              <div class="flex flex-col gap-[2px] items-start w-[278px] shrink-0 p-[12px]">
                <span class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Category</span>
                <span class="text-[14px] text-[#03102f] leading-[1.5]">Fashion</span>
              </div>
              <div class="flex flex-1 flex-col gap-[2px] items-start min-w-px p-[12px] border-l border-[#e5e6ea]">
                <span class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Descriptions</span>
                <span class="text-[14px] text-[#03102f] leading-[1.5]">For cleaning shoes payment</span>
              </div>
            </div>
          </div>
          <!-- Right: vendor card — fallback when no vendor is attached -->
          <div v-if="fundingState === 'no-vendor'" class="flex flex-col items-center justify-center gap-[8px] w-[250px] shrink-0 border-l border-[#e5e6ea] bg-[#f5f6f9] rounded-r-[8px] p-[12px]">
            <span class="flex items-center justify-center size-[32px] rounded-[8px] bg-[#09204a]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="5" r="2.5" stroke="#fff" stroke-width="1.3" /><path d="M2 13.5c0-2.2 2-3.5 4.5-3.5 1 0 1.9.2 2.6.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round" /><path d="M12.5 9.5v4M10.5 11.5h4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" /></svg>
            </span>
            <div class="flex flex-col items-center gap-[2px]">
              <span class="text-[14px] font-medium text-[#03102f] leading-[1.5]">No vendor found</span>
              <span class="text-[12px] text-[#61667c] leading-[1.5] text-center">Add vendor to continue this transaction</span>
            </div>
            <button
              type="button"
              class="flex items-center justify-center h-[28px] w-full rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              @click="$router.push('/vendors')"
            >
              <span class="text-[13px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Add vendor</span>
            </button>
          </div>
          <div v-else class="flex flex-col w-[250px] shrink-0 border-l border-[#e5e6ea] bg-[#f5f6f9] rounded-r-[8px]">
            <div class="flex flex-col gap-[8px] p-[12px] w-full">
              <div class="flex gap-[8px] items-center w-full">
                <span class="flex items-center justify-center size-[32px] rounded-[8px] bg-[#09204a] shrink-0">
                  <span class="text-[14px] font-bold text-white tracking-[0.15px]" style="text-shadow: 0px 0.5px 0.5px rgba(0,0,0,0.06);">{{ vendorInitial }}</span>
                </span>
                <div class="flex flex-1 flex-col min-w-px">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] truncate">{{ bill.recipient }}</span>
                  <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Tax ID: 1291283493910</span>
                </div>
              </div>
              <div class="flex flex-col gap-[8px] pt-[12px] w-full">
                <div class="flex gap-[16px] items-start w-full">
                  <span class="w-[80px] shrink-0 text-[12px] text-[#61667c] leading-[1.5]">Account #</span>
                  <span class="flex-1 min-w-px text-[12px] text-[#03102f] leading-[1.5]">621788432</span>
                </div>
                <div class="flex gap-[16px] items-start w-full">
                  <span class="w-[80px] shrink-0 text-[12px] text-[#61667c] leading-[1.5]">Bank</span>
                  <span class="flex-1 min-w-px text-[12px] text-[#03102f] leading-[1.5]">HSBC UK BANK PLC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content: timeline + payment breakdown -->
      <div class="flex flex-col gap-[24px] items-start px-[24px] py-[12px] w-full">

        <!-- Timeline -->
        <div class="flex flex-col gap-[8px] items-start w-full">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Timeline</p>
          <div class="flex flex-col w-full rounded-[8px] border border-[#e5e6ea] bg-white p-[12px]">
            <div v-for="(t, i) in timeline" :key="i" class="relative flex gap-[4px] items-start py-[8px] w-full">
              <!-- connector to the next item -->
              <span v-if="i < timeline.length - 1" class="absolute left-[11px] top-[23px] bottom-[-22px] w-px bg-[#e5e6ea]" />
              <!-- dot -->
              <span class="relative flex items-center justify-center size-[23px] shrink-0">
                <span
                  v-if="i === 0"
                  class="block size-[10px] rounded-full"
                  style="background: #2465de; box-shadow: 0 0 0 3px #dbe7fe;"
                />
                <span v-else class="block size-[9px] rounded-full bg-[#cbcdd4]" />
              </span>
              <!-- content -->
              <div class="flex flex-1 flex-col gap-[8px] min-w-px" :class="i > 0 ? 'opacity-65' : ''">
                <div class="flex gap-[4px] items-center w-full">
                  <div class="flex flex-1 items-center gap-[8px] min-w-px min-h-[24px]">
                    <!-- soft status chip / outline funding chip on the latest event -->
                    <span
                      v-if="t.chip"
                      class="inline-flex items-center justify-center min-h-[24px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium whitespace-nowrap shrink-0"
                      :style="{ background: statusStyle(t.chip).bg, color: statusStyle(t.chip).text }"
                    >{{ t.chip }}</span>
                    <span
                      v-else-if="t.chipOutline"
                      class="inline-flex items-center min-h-[24px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium whitespace-nowrap border bg-white shrink-0"
                      :style="{ borderColor: fundingStyle(t.chipOutline).border, color: fundingStyle(t.chipOutline).text }"
                    >{{ t.chipOutline }}</span>
                    <span class="flex-1 min-w-px text-[12px] leading-[1.5] truncate" :class="i === 0 ? 'text-[#03102f]' : 'text-[#61667c]'">
                      <a v-if="t.linkText" href="#" class="text-[#2465de] underline" @click.prevent>{{ t.linkText }}</a><template v-if="t.linkText">&nbsp;</template>{{ t.text }}
                    </span>
                  </div>
                  <span class="flex items-center h-[24px] text-[12px] leading-[1.5] whitespace-nowrap shrink-0" :class="i === 0 ? 'text-[#03102f]' : 'text-[#61667c]'">{{ t.date }}</span>
                </div>
                <!-- no-vendor warning banner -->
                <div v-if="t.banner" class="flex items-center gap-[8px] self-start rounded-[8px] bg-[#fff4e5] px-[12px] py-[8px]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="shrink-0"><path d="M8 2.5L14.5 13h-13L8 2.5z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round" /><path d="M8 6.5v3" stroke="#fff" stroke-width="1.3" stroke-linecap="round" /><circle cx="8" cy="11.3" r="0.7" fill="#fff" /></svg>
                  <span class="text-[12px] text-[#03102f] leading-[1.5]">No vendor found. <a href="#" class="text-[#2465de] underline" @click.prevent="$router.push('/vendors')">Add vendor</a> to continue this transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment breakdown -->
        <div class="flex flex-col gap-[12px] items-start w-full pb-[12px]">
          <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Payment breakdown</p>
          <div class="flex flex-col gap-[8px] w-full rounded-[8px] border border-[#e5e6ea] bg-white p-[16px]">
            <div class="flex items-center justify-between w-full">
              <span class="text-[14px] text-[#03102f] leading-[1.5]">Recipient gets</span>
              <span class="text-[14px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ recipientGets }}</span>
            </div>
            <div class="flex items-center justify-between w-full">
              <span class="flex items-center gap-[4px]">
                <span class="text-[14px] text-[#03102f] leading-[1.5]">Amount to pay — <span style="font-family: 'Reddit Mono', ui-monospace, monospace;">(USD 1 = SGD {{ FX_RATE }})</span></span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="#61667c" stroke-width="1.2" /><path d="M8 7.4v3.2" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" /><circle cx="8" cy="5.2" r="0.8" fill="#61667c" /></svg>
              </span>
              <span class="text-[14px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ amountToPayText }}</span>
            </div>
            <div class="flex items-center justify-between w-full">
              <button type="button" class="flex items-center gap-[4px]" @click="feesOpen = !feesOpen">
                <span class="text-[14px] text-[#03102f] leading-[1.5]">Fees</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="transition-transform duration-150" :class="feesOpen ? '' : 'rotate-180'"><path d="M4 10l4-4 4 4" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
              <span class="text-[14px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ feesText }}</span>
            </div>
            <template v-if="feesOpen">
              <div v-for="fee in feeRows" :key="fee.label" class="flex items-center justify-between w-full pl-[8px]">
                <span class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ fee.label }}</span>
                <span class="text-[13px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fee.value }}</span>
              </div>
            </template>
            <div class="h-px w-full my-[8px] border-t border-dashed border-[#e5e6ea]" />
            <div class="flex items-center justify-between w-full">
              <span class="text-[14px] text-[#03102f] leading-[1.5]">Net amount</span>
              <span class="text-[14px] text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 600;">{{ netAmountText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Invoice viewer — absolute overlay stacked over the page, slides in from the edge -->
    <Transition name="invoice-slide">
      <div
        v-if="invoiceOpen"
        class="absolute inset-y-0 right-0 z-20 flex flex-col w-[480px] max-w-full h-full border-l border-[#e5e6ea] bg-[#f0f1f3]"
        style="box-shadow: -12px 0 32px rgba(3,16,47,0.10);"
      >
        <!-- Toolbar -->
        <div class="flex items-center h-[44px] px-[12px] bg-white border-b border-[#e5e6ea] shrink-0">
          <div class="flex flex-1 items-center gap-[4px]">
            <button type="button" class="flex items-center justify-center size-[28px] rounded-[6px] hover:bg-[#f0f1f5] transition-colors duration-100" aria-label="Download invoice">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h5l3 3v9H4V2z" stroke="#03102f" stroke-width="1.2" stroke-linejoin="round" /><path d="M9 2v3h3" stroke="#03102f" stroke-width="1.2" stroke-linejoin="round" /><path d="M8 7v4M6.3 9.5L8 11.2 9.7 9.5" stroke="#03102f" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
            <button type="button" class="flex items-center justify-center size-[28px] rounded-[6px] hover:bg-[#f0f1f5] transition-colors duration-100" aria-label="Fit to width">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#03102f" stroke-width="1.2" /><path d="M10.5 10.5L14 14" stroke="#03102f" stroke-width="1.2" stroke-linecap="round" /><path d="M5.2 7h3.6M7 5.2v3.6" stroke="#03102f" stroke-width="1.2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="flex items-center gap-[8px]">
            <button type="button" class="flex items-center justify-center size-[24px] rounded-full hover:bg-[#f0f1f5] transition-colors duration-100" aria-label="Zoom out" @click="invoiceZoom = Math.max(50, invoiceZoom - 25)">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="#03102f" stroke-width="1.2" /><path d="M5.5 8h5" stroke="#03102f" stroke-width="1.2" stroke-linecap="round" /></svg>
            </button>
            <span class="text-[13px] text-[#03102f] leading-[1.5] text-center min-w-[42px]">{{ invoiceZoom }}%</span>
            <button type="button" class="flex items-center justify-center size-[24px] rounded-full hover:bg-[#f0f1f5] transition-colors duration-100" aria-label="Zoom in" @click="invoiceZoom = Math.min(200, invoiceZoom + 25)">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="#03102f" stroke-width="1.2" /><path d="M5.5 8h5M8 5.5v5" stroke="#03102f" stroke-width="1.2" stroke-linecap="round" /></svg>
            </button>
          </div>
          <div class="flex flex-1 items-center justify-end">
            <button type="button" class="flex items-center gap-[6px] px-[8px] h-[28px] rounded-[6px] hover:bg-[#f0f1f5] transition-colors duration-100" @click="invoiceOpen = false">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#03102f" stroke-width="1.3" stroke-linecap="round" /></svg>
              <span class="text-[13px] text-[#03102f] leading-[1.5]">Close</span>
            </button>
          </div>
        </div>
        <!-- Document -->
        <div class="flex-1 overflow-auto p-[24px]">
          <div class="flex justify-center" :style="{ transform: `scale(${invoiceZoom / 100})`, transformOrigin: 'top center', transition: 'transform 150ms ease' }">
            <img :src="invoiceImg" :alt="`Invoice ${bill.invoice}`" class="block w-[380px] max-w-none rounded-[4px]" style="box-shadow: 0px 3px 22px rgba(38,42,50,0.12);" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { bills, getBill, statusStyle, fundingStyle, parseAmount, formatSGD } from '../../composables/useBills.js'
import invoiceImg from '../../assets/images/billreview/invoice.png'

const route = useRoute()
const menuOpen = ref(false)
const feesOpen = ref(true)
const invoiceOpen = ref(false)
const invoiceZoom = ref(100)

function onMenuItem(item) {
  menuOpen.value = false
  if (item.label === 'Show invoice') invoiceOpen.value = true
}

// Bill selected from the list (falls back to the first bill if opened directly)
const bill = computed(() => getBill(route.query.id) || bills[0])
const vendorInitial = computed(() => bill.value.recipient.charAt(0).toUpperCase())

// Funding state drives the third detail cell, the vendor card, the header CTA and the timeline:
// 'no-vendor' (nothing funded, vendor missing) · 'awaiting' · 'collected' · 'other' (e.g. returned)
const fundingState = computed(() => {
  if (bill.value.funding === 'Not funded') return 'no-vendor'
  if (bill.value.funding === 'Awaiting funds') return 'awaiting'
  if (bill.value.funding === 'Collected') return 'collected'
  return 'other'
})

// The vendor invoices in USD; you pay the SGD amount shown in the list
const FX_RATE = 1.34
const PAYNOW_FEE = 3.5
const PAYOUT_FEE = 2.5

const amountToPay = computed(() => parseAmount(bill.value.amount))
const usdAmount = computed(() => amountToPay.value / FX_RATE)
const fees = PAYNOW_FEE + PAYOUT_FEE
const netAmount = computed(() => amountToPay.value + fees)

function formatUSD(n) {
  return 'USD ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
const headerAmount = computed(() => formatUSD(usdAmount.value))
const recipientGets = computed(() => formatUSD(usdAmount.value))
const amountToPayText = computed(() => formatSGD(amountToPay.value))
const feesText = formatSGD(fees)
const netAmountText = computed(() => formatSGD(netAmount.value))
const feeRows = [
  { label: 'Paynow fee', value: formatSGD(PAYNOW_FEE) },
  { label: 'Payout fee', value: formatSGD(PAYOUT_FEE) },
]

// "2025-09-10" → "Sep 10, 2025" (dates not in the data pass through as-is)
function formatDate(d) {
  const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return d
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

// Latest event mirrors the bill's status; older events are shared sample history
const statusEvent = computed(() => {
  const map = {
    Completed: `Money has been transferred to ${bill.value.recipient}  HSBC - 621788432`,
    Failed: `Transfer to ${bill.value.recipient} failed — funds returned to your HitPay balance`,
    Rejected: 'Bill rejected by Olivia Winston',
    Cancel: 'Bill cancelled by Olivia Winston',
    'Need approval': 'Waiting for approval from Olivia Winston',
    Processing: `Payment is being processed to ${bill.value.recipient}`,
    Pending: 'Waiting for funds to be collected',
    Draft: 'Bill saved as draft by Cherry',
  }
  return map[bill.value.status] || 'Bill updated'
})

const timeline = computed(() => {
  // Vendor missing: the bill can't progress — only the creation event plus a warning
  if (fundingState.value === 'no-vendor') {
    return [{ text: 'Bill created by Cherry', date: 'Aug 1, 2026 at 07:09', banner: true }]
  }

  const history = [
    { text: 'Bill submitted for approval by Steph Tan', date: 'Aug 1, 2026 at 10:09' },
    { text: 'Approval step 1 of 1 skipped — submitter is an approver', date: 'Aug 1, 2026 at 10:09' },
    { text: 'Bill edited by Thaisa', date: 'Aug 1, 2026 at 10:09' },
    { text: 'Bill created by Cherry', date: 'Aug 1, 2026 at 07:09' },
  ]
  // Funds were only ever collected outside the awaiting state
  if (fundingState.value !== 'awaiting') {
    history.unshift({ text: 'Fund collected. Transferred by Thaisa', date: 'Aug 1, 2026 at 10:09' })
  }

  // Approval outranks funding: show the approval wait as the latest event
  if (bill.value.status === 'Need approval') {
    return [{ chip: bill.value.status, text: statusEvent.value, date: 'Aug 2, 2026 at 10:09' }, ...history]
  }
  // Awaiting funds: outline chip + transfer-funds call to action
  if (fundingState.value === 'awaiting') {
    return [
      { chipOutline: 'Awaiting funds', linkText: 'Transfer your funds', text: 'to continue paying the bill', date: 'Aug 1, 2026 at 10:09' },
      ...history,
    ]
  }
  return [{ chip: bill.value.status, text: statusEvent.value, date: 'Aug 2, 2026 at 10:09' }, ...history]
})

// Actions dropdown (design: Edit / Reschedule / Approve / Recall / Show invoice / Reject · Cancel)
const menuItems = [
  { label: 'Edit', icon: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M9.5 3.5l3 3-6 6H3.5v-3l6-6z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>' },
  { label: 'Reschedule', icon: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M2.5 6.5h11M5.5 2v2.5M10.5 2v2.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' },
  { label: 'Approve', icon: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M5.5 8l1.8 1.8L10.7 6.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  { label: 'Recall', icon: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L3 7l3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7h6.5a3.5 3.5 0 010 7H7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
  { label: 'Show invoice', icon: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 2h5l3 3v9H4V2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 2v3h3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' },
  { label: 'Reject', danger: true, icon: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' },
]
</script>

<style scoped>
/* Dropdown pop — fast in with a small rise, faster fade out (see /motion) */
.menu-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.menu-pop-leave-active { transition: opacity 100ms ease-in; }
.menu-pop-enter-from { opacity: 0; transform: translateY(-4px); }
.menu-pop-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .menu-pop-enter-active, .menu-pop-leave-active { transition: none; }
  .menu-pop-enter-from { transform: none; }
}

/* Invoice viewer overlay — slides in over the page on the decelerate curve, faster out */
.invoice-slide-enter-active { transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1); }
.invoice-slide-leave-active { transition: transform 200ms ease-in; }
.invoice-slide-enter-from,
.invoice-slide-leave-to { transform: translateX(100%); }

@media (prefers-reduced-motion: reduce) {
  .invoice-slide-enter-active, .invoice-slide-leave-active { transition: none; }
}
</style>
