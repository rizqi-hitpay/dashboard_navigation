<template>
  <div class="bg-white flex flex-col items-center h-full w-full overflow-y-auto overflow-x-hidden">
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title -->
      <div class="border-b border-[#e5e6ea] w-full shrink-0">
        <div class="flex gap-[32px] items-center px-[24px] py-[12px] w-full">
          <div class="flex flex-1 flex-col gap-[8px] items-start justify-center min-w-px">
            <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">How would you like to start</p>
            <p class="font-normal text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap">Easily upload your bills or send money directly</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-[#fcfcfd] flex flex-col gap-[0px] items-center justify-center min-h-[655px] px-[24px] py-[12px] w-full flex-1">
        <div class="flex items-center justify-center py-[8px] w-full">
          <div class="flex flex-col gap-[16px] items-center w-full max-w-[500px]">

            <!-- Value props card -->
            <div class="bg-white border border-[#e5e6ea] flex flex-col gap-[16px] items-center overflow-hidden p-[16px] rounded-[8px] w-full">
              <div class="flex items-center w-full">
                <p class="font-medium text-[16px] text-[#03102f] leading-[1.4] whitespace-nowrap">Upload Your Bill</p>
              </div>

              <!-- Dropzone -->
              <label
                class="group relative flex flex-col gap-[13px] h-[200px] items-center justify-center p-[8px] rounded-[8px] w-full cursor-pointer border border-dashed transition-colors duration-150"
                :class="dragging ? 'border-[#2465de] bg-[#2465de]/10' : (fileName ? 'border-[#ccd4e3] bg-[#f8f9fc]' : 'border-[#ccd4e3] bg-[#f8f9fc] hover:border-[#2465de] hover:bg-[#2465de]/10')"
                @dragover.prevent="dragging = true"
                @dragleave.prevent="dragging = false"
                @drop.prevent="onDrop"
              >
                <input type="file" class="hidden" accept=".pdf,.png,.jpg,.jpeg" @change="onSelect" />

                <!-- Mini invoice icon -->
                <div
                  class="relative bg-white h-[88px] w-[71.077px] overflow-hidden rounded-[4px] shrink-0 transition-colors duration-150"
                  :class="fileName ? 'border-[1.5px] border-[#2bc37d]' : ''"
                  style="box-shadow: 0px 2.031px 14.892px 0px rgba(38,42,50,0.03);"
                >
                  <div class="absolute left-[5.42px] size-[13.538px] top-[5.42px]">
                    <img alt="" class="absolute block inset-0 max-w-none size-full" :src="ellipse37" />
                  </div>
                  <div class="absolute flex flex-col gap-[1.354px] items-start right-[5.42px] top-[8.12px]">
                    <div class="bg-[#e4e9f1] h-[2.031px] rounded-[5.415px] shrink-0 w-[12.185px]" />
                    <div class="bg-[#e4e9f1] h-[2.031px] rounded-[5.415px] shrink-0 w-[14.892px]" />
                    <div class="bg-[#e4e9f1] h-[2.031px] rounded-[5.415px] shrink-0 w-[19.631px]" />
                  </div>
                  <div class="absolute flex items-center justify-center right-[5.42px] top-[77.17px]">
                    <div class="-scale-y-100 rotate-180">
                      <div class="flex flex-col gap-[1.354px] items-start">
                        <div class="bg-[#e4e9f1] h-[2.031px] rounded-[5.415px] shrink-0 w-[19.631px]" />
                        <div class="bg-[#e4e9f1] h-[2.031px] rounded-[5.415px] shrink-0 w-[19.631px]" />
                      </div>
                    </div>
                  </div>
                  <div class="absolute flex gap-[5.415px] items-start left-[6.09px] top-[23.69px] w-[58.215px]">
                    <div class="bg-[#e4e9f1] flex-1 h-[2.031px] min-w-px rounded-[5.415px]" />
                    <div class="bg-[#e4e9f1] flex-1 h-[2.031px] min-w-px rounded-[5.415px]" />
                    <div class="bg-[#e4e9f1] flex-1 h-[2.031px] min-w-px rounded-[5.415px]" />
                  </div>
                  <div class="absolute border-[0.338px] border-[#e4e9f1] h-[37.231px] left-[5.42px] overflow-hidden rounded-[2.708px] top-[29.78px] w-[60.246px]">
                    <div
                      v-for="row in iconRows"
                      :key="row.top"
                      class="absolute -translate-x-1/2 flex gap-[2.708px] items-start left-1/2 w-[54.831px]"
                      :style="{ top: row.top }"
                    >
                      <div class="flex-1 h-[2.031px] min-w-px rounded-[5.415px]" :class="row.head ? 'bg-[#a6b3cd]' : 'bg-[#e4e9f1]'" />
                      <div class="flex-1 h-[2.031px] min-w-px rounded-[5.415px]" :class="row.head ? 'bg-[#a6b3cd]' : 'bg-[#e4e9f1]'" />
                      <div class="flex-1 h-[2.031px] min-w-px rounded-[5.415px]" :class="row.head ? 'bg-[#a6b3cd]' : 'bg-[#e4e9f1]'" />
                    </div>
                  </div>

                  <!-- Success check badge (shown once a file is attached) -->
                  <div
                    v-if="fileName"
                    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-[32px] rounded-full bg-[#2bc37d]"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 9.25L7.25 12.5L14 5.5" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                </div>

                <div class="flex flex-col gap-[4px] items-center justify-center text-center">
                  <template v-if="fileName">
                    <p class="font-normal text-[14px] text-[#03102f] leading-[1.5]">{{ fileName }} has been attached</p>
                    <p class="font-normal text-[12px] text-[#61667c] leading-[1.5]">Click continue to upload the bill</p>
                  </template>
                  <template v-else>
                    <p class="font-normal text-[14px] text-[#03102f] leading-[1.5]">Drag and drop your invoice here or select it from your files.</p>
                    <p class="font-normal text-[12px] text-[#61667c] leading-[1.5]">Supported formats: PDF, PNG, or JPG. Maximum file size: 10MB.</p>
                  </template>
                </div>

                <!-- Hover / drag overlay: blue add button (only before a file is attached) -->
                <div
                  v-if="!fileName"
                  class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center size-[48px] rounded-full bg-[#2465de] opacity-0 scale-90 transition-all duration-150 pointer-events-none group-hover:opacity-100 group-hover:scale-100"
                  :class="dragging ? 'opacity-100 scale-100' : ''"
                  style="box-shadow: 0px 2.25px 16.5px 0px rgba(38,42,50,0.09);"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3.75V14.25M3.75 9H14.25" stroke="white" stroke-width="1.75" stroke-linecap="round" />
                  </svg>
                </div>
              </label>

              <!-- Continue (appears once a file is attached) -->
              <button
                v-if="fileName"
                class="flex h-[44px] items-center justify-center gap-[10px] overflow-hidden px-[14px] py-[8px] rounded-[8px] w-full border border-[#f2f2f4]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="onContinue"
              >
                <span class="font-medium text-[16px] text-[#61667c] leading-[1.4] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Continue</span>
              </button>
            </div>

            <!-- Separator -->
            <div class="flex gap-[12px] items-center justify-center px-[12px] w-full">
              <div class="flex-1 h-px bg-[#e5e6ea] min-w-px" />
              <p class="font-normal text-[12px] text-[#61667c] leading-[1.5] whitespace-nowrap">OR</p>
              <div class="flex-1 h-px bg-[#e5e6ea] min-w-px" />
            </div>

            <!-- Manual link -->
            <button
              class="flex gap-[10px] h-[44px] items-center justify-center px-[14px] py-[8px] rounded-[8px] w-full"
              @click="createManually"
            >
              <span class="font-normal text-[16px] text-[#2465de] underline leading-[1.4] whitespace-nowrap">Create a bill manually</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ellipse37 from '../../assets/images/billpay/ellipse37.svg'

const router = useRouter()

const iconRows = [
  { top: '2.37px', head: true },
  { top: '9.82px', head: false },
  { top: '16.59px', head: false },
  { top: '23.35px', head: false },
  { top: '30.12px', head: false },
]

const dragging = ref(false)
const fileName = ref('')

function onSelect(e) {
  const file = e.target.files?.[0]
  if (file) fileName.value = file.name
}

function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) fileName.value = file.name
}

function onContinue() {
  router.push('/bills/details')
}

function createManually() {
  // Placeholder for the manual bill-entry flow
}
</script>
