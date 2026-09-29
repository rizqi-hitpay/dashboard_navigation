import { ref } from 'vue'
export const agentPanelOpen = ref(false)
// Message handed off from another surface (e.g. the Overview "Explore HitPay"
// chat box) to prefill the AI Assistant input when the panel opens.
export const pendingAgentMessage = ref('')
