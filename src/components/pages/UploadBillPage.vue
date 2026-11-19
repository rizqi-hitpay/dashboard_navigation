<template>
  <div class="flex flex-1 min-h-0 w-full bg-white">
    <!-- Upload bills — step 1 "Bill details" (Figma 49:25390). Rendered inside UploadBillFlow,
         which owns the header + AI dock; this is the step body (kept alive across Review).
         Single element root (no comment above it): <Transition> in the flow needs one element. -->

      <!-- ── Left: Paper ─────────────────────────────────────────── -->
      <!-- Paper: 640/1440 normally, 440/1080 with the AI panel open (Figma) -->
      <section class="flex flex-col shrink-0 min-h-0 bg-[#fcfcfd] transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]" :class="aiOpen ? 'w-[40.75%] min-w-[360px]' : 'w-[44.45%] min-w-[420px]'">

        <!-- Preview: drawn by UploadBillFlow's persistent InvoicePaperPane over this column
             (so it doesn't move between Bill details and Review). This column stays as the spacer. -->
        <template v-if="paper === 'preview'" />

        <!-- Dropzone: empty · hover/drag · uploading · attached (Figma 27:2463 / 37:5094 / 37:9512 / 37:6468) -->
        <div v-else class="flex flex-1 min-h-0 flex-col items-center px-[48px] py-[32px]">
          <label
            class="group relative flex flex-1 flex-col items-center justify-center gap-[16px] w-full max-w-[500px] p-[8px] rounded-[8px] border border-dashed border-[#2465de] transition-colors duration-150"
            :class="[
              paper === 'empty' ? 'cursor-pointer hover:bg-[#e5eeff]' : 'cursor-default',
              dragging ? 'bg-[#e5eeff]' : 'bg-[#f8f9fc]',
            ]"
            @dragover.prevent="paper === 'empty' && (dragging = true)"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
          >
            <input type="file" class="sr-only" accept=".pdf,.png,.jpg,.jpeg" :disabled="paper !== 'empty'" @change="onSelect" />

            <!-- Mini invoice illustration -->
            <div
              class="relative bg-white h-[88px] w-[71.077px] overflow-hidden rounded-[4px] shrink-0 transition-colors duration-200"
              :class="{ 'border-[1.5px] border-[#2bc37d]': paper === 'attached' }"
              style="box-shadow: 0px 2.031px 14.892px 0px rgba(38,42,50,0.03);"
            >
              <MiniInvoice :inset="paper === 'empty' ? 5.42 : 3.92" />
              <!-- Uploading: a #4c8afd segment travels round the doc's 1.5px border (Figma 37:9515) -->
              <span v-if="paper === 'uploading'" class="upload-ring" aria-hidden="true" />
              <!-- Success check -->
              <Transition name="pop">
                <span v-if="paper === 'attached'" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-[6.737px] rounded-full bg-[#2bc37d]">
                  <img :src="checkWhiteIcon" width="18.5263" height="18.5263" alt="" />
                </span>
              </Transition>
            </div>

            <!-- Copy -->
            <div class="flex flex-col items-center gap-[4px] text-center">
              <template v-if="paper === 'empty'">
                <p class="text-[14px] text-[#03102f] leading-[1.5]">Drag and drop your invoice here or select it from your files.</p>
                <p class="text-[12px] text-[#61667c] leading-[1.5]">Supported formats: PDF, PNG, or JPG. Maximum file size: 10MB.</p>
              </template>
              <template v-else>
                <p class="text-[14px] text-[#03102f] leading-[1.5]">{{ paper === 'uploading' ? 'Uploading document' : `${fileName} has been attached` }}</p>
                <div class="flex items-center gap-[4px] w-[298px]">
                  <span class="relative flex-1 h-[5px] rounded-[16px] bg-[#f2f2f4] overflow-hidden">
                    <span class="absolute inset-y-0 left-0 rounded-[16px] bg-[#2465de] transition-[width] duration-150 ease-out" :style="{ width: progress + '%' }" />
                  </span>
                  <span class="w-[32px] text-[12px] font-medium text-[#03102f] leading-[1.5]">{{ progress }}%</span>
                </div>
              </template>
            </div>

            <!-- Hover / drag: blue add button (Figma 37:6006) -->
            <span
              v-if="paper === 'empty'"
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-[48px] rounded-full bg-[#2465de] pointer-events-none transition-[opacity,transform] duration-150 ease-out group-hover:opacity-100 group-hover:scale-100"
              :class="dragging ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
              style="box-shadow: 0px 2.25px 16.5px 0px rgba(38,42,50,0.09);"
            >
              <img :src="plusWhiteIcon" width="18" height="18" alt="" />
            </span>
          </label>
        </div>
      </section>

      <!-- ── Right: Bill details form (Figma 34:3595) ─────────────── -->
      <!-- flow-right: only this column animates between Bill details ↔ Review (UploadBillFlow) -->
      <section class="flow-right relative flex flex-col flex-1 min-w-0 min-h-0 border-l border-[#e5e6ea]">
        <div class="flex-1 min-h-0 overflow-y-auto">
          <div class="flex flex-col gap-[16px] px-[48px] pt-[24px] pb-[24px]">
            <h2 class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Bill details</h2>

            <div class="flex flex-col items-center gap-[24px] w-full">

              <!-- Section: vendor + invoice -->
              <div class="flex flex-col gap-[16px] w-full">
                <!-- Paying to -->
                <div class="relative flex flex-col gap-[4px] w-full">
                  <span class="field-label">Paying to</span>
                  <button type="button" class="field-input justify-between text-left" :aria-expanded="openMenu === 'vendor'" @click="toggleMenu('vendor')">
                    <span class="flex-1 min-w-0 truncate" :class="vendor ? 'text-[#03102f]' : 'text-[#9295a5]'">{{ vendor ? vendor.name : 'Select vendor' }}</span>
                    <img :src="chevronDownIcon" width="16" height="16" alt="" class="shrink-0 transition-transform duration-200" :class="openMenu === 'vendor' ? 'rotate-180' : ''" />
                  </button>
                  <!-- Vendor not found (Figma 45:20388) -->
                  <div v-if="vendorNotFound && !vendor" class="mt-[4px] flex items-center pl-[8px] pr-[12px] py-[8px] rounded-[8px] border border-[#f4b840] bg-[#fff9ec]">
                    <p class="text-[12px] text-[#03102f] leading-[1.5]">
                      We couldn't find this vendor. Search for them, add a new vendor, or
                      <a href="#" class="underline" @click.prevent>sync with Xero</a>
                    </p>
                  </div>
                  <!-- Vendor dropdown (Figma 45:21929) -->
                  <Transition name="dropdown">
                    <div v-if="openMenu === 'vendor'" class="dropdown top-[68px]" role="listbox">
                      <div class="flex flex-col gap-[4px] pb-[8px]">
                        <button
                          v-for="v in vendors"
                          :key="v.id"
                          type="button"
                          role="option"
                          :aria-selected="vendor?.id === v.id"
                          class="dropdown-option"
                          :class="vendor?.id === v.id ? 'bg-[#f5f6f9]' : ''"
                          @click="pickVendor(v)"
                        >
                          <span class="flex flex-col gap-[4px] flex-1 min-w-0 text-left leading-[1.5]">
                            <span class="text-[14px] text-[#03102f]">{{ v.name }}</span>
                            <span class="text-[12px] text-[#61667c]">{{ v.meta }}</span>
                          </span>
                        </button>
                        <button type="button" class="add-new" @click="openMenu = null">
                          <img :src="plusGreyIcon" width="16" height="16" alt="" />
                          <span>Add New</span>
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Invoice number · dates · category · description — shared design-system inputs (same as Cards) -->
                <div class="flex flex-col gap-[16px] w-full">
                  <FieldRows :rows="invoiceRows" :values="form" />
                </div>
              </div>

              <span class="block w-[120px] h-px bg-[#e5e6ea]" />

              <!-- Section: Items -->
              <div class="flex flex-col gap-[16px] w-full">
                <!-- Top: title (+ currency / tax mode settings in Line items mode — Figma 56:32975) -->
                <div class="flex items-center justify-between gap-[8px] w-full min-h-[30px]">
                  <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ billMode === 'items' ? `Items (${lineItems.length})` : 'Items' }}</p>
                  <div v-if="billMode === 'items'" class="flex items-center gap-[8px] shrink-0">
                    <span class="mini-select w-[81px]">
                      <select v-model="itemsCurrency" aria-label="Items currency">
                        <option v-for="c in ITEM_CURRENCIES" :key="c" :value="c">{{ c }}</option>
                      </select>
                      <img :src="chevronDownIcon" width="16" height="16" alt="" />
                    </span>
                    <span class="mini-select w-[147px]">
                      <select v-model="taxMode" aria-label="Tax mode">
                        <option value="exclusive">Tax exclusive</option>
                        <option value="inclusive">Tax inclusive</option>
                      </select>
                      <img :src="chevronDownIcon" width="16" height="16" alt="" />
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-[4px] w-full">
                  <span class="field-label">Bill mode</span>
                  <div class="flex gap-[4px] w-full" role="radiogroup" aria-label="Bill mode">
                    <button
                      v-for="m in billModes"
                      :key="m.id"
                      type="button"
                      role="radio"
                      :aria-checked="billMode === m.id"
                      class="flex flex-1 items-center justify-center min-h-[36px] px-[12px] py-[8px] rounded-[8px] border text-[12px] leading-[1.5] text-[#03102f] transition-colors duration-150"
                      :class="billMode === m.id ? 'bg-[#e5eeff] border-[#2465de] font-medium' : 'bg-white border-[#e5e6ea] font-normal hover:bg-[#fcfcfd]'"
                      style="filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
                      @click="billMode = m.id"
                    >{{ m.label }}</button>
                  </div>
                </div>

                <!-- Amount (Figma 49:26824) -->
                <label
                  v-if="billMode === 'total'"
                  class="amount-field relative flex items-center gap-[8px] w-full px-[12px] py-[8px] rounded-[8px] border border-[#a6b3cd] bg-white overflow-hidden cursor-text"
                  style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04);"
                >
                  <span class="flex-1 field-label">Amount</span>
                  <span class="flex items-start gap-[8px] shrink-0">
                    <span class="pt-[4px] text-[12px] font-medium text-[#61667c] leading-[1.5]">SGD</span>
                    <input
                      v-model="amount"
                      type="text"
                      inputmode="decimal"
                      aria-label="Amount in SGD"
                      class="amount-input"
                      :style="{ width: Math.max(amount.length, 4) + 'ch' }"
                      @focus="$event.target.select()"
                      @blur="formatAmount"
                    />
                  </span>
                </label>
                <!-- Line items (Figma 56:32646) -->
                <div v-else class="flex flex-col gap-[12px] w-full">
                  <TransitionGroup name="line-item" tag="div" class="flex flex-col gap-[12px] w-full">
                    <div v-for="(it, idx) in lineItems" :key="it.id" class="relative flex items-start w-full rounded-[8px] border border-[#e5e6ea] bg-white">
                      <span class="flex items-center justify-center size-[32px] shrink-0 text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ idx + 1 }}.</span>
                      <div class="flex flex-1 min-w-0 flex-col border-l border-[#e5e6ea] rounded-r-[8px] overflow-hidden">
                        <label class="li-row">
                          <span class="li-label">Name</span>
                          <span class="li-value">

                            <img :src="pencil2Icon" width="14" height="14" alt="" class="li-pencil" />

                            <input v-model="it.name" type="text" placeholder="e.g. John Doe" class="li-input" />

                          </span>
                        </label>
                        <label class="li-row">
                          <span class="li-label">Description</span>
                          <span class="li-value">

                            <img :src="pencil2Icon" width="14" height="14" alt="" class="li-pencil" />

                            <input v-model="it.description" type="text" placeholder="Item description" class="li-input" />

                          </span>
                        </label>
                        <div class="flex w-full">
                          <label class="li-row flex-1 min-w-0 border-r border-[#e5e6ea]">
                            <span class="li-label">Unit price</span>
                            <span class="li-value">

                              <img :src="pencil2Icon" width="14" height="14" alt="" class="li-pencil" />

                              <input v-model="it.unitPrice" type="text" inputmode="decimal" placeholder="0.00" class="li-input li-mono" @blur="it.unitPrice = fmtMoneyInput(it.unitPrice)" />

                            </span>
                          </label>
                          <label class="li-row flex-1 min-w-0">
                            <span class="li-label">Quantity</span>
                            <span class="li-value">

                              <img :src="pencil2Icon" width="14" height="14" alt="" class="li-pencil" />

                              <input v-model="it.quantity" type="text" inputmode="numeric" placeholder="1" class="li-input li-mono" />

                            </span>
                          </label>
                        </div>
                        <div class="flex w-full">
                          <label class="li-row flex-1 min-w-0 border-r border-[#e5e6ea]">
                            <span class="li-label">Tax</span>
                            <span class="li-value">

                              <img :src="pencil2Icon" width="14" height="14" alt="" class="li-pencil" />

                              <input v-model="it.taxName" type="text" placeholder="e.g. GST" class="li-input" />

                            </span>
                          </label>
                          <label class="li-row flex-1 min-w-0">
                            <span class="li-label">Tax amount</span>
                            <span class="li-value gap-[8px]">
                              <img :src="pencil2Icon" width="14" height="14" alt="" class="li-pencil" />
                              <input v-model="it.taxRate" type="text" inputmode="decimal" placeholder="0" class="li-input li-mono" />
                              <span class="text-[14px] text-[#03102f] leading-[1.4] shrink-0" style="font-family: 'Reddit Mono', ui-monospace, monospace;">%</span>
                            </span>
                          </label>
                        </div>
                        <label class="li-row">
                          <span class="li-label">Category</span>
                          <span class="li-value">

                            <img :src="pencil2Icon" width="14" height="14" alt="" class="li-pencil" />

                            <select v-model="it.category" class="li-input li-select cursor-pointer" :style="{ color: it.category ? '#03102f' : '#9295a5' }">
                            <option value="">Select category</option>
                            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                          </select>

                          </span>
                        </label>
                        <div class="flex items-center justify-between px-[12px] py-[8px] w-full">
                          <span class="li-label">Amount (tax included)</span>
                          <span class="text-[14px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ itemsCurrency }} {{ money(itemAmount(it)) }}</span>
                        </div>
                      </div>
                      <!-- Remove: hidden when there's only one item -->
                      <button
                        v-if="lineItems.length > 1"
                        type="button"
                        class="absolute right-[-24px] top-[8px] flex items-center justify-center size-[16px] rounded-[4px] hover:opacity-70 transition-opacity duration-150"
                        :aria-label="`Remove item ${idx + 1}`"
                        @click="removeItem(it.id)"
                      >
                        <img :src="binRedIcon" width="16" height="16" alt="" />
                      </button>
                    </div>
                  </TransitionGroup>

                  <div class="flex justify-center w-full">
                    <button type="button" class="flex items-center gap-[6px] h-[28px] min-w-[100px] px-[8px] rounded-[8px] hover:bg-[#f2f6ff] transition-colors duration-150" @click="addItem">
                      <img :src="plusBlueIcon" width="16" height="16" alt="" />
                      <span class="text-[12px] font-medium text-[#2465de] leading-[1.5]">Add another item</span>
                    </button>
                  </div>

                  <span class="block w-full h-px bg-[#e5e6ea]" />

                  <!-- Subtotal / Total (Figma 56:32691) -->
                  <div class="flex flex-col gap-[8px] w-full px-[12px] py-[8px] rounded-[8px] bg-[#03102f]">
                    <div class="flex items-center justify-between">
                      <span class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">Subtotal</span>
                      <span class="text-[14px] text-white leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ itemsCurrency }} {{ money(itemsSubtotal) }}</span>
                    </div>
                    <!-- Tax rows (Figma 59:33033), one per tax name + rate -->
                    <div v-for="t in taxLines" :key="t.label" class="flex items-center justify-between">
                      <span class="text-[12px] font-medium text-[#cbcdd4] leading-[1.5]">{{ t.label }}</span>
                      <span class="text-[14px] text-white leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ itemsCurrency }} {{ money(t.amount) }}</span>
                    </div>
                    <span class="block h-px w-full bg-white/[0.12]" />
                    <div class="flex items-center justify-between text-white font-medium">
                      <span class="text-[14px] leading-[1.5]">Total</span>
                      <span class="text-[16px] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ itemsCurrency }} {{ money(itemsTotal) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <span class="block w-[120px] h-px bg-[#e5e6ea]" />

              <!-- Section: Payment details -->
              <div class="flex flex-col gap-[16px] w-full">
                <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Payment details</p>

                <!-- Payment method -->
                <div class="relative flex flex-col gap-[4px] w-full">
                  <span class="field-label">Payment method</span>
                  <!-- Selected (Figma 49:25391) -->
                  <div v-if="payMethod" class="flex items-center gap-[16px] w-full px-[12px] py-[8px] rounded-[8px] border border-[#e5e6ea] bg-[#fcfcfd]">
                    <div class="flex flex-1 min-w-0 flex-col">
                      <span class="flex items-start gap-[4px]">
                        <span class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ payMethod.name }}</span>
                        <span class="chip">{{ payMethod.currency }}</span>
                      </span>
                      <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] truncate">{{ payMethodMeta(payMethod) }}</span>
                    </div>
                    <PayMeta :method="payMethod" />
                    <button type="button" class="sec-btn h-[28px] px-[8px]" @click="toggleMenu('pay')">
                      <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Change</span>
                    </button>
                  </div>
                  <button v-else type="button" class="field-input justify-between text-left" :aria-expanded="openMenu === 'pay'" @click="toggleMenu('pay')">
                    <span class="flex-1 text-[#9295a5]">Please select one</span>
                    <img :src="chevronDownIcon" width="16" height="16" alt="" class="shrink-0 transition-transform duration-200" :class="openMenu === 'pay' ? 'rotate-180' : ''" />
                  </button>
                  <!-- Payment method dropdown (Figma 44:17378) -->
                  <Transition name="dropdown">
                    <div v-if="openMenu === 'pay'" class="dropdown" :class="payMethod ? 'top-[80px]' : 'top-[68px]'" role="listbox">
                      <div class="flex flex-col gap-[4px] pb-[8px]">
                        <button
                          v-for="m in payMethods"
                          :key="m.id"
                          type="button"
                          role="option"
                          :aria-selected="payMethod?.id === m.id"
                          class="dropdown-option"
                          :class="payMethod?.id === m.id ? 'bg-[#f5f6f9]' : ''"
                          @click="pickPayMethod(m)"
                        >
                          <span class="flex flex-1 min-w-0 flex-col gap-[4px] text-left">
                            <span class="flex items-center gap-[8px]">
                              <span class="text-[14px] text-[#03102f] leading-[1.5]">{{ m.name }}</span>
                              <span class="chip">{{ m.currency }}</span>
                            </span>
                            <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ payMethodMeta(m) }}</span>
                          </span>
                          <PayMeta :method="m" />
                        </button>
                        <button type="button" class="add-new" @click="openMenu = null">
                          <img :src="plusGreyIcon" width="16" height="16" alt="" />
                          <span>Add New</span>
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Schedule payment -->
                <div class="flex flex-col gap-[4px] w-full">
                  <div class="flex items-center justify-between h-[20px]">
                    <span class="field-label">Schedule payment</span>
                    <button
                      type="button"
                      role="switch"
                      :aria-checked="schedule"
                      aria-label="Schedule payment"
                      class="flex items-center w-[26px] h-[15px] rounded-full p-[1.5px] shrink-0 transition-colors duration-150"
                      :class="schedule ? 'bg-[#2465de] justify-end' : 'bg-[#ccdefe] justify-start'"
                      @click="schedule = !schedule"
                    >
                      <span class="size-[12px] rounded-full bg-white" style="box-shadow: 0px 1px 2px rgba(0,0,0,0.15);" />
                    </button>
                  </div>
                  <span class="field-input" :class="{ 'field-input--disabled': !schedule }">
                    <img :src="calendarIcon" width="16" height="16" alt="" class="shrink-0" />
                    <input v-model="scheduleDate" type="text" inputmode="numeric" placeholder="DD/MM/YYYY" class="field-bare disabled:cursor-not-allowed" :disabled="!schedule" aria-label="Scheduled payment date" />
                  </span>
                </div>
              </div>

              <span class="block w-[120px] h-px bg-[#e5e6ea]" />
            </div>
          </div>
        </div>

        <!-- Footer (Figma 34:3643) -->
        <div class="flex items-center justify-between h-[68px] px-[40px] py-[16px] shrink-0 bg-white border-t border-[#e5e6ea]">
          <button type="button" class="sec-btn h-[36px] min-w-[100px] px-[12px]" @click="close">
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
          </button>
          <button
            type="button"
            class="relative flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] overflow-hidden transition-[filter] duration-150 hover:brightness-110 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="next"
          >
            <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Next</span>
          </button>
        </div>

        <!-- Click-away layer for open dropdowns -->
        <div v-if="openMenu" class="fixed inset-0 z-10" @click="openMenu = null" />
      </section>

    <!-- Scanning overlay — covers the whole page while extracting (Figma 37:8912) -->
    <Teleport to="body">
      <Transition name="scan-modal">
        <div v-if="scanning" class="fixed inset-0 z-[70] flex items-center justify-center" style="background: rgba(0,0,0,0.45);" role="dialog" aria-modal="true" aria-label="Extracting bill details">
          <div class="scan-card relative w-[320px] p-[24px] rounded-[16px] bg-white" style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.09));">
            <button type="button" class="absolute right-[24px] top-[24px] p-[6px] rounded-[4px] hover:bg-[#f5f6f9] transition-colors duration-150" aria-label="Stop extracting" @click="cancelScan">
              <img :src="modalXIcon" width="20" height="20" alt="" />
            </button>
            <div class="flex flex-col items-center gap-[16px] py-[24px]">
              <!-- _scanning_doc: mini invoice + blue scan band -->
              <div class="relative w-[120px] h-[94px] overflow-hidden">
                <div class="absolute left-[24px] top-0 bg-white h-[88px] w-[71.077px] overflow-hidden rounded-[4px]" style="box-shadow: 0px 2.031px 14.892px 0px rgba(38,42,50,0.03);">
                  <MiniInvoice :inset="5.42" />
                </div>
                <!-- Scan band — same motion as the claim upload: glow trails the line, folds over at each end -->
                <span class="scan-band absolute left-1/2 top-0 w-[120px] h-[33px] border-b border-[#80acfe]" />
              </div>
              <p class="text-[14px] text-[#61667c] leading-[1.5] text-center">Scanning your document and extracting the payment details.</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Preview switcher: how extraction matches the vendor -->
    <div
      class="fixed bottom-[84px] left-[22%] -translate-x-1/2 z-[60] flex items-center gap-[4px] p-[4px] rounded-full bg-white border border-[#e5e6ea]"
      style="box-shadow: 0px 8px 24px rgba(3,16,47,0.16);"
    >
      <span class="px-[8px] text-[11px] font-medium text-[#8093b8] select-none">Vendor match</span>
      <button
        v-for="opt in [{ id: true, label: 'Found' }, { id: false, label: 'Not found' }]"
        :key="opt.label"
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="vendorMatch === opt.id ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="vendorMatch = opt.id"
      >{{ opt.label }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, h, watch, nextTick, onBeforeUnmount, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import chevronDownIcon from '../../assets/icons/upload-bill/chevron-down.svg'
import calendarIcon from '../../assets/icons/upload-bill/calendar.svg'
import ellipse37 from '../../assets/icons/upload-bill/ellipse37.svg'
import plusWhiteIcon from '../../assets/icons/upload-bill/plus-white.svg'
import plusGreyIcon from '../../assets/icons/upload-bill/plus-grey.svg'
import checkWhiteIcon from '../../assets/icons/upload-bill/check-white.svg'
import modalXIcon from '../../assets/icons/upload-bill/modal-x.svg'
import binRedIcon from '../../assets/icons/upload-bill/bin-red.svg'
import plusBlueIcon from '../../assets/icons/upload-bill/plus-blue.svg'
import pencil2Icon from '../../assets/icons/upload-bill/pencil-2.svg'
import FieldRows from '../forms/FieldRows.vue'
import { flowStep, flowAiOpen as aiOpen, flowZoom as zoom, flowShowPaper, flowRemoveFile } from '../../composables/useUploadBillFlow.js'

// Header shows step 1 whenever this step is on screen (also when returning from Review)
onActivated(() => { flowStep.value = 0 })
flowStep.value = 0

const router = useRouter()

/* ── Mini invoice illustration (shared by dropzone + scanning modal) ── */
const MiniInvoice = (props) => {
  const i = props.inset
  const bar = (w, extra = '') => h('div', { class: `bg-[#e4e9f1] h-[2.031px] rounded-[5.415px] shrink-0 ${extra}`, style: w ? { width: w + 'px' } : null })
  const rows = [2.37, 9.82, 16.59, 23.35, 30.12]
  return [
    h('img', { src: ellipse37, alt: '', width: 13.5385, height: 13.5385, class: 'absolute', style: { left: i + 'px', top: i + 'px' } }),
    h('div', { class: 'absolute flex flex-col gap-[1.354px] items-end', style: { right: i + 'px', top: i + 2.7 + 'px' } }, [bar(12.185), bar(14.892), bar(19.631)]),
    h('div', { class: 'absolute flex flex-col gap-[1.354px]', style: { right: i + 'px', top: i + 71.75 + 'px' } }, [bar(19.631), bar(19.631)]),
    h('div', { class: 'absolute flex gap-[5.415px] w-[58.215px]', style: { left: i + 0.67 + 'px', top: i + 18.27 + 'px' } }, [bar(0, 'flex-1'), bar(0, 'flex-1'), bar(0, 'flex-1')]),
    h('div', { class: 'absolute border-[0.338px] border-[#e4e9f1] h-[37.231px] w-[60.246px] overflow-hidden rounded-[2.708px]', style: { left: i + 'px', top: i + 24.36 + 'px' } },
      rows.map((top, r) => h('div', { class: 'absolute left-1/2 -translate-x-1/2 flex gap-[2.708px] w-[54.831px]', style: { top: top + 'px' } },
        [0, 1, 2].map(() => h('div', { class: `flex-1 h-[2.031px] rounded-[5.415px] ${r === 0 ? 'bg-[#a6b3cd]' : 'bg-[#e4e9f1]'}` }))))),
  ]
}
MiniInvoice.props = ['inset']

/* ── Fee + ETA column used by the payment method rows ── */
const PayMeta = (props) => h('span', { class: 'flex flex-col items-end gap-[2px] shrink-0 text-[12px] leading-[1.5] whitespace-nowrap' }, [
  h('span', { class: 'text-[#2bc37d]' }, props.method.eta),
  props.method.fee
    ? h('span', { class: 'text-[#03102f]' }, ['Fee: ', h('span', { class: 'font-medium', style: "font-family: 'Reddit Mono', ui-monospace, monospace;" }, props.method.fee)])
    : null,
])
PayMeta.props = ['method']

/* ── Paper (left) state machine: empty → uploading → attached → (scanning) → preview ── */
const paper = ref('empty')
const dragging = ref(false)
const fileName = ref('')
const progress = ref(0)
const scanning = ref(false)
const ZOOM_MIN = 50
const ZOOM_MAX = 200
let timers = []
const later = (fn, ms) => timers.push(setTimeout(fn, ms))
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; clearInterval(progressTimer) }
let progressTimer = null

