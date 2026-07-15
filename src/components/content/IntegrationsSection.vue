<template>
  <div class="flex flex-1 flex-col gap-[24px] min-w-0 pb-[12px]">

    <!-- ── Not connected: Connect card ── -->
    <template v-if="stage === 'initial'">
      <div class="flex justify-center w-full pt-[96px]">
        <div
          class="flex flex-col gap-[16px] w-[360px] max-w-full rounded-[16px] border border-[#f2f2f4] bg-white p-[24px]"
          style="box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09), 0px 1px 3px 0px rgba(0,0,0,0.06);"
        >
          <!-- logos -->
          <div class="flex items-center justify-center gap-[16px] pt-[8px]">
            <span class="flex items-center justify-center size-[44px] rounded-full bg-[#13b5ea]">
              <span class="text-[15px] font-medium text-white leading-none" style="letter-spacing: -0.3px;">xero</span>
            </span>
            <svg width="28" height="16" viewBox="0 0 28 16" fill="none"><path d="M6 4h17M20 1l3 3-3 3" stroke="#2465de" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /><path d="M22 12H5M8 9l-3 3 3 3" stroke="#9295a5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="flex items-center justify-center size-[44px] rounded-full bg-[#002771] border-[3px] border-[#0a3585]">
              <span class="text-[18px] font-semibold text-white leading-none">H</span>
            </span>
          </div>
          <div class="flex flex-col gap-[8px] items-center text-center">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Connect to Xero</p>
            <p class="text-[13px] font-normal text-[#61667c] leading-[1.5]">Connect your Xero account to automatically sync bills, payments, and contacts. Eliminate double data entry and keep your books in sync.</p>
          </div>
          <div class="flex flex-col gap-[4px] items-center rounded-[8px] bg-[#f8f9fc] px-[16px] py-[12px] text-center">
            <p class="flex items-center gap-[4px] text-[12px] font-normal text-[#03102f] leading-[1.5]">
              <svg class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2.8" y="6" width="8.4" height="5.6" rx="1.2" stroke="#61667c" stroke-width="1.2" /><path d="M4.7 6V4.5a2.3 2.3 0 014.6 0V6" stroke="#61667c" stroke-width="1.2" /></svg>
              Powered by <span class="font-medium">Nango</span>
            </p>
            <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">OAuth, token refresh, and rate limits handled automatically</p>
          </div>
          <button
            type="button"
            class="flex items-center justify-center h-[36px] w-full rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="startConnect"
          >
            <span class="text-[13px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Connect to Xero</span>
          </button>
        </div>
      </div>
    </template>

    <!-- ── Syncing / completed ── -->
    <template v-else-if="stage === 'syncing' || stage === 'done'">
      <div class="flex justify-center w-full pt-[120px]">
        <div class="flex flex-col gap-[12px] w-[360px] max-w-full">
          <div class="flex flex-col gap-[4px]">
            <p v-if="stage === 'syncing'" class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Sync with Xero</p>
            <p v-else class="flex items-center gap-[8px] text-[16px] font-medium text-[#03102f] leading-[1.4]">
              <svg class="shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="#2bc37d" /><path d="M5.4 9.3l2.5 2.5 4.7-5.2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
              Sync completed
            </p>
            <p class="text-[13px] font-normal text-[#61667c] leading-[1.5]">
              {{ stage === 'syncing' ? 'Importing data from Xero. This will only take a moment' : 'Your data have been successfully imported from Xero.' }}
            </p>
          </div>
          <div class="flex flex-col gap-[8px] rounded-[8px] border border-[#e5e6ea] bg-white p-[16px]" style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04);">
            <div class="flex items-center justify-between gap-[8px]">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">{{ stage === 'syncing' ? 'Importing data...' : 'Data imported' }}</p>
              <p class="text-[13px] leading-[1.5]"><span class="font-semibold text-[#03102f]">{{ progress }}</span><span class="font-normal text-[#9295a5]">/100</span></p>
            </div>
            <div class="h-[6px] w-full rounded-full bg-[#eceef2] overflow-hidden">
              <div
                class="h-full rounded-full transition-[width] duration-150 ease-linear"
                :style="{ width: progress + '%', background: stage === 'done' ? '#2bc37d' : '#2465de' }"
              />
            </div>
          </div>
          <button
            v-if="stage === 'done'"
            type="button"
            class="flex items-center justify-center h-[36px] w-full rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="stage = 'connected'"
          >
            <span class="text-[13px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Continue</span>
          </button>
        </div>
      </div>
    </template>

    <!-- ── Connected ── -->
    <template v-else>
      <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Integrations</p>

      <!-- Connection card -->
      <div class="flex flex-col w-full rounded-[8px] border border-[#e5e6ea] p-[16px] gap-[16px]">
        <div class="flex items-start gap-[16px] w-full">
          <div class="flex items-center justify-center size-[56px] rounded-[8px] bg-[#f8f9fc] shrink-0">
            <span class="flex items-center justify-center size-[40px] rounded-full bg-[#13b5ea]">
              <span class="text-[13px] font-medium text-white leading-none" style="letter-spacing: -0.3px;">xero</span>
            </span>
          </div>
          <div class="flex flex-1 flex-col gap-[4px] min-w-px">
            <div class="flex items-center gap-[8px]">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Xero</p>
              <span class="flex items-center justify-center min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-[#e6f9f0]">
                <span class="text-[12px] font-medium text-[#238b5b] leading-[1.5] whitespace-nowrap">Connected</span>
              </span>
            </div>
            <p class="text-[13px] font-normal text-[#61667c] leading-[1.5]">Automatically sync bills, payments, and contacts through Xero</p>
          </div>
          <div class="flex items-center gap-[16px] shrink-0">
            <button type="button" class="text-[14px] font-medium text-[#dc3545] leading-[1.5] hover:underline" @click="confirmDisconnect = true">Disconnect</button>
            <button
              type="button"
              class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
              style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
              @click="mapModalOpen = true"
            >
              <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Map GL Codes</span>
            </button>
          </div>
        </div>
        <div class="h-px w-full bg-[#e5e6ea]" />
        <div class="flex items-start gap-[24px] w-full">
          <div v-for="info in connectionInfo" :key="info.label" class="flex flex-col gap-[4px] min-w-[140px]">
            <p class="text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#61667c] whitespace-nowrap">{{ info.label }}</p>
            <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ info.value }}</p>
          </div>
        </div>
      </div>

      <!-- Bill Sync Settings -->
      <div class="flex flex-col w-full rounded-[8px] border border-[#e5e6ea] p-[16px] gap-[16px]">
        <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Bill Sync Settings</p>
        <div class="flex items-start gap-[24px] w-full">
          <div class="flex flex-1 flex-col gap-[2px] min-w-px">
            <div class="flex items-center gap-[8px]">
              <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Bill Sync Settings</p>
              <span class="flex items-center justify-center min-h-[24px] px-[8px] py-[2px] rounded-[24px]" :style="{ background: autoSync ? '#e6f9f0' : '#f2f2f4' }">
                <span class="text-[12px] font-medium leading-[1.5] whitespace-nowrap" :style="{ color: autoSync ? '#238b5b' : '#484d61' }">Auto sync: {{ autoSync ? 'On' : 'Off' }}</span>
              </span>
            </div>
            <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">When enabled, approved bills automatically sync to Xero as ACCPAY invoices. Payments are recorded when bills are paid.</p>
          </div>
          <button
            type="button"
            class="relative flex items-center w-[42px] h-[24px] rounded-full shrink-0 transition-colors duration-150"
            :style="{ background: autoSync ? '#2465de' : '#d4d8e2' }"
            role="switch"
            :aria-checked="autoSync"
            @click="autoSync = !autoSync"
          >
            <span
              class="absolute top-[2px] left-[2px] size-[20px] rounded-full bg-white transition-transform duration-150"
              style="box-shadow: 0px 1px 2px rgba(16,24,40,0.1);"
              :style="{ transform: autoSync ? 'translateX(18px)' : 'translateX(0)' }"
            />
          </button>
        </div>
        <div class="flex flex-col gap-[8px] items-start w-full">
          <div class="flex flex-col gap-[2px]">
            <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Default Expense Account</p>
            <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Used when a bill's category has no GL code mapping. If not set, bills sync without an account code.</p>
          </div>
          <div class="w-[360px] max-w-full">
            <div class="gl-select">
              <select v-model="defaultExpense" :class="{ 'gl-placeholder': !defaultExpense }">
                <option value="">None (sync without GL code)</option>
                <option v-for="gl in glOptions" :key="gl" :value="gl">{{ gl }}</option>
              </select>
              <svg class="gl-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </div>
          </div>
        </div>
        <div class="h-px w-full bg-[#e5e6ea]" />
        <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] w-full">How it works: Bill approved → Nango creates ACCPAY invoice in Xero → bill paid → Nango records payment. Vendor contacts are auto-created if they don't exist in Xero yet. Chart of Accounts syncs automatically every 6 hours via Nango</p>
      </div>

      <!-- Quick actions -->
      <div class="flex items-center justify-between gap-[16px] w-full rounded-[8px] border border-[#e5e6ea] p-[16px]">
        <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Quick actions</p>
        <div class="flex items-center gap-[8px] shrink-0">
          <button
            v-for="action in ['Refresh chart of accounts', 'Retry all failed syncs']"
            :key="action"
            type="button"
            class="flex items-center justify-center gap-[6px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          >
            <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.2 6.6A5.4 5.4 0 003.5 4.9M2.8 9.4a5.4 5.4 0 009.7 1.7" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" /><path d="M13.4 2.8v2.9h-2.9M2.6 13.2v-2.9h2.9" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">{{ action }}</span>
          </button>
        </div>
      </div>

      <!-- Sync status -->
      <div class="flex flex-col gap-[16px] w-full rounded-[8px] border border-[#e5e6ea] p-[16px]">
        <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">Sync status</p>
        <div class="flex items-start gap-[16px] w-full">
          <div
            v-for="stat in syncStats"
            :key="stat.label"
            class="flex flex-1 flex-col min-w-px rounded-[8px] border border-[#e5e6ea] bg-white overflow-hidden"
          >
            <div class="flex items-center pl-[12px] pr-[16px] py-[8px] w-full border-b border-[#e5e6ea]">
              <p class="flex-1 min-w-px text-[12px] font-normal text-[#03102f] leading-[1.5]">{{ stat.label }}</p>
            </div>
            <div class="flex items-center px-[16px] py-[12px] w-full">
              <p class="text-[18px] font-medium leading-[1.35] whitespace-nowrap" :style="{ color: stat.color || '#03102f' }">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ── Map categories modal ── -->
    <Teleport to="body">
      <Transition name="int-modal">
        <div v-if="mapModalOpen" class="fixed inset-0 z-[70] flex items-start justify-center pt-[48px]" style="background: rgba(3, 16, 47, 0.32);" @click.self="mapModalOpen = false">
          <div class="int-modal__card w-[640px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-96px)] bg-white rounded-[16px] flex flex-col overflow-hidden" style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.09));">
            <!-- header -->
            <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea] w-full shrink-0">
              <div class="flex flex-1 flex-col gap-[2px] min-w-px pt-[2px]">
                <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Map categories to Xero</p>
                <p class="text-[12px] font-normal text-[#61667c] leading-[1.5]">{{ mappedCount }} of {{ mappings.length }} categories are mapped</p>
              </div>
              <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" @click="mapModalOpen = false">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
              </button>
            </div>
            <!-- body -->
            <div class="flex-1 overflow-y-auto flex flex-col p-[24px] pt-[16px] gap-[4px]">
              <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] pb-[12px]">Map your HitPay categories to Xero chart of accounts. Mapped categories sync with the correct GL code when bills are pushed to Xero.</p>
              <div class="flex items-center pb-[8px] border-b border-[#e5e6ea]">
                <p class="flex-1 text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#61667c]">HitPay Category</p>
                <p class="w-[286px] text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#61667c]">GL Code (Xero)</p>
              </div>
              <div v-for="m in mappings" :key="m.category" class="flex flex-col gap-[4px] py-[8px]">
                <div class="flex items-center gap-[8px]">
                  <div class="flex flex-1 items-center gap-[8px] min-w-px">
                    <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ m.category }}</p>
                    <svg v-if="!m.gl" class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.6L14.4 13.4H1.6L8 2.6z" stroke="#bd8400" stroke-width="1.2" stroke-linejoin="round" /><path d="M8 6.6v3" stroke="#bd8400" stroke-width="1.2" stroke-linecap="round" /><circle cx="8" cy="11.4" r="0.7" fill="#bd8400" /></svg>
                  </div>
                  <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 8h10M9.5 5l3 3-3 3" stroke="#9295a5" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  <div class="w-[286px] shrink-0">
                    <div class="gl-select">
                      <select v-model="m.gl" :class="{ 'gl-placeholder': !m.gl }">
                        <option value="" disabled>Select GL Code</option>
                        <option v-for="gl in glOptions" :key="gl" :value="gl">{{ gl }}</option>
                      </select>
                      <svg class="gl-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                  </div>
                </div>
                <p v-if="!m.gl && m.recommended" class="text-[12px] font-normal text-[#61667c] leading-[1.5]">
                  Recommended GL Code: <span class="font-medium text-[#03102f]">{{ m.recommended }}.</span>
                  <a href="#" class="text-[#2465de] hover:underline" @click.prevent="m.gl = m.recommended">Apply now.</a>
                </p>
              </div>
            </div>
            <!-- footer -->
            <div class="flex items-center justify-end gap-[12px] px-[16px] py-[16px] border-t border-[#e5e6ea] w-full shrink-0 bg-white">
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="mapModalOpen = false"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[100px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="mapModalOpen = false"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Save</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Disconnect confirmation ── -->
    <Teleport to="body">
      <Transition name="int-modal">
        <div v-if="confirmDisconnect" class="fixed inset-0 z-[70] flex items-center justify-center" style="background: rgba(3, 16, 47, 0.32);" @click.self="confirmDisconnect = false">
          <div class="int-modal__card w-[320px] bg-white rounded-[16px] flex flex-col pb-[8px]" style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.09));">
            <div class="flex items-start gap-[16px] p-[16px] w-full">
              <p class="flex-1 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Are you sure?</p>
              <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" @click="confirmDisconnect = false">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
              </button>
            </div>
            <div class="flex flex-col items-center justify-center gap-[12px] p-[16px] w-full">
              <div class="flex items-start p-[12px] rounded-[100px]" style="background: rgba(196, 32, 33, 0.1);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9.2 6.7l1-1a4 4 0 015.6 5.6l-1.9 1.9" stroke="#dc3545" stroke-width="1.6" stroke-linecap="round" /><path d="M14.8 17.3l-1 1a4 4 0 01-5.6-5.6l1.9-1.9" stroke="#dc3545" stroke-width="1.6" stroke-linecap="round" /><path d="M4.5 4.5l2.2 2.2M19.5 19.5l-2.2-2.2" stroke="#dc3545" stroke-width="1.6" stroke-linecap="round" /></svg>
              </div>
              <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] text-center w-full">Do you want to disconnect Xero integrations?</p>
            </div>
            <div class="flex items-center justify-center gap-[12px] px-[16px] py-[20px] w-full">
              <button
                type="button"
                class="flex flex-1 items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="confirmDisconnect = false"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex flex-1 items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#dc3545] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #e25563, #cc2436); box-shadow: 0px 1.5px 0px 0px #c8303f;"
                @click="disconnect"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'

