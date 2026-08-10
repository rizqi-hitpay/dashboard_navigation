<template>
  <div class="relative bg-white flex flex-col h-full w-full overflow-x-hidden" :class="editOpen ? 'overflow-y-hidden' : 'overflow-y-auto'">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="flex items-center justify-between gap-[32px] px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-col gap-[8px] items-start justify-center min-w-0">
          <button
            type="button"
            class="flex items-center gap-[6px] h-[28px] rounded-[8px] cursor-pointer hover:opacity-70 transition-opacity"
            @click="router.push('/cards')"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12.5L5.5 8 10 3.5" stroke="#484d61" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[12px] font-medium text-[#484d61] leading-[1.5]">Back</span>
          </button>
          <div class="flex items-center gap-[8px]">
            <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">{{ card.nickname }}</p>
            <span
              v-if="card.status === 'canceled'"
              class="inline-flex items-center justify-center min-h-[24px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap bg-[#f9e9e9] text-[#c20a1c]"
            >Canceled</span>
            <span
              v-else-if="card.status === 'frozen'"
              class="inline-flex items-center justify-center min-h-[24px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap bg-[#f2f2f4] text-[#484d61]"
            >Frozen</span>
          </div>
          <div class="flex items-center gap-[4px]">
            <img :src="calendarSmallIcon" width="14" height="14" alt="" class="shrink-0" />
            <span class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">Created at: {{ card.createdAt }}</span>
          </div>
        </div>
        <div v-if="card.status !== 'canceled'" class="flex items-center gap-[8px] shrink-0">
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border transition-[filter] duration-150 active:translate-y-[1px]"
            :class="isFrozen ? 'border-[#2465de] hover:brightness-105' : 'border-[#f2f2f4] hover:brightness-95'"
            :style="isFrozen
              ? 'background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;'
              : 'background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;'"
            @click="onFreezeClick"
          >
            <img :src="snowflakeIcon" width="18" height="18" alt="" class="shrink-0" :style="isFrozen ? 'filter: brightness(0) invert(1);' : ''" />
            <span
              class="text-[14px] font-medium leading-[1.5] whitespace-nowrap"
              :class="isFrozen ? 'text-white' : 'text-[#61667c]'"
              :style="isFrozen ? 'text-shadow: 0px 1px 1px rgba(0,0,0,0.12);' : 'text-shadow: 0px 1px 1px rgba(0,0,0,0.08);'"
            >{{ isFrozen ? 'Unfreeze' : 'Freeze' }}</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center size-[36px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            :class="menuOpen ? 'brightness-95' : ''"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            aria-label="More actions"
            @click.stop="toggleMenu"
          >
            <img :src="dotsVerticalIcon" width="18" height="18" alt="" />
          </button>
        </div>
      </div>

      <!-- Stat cards (hidden once the card is canceled) -->
      <div v-if="card.status !== 'canceled'" class="flex items-start gap-[26px] px-[24px] w-full shrink-0">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="flex flex-col gap-[8px] flex-1 rounded-[8px] border border-[#e5e6ea] bg-[#fcfcfd] p-[12px]"
        >
          <div class="flex items-center justify-between gap-[16px] w-full">
            <div class="flex items-center gap-[4px] min-w-0">
              <span class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ stat.label }}</span>
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="#9295a5" stroke-width="1.2" /><path d="M8 7.4v3.2" stroke="#9295a5" stroke-width="1.2" stroke-linecap="round" /><circle cx="8" cy="5.4" r="0.7" fill="#9295a5" /></svg>
            </div>
            <span class="text-[14px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ stat.total }}</span>
          </div>
          <div class="w-full h-[8px] rounded-full bg-[#e5e6ea] overflow-hidden">
            <div class="h-full rounded-full" :style="{ width: stat.percent + '%', background: stat.color }" />
          </div>
          <div class="flex items-center justify-between gap-[16px] w-full">
            <div class="flex items-center gap-[4px] whitespace-nowrap">
              <span class="text-[14px] font-semibold text-[#03102f] leading-[1.4]" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ stat.paid }}</span>
              <span class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Paid</span>
            </div>
            <div class="flex items-center gap-[4px] whitespace-nowrap">
              <span class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Remaining</span>
              <span class="text-[14px] font-semibold leading-[1.4]" :style="{ color: stat.remainingColor, fontFamily: 'Reddit Mono, ui-monospace, monospace' }">{{ stat.remaining }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex flex-col px-[24px] pt-[24px] w-full shrink-0">
        <div class="flex items-center w-full border-b border-[#e5e6ea]">
          <button
            v-for="t in tabs"
            :key="t"
            type="button"
            class="flex items-center justify-center gap-[8px] min-w-[88px] px-[12px] pb-[8px] -mb-px transition-colors duration-150"
            :class="activeTab === t ? 'border-b-2 border-[#2465de]' : 'border-b-2 border-transparent'"
            @click="activeTab = t"
          >
            <span
              class="text-[13px] leading-[1.5] whitespace-nowrap"
              :class="activeTab === t ? 'font-medium text-[#03102f]' : 'font-normal text-[#61667c]'"
            >{{ t }}</span>
          </button>
          <button
            v-if="activeTab === 'Transactions'"
            type="button"
            class="flex items-center gap-[6px] ml-auto mb-[4px] px-[8px] py-[4px] rounded-[6px] cursor-pointer hover:bg-[#f6f7f9] transition-colors duration-150"
          >
            <img :src="downloadIcon" width="16" height="16" alt="" class="shrink-0" />
            <span class="text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap">Export</span>
          </button>
        </div>
      </div>

      <!-- Details tab -->
      <div v-if="activeTab === 'Details'" class="flex flex-col md:flex-row gap-[32px] items-start px-[24px] py-[24px] w-full">

        <!-- Card art + reveal toggle -->
        <div class="flex flex-col items-center gap-[8px] w-full md:w-[400px] shrink-0">
          <div class="detail-card shrink-0" :class="{ 'detail-card--frozen': isFrozen, 'detail-card--pop': cardPop }">
            <div class="dc-fade absolute inset-0 pointer-events-none" :style="{ opacity: isFrozen ? 0 : 1 }" aria-hidden="true">
              <img :src="cardInnerBlur" alt="" class="absolute max-w-none" style="width: 1021px; height: 820px; left: -238px; top: -194px; mix-blend-mode: hard-light;" />
              <div class="dc-halftone">
                <div class="dc-halftone__layer" :style="{ backgroundImage: `url(${halftoneA})`, opacity: 0.2 }" />
                <div class="dc-halftone__layer" :style="{ backgroundImage: `url(${halftoneA})`, opacity: 0.5 }" />
                <div class="dc-halftone__layer" :style="{ backgroundImage: `url(${halftoneB})` }" />
              </div>
            </div>

            <!-- Mastercard: full colour ↔ muted crossfade -->
            <img :src="mastercardCardLogo" alt="Mastercard" class="dc-fade absolute" :style="{ opacity: isFrozen ? 0 : 1 }" style="left: 24px; top: 20px; width: 58px; height: 36px;" />
            <img :src="mastercardMutedLogo" alt="" class="dc-fade absolute" :style="{ opacity: isFrozen ? 1 : 0 }" style="left: 24px; top: 20px; width: 58px; height: 36px;" />

            <!-- HitPay logo: white ↔ grey watermark crossfade -->
            <div class="dc-fade absolute flex items-end gap-[10.5px]" :style="{ opacity: isFrozen ? 0 : 1 }" style="right: 18px; top: 20px;">
              <img :src="hitpayLogogramWhite" width="32" height="32" alt="" />
              <img :src="hitpayLogotextWhite" width="89" height="27" alt="HitPay" />
            </div>
            <div class="dc-fade absolute flex items-end gap-[10.5px]" :style="{ opacity: isFrozen ? 0.25 : 0 }" style="right: 18px; top: 20px;">
              <img :src="hitpayLogogram" width="32" height="32" alt="" />
              <img :src="hitpayLogotext" width="89" height="27" alt="HitPay" />
            </div>

            <p class="dc-color absolute text-[12px] font-medium leading-[1.5] uppercase whitespace-nowrap" :class="isFrozen ? 'text-[#b2b4bf]' : 'text-white'" style="left: 24px; top: 93px; font-family: 'Reddit Mono', ui-monospace, monospace;">{{ card.nickname }}</p>

            <div v-if="revealed" class="dc-color absolute flex items-center gap-[10px] text-[18px] font-medium leading-[1.35] whitespace-nowrap" :class="isFrozen ? 'text-[#343848]' : 'text-white'" style="left: 24px; top: 123px; font-family: 'Reddit Mono', ui-monospace, monospace;">
              <span v-for="(group, gi) in card.number.split(' ')" :key="gi">{{ group }}</span>
            </div>
            <div v-else class="absolute flex items-center gap-[10px]" style="left: 24px; top: 123px;">
              <img :src="cardDots" alt="" width="36" height="6" class="dc-fade" :style="isFrozen ? 'filter: brightness(0); opacity: 0.8;' : ''" />
              <img :src="cardDots" alt="" width="36" height="6" class="dc-fade" :style="isFrozen ? 'filter: brightness(0); opacity: 0.8;' : ''" />
              <img :src="cardDots" alt="" width="36" height="6" class="dc-fade" :style="isFrozen ? 'filter: brightness(0); opacity: 0.8;' : ''" />
              <span class="dc-color text-[18px] font-medium leading-[1.35] whitespace-nowrap" :class="isFrozen ? 'text-[#343848]' : 'text-white'" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ last4 }}</span>
            </div>

            <div class="dc-color absolute flex items-center gap-[32px] whitespace-nowrap" :class="isFrozen ? 'text-[#343848]' : 'text-white'" style="left: 24px; top: 187px;">
              <div class="flex flex-col">
                <p class="dc-color text-[12px] font-medium leading-[1.5]" :class="isFrozen ? 'text-[#9295a5]' : ''" style="font-family: 'Reddit Mono', ui-monospace, monospace;">VALID THRU</p>
                <p class="text-[14px] font-medium leading-[1.5]">10/30</p>
              </div>
              <div class="flex flex-col">
                <p class="dc-color text-[12px] font-medium leading-[1.5]" :class="isFrozen ? 'text-[#9295a5]' : ''" style="font-family: 'Reddit Mono', ui-monospace, monospace;">CARD HOLDER</p>
                <p class="text-[14px] font-medium leading-[1.5]">{{ card.holder }}</p>
              </div>
              <div class="flex flex-col">
                <p class="dc-color text-[12px] font-medium leading-[1.5]" :class="isFrozen ? 'text-[#9295a5]' : ''" style="font-family: 'Reddit Mono', ui-monospace, monospace;">CVC</p>
                <p class="text-[14px] font-medium leading-[1.5]">{{ revealed ? '824' : '***' }}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] cursor-pointer hover:bg-[#f6f7f9] transition-colors duration-150"
            @click="revealed = !revealed"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.9 8S4.1 3.9 8 3.9 14.1 8 14.1 8 11.9 12.1 8 12.1 1.9 8 1.9 8z" stroke="#03102f" stroke-width="1.2" stroke-linejoin="round" /><circle cx="8" cy="8" r="1.9" stroke="#03102f" stroke-width="1.2" /></svg>
            <span class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ revealed ? 'Hide card details' : 'Show card details' }}</span>
          </button>
        </div>

        <!-- Detail groups (Figma: Card Details bordered containers of Invoice Input rows) -->
        <div class="flex flex-col gap-[16px] flex-1 min-w-0 w-full">
          <div v-for="group in detailGroups" :key="group.title" class="flex flex-col gap-[8px] w-full">
            <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ group.title }}</p>
            <div class="flex flex-col w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">
              <div
                v-for="row in group.rows"
                :key="row.label"
                class="flex items-center justify-between gap-[8px] w-full border-b border-[#e5e6ea] last:border-b-0"
              >
                <div class="flex items-center gap-[8px] px-[12px] py-[8px] shrink-0">
                  <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">{{ row.label }}</span>
                  <img v-if="row.copy" :src="copyIcon" width="16" height="16" alt="Copy" class="shrink-0 cursor-pointer" />
                </div>
                <div class="flex flex-col items-end justify-center min-w-0 min-h-[32px] px-[12px] py-[4px]">
                  <span
                    v-for="(line, li) in row.lines"
                    :key="li"
                    class="text-right whitespace-nowrap overflow-hidden text-ellipsis max-w-full leading-[1.5]"
                    :class="row.valueClass || 'text-[14px] font-normal text-[#03102f]'"
                    :style="row.mono ? { fontFamily: 'Reddit Mono, ui-monospace, monospace', fontWeight: 600, lineHeight: 1.4 } : {}"
                  >{{ line }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Transactions tab -->
      <div v-else-if="activeTab === 'Transactions'" class="flex flex-col w-full px-[24px] py-[16px]">
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[900px]" style="table-layout: fixed;">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col style="width: 100px;" />
                <col style="width: 150px;" />
              </colgroup>
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in txnColumns"
                    :key="col.key"
                    class="bg-[#fcfcfd] h-[34px] border-b border-[#e5e6ea] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < txnColumns.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
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
                  v-for="txn in transactions"
                  :key="txn.id"
                  class="cursor-pointer transition-colors duration-150 hover:bg-[#fcfcfd] [&:last-child>td]:border-b-0"
                >
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ txn.date }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ txn.merchant }}</p>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ txn.amount }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ txn.category }}</p>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ txn.glCode }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] text-[12px] font-medium leading-[1.5] whitespace-nowrap"
                      :style="{ background: TXN_STATUS[txn.status].bg, color: TXN_STATUS[txn.status].color }"
                    >{{ TXN_STATUS[txn.status].label }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Statement tab -->
      <div v-if="activeTab === 'Statement'" class="flex flex-col w-full px-[24px] py-[16px]">
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[720px]" style="table-layout: fixed;">
              <thead>
                <tr>
                  <th
                    v-for="(col, ci) in stmtColumns"
                    :key="col.key"
                    class="bg-[#fcfcfd] h-[34px] border-b border-[#e5e6ea] px-[12px] py-[8px] text-left align-middle"
                    :class="ci < stmtColumns.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
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
                  v-for="stmt in statements"
                  :key="stmt.period"
                  class="transition-colors duration-150 hover:bg-[#fcfcfd] [&:last-child>td]:border-b-0"
                >
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ stmt.period }}</p>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ stmt.transactions }}</p>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] font-semibold text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ stmt.total }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <button type="button" class="flex items-center gap-[6px] px-[4px] py-[2px] rounded-[6px] cursor-pointer hover:bg-[#f6f7f9] transition-colors duration-150">
                      <img :src="downloadIcon" width="16" height="16" alt="" class="shrink-0" />
                      <span class="text-[13px] font-normal text-[#484d61] leading-[1.5] whitespace-nowrap">PDF</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <!-- Edit card page — fills the main content area like the create flow -->
    <Transition name="full-page">
      <CreateCardPage v-if="editOpen" :card="card" @close="editOpen = false" @save="onCardSaved" />
    </Transition>

    <!-- Card actions dropdown (⋯) -->
    <Teleport to="body">
      <div v-if="menuOpen" class="fixed inset-0 z-40" @click="menuOpen = false" />
      <Transition name="card-menu">
        <div
          v-if="menuOpen"
          class="fixed z-50 w-[162px] rounded-[8px] bg-white overflow-hidden"
          style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
          :style="{ left: menuPos.left + 'px', top: menuPos.top + 'px' }"
        >
          <div class="flex flex-col p-[4px] w-full">
            <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100" @click="openEdit">
              <img :src="pencilIcon" width="16" height="16" alt="" class="shrink-0" />
              <span class="flex-1 text-[12px] font-normal text-[#03102f] leading-[1.5]">Edit</span>
            </button>
            <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100" @click="menuOpen = false">
              <img :src="keyIcon" width="16" height="16" alt="" class="shrink-0" />
              <span class="flex-1 text-[12px] font-normal text-[#03102f] leading-[1.5]">Reset PIN</span>
            </button>
          </div>
          <div class="h-px w-full bg-[#e5e6ea]" />
          <div class="flex flex-col p-[4px] w-full">
            <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#fdf2f3] transition-colors duration-100" @click="openCancel">
              <img :src="xRedIcon" width="16" height="16" alt="" class="shrink-0" />
              <span class="flex-1 text-[12px] font-normal text-[#dc3545] leading-[1.5]">Cancel</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success snackbar (Figma: Snackbar/Default) -->
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

    <!-- Freeze card confirmation -->
    <Teleport to="body">
      <Transition name="cancel-modal">
        <div v-if="freezeModalOpen" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
          <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="freezeModalOpen = false" />
          <div
            class="cancel-modal__card relative bg-white rounded-[12px] w-[360px] max-w-full flex flex-col"
            style="box-shadow: 0px 24px 48px -8px rgba(3,16,47,0.28), 0px 0px 0px 1px rgba(3,16,47,0.06);"
          >
            <div class="flex items-center justify-between px-[16px] pt-[16px] w-full">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Freeze this card?</p>
              <button type="button" class="flex items-center justify-center size-[24px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="freezeModalOpen = false">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" /></svg>
              </button>
            </div>
            <div class="flex flex-col items-center gap-[12px] px-[24px] py-[20px] text-center">
              <span class="flex items-center justify-center size-[40px] rounded-full bg-[#f2f2f4]">
                <img :src="snowflakeIcon" width="18" height="18" alt="" />
              </span>
              <p class="text-[13px] font-normal text-[#61667c] leading-[1.5]">All transactions on this card will be blocked immediately. You can unfreeze it at any time.</p>
            </div>
            <div class="flex items-center justify-end gap-[16px] px-[16px] pb-[16px]">
              <button
                type="button"
                class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] text-[14px] font-medium text-[#2465de] hover:bg-[#eef3fc] transition-colors duration-150"
                @click="freezeModalOpen = false"
              >Cancel</button>
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[14px] font-medium text-[#61667c] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
                @click="confirmFreeze"
              >Freeze card</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Cancel card confirmation -->
    <Teleport to="body">
      <Transition name="cancel-modal">
        <div v-if="cancelModalOpen" class="fixed inset-0 z-[90] flex items-center justify-center p-[16px]">
          <div class="absolute inset-0" style="background: rgba(3,16,47,0.4); backdrop-filter: blur(6px);" @click="cancelModalOpen = false" />
          <div
            class="cancel-modal__card relative bg-white rounded-[12px] w-[360px] max-w-full flex flex-col"
            style="box-shadow: 0px 24px 48px -8px rgba(3,16,47,0.28), 0px 0px 0px 1px rgba(3,16,47,0.06);"
          >
            <div class="flex items-center justify-between px-[16px] pt-[16px] w-full">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Cancel this card?</p>
              <button type="button" class="flex items-center justify-center size-[24px] rounded-[4px] hover:bg-[#f0f1f5] transition-colors duration-150" aria-label="Close" @click="cancelModalOpen = false">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" /></svg>
              </button>
            </div>
            <div class="flex flex-col items-center gap-[12px] px-[24px] py-[20px] text-center">
              <span class="flex items-center justify-center size-[40px] rounded-full bg-[#f9e9e9]">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="#c20a1c" stroke-width="1.6" stroke-linecap="round" /></svg>
              </span>
              <p class="text-[13px] font-normal text-[#61667c] leading-[1.5]">This action is permanent. The card will be immediately deactivated and cannot be reactivated. Any active subscriptions using this card will fail.</p>
            </div>
            <div class="flex items-center justify-center gap-[8px] px-[16px] pb-[16px]">
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#f2f2f4] text-[14px] font-medium text-[#61667c] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; text-shadow: 0px 1px 1px rgba(0,0,0,0.08);"
                @click="cancelModalOpen = false"
              >Cancel</button>
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#c20a1c] text-[14px] font-medium text-white transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #e0424d, #c22030); box-shadow: 0px 1.5px 0px 0px #9c1b27; text-shadow: 0px 1px 1px rgba(0,0,0,0.12);"
                @click="confirmCancel"
              >Cancel</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { cards, formatSGD, pendingToast } from '../../composables/useCards.js'
import CreateCardPage from './CreateCardPage.vue'
import mastercardCardLogo from '../../assets/icons/logo-mastercard-card.svg'
import mastercardMutedLogo from '../../assets/icons/logo-mastercard-muted.svg'
import hitpayLogogramWhite from '../../assets/icons/logo-hitpay-white.svg'
import hitpayLogotextWhite from '../../assets/icons/hitpay-logotext-white.svg'
import hitpayLogogram from '../../assets/icons/logo-hitpay.svg'
import hitpayLogotext from '../../assets/icons/hitpay-logotext.svg'
import cardDots from '../../assets/icons/card-dots.svg'
import copyIcon from '../../assets/icons/icon-copy.svg'
import downloadIcon from '../../assets/icons/icon-download.svg'
import snowflakeIcon from '../../assets/icons/icon-snowflake.svg'
import dotsVerticalIcon from '../../assets/icons/icon-dots-vertical.svg'
import calendarSmallIcon from '../../assets/icons/icon-calendar-small.svg'
import snackbarCheckIcon from '../../assets/icons/icon-snackbar-check.svg'
import pencilIcon from '../../assets/icons/icon-pencil.svg'
import keyIcon from '../../assets/icons/icon-key.svg'
import xRedIcon from '../../assets/icons/icon-x-red.svg'
import cardInnerBlur from '../../assets/images/card-inner-blur.svg'
import halftoneA from '../../assets/images/card-halftone-a.png'
import halftoneB from '../../assets/images/card-halftone-b.png'

const route = useRoute()
const router = useRouter()

const card = computed(() => cards.find((c) => c.id === Number(route.query.id)) || cards[0])
const last4 = computed(() => card.value.number.slice(-4))

const isFrozen = computed(() => card.value.status === 'frozen')

// Spring pop on every freeze/unfreeze, same as the create-card preview
const cardPop = ref(false)
let popTimer = null
watch(isFrozen, () => {
  cardPop.value = false
  requestAnimationFrame(() => { cardPop.value = true })
  clearTimeout(popTimer)
  popTimer = setTimeout(() => { cardPop.value = false }, 550)
})

// Freeze asks for confirmation; unfreeze is immediate (Figma: Freeze flow)
const freezeModalOpen = ref(false)

function onFreezeClick() {
  if (isFrozen.value) {
    card.value.status = 'active'
    return
  }
  freezeModalOpen.value = true
}

function confirmFreeze() {
  card.value.status = 'frozen'
  freezeModalOpen.value = false
}

// ⋯ actions dropdown, anchored below-right of the button
const menuOpen = ref(false)
const menuPos = ref({ left: 0, top: 0 })

function toggleMenu(event) {
  if (menuOpen.value) {
    menuOpen.value = false
    return
  }
  const rect = event.currentTarget.getBoundingClientRect()
  menuPos.value = { left: rect.right - 162, top: rect.bottom + 4 }
  menuOpen.value = true
}

// Edit flow — reuses the create-card page prefilled with this card
const editOpen = ref(false)

function openEdit() {
  menuOpen.value = false
  editOpen.value = true
}

function onCardSaved({ nickname, holder }) {
  card.value.nickname = nickname
  card.value.holder = holder
  editOpen.value = false
  showToast(`${nickname} has been updated successfully`)
}

// Success snackbar — same component/motion as the Cards list
const toast = ref('')
let toastTimer = null

function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 3000)
}

