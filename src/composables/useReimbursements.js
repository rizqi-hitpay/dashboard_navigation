import { ref } from 'vue'
import { claims, event, atDay, APPROVER, MONTHS } from './useClaims.js'
import { convert, rate, money } from './useFx.js'
import { exportDashboardPdf } from '../components/analytics/chartExport.js'
import paynowLogo from '../assets/images/reimb-paynow.svg'
import hitpayLogogram from '../assets/images/reimb-hitpay-logogram.svg'
import bankIcon from '../assets/icons/icon-bank-transfer.svg'
import cardIcon from '../assets/icons/icon-bank-card-dark.svg'

// Company pays reimbursements out of its SGD account
export const PAY_CURRENCY = 'SGD'
export const HITPAY_BALANCE = 1000000

// "How would you like to pay?" (Figma: 149:78144) — Create new and Fund transfer
export const PAY_METHODS = [
  { id: 'paynow', name: 'PayNow', img: paynowLogo, fee: 'SGD 3.50', feeValue: 3.5, chip: { label: 'Instant', variant: 'instant' } },
  { id: 'balance', name: 'HitPay balance', img: hitpayLogogram, feeValue: 0, detail: `No fee  •  Balance: SGD ${money(HITPAY_BALANCE)}`, chip: { label: 'Instant', variant: 'instant' } },
  { id: 'bank', name: 'Bank transfer', img: bankIcon, fee: 'SGD 3.50', feeValue: 3.5, chip: { label: '1 hour', variant: 'warning' } },
  { id: 'cards', name: 'Cards', img: cardIcon, fee: 'SGD 3.50', feeValue: 3.5, chip: { label: 'Instant', variant: 'instant' } },
]

// Pending covers everything not yet settled (Figma: Reimbursements tabs)
export const PENDING_STATUSES = ['Draft', 'Awaiting for payment', 'Processing', 'Failed']
// Claims, name and description can still change before any money moves
export const EDITABLE_STATUSES = ['Draft', 'Awaiting for payment']

export const REIMBURSEMENT_STATUS = {
  Draft: { bg: '#f2f2f4', text: '#484d61' },
  'Awaiting for payment': { bg: '#fff9ec', text: '#bd8400' },
  Processing: { bg: '#ebf1fd', text: '#2465de' },
  Paid: { bg: '#e6f9f0', text: '#238b5b' },
  Failed: { bg: '#f9e9e9', text: '#c20a1c' },
  Canceled: { bg: '#f9e9e9', text: '#c20a1c' },
}

// Bank accounts in the order of the Figma recipient list; the first staff member
// has two accounts (Figma: Review & Pay — Multiple Bank Account)
const ACCOUNTS = [
  [{ bank: 'DBS Bank', number: '90291234', currency: 'SGD' }, { bank: 'Bank Central Asia', number: '23988199', currency: 'IDR' }],
  [{ bank: 'Maybank', number: '41101234', currency: 'USD' }],
  [{ bank: 'Maybank', number: '52201234', currency: 'USD' }],
  [{ bank: 'CitiBank', number: '30115678', currency: 'USD' }],
  [{ bank: 'HSBC', number: '77024321', currency: 'USD' }],
  [{ bank: 'Wells Fargo', number: '61238765', currency: 'IDR' }],
  [{ bank: 'Chase Bank', number: '84501357', currency: 'MYR' }],
  [{ bank: 'Barclays', number: '20132468', currency: 'VND' }],
  [{ bank: 'Bank of America', number: '55093691', currency: 'SGD' }],
]
const FALLBACK_ACCOUNTS = [{ bank: 'HSBC UK BANK PLC', number: '621788432', currency: 'SGD' }]

// Everyone who files claims can be reimbursed
export const recipients = [...new Set(claims.value.map((c) => c.staff))].map((name, i) => ({
  name,
  accounts: ACCOUNTS[i % ACCOUNTS.length],
}))
export const accountsFor = (name) => recipients.find((r) => r.name === name)?.accounts ?? FALLBACK_ACCOUNTS

