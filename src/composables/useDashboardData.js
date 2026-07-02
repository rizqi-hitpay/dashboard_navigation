import { ref } from 'vue'

// Fake "all APIs answered" flag. While false, dashboard numbers render as
// zero; when it flips true, TickerNumber counts each figure up to its real
// value. DashboardLayout arms the 5s timer on mount.
const dataLoaded = ref(false)

export function useDashboardData() {
  return { dataLoaded }
}