onUnmounted(() => clearTimeout(toastTimer))

// Cancel flow — destructive confirm, then back to the list with a snackbar
const cancelModalOpen = ref(false)

function openCancel() {
  menuOpen.value = false
  cancelModalOpen.value = true
}

function confirmCancel() {
  card.value.status = 'canceled'
  cancelModalOpen.value = false
  pendingToast.value = `${card.value.nickname} has been canceled successfully`
  router.push('/cards')
}

// Stat cards (Figma: Page Details/Horizontal) — driven by each card's own usage
const stats = computed(() => {
  const s = card.value.stats
  // Frozen cards grey out their usage bars (Figma: Freeze flow)
  const grey = isFrozen.value
  const items = [
    {
      label: 'This month expenses',
      total: formatSGD(s.monthlyLimit),
      paid: formatSGD(s.monthlySpent),
      remaining: formatSGD(Math.max(0, s.monthlyLimit - s.monthlySpent)),
      percent: Math.min(100, (s.monthlySpent / s.monthlyLimit) * 100),
      color: grey ? '#9295a5' : '#2465de',
      remainingColor: grey ? '#9295a5' : '#2465de',
    },
  ]
  // Cards without a per-card limit only show the monthly bar
  if (s.cardLimit != null) {
    items.push({
      label: 'Per card limit',
      total: formatSGD(s.cardLimit),
      paid: formatSGD(s.cardSpent),
      remaining: formatSGD(Math.max(0, s.cardLimit - s.cardSpent)),
      percent: Math.min(100, (s.cardSpent / s.cardLimit) * 100),
      color: grey ? '#9295a5' : '#7d1ab7',
      remainingColor: grey ? '#9295a5' : '#b14aed',
    })
  }
  return items
})

