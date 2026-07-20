<template>
  <div class="flex flex-col flex-1 min-h-0 w-full bg-[#f8f9fc] rounded-[12px] p-[4px]">

    <!-- Header -->
    <div class="flex gap-[16px] items-start w-full shrink-0" style="padding: 12px 16px 16px 0;">
      <div class="flex flex-col flex-1 gap-[4px] items-start min-w-0">
        <div class="flex items-center w-full">
          <button
            class="flex items-center justify-center size-[28px] rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(0,39,113,0.04)] transition-colors"
            @click="$emit('back')"
          >
            <img :src="chevronLeftIcon" width="16" height="16" alt="Back" />
          </button>
          <p class="flex-1 min-w-0 text-[16px] font-medium text-[#03102f] leading-[1.4] truncate">{{ request.title }}</p>
        </div>
        <div class="flex flex-wrap items-start w-full" style="padding-left: 24px; column-gap: 12px; row-gap: 4px;">
          <div class="flex gap-[4px] items-center shrink-0">
            <img :src="userIcon" width="14" height="14" alt="" />
            <p class="text-[12px] leading-[1.5] whitespace-nowrap">
              <span class="font-medium text-[#03102f]">{{ request.agent.name }}</span>
              <span class="text-[#61667c]">・{{ request.agent.role }}</span>
            </p>
          </div>
          <div class="flex gap-[4px] items-center shrink-0">
            <img :src="calendarIcon" width="14" height="14" alt="" />
            <p class="text-[12px] leading-[1.5] whitespace-nowrap">
              <span class="text-[#61667c]">Initiated: </span>
              <span class="font-medium text-[#03102f]">{{ request.initiated }}</span>
            </p>
          </div>
          <div class="flex gap-[4px] items-center shrink-0">
            <img :src="calendarIcon" width="14" height="14" alt="" />
            <p class="text-[12px] leading-[1.5] whitespace-nowrap">
              <span class="text-[#61667c]">Due to: </span>
              <span class="font-medium text-[#03102f]">{{ request.due }}</span>
            </p>
          </div>
        </div>
        <!-- Mobile: status chip sits on its own row below the meta, matching the phone layout -->
        <div class="flex md:hidden items-start w-full" style="padding-left: 24px; padding-top: 4px;">
          <RfiStatusChip :status="request.status" />
        </div>
      </div>
      <div class="hidden md:block shrink-0">
        <RfiStatusChip :status="request.status" />
      </div>
    </div>

    <!-- White chat card: hidden on mobile while the checklist is open full-screen -->
    <div
      v-show="!mobileChecklistActive"
      class="bg-white flex flex-1 min-h-0 rounded-[8px] w-full overflow-hidden"
      style="filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.06)) drop-shadow(0px 1px 0.5px rgba(0,0,0,0.06));"
    >
      <div class="flex flex-col flex-1 min-h-0 min-w-0 gap-[24px]" style="padding: 16px;">

        <!-- Messages -->
        <div ref="chatScroll" class="flex flex-col flex-1 min-h-0 gap-[12px] w-full overflow-y-auto">
          <template v-for="msg in request.messages" :key="msg.id">

            <!-- System notice -->
            <div v-if="msg.system" class="w-full rounded-[4px] px-[12px] py-[4px]" style="background: rgba(177,74,237,0.1);">
              <p class="text-[12px] text-[#03102f] leading-[1.5] text-center">{{ msg.text }}</p>
            </div>

            <!-- Compliance (left) -->
            <div v-else-if="msg.from === 'cs'" class="flex gap-[4px] items-start w-full" style="padding-right: 12px;">
              <img :src="avatars[msg.avatar]" class="size-[36px] rounded-full object-cover shrink-0" alt="" />
              <div class="flex flex-col gap-[4px] items-start min-w-0">
                <div class="flex gap-[2px] items-center px-[8px]">
                  <span class="text-[13px] font-medium text-[#03102f] leading-[1.5]">{{ msg.name }}</span>
                  <span class="text-[13px] font-medium text-[#61667c] leading-[1.5]">・</span>
                  <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ msg.time }}</span>
                </div>
                <div class="rounded-[16px] px-[12px] py-[8px]" style="background: #f2f2f4; max-width: 450px;">
                  <div class="text-[13px] text-[#03102f] leading-[1.5]">
                    <template v-if="msg.lines">
                      <template v-for="(line, i) in msg.lines" :key="i">
                        <ol v-if="line.list" class="list-decimal" style="padding-left: 19.5px;">
                          <li v-for="item in line.list" :key="item">{{ item }}</li>
                        </ol>
                        <p v-else class="whitespace-pre-line">{{ line }}</p>
                      </template>
                    </template>
                    <p v-else class="whitespace-pre-line">{{ msg.text }}</p>
                  </div>
                  <div v-if="msg.action === 'checklist' && request.checklist" class="flex flex-col items-start w-full" style="padding-top: 8px;">
                    <button
                      class="flex h-[28px] items-center justify-center gap-[6px] rounded-[8px] shrink-0 cursor-pointer border border-[#f2f2f4] active:translate-y-[1px]"
                      style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5; padding: 8px;"
                      @click="request.checklist.open = true"
                    >
                      <img :src="listCheckIcon" width="16" height="16" alt="" />
                      <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Complete via checklist</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Merchant (right) -->
            <div v-else class="flex justify-end w-full" style="padding-left: 12px;">
              <div class="flex gap-[4px] items-start">
                <!-- Attachments bubble row -->
                <template v-if="msg.attachments">
                  <div
                    v-for="doc in msg.attachments"
                    :key="doc.name"
                    class="relative flex items-center rounded-[24px] shrink-0"
                    style="background: #4c8afd; padding: 8px 8px 8px 36px; max-width: 324px;"
                  >
                    <span class="text-[13px] text-white leading-[1.5] whitespace-nowrap truncate" style="max-width: 320px;">{{ doc.name }}</span>
                    <span class="absolute flex items-center bg-white rounded-full p-[6px]" style="left: 4px; top: 50%; transform: translateY(-50%);">
                      <img :src="fileIcons[doc.type]" width="16" height="16" alt="" />
                    </span>
                  </div>
                  <img v-if="!msg.grouped" :src="avatars[msg.avatar]" class="size-[36px] rounded-full object-cover shrink-0" alt="" />
                  <span v-else class="size-[36px] shrink-0"></span>
                </template>

                <!-- Text bubble -->
                <template v-else>
                  <div class="flex flex-col gap-[4px] items-end min-w-0">
                    <div class="flex gap-[2px] items-center justify-end px-[8px] w-full">
                      <span class="text-[13px] font-medium text-[#03102f] leading-[1.5]">{{ msg.name }}</span>
                      <span class="text-[13px] font-medium text-[#61667c] leading-[1.5]">・</span>
                      <span class="text-[12px] text-[#61667c] leading-[1.5]">{{ msg.time }}</span>
                    </div>
                    <div class="rounded-[16px] px-[12px] py-[8px]" style="background: #4c8afd; max-width: 450px;">
                      <p class="text-[13px] text-white leading-[1.5] whitespace-pre-line">{{ msg.text }}</p>
                    </div>
                  </div>
                  <img :src="avatars[msg.avatar]" class="size-[36px] rounded-full object-cover shrink-0" alt="" />
                </template>
              </div>
            </div>
          </template>
        </div>

        <!-- Composer -->
        <div v-if="composerVisible" class="flex flex-col w-full shrink-0">

          <!-- Ready-for-review banner -->
          <Transition name="rfi-banner">
            <div
              v-if="request.showReadyBanner"
              class="flex gap-[16px] items-start w-full"
              style="background: #f2f2f4; border-radius: 8px 8px 0 0; padding: 12px 12px 16px; margin-bottom: -8px;"
            >
              <p class="flex-1 min-w-0 text-[12px] text-[#03102f] leading-[1.5]">
                Mark this request as ready for review to notify the compliance team. Only then will the status move from
                <span class="font-medium">Awaiting response</span> to <span class="font-medium">Under review</span>.
              </p>
              <button
                class="flex h-[28px] items-center justify-center gap-[6px] rounded-[8px] shrink-0 cursor-pointer border border-[#f2f2f4] active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1); padding: 8px;"
                @click="onMarkReady"
              >
                <img :src="doubleCheckIcon" width="16" height="16" alt="" />
                <span class="text-[12px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Mark as ready for review</span>
              </button>
            </div>
          </Transition>

          <!-- Input box -->
          <div class="relative flex flex-col gap-[8px] w-full rounded-[8px] border border-[#e5e6ea] bg-[#fcfcfd]" style="padding: 10px 8px;">
            <div class="flex items-start w-full" style="padding: 8px;">
              <textarea
                v-model="draft"
                rows="1"
                placeholder="Type here.."
                class="w-full resize-none bg-transparent outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder-[#9295a5]"
                @keydown.enter.exact.prevent="onSend"
              ></textarea>
            </div>
            <div class="flex gap-[8px] items-center justify-end w-full">

              <!-- Pending attachment chips -->
              <div v-if="pendingDocs.length" class="flex flex-1 gap-[8px] items-start min-w-0" style="padding-right: 8px;">
                <div
                  v-for="(doc, i) in pendingDocs"
                  :key="doc.name"
                  class="relative flex items-center gap-[8px] rounded-[8px] border border-[#e5e6ea] bg-white shrink-0"
                  style="padding: 8px 8px 8px 36px;"
                >
                  <span class="text-[13px] text-[#03102f] leading-[1.5] whitespace-nowrap truncate" style="max-width: 320px;">{{ doc.name }}</span>
                  <button class="flex shrink-0 cursor-pointer hover:opacity-70 transition-opacity" @click="pendingDocs.splice(i, 1)">
                    <img :src="xCircleIcon" width="14" height="14" alt="Remove" />
                  </button>
                  <span class="absolute flex items-center bg-white rounded-full p-[6px]" style="left: 3px; top: 50%; transform: translateY(-50%);">
                    <img :src="fileIcons[doc.type]" width="16" height="16" alt="" />
                  </span>
                </div>
              </div>

              <!-- Attach -->
              <button
                class="flex items-center justify-center size-[28px] rounded-full shrink-0 cursor-pointer border border-[#f2f2f4] active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="onAttach"
              >
                <img :src="attachmentIcon" width="16" height="16" alt="Attach" />
              </button>

              <!-- Send -->
              <button
                class="flex items-center justify-center size-[28px] rounded-full shrink-0 cursor-pointer border border-[#2465de] active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="onSend"
              >
                <img :src="arrowTopIcon" width="16" height="16" alt="Send" />
              </button>
            </div>

            <!-- Inner shadow overlay -->
            <div class="absolute inset-0 pointer-events-none rounded-[8px]" style="box-shadow: inset 0px 2px 6px 0px rgba(0,0,0,0.06);"></div>
          </div>
        </div>

      </div>

      <!-- Required checklist panel: slides in by width, chat gives up space
           (motion guideline: "panel push" — 280ms standard curve). Desktop only —
           mobile has no room for a side panel, see the full-screen swap below. -->
      <div
        v-if="request.checklist"
        class="hidden md:block rfi-checklist-push shrink-0 h-full overflow-hidden"
        :class="{ 'is-open': request.checklist.open }"
        :style="{ width: request.checklist.open ? '320px' : '0px' }"
      >
        <RfiChecklistPanel
          class="rfi-checklist-inner"
          :checklist="request.checklist"
          @close="request.checklist.open = false"
          @submit="submitChecklist(request.id)"
        />
      </div>
    </div>

    <!-- Mobile: checklist takes over the full screen instead of pushing beside the chat -->
    <div
      v-if="mobileChecklistActive"
      class="md:hidden flex flex-col flex-1 min-h-0 rounded-[8px] w-full bg-[#fcfcfd] border border-[#e5e6ea] overflow-hidden"
    >
      <RfiChecklistPanel
        :checklist="request.checklist"
        @close="request.checklist.open = false"
        @submit="submitChecklist(request.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { markReadyForReview, sendMessage, submitChecklist } from '../../composables/useRfi.js'
