import { reactive, ref } from 'vue'

// RFI (Request for Information) — compliance asks the merchant for extra
// documents through a chat thread. Pure mock: state lives here, no backend.

export const RFI_STATUS = {
  requesting: {
    label: 'Requesting document',
    bg: '#fff9ec',
    color: '#bd8400',
    icon: 'loading',
  },
  under_review: {
    label: 'Under review',
    bg: '#f7edfd',
    color: '#7d1ab7',
    icon: 'doc-check',
  },
  rejected: {
    label: 'Rejected',
    bg: '#f9e9e9',
    color: '#c20a1c',
    icon: 'x',
  },
  completed: {
    label: 'Completed',
    bg: '#e6f9f0',
    color: '#238b5b',
    icon: 'check',
  },
}

const COMPLIANCE = { name: 'John Dean', role: 'Compliance Analyst', avatar: 'john' }
const MERCHANT = { name: 'Elies Foera', avatar: 'elies' }

const PREVIEW =
  'Of course, I can assist you with the bank account opening process. Could you please provide the necessary documents for verification?'

const INTRO_MESSAGE = {
  id: 1,
  from: 'cs',
  name: COMPLIANCE.name,
  avatar: COMPLIANCE.avatar,
  time: 'Today, 07:00',
  lines: [
    'Hi Aarti,',
    "As part of our periodic monitoring, we'd like you to refresh your source-of-funds declaration on file. Kindly provide:",
    { list: ['Updated source-of-funds / source-of-wealth statement', 'Last 6 months of business bank statements'] },
    'Please complete the checklist on the right when you have a moment. Reach out if you have any questions.',
    'Kind regards,\nEve Tan\nCompliance Analyst, HitPay',
  ],
}

// rfi-2 asks for documents through the required checklist instead of
// manual attachments — its intro message carries the checklist button
const CHECKLIST_INTRO_MESSAGE = {
  id: 1,
  from: 'cs',
  name: COMPLIANCE.name,
  avatar: COMPLIANCE.avatar,
  time: 'Today, 07:00',
  lines: [
    'Hi Aarti,',
    'Our quarterly transaction monitoring flagged a notable increase in volume during Q2. Kindly help us justify the change by providing:',
    { list: ['A short business explanation of the volume increase', 'Sales report or order export for the relevant period', 'Any marketing campaign or partnership documentation that drove the spike'] },
    'Please upload these via the checklist on the right.',
    'Kind regards,\nMarcus Lee\nCompliance Officer, HitPay',
  ],
  action: 'checklist',
}

let nextMessageId = 100

export const rfiRequests = reactive([
  {
    id: 'rfi-1',
    title: 'Asking for bank statement for verifications',
    status: 'requesting',
    preview: PREVIEW,
    avatar: 'john',
    unread: true,
    lastUpdate: 'Last update: Today, 08:09',
    overdue: false,
    agent: COMPLIANCE,
    initiated: '10/08/2026',
    due: '17/08/2026',
    messages: [{ ...INTRO_MESSAGE }],
    docsSent: false,
    showReadyBanner: false,
  },
  {
    id: 'rfi-2',
    title: 'Asking for bank statement for verifications',
    status: 'requesting',
    preview: PREVIEW,
    avatar: 'john',
    unread: true,
    lastUpdate: 'Overdue: 18/03/2026',
    overdue: true,
    agent: COMPLIANCE,
    initiated: '10/03/2026',
    due: '18/03/2026',
    messages: [{ ...CHECKLIST_INTRO_MESSAGE }],
    docsSent: false,
    showReadyBanner: false,
    checklist: {
      open: false,
      submitted: false,
      items: [
        { type: 'textarea', label: 'A short business explanation of the volume increase', placeholder: 'Tell me about it', value: '' },
        { type: 'file', label: 'Sales report or order export for the relevant period', mockFile: { name: 'Report.CSV', kind: 'csv' }, file: null },
        { type: 'file', label: 'Marketing campaign or partnership documentation', mockFile: { name: 'Documentation.PDF', kind: 'pdf' }, file: null },
      ],
    },
  },
  {
    id: 'rfi-3',
    title: 'Asking for bank statement for verifications',
    status: 'under_review',
    preview: PREVIEW,
    avatar: 'john',
    unread: false,
    lastUpdate: 'Last update: Today, 08:09',
    overdue: false,
    agent: COMPLIANCE,
    initiated: '10/08/2026',
    due: '17/08/2026',
    messages: [
      { ...INTRO_MESSAGE },
      { id: 2, from: 'me', name: MERCHANT.name, avatar: MERCHANT.avatar, time: 'Today, 07:20', text: 'Absolutely! I can share to you' },
      { id: 3, from: 'me', grouped: true, attachments: [{ name: 'uploaded_doc.pdf', type: 'pdf' }, { name: 'uploaded_doc.doc', type: 'doc' }] },
      { id: 4, from: 'cs', name: COMPLIANCE.name, avatar: COMPLIANCE.avatar, time: 'Today, 08:11', text: "Thanks Aarti, documents received. We're now reviewing — we'll get back to you within 3–5 business days." },
      { id: 5, system: true, text: 'All requested documents and information have been provided. Please proceed with the review.' },
    ],
    docsSent: true,
    showReadyBanner: false,
  },
  {
    id: 'rfi-4',
    title: 'Asking for bank statement for verifications',
    status: 'rejected',
    preview: PREVIEW,
    avatar: 'john',
    unread: false,
    lastUpdate: 'Last update: Today, 08:09',
    overdue: false,
    agent: COMPLIANCE,
    initiated: '01/08/2026',
    due: '08/08/2026',
    messages: [{ ...INTRO_MESSAGE }],
    docsSent: false,
    showReadyBanner: false,
  },
  {
    id: 'rfi-5',
    title: 'Asking for national ID for verifications',
    status: 'completed',
    preview: PREVIEW,
    avatar: 'elies',
    unread: false,
    lastUpdate: 'Last update: 22/08/2026',
    overdue: false,
    agent: COMPLIANCE,
    initiated: '15/08/2026',
    due: '22/08/2026',
    messages: [{ ...INTRO_MESSAGE }],
    docsSent: false,
    showReadyBanner: false,
  },
])

