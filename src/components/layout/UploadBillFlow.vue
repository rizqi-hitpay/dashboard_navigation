<template>
  <!-- Upload bills — full-screen flow shell. Owns the header + AI dock once, so only the
       step body animates between Bill details and Review (same step-forward / step-back
       motion as Review → Payment). Bill details is kept alive, so going Back from Review
       returns to the uploaded invoice and everything already entered. -->
  <div class="h-screen w-full bg-white flex overflow-hidden">
    <div class="flex flex-1 min-w-0 flex-col">
      <UploadBillHeader :current="flowStep" :ai-open="flowAiOpen" @open-ai="flowAiOpen = true" @close="close" />

      <div class="upload-flow-body relative flex flex-1 min-h-0 w-full overflow-hidden bg-[#fcfcfd]">
        <router-view v-slot="{ Component, route: r }">
          <!-- Only the right column (.flow-right) moves; the invoice paper is identical on both
               steps, so it stays put. The root itself doesn't transition, hence the explicit duration. -->
          <Transition :name="direction" mode="out-in" :duration="{ enter: 260, leave: 130 }">
            <KeepAlive include="UploadBillPage">
              <component :is="Component" :key="r.path" />
            </KeepAlive>
          </Transition>
        </router-view>

        <!-- Persistent invoice paper: one element for every step, laid over the steps' (empty)
             left column at the same width — so it never moves or re-mounts between steps. -->
        <Transition name="paper-fade">
          <div
            v-if="flowShowPaper"
            class="absolute inset-y-0 left-0 z-[5] transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            :class="flowAiOpen ? 'w-[40.75%] min-w-[360px]' : 'w-[44.45%] min-w-[420px]'"
          >
            <InvoicePaperPane :can-remove="flowStep === 0 && !!flowRemoveFile" @remove="flowRemoveFile?.()" />
          </div>
        </Transition>
      </div>
    </div>

    <!-- AI chat — shared AskAgentPanel, contextual variant; docks 0 → 360px -->
    <aside class="ai-dock shrink-0 h-full overflow-hidden" :class="{ 'ai-dock--open': flowAiOpen }" :aria-hidden="!flowAiOpen">
      <AskAgentPanel v-if="aiMounted" context="upload-bill" :inert="!flowAiOpen" @close="flowAiOpen = false" />
    </aside>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UploadBillHeader from '../navigation/UploadBillHeader.vue'
import AskAgentPanel from '../content/AskAgentPanel.vue'
import InvoicePaperPane from '../content/InvoicePaperPane.vue'
import { flowStep, flowAiOpen, flowZoom, flowShowPaper, flowRemoveFile } from '../../composables/useUploadBillFlow.js'

const router = useRouter()

// Step order decides the slide direction: forward = new step enters from the right
const ORDER = { '/bills/new': 0, '/bills/details': 1 }
const direction = ref('step-forward')
const removeGuard = router.beforeEach((to, from) => {
  if (to.path in ORDER && from.path in ORDER) {
    direction.value = ORDER[to.path] >= ORDER[from.path] ? 'step-forward' : 'step-back'
  }
})
onUnmounted(removeGuard)

// Mount the AI panel on first open, then keep it so closing slides out with content
const aiMounted = ref(false)
watch(flowAiOpen, (open) => { if (open) aiMounted.value = true }, { immediate: true })

function close() { router.push('/bills') }

// Leaving the flow resets it (the KeepAlive cache goes with this component)
onUnmounted(() => {
  flowStep.value = 0
  flowAiOpen.value = false
  flowZoom.value = 100
  flowShowPaper.value = false
  flowRemoveFile.value = null
})
</script>

<!-- Unscoped: these reach the step pages' right column (.flow-right). Only its contents move,
     so the invoice paper and the column divider stay still. Same recipe as Review → Payment:
     forward = new step enters from the right · back = previous step enters from the left. -->
<style>
.upload-flow-body > .step-forward-enter-active .flow-right > *,
.upload-flow-body > .step-back-enter-active .flow-right > * { transition: opacity 260ms cubic-bezier(0.32, 0.72, 0, 1), transform 260ms cubic-bezier(0.32, 0.72, 0, 1); }
.upload-flow-body > .step-forward-leave-active .flow-right > *,
.upload-flow-body > .step-back-leave-active .flow-right > * { transition: opacity 130ms ease-in, transform 130ms ease-in; }
.upload-flow-body > .step-forward-enter-from .flow-right > * { opacity: 0; transform: translateX(28px); }
.upload-flow-body > .step-forward-leave-to .flow-right > * { opacity: 0; transform: translateX(-28px); }
.upload-flow-body > .step-back-enter-from .flow-right > * { opacity: 0; transform: translateX(-28px); }
.upload-flow-body > .step-back-leave-to .flow-right > * { opacity: 0; transform: translateX(28px); }

@media (prefers-reduced-motion: reduce) {
  .upload-flow-body > .step-forward-enter-active .flow-right > *, .upload-flow-body > .step-forward-leave-active .flow-right > *,
  .upload-flow-body > .step-back-enter-active .flow-right > *, .upload-flow-body > .step-back-leave-active .flow-right > * { transition: opacity 120ms ease; }
  .upload-flow-body > .step-forward-enter-from .flow-right > *, .upload-flow-body > .step-forward-leave-to .flow-right > *,
  .upload-flow-body > .step-back-enter-from .flow-right > *, .upload-flow-body > .step-back-leave-to .flow-right > * { transform: none; }
}
</style>

<style scoped>
/* Invoice paper appears / leaves (e.g. Review → Payment) with a quick fade */
.paper-fade-enter-active { transition: opacity 200ms ease-out; }
.paper-fade-leave-active { transition: opacity 130ms ease-in; }
.paper-fade-enter-from, .paper-fade-leave-to { opacity: 0; }

/* AI dock: width 0 → 360px (280ms standard ease) */
.ai-dock { width: 0; transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.ai-dock--open { width: 360px; }

@media (prefers-reduced-motion: reduce) {
  .ai-dock { transition: none; }
}
</style>