// ── Claim lines (Figma: Reimbursements - Details › Claims) ──
// Every seeded reimbursement draws its claims from this pool; the marked rows were
// spent in USD and show the exchange icon + "Converted" line
const CLAIM_POOL = [
  ['Jan 14, 2026', 'Redwood Artisans', 'Meals & Entertainment', 'Discussing project details at the artisan cafe.', 2345.67],
  ['Apr 27, 2026', 'Maple Grove Florist', 'Meals & Entertainment', 'Reviewing plans at the flower shop.', 3456.78],
  ['Oct 05, 2026', 'Ocean Breeze Jewelry', 'Meals & Entertainment', 'Consultation session at the jewelry boutique.', 4567.89],
  ['Dec 19, 2026', 'Copper Ridge Cafe', 'Transport', 'Strategy talk at the mountain lodge.', 5678.9],
  ['Jun 11, 2026', 'Sunset Valley Market', 'Self care', 'Networking at the farmers market.', 3210.98, 'USD'],
  ['Feb 08, 2026', 'Golden Pine Electronics', 'Marketing', 'Tech briefing at the gadget store.', 980.34],
  ['May 22, 2026', 'Crystal Lake Toys', 'Marketing', 'Creative brainstorming at the toy shop.', 4320.12, 'USD'],
  ['Jul 21, 2026', 'Crimson Maple Books', 'Meals & Entertainment', 'Idea exchange at the bookshop.', 3890.45],
]
const parse = (s) => parseFloat(String(s).split(' ').pop().replace(/,/g, ''))

// A claim line in the shape the claim panel expects (attachment + its own timeline)
function claimLine(id, [date, merchant, category, description, , spentIn], amount, staff, paid) {
  const usdRate = rate('USD', PAY_CURRENCY)
  return {
    id,
    date,
    merchant,
    category,
    description,
    staff,
    amount: `${PAY_CURRENCY} ${money(amount)}`,
    ...(spentIn ? { fx: { original: `${spentIn} ${money(amount / usdRate)}`, rate: `${PAY_CURRENCY} 1 = ${spentIn} ${(1 / usdRate).toFixed(2)}` } } : {}),
    status: 'Completed',
    payment: paid ? 'paid' : 'scheduled',
    attachment: { name: `receipts_${merchant.toLowerCase().split(' ')[0]}_${date.slice(4, 6)}${String(MONTHS.indexOf(date.slice(0, 3)) + 1).padStart(2, '0')}2026.jpg`, size: '20KB' },
    timeline: [event(atDay(date, 2, 16, 28), `Claim approved by ${APPROVER}`), event(atDay(date, 0, 16, 28), `Claim submitted for approval by ${staff}`)],
  }
}

// Split a total across n pool lines in proportion to their sample amounts
function seedItems(r) {
  const picks = Array.from({ length: Math.min(r.claims, CLAIM_POOL.length) }, (_, i) => CLAIM_POOL[(r.id - 1 + i) % CLAIM_POOL.length])
  const total = parse(r.amount)
  const weight = picks.reduce((s, p) => s + p[4], 0)
  let left = total
  return picks.map((p, i) => {
    const amount = i === picks.length - 1 ? left : Math.round((total * p[4]) / weight * 100) / 100
    left = Math.round((left - amount) * 100) / 100
    return claimLine(`r${r.id}-${i}`, p, amount, r.recipient, r.status === 'Paid')
  })
}

