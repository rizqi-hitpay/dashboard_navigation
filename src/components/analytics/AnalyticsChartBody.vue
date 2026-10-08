<template>
  <!-- Renders an AI-generated chart spec; shared by the dashboard card and the chat preview -->
  <AnalyticsBarChart
    v-if="chart.type === 'bar'"
    :labels="chart.labels"
    :values="chart.values"
    :kind="chart.kind"
    :height="height"
    :x-axis="!preview"
    :static="static"
  />
  <AnalyticsLineChart
    v-else-if="chart.type === 'line'"
    :labels="chart.labels"
    :values="chart.values"
    :height="height"
    :x-axis="!preview"
    :static="static"
  />
  <!-- Reuses the Overview donut (Figma Analytics-with-AI: 1:5156) -->
  <DonutChartCard
    v-else-if="chart.type === 'donut'"
    bare
    :title="chart.title"
    :segments="chart.segments"
    :total="`SGD ${chart.total.toLocaleString('en-US')}`"
  />
  <!-- Reuses the Overview transactions table (Figma Analytics-with-AI: 1:5738) -->
  <RecentTransactionsTable
    v-else-if="chart.type === 'table'"
    bare
    :rows="preview ? chart.rows.slice(0, 4) : chart.rows"
    :columns="chart.columns"
  />
</template>

<script setup>
import AnalyticsBarChart from './AnalyticsBarChart.vue'
import AnalyticsLineChart from './AnalyticsLineChart.vue'
import DonutChartCard from '../content/DonutChartCard.vue'
import RecentTransactionsTable from '../content/RecentTransactionsTable.vue'

defineProps({
  chart: { type: Object, required: true },
  height: { type: Number, default: 249 }, // plot height for bar/line
  preview: { type: Boolean, default: false }, // compact chat preview: no x axis, fewer rows
  static: { type: Boolean, default: false },  // skip intro animations
})
</script>
