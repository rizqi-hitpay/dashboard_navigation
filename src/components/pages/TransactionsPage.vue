<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex h-[60px] items-center justify-between gap-[32px] px-[24px] w-full shrink-0">
        <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Card transactions</p>
        <div class="flex items-center gap-[8px] shrink-0">
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          >
            <img :src="downloadIcon" width="16" height="16" alt="" class="shrink-0" />
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Export</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="matchOpen = true"
          >
            <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Match receipts</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">

        <!-- Table card -->
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar: segmented controls + search / filter -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px]">
              <button
                v-for="t in tabs"
                :key="t"
                type="button"
                class="flex items-center justify-center min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeTab === t ? 'bg-[#e5e6ea] font-medium text-[#03102f]' : 'font-normal text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeTab = t"
              >{{ t }}</button>
            </div>
            <div class="flex items-center gap-[8px] shrink-0">
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Search"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
              </button>
              <button
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                :class="filterOpen ? 'brightness-95' : ''"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Filter"
                ref="filterBtn"
                @click.stop="toggleFilter"
              >
                <img :src="filterIcon" width="16" height="16" alt="" />
              </button>
            </div>
          </div>

          <!-- Applied filters -->
          <div v-if="filterChips.length" class="flex items-center flex-wrap gap-[8px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <span class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Search for:</span>
            <span
              v-for="chip in filterChips"
              :key="chip.key"
              class="inline-flex items-center gap-[6px] min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-[#f2f2f4] text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap"
            >
              {{ chip.label }}
              <button type="button" class="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity" :aria-label="'Remove ' + chip.label" @click="removeChip(chip)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.6" stroke="#9295a5" stroke-width="1.1" /><path d="M5.2 5.2l3.6 3.6M8.8 5.2l-3.6 3.6" stroke="#9295a5" stroke-width="1.1" stroke-linecap="round" /></svg>
              </button>
            </span>
            <button type="button" class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap px-[4px] cursor-pointer hover:opacity-75 transition-opacity" @click="clearFilters">Clear all</button>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[1100px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 155px;" />
                <col />
                <col style="width: 150px;" />
                <col style="width: 200px;" />
                <col style="width: 100px;" />
                <col style="width: 135px;" />
                <col style="width: 130px;" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in columns"
                    :key="col.key"
                    class="bg-[#fcfcfd] h-[34px] border-b border-[#e5e6ea] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < columns.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
                  >
                    <div class="flex items-center gap-[8px]">
                      <span class="flex-1 min-w-px text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#03102f] whitespace-nowrap overflow-hidden text-ellipsis">{{ col.label }}</span>
                      <svg v-if="col.sortable" class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.9v8.2M3.8 7.9L7 11.1l3.2-3.2" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="txn in filteredTransactions"
                  :key="txn.id"
                  class="cursor-pointer transition-colors duration-150 [&:last-child>td]:border-b-0"
                  :class="selectedTxn && selectedTxn.id === txn.id ? 'bg-[#fcfcfd]' : 'hover:bg-[#fcfcfd]'"
                  @click="openTxn(txn)"
                >
                  <!-- Date -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ txn.date }}</span>
                  </td>
                  <!-- Card -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ txn.card }}</p>
                  </td>
                  <!-- Merchant -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ txn.merchant }}</p>
                  </td>
                  <!-- Category (sparkle = AI-categorised) -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div class="flex items-center gap-[4px]">
                      <img v-if="txn.aiCategory" :src="sparkleAiIcon" width="16" height="16" alt="" class="shrink-0" />
                      <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ txn.category }}</p>
                    </div>
                  </td>
                  <!-- GL code -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ txn.glCode }}</span>
                  </td>
                  <!-- Amount -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ txn.amount }}</span>
                  </td>
                  <!-- Status -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: STATUS[txn.status].bg, color: STATUS[txn.status].color }"
                    >{{ STATUS[txn.status].label }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between w-full px-[12px] shrink-0">
          <div class="flex items-start gap-[20px]">
            <button type="button" class="flex items-center justify-center gap-[2px] h-[36px] px-[2px] py-[8px] rounded-[4px] text-[13px] font-normal text-[#61667c] leading-[1.5] hover:bg-[#f0f1f5] transition-colors duration-150">
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.8 3.5L5.3 7l3.5 3.5" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
              Prev
            </button>
            <button type="button" class="flex items-center justify-center gap-[2px] h-[36px] px-[2px] py-[8px] rounded-[4px] text-[13px] font-normal text-[#61667c] leading-[1.5] hover:bg-[#f0f1f5] transition-colors duration-150">
              Next
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.2 3.5L8.7 7l-3.5 3.5" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </div>
          <div class="flex items-center gap-[8px] h-[36px] w-[167px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white cursor-pointer">
            <div class="flex flex-1 items-center gap-[4px] min-w-px whitespace-nowrap">
              <span class="text-[14px] font-normal text-[#9295a5] tracking-[0.15px] leading-[20px] overflow-hidden text-ellipsis">Item per page:</span>
              <span class="flex-1 min-w-px text-[14px] font-medium text-[#03102f] tracking-[0.1px] leading-[20px] overflow-hidden text-ellipsis">10</span>
            </div>
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 7l4.5 4.5L13.5 7" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
        </div>

      </div>
    </div>

    <!-- Filter popover (Figma: 110:16119) -->
    <Teleport to="body">
      <div v-if="filterOpen" class="fixed inset-0 z-40" @click="filterOpen = false" />
      <Transition name="filter-pop">
        <div
          v-if="filterOpen"
          class="fixed z-50 w-[290px] rounded-[8px] bg-white flex flex-col gap-[12px] p-[12px]"
          style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
          :style="{ left: filterPos.left + 'px', top: filterPos.top + 'px' }"
        >
          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Card</span>
            <MultiSelect v-model="fDraft.cards" :options="cardOptions" placeholder="All cards" />
          </div>

          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Date</span>
            <div class="txd-control gap-[6px] px-[8px]">
              <img :src="calendarIcon" width="16" height="16" alt="" class="shrink-0" />
              <input v-model="fDraft.dateFrom" type="text" placeholder="Start date" class="txd-input min-w-0 flex-1" />
              <span class="text-[12px] text-[#9295a5] shrink-0">To</span>
              <input v-model="fDraft.dateTo" type="text" placeholder="End date" class="txd-input min-w-0 flex-1" />
            </div>
          </div>

          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Category</span>
            <MultiSelect v-model="fDraft.categories" :options="CATEGORIES" placeholder="All categories" />
          </div>

          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">GL Code</span>
            <MultiSelect v-model="fDraft.glCodes" :options="GL_CODES" placeholder="All GL code" />
          </div>

          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Status</span>
            <MultiSelect v-model="fDraft.statuses" :options="statusOptions" placeholder="All statuses" :searchable="false" />
          </div>

          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Merchant</span>
            <MultiSelect v-model="fDraft.merchants" :options="merchantOptions" placeholder="All merchant" />
          </div>

          <div class="flex flex-col gap-[4px]">
            <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Amount</span>
            <div class="flex items-center gap-[8px]">
              <div class="txd-control txd-control--half gap-[4px] px-[8px]">
                <span class="text-[14px] text-[#9295a5] shrink-0">From:</span>
                <input v-model="fDraft.amountFrom" type="text" placeholder="200" class="txd-input min-w-0 flex-1" />
              </div>
              <div class="txd-control txd-control--half gap-[4px] px-[8px]">
                <span class="text-[14px] text-[#9295a5] shrink-0">To:</span>
                <input v-model="fDraft.amountTo" type="text" placeholder="1,000" class="txd-input min-w-0 flex-1" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-[8px] pt-[4px]">
            <button
              type="button"
              class="flex-1 flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[14px] font-medium text-[#61667c] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
              @click="filterOpen = false"
            >Cancel</button>
            <button
              type="button"
              class="flex-1 flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#2465de] text-[14px] font-medium text-white transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9; text-shadow: 0px 1px 1px rgba(0,0,0,0.12);"
              @click="applyFilters"
            >Apply</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Transaction detail drawer (Figma: 88:12382 / FX variant 143:19447).
         Slides via a plain CSS class toggle — always mounted, so it never
         depends on JS transition hooks. -->
    <div
      class="txn-drawer absolute inset-y-0 right-0 z-30 w-[440px] max-w-full bg-white border-l border-[#e5e6ea] flex flex-col"
      :class="{ 'txn-drawer--open': !!selectedTxn }"
      :aria-hidden="!selectedTxn"
    >
      <template v-if="renderTxn">
        <!-- Header -->
        <div class="flex items-start justify-between gap-[16px] px-[24px] py-[16px] border-b border-[#e5e6ea] shrink-0">
          <div class="flex flex-col gap-[2px] min-w-0">
            <p class="text-[18px] font-semibold text-[#03102f] leading-[1.35] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ headerAmount }}</p>
            <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ detailDate }} <span class="text-[#9295a5]">・</span> {{ renderTxn.merchant }}</p>
          </div>
          <div class="flex items-center gap-[4px] shrink-0">
            <button type="button" class="flex items-center justify-center size-[28px] rounded-[6px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="More">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3.2" cy="8" r="1.3" fill="#61667c" /><circle cx="8" cy="8" r="1.3" fill="#61667c" /><circle cx="12.8" cy="8" r="1.3" fill="#61667c" /></svg>
            </button>
            <button type="button" class="flex items-center justify-center size-[28px] rounded-[6px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="selectedTxn = null">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 min-h-0 overflow-y-auto px-[24px] pt-[20px] pb-[24px] flex flex-col gap-[20px]">

          <!-- Charge details (foreign-currency transactions) -->
          <div v-if="fxDetails" class="flex flex-col gap-[8px]">
            <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Charge details</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-center gap-[16px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Merchant's charge</span>
                <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fxDetails.charge }}</span>
              </div>
              <div class="flex items-center gap-[16px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Exchanged rate</span>
                <span class="text-[13px] font-normal text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fxDetails.rate }}</span>
              </div>
              <div class="flex items-center gap-[16px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Exchanged amount</span>
                <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fxDetails.exchanged }}</span>
              </div>
              <div class="flex items-center gap-[16px]">
                <span class="w-[160px] shrink-0 flex items-center gap-[4px] text-[13px] font-normal text-[#61667c] leading-[1.5]">Cashback <img :src="questionIcon" width="14" height="14" alt="" /></span>
                <span class="text-[13px] font-semibold text-[#238b5b] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ cashback }}</span>
              </div>
            </div>
          </div>

          <!-- Transaction details -->
          <div class="flex flex-col gap-[8px]">
            <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Transaction details</p>
            <div class="flex flex-col gap-[8px]">
              <div class="flex items-center gap-[16px] min-h-[24px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Date</span>
                <span class="text-[13px] font-normal text-[#03102f] leading-[1.5]">{{ detailDate }}</span>
              </div>
              <div class="flex items-center gap-[16px] min-h-[24px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Merchant</span>
                <span class="text-[13px] font-normal text-[#03102f] leading-[1.5]">{{ renderTxn.merchant }}</span>
              </div>
              <div class="flex items-center gap-[16px] min-h-[24px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Card</span>
                <button type="button" class="flex items-center gap-[4px] text-[13px] font-normal text-[#2465de] leading-[1.5] cursor-pointer hover:opacity-75 transition-opacity" @click="openCard">
                  {{ cardNickname }}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4.5 11.5l7-7M6 4.2h5.8V10" stroke="#2465de" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </button>
              </div>
              <div v-if="!fxDetails" class="flex items-center gap-[16px] min-h-[24px]">
                <span class="w-[160px] shrink-0 flex items-center gap-[4px] text-[13px] font-normal text-[#61667c] leading-[1.5]">Cashback <img :src="questionIcon" width="14" height="14" alt="" /></span>
                <span class="text-[13px] font-semibold text-[#238b5b] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ cashback }}</span>
              </div>
              <div class="flex items-center gap-[16px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Category</span>
                <div class="txd-control flex-1">
                  <select v-model="drawerDraft.category" class="txd-select">
                    <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
                  </select>
                  <svg class="txd-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
                </div>
              </div>
              <div class="flex items-center gap-[16px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">GL Code</span>
                <div class="txd-control flex-1">
                  <select v-model="drawerDraft.glCode" class="txd-select">
                    <option v-for="g in GL_CODES" :key="g" :value="g">{{ g }}</option>
                  </select>
                  <svg class="txd-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
                </div>
              </div>
              <div class="flex items-center gap-[16px] min-h-[24px]">
                <span class="w-[160px] shrink-0 text-[13px] font-normal text-[#61667c] leading-[1.5]">Status</span>
                <span
                  class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                  :style="{ background: STATUS[renderTxn.status].bg, color: STATUS[renderTxn.status].color }"
                >{{ STATUS[renderTxn.status].label }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="flex flex-col gap-[8px]">
            <p class="text-[13px] font-normal text-[#61667c] leading-[1.5]">Notes</p>
            <textarea
              v-model="drawerDraft.notes"
              rows="3"
              placeholder="Add a note — purpose, project, client, or any context for this transactions"
              class="txd-textarea"
            />
          </div>

          <!-- Attachments -->
          <VerificationDropzone label="Attachments" v-model:files="attachFiles" :mock-files="MOCK_FILES" />
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end px-[24px] py-[16px] border-t border-[#f2f2f4] shrink-0">
          <button
            type="button"
            class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] text-[14px] font-medium text-white transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9; text-shadow: 0px 1px 1px rgba(0,0,0,0.12);"
            @click="saveTxn"
          >Save</button>
        </div>
      </template>
    </div>

    <!-- Match receipts flow (Figma: 165:50653) -->
    <MatchReceiptsModal :open="matchOpen" @close="matchOpen = false" @matched="onReceiptsMatched" />

    <!-- Success snackbar (same recipe as CardsPage) -->
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

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cards } from '../../composables/useCards.js'
import VerificationDropzone from '../verification/VerificationDropzone.vue'
import MultiSelect from '../forms/MultiSelect.vue'
import MatchReceiptsModal from '../modals/MatchReceiptsModal.vue'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'
import filterIcon from '../../assets/icons/icon-filter.svg'
import downloadIcon from '../../assets/icons/icon-download.svg'
import sparkleAiIcon from '../../assets/icons/icon-sparkle-ai.svg'
import questionIcon from '../../assets/icons/icon-question-circle.svg'
import calendarIcon from '../../assets/icons/icon-calendar.svg'