const tabs = ['Details', 'Transactions', 'Statement']
const activeTab = ref('Details')

// Transactions tab (Figma: 73:6750) — this card's transactions
const txnColumns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'merchant', label: 'Merchant', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'category', label: 'Category', sortable: false },
  { key: 'glCode', label: 'GL code', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
]

const TXN_STATUS = {
  pending: { label: 'Pending', bg: '#fff9ec', color: '#bd8400' },
  success: { label: 'Success', bg: '#e6f9f0', color: '#238b5b' },
  refunded: { label: 'Refunded', bg: '#f7edfd', color: '#7d1ab7' },
  partial: { label: 'Partial refund', bg: '#f7edfd', color: '#7d1ab7' },
  cancelled: { label: 'Canceled', bg: '#f9e9e9', color: '#c20a1c' },
}

// Statement tab (Figma: 75:10001) — monthly statements with a PDF download per period
const stmtColumns = [
  { key: 'period', label: 'Period', sortable: true },
  { key: 'transactions', label: 'Transactions', sortable: true },
  { key: 'total', label: 'Total spent', sortable: true },
  { key: 'download', label: 'Download', sortable: false },
]

const statements = [
  { period: 'June 2026', transactions: 10, total: 'SGD 1,487.65' },
  { period: 'May 2026', transactions: 21, total: 'SGD 1,024.39' },
  { period: 'Apr 2026', transactions: 3, total: 'SGD 1,789.22' },
  { period: 'Mar 2026', transactions: 123, total: 'SGD 1,932.77' },
  { period: 'Feb 2026', transactions: 89, total: 'SGD 1,250.11' },
  { period: 'Jan 2026', transactions: 5, total: 'SGD 1,678.54' },
]

