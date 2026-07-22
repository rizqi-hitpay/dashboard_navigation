<template>
  <div class="min-h-screen w-full bg-white flex flex-col">

    <!-- Header -->
    <div class="flex items-center justify-between w-full shrink-0 border-b border-[#e5e6ea] px-[16px] py-[16px] md:px-[24px]">
      <p class="text-[16px] font-medium text-[#03102f] leading-[1.35]">Request additional documents</p>
      <button
        class="flex items-center gap-[8px] cursor-pointer hover:opacity-70 transition-opacity pl-[16px] md:pl-[24px]"
        style="border-left: 1px solid #e5e6ea;"
        @click="onClose"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="#61667c" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <span class="text-[14px] text-[#61667c] leading-[1.5]">Close</span>
      </button>
    </div>

    <!-- Body -->
    <div class="flex flex-1 justify-center w-full px-0 py-0 md:px-[24px] md:py-[48px]">
      <div class="flex flex-col md:flex-row gap-[16px] md:gap-[40px] items-stretch md:items-start w-full max-w-[1132px]">

        <div v-if="showStepper" class="w-full px-[16px] pt-[16px] md:px-0 md:pt-0">
          <VerificationStepper :steps="STEPS" :current-index="stepIndex" />
        </div>

        <div class="flex flex-col flex-1 min-w-0">

          <!-- Step 0: intro request -->
          <VerificationCard v-if="step === 'intro'" mobile-full-bleed title-large title-center title="Provide more information about your business" subtitle="To complete your application, our onboarding team requires the information listed below.">
            <div class="text-[14px] text-[#03102f] leading-[1.5] whitespace-pre-line">{{ INTRO_MESSAGE }}</div>
            <template #footer>
              <span></span>
              <VerificationButton variant="primary" @click="step = 'business_explanation'">Continue</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 1: business explanation -->
          <VerificationCard v-else-if="step === 'business_explanation'" mobile-full-bleed title="Business explanation" subtitle="A short business explanation of the volume increase">
            <div class="text-[14px] text-[#03102f] leading-[1.5] w-full">
              <p>We require more information to understand your business operations. Please provide the following:</p>
              <ul class="list-disc" style="padding-left: 21px;">
                <li>Your business industry</li>
                <li>Your business offerings and activities</li>
                <li>Any working URLs that help show your key business operations, include any social media links that can help us understand how you find your customers</li>
              </ul>
            </div>
            <textarea
              v-model="form.businessExplanation"
              placeholder="Tell us about it"
              class="verification-textarea w-full bg-white border border-[#e5e6ea] rounded-[8px] resize-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder-[#9295a5]"
              style="min-height: 100px; padding: 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
            ></textarea>
            <template #footer>
              <VerificationButton variant="secondary" @click="step = 'intro'">Back</VerificationButton>
              <VerificationButton variant="primary" @click="step = 'sales_report'">Next</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 2: sales report -->
          <VerificationCard v-else-if="step === 'sales_report'" mobile-full-bleed title="Sales report" subtitle="Sales report or order export for the relevant period">
            <div class="text-[14px] text-[#03102f] leading-[1.5] w-full">
              <p>We require more information to understand the nature of your business. Please provide 2-3 examples of the following documents / details:</p>
              <ol class="list-decimal" style="padding-left: 21px;">
                <li>Invoices showing the type of products / services you sell</li>
                <li>Bank statements showing common business income</li>
                <li>Contracts of sale that help explain the products / services you offer</li>
              </ol>
            </div>
            <VerificationUploadRow
              label="Upload invoice here"
              :file="form.salesReport.invoice"
              :mock-file="MOCK.invoice"
              @update:file="form.salesReport.invoice = $event"
            />
            <VerificationUploadRow
              label="Upload bank statement here"
              :file="form.salesReport.bankStatement"
              :mock-file="MOCK.bankStatement"
              @update:file="form.salesReport.bankStatement = $event"
            />
            <div class="flex flex-col gap-[4px] items-start w-full">
              <p class="text-[12px] font-medium text-[#61667c] leading-[1.5]">Provide any additional description (optional)</p>
              <textarea
                v-model="form.salesReport.notes"
                placeholder="Tell us about it"
                class="verification-textarea w-full bg-white border border-[#e5e6ea] rounded-[8px] resize-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder-[#9295a5]"
                style="min-height: 100px; padding: 8px; filter: drop-shadow(0px 1px 1.5px rgba(0,0,0,0.04)) drop-shadow(0px 1.5px 0.75px rgba(0,0,0,0.09));"
              ></textarea>
            </div>
            <template #footer>
              <VerificationButton variant="secondary" @click="step = 'business_explanation'">Back</VerificationButton>
              <VerificationButton variant="primary" @click="step = 'marketing_docs'">Next</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 3: marketing documentation -->
          <VerificationCard v-else-if="step === 'marketing_docs'" mobile-full-bleed title="Marketing documentation" subtitle="Any marketing campaign or partnership documentation that drove the spike">
            <p class="text-[14px] text-[#03102f] leading-[1.5] w-full">To better grasp your business dynamics, we need additional details. Please share 2-3 examples of the documentation from any marketing campaigns or partnerships that contributed to the recent spike in activity.</p>
            <VerificationDropzone
              label="Upload invoice here"
              :files="form.marketingDocs.files"
              :mock-files="MOCK.marketingDocs"
              @update:files="form.marketingDocs.files = $event"
            />
            <template #footer>
              <VerificationButton variant="secondary" @click="step = 'sales_report'">Back</VerificationButton>
              <VerificationButton variant="primary" @click="step = 'review'">Next</VerificationButton>
            </template>
          </VerificationCard>

          <!-- Step 4: review & submit -->
          <VerificationCard v-else-if="step === 'review'" mobile-full-bleed title="Review & submit" subtitle="Review all information before submitting your verification">
            <div class="border border-[#e5e6ea] rounded-[8px] w-full overflow-hidden">

              <div class="flex flex-col items-start w-full">
                <div class="flex gap-[24px] h-[44px] items-center justify-between px-[20px] py-[12px] w-full bg-[#fcfcfd] border-b border-[#e5e6ea]">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Business explanation</span>
                  <img :src="checkIcon" width="20" height="20" alt="" />
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
                  <div class="bg-[#f8f9fc] border border-[#e5e6ea] rounded-[8px] p-[16px] w-full text-[14px] text-[#03102f] leading-[1.5] whitespace-pre-wrap">{{ form.businessExplanation || '—' }}</div>
                </div>
              </div>

              <div class="flex flex-col items-start w-full border-t border-[#e5e6ea]">
                <div class="flex gap-[24px] h-[44px] items-center justify-between px-[20px] py-[12px] w-full bg-[#fcfcfd] border-b border-[#e5e6ea]">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Sales report</span>
                  <img :src="checkIcon" width="20" height="20" alt="" />
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
                  <VerificationFileChip v-if="form.salesReport.invoice" :file="form.salesReport.invoice" />
                  <VerificationFileChip v-if="form.salesReport.bankStatement" :file="form.salesReport.bankStatement" />
                  <p v-if="form.salesReport.notes" class="text-[14px] text-[#03102f] leading-[1.5] w-full">{{ form.salesReport.notes }}</p>
                </div>
              </div>

              <div class="flex flex-col items-start w-full border-t border-[#e5e6ea]">
                <div class="flex gap-[24px] h-[44px] items-center justify-between px-[20px] py-[12px] w-full bg-[#fcfcfd] border-b border-[#e5e6ea]">
                  <span class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">Marketing documentation</span>
                  <img :src="checkIcon" width="20" height="20" alt="" />
                </div>
                <div class="flex flex-col gap-[16px] items-start pb-[20px] pt-[12px] px-[20px] w-full">
                  <p class="text-[14px] text-[#61667c] leading-[1.5]">To better grasp your business dynamics, we need additional details. Please share 2-3 examples of the documentation from any marketing campaigns or partnerships that contributed to the recent spike in activity.</p>
                  <VerificationFileChip v-for="file in form.marketingDocs.files" :key="file.name" :file="file" />
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
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import VerificationStepper from '../verification/VerificationStepper.vue'
import VerificationCard from '../verification/VerificationCard.vue'
import VerificationButton from '../verification/VerificationButton.vue'
import VerificationUploadRow from '../verification/VerificationUploadRow.vue'
import VerificationDropzone from '../verification/VerificationDropzone.vue'
import VerificationFileChip from '../verification/VerificationFileChip.vue'
import checkIcon from '../../assets/icons/rfi-status-check.svg'
import successCheckIcon from '../../assets/icons/verify-success-check.svg'

