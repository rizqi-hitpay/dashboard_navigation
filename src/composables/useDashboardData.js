import { reactive } from 'vue'

// Fake per-source API arrival. Each named source (one per dashboard element)
// flips to loaded after its own random delay, so elements populate
// independently instead of all at once. DashboardLayout arms the timers on
// mount; sources stay loaded for the rest of the dashboard session, so
// re-visiting Overview shows data instantly (as cached APIs would).
const SOURCES = [
  'stat-0', 'stat-1', 'stat-2', 'stat-3',
  'transactions', 'payouts', 'sales',
  'payment-methods', 'channels',
]

const loadedSources = reactive(Object.fromEntries(SOURCES.map((k) => [k, false])))
let timers = []

export function startDashboardLoading({ min = 1500, max = 5000 } = {}) {
  stopDashboardLoading()
  for (const key of SOURCES) {
    loadedSources[key] = false
    const delay = min + Math.random() * (max - min)
    timers.push(setTimeout(() => { loadedSources[key] = true }, delay))
  }
}

export function stopDashboardLoading() {
  timers.forEach(clearTimeout)
  timers = []
}

export function useDashboardData() {
  return {
    isLoaded: (key) => !!loadedSources[key],
  }
}