const transactions = [
  { id: 1, date: '23/11/2026', merchant: 'Singapore Airlines', amount: 'SGD 1,487.65', category: 'Travel', glCode: '229', status: 'pending' },
  { id: 2, date: '15/10/2026', merchant: 'Marriot Hotel', amount: 'SGD 1,024.39', category: 'Accommodation', glCode: '309', status: 'success' },
  { id: 3, date: '04/12/2026', merchant: 'Grab', amount: 'SGD 1,789.22', category: 'Transport', glCode: '570', status: 'refunded' },
  { id: 4, date: '29/08/2026', merchant: 'Nexa', amount: 'SGD 1,932.77', category: 'Entertainment', glCode: '220', status: 'success' },
  { id: 5, date: '18/07/2026', merchant: 'Vortex', amount: 'SGD 1,250.11', category: 'Office Supplies', glCode: '210', status: 'cancelled' },
  { id: 6, date: '10/06/2026', merchant: 'Lumina', amount: 'SGD 1,678.54', category: 'Travel', glCode: '430', status: 'success' },
  { id: 7, date: '02/05/2026', merchant: 'Zephyr', amount: 'SGD 1,089.33', category: 'Meals & Dining', glCode: '230', status: 'partial' },
  { id: 8, date: '25/04/2026', merchant: 'Orion', amount: 'SGD 1,345.90', category: 'Utilities', glCode: '990', status: 'success' },
  { id: 9, date: '17/03/2026', merchant: 'Aether', amount: 'SGD 1,712.08', category: 'Software Subscriptions', glCode: '380', status: 'refunded' },
  { id: 10, date: '09/02/2026', merchant: 'Solara', amount: 'SGD 1,403.67', category: 'Marketing', glCode: '110', status: 'success' },
  { id: 11, date: '01/01/2026', merchant: 'Cresta', amount: 'SGD 1,987.45', category: 'Training & Development', glCode: '610', status: 'success' },
  { id: 12, date: '07/09/2026', merchant: 'Cursor', amount: 'SGD 1,156.48', category: 'Development', glCode: '832', status: 'cancelled' },
]