// initial → syncing → done → connected
const stage = ref('initial')
const progress = ref(0)
let progressTimer = null

// Simulates the OAuth hop + Nango import (the design's "Open Xero via browser" step)
function startConnect() {
  stage.value = 'syncing'
  progress.value = 0
  clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progress.value = Math.min(100, progress.value + Math.ceil(Math.random() * 6))
    if (progress.value >= 100) {
      clearInterval(progressTimer)
      setTimeout(() => (stage.value = 'done'), 350)
    }
  }, 80)
}

onUnmounted(() => clearInterval(progressTimer))

const connectionInfo = [
  { label: 'Organisation', value: 'Locally Pte Ltd' },
  { label: 'Accounts synced', value: '23 accounts' },
  { label: 'Last synced', value: '2:07 pm, 07/04/2026' },
  { label: 'Connection', value: 'via Nango' },
]

const autoSync = ref(true)
const defaultExpense = ref('')

const syncStats = [
  { label: 'Bills synced', value: '16', color: '#238b5b' },
  { label: 'Bills pending', value: '6', color: '#bd8400' },
  { label: 'Bills failed', value: '4', color: '#dc3545' },
  { label: 'Contact linked', value: '129' },
]

// ── Map categories modal ──
const mapModalOpen = ref(false)

