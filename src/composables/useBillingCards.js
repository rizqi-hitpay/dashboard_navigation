import { reactive } from 'vue'
import visaLogo from '../assets/icons/logo-visa-billing.svg'
import mastercardLogo from '../assets/icons/logo-mastercard-billing.svg'

// Saved payment cards shared between Settings › Billing and the Usage
// subscribe flow — adding a card in either place shows up in both
export const savedCards = reactive([
  { key: 'visa', brand: 'Visa', logo: visaLogo, logoWidth: 39, listLogoWidth: 33, last4: '3467', holder: 'Sam Lee', expiry: '08/28', default: true },
  { key: 'mastercard', brand: 'Mastercard', logo: mastercardLogo, logoWidth: 36, listLogoWidth: 29, last4: '3467', holder: 'Sam Lee', expiry: '11/27', default: false },
])

let cardSeq = 0

export function addSavedCard({ number, expiry, holder = 'Sam Lee' }) {
  const digits = (number || '').replace(/\D/g, '')
  const isVisa = digits.startsWith('4') || !digits
  const card = {
    key: `card-${++cardSeq}`,
    brand: isVisa ? 'Visa' : 'Mastercard',
    logo: isVisa ? visaLogo : mastercardLogo,
    logoWidth: isVisa ? 39 : 36,
    listLogoWidth: isVisa ? 33 : 29,
    last4: digits.slice(-4).padStart(4, '0'),
    holder,
    expiry: expiry || 'MM/YY',
    default: false,
  }
  savedCards.push(card)
  return card
}

export function setDefaultCard(card) {
  savedCards.forEach((c) => { c.default = c === card })
}