import { isMobile } from '../../composables/useViewport.js'
import RfiStatusChip from './RfiStatusChip.vue'
import RfiChecklistPanel from './RfiChecklistPanel.vue'
import listCheckIcon from '../../assets/icons/rfi-list-check.svg'
import avatarJohn from '../../assets/images/rfi-avatar-john.jpg'
import avatarElies from '../../assets/images/rfi-avatar-elies.jpg'
import chevronLeftIcon from '../../assets/icons/rfi-chevron-left.svg'
import userIcon from '../../assets/icons/rfi-user.svg'
import calendarIcon from '../../assets/icons/rfi-calendar.svg'
import filePdfIcon from '../../assets/icons/rfi-file-pdf.svg'
import fileDocIcon from '../../assets/icons/rfi-file-doc.svg'
import doubleCheckIcon from '../../assets/icons/rfi-double-check.svg'
import attachmentIcon from '../../assets/icons/rfi-attachment.svg'
import arrowTopIcon from '../../assets/icons/rfi-arrow-top.svg'
import xCircleIcon from '../../assets/icons/rfi-x-circle.svg'

const props = defineProps({
  request: { type: Object, required: true },
})

defineEmits(['back'])

const avatars = { john: avatarJohn, elies: avatarElies }
const fileIcons = { pdf: filePdfIcon, doc: fileDocIcon }

