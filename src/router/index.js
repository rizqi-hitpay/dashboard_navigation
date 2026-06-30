import { createRouter, createWebHistory } from 'vue-router'
import OverviewContent from '../components/content/OverviewContent.vue'
import BillsPage from '../components/pages/BillsPage.vue'
import AddBillPage from '../components/pages/AddBillPage.vue'
import BillDetailsPage from '../components/pages/BillDetailsPage.vue'
import VendorsPage from '../components/pages/VendorsPage.vue'
import BillPaySettingsPage from '../components/pages/BillPaySettingsPage.vue'
import MotionGuidelinePage from '../components/pages/MotionGuidelinePage.vue'

const routes = [
  { path: '/', name: 'overview', component: OverviewContent },
  { path: '/bills', name: 'bills', component: BillsPage },
  { path: '/bills/new', name: 'bill-new', component: AddBillPage },
  { path: '/bills/details', name: 'bill-details', component: BillDetailsPage },
  { path: '/vendors', name: 'vendors', component: VendorsPage },
  { path: '/settings', name: 'settings', component: BillPaySettingsPage },
  { path: '/motion', name: 'motion', component: MotionGuidelinePage, meta: { fullPage: true } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
