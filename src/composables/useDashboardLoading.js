import { ref } from 'vue'

// Initial dashboard load: the real app fires several APIs on entry, so the
// prototype shows a single loading state instead of content popping in
// piecemeal. Starts true; DashboardLayout flips it off after the fake fetch.
const dashboardLoading = ref(true)

export function useDashboardLoading() {
  return { dashboardLoading }
}
