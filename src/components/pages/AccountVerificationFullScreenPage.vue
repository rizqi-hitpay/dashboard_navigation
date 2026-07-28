<template>
  <div class="min-h-screen w-full bg-white flex flex-col">

    <!-- Header -->
    <div class="flex items-center justify-between w-full shrink-0 border-b border-[#e5e6ea]">
      <div class="flex flex-1 gap-[12px] items-center min-w-0 px-[16px] py-[16px] md:px-[24px]">
        <div class="flex gap-[8px] items-end shrink-0">
          <img :src="hitpayLogogram" width="24" height="24" alt="" />
          <img :src="hitpayLogotext" width="67" height="20" alt="HitPay" class="hidden md:block" />
        </div>
        <span class="hidden md:block shrink-0 w-px h-[20px] bg-[#e5e6ea]"></span>
        <p class="hidden md:block flex-1 min-w-0 truncate text-[16px] font-medium text-[#03102f] leading-[1.4]">Request for information</p>
      </div>
      <button
        class="flex items-center gap-[8px] shrink-0 cursor-pointer hover:bg-[#fcfcfd] transition-colors border-l border-[#e5e6ea] px-[16px] py-[16px] md:px-[24px]"
        @click="onClose"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="#61667c" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]">Close</span>
      </button>
    </div>

    <!-- Body -->
    <div class="flex flex-1 justify-center w-full px-0 py-0 md:px-[24px] md:py-[48px]">
      <div class="flex flex-col md:flex-row gap-[16px] md:gap-[40px] items-stretch md:items-start w-full max-w-[1132px]">

        <div v-if="showStepper" class="w-full md:w-auto shrink-0 px-[16px] pt-[16px] md:px-0 md:pt-0">
          <VerificationStepper :steps="STEPS" :current-index="stepIndex" />
        </div>

        <div class="flex flex-col flex-1 min-w-0">

          <!-- Step 0: intro request — email body + a checklist preview of what's needed -->
          <VerificationCard v-if="step === 'intro'" mobile-full-bleed title-center :title="activeRequest ? activeRequest.title : 'Request additional documents'" subtitle="To complete your application, our onboarding team requires the information listed below.">
            <div class="text-[14px] text-[#03102f] leading-[1.5] whitespace-pre-line w-full">{{ INTRO_MESSAGE }}</div>

            <div class="flex flex-col items-center py-[8px] w-full">
              <div class="w-[120px] h-px bg-[#e5e6ea]"></div>
            </div>

            <div class="flex gap-[8px] items-center w-full">
              <img :src="listCheckIcon" width="16" height="16" alt="" />
              <span class="text-[10px] font-medium text-[#61667c] uppercase" style="letter-spacing: 0.3px; line-height: 18px;">Item in this request</span>
            </div>

            <div class="flex flex-col gap-[4px] items-start w-full">
              <button
                v-for="item in checklistItems"
                :key="item.key"
                type="button"
                class="group flex flex-col gap-[4px] items-start w-full text-left bg-white border rounded-[8px] px-[12px] py-[8px] cursor-pointer hover:bg-[#fcfcfd] hover:border-[#e5e6ea] transition-colors duration-150"
                :class="item.error ? 'border-[#dc3545]' : 'border-[#e5e6ea]'"
                @click="step = item.key"
              >
                <div class="flex items-center justify-between gap-[8px] w-full">
                  <span class="text-[13px] font-medium text-[#03102f] leading-[1.5]">{{ item.label }}</span>
                  <div class="flex items-center gap-0 group-hover:gap-[4px] shrink-0 transition-[gap] duration-150">
                    <span
                      class="inline-flex items-center justify-center rounded-[24px]"
                      :style="{ background: item.chip.bg, minHeight: '24px', minWidth: '32px', padding: '2px 8px' }"
                    >
                      <span class="text-[12px] font-medium leading-[1.5] whitespace-nowrap" :style="{ color: item.chip.color }">{{ item.chip.label }}</span>
                    </span>
                    <img
                      :src="arrowRightIcon"
                      height="16"
                      alt=""
                      class="h-[16px] w-0 opacity-0 shrink-0 overflow-hidden transition-[width,opacity] duration-150 group-hover:w-[16px] group-hover:opacity-100"
                    />
                  </div>
                </div>
                <p v-if="item.error" class="text-[12px] text-[#dc3545] leading-[1.5] w-full">{{ item.error }}</p>
              </button>
            </div>

            <template #footer>
              <p class="text-[12px] text-[#61667c] leading-[1.5]" style="font-family: 'Reddit Mono', monospace;">{{ requestCode }} · {{ dueDisplay }}</p>
              <VerificationButton variant="primary" @click="step = 'business_explanation'">Continue</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 1: business explanation -->
          <VerificationCard v-else-if="step === 'business_explanation'" mobile-full-bleed title="Business explanation" subtitle="A short business explanation of the volume increase" :title-chip="chipFor('business_explanation')">
            <div class="text-[14px] leading-[1.5] w-full" :class="isEditable('business_explanation') ? 'text-[#03102f]' : 'border-l-2 border-[#61667c] pl-[16px] text-[#61667c]'">
              <p>We require more information to understand your business operations. Please provide the following:</p>
              <ul class="list-disc" style="padding-left: 21px;">
                <li>Your business industry</li>
                <li>Your business offerings and activities</li>
                <li>Any working URLs that help show your key business operations, include any social media links that can help us understand how you find your customers</li>
              </ul>
            </div>
            <textarea
              v-if="isEditable('business_explanation')"
              v-model="form.businessExplanation"
              placeholder="Tell us about it"
              class="verification-textarea w-full bg-white border border-[#e5e6ea] rounded-[8px] resize-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder-[#9295a5]"
              style="min-height: 100px; padding: 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
            ></textarea>
            <div
              v-else
              class="bg-[#f8f9fc] border border-[#e5e6ea] rounded-[8px] p-[8px] w-full text-[14px] text-[#03102f] leading-[1.5] whitespace-pre-wrap"
              style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
            >{{ form.businessExplanation || '—' }}</div>
            <template #footer>
              <VerificationButton variant="secondary" @click="step = 'intro'">Back</VerificationButton>
              <VerificationButton variant="primary" @click="step = 'sales_report'">Next</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 2: sales report -->
          <VerificationCard v-else-if="step === 'sales_report'" mobile-full-bleed title="Sales report" subtitle="Sales report or order export for the relevant period" :title-chip="chipFor('sales_report')">
            <div class="text-[14px] leading-[1.5] w-full" :class="isEditable('sales_report') ? 'text-[#03102f]' : 'border-l-2 border-[#61667c] pl-[16px] text-[#61667c]'">
              <p>We require more information to understand the nature of your business. Please provide 2-3 examples of the following documents / details:</p>
              <ol class="list-decimal" style="padding-left: 21px;">
                <li>Invoices showing the type of products / services you sell</li>
                <li>Bank statements showing common business income</li>
                <li>Contracts of sale that help explain the products / services you offer</li>
              </ol>
            </div>
            <VerificationDropzone
              v-if="isEditable('sales_report')"
              :files="form.salesReport.files"
              :mock-files="MOCK.salesReport"
              @update:files="form.salesReport.files = $event"
            />
            <div v-else-if="form.salesReport.files.length" class="flex flex-col gap-[4px] items-start w-full">
              <VerificationFileChip v-for="file in form.salesReport.files" :key="file.name" :file="file" />
            </div>
            <div class="flex flex-col gap-[4px] items-start w-full">
              <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Provide any additional description (optional)</p>
              <textarea
                v-if="isEditable('sales_report')"
                v-model="form.salesReport.notes"
                placeholder="Tell us about it"
                class="verification-textarea w-full bg-white border border-[#e5e6ea] rounded-[8px] resize-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder-[#9295a5]"
                style="min-height: 100px; padding: 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
              ></textarea>
              <div
                v-else
                class="bg-[#f8f9fc] border border-[#e5e6ea] rounded-[8px] p-[8px] w-full text-[14px] leading-[1.5] whitespace-pre-wrap"
                :class="form.salesReport.notes ? 'text-[#03102f]' : 'text-[#9295a5]'"
                style="min-height: 100px; box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
              >{{ form.salesReport.notes || 'Tell us about it' }}</div>
            </div>
            <template #footer>
              <VerificationButton variant="secondary" @click="step = 'business_explanation'">Back</VerificationButton>
              <VerificationButton variant="primary" @click="step = 'marketing_docs'">Next</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 3: marketing documentation -->
          <VerificationCard v-else-if="step === 'marketing_docs'" mobile-full-bleed title="Marketing documentation" subtitle="Any marketing campaign or partnership documentation that drove the spike" :title-chip="chipFor('marketing_docs')">
            <p class="text-[14px] leading-[1.5] w-full" :class="isEditable('marketing_docs') ? 'text-[#03102f]' : 'border-l-2 border-[#61667c] pl-[16px] text-[#61667c]'">To better grasp your business dynamics, we need additional details. Please share 2-3 examples of the documentation from any marketing campaigns or partnerships that contributed to the recent spike in activity.</p>
            <VerificationDropzone
              v-if="isEditable('marketing_docs')"
              :files="form.marketingDocs.files"
              :mock-files="MOCK.marketingDocs"
              @update:files="form.marketingDocs.files = $event"
            />
            <div v-else-if="form.marketingDocs.files.length" class="flex flex-col gap-[4px] items-start w-full">
              <VerificationFileChip v-for="file in form.marketingDocs.files" :key="file.name" :file="file" />
            </div>
            <template #footer>
              <VerificationButton variant="secondary" @click="step = 'sales_report'">Back</VerificationButton>
              <VerificationButton variant="primary" @click="onLastStepNext">Next</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 4: review & submit -->
          <VerificationCard v-else-if="step === 'review'" mobile-full-bleed title="Review & submit" subtitle="Review all information before submitting your verification">
            <div class="flex flex-col gap-[16px] items-start w-full">

              <div class="flex flex-col items-start w-full border border-[#e5e6ea] rounded-[8px] overflow-hidden">
                <div class="flex gap-[24px] h-[44px] items-center justify-between px-[20px] py-[12px] w-full bg-[#fcfcfd] border-b border-[#e5e6ea]">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Business explanation</span>
                  <img :src="reviewCheckIcon" width="20" height="20" alt="" />
                </div>
                <div class="flex flex-col gap-[16px] items-start pb-[20px] pt-[12px] px-[20px] w-full">
                  <div class="border-l-2 border-[#61667c] pl-[16px] text-[14px] text-[#61667c] leading-[1.5]">
                    <p>We require more information to understand your business operations. Please provide the following:</p>
                    <ul class="list-disc" style="padding-left: 21px;">
                      <li>Your business industry</li>
                      <li>Your business offerings and activities</li>
                      <li>Any working URLs that help show your key business operations, include any social media links that can help us understand how you find your customers</li>
                    </ul>
                  </div>
                  <div
                    class="bg-[#f8f9fc] border border-[#e5e6ea] rounded-[8px] p-[8px] w-full text-[14px] leading-[1.5] whitespace-pre-wrap"
                    :class="form.businessExplanation ? 'text-[#03102f]' : 'text-[#9295a5]'"
                    style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                  >{{ form.businessExplanation || '—' }}</div>
                </div>
              </div>

              <div class="flex flex-col items-start w-full border border-[#e5e6ea] rounded-[8px] overflow-hidden">
                <div class="flex gap-[24px] h-[44px] items-center justify-between px-[20px] py-[12px] w-full bg-[#fcfcfd] border-b border-[#e5e6ea]">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Sales report</span>
                  <img :src="reviewCheckIcon" width="20" height="20" alt="" />
                </div>
                <div class="flex flex-col gap-[16px] items-start pb-[20px] pt-[12px] px-[20px] w-full">
                  <div class="border-l-2 border-[#61667c] pl-[16px] text-[14px] text-[#61667c] leading-[1.5]">
                    <p>We require more information to understand the nature of your business. Please provide 2-3 examples of the following documents / details:</p>
                    <ol class="list-decimal" style="padding-left: 21px;">
                      <li>Invoices showing the type of products / services you sell</li>
                      <li>Bank statements showing common business income</li>
                      <li>Contracts of sale that help explain the products / services you offer</li>
                    </ol>
                  </div>
                  <div v-if="form.salesReport.files.length" class="flex flex-col gap-[4px] items-start w-full">
                    <VerificationFileChip v-for="file in form.salesReport.files" :key="file.name" :file="file" />
                  </div>
                  <div class="flex flex-col gap-[4px] items-start w-full">
                    <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Provide any additional description (optional)</p>
                    <div
                      class="bg-[#f8f9fc] border border-[#e5e6ea] rounded-[8px] p-[8px] w-full text-[14px] leading-[1.5] whitespace-pre-wrap"
                      :class="form.salesReport.notes ? 'text-[#03102f]' : 'text-[#9295a5]'"
                      style="min-height: 100px; box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                    >{{ form.salesReport.notes || 'Tell us about it' }}</div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-start w-full border border-[#e5e6ea] rounded-[8px] overflow-hidden">
                <div class="flex gap-[24px] h-[44px] items-center justify-between px-[20px] py-[12px] w-full bg-[#fcfcfd] border-b border-[#e5e6ea]">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Marketing documentation</span>
                  <img :src="reviewCheckIcon" width="20" height="20" alt="" />
                </div>
                <div class="flex flex-col gap-[16px] items-start pb-[20px] pt-[12px] px-[20px] w-full">
                  <div class="border-l-2 border-[#61667c] pl-[16px] text-[14px] text-[#61667c] leading-[1.5]">To better grasp your business dynamics, we need additional details. Please share 2-3 examples of the documentation from any marketing campaigns or partnerships that contributed to the recent spike in activity.</div>
                  <div v-if="form.marketingDocs.files.length" class="flex flex-col gap-[4px] items-start w-full">
                    <VerificationFileChip v-for="file in form.marketingDocs.files" :key="file.name" :file="file" />
                  </div>
                </div>
              </div>

            </div>
            <template #footer>
              <VerificationButton variant="secondary" @click="step = 'marketing_docs'">Back</VerificationButton>
              <VerificationButton variant="primary" @click="onSubmit">Submit verification</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 5: thank you -->
          <VerificationCard v-else-if="step === 'thank_you'" :width="432">
            <div class="flex flex-col gap-[24px] items-center justify-center w-full py-[24px]">
              <div class="flex items-center justify-center rounded-full bg-[#2bc37d]" style="padding: 17.6px;">
                <img :src="successCheckIcon" width="52.8" height="52.8" alt="" />
              </div>
              <div class="flex flex-col gap-[8px] items-center w-full text-center">
                <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">Thank you for your submission</p>
                <p class="text-[12px] text-[#61667c] leading-[1.5]">Our team is reviewing your information as quickly as possible. We aim to verify your account within 24 hours.</p>
              </div>
            </div>
            <template #footer>
              <div class="flex justify-center w-full">
                <VerificationButton variant="primary" @click="onClose">OK</VerificationButton>
              </div>
            </template>
          </VerificationCard>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VerificationStepper from '../verification/VerificationStepper.vue'
