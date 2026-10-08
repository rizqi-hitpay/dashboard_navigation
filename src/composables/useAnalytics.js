import { ref } from 'vue'

// Charts the merchant has added to the Analytics page from an AI Assistant answer.
export const analyticsCharts = ref([])

export const CHART_DEFAULT_HEIGHT = 326

// Daily sales for the added chart (Figma Analytics-with-AI: 1:3491).
// `bars` are the design heights (px at the default card size), `values` the SGD amounts behind them.
const DAILY_SALES = {
  labels: ['23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May'],
  bars: [143, 65, 112, 20, 200, 136, 100],
  values: [1730, 790, 1350, 240, 2130, 1640, 1210],
}

export function isChartAdded(sourceId) {
  return analyticsCharts.value.some((c) => c.sourceId === sourceId)
}

export function addChart(sourceId, title, prompt) {
  if (isChartAdded(sourceId)) return
  analyticsCharts.value.push({
    id: Date.now(),
    sourceId,
    title,
    span: 1,
    height: CHART_DEFAULT_HEIGHT,
    prompts: prompt ? [{ text: prompt, at: Date.now() }] : [],
    ...DAILY_SALES,
  })
}

export function removeChart(id) {
  analyticsCharts.value = analyticsCharts.value.filter((c) => c.id !== id)
}
