import { ref } from 'vue'

// Prototype-only auth flag — no real session. Starts logged out so the
// login page is the first screen on every load.
const loggedIn = ref(false)

export function useAuth() {
  return { loggedIn }
}
