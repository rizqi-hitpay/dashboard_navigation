import { ref } from 'vue'

// Charts the merchant has added to the Analytics page from an AI Assistant answer.
export const analyticsCharts = ref([])

// Daily sales for the added chart (Figma Analytics-with-AI: 1:3491)
const DAILY_SALES = {
  labels: ['23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May'],
  bars: [143, 65, 112, 20, 200, 136, 100],
}

export function isChartAdded(sourceId) {
  return analyticsCharts.value.some((c) => c.sourceId === sourceId)
}

export function addChart(sourceId, title) {
  if (isChartAdded(sourceId)) return
  analyticsCharts.value.push({ id: Date.now(), sourceId, title, ...DAILY_SALES })
}
