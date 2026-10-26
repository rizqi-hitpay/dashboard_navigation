// Mock mid-market rates, shared by the claim form and the reimbursement flow:
// IDR per 1 unit of each currency (VND matches the Figma example)
export const IDR_PER_UNIT = { IDR: 1, SGD: 12480.35, USD: 16285.4, MYR: 3712.6, THB: 468.15, PHP: 284.9, VND: 0.638554 }
export const CURRENCIES = Object.keys(IDR_PER_UNIT)

// How many `to` one unit of `from` buys
export const rate = (from, to) => IDR_PER_UNIT[from] / IDR_PER_UNIT[to]
export const convert = (amount, from, to) => amount * rate(from, to)

export const parseMoney = (v) => {
  const n = parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}
export const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// "SGD 2,345.67" → { currency: 'SGD', value: 2345.67 }
export function splitAmount(s) {
  const [currency, value] = String(s).split(' ')
  return { currency, value: parseMoney(value) ?? 0 }
}
