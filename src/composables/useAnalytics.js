import { ref, toRaw } from 'vue'

// Charts the merchant has added to the Analytics page from an AI Assistant answer.
export const analyticsCharts = ref([])

export const CHART_DEFAULT_HEIGHT = 326
export const CHART_TYPES = ['bar', 'line', 'donut', 'table']

// ── Prompt → chart spec ──────────────────────────────────────────────
// The prototype has no real AI: the chart type is read from the question,
// and the data is randomised so every answer looks different.

const rand = (min, max) => Math.round(min + Math.random() * (max - min))
const pick = (list) => list[Math.floor(Math.random() * list.length)]

const DAYS = ['23 May', '24 May', '25 May', '26 May', '27 May', '28 May', '29 May']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKS = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
const METHODS = ['Cards', 'PayNow', 'GrabPay', 'Shopee', 'Atome', 'FPX', 'Others']

export function detectChartType(prompt) {
  const p = prompt.toLowerCase()
  if (/\btable\b|\blist\b/.test(p)) return 'table'
  if (/\bline\b|\barea\b/.test(p)) return 'line'
  if (/\bbar\b|\bcolumn\b|\bhistogram\b/.test(p)) return 'bar'
  if (/\bpie\b|\bdonut\b|\bdoughnut\b/.test(p)) return 'donut'
  if (/breakdown|share|split|mix|proportion|percentage/.test(p)) return 'donut'
  if (/\btop\b|recent|transactions|customers/.test(p)) return 'table'
  if (/trend|over time|monthly|growth|per month|this year/.test(p)) return 'line'
  if (/compare|by payment method|per day|daily|weekly/.test(p)) return 'bar'
  return pick(CHART_TYPES)
}

// "Create a line chart of my monthly sales this year" → "Monthly sales this year"
export function titleFromPrompt(prompt) {
  const t = prompt
    .trim()
    .replace(/[.?!]+$/, '')
    .replace(/^(please\s+)?(create|show|make|build|give|plot|draw|generate|display)\s+(me\s+)?/i, '')
    .replace(/^(a|an|the)\s+/i, '')
    .replace(/^(bar|line|area|pie|donut|doughnut)?\s*(chart|graph|table|list)\s+(of|for|showing|with)?\s*/i, '')
    .replace(/^my\s+/i, '')
  return t ? t[0].toUpperCase() + t.slice(1) : 'New chart'
}

function series(prompt, type) {
  const p = prompt.toLowerCase()
  if (type === 'bar' && /payment method/.test(p)) return { labels: METHODS, kind: 'category' }
  if (/month|year|12/.test(p)) return { labels: MONTHS, kind: 'time' }
  if (/week|month(ly)?\b/.test(p) && type === 'bar') return { labels: WEEKS, kind: 'time' }
  return { labels: DAYS, kind: 'time' }
}

const EMAILS = [
  'james@wildadventures.com', 'sophia@urbanexplorers.net', 'michael@techinnovators.org',
  'linda@creativehorizons.com', 'ratu@haexaa.com', 'jane.smith@example.com',
  'omar@brightbakes.sg', 'mei.lin@petpalace.co', 'arjun@kopiandco.com', 'claire@studioloft.io',
]
const PRODUCTS = [
  'Cat Tree Deluxe', 'Salmon Treats 200g', 'Self-Cleaning Litter Box', 'Feather Wand Toy',
  'Grain-Free Kibble 2kg', 'Scratching Post', 'Cat Carrier', 'Water Fountain', 'Catnip Mice (3pk)', 'Plush Cat Bed',
]
const sgd = (v) => 'SGD ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function tableSpec(prompt) {
  const p = prompt.toLowerCase()
  const count = Math.min(Number(p.match(/top (\d+)/)?.[1]) || 7, 10)
  if (/product/.test(p)) {
    const rows = PRODUCTS.slice(0, count).map((name) => {
      const sold = rand(12, 240)
      return { product: name, sold: String(sold), revenue: sgd(sold * rand(8, 60) + rand(0, 99) / 100) }
    }).sort((a, b) => Number(b.sold) - Number(a.sold))
    return {
      columns: [
        { key: 'product', label: 'Product', width: 200 },
        { key: 'sold', label: 'Sold', mono: true },
        { key: 'revenue', label: 'Revenue', mono: true, strong: true, align: 'right' },
      ],
      rows,
    }
  }
  if (/customer/.test(p)) {
    const rows = EMAILS.slice(0, count).map((email) => ({
      customer: email, orders: String(rand(2, 40)), spent: sgd(rand(120, 9000) + rand(0, 99) / 100),
    }))
    return {
      columns: [
        { key: 'customer', label: 'Customer', width: 220 },
        { key: 'orders', label: 'Orders', mono: true },
        { key: 'spent', label: 'Spent', mono: true, strong: true, align: 'right' },
      ],
      rows,
    }
  }
  const times = ['09:00 AM', '10:15 AM', '11:40 AM', '02:30 PM', '04:05 PM', '06:45 PM', '08:20 PM']
  const rows = Array.from({ length: count }, (_, i) => ({
    date: `MAR ${15 - Math.floor(i / 3)} ${pick(times)}`,
    customer: EMAILS[i % EMAILS.length],
    amount: sgd(rand(20, 5000) + rand(0, 99) / 100),
  }))
  return { rows } // default columns: Date · Customer · Amount
}

export function buildChartSpec(prompt) {
  const type = detectChartType(prompt)
  const spec = { type, title: titleFromPrompt(prompt) }

  if (type === 'bar' || type === 'line') {
    const { labels, kind } = series(prompt, type)
    let v = rand(500, 1500)
    spec.labels = labels
    spec.kind = kind
    spec.values = labels.map(() => {
      // a gentle random walk reads like real sales; bars can jump more
      v = type === 'line' ? Math.min(Math.max(v + rand(-700, 800), 150), 2400) : rand(150, 2400)
      return v
    })
  } else if (type === 'donut') {
    const cards = rand(52, 72)
    const paynow = rand(15, 100 - cards - 5)
    const pcts = [cards, paynow, 100 - cards - paynow]
    const total = rand(6000, 18000)
    spec.total = total
    spec.segments = [
      { label: 'Cards', color: '#356dff' },
      { label: 'Paynow', color: '#aec5ff' },
      { label: 'Others', color: '#86ffcc' },
    ].map((s, i) => ({ ...s, pct: pcts[i], value: 'SGD ' + Math.round((total * pcts[i]) / 100).toLocaleString('en-US') }))
  } else {
    Object.assign(spec, tableSpec(prompt))
  }
  return spec
}

// ── Store actions ────────────────────────────────────────────────────

export function isChartAdded(sourceId) {
  return analyticsCharts.value.some((c) => c.sourceId === sourceId)
}

export function addChart(sourceId, spec, prompt) {
  if (isChartAdded(sourceId)) return
  analyticsCharts.value.push({
    id: Date.now(),
    sourceId,
    span: 1,
    height: CHART_DEFAULT_HEIGHT,
    prompts: prompt ? [{ text: prompt, at: Date.now() }] : [],
    ...structuredClone(toRaw(spec)),
  })
}

export function removeChart(id) {
  analyticsCharts.value = analyticsCharts.value.filter((c) => c.id !== id)
}
