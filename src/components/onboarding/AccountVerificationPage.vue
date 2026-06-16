<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-white">
    <!-- Top bar -->
    <div class="flex items-stretch shrink-0" style="border-bottom: 1px solid #e5e6ea;">
      <div class="flex items-center flex-1 min-w-0" style="padding: 16px 24px;">
        <span class="text-[16px] font-medium text-[#03102f]" style="line-height: 1.4;">Account Verification</span>
      </div>
      <button
        class="flex items-center justify-center hover:bg-[#f8f9fc] transition-colors duration-150"
        style="border-left: 1px solid #e5e6ea; padding: 8px 24px; gap: 8px;"
        @click="$emit('close')"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9 10.0608L13.2426 14.3035C13.5355 14.5964 14.0104 14.5964 14.3033 14.3035C14.5961 14.0105 14.5961 13.5357 14.3033 13.2427L10.0607 9.00015L14.3033 4.75751C14.5961 4.46462 14.5961 3.98974 14.3033 3.69685C14.0104 3.40396 13.5355 3.40396 13.2426 3.69685L9 7.9395L4.75732 3.69684C4.46443 3.40395 3.98955 3.40395 3.69666 3.69684C3.40377 3.98974 3.40377 4.46461 3.69666 4.7575L7.93928 9.00015L3.69666 13.2428C3.40377 13.5357 3.40377 14.0105 3.69666 14.3035C3.98955 14.5964 4.46443 14.5964 4.75732 14.3035L9 10.0608Z" fill="#61667C"/>
        </svg>
        <span class="text-[14px] font-medium text-[#61667c]" style="line-height: 1.5;">Close</span>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 overflow-hidden">
      <div class="flex h-full" style="padding: 24px; gap: 40px;">

        <!-- Stepper sidebar -->
        <div class="flex flex-col shrink-0 bg-white" style="width: 280px; gap: 8px;">
          <div
            v-for="(step, i) in steps"
            :key="step.label"
            class="flex items-center rounded-[8px]"
            :style="{
              padding: '4px 8px',
              gap: '8px',
              background: step.active ? 'rgba(0,39,113,0.04)' : 'transparent',
            }"
          >
            <!-- Status circle -->
            <span
              v-if="step.done"
              class="shrink-0 flex items-center justify-center rounded-full"
              style="width: 24px; height: 24px; background: #2465de;"
            >
              <svg width="12" height="12" viewBox="0 0 7.5 7.5" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.62253 1.70767C6.74456 1.82971 6.74456 2.02757 6.62253 2.14961L3.10909 5.66306C2.97485 5.79728 2.7572 5.79728 2.62295 5.66306L0.877284 3.91737C0.755247 3.79534 0.755247 3.59747 0.877284 3.47544C0.999322 3.35341 1.19719 3.35341 1.31922 3.47544L2.86602 5.02222L6.18059 1.70767C6.30263 1.58563 6.5005 1.58563 6.62253 1.70767Z" fill="white"/>
              </svg>
            </span>
            <span
              v-else
              class="shrink-0 flex items-center justify-center rounded-full bg-white text-[12px] font-medium text-[#03102f]"
              style="width: 24px; height: 24px; border: 1px solid #2465de; line-height: 1.5;"
            >{{ i + 1 }}</span>

            <span
              class="text-[14px]"
              :class="step.active ? 'font-medium text-[#002771]' : 'text-[#61667c]'"
              style="line-height: 1.5;"
            >{{ step.label }}</span>
          </div>
        </div>

        <!-- Review & submit -->
        <div class="flex flex-1 justify-center items-start min-w-0 min-h-0">
          <div class="flex flex-col rounded-[12px] min-h-0" style="width: 764px; max-height: 100%; background: #f8f9fc; padding: 4px;">

            <!-- Title -->
            <div class="flex flex-col justify-center shrink-0" style="padding: 16px; gap: 2px;">
              <span class="text-[16px] font-medium text-[#03102f]" style="line-height: 1.4;">Review &amp; submit</span>
              <span class="text-[12px] text-[#61667c]" style="line-height: 1.5;">Review all information before submitting your verification</span>
            </div>

            <!-- Fields card -->
            <div
              class="flex flex-col flex-1 min-h-0 bg-white rounded-[8px] w-full"
              style="box-shadow: 0px 1px 2px rgba(0,0,0,0.06), 0px 1px 0.5px rgba(0,0,0,0.06);"
            >
              <div class="flex flex-col flex-1 min-h-0 overflow-y-auto" style="padding: 16px; gap: 16px;">

                <!-- Recap sections -->
                <div
                  v-for="section in sections"
                  :key="section.title"
                  class="recap-card flex flex-col shrink-0 w-full bg-white overflow-hidden rounded-[8px]"
                  style="border: 1px solid #e5e6ea;"
                >
                  <!-- Section head -->
                  <div
                    class="flex items-center w-full"
                    style="background: #fcfcfd; border-bottom: 1px solid #e5e6ea; min-height: 44px; padding: 12px 20px; gap: 24px;"
                  >
                    <span class="flex-1 min-w-0 text-[14px] font-medium text-[#03102f]" style="line-height: 1.5;">{{ section.title }}</span>

                    <!-- Edit (revealed on hover) -->
                    <button
                      class="recap-edit flex items-center justify-center rounded-[8px] hover:bg-[#f2f2f4]"
                      style="height: 28px; padding: 8px; gap: 6px;"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10.6903 2.00978C11.44 1.25997 12.6371 1.22998 13.4227 1.9198L13.5187 2.00978L13.9901 2.48118C14.7399 3.23099 14.7699 4.42803 14.08 5.21361L13.9901 5.30961L6.51521 12.7845C6.40919 12.8905 6.28104 12.971 6.14051 13.0205L6.03295 13.0517L3.06302 13.7371C2.60783 13.8422 2.19729 13.4612 2.24964 13.0123L2.26272 12.9369L2.94809 9.96687C2.9818 9.82079 3.04782 9.68465 3.14073 9.56818L3.21537 9.48467L10.6903 2.00978ZM10.2188 4.36684L4.22578 10.3599L3.80151 12.1983L5.63999 11.7741L11.633 5.78105L10.2188 4.36684ZM12.5759 2.95259C12.3356 2.71227 11.9574 2.69378 11.6959 2.89713L11.6331 2.95259L11.1616 3.42403L12.5758 4.83825L13.0473 4.3668C13.2876 4.12648 13.3061 3.74832 13.1027 3.4868L13.0473 3.42399L12.5759 2.95259Z" fill="#61667C"/>
                      </svg>
                      <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5;">Edit</span>
                    </button>

                    <!-- Completed check -->
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="shrink-0">
                      <path d="M10 1.66667C14.6023 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6023 14.6023 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6023 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667ZM12.9462 6.98447L8.82133 11.1093L7.05359 9.3415C6.72816 9.01608 6.20053 9.01608 5.87508 9.3415C5.54965 9.66692 5.54965 10.1946 5.87508 10.52L8.17318 12.8181C8.53117 13.1761 9.11158 13.1761 9.46958 12.8181L14.1247 8.16298C14.4501 7.83754 14.4501 7.3099 14.1247 6.98447C13.7993 6.65903 13.2716 6.65903 12.9462 6.98447Z" fill="#2BC37D"/>
                    </svg>
                  </div>

                  <!-- Detail items (2-column grid) -->
                  <div class="grid items-start" style="grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 12px 20px 20px; gap: 16px 12px;">
                    <div
                      v-for="item in section.items"
                      :key="item.label"
                      class="flex flex-col min-w-0"
                      style="gap: 2px;"
                    >
                      <span class="text-[14px] text-[#61667c]" style="line-height: 1.5;">{{ item.label }}</span>
                      <ul v-if="Array.isArray(item.value)" class="list-disc text-[14px] text-[#03102f]" style="line-height: 1.5; padding-left: 21px;">
                        <li v-for="v in item.value" :key="v">{{ v }}</li>
                      </ul>
                      <span v-else class="text-[14px] text-[#03102f]" style="line-height: 1.5;">{{ item.value }}</span>
                    </div>
                  </div>
                </div>

                <!-- Attestation -->
                <div
                  class="flex items-start shrink-0 w-full rounded-[8px] cursor-pointer"
                  style="background: #fcfcfd; border: 1px solid #2465de; padding: 8px 12px; gap: 12px;"
                  @click="attested = !attested"
                >
                  <div class="flex items-center shrink-0" style="padding-top: 4px;">
                    <span
                      class="flex items-center justify-center rounded-[4px]"
                      :style="{
                        width: '16px',
                        height: '16px',
                        background: attested ? '#2465de' : '#ffffff',
                        border: attested ? '1px solid #2465de' : '1px solid #cbcdd4',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09)',
                        transition: 'background 150ms ease, border-color 150ms ease',
                      }"
                    >
                      <svg v-if="attested" width="12" height="12" viewBox="0 0 7.5 7.5" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.62253 1.70767C6.74456 1.82971 6.74456 2.02757 6.62253 2.14961L3.10909 5.66306C2.97485 5.79728 2.7572 5.79728 2.62295 5.66306L0.877284 3.91737C0.755247 3.79534 0.755247 3.59747 0.877284 3.47544C0.999322 3.35341 1.19719 3.35341 1.31922 3.47544L2.86602 5.02222L6.18059 1.70767C6.30263 1.58563 6.5005 1.58563 6.62253 1.70767Z" fill="white"/>
                      </svg>
                    </span>
                  </div>
                  <p class="flex-1 min-w-0 text-[14px] text-[#03102f]" style="line-height: 1.5;">
                    I hereby attest that all information provided is true, accurate, and complete to the best of my knowledge. I understand that providing false information may result in account suspension or legal action.
                  </p>
                </div>
              </div>

              <!-- Button group (pinned to the card bottom while sections scroll) -->
              <div class="flex items-center justify-between w-full shrink-0" style="border-top: 1px solid #e5e6ea; padding: 16px;">
                <button
                  class="btn-secondary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#61667c]"
                  style="height: 36px; min-width: 100px; padding: 8px 12px;"
                  @click="$emit('close')"
                >Back</button>
                <button
                  class="btn-primary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-white"
                  style="height: 36px; min-width: 100px; padding: 8px 12px;"
                  @click="$emit('close')"
                >Submit verification</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

