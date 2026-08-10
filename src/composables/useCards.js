import { reactive, ref } from 'vue'

// Issued cards — shared between the Cards table and the card details page.
// Pure mock: state lives here, no backend.

// stats drive the detail-page progress bars: monthly expenses vs limit,
// and lifetime spend vs the per-card limit
export const cards = reactive([
  { id: 1, nickname: 'Travel card', holder: 'John Dean', spent: 'SGD 3,742.89', status: 'active', number: '5412 7534 8821 4567', createdAt: '22 June 2026', stats: { monthlyLimit: 5000, monthlySpent: 3742.89, cardLimit: 10000, cardSpent: 8214.5 } },
  { id: 2, nickname: 'Marketing expenses', holder: 'Juan Pablo', spent: 'SGD 2,934.76', status: 'active', number: '5231 0086 4479 2245', createdAt: '4 May 2026', stats: { monthlyLimit: 8000, monthlySpent: 2934.76, cardLimit: 12000, cardSpent: 4380.2 } },
  { id: 3, nickname: 'Operations', holder: 'Andrea Hill', spent: 'SGD 5,618.47', status: 'active', number: '5580 4416 9032 6178', createdAt: '17 March 2026', stats: { monthlyLimit: 6000, monthlySpent: 5618.47, cardLimit: null, cardSpent: null } },
  { id: 4, nickname: 'Developer', holder: 'Tim Miller', spent: 'SGD 4,105.23', status: 'frozen', number: '5307 2291 5568 4423', createdAt: '2 January 2026', stats: { monthlyLimit: 10000, monthlySpent: 4105.23, cardLimit: 20000, cardSpent: 6912.75 } },
])

// One-shot snackbar message picked up by the Cards list after a redirect
// (e.g. cancelling a card from its details page)
export const pendingToast = ref('')

export function formatSGD(n) {
  return 'SGD ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function addCard({ nickname, holder, number }) {
  // Fresh cards get randomised usage so each detail page reads differently
  const monthlyLimit = [1000, 2000, 3000, 5000, 8000][Math.floor(Math.random() * 5)]
  const monthlySpent = Math.round(monthlyLimit * (0.05 + Math.random() * 0.75) * 100) / 100
  const cardLimit = monthlyLimit * 2
  const cardSpent = Math.round((monthlySpent + cardLimit * Math.random() * 0.3) * 100) / 100

  const card = {
    id: Math.max(...cards.map((c) => c.id)) + 1,
    nickname,
    holder,
    spent: formatSGD(monthlySpent),
    status: 'active',
    number,
    createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    stats: { monthlyLimit, monthlySpent, cardLimit, cardSpent },
  }
  cards.unshift(card)
  return card
}