function onSelect(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (file) startUpload(file.name)
}
function onDrop(e) {
  dragging.value = false
  if (paper.value !== 'empty') return
  const file = e.dataTransfer?.files?.[0]
  if (file) startUpload(file.name)
}

function startUpload(name) {
  clearTimers()
  fileName.value = name
  progress.value = 0
  paper.value = 'uploading'
  progressTimer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 10)
    if (progress.value >= 100) {
      clearInterval(progressTimer)
      paper.value = 'attached'
      later(() => { scanning.value = true }, 600)
      later(finishScan, 600 + 2600)
    }
  }, 110)
}

function finishScan() {
  if (!scanning.value) return
  scanning.value = false
  paper.value = 'preview'
  applyExtraction()
}

// Closing the modal stops extraction: the file stays attached, nothing is auto-filled
function cancelScan() {
  clearTimers()
  scanning.value = false
  paper.value = 'preview'
}

function removeFile() {
  clearTimers()
  paper.value = 'empty'
  fileName.value = ''
  progress.value = 0
  zoom.value = 100
  if (extracted.value) resetForm()
}

onBeforeUnmount(clearTimers)

// The shared invoice pane shows whenever this step has a document in preview
watch(paper, (p) => { flowShowPaper.value = p === 'preview' }, { immediate: true })
flowRemoveFile.value = removeFile
onActivated(() => {
  flowShowPaper.value = paper.value === 'preview'
  flowRemoveFile.value = removeFile
})