// Card art number reveal
const revealed = ref(false)

const detailGroups = computed(() => [
  {
    title: 'Card details',
    rows: [
      { label: 'Card number', lines: [revealed.value ? card.value.number : '**** **** **** ' + last4.value] },
      { label: 'Nickname', lines: [card.value.nickname] },
      { label: 'Expiration', lines: ['10/2030'] },
      { label: 'CVC', lines: [revealed.value ? '824' : '***'] },
      {
        label: 'Status',
        lines: [{ frozen: 'Frozen', canceled: 'Canceled' }[card.value.status] || 'Active'],
        valueClass: {
          frozen: 'text-[12px] font-medium text-[#484d61]',
          canceled: 'text-[12px] font-medium text-[#c20a1c]',
        }[card.value.status] || 'text-[12px] font-medium text-[#238b5b]',
      },
    ],
  },
  {
    title: 'Holder details',
    rows: [
      { label: 'Card holder', lines: [card.value.holder] },
      { label: 'Email', lines: [card.value.holder.toLowerCase().replace(/\s+/g, '.') + '@website.com'] },
      { label: 'Billing address', copy: true, lines: ['30 Cecil Street, #19-08', 'Singapore 049712'] },
    ],
  },
  {
    title: 'Spending limit',
    rows: [
      { label: 'Monthly limit', lines: [formatSGD(card.value.stats.monthlyLimit)], mono: true },
      { label: 'Daily max', lines: [formatSGD(Math.round(card.value.stats.monthlyLimit / 6))], mono: true },
      { label: 'Per transaction', lines: [formatSGD(Math.round(card.value.stats.monthlyLimit / 15))], mono: true },
      card.value.stats.cardLimit != null
        ? { label: 'Per card', lines: [formatSGD(card.value.stats.cardLimit)], mono: true }
        : { label: 'Per card', lines: ['N/A'], valueClass: 'font-normal text-[#9295a5]' },
    ],
  },
])
</script>

