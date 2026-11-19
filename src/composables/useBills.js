// Shared Bill Pay data + chip styling, used by the bills list and the detail view.

export const bills = [
  { id: 1, recipient: 'Azure Holdings', invoice: 'INV-83177', amount: 'SGD 1,870.00', due: '2025-08-15', funding: 'Awaiting funds', status: 'Overdue' },
  { id: 2, recipient: 'Titan Group', invoice: 'INV-98765', amount: 'SGD 870.00', due: '2025-11-05', funding: 'Awaiting funds', status: 'Pending' },
  { id: 3, recipient: 'Orion Ventures', invoice: 'N/A', amount: 'SGD 1,088.00', due: 'N/A', funding: 'Returned', status: 'Failed' },
  { id: 4, recipient: 'Orion Ventures', invoice: 'INV-67890', amount: 'SGD 1,088.00', due: '2025-09-10', funding: 'Awaiting funds', status: 'Need approval' },
  { id: 5, recipient: 'Vanguard Industries', invoice: 'INV-12345', amount: 'SGD 987.75', due: '2026-01-30', funding: 'Awaiting funds', status: 'Scheduled' },
  { id: 6, recipient: 'Zenith Technologies', invoice: 'INV-67891', amount: 'SGD 1,350.00', due: '2026-02-14', funding: 'Not funded', status: 'Draft' },
  { id: 7, recipient: 'Summit Enterprises', invoice: 'INV-54321', amount: 'SGD 750.25', due: '2026-03-01', funding: 'Collected', status: 'Processing' },
  { id: 8, recipient: 'Nova Dynamics', invoice: 'INV-98765', amount: 'SGD 1,560.80', due: '2026-04-18', funding: 'Returned', status: 'Rejected' },
  { id: 9, recipient: 'Apex Solutions', invoice: 'INV-24680', amount: 'SGD 1,100.00', due: '2026-05-25', funding: 'Returned', status: 'Cancel' },
  { id: 10, recipient: 'Zeta Innovations', invoice: 'N/A', amount: 'SGD 1,425.90', due: 'N/A', funding: 'Collected', status: 'Completed' },
  { id: 11, recipient: 'Orion Ventures', invoice: 'INV-12445', amount: 'SGD 1,245.50', due: '2025-10-22', funding: 'Collected', status: 'Completed' },
]

// A bill just paid through the Upload bills flow (HitPay Balance). Added to the top of the
// list as Completed and returned so the flow can open its detail page.
export function addPaidBill(bill) {
  const id = Math.max(...bills.map((b) => b.id)) + 1
  const paid = { id, funding: 'Collected', status: 'Completed', ...bill }
  bills.unshift(paid)
  return paid
}

export function getBill(id) {
  return bills.find((b) => String(b.id) === String(id)) || null
}

// Funding chips — outline pills
export function fundingStyle(funding) {
  const map = {
    Returned: { border: '#80acfe', text: '#2465de' },
    Collected: { border: '#a6e5c3', text: '#1b8a4b' },
    'Awaiting funds': { border: '#ffe0a2', text: '#bd8400' },
    'Not funded': { border: '#dcdfe6', text: '#61667c' },
  }
  return map[funding] || { border: '#dcdfe6', text: '#61667c' }
}

// Bill status chips — soft-filled
export function statusStyle(status) {
  const map = {
    Failed: { bg: '#fdecec', text: '#d92d20' },
    Rejected: { bg: '#fdecec', text: '#d92d20' },
    Cancel: { bg: '#fdecec', text: '#d92d20' },
    Overdue: { bg: '#fff4e5', text: '#bd8400' },
    Pending: { bg: '#fff4e5', text: '#bd8400' },
    Scheduled: { bg: '#fff4e5', text: '#bd8400' },
    'Need approval': { bg: '#f4ecfe', text: '#7e3ff2' },
    Draft: { bg: '#f0f1f5', text: '#61667c' },
    Processing: { bg: '#eef2ff', text: '#2465de' },
    Completed: { bg: '#e8f7ee', text: '#1b8a4b' },
  }
  return map[status] || { bg: '#f0f1f5', text: '#61667c' }
}

// Parse "SGD 1,870.00" → 1870.0
export function parseAmount(str) {
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}
export function formatSGD(n) {
  return 'SGD ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
