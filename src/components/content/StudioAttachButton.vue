<template>
  <div ref="rootRef" class="relative">
    <!-- "+" button — pressed state (Figma: 50:11444) while the menu is open -->
    <button
      class="flex items-center justify-center size-[28px] rounded-full transition-[filter] duration-150"
      :class="open ? '' : 'hover:brightness-[0.97]'"
      :style="open
        ? 'background: linear-gradient(to bottom, #fafafa, #ffffff); border: 1px solid #f2f2f4;'
        : 'background: linear-gradient(to bottom, #ffffff, #f2f2f2); border: 1px solid #f2f2f4; box-shadow: 0px 1.5px 0px 0px rgba(0,0,0,0.1);'"
      aria-label="Add attachment"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      <svg
        class="transition-transform duration-200"
        :style="{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }"
        width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.33333 13.3333C7.33333 13.7015 7.6318 14 8 14C8.3682 14 8.66667 13.7015 8.66667 13.3333V8.66667H13.3333C13.7015 8.66667 14 8.3682 14 8C14 7.6318 13.7015 7.33333 13.3333 7.33333H8.66667V2.66667C8.66667 2.29848 8.3682 2 8 2C7.6318 2 7.33333 2.29848 7.33333 2.66667V7.33333H2.66667C2.29848 7.33333 2 7.6318 2 8C2 8.3682 2.29848 8.66667 2.66667 8.66667H7.33333V13.3333Z" fill="#61667C"/>
      </svg>
    </button>

    <!-- Dropdown (Figma: 50:11449 — 162px, above the button, left-aligned) -->
    <Transition name="attach-menu">
      <div
        v-if="open"
        class="absolute left-0 bottom-[40px] w-[162px] bg-white rounded-[8px] p-[4px] z-30"
        style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
      >
        <button
          class="flex items-center gap-[8px] w-full p-[8px] rounded-[4px] transition-colors duration-150 hover:bg-[#f0f1f5]"
          @click="pickFiles"
        >
          <img :src="attachmentIcon" alt="" class="size-[16px]" />
          <span class="flex-1 text-left text-[12px] leading-[1.5] text-[#03102f]">Add files or photos</span>
        </button>
      </div>
    </Transition>

    <input
      ref="fileRef"
      type="file"
      multiple
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
      class="hidden"
      @change="onFilesChosen"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import attachmentIcon from '../../assets/icons/icon-attachment.svg'

const emit = defineEmits(['files'])

const open = ref(false)
const rootRef = useTemplateRef('rootRef')
const fileRef = useTemplateRef('fileRef')

function pickFiles() {
  open.value = false
  fileRef.value?.click()
}

function onFilesChosen(e) {
  const files = Array.from(e.target.files || [])
  if (files.length) emit('files', files)
  e.target.value = ''
}

function onDocumentClick(e) {
  if (open.value && rootRef.value && !rootRef.value.contains(e.target)) open.value = false
}
function onKeydown(e) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* Scale + fade from the bottom-left, where the "+" button sits */
.attach-menu-enter-active {
  transition: opacity 150ms ease-out, transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom left;
}
.attach-menu-leave-active {
  transition: opacity 100ms ease, transform 100ms ease;
  transform-origin: bottom left;
}
.attach-menu-enter-from,
.attach-menu-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(4px);
}
</style>
