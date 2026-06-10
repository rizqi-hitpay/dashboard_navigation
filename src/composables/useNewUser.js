import { ref } from 'vue'

// New-user activation flow: true until the merchant activates their account
// and sets up payments — dashboard cards render empty states while true.
const isNewUser = ref(true)

export function useNewUser() {
  return { isNewUser }
}
