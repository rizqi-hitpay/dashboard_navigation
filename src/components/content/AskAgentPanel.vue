<template>
  <div class="flex flex-col h-full bg-white" style="width: 360px;">

    <!-- ── Head: 44px ── -->
    <div class="flex items-center shrink-0" style="height: 44px; padding: 12px 16px; border-bottom: 1px solid #e5e6ea;">
      <!-- Conversation selector -->
      <button class="flex items-center gap-2 text-[13px] text-[#03102f] hover:opacity-70 transition-opacity">
        {{ activeTab === 'chat' ? 'Live Chat' : 'Setup guide' }}
        <svg v-if="activeTab !== 'chat'" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M3.5 5.5l3 3 3-3" stroke="#03102f" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <!-- Action icons -->
      <div class="flex items-center ml-auto" style="gap: 12px;">
        <button class="hover:opacity-70 transition-opacity">
          <img :src="composeIcon" style="width: 16px; height: 16px;" />
        </button>
        <button class="hover:opacity-70 transition-opacity">
          <img :src="minimizeIcon" style="width: 16px; height: 16px;" />
        </button>
        <button class="hover:opacity-70 transition-opacity" @click="$emit('close')">
          <img :src="closeIcon" style="width: 16px; height: 16px;" />
        </button>
      </div>
    </div>

    <!-- ── Tab group: AI Assistant · Live Chat ── -->
    <div class="shrink-0 w-full" style="padding: 4px 8px;">
      <div class="relative flex items-center w-full" style="background: #fcfcfd; border: 1px solid #f2f2f4; border-radius: 40px; padding: 4px; gap: 4px;">
        <!-- Moving pill: slides under the active tab -->
        <div
          class="tab-pill"
          :style="{ transform: `translateX(calc((100% + 4px) * ${activeIndex}))` }"
        />
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="relative z-10 flex-1 flex items-center justify-center"
          style="border-radius: 40px; padding: 4px 8px; gap: 4px;"
          @click="activeTab = tab.key"
        >
          <img :src="activeTab === tab.key ? tab.iconActive : tab.icon" alt="" style="width: 14px; height: 14px;" />
          <span
            class="text-[12px] leading-[1.5] whitespace-nowrap transition-colors duration-200"
            :style="{ color: activeTab === tab.key ? '#03102f' : '#61667c' }"
          >{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- ── Main: scrollable, To-do vertically centered ── -->
    <div v-if="activeTab === 'ai'" class="flex-1 overflow-y-auto flex flex-col items-center justify-center">

      <!-- To-do: 312px wide, gap 16px between Greeting and Setup Guide -->
      <div style="width: 312px; display: flex; flex-direction: column; gap: 16px; padding: 24px 0;">

        <!-- Greeting -->
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <span style="font-size: 16px; font-weight: 500; color: #000000; line-height: 1.375;">Hi Thaisa,</span>
          <span style="font-size: 14px; font-weight: 400; color: #61667c; line-height: 1.5;">How can I help you today?</span>
        </div>

        <!-- Setup Guide card: gradient border wrapper -->
        <div style="background: linear-gradient(to right, #cdbff4, #f8bfbc); padding: 3px; border-radius: 12px; box-shadow: 0px 3px 22px 0px rgba(37,41,49,0.09);">
        <div class="rounded-[9px] overflow-hidden" style="background: #fcfcfd;">

          <!-- Card head -->
          <div style="padding: 8px 12px; border-bottom: 1px solid #ebebee;">
            <div class="flex items-center" style="gap: 4px;">
              <span style="font-size: 14px; font-weight: 500; color: #03102f; line-height: 1.5;">Setup guide</span>
              <span style="font-size: 14px; font-weight: 500; color: #61667c; line-height: 1.5;">(2/7)</span>
            </div>
            <div class="flex items-center" style="gap: 4px; margin-top: 1px;">
              <span style="font-size: 13px; color: #03102f; line-height: 1.5;">Next:</span>
              <span style="font-size: 13px; color: #2364dd; line-height: 1.5;">Add Bank Account</span>
            </div>
          </div>

          <!-- Accordion list: pad 8px, gap 4px -->
          <div style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">

            <template v-for="(acc, idx) in accordions" :key="idx">
              <div class="rounded-[8px] bg-white" style="box-shadow: 0px 3px 22px 0px rgba(37,41,49,0.03); padding: 4px;">

                <!-- Expandable head -->
                <button
                  v-if="!acc.locked"
                  class="w-full flex items-center justify-between"
                  style="padding: 4px 12px; min-height: 28px;"
                  @click="openIndex = openIndex === idx ? null : idx"
                >
                  <span style="font-size: 13px; font-weight: 500; color: #03102f;">{{ acc.title }}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    :style="{ transform: openIndex === idx ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 200ms ease' }"
                  >
                    <path d="M4 10l4-4 4 4" stroke="#9295a5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>

                <!-- Locked head (not expandable) -->
                <div
                  v-else
                  class="flex items-center justify-between"
                  style="padding: 4px 12px; min-height: 28px;"
                >
                  <span style="font-size: 13px; font-weight: 500; color: #03102f;">{{ acc.title }}</span>
                  <!-- Lock icon -->
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5 7V5.5a3 3 0 0 1 6 0V7" stroke="#9295a5" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="3" y="7" width="10" height="7" rx="2" stroke="#9295a5" stroke-width="1.4"/>
                  </svg>
                </div>

                <!-- Checklist items (shown when expanded) -->
                <div
                  v-if="!acc.locked && openIndex === idx"
                  style="padding: 0 12px 8px 12px; display: flex; flex-direction: column; gap: 2px;"
                >
                  <div
                    v-for="item in acc.items"
                    :key="item.text"
                    class="flex items-center"
                    style="gap: 8px; padding: 4px 0;"
                  >
                    <!-- Done: green filled circle + white checkmark -->
                    <span
                      v-if="item.state === 'done'"
                      class="shrink-0 flex items-center justify-center rounded-full"
                      style="width: 12px; height: 12px; background: #2bc37d;"
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l2 2 3-3" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    <!-- Active: white circle, blue border -->
                    <span
                      v-else-if="item.state === 'active'"
                      class="shrink-0 rounded-full"
                      style="width: 12px; height: 12px; background: white; border: 1.5px solid #80acfe;"
                    />
                    <!-- Locked: gray circle -->
                    <span
                      v-else
                      class="shrink-0 rounded-full"
                      style="width: 12px; height: 12px; background: #f2f2f4; border: 1px solid #e5e6ea;"
                    />
                    <span :style="{
                      fontSize: '13px',
                      lineHeight: '1.5',
                      color: item.state === 'done' ? '#9295a5' : item.state === 'active' ? '#03102f' : '#61667c',
                    }">{{ item.text }}</span>
                  </div>
                </div>

              </div>
            </template>

          </div>
        </div>
        </div>

      </div>
    </div>

    <!-- ── Main: Live Chat ── -->
    <div v-else class="flex-1 overflow-y-auto flex flex-col items-center justify-center">
      <div class="flex flex-col items-center text-center" style="width: 312px; gap: 8px; padding: 24px 0;">
        <span class="shrink-0 flex items-center justify-center rounded-full" style="width: 44px; height: 44px; background: #f2f2f4;">
          <img :src="tabChatIcon" alt="" style="width: 22px; height: 22px;" />
        </span>
        <span style="font-size: 16px; font-weight: 500; color: #03102f; line-height: 1.375;">Live Chat</span>
        <span style="font-size: 14px; font-weight: 400; color: #61667c; line-height: 1.5;">Start a conversation with our support team.</span>
      </div>
    </div>

    <!-- ── Chat Input ── -->
    <div class="shrink-0" style="padding: 8px; position: relative;">
      <!-- Animated gradient glow blob -->
      <div class="chat-glow" :class="{ 'chat-glow--hidden': isFocused }" />
      <div
        class="flex items-center bg-white"
        style="position: relative; z-index: 1; border: 1px solid #e5e6ea; border-radius: 16px; padding: 12px; gap: 12px; min-height: 52px;"
      >
        <input
          v-model="chatInput"
          class="flex-1 outline-none bg-transparent"
          style="font-size: 14px; color: #03102f;"
          placeholder="Ask anything..."
          @keydown.enter="sendMessage"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <button
          class="shrink-0 flex items-center justify-center rounded-full"
          style="width: 28px; height: 28px; border: 1px solid #f2f2f4; background: white;"
          @click="sendMessage"
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <path d="M5 11V1M1 5l4-4 4 4" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import composeIcon  from '../../assets/icons/icon-compose.svg'
import minimizeIcon from '../../assets/icons/icon-minimize.svg'
import closeIcon    from '../../assets/icons/icon-agent-close.svg'
import tabSparkleIcon     from '../../assets/icons/icon-tab-sparkle.svg'        // active (filled, purple)
import tabSparkleLineIcon from '../../assets/icons/icon-tab-sparkle-line.svg'   // inactive (line, grey)
import tabChatIcon        from '../../assets/icons/icon-tab-chat.svg'           // inactive (grey)
import tabChatActiveIcon  from '../../assets/icons/icon-tab-chat-active.svg'    // active (dark)

