import { ref } from 'vue'
export const agentPanelOpen = ref(false)
// Message handed off from another surface (e.g. the Overview "Explore HitPay"
// chat box) to prefill the AI Assistant input when the panel opens.
export const pendingAgentMessage = ref('')
// Prompt sent from another surface (e.g. the Analytics empty state) that the
// AI Assistant answers as a chat conversation when the panel opens.
export const agentConversation = ref(null)
// Suggested prompts the AI Assistant offers before a conversation starts
// (e.g. Analytics "Ask AI Assistant" button). Null → the default Setup guide.
export const agentStarter = ref(null)

export function askAgent(prompt) {
  agentStarter.value = null
  agentConversation.value = { prompt, id: Date.now() }
  agentPanelOpen.value = true
}

export function openAgentStarter({ prompts, placeholder = '' }) {
  agentConversation.value = null
  agentStarter.value = { prompts, placeholder, id: Date.now() }
  agentPanelOpen.value = true
}
