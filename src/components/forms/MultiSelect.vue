<template>
  <!-- Multi-select dropdown (Figma: Card-Issuing 270:19170) -->
  <div ref="rootEl" class="relative w-full">

    <!-- Trigger: shows the selected values as chips, or the placeholder -->
    <button
      type="button"
      class="ms-control flex items-center gap-[4px] w-full px-[8px] text-left cursor-pointer flex-wrap"
      :class="{ 'ms-control--open': open }"
      @click="toggle"
    >
      <template v-if="modelValue.length">
        <span
          v-for="v in modelValue"
          :key="v"
          class="inline-flex items-center gap-[4px] min-h-[22px] px-[6px] rounded-[24px] bg-[#f2f2f4] text-[12px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap"
        >
          <span v-if="dotColor(v)" class="size-[6px] rounded-full shrink-0" :style="{ background: dotColor(v) }" />
          {{ labelOf(v) }}
          <span class="flex items-center justify-center cursor-pointer hover:opacity-70" @click.stop="toggleOption(v)">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.6" stroke="#9295a5" stroke-width="1.1" /><path d="M5.2 5.2l3.6 3.6M8.8 5.2l-3.6 3.6" stroke="#9295a5" stroke-width="1.1" stroke-linecap="round" /></svg>
          </span>
        </span>
      </template>
      <span v-else class="flex-1 min-w-0 text-[14px] text-[#9295a5] leading-[1.5] truncate">{{ placeholder }}</span>

      <svg class="ms-chevron shrink-0 ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.4714 10.4715C8.21107 10.7318 7.78893 10.7318 7.5286 10.4715L3.75736 6.7002C3.49701 6.43988 3.49701 6.01777 3.75736 5.75742C4.01771 5.49707 4.43982 5.49707 4.70017 5.75742L8 9.05727L11.2998 5.75742C11.5602 5.49707 11.9823 5.49707 12.2427 5.75742C12.503 6.01777 12.503 6.43988 12.2427 6.7002L8.4714 10.4715Z" fill="#61667C"/></svg>
    </button>

    <!-- Dropdown — teleported so surrounding overflow-hidden can't clip it,
         and flipped above the field when it would run past the viewport -->
    <Teleport to="body">
    <Transition name="ms-pop">
      <div
        v-if="open"
        ref="menuEl"
        class="ms-menu fixed z-[80] flex flex-col gap-[4px] p-[8px] rounded-[8px] bg-white border border-[#e5e6ea]"
        :class="placeAbove ? 'ms-menu--above' : ''"
        :style="menuStyle"
      >
        <!-- Search -->
        <div v-if="searchable" class="ms-search flex items-center gap-[8px] h-[36px] px-[8px] w-full bg-white rounded-[8px] shrink-0">
          <img :src="searchIcon" width="16" height="16" alt="" class="shrink-0" />
          <input
            ref="searchEl"
            v-model="query"
            type="text"
            placeholder="Search"
            class="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
            @click.stop
          />
        </div>

        <!-- Options — scrolls inside whatever height the menu got -->
        <div class="flex flex-col gap-[4px] flex-1 min-h-0 overflow-y-auto">
          <button
            v-for="opt in filtered"
            :key="valueOf(opt)"
            type="button"
            class="flex items-start gap-[8px] p-[8px] w-full rounded-[4px] text-left transition-colors duration-100 hover:bg-[#f5f6f9]"
            @click="toggleOption(valueOf(opt))"
          >
            <span class="flex items-center pt-[2px] shrink-0">
              <span
                class="ms-check flex items-center justify-center size-[16px] rounded-[4px] border"
                :class="isSelected(valueOf(opt)) ? 'bg-[#2465de] border-[#2465de]' : 'bg-white border-[#e5e6ea]'"
              >
                <svg v-if="isSelected(valueOf(opt))" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.2l2.1 2.1L8 3.2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
            </span>
            <span v-if="dotColor(valueOf(opt))" class="size-[6px] mt-[9px] rounded-full shrink-0" :style="{ background: dotColor(valueOf(opt)) }" />
            <span class="flex-1 min-w-0 text-[14px] font-normal text-[#03102f] leading-[1.5]">{{ labelOf(valueOf(opt)) }}</span>
          </button>

          <p v-if="!filtered.length" class="px-[8px] py-[12px] text-[13px] text-[#9295a5] leading-[1.5] text-center">No results</p>
        </div>
      </div>
    </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import searchIcon from '../../assets/icons/icon-search-input.svg'

