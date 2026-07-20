import { ref } from 'vue'

// Matches Tailwind's `md` breakpoint (768px) — below it we're in the mobile
// layout (no nav rail / persistent sidebar, mobile header + drawer instead).
const MOBILE_QUERY = '(max-width: 767px)'

const mql = typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY) : null

export const isMobile = ref(mql ? mql.matches : false)

if (mql) {
  mql.addEventListener('change', (e) => {
    isMobile.value = e.matches
  })
}