defineEmits(['close'])

const activeTab = ref('ai')   // 'ai' = AI Assistant · 'chat' = Live Chat
const openIndex = ref(0)   // Account Setup starts expanded
const chatInput = ref('')
const isFocused = ref(false)

const tabs = [
  { key: 'ai',   label: 'AI Assistant', icon: tabSparkleLineIcon, iconActive: tabSparkleIcon },
  { key: 'chat', label: 'Live Chat',    icon: tabChatIcon,        iconActive: tabChatActiveIcon },
]

const activeIndex = computed(() => tabs.findIndex(t => t.key === activeTab.value))

function sendMessage() {
  if (!chatInput.value.trim()) return
  chatInput.value = ''
}

const accordions = [
  {
    title: 'Account Setup',
    locked: false,
    items: [
      { state: 'done',   text: 'Account verifications' },
      { state: 'active', text: 'Add bank account' },
      { state: 'locked', text: 'Setup payment method' },
    ],
  },
  {
    title: 'Shopify Plugin',
    locked: false,
    items: [
      { state: 'active', text: 'Download Shopify plugin' },
      { state: 'locked', text: 'Install Shopify plugin' },
      { state: 'locked', text: 'Enter API key and Salt key' },
    ],
  },
  {
    title: 'Payment Links',
    locked: false,
    items: [
      { state: 'active', text: 'Create Payment Links' },
      { state: 'locked', text: 'Share it anywhere' },
      { state: 'locked', text: 'Enter API key and Salt key' },
    ],
  },
  {
    title: 'Other Locked Step',
    locked: true,
    items: [
      { state: 'active', text: 'Item to complete' },
      { state: 'locked', text: 'Share it anywhere' },
    ],
  },
]
</script>

<style scoped>
input::placeholder {
  color: #9295a5;
}

/* Tab group sliding pill — matches the project's 250ms cubic-bezier(0.4,0,0.2,1) motion */
.tab-pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 6px);
  border-radius: 40px;
  background: linear-gradient(to bottom, #ffffff 40%, #fcfcfd);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.04), 0px 3px 8px 0px rgba(38, 42, 50, 0.08);
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.chat-glow {
  position: absolute;
  inset: 8px;
  border-radius: 16px;
  background: linear-gradient(115deg, #9333ea 0%, #22d3ee 100%);
  filter: blur(14px);
  opacity: 0.25;
  z-index: 0;
  pointer-events: none;
  transition: opacity 200ms ease-out;
  animation: chat-glow-drift 6s ease-in-out infinite alternate;
}

.chat-glow--hidden {
  opacity: 0;
}

@keyframes chat-glow-drift {
  from { transform: rotate(-6deg) scaleX(1.0); }
  to   { transform: rotate(6deg)  scaleX(1.08); }
}
</style>