<style scoped>
/* Issued card art — the filled state of the create-card preview (Figma: 118:38060) */
.detail-card {
  position: relative;
  overflow: hidden;
  width: 400px;
  max-width: 100%;
  height: 250px;
  border-radius: 17.5px;
  background-color: #2465de;
  background-image: none;
  box-shadow:
    0px 8px 17px 0px rgba(23, 29, 109, 0.08),
    0px 32px 32px 0px rgba(23, 29, 109, 0.07),
    0px 71px 43px 0px rgba(23, 29, 109, 0.04),
    0px 126px 51px 0px rgba(23, 29, 109, 0.01);
  transition: background-color 600ms ease, box-shadow 600ms ease;
}

/* Crossfading layers + easing colors — same motion as the create-card preview */
.dc-fade { transition: opacity 500ms ease, filter 500ms ease; }
.dc-color { transition: color 500ms ease; }

/* Spring pop on state change (Create card page: card-pop) */
.detail-card--pop {
  animation: card-pop 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes card-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
/* Frozen: the card drains to a pale grey glass (Figma: Freeze flow) */
.detail-card--frozen {
  background-color: #f2f3f6;
  background-image: linear-gradient(-58deg, #e9ebef 5%, rgba(250, 250, 251, 0.4) 65%);
  box-shadow:
    0px 8px 17px 0px rgba(52, 56, 72, 0.06),
    0px 32px 32px 0px rgba(52, 56, 72, 0.05),
    0px 71px 43px 0px rgba(52, 56, 72, 0.03),
    0px 126px 51px 0px rgba(52, 56, 72, 0.01);
}
.dc-halftone {
  position: absolute;
  inset: 0;
  mix-blend-mode: overlay;
  opacity: 0.1;
  pointer-events: none;
}
.dc-halftone__layer {
  position: absolute;
  inset: 0;
  background-size: 3px 3px;
  background-position: top left;
  background-repeat: repeat;
}

/* Edit card full page: gentle rise + fade in, quicker fade out */
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

/* ⋯ dropdown: quick scale+fade from the anchor corner */
.card-menu-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.card-menu-leave-active { transition: opacity 100ms ease-in; transform-origin: top right; }
.card-menu-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.card-menu-leave-to { opacity: 0; }

/* Snackbar motion — same as the Cards list success snackbar */
.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

/* Cancel modal: backdrop fade + card rise */
.cancel-modal-enter-active { transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.cancel-modal-leave-active { transition: opacity 150ms ease-in; }
.cancel-modal-enter-from,
.cancel-modal-leave-to { opacity: 0; }
.cancel-modal-enter-active .cancel-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.cancel-modal-enter-from .cancel-modal__card { transform: translateY(12px); }

@media (prefers-reduced-motion: reduce) {
  .full-page-enter-active, .full-page-leave-active,
  .card-menu-enter-active, .card-menu-leave-active,
  .snackbar-enter-active, .snackbar-leave-active,
  .cancel-modal-enter-active, .cancel-modal-leave-active,
  .detail-card, .dc-fade, .dc-color { transition: none; }
  .detail-card--pop { animation: none; }
  .full-page-enter-from, .card-menu-enter-from { transform: none; }
  .cancel-modal-enter-from .cancel-modal__card { transform: none; }
}
</style>
