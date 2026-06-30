<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-hidden">

    <!-- Header: title + stepper -->
    <div class="border-b border-[#e5e6ea] w-full shrink-0">
      <div class="relative flex items-center h-[74px] px-[24px] py-[12px] w-full">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Bill Pay</p>
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-[8px] items-start">
          <div v-for="step in steps" :key="step.label" class="flex flex-col gap-[8px] items-center w-[100px]">
            <div class="h-[4px] w-full rounded-[16px] bg-[#2465de]" :class="step.state === 'upcoming' ? 'opacity-[0.12]' : ''" />
            <p
              class="text-[12px] leading-[1.5] whitespace-nowrap"
              :class="step.state === 'current' ? 'font-medium text-[#03102f]' : 'font-normal text-[#9295a5]'"
            >{{ step.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Body: two panes -->
    <div class="bg-[#fcfcfd] flex flex-1 items-start justify-center w-full min-h-0">

      <!-- Left: invoice preview + zoom -->
      <div class="flex flex-1 flex-col gap-[8px] h-full items-center min-w-px px-[24px] py-[8px]">
        <div class="flex-1 min-h-0 overflow-hidden relative w-full">
          <div
            class="absolute -translate-x-1/2 h-[656px] left-1/2 top-0 w-[459px]"
            style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
          >
            <img :src="invoice" alt="Invoice INV-0128HYY" class="block size-full object-cover" />
          </div>
        </div>

        <!-- Zoom control -->
        <div class="shrink-0">
          <div
            class="bg-white border border-[#e5e6ea] flex gap-[8px] h-[36px] items-center overflow-hidden px-[4px] rounded-[8px]"
            style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
          >
            <button
              class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              @click="zoom = Math.max(25, zoom - 25)"
            >
              <img :src="zoomOut" alt="zoom out" class="size-[16px]" />
            </button>
            <span class="text-[14px] text-[#03102f] leading-[1.5] text-center min-w-[36px]">{{ zoom }}%</span>
            <button
              class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              @click="zoom = Math.min(200, zoom + 25)"
            >
              <img :src="zoomIn" alt="zoom in" class="size-[16px]" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right: extraction -->
      <div class="border-l border-[#e5e6ea] flex flex-1 h-full min-w-px overflow-hidden">

        <!-- Scanning (first 7s) -->
        <div v-if="stage === 'scanning'" class="flex flex-col gap-[16px] items-start w-full pl-[48px] pr-[64px] py-[24px]">
        <div class="skeleton h-[20px] w-[121.714px]" />

        <div class="flex flex-col gap-[12px] items-start w-full">
          <div class="skeleton h-[16px] w-[244px]" />

          <!-- Customer card -->
          <div class="bg-white border border-[#e5e6ea] flex flex-col gap-[8px] items-start justify-center p-[12px] rounded-[8px] w-full">
            <div class="flex gap-[8px] items-center w-[166px]">
              <div class="skeleton size-[32px] rounded-full shrink-0" />
              <div class="flex flex-1 flex-col gap-[4px] items-start min-w-px">
                <div class="skeleton h-[18px] w-[96px]" />
                <div class="skeleton h-[12px] w-[121.714px]" />
              </div>
            </div>
            <div class="flex flex-col gap-[12px] items-start pt-[12px] w-full">
              <div class="flex gap-[16px] items-start w-full">
                <div class="skeleton h-[12px] w-[63px]" />
                <div class="skeleton h-[12px] w-[126px]" />
              </div>
              <div class="flex gap-[16px] items-start w-full">
                <div class="skeleton h-[12px] w-[63px]" />
                <div class="skeleton h-[12px] w-[170px]" />
              </div>
            </div>
          </div>

          <div class="skeleton h-[16px] w-[139px]" />
          <div class="skeleton h-[16px] w-[233px]" />
        </div>

          <div class="flex items-center justify-center py-[16px] w-full">
            <p class="flex-1 font-normal text-[14px] text-[#9295a5] text-center leading-[1.5] min-w-px">Scanning your document and extracting the payment details…</p>
          </div>
        </div>

        <!-- Vendors found (after scan) -->
        <div v-else-if="stage === 'vendors'" class="flex flex-col gap-[24px] items-start w-full overflow-y-auto px-[48px] pt-[24px] pb-[88px]">
          <div class="flex flex-col gap-[4px] items-start w-full">
            <p class="font-medium text-[16px] text-[#03102f] leading-[1.4]">We found the vendors</p>
            <p class="font-normal text-[12px] text-[#61667c] leading-[1.5] w-full">We found two possible vendors matching to your invoice. Please select the correct one.</p>
          </div>

          <div class="flex flex-col gap-[20px] items-center w-full">
            <div class="flex flex-col gap-[8px] items-start w-full">
              <button
                v-for="v in vendors"
                :key="v.id"
                type="button"
                class="flex gap-[12px] items-center overflow-hidden px-[12px] py-[8px] rounded-[8px] w-full border text-left cursor-pointer transition-shadow duration-150"
                :class="selected === v.id ? 'border-[#2465de]' : 'border-[#e5e6ea] hover:shadow-[0px_3px_11px_0px_rgba(38,42,50,0.09)]'"
                :style="selected === v.id ? 'box-shadow: 0px 0px 0px 3px #b3cdfe;' : ''"
                @click="selected = v.id"
              >
                <span
                  class="flex items-center justify-center size-[16px] rounded-full border shrink-0"
                  :class="selected === v.id ? 'bg-[#2465de] border-[#2465de]' : 'bg-white border-[#e5e6ea]'"
                  style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                >
                  <span v-if="selected === v.id" class="size-[6px] rounded-full bg-white" />
                </span>
                <span class="flex items-center justify-center size-[32px] rounded-[8px] bg-[#002771] shrink-0">
                  <span class="font-bold text-[14px] text-white" style="letter-spacing: 0.15px; text-shadow: 0px 0.5px 0.5px rgba(0,0,0,0.06);">{{ v.initial }}</span>
                </span>
                <span class="flex flex-1 flex-col items-start min-w-px">
                  <span class="font-medium text-[14px] text-[#03102f] leading-[1.5]">{{ v.name }}</span>
                  <span class="font-medium text-[12px] text-[#61667c] leading-[1.5]">{{ v.meta }}</span>
                </span>
              </button>
            </div>

            <div class="border-t border-[#e5e6ea] flex items-center justify-between pt-[16px] w-full">
              <button type="button" class="flex gap-[6px] h-[28px] items-center justify-center p-[8px] rounded-[8px] hover:bg-[#f0f1f5] transition-colors duration-150">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="#61667c" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                <span class="font-medium text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap">None of those are correct</span>
              </button>
              <button
                type="button"
                class="flex gap-[6px] h-[28px] items-center justify-center min-w-[36px] overflow-hidden p-[8px] rounded-[8px] border border-[#2465de]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="confirmVendor"
              >
                <span class="font-medium text-[12px] text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Confirm selected vendor</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Bill details form (after confirming the vendor) -->
        <div v-else class="form-section bg-white flex flex-col h-full w-full">
          <Transition :name="vswapName" mode="out-in">
          <div v-if="!searching" key="form" class="flex flex-1 flex-col min-h-0">
          <div class="flex-1 flex flex-col gap-[16px] items-start overflow-y-auto px-[48px] pt-[24px] pb-[24px]">
            <p class="font-medium text-[16px] text-[#03102f] leading-[1.4]">Bill details</p>

            <div class="flex flex-col gap-[24px] items-center w-full">

              <!-- Paying to + amount -->
              <div class="flex flex-col gap-[8px] items-start w-full">
                <div class="flex flex-col gap-[4px] items-start w-full">
                  <p class="font-medium text-[12px] text-[#61667c] leading-[1.5]">Paying to</p>
                  <div class="flex flex-col items-start w-full">
                    <!-- vendor row -->
                    <div class="relative z-[2] -mb-[8px] bg-white border border-[#e5e6ea] rounded-[8px] flex gap-[8px] items-center px-[12px] py-[8px] w-full">
                      <span class="flex items-center justify-center size-[32px] rounded-[8px] bg-[#002771] shrink-0">
                        <span class="font-bold text-[14px] text-white" style="letter-spacing: 0.15px; text-shadow: 0px 0.5px 0.5px rgba(0,0,0,0.06);">{{ payingInitial }}</span>
                      </span>
                      <div class="flex flex-1 flex-col items-start min-w-px">
                        <span class="font-medium text-[14px] text-[#03102f] leading-[1.5]">{{ payingName }}</span>
                        <span class="font-medium text-[12px] text-[#61667c] leading-[1.5]">Tax ID: 1291283493910</span>
                      </div>
                      <button
                        type="button"
                        class="flex h-[28px] items-center justify-center px-[8px] rounded-[8px] border border-[#f2f2f4] shrink-0"
                        style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                        @click="changeVendor"
                      >
                        <span class="font-medium text-[12px] text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Change</span>
                      </button>
                    </div>
                    <!-- no payment method warning (vendor with no SGD account) -->
                    <div v-if="selected === 'orion'" class="relative z-[1] bg-[#fcfcfd] border border-[#e5e6ea] rounded-bl-[8px] rounded-br-[8px] flex items-center justify-center pt-[16px] pb-[8px] px-[12px] w-full">
                      <div class="flex flex-col gap-[12px] items-center py-[12px] w-[233px]">
                        <div class="flex items-center justify-center p-[8px] rounded-full bg-[#f4b840]/10">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4.5L21 19.5H3L12 4.5Z" stroke="#f4b840" stroke-width="1.8" stroke-linejoin="round" />
                            <path d="M12 10V13.5M12 16.2V16.6" stroke="#f4b840" stroke-width="1.8" stroke-linecap="round" />
                          </svg>
                        </div>
                        <div class="flex flex-col gap-[4px] items-center text-center w-full">
                          <p class="font-medium text-[13px] text-[#03102f] leading-[1.5] w-full">No SGD payment method available</p>
                          <p class="font-normal text-[12px] text-[#61667c] leading-[1.5] w-full">This vendor has no bank account in SGD.</p>
                        </div>
                        <button
                          type="button"
                          class="flex h-[28px] items-center justify-center min-w-[36px] overflow-hidden px-[8px] rounded-[8px] border border-[#2465de]"
                          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                          @click="payPanelOpen = true"
                        >
                          <span class="font-medium text-[12px] text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Add SGD Payment method</span>
                        </button>
                      </div>
                    </div>

                    <!-- existing SGD payment methods (vendor has payout accounts) -->
                    <div v-else class="relative z-[1] bg-[#fcfcfd] border border-[#e5e6ea] rounded-bl-[8px] rounded-br-[8px] flex flex-col gap-[12px] items-start justify-center pt-[16px] pb-[8px] w-full">
                      <template v-for="(m, mi) in payMethods" :key="m.id">
                        <div v-if="mi > 0" class="h-px w-full bg-[#e5e6ea]" />
                        <button type="button" class="flex gap-[12px] items-center px-[12px] w-full text-left" @click="payMethod = m.id">
                          <span
                            class="flex items-center justify-center size-[16px] rounded-full border shrink-0"
                            :class="payMethod === m.id ? 'bg-[#2465de] border-[#2465de]' : 'bg-white border-[#e5e6ea]'"
                            style="box-shadow: 0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09);"
                          >
                            <span v-if="payMethod === m.id" class="size-[6px] rounded-full bg-white" />
                          </span>
                          <span class="flex flex-1 flex-col items-start min-w-px">
                            <span class="flex gap-[4px] items-center">
                              <span class="font-medium text-[14px] text-[#03102f] leading-[1.5]">{{ m.name }}</span>
                              <span class="flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-[#f5f6f9]">
                                <span class="font-medium text-[12px] text-[#002771] leading-[1.5]">SGD</span>
                              </span>
                            </span>
                            <span class="font-medium text-[12px] text-[#61667c] leading-[1.5]">Singapore Power LLC / **** 1234</span>
                          </span>
                          <span class="flex flex-col gap-[2px] items-end text-right shrink-0">
                            <span class="text-[12px] text-[#2bc37d] leading-[1.5] whitespace-nowrap">{{ m.days }}</span>
                            <span class="text-[12px] text-[#03102f] leading-[1.5] whitespace-nowrap">Fee: <span style="font-family: 'JetBrains Mono', ui-monospace, monospace;">{{ m.fee }}</span></span>
                          </span>
                        </button>
                      </template>
                    </div>
                  </div>

                  <!-- New payment details (vendor with existing methods) -->
                  <div v-if="selected === 'sp'" class="flex justify-center w-full pt-[4px]">
                    <button type="button" class="flex gap-[6px] h-[28px] items-center justify-center px-[8px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f1f5]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3.5V12.5M3.5 8H12.5" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
                      <span class="font-medium text-[12px] text-[#61667c] leading-[1.5]">New payment details</span>
                    </button>
                  </div>

                  <!-- amount -->
                  <div class="bg-[#03102f] flex gap-[8px] items-center px-[12px] py-[8px] rounded-[8px] w-full">
                    <span class="flex-1 font-medium text-[12px] text-[#cbcdd4] leading-[1.5]">Amount</span>
                    <div class="flex gap-[8px] items-center">
                      <div class="flex gap-[2px] items-center">
                        <span class="font-medium text-[12px] text-[#cbcdd4] leading-[1.5]">SGD</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 6.5L8 10.5L12 6.5" stroke="#cbcdd4" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      <span class="text-[24px] text-white leading-[1.35]" style="font-family: 'JetBrains Mono', ui-monospace, monospace;">300.00</span>
                    </div>
                  </div>
                </div>

                <!-- short divider -->
                <div class="h-px w-[120px] bg-[#e5e6ea]" />

                <!-- invoice details -->
                <div class="flex flex-col gap-[12px] items-start w-full">
                  <p class="font-medium text-[14px] text-[#03102f] leading-[1.5]">Invoice details</p>
                  <div class="border border-[#e5e6ea] rounded-[8px] overflow-hidden w-full flex flex-col">
                    <!-- invoice number -->
                    <label class="inv-row flex items-center border-b border-[#e5e6ea] w-full">
                      <span class="flex-1 px-[12px] py-[8px] font-medium text-[12px] text-[#61667c] leading-[1.5]">Invoice number</span>
                      <span class="flex-1 px-[12px] py-[4px] min-w-px flex">
                        <input v-model="invForm.number" type="text" class="inv-input" />
                      </span>
                    </label>
                    <!-- invoice date | due date -->
                    <div class="flex border-b border-[#e5e6ea] w-full">
                      <label class="inv-row flex flex-1 items-center min-w-px">
                        <span class="shrink-0 whitespace-nowrap pl-[12px] pr-[4px] py-[8px] font-medium text-[12px] text-[#61667c] leading-[1.5]">Invoice date</span>
                        <span class="flex flex-1 items-center gap-[4px] pl-[4px] pr-[10px] py-[4px] min-w-px">
                          <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="#61667c" stroke-width="1.2" /><path d="M2.5 6.5H13.5M5.5 2.5V4.5M10.5 2.5V4.5" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" /></svg>
                          <input v-model="invForm.invoiceDate" type="text" class="inv-input" />
                        </span>
                      </label>
                      <div class="w-px self-stretch bg-[#e5e6ea]" />
                      <label class="inv-row flex flex-1 items-center min-w-px">
                        <span class="shrink-0 whitespace-nowrap pl-[12px] pr-[4px] py-[8px] font-medium text-[12px] text-[#61667c] leading-[1.5]">Due date</span>
                        <span class="flex flex-1 items-center gap-[4px] pl-[4px] pr-[10px] py-[4px] min-w-px">
                          <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="#61667c" stroke-width="1.2" /><path d="M2.5 6.5H13.5M5.5 2.5V4.5M10.5 2.5V4.5" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" /></svg>
                          <input v-model="invForm.dueDate" type="text" class="inv-input" />
                        </span>
                      </label>
                    </div>
                    <!-- category -->
                    <label class="inv-row flex items-center border-b border-[#e5e6ea] w-full">
                      <span class="flex-1 px-[12px] py-[8px] font-medium text-[12px] text-[#61667c] leading-[1.5]">Category</span>
                      <span class="flex-1 px-[12px] py-[4px] min-w-px flex">
                        <input v-model="invForm.category" type="text" placeholder="Select category" class="inv-input" />
                      </span>
                    </label>
                    <!-- description -->
                    <label class="inv-row flex flex-col items-start border-b border-[#e5e6ea] w-full pb-[4px]">
                      <span class="px-[12px] pt-[8px] font-medium text-[12px] text-[#61667c] leading-[1.5]">Description</span>
                      <span class="px-[12px] py-[4px] w-full">
                        <textarea v-model="invForm.description" rows="2" placeholder="Add description here" class="inv-textarea h-[56px]" />
                      </span>
                    </label>
                    <!-- schedule payment -->
                    <div class="flex items-center w-full px-[12px] py-[8px]">
                      <span class="flex-1 font-medium text-[12px] text-[#61667c] leading-[1.5]">Schedule payment</span>
                      <button
                        type="button"
                        class="flex items-center w-[26px] h-[15px] rounded-full p-[1.5px] shrink-0 transition-colors duration-150"
                        :class="schedulePayment ? 'bg-[#2465de] justify-end' : 'bg-[#ccdefe] justify-start'"
                        @click="schedulePayment = !schedulePayment"
                      >
                        <span class="size-[12px] rounded-full bg-white" style="box-shadow: 0px 1px 2px rgba(0,0,0,0.15);" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- footer -->
          <div class="shrink-0 border-t border-[#e5e6ea] flex items-center justify-between px-[40px] py-[16px]">
            <button
              type="button"
              class="flex h-[36px] items-center justify-center min-w-[100px] px-[12px] py-[8px] rounded-[8px] border border-[#f2f2f4]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              @click="stage = 'vendors'"
            >
              <span class="font-medium text-[14px] text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
            </button>
            <button
              type="button"
              class="flex h-[36px] items-center justify-center min-w-[100px] px-[12px] py-[8px] rounded-[8px] border border-[#2465de]"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            >
              <span class="font-medium text-[14px] text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Next</span>
            </button>
          </div>
          </div>

          <!-- Search vendor (opened from "Change") -->
          <div v-else key="search" class="flex flex-1 flex-col min-h-0">
            <div class="flex-1 overflow-y-auto flex flex-col gap-[16px] items-start px-[48px] pt-[24px] pb-[88px]">
              <!-- header -->
              <div class="flex items-center justify-between w-full">
                <p class="font-medium text-[16px] text-[#03102f] leading-[1.4]">Search vendor</p>
                <button type="button" class="flex gap-[6px] h-[28px] items-center justify-center px-[8px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f1f5]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3.5V12.5M3.5 8H12.5" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
                  <span class="font-medium text-[12px] text-[#61667c] leading-[1.5]">New vendor</span>
                </button>
              </div>

              <!-- search input -->
              <div class="flex h-[36px] items-center gap-[8px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white w-full" style="box-shadow: 0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09);">
                <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7.2" cy="7.2" r="4.4" stroke="#9295a5" stroke-width="1.3" /><path d="M10.6 10.6L13.5 13.5" stroke="#9295a5" stroke-width="1.3" stroke-linecap="round" /></svg>
                <input v-model="vendorSearch" type="text" placeholder="Search vendor" class="flex-1 min-w-px bg-transparent border-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]" />
              </div>

              <!-- vendor list -->
              <div class="flex flex-col gap-[8px] items-start w-full">
                <button
                  v-for="v in filteredVendors"
                  :key="v.id"
                  type="button"
                  class="flex gap-[12px] items-center overflow-hidden px-[12px] py-[8px] rounded-[8px] w-full border text-left cursor-pointer transition-shadow duration-150"
                  :class="selected === v.id ? 'border-[#2465de]' : 'border-[#e5e6ea] hover:border-[#cbcdd4] hover:shadow-[0px_3px_11px_0px_rgba(38,42,50,0.06)]'"
                  :style="selected === v.id ? 'box-shadow: 0px 0px 0px 3px #b3cdfe;' : ''"
                  @click="pickVendor(v.id)"
                >
                  <span
                    class="flex items-center justify-center size-[16px] rounded-full border shrink-0"
                    :class="selected === v.id ? 'bg-[#2465de] border-[#2465de]' : 'bg-white border-[#e5e6ea]'"
                    style="box-shadow: 0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09);"
                  >
                    <span v-if="selected === v.id" class="size-[6px] rounded-full bg-white" />
                  </span>
                  <span class="flex items-center justify-center size-[32px] rounded-[8px] bg-[#002771] shrink-0">
                    <span class="font-bold text-[14px] text-white" style="letter-spacing: 0.15px; text-shadow: 0px 0.5px 0.5px rgba(0,0,0,0.06);">{{ v.initial }}</span>
                  </span>
                  <span class="flex flex-1 flex-col items-start min-w-px">
                    <span class="font-medium text-[14px] text-[#03102f] leading-[1.5]">{{ v.name }}</span>
                    <span class="font-medium text-[12px] text-[#61667c] leading-[1.5] truncate w-full">{{ v.meta }}</span>
                  </span>
                </button>
                <p v-if="!filteredVendors.length" class="font-normal text-[13px] text-[#9295a5] leading-[1.5] py-[8px]">No vendors match “{{ vendorSearch }}”.</p>
              </div>
            </div>
          </div>
          </Transition>
        </div>
      </div>

    </div>

    <!-- Add payment information drawer — slides in from the right -->
    <Transition name="drawer">
      <div
        v-if="payPanelOpen"
        class="absolute inset-y-0 right-0 z-50 w-[480px] max-w-full bg-white flex flex-col"
        style="box-shadow: -8px 0px 28px rgba(38,42,50,0.12);"
      >
        <!-- header -->
        <div class="shrink-0 flex items-start gap-[32px] border-b border-[#e5e6ea] p-[16px]">
          <p class="flex-1 pt-[2px] font-medium text-[16px] text-[#03102f] leading-[1.4]">Add payment information detail</p>
          <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" @click="payPanelOpen = false">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
          </button>
        </div>

        <!-- fields (shared HitPay form-field pattern) -->
        <div class="flex-1 overflow-y-auto flex flex-col gap-[16px] py-[12px]">
          <div v-for="(row, ri) in payFields" :key="ri" class="flex gap-[12px] items-start px-[16px] w-full">
            <div v-for="f in row" :key="f.label" class="flex flex-1 flex-col gap-[4px] items-start min-w-px">
              <span class="flex items-center h-[20px] font-medium text-[12px] text-[#61667c] leading-[1.5]">{{ f.label }}</span>

              <!-- select -->
              <div v-if="f.type === 'select'" class="aba-control">
                <select v-model="payValues[f.label]" class="aba-select" :class="{ 'aba-placeholder': !payValues[f.label] }">
                  <option value="" disabled>{{ f.placeholder }}</option>
                  <option v-for="opt in f.options" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <svg class="aba-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C" />
                </svg>
              </div>

              <!-- text input -->
              <div v-else class="aba-control">
                <input v-model="payValues[f.label]" type="text" :placeholder="f.placeholder" class="aba-input" />
              </div>
            </div>
          </div>

          <!-- divider -->
          <div class="flex justify-center w-full"><div class="h-px w-[120px] bg-[#e5e6ea]" /></div>

          <!-- password -->
          <div class="flex gap-[12px] items-start px-[16px] w-full">
            <div class="flex flex-1 flex-col gap-[4px] items-start min-w-px">
              <span class="flex items-center h-[20px] font-medium text-[12px] text-[#61667c] leading-[1.5]">Enter HitPay password</span>
              <div class="aba-control" style="gap: 8px;">
                <input v-model="payPassword" :type="payPasswordVisible ? 'text' : 'password'" placeholder="HitPay password" class="aba-input" />
                <button
                  class="shrink-0 flex items-center justify-center transition-opacity duration-150"
                  style="margin-right: 8px;"
                  :style="{ opacity: payPasswordVisible ? 1 : 0.75 }"
                  @click="payPasswordVisible = !payPasswordVisible"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.66701 8.0008L2.66688 8L2.66701 7.9992C2.66865 7.9888 2.67794 7.93 2.72992 7.81447C2.78711 7.68727 2.87988 7.527 3.01261 7.34253C3.27778 6.97407 3.6744 6.54805 4.17568 6.14409C5.18475 5.33091 6.54152 4.66667 8 4.66667C9.45847 4.66667 10.8153 5.33091 11.8243 6.14409C12.3256 6.54805 12.7222 6.97407 12.9874 7.34253C13.1201 7.527 13.2129 7.68727 13.2701 7.81447C13.3221 7.93 13.3313 7.9888 13.333 7.9992L13.3331 8L13.333 8.0008C13.3313 8.0112 13.3221 8.07 13.2701 8.18553C13.2129 8.31273 13.1201 8.473 12.9874 8.65747C12.7222 9.02593 12.3256 9.45193 11.8243 9.85593C10.8153 10.6691 9.45847 11.3333 8 11.3333C6.54152 11.3333 5.18475 10.6691 4.17568 9.85593C3.6744 9.45193 3.27778 9.02593 3.01261 8.65747C2.87988 8.473 2.78711 8.31273 2.72992 8.18553C2.67794 8.07 2.66865 8.0112 2.66701 8.0008ZM8 3.33333C6.14477 3.33333 4.50153 4.16909 3.33904 5.10591C2.75453 5.57695 2.27247 6.0884 1.93041 6.5637C1.75952 6.80113 1.61653 7.03933 1.51388 7.2676C1.41565 7.486 1.33333 7.74127 1.33333 8C1.33333 8.25873 1.41565 8.514 1.51388 8.7324C1.61653 8.96067 1.75952 9.19887 1.93041 9.43627C2.27247 9.9116 2.75453 10.4231 3.33904 10.8941C4.50153 11.8309 6.14477 12.6667 8 12.6667C9.8552 12.6667 11.4985 11.8309 12.6609 10.8941C13.2455 10.4231 13.7275 9.9116 14.0696 9.43627C14.2405 9.19887 14.3835 8.96067 14.4861 8.7324C14.5843 8.514 14.6667 8.25873 14.6667 8C14.6667 7.74127 14.5843 7.486 14.4861 7.2676C14.3835 7.03933 14.2405 6.80113 14.0696 6.5637C13.7275 6.0884 13.2455 5.57695 12.6609 5.10591C11.4985 4.16909 9.8552 3.33333 8 3.33333ZM7.33333 8C7.33333 7.6318 7.6318 7.33333 8 7.33333C8.3682 7.33333 8.66667 7.6318 8.66667 8C8.66667 8.3682 8.3682 8.66667 8 8.66667C7.6318 8.66667 7.33333 8.3682 7.33333 8ZM8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8C10 6.8954 9.1046 6 8 6Z" fill="#61667C" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- footer -->
        <div class="shrink-0 border-t border-[#e5e6ea] flex gap-[8px] items-center justify-end p-[16px]">
          <button
            class="btn-secondary flex h-[36px] items-center justify-center px-[12px] rounded-[8px] text-[14px] font-medium text-[#61667c]"
            style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
            @click="payPanelOpen = false"
          >Cancel</button>
          <button
            class="btn-primary flex h-[36px] items-center justify-center min-w-[100px] px-[12px] rounded-[8px] text-[14px] font-medium text-white"
            @click="payPanelOpen = false"
          >Save</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import invoice from '../../assets/images/billreview/invoice.png'
import zoomIn from '../../assets/images/billreview/zoom-in.svg'
import zoomOut from '../../assets/images/billreview/zoom-out.svg'

const zoom = ref(100)

const steps = [
  { label: 'Bill details', state: 'current' },
  { label: 'Review', state: 'upcoming' },
  { label: 'Payment', state: 'upcoming' },
]

// Stage machine: scanning → (7s) → vendors → (confirm) → form
const stage = ref('scanning')
let scanTimer
onMounted(() => { scanTimer = setTimeout(() => { if (stage.value === 'scanning') stage.value = 'vendors' }, 7000) })
onBeforeUnmount(() => clearTimeout(scanTimer))

const vendors = [
  { id: 'orion', initial: 'S', name: 'Orion Venture', meta: 'DBS Bank ****1234 • Tax ID: 1291283493910' },
  { id: 'sp', initial: 'O', name: 'Singapore Power LLC', meta: 'Maybank ****1234 • Tax ID: 1291283493910' },
]
const selected = ref('orion')
function confirmVendor() { stage.value = 'form' }

// Full vendor directory (used by the Search vendor view)
const vendorList = [
  { id: 'orion', initial: 'O', name: 'Orion Venture', meta: 'DBS Bank ****1234 • Tax ID: 1291283493910' },
  { id: 'sp', initial: 'S', name: 'Singapore Power LLC', meta: 'Maybank ****1234 • Tax ID: 1291283493910' },
  { id: 'manima', initial: 'M', name: 'Manima Corp', meta: 'Maybank ****1234 • Tax ID: 1291283493910' },
  { id: 'tech', initial: 'T', name: 'Tech Innovations', meta: 'CitiBank ****5678 • Tax ID: 9876543212345' },
  { id: 'green', initial: 'G', name: 'GreenTech Solutions', meta: 'HSBC ****4321 • Tax ID: 5647382910123' },
  { id: 'eco', initial: 'E', name: 'EcoWare', meta: 'Wells Fargo ****8765 • Tax ID: 3219876543210' },
  { id: 'future', initial: 'F', name: 'Future Vision', meta: 'Chase Bank ****1357 • Tax ID: 4567891234568' },
  { id: 'health', initial: 'H', name: 'HealthSync', meta: 'Barclays ****2468 • Tax ID: 7890123456789' },
  { id: 'smart', initial: 'S', name: 'SmartHome Solutions', meta: 'Bank of America ****3691 • Tax ID: 2468013579132' },
]

// Search-vendor view (opened from the "Change" button)
const searching = ref(false)
const vendorSearch = ref('')
const vswapName = ref('vswap-up') // open: rise up · back: come down
const filteredVendors = computed(() => {
  const q = vendorSearch.value.trim().toLowerCase()
  return q ? vendorList.filter((v) => v.name.toLowerCase().includes(q)) : vendorList
})
function changeVendor() {
  vswapName.value = 'vswap-up'
  searching.value = true
}
function pickVendor(id) {
  selected.value = id
  vswapName.value = 'vswap-down'
  searching.value = false
}

// Paying-to (form) reflects the confirmed/selected vendor
const currentVendor = computed(() => vendorList.find((v) => v.id === selected.value) || vendorList[0])
const payingName = computed(() => currentVendor.value.name)
const payingInitial = computed(() => currentVendor.value.initial)
// Singapore Power has existing SGD payout methods
const payMethods = [
  { id: 'swift', name: 'SWIFT', days: '2-5 business days', fee: 'SGD 25.00' },
  { id: 'fast', name: 'FAST', days: '1-2 business days', fee: 'SGD 20.00' },
]
const payMethod = ref('swift')

// Invoice details — editable input fields
const invForm = reactive({
  number: 'INV-0128HYY',
  invoiceDate: '08/08/2025',
  dueDate: '08/09/2025',
  category: 'Fashion',
  description: '',
})
const schedulePayment = ref(false)

// Add-payment-method slide-over drawer — uses the shared form-field pattern
const payPanelOpen = ref(false)
const payFields = [
  [{ label: 'Country', type: 'select', placeholder: 'Select country', value: 'Singapore', options: ['Singapore', 'Malaysia', 'Philippines', 'Indonesia', 'Thailand'] }],
  [
    { label: 'Entity type', type: 'select', placeholder: 'Entity type', value: '', options: ['Individual', 'Sole-proprietorship', 'Company', 'Partnership'] },
    { label: 'Currency', type: 'select', placeholder: 'Select currency', value: '', options: ['SGD', 'USD', 'EUR', 'MYR', 'PHP'] },
  ],
  [
    { label: 'Transfer method', type: 'select', placeholder: 'Select transfer method', value: 'Bank transfer', options: ['Bank transfer', 'GIRO', 'Wire transfer'] },
    { label: 'Transfer type', type: 'select', placeholder: 'Select transfer type', value: 'FAST', options: ['FAST', 'GIRO', 'Wire'] },
  ],
  [
    { label: 'Account holder name', type: 'input', placeholder: 'Enter account holder name', value: 'Orion Ventures' },
    { label: 'Account number', type: 'input', placeholder: 'Enter account number', value: '16277188299' },
  ],
  [
    { label: 'Bank name', type: 'input', placeholder: 'Enter bank name', value: 'DBS Bank Singapore' },
    { label: 'Nickname (optional)', type: 'input', placeholder: 'Enter nickname', value: 'Orion Ventures' },
  ],
  [{ label: 'Remark (optional)', type: 'input', placeholder: 'Add a remark', value: 'Notes for detail vendors' }],
]
const payValues = reactive(Object.fromEntries(payFields.flat().map((f) => [f.label, f.value || ''])))
const payPassword = ref('')
const payPasswordVisible = ref(false)
</script>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background: #f2f2f4;
}
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, rgba(229, 230, 234, 0), rgba(229, 230, 234, 0.85), rgba(229, 230, 234, 0));
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}
@keyframes skeleton-shimmer {
  100% { transform: translateX(100%); }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton::after { animation: none; }
}