// Toolbar segmented controls — Frozen shows transactions made on frozen cards
const tabs = ['All', 'Frozen']
const activeTab = ref('All')

const columns = [
  { key: 'date', label: 'Created at', sortable: true },
  { key: 'card', label: 'Card', sortable: true },
  { key: 'merchant', label: 'Merchant', sortable: true },
  { key: 'category', label: 'Category', sortable: false },
  { key: 'glCode', label: 'GL code', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
]

const STATUS = {
  pending: { label: 'Pending', bg: '#fff9ec', color: '#bd8400' },
  success: { label: 'Success', bg: '#e6f9f0', color: '#238b5b' },
  refunded: { label: 'Refunded', bg: '#f7edfd', color: '#7d1ab7' },
  partial: { label: 'Partial refund', bg: '#f7edfd', color: '#7d1ab7' },
  cancelled: { label: 'Canceled', bg: '#f9e9e9', color: '#c20a1c' },
}

const transactions = reactive([
  { id: 1, date: 'Mar 15 09:00:00', card: 'Travel card (** 2301)', merchant: 'Singapore Airlines', category: 'Travel', glCode: '229', amount: '- SGD 1,487.65', status: 'pending' },
  { id: 2, date: 'Jul 04 14:30:00', card: 'Marketing expenses (** 2301)', merchant: 'Marriot Hotel', category: 'Accommodation', aiCategory: true, glCode: '309', amount: '- SGD 1,024.39', status: 'success' },
  { id: 3, date: 'Oct 30 18:45:00', card: 'Accounting Group (** 4829)', merchant: 'Grab', category: 'Transport', glCode: '570', amount: '- USD 89.22', status: 'refunded' },
  { id: 4, date: 'Jan 12 09:00:00', card: 'Budget Crew (** 5937)', merchant: 'Nexa', category: 'Entertainment', glCode: '220', amount: '- USD 32.77', status: 'success' },
  { id: 5, date: 'Feb 22 14:30:00', card: 'Finance Squad (** 7614)', merchant: 'Vortex', category: 'Office Supplies', aiCategory: true, glCode: '210', amount: '- SGD 1,250.11', status: 'cancelled' },
  { id: 6, date: 'Aug 09 18:45:00', card: 'Accounting Team (** 3842)', merchant: 'Lumina', category: 'Travel', glCode: '430', amount: '- CAD 678.54', status: 'success' },
  { id: 7, date: 'Nov 01 12:00:00', card: 'Budget Team (** 9276)', merchant: 'Zephyr', category: 'Meals & Dining', aiCategory: true, glCode: '230', amount: '- SGD 1,089.33', status: 'partial' },
  { id: 8, date: 'Apr 25 10:15:00', card: 'Finance Department (** 1508)', merchant: 'Orion', category: 'Utilities', aiCategory: true, glCode: '990', amount: '- SGD 1,345.90', status: 'success' },
  { id: 9, date: 'Apr 25 10:15:00', card: 'Accounting Crew (** 6743)', merchant: 'Aether', category: 'Software Subscriptions', glCode: '380', amount: '- SGD 1,712.08', status: 'refunded' },
  { id: 10, date: 'Apr 25 10:15:00', card: 'Budget Department (** 8391)', merchant: 'Solara', category: 'Marketing', glCode: '110', amount: '- SGD 1,403.67', status: 'success' },
  { id: 11, date: 'Apr 25 10:15:00', card: 'Finance Group (** 2057)', merchant: 'Cresta', category: 'Training & Development', glCode: '610', amount: '- SGD 1,987.45', status: 'success' },
  { id: 12, date: 'Apr 25 10:15:00', card: 'Developer (** 2301)', merchant: 'Cursor', category: 'Development', glCode: '832', amount: '- SGD 1,156.48', status: 'cancelled', frozen: true },
])

const filteredTransactions = computed(() => {
  let list = activeTab.value === 'Frozen' ? transactions.filter((t) => t.frozen) : [...transactions]

  const f = appliedFilters.value
  if (!f) return list
  if (f.cards.length) list = list.filter((t) => f.cards.includes(t.card.split(' (')[0]))
  if (f.categories.length) list = list.filter((t) => f.categories.includes(t.category))
  if (f.glCodes.length) list = list.filter((t) => f.glCodes.includes(t.glCode))
  if (f.statuses.length) list = list.filter((t) => f.statuses.includes(t.status))
  if (f.merchants.length) list = list.filter((t) => f.merchants.includes(t.merchant))
  const from = parseFilterAmount(f.amountFrom)
  const to = parseFilterAmount(f.amountTo)
  if (from != null) list = list.filter((t) => txnValue(t) >= from)
  if (to != null) list = list.filter((t) => txnValue(t) <= to)
  return list
})

// ── Filter popover (Figma: 110:16119) ──
const filterOpen = ref(false)
const filterPos = ref({ left: 0, top: 0 })

// The five dropdowns accept multiple values (DES-912 feedback)
const MULTI_KEYS = ['cards', 'categories', 'glCodes', 'statuses', 'merchants']
const emptyFilters = () => ({ cards: [], dateFrom: '', dateTo: '', categories: [], glCodes: [], statuses: [], merchants: [], amountFrom: '', amountTo: '' })
const fDraft = reactive(emptyFilters())
const appliedFilters = ref(null)

const cardOptions = computed(() => [...new Set(transactions.map((t) => t.card.split(' (')[0]))])
const merchantOptions = computed(() => [...new Set(transactions.map((t) => t.merchant))])
const statusOptions = Object.entries(STATUS).map(([value, meta]) => ({ value, label: meta.label, dot: meta.color }))

function txnValue(t) {
  return parseFloat(t.amount.replace('- ', '').split(' ')[1].replace(/,/g, ''))
}

function parseFilterAmount(v) {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && String(v).trim() !== '' ? n : null
}

const filterBtn = ref(null)

function positionFilter() {
  const rect = filterBtn.value.getBoundingClientRect()
  filterPos.value = {
    left: Math.max(8, Math.min(rect.right - 290, window.innerWidth - 298)),
    top: rect.bottom + 4,
  }
}

function toggleFilter() {
  if (filterOpen.value) {
    filterOpen.value = false
    return
  }
  positionFilter()
  filterOpen.value = true
  // Re-measure next frame in case the layout is still settling
  requestAnimationFrame(positionFilter)
}

const hasFilters = (f) => Object.entries(f).some(([k, v]) => (Array.isArray(v) ? v.length : v !== ''))

function applyFilters() {
  const snapshot = { ...fDraft }
  for (const k of MULTI_KEYS) snapshot[k] = [...fDraft[k]]
  appliedFilters.value = hasFilters(snapshot) ? snapshot : null
  filterOpen.value = false
}

const filterChips = computed(() => {
  const f = appliedFilters.value
  if (!f) return []
  const chips = []
  // One chip per input; multiple values are comma-separated
  if (f.cards.length) chips.push({ key: 'cards', label: `Card: ${f.cards.join(', ')}` })
  if (f.dateFrom || f.dateTo) chips.push({ key: 'date', label: `Date: ${f.dateFrom || '…'} - ${f.dateTo || '…'}` })
  if (f.categories.length) chips.push({ key: 'categories', label: `Category: ${f.categories.join(', ')}` })
  if (f.glCodes.length) chips.push({ key: 'glCodes', label: `GL Code: ${f.glCodes.join(', ')}` })
  if (f.statuses.length) chips.push({ key: 'statuses', label: `Status: ${f.statuses.map((s) => STATUS[s].label).join(', ')}` })
  if (f.merchants.length) chips.push({ key: 'merchants', label: `Merchant: ${f.merchants.join(', ')}` })
  if (f.amountFrom || f.amountTo) chips.push({ key: 'amount', label: `Amount: ${f.amountFrom || '0'} - ${f.amountTo || '∞'}` })
  return chips
})

function removeChip(chip) {
  const f = { ...appliedFilters.value }
  for (const k of MULTI_KEYS) f[k] = [...appliedFilters.value[k]]
  if (chip.key === 'date') { f.dateFrom = ''; f.dateTo = '' }
  else if (chip.key === 'amount') { f.amountFrom = ''; f.amountTo = '' }
  else f[chip.key] = []   // clears every value from that input
  appliedFilters.value = hasFilters(f) ? f : null
  Object.assign(fDraft, f)
}

function clearFilters() {
  appliedFilters.value = null
  Object.assign(fDraft, emptyFilters())
}

// ── Transaction detail drawer (Figma: 88:12382 / FX 143:19447) ──
const router = useRouter()
const selectedTxn = ref(null)
// Keeps the last-opened transaction rendered while the drawer slides shut
const renderTxn = ref(null)
const drawerDraft = reactive({ category: '', glCode: '', notes: '' })
const attachFiles = ref([])

const CATEGORIES = ['Travel', 'Accommodation', 'Transport', 'Entertainment', 'Office Supplies', 'Meals & Dining', 'Utilities', 'Software Subscriptions', 'Marketing', 'Training & Development', 'Development']
const GL_CODES = ['110', '210', '220', '229', '230', '309', '380', '430', '570', '610', '832', '990', '6110', '7188']
const FX_RATES = { USD: 1.28, CAD: 0.95 }
const MOCK_FILES = [
  { name: 'Receipt.pdf', kind: 'pdf', size: '128 KB' },
  { name: 'Invoice.pdf', kind: 'pdf', size: '86 KB' },
]

function openTxn(txn) {
  selectedTxn.value = txn
  renderTxn.value = txn
  drawerDraft.category = txn.category
  drawerDraft.glCode = txn.glCode
  drawerDraft.notes = txn.notes || ''
  attachFiles.value = txn.attachments ? [...txn.attachments] : []
}

function saveTxn() {
  Object.assign(renderTxn.value, {
    category: drawerDraft.category,
    glCode: drawerDraft.glCode,
    notes: drawerDraft.notes,
    attachments: [...attachFiles.value],
  })
  selectedTxn.value = null
}

// ── Match receipts (Figma: 165:50653) ──
// Each uploaded receipt auto-matches to a transaction; the drawer then shows
// it under Attachments for that transaction
const matchOpen = ref(false)

function onReceiptsMatched(receipts) {
  matchOpen.value = false
  receipts.forEach((file, i) => {
    const txn = transactions[i]
    if (!txn) return
    const existing = txn.attachments || []
    // ai flag renders the sparkle badge on the attachment row (Figma: 165:50655)
    if (!existing.some((f) => f.name === file.name)) txn.attachments = [...existing, { ...file, ai: true }]
  })
  const n = Math.min(receipts.length, transactions.length)
  showToast(`${n} transaction${n === 1 ? '' : 's'} updated successfully`)
}

// Snackbar — same one-shot toast recipe as CardsPage
const toast = ref('')
let toastTimer = null

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3200)
}

