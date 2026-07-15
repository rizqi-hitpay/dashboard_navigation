<template>
  <div class="flex flex-1 flex-col gap-[24px] min-w-0 pb-[12px]">

    <!-- Section title -->
    <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Bill Inbox</p>

    <!-- Enable Bill Inbox -->
    <div class="flex items-center w-full rounded-[8px] border border-[#e5e6ea] p-[16px]">
      <div class="flex flex-1 items-start gap-[24px] min-w-px">
        <div class="flex flex-1 flex-col gap-[2px] items-start min-w-px">
          <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Enable Bill Inbox</p>
          <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] w-full">When disabled, all incoming emails are bounced and no new bills are created. Existing drafts are unaffected.</p>
        </div>
        <button
          type="button"
          class="relative flex items-center w-[42px] h-[24px] rounded-full shrink-0 transition-colors duration-150"
          :style="{ background: enabled ? '#2465de' : '#d4d8e2' }"
          role="switch"
          :aria-checked="enabled"
          @click="enabled = !enabled"
        >
          <span
            class="absolute top-[2px] left-[2px] size-[20px] rounded-full bg-white transition-transform duration-150"
            style="box-shadow: 0px 1px 2px rgba(16,24,40,0.1);"
            :style="{ transform: enabled ? 'translateX(18px)' : 'translateX(0)' }"
          />
        </button>
      </div>
    </div>

    <!-- Forwarding email -->
    <div v-if="enabled" class="flex flex-col gap-[24px] w-full rounded-[8px] border border-[#e5e6ea] p-[16px]">
      <div class="flex flex-col gap-[2px] items-start w-full">
        <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Forwarding email</p>
        <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] w-full">Bills forwarded to this address automatically appear in your inbox as draft bills, ready for review and payment.</p>
      </div>

      <!-- Display state -->
      <div v-if="!editing" class="flex items-start gap-[8px]">
        <div
          class="flex items-center gap-[8px] w-[360px] h-[36px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-[#f8f9fc]"
          style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
        >
          <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="#61667c" stroke-width="1.2" /><path d="M2.5 4.5L8 8.5l5.5-4" stroke="#61667c" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <span class="flex-1 min-w-px text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ address }}@bills.hitpay.com</span>
        </div>
        <button
          type="button"
          class="flex items-center justify-center gap-[6px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          @click="copyAddress"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="#61667c" stroke-width="1.2" /><path d="M10.5 5.5V4a1.5 1.5 0 00-1.5-1.5H4A1.5 1.5 0 002.5 4v5A1.5 1.5 0 004 10.5h1.5" stroke="#61667c" stroke-width="1.2" /></svg>
          <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
        <button
          type="button"
          class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
          style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          @click="startEdit"
        >
          <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Edit</span>
        </button>
      </div>

      <!-- Edit state -->
      <div v-else class="flex flex-col gap-[16px] items-start w-full">
        <div class="flex items-start gap-[8px]">
          <div
            class="flex items-stretch w-[360px] rounded-[8px] border border-[#e5e6ea] bg-white overflow-hidden"
            style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
          >
            <input
              ref="editInputEl"
              v-model="editLocal"
              type="text"
              class="flex-1 min-w-0 h-[36px] px-[8px] bg-white border-none outline-none text-[14px] font-normal text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
              placeholder="your-name"
            />
            <div class="w-px bg-[#e5e6ea] shrink-0" />
            <div class="flex items-center h-[36px] px-[8px] bg-[#f8f9fc] shrink-0">
              <span class="text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">@bills.hitpay.com</span>
            </div>
          </div>
          <button
            type="button"
            class="flex items-center justify-center h-[36px] min-w-[36px] px-[12px] rounded-[8px] border border-[#2465de] shrink-0 transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            @click="saveEdit"
          >
            <span class="text-[14px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Save</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]"
            @click="editing = false"
          >
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Cancel</span>
          </button>
        </div>

        <!-- Warning -->
        <div class="flex items-center gap-[8px] w-full pl-[8px] pr-[12px] py-[8px] rounded-[8px] bg-[#fff9ec] border border-[#ffecc7]">
          <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.9L15.2 14H.8L8 1.9z" fill="#f4b840" /><path d="M8 6.2v3.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" /><circle cx="8" cy="11.9" r="0.8" fill="#fff" /></svg>
          <p class="flex-1 min-w-px text-[12px] font-normal text-[#03102f] leading-[1.5]">Updating your forwarding address will deactivate the old one. Update approved senders before saving.</p>
        </div>
      </div>
    </div>

    <!-- Approved senders -->
    <div v-if="enabled" class="flex flex-col gap-[24px] w-full rounded-[8px] border border-[#e5e6ea] p-[16px]">
      <div class="flex flex-col gap-[2px] items-start w-full">
        <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Approved senders</p>
        <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] w-full">Only emails from these addresses or domains will be accepted. All other senders are bounced. The business owner is added automatically</p>
      </div>
      <div class="flex flex-col gap-[16px] items-start w-full">
        <form class="flex items-start gap-[8px]" @submit.prevent="addSender">
          <div
            class="sender-input flex items-center w-[360px] h-[36px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white"
            style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
          >
            <input
              v-model="newSender"
              type="text"
              placeholder="Enter email address"
              class="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-[14px] font-normal text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
            />
          </div>
          <button
            type="submit"
            class="flex items-center justify-center h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
          >
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Add sender</span>
          </button>
        </form>

        <div class="flex flex-wrap items-center gap-[4px] w-full">
          <!-- Owner chip: blue outline, not removable -->
          <span class="flex items-center gap-[8px] min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-white border border-[#80acfe]">
            <svg class="shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="#2465de" stroke-width="1.2" /><path d="M2.5 4.5L8 8.5l5.5-4" stroke="#2465de" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">{{ owner }} (owner)</span>
          </span>
          <!-- Removable sender chips: purple outline -->
          <span
            v-for="sender in senders"
            :key="sender"
            class="flex items-center gap-[8px] min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-white border border-[#d8a4f6]"
          >
            <svg class="shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="#7d1ab7" stroke-width="1.2" /><path d="M2.5 4.5L8 8.5l5.5-4" stroke="#7d1ab7" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[12px] font-medium text-[#7d1ab7] leading-[1.5] whitespace-nowrap">{{ sender }}</span>
            <button type="button" class="flex items-center justify-center shrink-0" aria-label="Remove sender" @click="removeSender(sender)">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" fill="#7d1ab7" /><path d="M6.7 6.7l4.6 4.6M11.3 6.7l-4.6 4.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round" /></svg>
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const enabled = ref(true)

// ── Forwarding email ──
const address = ref('locally.company')
const editing = ref(false)
const editLocal = ref('')
const editInputEl = ref(null)
const copied = ref(false)
let copiedTimer = null

function copyAddress() {
  navigator.clipboard?.writeText(`${address.value}@bills.hitpay.com`)
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1500)
}

async function startEdit() {
  editLocal.value = address.value
  editing.value = true
  await nextTick()
  editInputEl.value?.focus()
}

function saveEdit() {
  const local = editLocal.value.trim()
  if (local) address.value = local
  editing.value = false
}

// ── Approved senders ──
const owner = 'david@locally.com'
const senders = ref(['lisa@locally.com', 'anna.gateway@website.com', 'billy.jones@alt-website.com'])
const newSender = ref('')

function addSender() {
  const email = newSender.value.trim()
  if (!email || !email.includes('@') || senders.value.includes(email)) return
  senders.value.push(email)
  newSender.value = ''
}

function removeSender(sender) {
  senders.value = senders.value.filter((s) => s !== sender)
}
</script>

<style scoped>
.sender-input {
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.sender-input:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
}
</style>
