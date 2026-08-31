import { ref, computed } from 'vue'

// New-user incentive banner (Figma: Incentivization - Merchant Referral).
// Four demo states, switchable via the floating preview switcher:
//   'zero'      → 0/10 transactions, countdown running
//   'progress'  → 4/10 transactions, countdown running
//   'completed' → all 10 free transactions used, Total Saved widget
//   'missed'    → window expired without reaching 10 — no banner
const incentiveState = ref('zero')

// Banner collapsed via the hover-revealed Minimize button
const incentiveMinimized = ref(false)

// Completed banner dismissed via its hover-revealed Close button
const incentiveDismissed = ref(false)

const incentiveTxCount = computed(() => {
  if (incentiveState.value === 'progress') return 4
  if (incentiveState.value === 'completed') return 10
  return 0
})

const incentiveVisible = computed(() => incentiveState.value !== 'missed' && !incentiveDismissed.value)

export function useIncentive() {
  return { incentiveState, incentiveMinimized, incentiveDismissed, incentiveTxCount, incentiveVisible }
}