import VerificationCard from '../verification/VerificationCard.vue'
import VerificationButton from '../verification/VerificationButton.vue'
import VerificationDropzone from '../verification/VerificationDropzone.vue'
import VerificationFileChip from '../verification/VerificationFileChip.vue'
import { rfiRequests } from '../../composables/useRfi.js'
import reviewCheckIcon from '../../assets/icons/rfi-review-check.svg'
import successCheckIcon from '../../assets/icons/verify-success-check.svg'
import hitpayLogogram from '../../assets/icons/logo-hitpay.svg'
import hitpayLogotext from '../../assets/icons/hitpay-logotext.svg'
import listCheckIcon from '../../assets/icons/rfi-list-check.svg'
import arrowRightIcon from '../../assets/icons/rfi-arrow-right.svg'

const route = useRoute()
const router = useRouter()

const activeRequest = computed(() => rfiRequests.find((r) => r.id === route.query.rfi) || null)

const INTRO_MESSAGE = `Hi there,

To complete your account verification, our onboarding team needs to confirm a few details about your registered business. Please provide the items listed below.

This helps us enable higher transaction limits on your account.

Kind regards,
Marcus Lee, Compliance Officer, HitPay`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDueDisplay(dateStr, prefix) {
  const [d, m, y] = dateStr.split('/')
  return `${prefix} ${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`
}

