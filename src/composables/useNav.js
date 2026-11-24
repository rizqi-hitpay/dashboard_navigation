import { ref } from 'vue'
import { financePreview } from './useFinancePreview.js'

// 0 = Payments, 1 = Commerce, 2 = Finance, 3 = Studio
// The Finance preview opens on Finance
export const activeProduct = ref(financePreview.value ? 2 : 0)
