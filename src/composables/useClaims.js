import { ref } from 'vue'

// Shared claims store — the Claims list and the Reimbursements flow both read it,
// so paying a reimbursement can mark its claims as paid.
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const APPROVER = 'Olivia Winston'

// Timeline stamp in the Figma format: "Apr, 10 2025, 4:28 PM"
export function stamp(d) {
  const h = d.getHours() % 12 || 12
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${MONTHS[d.getMonth()]}, ${String(d.getDate()).padStart(2, '0')} ${d.getFullYear()}, ${h}:${m} ${d.getHours() < 12 ? 'AM' : 'PM'}`
}
export function atDay(listDate, plusDays, hours, minutes) {
  const d = new Date(listDate)
  d.setDate(d.getDate() + plusDays)
  d.setHours(hours, minutes)
  return d
}
let eventSeq = 0
export const event = (date, text, label) => ({ id: ++eventSeq, at: stamp(date), text, label })
// Rejections show a red "Claim rejected" label followed by the admin's reason
export const rejectedEvent = (date, reason) => event(date, `— ${reason}`, 'Claim rejected')
const MOCK_REJECT_REASONS = {
  2: 'Florist purchases aren’t covered under client entertainment.',
  8: 'It’s duplicated with claim_1209119',
  9: 'Receipt is unreadable, please re-upload a clearer copy.',
}

// Mock history for the detail panel: attachment + timeline (newest first) per status
function withHistory(c) {
  const submitted = event(atDay(c.date, 0, 16, 28), `Claim submitted for approval by ${c.staff}`)
  const timeline = {
    Draft: [event(atDay(c.date, 0, 16, 28), `Draft saved by ${c.staff}`)],
    'Need approval': [submitted],
    Rejected: [rejectedEvent(atDay(c.date, 3, 10, 15), MOCK_REJECT_REASONS[c.id] ?? 'Missing itemised receipt.'), submitted],
    Completed: c.payment === 'paid'
      ? [event(atDay(c.date, 5, 19, 48), 'Payment completed'), event(atDay(c.date, 2, 16, 28), `Claim approved by ${APPROVER}`), submitted]
      : [event(atDay(c.date, 2, 16, 28), `Claim approved by ${APPROVER}`), submitted],
  }[c.status]
  const d = new Date(c.date)
  const file = `receipt_${c.merchant.toLowerCase().split(' ')[0]}_${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}.jpg`
  return { ...c, attachment: { name: file, size: `${18 + (c.id % 7) * 3}KB` }, timeline }
}

// fx: original spend currency + rate, shown in the exchange-icon tooltip
export const claims = ref([
  { id: 1, date: 'Jan 14, 2026', merchant: 'Redwood Artisans', staff: 'Maya Thompson', description: 'Discussing project details at the artisan cafe.', category: 'Meals & Entertainment', amount: 'SGD 2,345.67', status: 'Draft' },
  { id: 2, date: 'Apr 27, 2026', merchant: 'Maple Grove Florist', staff: 'Ethan Carter', description: 'Reviewing plans at the flower shop.', category: 'Meals & Entertainment', amount: 'SGD 3,456.78', status: 'Rejected' },
  { id: 3, date: 'Oct 05, 2026', merchant: 'Ocean Breeze Jewelry', staff: 'Ava Mitchell', description: 'Consultation session at the jewelry boutique.', category: 'Meals & Entertainment', amount: 'SGD 4,567.89', status: 'Need approval' },
  { id: 4, date: 'Dec 19, 2026', merchant: 'Copper Ridge Cafe', staff: 'Liam Anderson', description: 'Strategy talk at the mountain lodge.', category: 'Transport', amount: 'SGD 5,678.90', status: 'Need approval' },
  { id: 5, date: 'Jun 11, 2026', merchant: 'Sunset Valley Market', staff: 'Zoe Reynolds', description: 'Networking at the farmers market.', category: 'Self care', amount: 'IDR 1,512,389.00', fx: { original: 'VND 2,160,856.91', rate: 'IDR 1 = VND 1.42' }, status: 'Completed', payment: 'paid' },
  { id: 6, date: 'Feb 08, 2026', merchant: 'Golden Pine Electronics', staff: 'Noah Bennett', description: 'Tech briefing at the gadget store.', category: 'Marketing', amount: 'SGD 980.34', status: 'Draft' },
  { id: 7, date: 'May 22, 2026', merchant: 'Crystal Lake Toys', staff: 'Mia Sullivan', description: 'Creative brainstorming at the toy shop.', category: 'Marketing', amount: 'IDR 421,320.12', fx: { original: 'MYR 113.76', rate: 'IDR 1 = MYR 0.00027' }, status: 'Completed', payment: 'paid' },
  { id: 8, date: 'Jul 21, 2026', merchant: 'Crimson Maple Books', staff: 'Lucas Hayes', description: 'Idea exchange at the bookshop.', category: 'Meals & Entertainment', amount: 'SGD 3,890.45', status: 'Rejected' },
  { id: 9, date: 'Aug 09, 2026', merchant: 'Ironwood Sports', staff: 'Emma Collins', description: 'Planning session at the sports gear store.', category: 'Transport', amount: 'IDR 202,157.89', fx: { original: 'THB 424.53', rate: 'IDR 1 = THB 0.0021' }, status: 'Rejected' },
  { id: 10, date: 'Sep 30, 2026', merchant: 'Emerald Coast Apparel', staff: 'Oliver Brooks', description: 'Design review at the coastal apparel store.', category: 'Self care', amount: 'SGD 1,245.67', status: 'Draft' },
  { id: 11, date: 'Nov 03, 2026', merchant: 'Silver Oak Bakery', staff: 'Sophia Morgan', description: 'Strategy meeting at the bakery.', category: 'Marketing', amount: 'IDR 221,234.56', fx: { original: 'PHP 774.32', rate: 'IDR 1 = PHP 0.0035' }, status: 'Need approval' },
  { id: 12, date: 'Mar 15, 2026', merchant: 'Blue Harbor Outfitters', staff: 'Jack Foster', description: 'Gear discussion at the outdoor shop.', category: 'Transport', amount: 'SGD 1,789.01', status: 'Completed' },
].map(withHistory))
