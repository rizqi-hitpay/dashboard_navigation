<template>
  <!-- Root stays fixed so the submit claim pages pin to the content card; the list scrolls inside -->
  <div class="relative bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 min-h-0 flex-col items-start w-full pt-[4px] overflow-y-auto overflow-x-hidden">

      <!-- Page title + actions -->
      <div class="flex items-center justify-between gap-[32px] px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-col gap-[8px] min-w-px">
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">Claims</p>
          <!-- Payout account claims are reimbursed to -->
          <!-- Hovering the account reveals Edit (Figma: 146:70578) -->
          <div class="group flex items-center gap-[16px]">
            <div class="flex items-center gap-[4px]">
              <img :src="bankIcon" alt="" width="14" height="14" class="shrink-0" />
              <p class="text-[12px] leading-[1.5] text-[#61667c] whitespace-nowrap">
                Reimburse to <span class="text-[#03102f]">{{ reimburseAccount.bank }} / **** {{ reimburseAccount.last4 }}</span>{{ ' ' }}<span class="font-medium text-[#03102f]">({{ reimburseAccount.currency }})</span>
              </p>
            </div>
            <button
              type="button"
              class="text-[12px] font-medium text-[#2465de] leading-[1.5] opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 hover:underline"
              @click="openAccountPicker"
            >Edit</button>
          </div>
        </div>
        <button
          type="button"
          class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
          @click="droppedFile = null; submitOpen = true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#fff" stroke-width="1.5" stroke-linecap="round" /></svg>
          <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Submit Claims</span>
        </button>
      </div>

      <!-- Tab group: All claims / My claims (Admin/Owner only) -->
      <div v-if="isAdmin" class="w-full px-[24px] pt-[8px] pb-[8px] shrink-0">
        <div class="flex items-start border-b border-[#e5e6ea]">
          <button
            v-for="t in viewTabs"
            :key="t"
            type="button"
            class="flex items-center justify-center min-w-[88px] px-[12px] pb-[8px] -mb-px text-[12px] leading-[1.5] whitespace-nowrap border-b-2 transition-colors duration-150"
            :class="activeView === t ? 'border-[#2465de] font-medium text-[#03102f]' : 'border-transparent font-normal text-[#61667c] hover:text-[#03102f]'"
            @click="activeView = t"
          >{{ t }}</button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[24px] w-full px-[24px] pt-[12px] pb-[12px]">

        <!-- Table card — also a drop target for receipts (Figma: 182:47755) -->
        <div
          class="relative w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white"
          @dragenter="onDragEnter"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop.prevent="onTableDrop"
        >

          <!-- Toolbar: status segmented controls + search / filter -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px]">
              <button
                v-for="t in statusTabs"
                :key="t"
                type="button"
                class="flex items-center justify-center min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeStatus === t ? 'bg-[#e5e6ea] font-medium text-[#03102f]' : 'font-normal text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeStatus = t"
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
                ref="filterBtn"
                type="button"
                class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                :class="filterOpen ? 'brightness-95' : ''"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                aria-label="Filter"
                @click.stop="toggleFilter"
              >
                <img :src="filterIcon" alt="" width="16" height="16" />
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
              <button type="button" class="flex items-center justify-center shrink-0 cursor-pointer hover:opacity-70 transition-opacity" :aria-label="'Remove ' + chip.label" @click="removeChip(chip.key)">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.6" stroke="#9295a5" stroke-width="1.1" /><path d="M5.2 5.2l3.6 3.6M8.8 5.2l-3.6 3.6" stroke="#9295a5" stroke-width="1.1" stroke-linecap="round" /></svg>
              </button>
            </span>
            <button type="button" class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap px-[4px] cursor-pointer hover:opacity-75 transition-opacity" @click="clearFilters">Clear all</button>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[1000px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 149px;" />
                <col />
                <col />
                <col />
                <col style="width: 183px;" />
                <col style="width: 126px;" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in columns"
                    :key="col.key"
                    class="bg-[#fcfcfd] h-[34px] border-b-[0.5px] border-[#cbcdd4] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < columns.length - 1 ? 'border-r border-r-[#e5e6ea]' : ''"
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
                  v-for="c in filteredClaims"
                  :key="c.id"
                  class="cursor-pointer transition-colors duration-150 [&:last-child>td]:border-b-0"
                  :class="detailClaimId === c.id ? 'bg-[#f8f9fc]' : 'hover:bg-[#fcfcfd]'"
                  @click="openDetail(c)"
                >
                  <!-- Date -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ c.date }}</span>
                  </td>
                  <!-- Merchant -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ c.merchant }}</p>
                  </td>
                  <!-- Staff (Admin/Owner) or Descriptions (Employee) -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ isAdmin ? c.staff : c.description }}</p>
                  </td>
                  <!-- Category -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] border border-[#cbcdd4] bg-white text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">{{ c.category }}</span>
                  </td>
                  <!-- Amount (exchange icon marks foreign-currency claims) -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <div class="flex items-center gap-[4px]">
                      <img
                        v-if="c.fx"
                        :src="exchangeIcon"
                        alt="Foreign currency"
                        width="16"
                        height="16"
                        class="shrink-0 cursor-help"
                        @mouseenter="showFxTooltip($event, c.fx)"
                        @mouseleave="fxTooltip = null"
                      />
                      <span class="flex-1 min-w-px text-right text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap overflow-hidden text-ellipsis" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ c.amount }}</span>
                    </div>
                  </td>
                  <!-- Status -->
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: statusStyle(c.status).bg, color: statusStyle(c.status).text }"
                    >{{ c.status === 'Need approval' ? 'Need Approval' : c.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Drop overlay: blurs the table, receipt + add mark in the middle -->
          <Transition name="drop-zone">
            <div v-if="dropActive" class="drop-zone absolute inset-0 z-20 pointer-events-none" aria-hidden="true">
              <div class="drop-zone__art absolute left-1/2 top-1/2">
                <div class="drop-zone__receipt">
                  <img :src="dropReceiptIcon" alt="" class="drop-zone__receipt-img" />
                </div>
                <span class="drop-zone__add"><img :src="plusWhiteIcon" width="18" height="18" alt="" /></span>
              </div>
            </div>
          </Transition>
        </div>
        <p class="sr-only" role="status">{{ dropActive ? 'Drop a receipt to submit a new claim' : '' }}</p>

        <!-- Pagination -->
        <div class="relative flex items-center justify-center w-full shrink-0">
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
          <div class="absolute right-0 flex items-center gap-[8px] h-[36px] w-[167px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white cursor-pointer">
            <div class="flex flex-1 items-center gap-[4px] min-w-px whitespace-nowrap">
              <span class="text-[14px] font-normal text-[#9295a5] tracking-[0.15px] leading-[20px] overflow-hidden text-ellipsis">Item per page:</span>
              <span class="flex-1 min-w-px text-[14px] font-medium text-[#03102f] tracking-[0.1px] leading-[20px] overflow-hidden text-ellipsis">10</span>
            </div>
            <svg class="shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 7l4.5 4.5L13.5 7" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit claim flow (Figma: 71:21714) — covers the list, sidebar stays visible -->
    <Transition name="full-page">
      <SubmitClaimPage v-if="submitOpen" :key="submitKey" :reimburse-currency="reimburseAccount.currency" :initial-file="droppedFile" @close="submitOpen = false" @submit="onClaimSubmitted" />
    </Transition>
    <Transition name="full-page">
      <ClaimSubmittedPage
        v-if="submittedClaim"
        :claim="submittedClaim"
        @close="submittedClaim = null"
        @view="viewSubmittedClaim"
        @submit-another="submitAnother"
      />
    </Transition>

    <!-- Claim details (Figma: 71:22038) — floats over the list -->
    <Transition name="detail-panel">
      <ClaimDetailPanel
        v-if="detailClaim && !submitOpen && !submittedClaim"
        :claim="detailClaim"
        :categories="categoryOptions"
        :role="claimsRole"
        @close="detailClaimId = null"
        @update="onClaimUpdated"
        @approve="onClaimApproved"
        @reject="onClaimRejected"
        @create-reimbursement="(c) => router.push({ path: '/claims/reimbursements', query: { new: 1, staff: c.staff, claim: c.id } })"
      />
    </Transition>

    <!-- Confirmation after editing (Figma: Snackbar/Small) -->
    <!-- Centred over the list, clear of the details panel when it's open -->
    <div class="absolute top-[24px] inset-x-0 z-50 flex justify-center pointer-events-none" :style="{ paddingRight: detailClaim ? '504px' : '0' }">
      <Transition name="snackbar">
        <div
          v-if="toast"
          class="flex items-center gap-[4px] pl-[8px] pr-[12px] py-[8px] rounded-[8px] bg-[#e6f9f0] border border-[#b3eed2]"
          style="filter: drop-shadow(0px 8px 6px rgba(42,50,82,0.04));"
          role="status"
        >
          <img :src="toastCheckIcon" width="16" height="16" alt="" class="shrink-0" />
          <span class="text-[12px] text-[#03102f] leading-[1.5] whitespace-nowrap">{{ toast }}</span>
        </div>
      </Transition>
    </div>

    <!-- Reimburse-to account -->
    <BaseModal :open="accountPickerOpen" :width="400" @close="accountPickerOpen = false">
      <template #header>
        <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea]">
          <p class="flex-1 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4]">Reimburse to</p>
          <button type="button" class="flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#f0f1f5]" aria-label="Close" @click="accountPickerOpen = false"><img :src="modalCloseIcon" width="20" height="20" alt="" /></button>
        </div>
      </template>
      <div class="flex flex-col gap-[8px] p-[24px]">
        <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Approved claims are paid out to this account</p>
        <div class="flex flex-col rounded-[8px] border border-[#e5e6ea] overflow-hidden" role="radiogroup" aria-label="Bank account">
          <button
            v-for="(a, i) in REIMBURSE_ACCOUNTS"
            :key="a.last4"
            type="button"
            role="radio"
            :aria-checked="pickedAccount === i"
            class="flex items-center gap-[12px] w-full px-[12px] py-[8px] text-left transition-colors duration-150"
            :class="[i > 0 ? 'border-t border-[#e5e6ea]' : '', pickedAccount === i ? 'bg-[#fcfcfd]' : 'hover:bg-[#fcfcfd]']"
            @click="pickedAccount = i"
          >
            <span class="radio" :class="{ 'is-on': pickedAccount === i }"><img v-if="pickedAccount === i" :src="radioActive" alt="" class="radio-dot" /></span>
            <span class="flex-1 text-[14px] text-[#03102f] leading-[1.5]">{{ a.bank }} / **** {{ a.last4 }}</span>
            <span class="currency-chip">{{ a.currency }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center justify-between px-[16px] py-[20px] border-t border-[#e5e6ea]">
        <button
          type="button"
          class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[14px] font-medium text-[#61667c] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
          @click="accountPickerOpen = false"
        >Cancel</button>
        <button
          type="button"
          class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] text-[14px] font-medium text-white transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9; text-shadow: 0px 1px 1px rgba(0,0,0,0.12);"
          @click="saveAccount"
        >Save</button>
      </div>
    </BaseModal>

    <!-- Filter popover (Figma: Dropdown/Filter, 160:39312) -->
    <Teleport to="body">
      <div v-if="filterOpen" class="fixed inset-0 z-40" @click="filterOpen = false" />
      <Transition name="filter-pop">
        <div
          v-if="filterOpen"
          class="fixed z-50 w-[326px] rounded-[8px] bg-white flex flex-col gap-[24px] p-[16px]"
          style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
          :style="{ left: filterPos.left + 'px', top: filterPos.top + 'px' }"
        >
          <div class="flex flex-col gap-[12px]">
            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Status</span>
              <MultiSelect v-model="fDraft.statuses" :options="statusOptions" placeholder="All statuses" :searchable="false" />
            </div>

            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Date</span>
              <div class="claim-field gap-[8px] px-[8px]">
                <img :src="calendarIcon" width="16" height="16" alt="" class="shrink-0" />
                <input v-model="fDraft.date" type="text" placeholder="Select date" class="claim-input min-w-0 flex-1" />
              </div>
            </div>

            <!-- Staff only exists in the Admin/Owner table -->
            <div v-if="isAdmin" class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Staff</span>
              <MultiSelect v-model="fDraft.staff" :options="staffOptions" placeholder="Select staff" />
            </div>

            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Category</span>
              <MultiSelect v-model="fDraft.categories" :options="categoryOptions" placeholder="Select category" />
            </div>

            <div class="flex flex-col gap-[4px]">
              <span class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Amount</span>
              <div class="flex items-center gap-[8px]">
                <div class="claim-field flex-1 gap-[4px] px-[8px]">
                  <span class="text-[14px] text-[#9295a5] shrink-0">From:</span>
                  <input v-model="fDraft.amountFrom" type="text" inputmode="decimal" placeholder="200" class="claim-input min-w-0 flex-1" />
                </div>
                <div class="claim-field flex-1 gap-[4px] px-[8px]">
                  <span class="text-[14px] text-[#9295a5] shrink-0">To:</span>
                  <input v-model="fDraft.amountTo" type="text" inputmode="decimal" placeholder="1,000" class="claim-input min-w-0 flex-1" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-[16px]">
            <button
              type="button"
              class="flex-1 flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[14px] font-medium text-[#61667c] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
              @click="cancelFilters"
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

    <!-- Original currency + rate, above the hovered exchange icon -->
    <Teleport to="body">
      <Transition name="fx-tooltip">
        <div
          v-if="fxTooltip"
          class="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full"
          :style="{ left: fxTooltip.left + 'px', top: fxTooltip.top + 'px' }"
        >
          <div
            class="relative flex flex-col items-center px-[8px] py-[4px] rounded-[4px] bg-[#fcfcfd] text-center whitespace-nowrap"
            style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
          >
            <p class="text-[13px] font-semibold text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ fxTooltip.original }}</p>
            <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">{{ fxTooltip.rate }}</p>
            <img :src="tooltipArrowIcon" alt="" width="12" height="8" class="absolute left-1/2 -bottom-[7px] -translate-x-1/2 rotate-180" />
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MultiSelect from '../forms/MultiSelect.vue'
import BaseModal from '../modals/BaseModal.vue'
import SubmitClaimPage from './SubmitClaimPage.vue'
import ClaimSubmittedPage from './ClaimSubmittedPage.vue'
import ClaimDetailPanel from '../content/ClaimDetailPanel.vue'
import toastCheckIcon from '../../assets/icons/icon-check-circle-green.svg'
import { statusStyle } from '../../composables/useBills.js'
import { claimsRole } from '../../composables/useClaimsRole.js'
import { claims, event, rejectedEvent, APPROVER, MONTHS } from '../../composables/useClaims.js'
import filterIcon from '../../assets/icons/icon-filter.svg'
import calendarIcon from '../../assets/icons/icon-calendar.svg'
import exchangeIcon from '../../assets/icons/icon-exchange.svg'
import bankIcon from '../../assets/icons/icon-bank-14.svg'
import tooltipArrowIcon from '../../assets/icons/icon-tooltip-arrow.svg'
import dropReceiptIcon from '../../assets/images/claims-drop-receipt.svg'
import plusWhiteIcon from '../../assets/icons/icon-plus-white.svg'
import radioActive from '../../assets/images/reimb-radio-active.svg'
import modalCloseIcon from '../../assets/images/claims-panel-close.svg'

// Where approved claims are paid out; Edit (on hover) switches between the saved accounts
const REIMBURSE_ACCOUNTS = [
  { bank: 'Bank Central Asia', last4: '2788', currency: 'IDR' },
  { bank: 'DBS Bank', last4: '1234', currency: 'SGD' },
]
const reimburseAccount = ref(REIMBURSE_ACCOUNTS[0])
const accountPickerOpen = ref(false)
const pickedAccount = ref(0)
function openAccountPicker() {
  pickedAccount.value = REIMBURSE_ACCOUNTS.indexOf(reimburseAccount.value)
  accountPickerOpen.value = true
}
function saveAccount() {
  const changed = REIMBURSE_ACCOUNTS[pickedAccount.value] !== reimburseAccount.value
  reimburseAccount.value = REIMBURSE_ACCOUNTS[pickedAccount.value]
  accountPickerOpen.value = false
  if (changed) showToast('Reimbursement account updated')
}

// Role comes from the top-of-window switcher; Employee sees only their own claims table (no tabs, no Staff column)
const isAdmin = computed(() => claimsRole.value === 'admin')

// Admin/Owner view: every staff member's claims vs. only the current user's
const viewTabs = ['All claims', 'My claims']
const activeView = ref('All claims')
const currentStaff = 'Maya Thompson'

// Toolbar segmented controls
const statusTabs = ['All', 'Draft', 'Need approval', 'Completed', 'Rejected']
const activeStatus = ref('All')

const columns = computed(() => [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'merchant', label: 'Merchant', sortable: true },
  isAdmin.value
    ? { key: 'staff', label: 'Staff', sortable: true }
    : { key: 'description', label: 'Descriptions', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
])

const filteredClaims = computed(() => {
  let list = claims.value.filter((c) =>
    (!isAdmin.value || activeView.value === 'All claims' || c.staff === currentStaff) &&
    (activeStatus.value === 'All' || c.status === activeStatus.value)
  )
  const f = appliedFilters.value
  if (!f) return list
  if (f.statuses.length) list = list.filter((c) => f.statuses.includes(c.status))
  if (f.date) list = list.filter((c) => c.date.toLowerCase().includes(f.date.trim().toLowerCase()))
  // Staff isn't a column for employees, so that filter only applies to the Admin/Owner view
  if (isAdmin.value && f.staff.length) list = list.filter((c) => f.staff.includes(c.staff))
  if (f.categories.length) list = list.filter((c) => f.categories.includes(c.category))
  const from = parseAmount(f.amountFrom)
  const to = parseAmount(f.amountTo)
  if (from != null) list = list.filter((c) => claimValue(c) >= from)
  if (to != null) list = list.filter((c) => claimValue(c) <= to)
  return list
})

// ── Filter popover (Figma: Dropdown/Filter, 160:39312) ──
const filterOpen = ref(false)
const filterPos = ref({ left: 0, top: 0 })
const filterBtn = ref(null)

const MULTI_KEYS = ['statuses', 'staff', 'categories']
const emptyFilters = () => ({ statuses: [], date: '', staff: [], categories: [], amountFrom: '', amountTo: '' })
const fDraft = reactive(emptyFilters())
const appliedFilters = ref(null)

const statusOptions = ['Draft', 'Need approval', 'Completed', 'Rejected'].map((s) => ({
  value: s,
  label: s === 'Need approval' ? 'Need Approval' : s,
  dot: statusStyle(s).text,
}))
const staffOptions = computed(() => [...new Set(claims.value.map((c) => c.staff))])
const categoryOptions = computed(() => [...new Set(claims.value.map((c) => c.category))])

// Amounts are compared by number only, across currencies (prototype data)
function claimValue(c) {
  return parseFloat(c.amount.split(' ')[1].replace(/,/g, ''))
}

function parseAmount(v) {
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && String(v).trim() !== '' ? n : null
}

function positionFilter() {
  const rect = filterBtn.value.getBoundingClientRect()
  filterPos.value = {
    left: Math.max(8, Math.min(rect.right - 326, window.innerWidth - 334)),
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
}

const copyFilters = (f) => {
  const copy = { ...f }
  for (const k of MULTI_KEYS) copy[k] = [...f[k]]
  return copy
}
const hasFilters = (f) => Object.values(f).some((v) => (Array.isArray(v) ? v.length : v !== ''))

function applyFilters() {
  const snapshot = copyFilters(fDraft)
  appliedFilters.value = hasFilters(snapshot) ? snapshot : null
  filterOpen.value = false
}

// Cancel drops unapplied edits so the next open shows what's actually applied
function cancelFilters() {
  Object.assign(fDraft, appliedFilters.value ? copyFilters(appliedFilters.value) : emptyFilters())
  filterOpen.value = false
}

const filterChips = computed(() => {
  const f = appliedFilters.value
  if (!f) return []
  const chips = []
  if (f.statuses.length) chips.push({ key: 'statuses', label: `Status: ${f.statuses.map((s) => (s === 'Need approval' ? 'Need Approval' : s)).join(', ')}` })
  if (f.date) chips.push({ key: 'date', label: `Date: ${f.date}` })
  if (isAdmin.value && f.staff.length) chips.push({ key: 'staff', label: `Staff: ${f.staff.join(', ')}` })
  if (f.categories.length) chips.push({ key: 'categories', label: `Category: ${f.categories.join(', ')}` })
  if (f.amountFrom || f.amountTo) chips.push({ key: 'amount', label: `Amount: ${f.amountFrom || '0'} - ${f.amountTo || '∞'}` })
  return chips
})

function removeChip(key) {
  const f = copyFilters(appliedFilters.value)
  if (key === 'amount') { f.amountFrom = ''; f.amountTo = '' }
  else if (key === 'date') f.date = ''
  else f[key] = []
  appliedFilters.value = hasFilters(f) ? f : null
  Object.assign(fDraft, f)
}

function clearFilters() {
  appliedFilters.value = null
  Object.assign(fDraft, emptyFilters())
}

// ── Submit claim flow (Figma: 71:21714) ──
const submitOpen = ref(false)
const submitKey = ref(0) // remounts the form so "Submit another" starts blank
const submittedClaim = ref(null)

// "21/08/2026" → "Aug 21, 2026" to match the list; anything else is kept as typed
function listDate(value) {
  const m = String(value).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  return m && MONTHS[+m[2] - 1] ? `${MONTHS[+m[2] - 1]} ${m[1].padStart(2, '0')}, ${m[3]}` : value
}
function formatAmount(value) {
  const n = parseAmount(value) ?? 0
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Same "IDR 1 = VND 1.57" wording as the list's exchange-rate tooltip
function tooltipRate(form) {
  const inverse = 1 / form.rate
  const shown = inverse >= 0.01 ? inverse.toFixed(2) : inverse.toPrecision(3)
  return `${form.currency} 1 = ${form.spentCurrency} ${shown}`
}

function onClaimSubmitted(form) {
  const claim = { ...form, amount: formatAmount(form.amount) }
  // New claims land at the top of the list, waiting for approval; foreign-currency
  // spend gets the exchange icon + tooltip like the existing rows
  claims.value.unshift({
    id: Date.now(),
    date: listDate(form.date),
    merchant: form.merchant,
    staff: currentStaff,
    description: form.description || '—',
    category: form.category,
    amount: `${claim.currency} ${claim.amount}`,
    ...(form.rate ? { fx: { original: `${form.spentCurrency} ${form.spentAmount}`, rate: tooltipRate(form) } } : {}),
    status: 'Need approval',
    attachment: form.attachment,
    timeline: [event(new Date(), `Claim submitted for approval by ${currentStaff}`)],
  })
  submitOpen.value = false
  submittedClaim.value = { ...claim, id: claims.value[0].id }
}

function submitAnother() {
  submittedClaim.value = null
  droppedFile.value = null
  submitKey.value++
  submitOpen.value = true
}

// ── Drop a receipt on the table to start a claim (Figma: 182:47755) ──
const droppedFile = ref(null)
const dragDepth = ref(0)
const dropActive = computed(() => dragDepth.value > 0)
const RECEIPT_TYPES = /^(image\/|application\/pdf$)/

// Only react to files being dragged in (not text or rows), and not while another flow is open
const isFileDrag = (e) => [...(e.dataTransfer?.types ?? [])].includes('Files') && !submitOpen.value && !submittedClaim.value

function onDragEnter(e) {
  if (!isFileDrag(e)) return
  e.preventDefault()
  dragDepth.value++
}
function onDragOver(e) {
  if (!isFileDrag(e)) return
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}
// Children fire their own enter/leave pairs; the counter only hits 0 when the pointer leaves the card
function onDragLeave(e) {
  if (!isFileDrag(e)) return
  dragDepth.value = Math.max(0, dragDepth.value - 1)
}
// A file released anywhere else on the page shouldn't open in the tab or leave the overlay up
function onWindowDragOver(e) {
  if ([...(e.dataTransfer?.types ?? [])].includes('Files')) e.preventDefault()
}
function onWindowDrop(e) {
  if ([...(e.dataTransfer?.types ?? [])].includes('Files')) e.preventDefault()
  dragDepth.value = 0
}
onMounted(() => {
  window.addEventListener('dragover', onWindowDragOver)
  window.addEventListener('drop', onWindowDrop)
  window.addEventListener('dragend', onWindowDrop)
})
onUnmounted(() => {
  window.removeEventListener('dragover', onWindowDragOver)
  window.removeEventListener('drop', onWindowDrop)
  window.removeEventListener('dragend', onWindowDrop)
})

function onTableDrop(e) {
  if (!dragDepth.value) return
  dragDepth.value = 0
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  if (!RECEIPT_TYPES.test(file.type)) {
    showToast('Drop an image or PDF receipt to submit a claim')
    return
  }
  detailClaimId.value = null
  droppedFile.value = file
  submitKey.value++
  submitOpen.value = true
}

// "View claim details" on the success screen opens the claim just submitted
function viewSubmittedClaim(claim) {
  submittedClaim.value = null
  detailClaimId.value = claim.id
}

// ── Claim details panel (Figma: 71:22038) ──
const detailClaimId = ref(null)
const detailClaim = computed(() => claims.value.find((c) => c.id === detailClaimId.value) ?? null)

function openDetail(c) {
  detailClaimId.value = detailClaimId.value === c.id ? null : c.id
}

function onClaimUpdated(changes) {
  const c = detailClaim.value
  if (!c) return
  Object.assign(c, changes)
  if (changes.fx) {
    const reimbursed = parseAmount(c.amount.split(' ')[1])
    const spent = parseAmount(changes.fx.original.split(' ')[1])
    c.fx.rate = `${c.amount.split(' ')[0]} 1 = ${changes.fx.original.split(' ')[0]} ${(spent / reimbursed).toFixed(2)}`
  }
  c.timeline.unshift(event(new Date(), `Claim edited by ${claimsRole.value === 'admin' ? APPROVER : c.staff}`))
  showToast('Claims successfully updated')
}

// ── Admin/Owner decisions (Figma: [Admin] Claim Details, 71:22039) ──
const router = useRouter()

// Approved claims sit under Completed, waiting for a reimbursement to pay them out
function onClaimApproved() {
  const c = detailClaim.value
  if (!c) return
  c.status = 'Completed'
  c.payment = 'waiting'
  c.timeline.unshift(event(new Date(), `Claim approved by ${APPROVER}`))
  showToast('Claim has been approved')
}

function onClaimRejected(reason) {
  const c = detailClaim.value
  if (!c) return
  c.status = 'Rejected'
  c.timeline.unshift(rejectedEvent(new Date(), reason))
  showToast('Claim has been rejected')
}

// Snackbar confirms an edit and fades after a moment
const toast = ref('')
let toastTimer = null
function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

// Exchange-rate tooltip, anchored above the hovered icon
const fxTooltip = ref(null)
function showFxTooltip(event, fx) {
  const rect = event.currentTarget.getBoundingClientRect()
  fxTooltip.value = { ...fx, left: rect.left + rect.width / 2, top: rect.top - 10 }
}
</script>

<style scoped>
/* Filter text fields (Figma: Input / State=Default), matching the Transactions filter */
.claim-field {
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
.claim-field:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.claim-input {
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.claim-input::placeholder { color: #9295a5; }

/* Account picker radio + currency chip (same as the reimbursement flow) */
.radio {
  position: relative;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 100px;
  background: white;
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
}
.radio.is-on { border-color: transparent; box-shadow: none; background: transparent; }
.radio-dot { position: absolute; left: -3px; top: -2px; width: 22px; height: 22px; max-width: none; }
.currency-chip {
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

/* Receipt drop zone (Figma: Overlay, 182:48878) */
/* 1px border, 4px dash / 4px gap — drawn with gradients since CSS dashed can't set the dash length */
.drop-zone {
  background:
    repeating-linear-gradient(90deg, #2465de 0 4px, transparent 4px 8px) top / 100% 1px no-repeat,
    repeating-linear-gradient(90deg, #2465de 0 4px, transparent 4px 8px) bottom / 100% 1px no-repeat,
    repeating-linear-gradient(180deg, #2465de 0 4px, transparent 4px 8px) left / 1px 100% no-repeat,
    repeating-linear-gradient(180deg, #2465de 0 4px, transparent 4px 8px) right / 1px 100% no-repeat,
    rgba(36, 101, 222, 0.1);
  backdrop-filter: blur(6px);
}
.drop-zone__art {
  width: 105.635px;
  height: 166.594px;
  transform: translate(-50%, -50%);
}
.drop-zone__receipt {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100px;
  height: 163.203px;
  transform: rotate(2deg);
  animation: receipt-float 2.4s ease-in-out 420ms infinite;
}
.drop-zone__receipt-img {
  position: absolute;
  top: -13.79%;
  right: -28.14%;
  bottom: -20.69%;
  left: -28.14%;
  width: auto;
  height: auto;
  max-width: none;
}
.drop-zone__add {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: -24px 0 0 -23.5px;
  border-radius: 48px;
  background: #2465de;
  box-shadow: 0px 2.25px 16.5px 0px rgba(38, 42, 50, 0.09);
}
@keyframes receipt-float {
  0%, 100% { transform: rotate(2deg) translateY(0); }
  50% { transform: rotate(-1deg) translateY(-6px); }
}

/* In: tint + blur fade up, the receipt rises in, then the add mark pops; out: quick fade */
.drop-zone-enter-active { transition: opacity 200ms ease-out, backdrop-filter 200ms ease-out; }
.drop-zone-enter-active .drop-zone__art { transition: opacity 260ms ease-out 40ms, transform 360ms cubic-bezier(0.34, 1.4, 0.64, 1) 40ms; }
.drop-zone-enter-active .drop-zone__add { transition: transform 300ms cubic-bezier(0.34, 1.6, 0.64, 1) 160ms; }
.drop-zone-leave-active { transition: opacity 150ms ease-in, backdrop-filter 150ms ease-in; }
.drop-zone-enter-from,
.drop-zone-leave-to { opacity: 0; backdrop-filter: blur(0); }
.drop-zone-enter-from .drop-zone__art { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) scale(0.9); }
.drop-zone-enter-from .drop-zone__add { transform: scale(0.4); }

/* Filter popover: quick scale+fade from the button corner */
.filter-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.filter-pop-leave-active { transition: opacity 100ms ease-in; transform-origin: top right; }
.filter-pop-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.filter-pop-leave-to { opacity: 0; }

/* Submit claim pages: gentle rise + fade in, quicker fade out (same as Cards) */
.full-page-enter-active {
  transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1), transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: opacity, transform;
}
.full-page-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
  will-change: opacity, transform;
}
.full-page-enter-from { opacity: 0; transform: translateY(24px); }
.full-page-leave-to   { opacity: 0; transform: translateY(12px); }

/* Claim details panel: slides in from the right edge */
.detail-panel-enter-active { transition: opacity 220ms ease-out, transform 280ms cubic-bezier(0.32, 0.72, 0, 1); }
.detail-panel-leave-active { transition: opacity 150ms ease-in, transform 180ms ease-in; }
.detail-panel-enter-from,
.detail-panel-leave-to { opacity: 0; transform: translateX(32px); }

/* Snackbar drops in from the top (same as Cards) */
.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

/* Tooltip motion: quick fade with a small rise toward the pointer */
.fx-tooltip-enter-active { transition: opacity 140ms ease-out, margin-top 140ms ease-out; }
.fx-tooltip-leave-active { transition: opacity 100ms ease-in; }
.fx-tooltip-enter-from { opacity: 0; margin-top: 4px; }
.fx-tooltip-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .fx-tooltip-enter-active, .fx-tooltip-leave-active,
  .filter-pop-enter-active, .filter-pop-leave-active,
  .full-page-enter-active, .full-page-leave-active,
  .detail-panel-enter-active, .detail-panel-leave-active,
  .drop-zone-enter-active, .drop-zone-leave-active,
  .drop-zone-enter-active .drop-zone__art, .drop-zone-enter-active .drop-zone__add,
  .snackbar-enter-active, .snackbar-leave-active { transition: none; }
  .filter-pop-enter-from, .full-page-enter-from,
  .detail-panel-enter-from, .detail-panel-leave-to,
  .snackbar-enter-from, .snackbar-leave-to { transform: none; }
  .fx-tooltip-enter-from { margin-top: 0; }
  .drop-zone__receipt { animation: none; }
  .drop-zone-enter-from .drop-zone__art { transform: translate(-50%, -50%); }
  .drop-zone-enter-from .drop-zone__add { transform: none; }
}
</style>
