import { ref } from 'vue'

// New-user activation flow: true until the merchant activates their account
// and sets up payments — dashboard cards render empty states while true.
const isNewUser = ref(true)

// Full-viewport setup intro (gradient + text). Dismissed via "Got it";
// the Setup Guide card stays docked bottom-right afterwards.
const setupIntroVisible = ref(true)

// Full-page Account Verification flow (opened from the Setup Guide card)
const verificationPageOpen = ref(false)

// Full-page Add Bank Account form (opened from "Link bank account")
const bankAccountPageOpen = ref(false)

// Setup guide minimized to the sticky top banner (via the card's minus icon).
// While true the docked card is hidden and the full-width banner is shown.
const setupBannerVisible = ref(false)

// Docked card minimized (header-only) vs expanded (full checklist). Lifted here
// so the state survives the card un/remounting when toggled to/from the banner.
const setupCardMinimized = ref(false)

export function useNewUser() {
  return { isNewUser, setupIntroVisible, verificationPageOpen, bankAccountPageOpen, setupBannerVisible, setupCardMinimized }
}