/* ── Form (right) ── */
const vendors = [
  { id: 'ebase', name: 'eBase LLC', meta: 'DBS Bank ****1234 • Tax ID: 1291283493910' },
  { id: 'sp', name: 'Singapore Power LLC', meta: 'Maybank ****1234 • Tax ID: 1291283493910' },
  { id: 'strawberry', name: 'Strawberry LLC', meta: 'HSBC ****1234 • Tax ID: 1291283493910' },
]
const categories = ['Fashion', 'Utilities', 'Software', 'Office supplies', 'Logistics', 'Marketing']
const billModes = [{ id: 'total', label: 'Total amount' }, { id: 'items', label: 'Line items' }]
const payMethods = [
  { id: 'swift', name: 'SWIFT', currency: 'SGD', bank: 'DBS Bank', last4: '1234', eta: '2-5 business days', fee: 'SGD 25.00' },
  { id: 'local', name: 'Local transfer', currency: 'AUD', bank: 'DBS Bank', last4: '6757', eta: '2-5 business days', fee: null },
]

const vendor = ref(null)
const vendorMatch = ref(true) // preview: does extraction find the vendor?
const vendorNotFound = ref(false)
const extracted = ref(false)
const billMode = ref('total')
const amount = ref('0.00')
const payMethod = ref(null)
const schedule = ref(false)
// FieldRows stores values keyed by field label
const form = reactive({ 'Invoice number': '', 'Invoice date': '', 'Due date': '', Category: '', Description: '' })
const scheduleDate = ref('')
const invoiceRows = [
  [{ label: 'Invoice number', placeholder: 'e.g. INV0001' }],
  [
    { label: 'Invoice date', type: 'date', iconLeading: true, placeholder: 'DD/MM/YYYY' },
    { label: 'Due date', type: 'date', iconLeading: true, placeholder: 'DD/MM/YYYY' },
  ],
  [{ label: 'Category', options: categories, placeholder: 'Select category' }],
  [{ label: 'Description', type: 'textarea', placeholder: 'What is invoice about' }],
]