// "1 Mar 2026 at 07:01" (stepper) and "Jan 14, 2026 at 08:00" (payment table)
const pad = (n) => String(n).padStart(2, '0')
export const shortStamp = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} at ${pad(d.getHours())}:${pad(d.getMinutes())}`
export const tableStamp = (d) => `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()} at ${pad(d.getHours())}:${pad(d.getMinutes())}`
export const listDate = (d) => `${MONTHS[d.getMonth()]} ${pad(d.getDate())}, ${d.getFullYear()}`

const BANK_NOT_FOUND = 'Can’t find bank account'

// Timeline (newest first) for a seeded record in a given state
function seedHistory(r) {
  const created = event(r.createdAt, `Created by ${r.createdBy}`)
  const funded = event(atDay(r.submitted, 1, 16, 28), `Funds collected, initiated by ${APPROVER}`)
  const processed = event(atDay(r.submitted, 2, 16, 28), `Payment processed to ${r.recipient}`)
  return {
    Draft: [created],
    'Awaiting for payment': [created],
    Processing: [processed, funded, created],
    Paid: [event(atDay(r.submitted, 2, 19, 48), 'Payment completed'), processed, funded, created],
    Failed: [event(atDay(r.submitted, 3, 7, 1), `— ${BANK_NOT_FOUND}`, 'Payment failed'), funded, created],
    Canceled: [event(atDay(r.submitted, 1, 10, 15), `Reimbursement canceled by ${APPROVER}`), created],
  }[r.status]
}

function withDetails(r) {
  const createdAt = atDay(r.submitted, 0, 7, 1)
  const full = {
    description: 'Reimbursement description should be here',
    createdBy: 'Steph Tan',
    createdAt,
    account: accountsFor(r.recipient)[0],
    ...r,
  }
  full.createdAt = createdAt
  full.items = seedItems(full)
  full.timeline = seedHistory(full)
  if (['Processing', 'Paid'].includes(r.status)) full.payment = { method: 'PayNow', at: atDay(r.submitted, 1, 8, 0), by: `${APPROVER} (Admin)` }
  if (r.status === 'Failed') full.failure = { at: atDay(r.submitted, 3, 7, 1), reason: BANK_NOT_FOUND }
  return full
}

// Reimbursements list (Figma: Reimbursements, 158:90288) — one row per state the
// detail page has a design for
export const reimbursements = ref([
  { id: 1, submitted: 'Jan 14, 2026', title: 'January AI subscriptions', recipient: 'Maya Thompson', claims: 8, amount: 'SGD 9,859.10', status: 'Draft' },
  { id: 2, submitted: 'Apr 27, 2026', title: 'April team dinner', recipient: 'Ethan Carter', claims: 8, amount: 'SGD 3,456.78', status: 'Awaiting for payment' },
  { id: 3, submitted: 'Oct 05, 2026', title: 'October Gym and Sport', recipient: 'Ava Mitchell', claims: 1, amount: 'SGD 4,567.89', status: 'Processing' },
  { id: 4, submitted: 'Dec 19, 2026', title: 'Reimbursement Dec2026', recipient: 'Liam Anderson', claims: 2, amount: 'SGD 5,678.90', status: 'Failed' },
  { id: 5, submitted: 'Jun 11, 2026', title: 'Maple Ridge Reimbursement', recipient: 'Zoe Reynolds', claims: 5, amount: 'SGD 3,210.98', fx: true, status: 'Paid' },
  { id: 6, submitted: 'Feb 08, 2026', title: 'Copperfield Refund Services', recipient: 'Noah Bennett', claims: 2, amount: 'SGD 980.34', status: 'Paid' },
  { id: 7, submitted: 'May 22, 2026', title: 'Pinecrest Expense Recovery', recipient: 'Mia Sullivan', claims: 1, amount: 'SGD 4,320.12', fx: true, status: 'Paid' },
  { id: 8, submitted: 'Jul 21, 2026', title: 'Willowbrook Reimbursement Solutions', recipient: 'Lucas Hayes', claims: 1, amount: 'SGD 3,890.45', status: 'Paid' },
  { id: 9, submitted: 'Aug 09, 2026', title: 'Redwood Claims Processing', recipient: 'Emma Collins', claims: 8, amount: 'SGD 2,157.89', fx: true, status: 'Paid' },
  { id: 10, submitted: 'Sep 30, 2026', title: 'Harborview Reimbursement Center', recipient: 'Oliver Brooks', claims: 8, amount: 'SGD 1,245.67', status: 'Canceled' },
  { id: 11, submitted: 'Nov 03, 2026', title: 'Cedar Grove Refunds', recipient: 'Sophia Morgan', claims: 7, amount: 'SGD 1,234.56', fx: true, status: 'Canceled' },
  { id: 12, submitted: 'Mar 15, 2026', title: 'Lakeside Expense Management', recipient: 'Jack Foster', claims: 6, amount: 'SGD 1,789.01', status: 'Canceled' },
].map(withDetails))

export const getReimbursement = (id) => reimbursements.value.find((r) => String(r.id) === String(id))

// ── Payable claims (Create new) ──
// Approved claims still waiting to be paid out, per recipient. The prototype keeps a
// backlog alongside the real approved claims so each recipient has a few to pick from.
const BACKLOG_POOL = [
  ['Redwood Artisans', 'Meals & Entertainment', 2345.67],
  ['Maple Grove Florist', 'Meals & Entertainment', 3456.78],
  ['Oceanview Boutique', 'Fashion', 1450.75],
  ['TechHub Electronics', 'Gadgets', 7890.2],
  ['Green Thumb Nursery', 'Gardening', 2340.5],
  ['Urban Oasis Plants', 'Indoor Plants', 1120.75],
  ['Bloom & Grow', 'Landscaping', 3580.0],
  ['Copper Ridge Cafe', 'Transport', 568.9],
  ['Golden Pine Electronics', 'Marketing', 980.34],
  ['Silver Oak Bakery', 'Meals & Entertainment', 123.45],
]
const BACKLOG_DATES = ['Jan 14, 2026', 'Apr 27, 2026', 'Feb 02, 2026', 'Mar 18, 2026', 'Apr 09, 2026', 'May 15, 2026', 'Jun 21, 2026', 'Jul 03, 2026', 'Aug 12, 2026', 'Sep 08, 2026']

const backlog = ref(Object.fromEntries(recipients.map((r, ri) => [
  r.name,
  Array.from({ length: 3 + (ri * 3) % 6 }, (_, i) => {
    const [merchant, category, amount] = BACKLOG_POOL[(ri + i) % BACKLOG_POOL.length]
    return {
      id: `b-${ri}-${i}`,
      date: BACKLOG_DATES[(ri * 2 + i) % BACKLOG_DATES.length],
      merchant,
      category,
      description: `${category} expense at ${merchant}`,
      amount: `SGD ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    }
  }),
])))