// Currently opened request id (null = list view)
export const activeRfiId = ref(null)

export function openRfi(id) {
  const req = rfiRequests.find((r) => r.id === id)
  if (!req) return
  req.unread = false
  activeRfiId.value = id
}

export function closeRfi() {
  activeRfiId.value = null
}

function nowLabel() {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `Today, ${hh}:${mm}`
}

export function sendMessage(id, text, attachments) {
  const req = rfiRequests.find((r) => r.id === id)
  if (!req) return
  const hasText = text && text.trim().length > 0
  const hasDocs = attachments && attachments.length > 0
  if (!hasText && !hasDocs) return

  if (hasText) {
    req.messages.push({
      id: nextMessageId++,
      from: 'me',
      name: MERCHANT.name,
      avatar: MERCHANT.avatar,
      time: nowLabel(),
      text: text.trim(),
    })
  }
  if (hasDocs) {
    req.messages.push({
      id: nextMessageId++,
      from: 'me',
      grouped: hasText,
      name: MERCHANT.name,
      avatar: MERCHANT.avatar,
      time: nowLabel(),
      attachments: attachments.map((a) => ({ ...a })),
    })
  }
  req.lastUpdate = `Last update: ${nowLabel()}`

  // Documents uploaded → ask the merchant to mark the request ready for review
  if (hasDocs && !req.docsSent) {
    req.docsSent = true
    req.showReadyBanner = true
  }
}

export function markReadyForReview(id) {
  const req = rfiRequests.find((r) => r.id === id)
  if (!req) return
  req.showReadyBanner = false

  // System notice first, then compliance acknowledges, then the thread
  // locks as Under review (composer hides)
  req.messages.push({
    id: nextMessageId++,
    system: true,
    text: 'All requested documents and information have been provided. Please proceed with the review.',
  })
  req.lastUpdate = `Last update: ${nowLabel()}`

  setTimeout(() => {
    req.messages.push({
      id: nextMessageId++,
      from: 'cs',
      name: COMPLIANCE.name,
      avatar: COMPLIANCE.avatar,
      time: nowLabel(),
      text: "Thanks Aarti, documents received. We're now reviewing — we'll get back to you within 3–5 business days.",
    })
    req.lastUpdate = `Last update: ${nowLabel()}`
  }, 1000)

  setTimeout(() => {
    req.status = 'under_review'
  }, 1800)
}

export function checklistCompletedCount(checklist) {
  return checklist.items.filter((item) =>
    item.type === 'textarea' ? item.value.trim().length > 0 : !!item.file,
  ).length
}

export function submitChecklist(id) {
  const req = rfiRequests.find((r) => r.id === id)
  if (!req || !req.checklist) return
  req.checklist.submitted = true
  req.status = 'under_review'
  req.overdue = false
  req.lastUpdate = `Last update: ${nowLabel()}`
}

// Any request still needing merchant action → "Action needed" chips in nav
export function hasActionNeeded() {
  return rfiRequests.some((r) => r.status === 'requesting')
}
