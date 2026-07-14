// Passcode gate for the Finance product.
//
// Simplest possible protection for a frontend-only prototype: Finance stays
// locked until the shared passcode is entered. The unlock persists for the
// browser tab (sessionStorage). This is a UX gate, not hard security — the
// passcode ships in the public bundle.
//
// Override the default passcode via .env.local: VITE_FINANCE_PASSCODE=...

import { ref } from 'vue'

const PASSCODE = import.meta.env.VITE_FINANCE_PASSCODE || 'hitpay2026'
const STORAGE_KEY = 'hp-finance-unlocked'

export const financeUnlocked = ref(sessionStorage.getItem(STORAGE_KEY) === 'true')

export function tryUnlockFinance(code) {
  if (code.trim() === PASSCODE) {
    financeUnlocked.value = true
    sessionStorage.setItem(STORAGE_KEY, 'true')
    return true
  }
  return false
}

export function lockFinance() {
  financeUnlocked.value = false
  sessionStorage.removeItem(STORAGE_KEY)
}
