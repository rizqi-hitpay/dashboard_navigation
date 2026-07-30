<template>
  <div class="bg-white flex flex-col h-full w-full overflow-hidden">
    <div class="flex flex-1 flex-col items-start w-full min-h-0 pt-[4px]">

      <div class="hidden md:flex gap-[32px] items-center px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-col gap-[8px] items-start justify-center">
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">{{ page.title }}</p>
          <p class="text-[12px] text-[#61667c] leading-[1.5]">{{ page.subtitle }}</p>
        </div>
      </div>

      <div class="flex flex-1 w-full min-h-0 items-center justify-center p-[24px] overflow-y-auto">
        <div class="flex flex-col items-center gap-[12px] text-center max-w-[400px]">
          <div class="flex items-center justify-center size-[56px] rounded-full bg-[#eef3fc]">
            <img
              v-if="page.icon"
              :src="page.icon"
              width="26"
              height="26"
              alt=""
              style="filter: invert(27%) sepia(90%) saturate(1285%) hue-rotate(200deg) brightness(95%) contrast(97%);"
            />
          </div>
          <div class="flex flex-col gap-[4px] items-center">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ page.emptyTitle }}</p>
            <p class="text-[13px] text-[#61667c] leading-[1.5]">{{ page.emptyDescription }}</p>
          </div>
          <VerificationButton v-if="page.cta" class="mt-[8px]">{{ page.cta }}</VerificationButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import VerificationButton from '../verification/VerificationButton.vue'
import { settingsOpen } from '../../composables/useSettingsPanel.js'

import clipboardIcon from '../../assets/icons/icon-clipboard.svg'
import bankIcon from '../../assets/icons/icon-bank.svg'
import usersIcon from '../../assets/icons/icon-users.svg'
import documentIcon from '../../assets/icons/icon-document-2.svg'
import storeIcon from '../../assets/icons/icon-store.svg'
import paletteIcon from '../../assets/icons/icon-palette.svg'
import brushIcon from '../../assets/icons/icon-brush.svg'
import composeIcon from '../../assets/icons/icon-compose.svg'
import alertIcon from '../../assets/icons/icon-alert.svg'
import taxIcon from '../../assets/icons/icon-tax.svg'
import moneyLineIcon from '../../assets/icons/icon-money-line.svg'
import earthIcon from '../../assets/icons/icon-earth.svg'
import gridIcon from '../../assets/icons/icon-grid.svg'

// Empty-state copy per settings menu, keyed by the /settings/<slug> segment
const PAGES = {
  'business-details': {
    title: 'Business Details',
    subtitle: 'Manage your business information',
    icon: clipboardIcon,
    emptyTitle: 'No business details yet',
    emptyDescription: "Add your business information so customers know who they're paying.",
    cta: 'Add business details',
  },
  'bank-accounts': {
    title: 'Bank Accounts',
    subtitle: 'Manage your payout bank accounts',
    icon: bankIcon,
    emptyTitle: 'No bank accounts yet',
    emptyDescription: 'Add a bank account to receive payouts from your HitPay balance.',
    cta: 'Add bank account',
  },
  staff: {
    title: 'Staff',
    subtitle: 'Manage team members and their permissions',
    icon: usersIcon,
    emptyTitle: 'No team members yet',
    emptyDescription: 'Invite your team and control what each member can access.',
    cta: 'Invite staff',
  },
  'audit-logs': {
    title: 'Audit Logs',
    subtitle: 'Track actions taken on your account',
    icon: documentIcon,
    emptyTitle: 'No activity yet',
    emptyDescription: 'Actions taken by you and your team members will show up here.',
    cta: null,
  },
  'store-settings': {
    title: 'Store Settings',
    subtitle: 'Configure your online store',
    icon: storeIcon,
    emptyTitle: 'No store set up yet',
    emptyDescription: 'Set up your online store to start selling with HitPay.',
    cta: 'Set up store',
  },
  'checkout-customisation': {
    title: 'Checkout Customisation',
    subtitle: 'Personalise your checkout experience',
    icon: paletteIcon,
    emptyTitle: 'Nothing customised yet',
    emptyDescription: 'Add your logo and brand colours to make checkout feel like your own.',
    cta: 'Customise checkout',
  },
  'order-form-customisation': {
    title: 'Order Form Customisation',
    subtitle: 'Personalise your order forms',
    icon: brushIcon,
    emptyTitle: 'No order forms yet',
    emptyDescription: 'Create and style order forms to collect orders your way.',
    cta: 'Create order form',
  },
  'email-templates': {
    title: 'Email Templates',
    subtitle: 'Customise emails sent to your customers',
    icon: composeIcon,
    emptyTitle: 'No email templates yet',
    emptyDescription: 'Customise the emails your customers receive from your business.',
    cta: 'Create template',
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Choose how you and your customers get notified',
    icon: alertIcon,
    emptyTitle: 'No notification preferences yet',
    emptyDescription: 'Set up alerts for payments, payouts and account activity.',
    cta: 'Set up notifications',
  },
  taxes: {
    title: 'Taxes',
    subtitle: 'Manage tax rates for your sales',
    icon: taxIcon,
    emptyTitle: 'No taxes added',
    emptyDescription: "Add tax rates and they'll be applied automatically at checkout.",
    cta: 'Add tax',
  },
  surcharges: {
    title: 'Surcharges',
    subtitle: 'Pass payment fees on to your customers',
    icon: moneyLineIcon,
    emptyTitle: 'No surcharges added',
    emptyDescription: 'Add a surcharge to recover payment fees at checkout.',
    cta: 'Add surcharge',
  },
  partners: {
    title: 'Partners',
    subtitle: 'Connect with HitPay partners',
    icon: earthIcon,
    emptyTitle: 'No partners connected',
    emptyDescription: 'Work with HitPay partners to grow your business.',
    cta: 'Explore partners',
  },
  platform: {
    title: 'Platform',
    subtitle: 'Manage your platform and sub-accounts',
    icon: gridIcon,
    emptyTitle: 'Platform is not enabled',
    emptyDescription: 'Onboard sub-merchants and collect fees with HitPay Platform.',
    cta: 'Get started',
  },
}

const route = useRoute()

const page = computed(() => {
  const slug = route.params.slug
  if (PAGES[slug]) return PAGES[slug]
  // Unknown settings slug — derive a title and show generic empty copy
  const title = String(slug || '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return {
    title,
    subtitle: '',
    icon: null,
    emptyTitle: 'Nothing here yet',
    emptyDescription: 'Content for this page will appear here.',
    cta: null,
  }
})

// Deep links land here with the settings sidebar closed — open it
settingsOpen.value = true
</script>