const glOptions = [
  '100 - Office Expense',
  '100 - Cost of Goods Sold',
  '150 - Computer Software',
  '200 - Consulting & Accounting',
  '210 - Subcontractors',
  '300 - Rent Expense',
  '320 - Telephone & Internet',
  '400 - Freight & Delivery',
  '400-360 / Government & Tax Feed',
  '433 - Insurance Premiums',
  '493 - Travel & Transport',
  '600 - Advertising',
]

const mappings = reactive([
  { category: 'Internet & Phone', gl: '320 - Telephone & Internet' },
  { category: 'Office Supplies', gl: '100 - Office Expense' },
  { category: 'Software & Subscription', gl: '150 - Computer Software' },
  { category: 'Personal Services', gl: '200 - Consulting & Accounting' },
  { category: 'Contractors', gl: '210 - Subcontractors' },
  { category: 'Inventory / Materials', gl: '100 - Cost of Goods Sold' },
  { category: 'Shipping & Delivery', gl: '400 - Freight & Delivery' },
  { category: 'Tax & Government Fees', gl: '', recommended: '400-360 / Government & Tax Feed' },
  { category: 'Insurance', gl: '', recommended: '433 - Insurance Premiums' },
  { category: 'Rent', gl: '300 - Rent Expense' },
  { category: 'Marketing Services', gl: '600 - Advertising' },
  { category: 'Travel & Transport', gl: '' },
  { category: 'Miscellaneous', gl: '' },
])

const mappedCount = computed(() => mappings.filter((m) => m.gl).length)

// ── Disconnect ──
const confirmDisconnect = ref(false)

function disconnect() {
  confirmDisconnect.value = false
  stage.value = 'initial'
  progress.value = 0
}
</script>

<style scoped>
/* Design-system select (aba style, standalone for this section) */
.gl-select {
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
.gl-select:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
}
.gl-select select {
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
.gl-select select.gl-placeholder {
  color: #9295a5;
}
.gl-select .gl-chevron {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* Modal motion: backdrop fade + card rise */
.int-modal-enter-active { transition: opacity 200ms ease-out; }
.int-modal-leave-active { transition: opacity 150ms ease-in; }
.int-modal-enter-from,
.int-modal-leave-to { opacity: 0; }
.int-modal-enter-active .int-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.int-modal-enter-from .int-modal__card { transform: translateY(12px); }

@media (prefers-reduced-motion: reduce) {
  .int-modal-enter-active, .int-modal-leave-active, .gl-select { transition: none; }
  .int-modal-enter-from .int-modal__card { transform: none; }
}
</style>
