<template>
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title: back link + vendor name + actions -->
      <div class="flex items-center gap-[16px] px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-1 flex-col gap-[12px] items-start min-w-px">
          <button
            type="button"
            class="flex items-center gap-[4px] cursor-pointer text-[#61667c] hover:text-[#03102f] transition-colors duration-150"
            @click="$router.push('/vendors')"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.8 3.5L5.3 7l3.5 3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[12px] font-medium leading-[1.5]">Back</span>
          </button>
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">{{ vendor.name }}</p>
        </div>
        <div class="flex items-center gap-[8px] shrink-0">
          <button
            type="button"
            class="flex items-center justify-center size-[36px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);"
            aria-label="More actions"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="3.9" cy="9" r="1.4" fill="#61667c" /><circle cx="9" cy="9" r="1.4" fill="#61667c" /><circle cx="14.1" cy="9" r="1.4" fill="#61667c" /></svg>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-[8px] h-[36px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="$router.push('/bills/new')"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.5 2.5h9a1 1 0 011 1v11.3l-2.1-1.2-1.9 1.2-1.5-1.2-1.5 1.2-1.9-1.2-2.1 1.2V3.5a1 1 0 011-1z" stroke="#fff" stroke-width="1.3" stroke-linejoin="round" /><path d="M6.4 6.3h5.2M6.4 9h3.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" /></svg>
            <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Create Bill</span>
          </button>
        </div>
      </div>

      <!-- Detail grid: 2 rows × 3 cols on grey/50 -->
      <div class="w-full px-[24px] shrink-0">
        <div class="w-full rounded-[8px] border border-[#e5e6ea] bg-[#fcfcfd] overflow-hidden">
          <div
            v-for="(row, ri) in detailRows"
            :key="ri"
            class="flex items-start w-full"
            :class="ri < detailRows.length - 1 ? 'border-b border-[#e5e6ea]' : ''"
          >
            <div
              v-for="(item, ci) in row"
              :key="item.label"
              class="flex flex-1 flex-col gap-[2px] items-start min-w-px p-[12px]"
              :class="ci < row.length - 1 ? 'border-r border-[#e5e6ea]' : ''"
            >
              <p class="text-[14px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">{{ item.label }}</p>
              <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] w-full">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="w-full px-[24px] pt-[24px] shrink-0">
        <div class="flex items-start gap-[16px] w-full">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="flex flex-1 flex-col min-w-px rounded-[8px] border border-[#e5e6ea] bg-white overflow-hidden"
          >
            <div class="flex items-center gap-[8px] pl-[12px] pr-[16px] py-[8px] w-full border-b border-[#e5e6ea]">
              <p class="flex-1 min-w-px text-[12px] font-normal text-[#03102f] leading-[1.5]">{{ stat.label }}</p>
            </div>
            <div class="flex items-center gap-[8px] px-[16px] py-[12px] w-full">
              <p
                class="flex-1 min-w-px text-[18px] font-medium leading-[1.35] whitespace-nowrap overflow-hidden text-ellipsis"
                style="font-family: 'Reddit Mono', ui-monospace, monospace;"
                :style="{ color: stat.warning ? '#bd8400' : '#03102f' }"
              >{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section tabs -->
      <div class="w-full px-[24px] pt-[24px] shrink-0">
        <div class="flex items-start w-full border-b border-[#e5e6ea]">
          <button
            v-for="t in sectionTabs"
            :key="t"
            type="button"
            class="flex items-center justify-center gap-[8px] min-w-[88px] px-[12px] pb-[12px] -mb-px transition-colors duration-150"
            :class="activeSection === t ? 'border-b-2 border-[#2465de]' : 'border-b-2 border-transparent'"
            @click="activeSection = t"
          >
            <span
              class="text-[14px] leading-[1.5] whitespace-nowrap"
              :class="activeSection === t ? 'font-medium text-[#03102f]' : 'font-normal text-[#61667c]'"
            >{{ t }}</span>
          </button>
        </div>
      </div>

      <!-- Bills table -->
      <div v-if="activeSection === 'Bills'" class="flex flex-col gap-[24px] w-full px-[24px] pt-[24px] pb-[12px]">
        <div class="w-full rounded-[8px] border border-[#e5e6ea] overflow-hidden bg-white">

          <!-- Toolbar -->
          <div class="flex items-center justify-between gap-[8px] h-[44px] px-[12px] py-[8px] bg-white border-b-[0.5px] border-[#cbcdd4]">
            <div class="flex items-start gap-[4px]">
              <button
                v-for="t in billTabs"
                :key="t"
                type="button"
                class="flex items-center justify-center min-w-[48px] px-[8px] py-[4px] rounded-[8px] text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-150"
                :class="activeBillTab === t ? 'bg-[#e5e6ea] font-medium text-[#03102f]' : 'font-normal text-[#61667c] hover:bg-[#f6f7f9]'"
                @click="activeBillTab = t"
              >{{ t }}</button>
            </div>
            <button
              type="button"
              class="flex items-center justify-center size-[28px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              aria-label="Search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
            </button>
          </div>

          <!-- Table -->
          <div class="w-full overflow-x-auto">
            <table class="w-full border-collapse min-w-[1000px]" style="table-layout: fixed;">
              <colgroup>
                <col style="width: 151px;" />
                <col style="width: 146px;" />
                <col />
                <col style="width: 146px;" />
                <col style="width: 154px;" />
                <col style="width: 115px;" />
                <col style="width: 134px;" />
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
                  v-for="b in filteredBills"
                  :key="b.invoice"
                  class="hover:bg-[#fcfcfd] transition-colors duration-150 [&:last-child>td]:border-b-0"
                >
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ b.invoice }}</p>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace; font-weight: 500;">{{ b.amount }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ b.category }}</p>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span class="text-[13px] text-[#03102f] leading-[1.4] whitespace-nowrap" style="font-family: 'Reddit Mono', ui-monospace, monospace;">{{ b.due }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <span
                      class="inline-flex items-center px-[10px] py-[3px] rounded-full text-[12px] font-medium whitespace-nowrap"
                      :style="{ background: billStatusStyle(b.status).bg, color: billStatusStyle(b.status).text }"
                    >{{ b.status }}</span>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-r border-[#e5e6ea]">
                    <p class="text-[13px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ b.sync }}</p>
                  </td>
                  <td class="h-[44px] px-[12px] py-[8px] align-middle border-b border-[#e5e6ea]">
                    <a href="#" class="text-[13px] font-medium text-[#2465de] hover:underline cursor-pointer whitespace-nowrap" @click.prevent>See details</a>
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

      <!-- Payment Information -->
      <div v-else-if="activeSection === 'Payment Information'" class="flex flex-col w-full px-[24px] pt-[24px] pb-[12px]">
        <div class="flex flex-col w-full rounded-[12px] bg-[#f8f9fc] p-[4px]">

          <!-- Top: title + Add new -->
          <div class="flex items-center gap-[8px] w-full">
            <div class="flex flex-1 flex-col gap-[2px] items-start justify-center min-w-px p-[16px]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Payment Information</p>
            </div>
            <div class="flex flex-col items-start px-[16px] shrink-0">
              <button
                type="button"
                class="flex items-center justify-center gap-[6px] h-[28px] px-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" /></svg>
                <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Add new</span>
              </button>
            </div>
          </div>

          <!-- Fields card -->
          <div
            class="flex flex-col w-full rounded-[8px] bg-white py-[16px]"
            style="filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.06)) drop-shadow(0px 1px 0.5px rgba(0,0,0,0.06));"
          >
            <div class="flex flex-col w-full px-[16px]">
              <div
                v-if="!vendor.missing"
                class="flex flex-col gap-[12px] justify-center w-full rounded-[8px] border border-[#e5e6ea] bg-white px-[16px] pt-[12px] pb-[16px]"
              >
                <div class="flex items-center gap-[8px] h-[24px]">
                  <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">DBS Bank Singapore</p>
                  <span class="flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] bg-[#e5eeff]">
                    <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] text-center whitespace-nowrap">Primary</span>
                  </span>
                </div>
                <div class="flex flex-wrap items-center gap-[16px]">
                  <div class="flex items-center gap-[4px]">
                    <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke="#03102f" stroke-width="1.2" /><path d="M8 4.6v6.8M9.7 6.1c-.35-.55-.95-.85-1.7-.85-1 0-1.75.55-1.75 1.35 0 1.7 3.5.85 3.5 2.55 0 .8-.75 1.35-1.75 1.35-.75 0-1.35-.3-1.7-.85" stroke="#03102f" stroke-width="1.1" stroke-linecap="round" /></svg>
                    <span class="text-[12px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">SGD</span>
                  </div>
                  <div class="flex items-center gap-[4px]">
                    <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5.5h9M10 3.5l2 2-2 2M13 10.5H4M6 8.5l-2 2 2 2" stroke="#03102f" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    <span class="text-[12px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ transferType }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center justify-center w-full py-[24px]">
                <p class="text-[13px] font-normal text-[#8093b8] leading-[1.5]">No payment information yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div v-else-if="activeSection === 'Details'" class="flex flex-col w-full px-[24px] pt-[24px] pb-[12px]">
        <div class="flex flex-col w-full rounded-[12px] bg-[#f8f9fc] p-[4px]">

          <!-- Top: title + Edit (read) / Cancel + Save (edit) -->
          <div class="flex items-center gap-[8px] w-full">
            <div class="flex flex-1 flex-col gap-[2px] items-start justify-center min-w-px p-[16px]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Details</p>
            </div>
            <div v-if="!detailsEditing" class="flex flex-col items-start px-[16px] shrink-0">
              <button
                type="button"
                class="flex items-center justify-center gap-[6px] h-[28px] p-[8px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f1f5]"
                @click="startEditDetails"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.2 2.6a1.4 1.4 0 012 2L5.4 12.4l-2.7.7.7-2.7 7.8-7.8z" stroke="#61667c" stroke-width="1.2" stroke-linejoin="round" /></svg>
                <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Edit</span>
              </button>
            </div>
            <div v-else class="flex items-start gap-[8px] px-[16px] shrink-0">
              <button
                type="button"
                class="flex items-center justify-center h-[28px] w-[59px] p-[8px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="detailsEditing = false"
              >
                <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center h-[28px] w-[59px] p-[8px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="saveEditDetails"
              >
                <span class="text-[12px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Save</span>
              </button>
            </div>
          </div>

          <!-- Fields card -->
          <div
            class="flex flex-col w-full rounded-[8px] bg-white py-[16px]"
            style="filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.06)) drop-shadow(0px 1px 0.5px rgba(0,0,0,0.06));"
          >
            <div class="flex flex-col w-full px-[16px]">

              <!-- Read view -->
              <div v-if="!detailsEditing" class="flex flex-wrap items-start w-full rounded-[8px] px-[16px]">
                <div class="flex flex-1 items-start gap-[24px] min-w-px">
                  <div
                    v-for="(group, gi) in detailGroups"
                    :key="gi"
                    class="flex flex-1 flex-col items-start min-w-px"
                  >
                    <div
                      v-for="item in group"
                      :key="item.label"
                      class="flex items-start py-[8px] w-full"
                    >
                      <p class="w-[164px] shrink-0 text-[14px] font-normal text-[#61667c] leading-[1.5]">{{ item.label }}:</p>
                      <p class="flex-1 min-w-px text-[14px] font-normal text-[#03102f] leading-[1.5]">{{ item.value }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit view: shared design-system inputs -->
              <div v-else class="flex flex-col gap-[16px] w-full px-[16px] py-[12px]">
                <FieldRows :rows="editRows" :values="editValues" />
                <div class="flex flex-col items-center w-full">
                  <div class="h-px w-[120px] bg-[#e5e6ea]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div v-else class="flex flex-col w-full px-[24px] pt-[24px] pb-[12px]">
        <div class="flex flex-col w-full rounded-[12px] bg-[#f8f9fc] p-[4px]">

          <!-- Top: title -->
          <div class="flex items-center gap-[8px] w-full">
            <div class="flex flex-1 flex-col gap-[2px] items-start justify-center min-w-px p-[16px]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Timeline</p>
            </div>
          </div>

          <!-- Events card -->
          <div
            class="flex flex-col w-full rounded-[8px] bg-white py-[16px]"
            style="filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.06)) drop-shadow(0px 1px 0.5px rgba(0,0,0,0.06));"
          >
            <div class="flex flex-col w-full px-[16px]">
              <div class="flex flex-col w-full rounded-[8px] px-[16px]">
                <div
                  v-for="(event, ei) in timelineEvents"
                  :key="ei"
                  class="relative flex items-start gap-[4px] py-[8px] w-full"
                >
                  <!-- Connector to the next dot -->
                  <div
                    v-if="ei < timelineEvents.length - 1"
                    class="absolute left-[11px] w-px bg-[#e5e6ea]"
                    style="top: 23px; bottom: -16px;"
                  />
                  <!-- Dot (first event = active state) -->
                  <svg class="relative shrink-0" width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <template v-if="ei === 0">
                      <circle cx="11.5" cy="11.5" r="7" stroke="#2465de" stroke-width="1.5" />
                      <circle cx="11.5" cy="11.5" r="3.5" fill="#2465de" />
                    </template>
                    <circle v-else cx="11.5" cy="11.5" r="3.5" fill="#9295a5" />
                  </svg>
                  <!-- Content -->
                  <div class="flex flex-1 items-start gap-[4px] min-w-px">
                    <div class="flex flex-1 items-center gap-[8px] min-w-px">
                      <span
                        class="flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] shrink-0"
                        :style="{ background: timelineChip(event.tone).bg }"
                      >
                        <span class="text-[12px] font-medium leading-[1.5] text-center whitespace-nowrap" :style="{ color: timelineChip(event.tone).text }">{{ event.chip }}</span>
                      </span>
                      <p class="flex-1 min-w-px text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ event.desc }}</p>
                    </div>
                    <div class="flex items-center justify-end h-[24px] shrink-0">
                      <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">{{ event.date }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getVendor } from '../../composables/useVendors.js'
import { statusStyle } from '../../composables/useBills.js'
import FieldRows from '../forms/FieldRows.vue'

const route = useRoute()

// Fall back to the flagship mock vendor when opened without an id
const vendor = getVendor(route.query.id) ?? { name: 'Orion Ventures', email: 'finance@orionventure.capital', payment: 'SWIFT / ****6789' }

// Info grid: bank account + transfer type derived from the vendor's payment method
const transferType = vendor.missing ? '—' : (vendor.payment?.split(' / ')[0] ?? '—')
const bankAccount = vendor.missing ? '—' : `DBS Bank - 4738239${vendor.payment?.slice(-2) ?? '10'}`
const detailRows = [
  [
    { label: 'Email address', value: vendor.email },
    { label: 'Phone number', value: '+60 2183 177' },
    { label: 'Tax ID', value: '2121997790' },
  ],
  [
    { label: 'Address', value: '123 Marina Bay Sands, Singapore 018956' },
    { label: 'Bank account', value: bankAccount },
    { label: 'Transfer type', value: transferType },
  ],
]

const stats = [
  { label: 'Total spend (all time)', value: 'SGD 48,290.00' },
  { label: 'This month', value: 'SGD 3,290.00' },
  { label: 'This quarter', value: 'SGD 9,870.00' },
  { label: 'Outstanding', value: 'SGD 1,200.00', warning: true },
]

// Details tab: editable record (kept consistent with the info grid above)
const details = reactive({
  legalName: vendor.name,
  entityType: 'Company',
  email: vendor.email,
  phone: '+60 2183 177',
  taxId: '2121997790',
  address: '123 Marina Bay Sands, Singapore 018956',
  notes: 'Main utilities provider. Monthly billing cycle. Invoice usually arrives 1st of month.',
})

const detailGroups = computed(() => [
  [
    { label: 'Legal name', value: details.legalName },
    { label: 'Entity type', value: details.entityType },
    { label: 'Email', value: details.email },
    { label: 'Phone', value: details.phone },
  ],
  [
    { label: 'Tax ID', value: details.taxId },
    { label: 'Address', value: details.address },
    { label: 'Notes', value: details.notes },
  ],
])

// Edit mode: shared FieldRows inputs, values keyed by field label
const detailsEditing = ref(false)
const editValues = reactive({})

const editRows = computed(() => [
  [
    { label: 'Legal name', placeholder: 'Select legal name', options: [details.legalName, `${vendor.name} Pte Ltd`] },
    { label: 'Entity type', placeholder: 'Select entity type', options: ['Individual', 'Sole-proprietorship', 'Company', 'Partnership'] },
  ],
  [
    { label: 'Email address', placeholder: 'Select email address', options: [details.email, details.email.replace(/^[^@]+/, 'billing')], helper: 'Used for matching incoming invoices from Bill Inbox' },
    { label: 'Phone number', type: 'phone', placeholder: '877 1261 8181' },
  ],
  [
    { label: 'Tax ID', placeholder: 'Enter tax ID' },
    { label: 'Address', placeholder: 'Enter address' },
  ],
  [
    { label: 'Notes (optional)', placeholder: 'Internal notes about this vendor' },
  ],
])

function startEditDetails() {
  Object.assign(editValues, {
    'Legal name': details.legalName,
    'Entity type': details.entityType,
    'Email address': details.email,
    'Phone number': details.phone.replace(/^\+\d+\s*/, ''),
    'Tax ID': details.taxId,
    'Address': details.address,
    'Notes (optional)': details.notes,
  })
  detailsEditing.value = true
}

function saveEditDetails() {
  const dialCode = details.phone.match(/^\+\d+/)?.[0] ?? '+65'
  Object.assign(details, {
    legalName: editValues['Legal name'],
    entityType: editValues['Entity type'],
    email: editValues['Email address'],
    phone: `${dialCode} ${editValues['Phone number']}`.trim(),
    taxId: editValues['Tax ID'],
    address: editValues['Address'],
    notes: editValues['Notes (optional)'],
  })
  detailsEditing.value = false
}

const sectionTabs = ['Bills', 'Payment Information', 'Details', 'Timeline']
const activeSection = ref('Bills')

// Timeline tab: newest first; the top event renders the active (ringed) dot
const timelineEvents = [
  { tone: 'success', chip: 'Payment completed', desc: 'FS-2025-003 — SGD 7,200.00 to UOB ****8832', date: 'By System at 13 Apr 2024 at 08:34' },
  { tone: 'info', chip: 'Vendor matched', desc: 'to bill FS-2025-003 via bank account match', date: 'By System at 12 Apr 2024 at 14:23' },
  { tone: 'success', chip: 'Payment completed', desc: 'FS-2025-002 — SGD 5,800.00 to UOB ****8832', date: 'By System at 28 Mar 2024 at 09:51' },
  { tone: 'error', chip: 'Payment Failed', desc: 'Unable to verify FS-2025-002 — SGD 5,800.00 to UOB ****8832', date: 'By System at 19 Mar 2024 at 18:02' },
  { tone: 'info', chip: 'Payment method linked', desc: 'FAST / SGD ****8832 (UOB Bank)', date: 'By Thaisa Almeida at 12 Mar 2024 at 11:45' },
  { tone: 'neutral', chip: 'Vendor created', desc: 'migrated from beneficiary', date: 'By Thaisa Almeida at 09 Mar 2024 at 16:59' },
]

function timelineChip(tone) {
  const map = {
    success: { bg: '#e6f9f0', text: '#238b5b' },
    info: { bg: '#f5f6f9', text: '#002771' },
    error: { bg: '#f9e9e9', text: '#c20a1c' },
    neutral: { bg: '#f2f2f4', text: '#484d61' },
  }
  return map[tone] ?? map.neutral
}

const billTabs = ['All', 'Completed', 'Pending', 'Overdue', 'Draft']
const activeBillTab = ref('All')

const columns = [
  { key: 'invoice', label: 'Invoice #', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'due', label: 'Due date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'sync', label: 'Sync', sortable: false },
  { key: 'action', label: '', sortable: false },
]

const vendorBills = [
  { invoice: 'INV-104857', amount: 'SGD 9876.54', category: 'Inventory, materials', due: '2020-04-23', status: 'Pending', sync: 'N/A' },
  { invoice: 'INV-857392', amount: 'SGD 4321.87', category: 'Inventory, materials', due: '2021-03-15', status: 'Completed', sync: 'N/A' },
  { invoice: 'INV-293756', amount: 'SGD 6543.21', category: 'Inventory, materials', due: '2020-09-01', status: 'Overdue', sync: 'N/A' },
  { invoice: 'INV-385964', amount: 'SGD 8765.43', category: 'Inventory, materials', due: '2021-11-02', status: 'Completed', sync: 'N/A' },
  { invoice: 'INV-957382', amount: 'SGD 5421.92', category: 'Inventory, materials', due: '2021-07-07', status: 'Failed', sync: 'N/A' },
  { invoice: 'INV-492857', amount: 'SGD 2345.67', category: 'Inventory, materials', due: '2021-01-04', status: 'Completed', sync: 'N/A' },
]

const filteredBills = computed(() => {
  if (activeBillTab.value === 'All') return vendorBills
  return vendorBills.filter((b) => b.status === activeBillTab.value)
})

// Overdue isn't in the shared bill-status map; it shares Pending's amber styling
function billStatusStyle(status) {
  if (status === 'Overdue') return { bg: '#fff4e5', text: '#bd8400' }
  return statusStyle(status)
}
</script>