/* Form section fades + rises into place when it loads (after vendor confirm).
   Decelerate curve from the motion guideline — content "arrives and settles". */
.form-section {
  animation: form-in 480ms cubic-bezier(0.32, 0.72, 0, 1) both;
}
@keyframes form-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .form-section { animation: none; }
}

/* Slide-over drawer — enters right→left on the standard curve, quicker exit. */
.drawer-enter-active { transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-leave-active { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from,
.drawer-leave-to { transform: translateX(100%); }

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active { transition: none; }
}

/* ── Shared form-field component (from new-activation) ── */
.aba-control {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.aba-control:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}

.aba-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 32px 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.aba-select.aba-placeholder { color: #9295a5; }

.aba-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.aba-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.aba-input::placeholder { color: #9295a5; }

.btn-secondary {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  border: 1px solid #f2f2f4;
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-secondary:hover { filter: brightness(0.98); }
.btn-secondary:active { transform: translateY(1px); box-shadow: 0px 0.5px 0px 0px #e5e5e5; }

.btn-primary {
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  border: 1px solid #2465de;
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-primary:hover { filter: brightness(1.05); }
.btn-primary:active { transform: translateY(1px); box-shadow: 0px 0.5px 0px 0px #1d5fd9; }

@media (prefers-reduced-motion: reduce) {
  .aba-control,
  .btn-secondary,
  .btn-primary { transition: none; }
}

/* ── Invoice details input rows ──
   Default: plain. Hover / focus (editing): subtle #fcfcfd fill + inset top
   shadow, with the native text caret on focus. */
.inv-row {
  position: relative;
  cursor: text;
  transition: background 150ms ease, box-shadow 150ms ease;
}
.inv-row:hover,
.inv-row:focus-within {
  background: #fcfcfd;
  /* inset top shadow + lighter (primary/300) 0.5px bottom border (no layout shift) */
  box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.08), inset 0px -0.5px 0px 0px #80acfe;
}

.inv-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  text-align: right;
}
.inv-input::placeholder { color: #9295a5; }

.inv-textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.inv-textarea::placeholder { color: #9295a5; }

@media (prefers-reduced-motion: reduce) {
  .inv-row { transition: none; }
}

/* Form ⇄ Search vendor swap — same fade + rise as the "Confirm" (form-in)
   transition for consistency, just faster. Enter direction flips on the way back. */
.vswap-up-enter-active,
.vswap-down-enter-active { transition: opacity 260ms cubic-bezier(0.32, 0.72, 0, 1), transform 260ms cubic-bezier(0.32, 0.72, 0, 1); }
.vswap-up-leave-active,
.vswap-down-leave-active { transition: opacity 110ms ease-in; }

/* Opening (Change): new view rises up from below */
.vswap-up-enter-from { opacity: 0; transform: translateY(10px); }
/* Going back (vendor picked): new view comes down from above */
.vswap-down-enter-from { opacity: 0; transform: translateY(-10px); }

.vswap-up-leave-to,
.vswap-down-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .vswap-up-enter-active,
  .vswap-up-leave-active,
  .vswap-down-enter-active,
  .vswap-down-leave-active { transition: none; }
}
</style>
