// Passcode gate for the Labs product — same mechanism as Finance.
//
// Labs stays locked until the shared passcode is entered. The unlock persists
// for the browser tab (sessionStorage). This is a UX gate, not hard security —
// the passcode ships in the public bundle.
//
// Override the default passcode via .env.local: VITE_LABS_PASSCODE=...

import { ref } from 'vue'

const PASSCODE = import.meta.env.VITE_LABS_PASSCODE || 'hitpay2026'
const STORAGE_KEY = 'hp-labs-unlocked'

export const labsUnlocked = ref(sessionStorage.getItem(STORAGE_KEY) === 'true')

export function tryUnlockLabs(code) {
  if (code.trim() === PASSCODE) {
    labsUnlocked.value = true
    sessionStorage.setItem(STORAGE_KEY, 'true')
    return true
  }
  return false
}

export function lockLabs() {
  labsUnlocked.value = false
  sessionStorage.removeItem(STORAGE_KEY)
}