// "- USD 32.77" → { currency: 'USD', value: 32.77 }
function parseTxnAmount(txn) {
  const [currency, raw] = txn.amount.replace('- ', '').split(' ')
  return { currency, value: parseFloat(raw.replace(/,/g, '')) }
}

function money(currency, n) {
  return `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const headerAmount = computed(() => renderTxn.value.amount.replace('- ', ''))

// 'Mar 15 09:00:00' → '15/03/2026'
const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
const detailDate = computed(() => {
  const [mon, day] = renderTxn.value.date.split(' ')
  return `${day}/${MONTHS[mon]}/2026`
})

// Foreign-currency transactions get the charge breakdown on top
const fxDetails = computed(() => {
  const { currency, value } = parseTxnAmount(renderTxn.value)
  if (currency === 'SGD') return null
  const rate = FX_RATES[currency] ?? 1
  return {
    charge: money(currency, value),
    rate: `${currency} 1 = ${rate} SGD`,
    exchanged: money('SGD', value * rate),
  }
})

// Cashback: 1.75% of the SGD amount (matches the design's SGD 680.50 → 11.91)
const cashback = computed(() => {
  const { currency, value } = parseTxnAmount(renderTxn.value)
  const sgd = currency === 'SGD' ? value : value * (FX_RATES[currency] ?? 1)
  return money('SGD', sgd * 0.0175)
})

const cardNickname = computed(() => renderTxn.value.card.split(' (')[0])

function openCard() {
  const target = cards.find((c) => c.nickname === cardNickname.value)
  if (target) router.push({ path: '/cards/details', query: { id: target.id } })
}
</script>

<style scoped>
/* ── Drawer selects + notes (Figma: Input / State=Default) ── */
.txd-control {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  height: 36px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.txd-control:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.txd-select {
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
.txd-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.txd-control--half {
  width: auto;
  flex: 1;
  min-width: 0;
}
.txd-input {
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.txd-input::placeholder { color: #9295a5; }

/* Filter popover motion — same as the row menus */
.filter-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.filter-pop-leave-active { transition: opacity 100ms ease-in; transform-origin: top right; }
.filter-pop-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.filter-pop-leave-to { opacity: 0; }
.txd-textarea {
  width: 100%;
  min-height: 96px;
  padding: 8px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.txd-textarea:focus {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.txd-textarea::placeholder { color: #9295a5; }

/* Drawer slides in from the right (agent-panel timing token) */
.txn-drawer {
  transform: translateX(100%);
  visibility: hidden;
  box-shadow: -12px 0px 32px 0px rgba(38, 42, 50, 0.08);
  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1), visibility 0s linear 280ms;
}
.txn-drawer--open {
  transform: none;
  visibility: visible;
  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Snackbar motion — same as CardsPage */
.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .txn-drawer,
  .filter-pop-enter-active, .filter-pop-leave-active,
  .snackbar-enter-active, .snackbar-leave-active,
  .txd-control, .txd-textarea { transition: none; }
  .filter-pop-enter-from { transform: none; }
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
}
</style>