// Closed statuses have nothing left due — show when the request was closed instead
const CLOSED_STATUSES = ['rejected', 'completed', 'expired']

const requestCode = computed(() => activeRequest.value?.code || 'RFI-1039')
const dueDisplay = computed(() => {
  const r = activeRequest.value
  const prefix = r && CLOSED_STATUSES.includes(r.status) ? 'Closed' : 'Due'
  return formatDueDisplay(r?.due || '20/07/2026', prefix)
})

const MOCK = {
  salesReport: [
    { name: 'Invoice-12718.pdf', kind: 'pdf', size: '860 KB' },
    { name: 'Bank-Statement-09092026.pdf', kind: 'pdf', size: '1.4 MB' },
  ],
  marketingDocs: [
    { name: 'File_to_upload.pdf', kind: 'pdf', size: '1.2 MB' },
    { name: 'File_to_upload.CSV', kind: 'csv', size: '340 KB', forceError: true },
    { name: 'File_to_upload.DOC', kind: 'doc', size: '20 KB' },
  ],
}

// "Review & submit" only exists for a fresh submission — once an RFI has already
// been submitted, there's nothing left to review/submit, so drop it from the stepper
const STEPS = computed(() => {
  const base = [
    { key: 'business_explanation', label: 'Business explanation' },
    { key: 'sales_report', label: 'Sales report' },
    { key: 'marketing_docs', label: 'Marketing documentation' },
  ]
  const r = activeRequest.value
  if (!r || r.status === 'requesting') base.push({ key: 'review', label: 'Review & submit' })
  return base
})

