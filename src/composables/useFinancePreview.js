import { ref } from 'vue'

// "Finance" preview — the dashboard as a finance user sees it: Finance is the
// first product in the sidebar and opens by default.
//
// Turn on:  /finance  (or any URL with ?preview=finance)
// Turn off: open /  (or any URL with ?preview=default)
// The choice sticks for the browser tab (sessionStorage) so in-app navigation
// and reloads keep it.

const STORAGE_KEY = 'hp-preview'

function readInitial() {
  let stored = null
  try { stored = sessionStorage.getItem(STORAGE_KEY) } catch { /* storage blocked */ }
  const { pathname, search } = window.location
  const param = new URLSearchParams(search).get('preview')
  // Opening the root URL always means the default (Payments-first) dashboard;
  // reloading any other page keeps whichever preview the tab was in
  const on = pathname === '/finance' || param === 'finance'
    ? true
    : param === 'default' || pathname === '/' ? false : stored === 'finance'
  try {
    if (on) sessionStorage.setItem(STORAGE_KEY, 'finance')
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch { /* storage blocked */ }
  return on
}

export const financePreview = ref(readInitial())

// Where the Finance preview lands: the Finance Overview (first sidebar item)
export const FINANCE_HOME = '/finance/overview'