const payMethodMeta = (m) => `${m.bank} • ${vendor.value?.name || 'Vendor'} / **** ${m.last4}`

function applyExtraction() {
  extracted.value = true
  Object.assign(form, { 'Invoice number': 'INV-0128HYY', 'Invoice date': '23/11/2023', 'Due date': '27/11/2023', Category: 'Fashion' })
  amount.value = '300.00'
  // Extracted line items (Figma 59:33033)
  lineItems.value = [
    blankItem({ name: 'Saucony Kinvara 14', description: 'Tempo run shoes', unitPrice: '150.00', quantity: '1', taxName: 'GST', taxRate: '10', category: 'Fashion' }),
    blankItem({ name: 'Asics Superblast 3', description: 'Super trainer shoes', unitPrice: '350.00', quantity: '1', taxName: 'GST', taxRate: '10', category: 'Fashion' }),
  ]
  applyVendorMatch()
}

// Preview switch re-applies live once a document has been extracted
watch(vendorMatch, () => { if (extracted.value) applyVendorMatch() })
function applyVendorMatch() {
  if (vendorMatch.value) {
    vendor.value = vendors[0]
    vendorNotFound.value = false
  } else {
    vendor.value = null
    vendorNotFound.value = true
  }
}

function resetForm() {
  extracted.value = false
  vendor.value = null
  vendorNotFound.value = false
  payMethod.value = null
  amount.value = '0.00'
  lineItems.value = [blankItem()]
  Object.assign(form, { 'Invoice number': '', 'Invoice date': '', 'Due date': '', Category: '', Description: '' })
}