export function payableClaims(staff) {
  // Real approved claims first (approved in Claims, not paid yet), then the backlog
  // ('scheduled' = already in a reimbursement saved to pay later)
  const approved = claims.value.filter((c) => c.staff === staff && c.status === 'Completed' && !['paid', 'scheduled'].includes(c.payment))
  return [...approved, ...(backlog.value[staff] ?? [])]
}

export function removeFromBacklog(staff, ids) {
  backlog.value[staff] = (backlog.value[staff] ?? []).filter((c) => !ids.includes(c.id))
}

// ── State changes shared by the list and the detail page ──
// The real claims behind a reimbursement (backlog lines only live on the record)
const realClaims = (r) => claims.value.filter((c) => r.items.some((i) => i.id === c.id))

function setClaimsPayment(r, payment, text) {
  const now = new Date()
  for (const c of [...realClaims(r), ...r.items]) {
    c.payment = payment
    if (text && c.timeline) c.timeline.unshift(event(now, text))
  }
}

const sumAmount = (items) => items.reduce((sum, c) => sum + convert(parse(c.amount), c.amount.split(' ')[0], PAY_CURRENCY), 0)
const asLines = (items, recipient) => items.map((c) => ({ ...c, staff: c.staff ?? recipient, status: 'Completed', timeline: c.timeline ?? [] }))

// Claims joining a reimbursement leave the payable pool…
function takeLines(r, lines, text) {
  setClaimsPayment({ items: lines }, 'scheduled', text)
  removeFromBacklog(r.recipient, lines.map((c) => c.id))
}
// …and ones leaving it go back: real claims become payable again, the rest rejoin the backlog
function releaseLines(r, lines, text) {
  setClaimsPayment({ items: lines }, undefined, text)
  const backlogLines = lines.filter((i) => !claims.value.some((c) => c.id === i.id)).map((i) => ({ ...i, payment: undefined }))
  if (backlogLines.length) backlog.value[r.recipient] = [...backlogLines, ...(backlog.value[r.recipient] ?? [])]
}