const step = ref('intro')

const form = reactive({
  businessExplanation: '',
  salesReport: { files: [], notes: '' },
  marketingDocs: { files: [] },
})

// Realistic mock answer used to fill the wizard when viewing an already-submitted
// (non-"requesting") request, matching what compliance would actually see on review
const SUBMITTED_BUSINESS_EXPLANATION = `Business industry
Financial technology (FinTech) / Payment Services.

Business offerings and activities
We are a new business focused on providing digital payment solutions for merchants. Our services help businesses accept online and in-store payments through multiple payment methods, including cards, bank transfers, and QR payments. We are currently onboarding merchants and preparing for our public launch.

Working URLs
Our website: https://yourdomain.com
Social media:
LinkedIn: https://www.linkedin.com/company/yourcompany
Instagram: https://www.instagram.com/yourcompany
Facebook: https://www.facebook.com/yourcompany

As we are a newly established business, our online presence is still being developed. However, these channels reflect our business and will be used to engage with prospective customers and merchants.`

function loadFormForRequest(request) {
  step.value = 'intro'
  if (!request || request.status === 'requesting') {
    form.businessExplanation = ''
    form.salesReport.files = []
    form.salesReport.notes = ''
    form.marketingDocs.files = []
    return
  }
  // Already submitted — fill in with the mock "as submitted" answer, except for
  // whichever item is flagged for a follow-up (that one still needs re-uploading)
  form.businessExplanation = SUBMITTED_BUSINESS_EXPLANATION
  form.salesReport.files = request.flaggedItem === 'sales_report' ? [] : MOCK.salesReport.map((f) => ({ ...f }))
  form.salesReport.notes = ''
  form.marketingDocs.files = request.flaggedItem === 'marketing_docs' ? [] : MOCK.marketingDocs.filter((f) => !f.forceError).map((f) => ({ ...f }))
}