const openMenu = ref(null)
function toggleMenu(id) {
  openMenu.value = openMenu.value === id ? null : id
  // Keep an opened dropdown fully visible above the sticky footer
  if (openMenu.value) {
    nextTick(() => {
      const el = document.querySelector('.dropdown')
      el?.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    })
  }
}
function pickVendor(v) { vendor.value = v; vendorNotFound.value = false; openMenu.value = null }
function pickPayMethod(m) { payMethod.value = m; openMenu.value = null }

/* ── Line items (Figma 54:29716) ── */
const ITEM_CURRENCIES = ['SGD', 'USD', 'EUR', 'GBP', 'MYR', 'IDR']
const itemsCurrency = ref('SGD')
const taxMode = ref('exclusive') // 'exclusive' adds tax on top · 'inclusive' prices already include it
let itemSeq = 0
const blankItem = (o = {}) => ({ id: ++itemSeq, name: '', description: '', unitPrice: '', quantity: '1', taxName: '', taxRate: '', category: '', ...o })
const lineItems = ref([blankItem()])

const num = (v) => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return Number.isFinite(n) ? n : 0 }
const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtMoneyInput = (v) => (String(v).trim() === '' ? '' : money(num(v)))

const itemNet = (it) => num(it.unitPrice) * (String(it.quantity).trim() === '' ? 1 : num(it.quantity))
const itemRate = (it) => num(it.taxRate) / 100
// Amount shown on each item always includes tax
const itemAmount = (it) => (taxMode.value === 'exclusive' ? itemNet(it) * (1 + itemRate(it)) : itemNet(it))
const itemsTotal = computed(() => lineItems.value.reduce((s, it) => s + itemAmount(it), 0))
// Subtotal = before tax
const itemsSubtotal = computed(() => lineItems.value.reduce((s, it) => s + (taxMode.value === 'exclusive' ? itemNet(it) : itemNet(it) / (1 + itemRate(it))), 0))