// From the Create wizard: a Draft ("Save & pay later") or a record about to be funded
export function addReimbursement({ title, description, recipient, account, items, fx, status = 'Draft' }) {
  const now = new Date()
  const r = {
    id: Date.now(),
    submitted: listDate(now),
    title,
    description,
    recipient,
    account,
    claims: items.length,
    amount: `${PAY_CURRENCY} ${money(sumAmount(items))}`,
    fx,
    status,
    createdBy: APPROVER,
    createdAt: now,
    items: asLines(items, recipient),
    timeline: [event(now, `Created by ${APPROVER}`)],
  }
  reimbursements.value.unshift(r)
  const record = reimbursements.value[0]
  takeLines(record, record.items, `Added to reimbursement "${title}" by ${APPROVER}`)
  return record
}

// Funds sent: Processing, then the transfer lands a moment later (bank transfers take longer)
const completionTimers = new Map()
export function startPayment(r, method, { slow = false } = {}) {
  const now = new Date()
  clearTimeout(completionTimers.get(r.id))
  r.status = 'Processing'
  r.failure = null
  r.payment = { method, at: now, by: `${APPROVER} (Admin)` }
  r.timeline.unshift(event(now, `Funds collected, initiated by ${APPROVER}`))
  r.timeline.unshift(event(now, `Payment processed to ${r.recipient}`))
  completionTimers.set(r.id, setTimeout(() => completePayment(r), slow ? 12000 : 4000))
}

export function completePayment(r) {
  if (r.status !== 'Processing') return
  r.status = 'Paid'
  r.timeline.unshift(event(new Date(), 'Payment completed'))
  setClaimsPayment(r, 'paid', `Payment completed via ${r.payment?.method ?? 'transfer'}`)
}

// Canceled reimbursements hand their claims back to the payable pool
export function cancelReimbursement(r) {
  clearTimeout(completionTimers.get(r.id))
  r.status = 'Canceled'
  r.timeline.unshift(event(new Date(), `Reimbursement canceled by ${APPROVER}`))
  releaseLines(r, r.items, `Removed from reimbursement "${r.title}"`)
}

// Edit (Figma: Reimbursement - Edit, 158:96695): name, description and which claims are in it
export function editReimbursement(r, { title, description, items = r.items }) {
  const ids = new Set(items.map((c) => c.id))
  const before = new Set(r.items.map((c) => c.id))
  releaseLines(r, r.items.filter((c) => !ids.has(c.id)), `Removed from reimbursement "${title}"`)
  const lines = asLines(items, r.recipient)
  takeLines(r, lines.filter((c) => !before.has(c.id)), `Added to reimbursement "${title}" by ${APPROVER}`)
  Object.assign(r, {
    title,
    description,
    items: lines,
    claims: lines.length,
    amount: `${PAY_CURRENCY} ${money(sumAmount(lines))}`,
    fx: lines.some((c) => c.fx) || (r.account?.currency ?? PAY_CURRENCY) !== PAY_CURRENCY,
  })
  r.timeline.unshift(event(new Date(), `Edited by ${APPROVER}`))
}

// Claims table as a one-page PDF (actions menu › Export PDF)
export function exportReimbursementPdf(r) {
  exportDashboardPdf([{
    type: 'table',
    title: `${r.title} · ${r.recipient} · ${r.status}`,
    columns: [
      { key: 'date', label: 'Date', mono: true },
      { key: 'merchant', label: 'Merchant' },
      { key: 'category', label: 'Category' },
      { key: 'amount', label: 'Amount', mono: true, strong: true },
    ],
    rows: [...r.items, { date: '', merchant: '', category: 'Total to pay', amount: r.amount }],
  }], r.title)
}

// Actions menu items per state (Figma: Dropdown 141:26976 / 141:27092 / 141:27010; Draft: 158:91499)
export function reimbursementActions(status) {
  const exportItem = { label: 'Export PDF', action: 'export' }
  const edit = { label: 'Edit', action: 'edit' }
  const cancel = { label: 'Cancel', action: 'cancel', danger: true }
  return {
    Draft: [edit, cancel],
    'Awaiting for payment': [exportItem, edit, cancel],
    Processing: [exportItem, cancel],
    Failed: [exportItem, cancel],
  }[status] ?? [exportItem]
}