loadFormForRequest(activeRequest.value)
watch(() => route.query.rfi, () => loadFormForRequest(activeRequest.value))

const STATUS_CHIPS = {
  under_review: { label: 'Awaiting review', bg: '#f7edfd', color: '#7d1ab7' },
  follow_up: { label: 'Awaiting review', bg: '#f7edfd', color: '#7d1ab7' },
  rejected: { label: 'Rejected', bg: '#f9e9e9', color: '#c20a1c' },
  completed: { label: 'Reviewed', bg: '#e6f9f0', color: '#238b5b' },
  expired: { label: 'Expired', bg: '#f2f2f4', color: '#484d61' },
}
const NEED_UPLOAD_CHIP = { label: 'Need upload', bg: '#fff9ec', color: '#bd8400' }
const UPLOADED_CHIP = { label: 'Uploaded', bg: '#e6f9f0', color: '#238b5b' }
const NEED_CHANGES_CHIP = { label: 'Need changes', bg: '#f9e9e9', color: '#c20a1c' }

function isItemDone(key) {
  if (key === 'business_explanation') return form.businessExplanation.trim().length > 0
  if (key === 'sales_report') return form.salesReport.files.length > 0
  return form.marketingDocs.files.length > 0
}

// A step can be filled in when the request is still fresh ("requesting"), or when
// it's the one item compliance flagged for a follow-up — everything else, once
// submitted, is read-only
function isEditable(key) {
  const r = activeRequest.value
  if (!r || r.status === 'requesting') return true
  return r.status === 'follow_up' && r.flaggedItem === key
}