// Tax rows for the summary, grouped by tax name + rate, e.g. "Tax (GST - 10%)"
const taxLines = computed(() => {
  const groups = new Map()
  for (const it of lineItems.value) {
    const rate = num(it.taxRate)
    if (!rate) continue
    const net = taxMode.value === 'exclusive' ? itemNet(it) : itemNet(it) / (1 + rate / 100)
    const name = it.taxName.trim() || 'Tax'
    const key = `${name}|${rate}`
    const g = groups.get(key) || { label: `Tax (${name} - ${rate}%)`, amount: 0 }
    g.amount += net * (rate / 100)
    groups.set(key, g)
  }
  return [...groups.values()]
})

function addItem() { lineItems.value.push(blankItem()) }
function removeItem(id) { if (lineItems.value.length > 1) lineItems.value = lineItems.value.filter((it) => it.id !== id) }

// In Line items mode the bill amount follows the items total
watch([itemsTotal, billMode], () => { if (billMode.value === 'items') amount.value = money(itemsTotal.value) })

function formatAmount() {
  const n = parseFloat(String(amount.value).replace(/[^0-9.]/g, ''))
  amount.value = (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function close() { router.push('/bills') }
function next() { router.push({ path: '/bills/details', query: { stage: 'review' } }) }
</script>

<style scoped>
.field-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
  white-space: nowrap;
}

/* Input / select shell (Figma: Input · Basic, 36px) */
.field-input {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.field-bare::placeholder { color: #9295a5; }
/* Disabled (Figma: Background/Dark) — schedule date until the toggle is on */
.field-input--disabled { background: #f8f9fc; }
/* Focused — same as the shared FieldRows input (Figma: Input Shadow/Focused) */
.field-input:focus-within,
button.field-input:focus-visible,
button.field-input[aria-expanded='true'] {
  outline: none;
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.field-bare {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}

/* Amount input — inset shadow, Reddit Mono 24 (Figma 49:26824) */
.amount-field::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: inset 0px 3px 6px 0px #ccd4e3;
}
.amount-field { transition: border-color 150ms ease, box-shadow 150ms ease; }
.amount-field:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe !important;
}
.amount-input {
  min-width: 4ch;
  border: 0;
  outline: none;
  background: transparent;
  text-align: right;
  font-family: 'Reddit Mono', ui-monospace, monospace;
  font-weight: 500;
  font-size: 24px;
  line-height: 1.35;
  color: #03102f;
}

/* Secondary (white gradient) button */
.sec-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #f2f2f4;
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  transition: filter 150ms ease;
}
.sec-btn:hover:not(:disabled) { filter: brightness(0.96); }
.sec-btn:active:not(:disabled) { transform: translateY(1px); }
.sec-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: 24px;
  background: #f5f6f9;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #002771;
}

/* Dropdown Select (Figma 45:21929 / 44:17378) */
.dropdown {
  position: absolute;
  scroll-margin-bottom: 16px;
  left: 0;
  right: 0;
  z-index: 20;
  padding: 8px;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  background: #ffffff;
  filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.09));
  transform-origin: top center;
}
.dropdown-option {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 100ms ease;
}
.dropdown-option:hover { background: #f5f6f9; }
.add-new {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px 8px 4px;
  border-top: 1px solid #e5e6ea;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
}
.add-new:hover { color: #03102f; }

/* Motion (Motion guideline): menus 140ms in / 100ms out, modal fade + rise */
.dropdown-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.dropdown-leave-active { transition: opacity 100ms ease-in; }
.dropdown-enter-from { opacity: 0; transform: translateY(-4px) scale(0.98); }
.dropdown-leave-to { opacity: 0; }

.pop-enter-active { transition: opacity 200ms ease-out, transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }

.scan-modal-enter-active { transition: opacity 200ms ease-out; }
.scan-modal-leave-active { transition: opacity 130ms ease-in; }
.scan-modal-enter-from, .scan-modal-leave-to { opacity: 0; }
.scan-modal-enter-active .scan-card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.scan-modal-enter-from .scan-card { transform: translateY(8px); }

/* ── Line items ── */
/* Small select (Figma Input · 30px, 12px text) for currency + tax mode */
.mini-select {
  position: relative;
  display: flex;
  align-items: center;
  height: 30px;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.mini-select:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.mini-select select {
  appearance: none;
  width: 100%;
  height: 100%;
  padding: 0 28px 0 8px;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 12px;
  line-height: 1.5;
  color: #03102f;
  cursor: pointer;
}
.mini-select img { position: absolute; right: 8px; pointer-events: none; }

/* Inline label/value row (Figma: Invoice Input) — label left, value right-aligned */
.li-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 34px;
  padding: 4px 12px;
  border-bottom: 1px solid #e5e6ea;
  background: #ffffff;
  cursor: text;
  transition: background-color 150ms ease, box-shadow 150ms ease;
}
/* Hover + Focus (Figma 63:38431): #fcfcfd fill, soft inner shadow, light-blue bottom line.
   Hover adds the pencil before the value; focus (editing) hides it. */
.li-row:hover,
.li-row:focus-within {
  background: #fcfcfd;
  border-bottom-color: #80acfe;
  box-shadow: inset 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
}
/* Value group: pencil hugs the value (input sizes to its content where supported) */
.li-value {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}
/* Input hugs its text (no 88px min) so the pencil sits right before short values like "0.00";
   the whole row is a <label>, so the click target stays the full row. */
.li-value .li-input { flex: 0 1 auto; field-sizing: content; min-width: 1ch; max-width: 100%; }
.li-pencil {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms ease;
}
.li-row:hover .li-pencil { opacity: 1; }
.li-row:focus-within .li-pencil { opacity: 0; }
.li-label {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #61667c;
  white-space: nowrap;
}
.li-input {
  flex: 1;
  min-width: 88px;
  border: 0;
  outline: none;
  background: transparent;
  text-align: right;
  font-size: 13px;
  line-height: 1.5;
  color: #03102f;
  text-overflow: ellipsis;
}
.li-input::placeholder { color: #9295a5; }
.li-mono {
  font-family: 'Reddit Mono', ui-monospace, monospace;
  font-size: 14px;
  line-height: 1.4;
}
.li-select { appearance: none; text-align: right; text-align-last: right; }

/* Item add / remove — rise in, fade out (Motion guideline) */
.line-item-enter-active { transition: opacity 200ms ease-out, transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.line-item-leave-active { transition: opacity 130ms ease-in; }
.line-item-enter-from { opacity: 0; transform: translateY(8px); }
.line-item-leave-to { opacity: 0; }
.line-item-move { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
@media (prefers-reduced-motion: reduce) {
  .line-item-enter-active, .line-item-leave-active, .line-item-move { transition: none; }
  .line-item-enter-from { transform: none; }
}

/* Uploading: border trace. A conic gradient (faint track + bright #4c8afd head)
   is masked down to the 1.5px border ring and its start angle spins. */
@property --ring-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.upload-ring {
  position: absolute;
  inset: 0;
  border-radius: 4px;
  padding: 1.5px;
  pointer-events: none;
  background: conic-gradient(
    from var(--ring-angle),
    rgba(76, 138, 253, 0.18) 0deg,
    rgba(76, 138, 253, 0.18) 200deg,
    #4c8afd 320deg,
    rgba(76, 138, 253, 0.18) 360deg
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  animation: ring-spin 1.1s linear infinite;
}
@keyframes ring-spin { to { --ring-angle: 360deg; } }

/* Scan band (shared motion with the claim upload, SubmitClaimPage): the glow trails the line.
   Going down it sits above the line; at the bottom it folds over the line and trails below on
   the way back up, then folds again. Pivoting on the line (bottom edge) keeps the line from
   jumping during the fold. Travel 61px = line runs from the doc top area to its bottom edge. */
.scan-band {
  background: linear-gradient(to top, #b3cdfe, rgba(229, 238, 255, 0));
  transform-origin: 50% 100%;
  animation: scan-sweep 2.6s ease-in-out infinite;
}
@keyframes scan-sweep {
  0%   { transform: translate(-50%, 0) scaleY(1); }
  44%  { transform: translate(-50%, 61px) scaleY(1); }
  50%  { transform: translate(-50%, 61px) scaleY(-1); }
  94%  { transform: translate(-50%, 0) scaleY(-1); }
  100% { transform: translate(-50%, 0) scaleY(1); }
}

@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active, .dropdown-leave-active,
  .pop-enter-active, .scan-modal-enter-active, .scan-modal-leave-active,
  .scan-modal-enter-active .scan-card { transition: none; }
  /* Rest on the Figma frame: band at the bottom with the glow folded below the line */
  .scan-band { animation: none; transform: translate(-50%, 61px) scaleY(-1); }
  /* Static solid border instead of the travelling trace */
  .upload-ring { animation: none; background: #4c8afd; }
}
</style>
