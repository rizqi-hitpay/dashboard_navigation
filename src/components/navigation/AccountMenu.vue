<template>
  <Teleport to="body">
  <!-- Backdrop: click outside to close -->
  <div v-if="modelValue" class="fixed inset-0 z-40" @click="$emit('update:modelValue', false)" />

  <Transition name="account-menu">
    <div
      v-if="modelValue"
      class="fixed w-[280px] bg-white rounded-[8px] z-50 overflow-hidden"
      :style="menuStyle"
      style="box-shadow: 0px 4px 6px -2px rgba(16,24,40,0.03), 0px 12px 16px -4px rgba(16,24,40,0.08), 0px 0px 0px 1px rgba(0,0,0,0.06);"
    >
      <!-- Section: Select business -->
      <div class="px-1 pt-1 pb-1">
        <div class="px-2 pt-2 pb-1.5">
          <span class="text-[10px] font-medium tracking-widest uppercase text-[#61667c]">Select business</span>
        </div>

        <div
          v-for="biz in businesses"
          :key="biz.id"
          class="flex items-center gap-2 px-2 rounded-[4px] cursor-pointer group transition-colors duration-150"
          :class="biz.active ? 'bg-[#f5f6f9]' : 'hover:bg-[rgba(0,39,113,0.04)]'"
          style="height: 52px;"
          @click="selectBusiness(biz)"
        >
          <!-- Avatar / Check -->
          <div class="shrink-0 w-8 h-8 rounded-[4px] overflow-hidden flex items-center justify-center"
            :style="biz.active ? {} : { background: biz.avatarBg }">
            <template v-if="biz.active">
              <img :src="checkIcon" alt="active" class="w-4 h-4" style="filter: invert(27%) sepia(90%) saturate(1285%) hue-rotate(200deg) brightness(95%) contrast(97%);" />
            </template>
            <template v-else-if="biz.avatarImg">
              <img :src="biz.avatarImg" :alt="biz.name" class="w-full h-full object-cover" />
            </template>
            <template v-else>
              <span class="text-[13px] font-semibold text-white">{{ biz.initial }}</span>
            </template>
          </div>

          <!-- Name -->
          <span
            class="flex-1 text-[12px] leading-[1.4] truncate"
            :class="biz.active ? 'text-[#2364dd]' : 'text-[#03102f]'"
          >{{ biz.name }}</span>

          <!-- Keyboard shortcut -->
          <div class="shrink-0 flex items-center justify-center rounded-[4px] bg-[#f5f6f9] min-w-[24px] px-1" style="height: 22px;">
            <span class="text-[11px] text-[#61667c] whitespace-nowrap">⌘{{ biz.shortcut }}</span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="h-px bg-[#f0f1f5] mx-0" />

      <!-- Section: Account -->
      <div class="px-1 pt-1 pb-1">
        <div class="px-2 pt-2 pb-1.5">
          <span class="text-[10px] font-medium tracking-widest uppercase text-[#61667c]">Account</span>
        </div>

        <button
          v-for="item in accountItems"
          :key="item.label"
          class="w-full flex items-center gap-2 px-2 py-[7px] rounded-[4px] text-left transition-colors duration-150 hover:bg-[rgba(0,39,113,0.04)] cursor-pointer"
        >
          <span class="text-[12px] text-[#03102f]">{{ item.label }}</span>
        </button>
      </div>

      <!-- Divider -->
      <div class="h-px bg-[#f0f1f5]" />

      <!-- Log out -->
      <div class="px-1 py-1">
        <button
          class="w-full flex items-center gap-2 px-2 py-[7px] rounded-[4px] text-left transition-colors duration-150 hover:bg-[rgba(220,53,69,0.05)] cursor-pointer"
        >
          <img :src="signOutIcon" alt="log out" class="w-4 h-4 shrink-0" style="filter: invert(25%) sepia(96%) saturate(2011%) hue-rotate(332deg) brightness(95%) contrast(94%);" />
          <span class="text-[12px] text-[#dc3545]">Log out</span>
        </button>
      </div>
    </div>
  </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import checkIcon from '../../assets/icons/icon-check.svg'
import signOutIcon from '../../assets/icons/icon-sign-out.svg'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  anchor: { type: Object, default: null },
})
defineEmits(['update:modelValue'])

const menuStyle = ref({})

watch(() => props.modelValue, (open) => {
  if (open && props.anchor) {
    const rect = props.anchor.getBoundingClientRect()
    menuStyle.value = {
      bottom: window.innerHeight - rect.top + 6 + 'px',
      left: rect.left + 8 + 'px',
    }
  }
})

const businesses = reactive([
  {
    id: 1,
    name: 'Shenzhen Huaju Advertising Vietnam Co., LTD',
    initial: 'S',
    avatarBg: '#002771',
    shortcut: 1,
    active: false,
  },
  {
    id: 2,
    name: 'My Cat Shop',
    initial: 'M',
    avatarBg: '#2364dd',
    shortcut: 2,
    active: true,
  },
  {
    id: 3,
    name: 'SukaTani Garut',
    initial: 'S',
    avatarBg: '#e0418c',
    shortcut: 3,
    active: false,
  },
])

const accountItems = [
  { label: 'Account details' },
  { label: 'Security' },
]

function selectBusiness(selected) {
  businesses.forEach(b => { b.active = b.id === selected.id })
}
</script>

<style scoped>
/* Enter: scale up from bottom-left + fade, ease-out for snappy open feel */
.account-menu-enter-active {
  transition: opacity 180ms ease-out, transform 180ms ease-out;
  transform-origin: bottom left;
  will-change: opacity, transform;
}
/* Leave: shrink back down + fade, ease-in for natural close */
.account-menu-leave-active {
  transition: opacity 130ms ease-in, transform 130ms ease-in;
  transform-origin: bottom left;
  will-change: opacity, transform;
}

.account-menu-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
.account-menu-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
</style>