// Chip shown next to a step's own title — hidden entirely during the fresh
// "requesting" flow so the original wizard look is unchanged
function chipFor(key) {
  const r = activeRequest.value
  if (!r || r.status === 'requesting') return null
  if (r.status === 'follow_up' && r.flaggedItem === key) return NEED_CHANGES_CHIP
  return STATUS_CHIPS[r.status] || STATUS_CHIPS.under_review
}

// Chip shown on the intro checklist row — here "requesting" still needs its own
// per-item Need upload / Uploaded treatment
function checklistChipFor(key) {
  const r = activeRequest.value
  if (!r || r.status === 'requesting') return isItemDone(key) ? UPLOADED_CHIP : NEED_UPLOAD_CHIP
  if (r.status === 'follow_up' && r.flaggedItem === key) return NEED_CHANGES_CHIP
  return STATUS_CHIPS[r.status] || STATUS_CHIPS.under_review
}

const checklistItems = computed(() => {
  const r = activeRequest.value
  return [
    { key: 'business_explanation', label: 'Business explanation' },
    { key: 'sales_report', label: 'Sales report' },
    { key: 'marketing_docs', label: 'Marketing documentation' },
  ].map((item) => ({
    ...item,
    chip: checklistChipFor(item.key),
    error: r && r.status === 'follow_up' && r.flaggedItem === item.key ? r.flaggedMessage : null,
  }))
})

const showStepper = computed(() => STEPS.value.some((s) => s.key === step.value))
const stepIndex = computed(() => STEPS.value.findIndex((s) => s.key === step.value))

function onSubmit() {
  if (activeRequest.value) {
    activeRequest.value.status = 'under_review'
    activeRequest.value.overdue = false
  }
  step.value = 'thank_you'
}

// Leaving the last step: a fresh submission goes to review & submit; fixing the
// flagged item resubmits it for review; otherwise there's nothing further to do
function onLastStepNext() {
  const r = activeRequest.value
  if (!r || r.status === 'requesting') {
    step.value = 'review'
    return
  }
  if (r.status === 'follow_up' && r.flaggedItem === 'marketing_docs') {
    r.status = 'under_review'
    r.flaggedItem = null
    r.flaggedMessage = ''
    r.overdue = false
    r.itemsNote = ''
    r.itemsAttention = false
  }
  step.value = 'intro'
}

function onClose() {
  router.push(activeRequest.value ? '/settings/account-verification' : '/')
}
</script>

<style scoped>
.verification-textarea:focus {
  border-color: #2465de;
  box-shadow: 0 0 0 3px #b3cdfe;
}
</style>
