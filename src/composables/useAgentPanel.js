import { ref, shallowRef } from 'vue'
export const agentPanelOpen = ref(false)
// Message handed off from another surface (e.g. the Overview "Explore HitPay"
// chat box) to prefill the AI Assistant input when the panel opens.
export const pendingAgentMessage = ref('')

// The AI Assistant rail item is hidden at first — it's "earned" when the
// Overview chat dock is closed and streams into the rail as particles.
export const aiAssistantRevealed = ref(false)
// Rail item element, registered by NavRail — the particle stream's target
export const aiAssistantRailEl = shallowRef(null)

// True once the Overview chat dock has reached its full form — AI nudges
// elsewhere on the page (e.g. "Why 11% drop?") wait for this
export const agentChatReady = ref(false)
