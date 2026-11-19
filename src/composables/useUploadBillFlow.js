// Shared state for the full-screen Upload bills flow (Bill details → Review → Payment).
// UploadBillFlow owns the header + AI dock; each step page reads/writes these.
import { ref, shallowRef } from 'vue'

// Header stepper: 0 = Bill details · 1 = Review · 2 = Payment
export const flowStep = ref(0)

// AI chat panel docked on the right (steps narrow their invoice paper while it's open)
export const flowAiOpen = ref(false)

// Invoice preview zoom — shared so the invoice stays put when moving between steps
export const flowZoom = ref(100)

// Persistent invoice preview (rendered once by UploadBillFlow over the steps' left column).
// Bill details turns it on once a document is uploaded; Review keeps it on; Payment hides it.
export const flowShowPaper = ref(false)
// Bill details registers its "remove uploaded file" handler for the pane's Remove button
export const flowRemoveFile = shallowRef(null)
