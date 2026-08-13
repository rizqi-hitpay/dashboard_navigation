import { createRouter, createWebHistory } from 'vue-router'
import OverviewContent from '../components/content/OverviewContent.vue'
import BillsPage from '../components/pages/BillsPage.vue'
import AddBillPage from '../components/pages/AddBillPage.vue'
import BillDetailsPage from '../components/pages/BillDetailsPage.vue'
import BillViewPage from '../components/pages/BillViewPage.vue'
import VendorsPage from '../components/pages/VendorsPage.vue'
import CardsPage from '../components/pages/CardsPage.vue'
import TransactionsPage from '../components/pages/TransactionsPage.vue'
import BalancePage from '../components/pages/BalancePage.vue'
import CardDetailsPage from '../components/pages/CardDetailsPage.vue'
import VendorDetailsPage from '../components/pages/VendorDetailsPage.vue'
import BillPaySettingsPage from '../components/pages/BillPaySettingsPage.vue'
import RequestForInformationPage from '../components/pages/RequestForInformationPage.vue'
import AccountVerificationWithChatPage from '../components/pages/AccountVerificationWithChatPage.vue'
import AccountVerificationFullScreenPage from '../components/pages/AccountVerificationFullScreenPage.vue'
import SettingsEmptyStatePage from '../components/pages/SettingsEmptyStatePage.vue'
import UsagePage from '../components/pages/UsagePage.vue'
import LabsPage from '../components/pages/LabsPage.vue'
import LabsCategoryPage from '../components/pages/LabsCategoryPage.vue'
import LabsAppPage from '../components/pages/LabsAppPage.vue'
import MotionGuidelinePage from '../components/pages/MotionGuidelinePage.vue'
import PlaceholderPage from '../components/pages/PlaceholderPage.vue'

const routes = [
  { path: '/', name: 'overview', component: OverviewContent },
  { path: '/bills', name: 'bills', component: BillsPage },
  { path: '/bills/new', name: 'bill-new', component: AddBillPage },
  { path: '/bills/details', name: 'bill-details', component: BillDetailsPage },
  { path: '/bills/view', name: 'bill-view', component: BillViewPage },
  { path: '/vendors', name: 'vendors', component: VendorsPage },
  { path: '/vendors/details', name: 'vendor-details', component: VendorDetailsPage },
  { path: '/cards', name: 'cards', component: CardsPage },
  { path: '/cards/transactions', name: 'card-transactions', component: TransactionsPage },
  { path: '/cards/balance', name: 'card-balance', component: BalancePage },
  { path: '/cards/details', name: 'card-details', component: CardDetailsPage },
  { path: '/settings', name: 'settings', component: BillPaySettingsPage },
  { path: '/settings/account-verification', name: 'account-verification', component: AccountVerificationWithChatPage, alias: '/settings/account-verification-with-chat' },
  { path: '/settings/request-for-information', name: 'request-for-information', component: RequestForInformationPage },
  { path: '/settings/account-verification-full-screen', name: 'account-verification-full-screen', component: AccountVerificationFullScreenPage, meta: { fullPage: true } },
  { path: '/settings/usage', name: 'settings-usage', component: UsagePage },
  { path: '/labs', name: 'labs', component: LabsPage },
  { path: '/labs/app/to-do-list', name: 'labs-app-todo', component: LabsAppPage },
  { path: '/labs/:category', name: 'labs-category', component: LabsCategoryPage },
  // Settings menus without real content yet → per-menu empty state
  { path: '/settings/:slug', name: 'settings-empty', component: SettingsEmptyStatePage },
  { path: '/motion', name: 'motion', component: MotionGuidelinePage, meta: { fullPage: true } },
  // Any other link falls back to a "coming soon" placeholder
  { path: '/:pathMatch(.*)*', name: 'placeholder', component: PlaceholderPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