const props = defineProps({
  // Selected values
  modelValue: { type: Array, default: () => [] },
  // Either plain strings or { value, label, dot } objects
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Select' },
  searchable: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue'])

const rootEl = ref(null)
const menuEl = ref(null)
const searchEl = ref(null)
const open = ref(false)
const query = ref('')

// Menu is fixed-positioned against the trigger, flipping above it when the
// space below runs out (e.g. the field sits near the bottom of the viewport)
const menuStyle = ref({})
const placeAbove = ref(false)

function positionMenu() {
  if (!rootEl.value) return
  const r = rootEl.value.getBoundingClientRect()
  const menuH = menuEl.value?.offsetHeight || 240
  const GAP = 4
  const below = window.innerHeight - r.bottom
  const above = r.top
  placeAbove.value = below < menuH + GAP + 8 && above > below

  menuStyle.value = {
    left: `${r.left}px`,
    width: `${r.width}px`,
    top: placeAbove.value ? `${Math.max(8, r.top - menuH - GAP)}px` : `${r.bottom + GAP}px`,
    // Never taller than the room available on that side
    maxHeight: `${Math.max(160, (placeAbove.value ? above : below) - GAP - 8)}px`,
  }
}

const valueOf = (opt) => (typeof opt === 'string' ? opt : opt.value)
const optionFor = (value) => props.options.find((o) => valueOf(o) === value)

function labelOf(value) {
  const opt = optionFor(value)
  return !opt || typeof opt === 'string' ? value : opt.label ?? opt.value
}

function dotColor(value) {
  const opt = optionFor(value)
  return opt && typeof opt !== 'string' ? opt.dot : null
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => String(labelOf(valueOf(o))).toLowerCase().includes(q))
})

const isSelected = (value) => props.modelValue.includes(value)

function toggleOption(value) {
  const next = isSelected(value)
    ? props.modelValue.filter((v) => v !== value)
    : [...props.modelValue, value]
  emit('update:modelValue', next)
}

function toggle() {
  open.value = !open.value
  if (open.value) {
    query.value = ''
    positionMenu()
    nextTick(() => {
      positionMenu() // re-measure once the menu has real height
      searchEl.value?.focus()
    })
  }
}

// Any click outside the trigger or the (teleported) menu closes it
function onWindowClick(e) {
  if (!open.value) return
  const inTrigger = rootEl.value?.contains(e.target)
  const inMenu = menuEl.value?.contains(e.target)
  if (!inTrigger && !inMenu) open.value = false
}

// Keep the menu pinned to the trigger while the page moves under it
function onViewportChange() {
  if (open.value) positionMenu()
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
})
onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
})
</script>

<style scoped>
/* Trigger reuses the standard input recipe; grows with the chips */
.ms-control {
  position: relative;
  min-height: 36px;
  padding-top: 4px;
  padding-bottom: 4px;
  background: white;
  border: 1px solid #e5e6ea;
  border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.ms-control:hover { border-color: #cbcdd4; }
.ms-control--open,
.ms-control:focus-visible {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
  outline: none;
}
.ms-chevron { transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1); }
.ms-control--open .ms-chevron { transform: rotate(180deg); }

.ms-menu { box-shadow: 0px 3px 11px 0px rgba(38, 42, 50, 0.09), 0px 1px 3px 0px rgba(0, 0, 0, 0.1); }

.ms-search {
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.ms-search:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
}

.ms-check {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: background-color 140ms ease, border-color 140ms ease;
}

/* Menu motion — same scale-fade as the other popovers, growing from the
   edge nearest the trigger */
.ms-pop-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top center; }
.ms-pop-leave-active { transition: opacity 100ms ease-in; transform-origin: top center; }
.ms-pop-enter-from { opacity: 0; transform: scale(0.97) translateY(-2px); }
.ms-pop-leave-to { opacity: 0; }
.ms-menu--above.ms-pop-enter-active,
.ms-menu--above.ms-pop-leave-active { transform-origin: bottom center; }
.ms-menu--above.ms-pop-enter-from { transform: scale(0.97) translateY(2px); }

@media (prefers-reduced-motion: reduce) {
  .ms-control, .ms-search, .ms-check, .ms-chevron,
  .ms-pop-enter-active, .ms-pop-leave-active { transition: none; }
  .ms-pop-enter-from { transform: none; }
}
</style>