const attested = ref(true)

const steps = [
  { label: 'Business type',         done: true  },
  { label: 'Documents',             done: true  },
  { label: 'Business details',      done: true  },
  { label: 'Identity verification', done: true  },
  { label: 'Personnel',             done: true  },
  { label: 'Review & submit',       done: false, active: true },
]

const sections = [
  {
    title: 'Business type',
    items: [
      { label: 'Type',        value: 'Sole-proprietorship' },
      { label: 'Payment',     value: 'Physical' },
      { label: 'Category',    value: 'Retail' },
      { label: 'Description', value: 'I sell handmade goods' },
      { label: 'Website',     value: 'https//handmade.co' },
    ],
  },
  {
    title: 'Documents',
    items: [
      { label: 'Type', value: 'Manual upload' },
      {
        label: 'Document uploaded (100%)',
        value: ['business-registration-certificate.pdf', 'electricity-bill.jpg', 'alex-id.jpg'],
      },
    ],
  },
  {
    title: 'Business details',
    items: [
      { label: 'Business name',       value: 'Acme Corporation Pte Ltd' },
      { label: 'Registration number', value: '202301234A' },
      { label: 'Business address',    value: '123 Business Street, #05-67, Singapore 123456' },
      { label: 'Phone number',        value: '+65 1234 5678' },
      { label: 'Email address',       value: 'email@website.com' },
    ],
  },
  {
    title: 'Identity verification',
    items: [
      { label: 'Selfie verification', value: 'Completed' },
    ],
  },
  {
    title: 'Shareholders & personnel',
    items: [
      { label: 'Member 1',  value: 'John Maeda Luu' },
      { label: 'Ownership', value: '60%' },
      { label: 'Member 2',  value: 'Daren Fletcher' },
      { label: 'Ownership', value: '40%' },
    ],
  },
]

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* Edit button + lifted shadow reveal on section hover (Figma hover state) */
.recap-card {
  transition: box-shadow 200ms ease;
}
.recap-card:hover {
  box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
.recap-edit {
  opacity: 0;
  transition: opacity 150ms ease-out, background-color 150ms ease;
}
.recap-card:hover .recap-edit {
  opacity: 1;
}

/* Figma: Button/Secondary */
.btn-secondary {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  border: 1px solid #f2f2f4;
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-secondary:hover { filter: brightness(0.98); }
.btn-secondary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #e5e5e5;
}

/* Figma: Button/Primary */
.btn-primary {
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  border: 1px solid #2465de;
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-primary:hover { filter: brightness(1.05); }
.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #1d5fd9;
}

@media (prefers-reduced-motion: reduce) {
  .recap-card,
  .recap-edit,
  .btn-secondary,
  .btn-primary { transition: none; }
}
</style>