const draft = ref('')
const pendingDocs = ref([])
const chatScroll = ref(null)

// Composer only while compliance is waiting on the merchant
const composerVisible = computed(() => props.request.status === 'requesting')

// On mobile the checklist replaces the chat entirely instead of pushing beside it
const mobileChecklistActive = computed(() => isMobile.value && !!(props.request.checklist && props.request.checklist.open))

// Mock file picker: alternate between the two sample documents
function onAttach() {
  const name = pendingDocs.value.length % 2 === 0 ? 'uploaded_doc.pdf' : 'uploaded_doc.doc'
  const type = name.endsWith('.pdf') ? 'pdf' : 'doc'
  pendingDocs.value.push({ name, type })
}

function onSend() {
  if (!draft.value.trim() && !pendingDocs.value.length) return
  sendMessage(props.request.id, draft.value, pendingDocs.value)
  draft.value = ''
  pendingDocs.value = []
}

function onMarkReady() {
  markReadyForReview(props.request.id)
}

function scrollToBottom() {
  nextTick(() => {
    if (chatScroll.value) chatScroll.value.scrollTop = chatScroll.value.scrollHeight
  })
}

watch(() => props.request.messages.length, scrollToBottom, { immediate: true })
watch(() => props.request.id, () => {
  draft.value = ''
  pendingDocs.value = []
  scrollToBottom()
})
</script>

<style scoped>
.rfi-banner-enter-active {
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
.rfi-banner-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.rfi-checklist-push {
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Panel content fades in with a short 16px slide while the width push
   makes room — leave is quicker, like the sidebar view swaps */
.rfi-checklist-inner {
  opacity: 0;
  transform: translateX(16px);
  transition: opacity 130ms ease, transform 130ms ease;
}
.rfi-checklist-push.is-open .rfi-checklist-inner {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 200ms ease-out, transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .rfi-checklist-push,
  .rfi-checklist-inner {
    transition: none;
  }
}
</style>
