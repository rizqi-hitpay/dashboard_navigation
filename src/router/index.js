import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import OverviewContent from '../components/content/OverviewContent.vue'
import BillsPage from '../components/pages/BillsPage.vue'
import AddBillPage from '../components/pages/AddBillPage.vue'
import BillDetailsPage from '../components/pages/BillDetailsPage.vue'
import BillViewPage from '../components/pages/BillViewPage.vue'
import VendorsPage from '../components/pages/VendorsPage.vue'
import BillPaySettingsPage from '../components/pages/BillPaySettingsPage.vue'
import MotionGuidelinePage from '../components/pages/MotionGuidelinePage.vue'
import PlaceholderPage from '../components/pages/PlaceholderPage.vue'
import AuthFlowPage from '../components/pages/AuthFlowPage.vue'
import { useAuth } from '../composables/useAuth.js'

const routes = [
  // Standalone full-page routes (no dashboard shell).
  // Login and business selection share one component (authFlow) so the switch
  // between them animates in place (banner expands) instead of swapping pages.
  { path: '/login', name: 'login', component: AuthFlowPage, meta: { fullPage: true, authFlow: true } },
  { path: '/choose-business', name: 'choose-business', component: AuthFlowPage, meta: { fullPage: true, authFlow: true } },
  { path: '/motion', name: 'motion', component: MotionGuidelinePage, meta: { fullPage: true } },

  // Dashboard shell with content pages as children (rendered in its <router-view>)
  {
    path: '/',
    component: DashboardLayout,
    children: [
      { path: '', name: 'overview', component: OverviewContent },
      { path: 'bills', name: 'bills', component: BillsPage },
      { path: 'bills/new', name: 'bill-new', component: AddBillPage },
      { path: 'bills/details', name: 'bill-details', component: BillDetailsPage },
      { path: 'bills/view', name: 'bill-view', component: BillViewPage },
      { path: 'vendors', name: 'vendors', component: VendorsPage },
      { path: 'settings', name: 'settings', component: BillPaySettingsPage },
      // Any other link falls back to a "coming soon" placeholder
      { path: ':pathMatch(.*)*', name: 'placeholder', component: PlaceholderPage },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Login gate: everything except the login page and the standalone /motion
// guideline requires the prototype auth flag.
router.beforeEach((to) => {
  const { loggedIn } = useAuth()
  const authFree = to.name === 'login' || to.name === 'motion'
  if (!loggedIn.value && !authFree) return { name: 'login' }
  if (loggedIn.value && to.name === 'login') return { name: 'choose-business' }
})