const router = useRouter()

const INTRO_MESSAGE = `Hi Aarti,

Our quarterly transaction monitoring flagged a notable increase in volume during Q2. Kindly help us justify the change by providing:

1. A short business explanation of the volume increase
2. Sales report or order export for the relevant period
3. Any marketing campaign or partnership documentation that drove the spike

Please upload these via the checklist on the right.
Kind regards, Marcus Lee Compliance Officer, HitPay`

const MOCK = {
  invoice: { name: 'Invoice-12718.PDF', kind: 'pdf' },
  bankStatement: { name: 'Bank-Statemet-09092026.PDF', kind: 'pdf' },
  marketingDocs: [
    { name: 'Document-Company.pdf', kind: 'pdf' },
    { name: 'Document-Company.svg', kind: 'svg' },
  ],
}

const STEPS = [
  { key: 'business_explanation', label: 'Business explanation' },
  { key: 'sales_report', label: 'Sales report' },
  { key: 'marketing_docs', label: 'Marketing documentation' },
  { key: 'review', label: 'Review & submit' },
]

const step = ref('intro')

const form = reactive({
  businessExplanation: '',
  salesReport: { invoice: null, bankStatement: null, notes: '' },
  marketingDocs: { files: [] },
})

const showStepper = computed(() => STEPS.some((s) => s.key === step.value))
const stepIndex = computed(() => STEPS.findIndex((s) => s.key === step.value))

function onSubmit() {
  step.value = 'thank_you'
}

function onClose() {
  router.push('/')
}
</script>

<style scoped>
.verification-textarea:focus {
  border-color: #2465de;
  box-shadow: 0 0 0 3px #b3cdfe;
}
</style>
