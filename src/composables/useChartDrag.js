import { ref, onBeforeUnmount } from 'vue'
import { analyticsCharts } from './useAnalytics.js'

const DRAG_THRESHOLD = 4   // px the pointer must travel before a press becomes a drag
const DROP_MS = 220        // ghost settle animation
const EDGE = 64            // auto-scroll zone at the top/bottom of the scroller

// Pointer-driven reordering for the Analytics chart grid.
// The dragged chart stays in the grid as a placeholder slot while a "ghost" copy
// follows the pointer; crossing another chart's midpoint moves the slot there.
export function useChartDrag(gridRef, scrollRef) {
  const draggingId = ref(null)
  const ghost = ref(null) // { chart, x, y, width, height, dropping }

  let press = null       // pending press before the threshold is crossed
  let offset = { x: 0, y: 0 }
  let pointer = { x: 0, y: 0 }
  let originalOrder = null
  let scrollRaf = null

  function onGrab(e, chart) {
    if (e.button !== 0 || ghost.value?.dropping) return
    press = { chart, startX: e.clientX, startY: e.clientY, el: e.currentTarget.closest('[data-chart-id]') }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
  }

  function begin() {
    const rect = press.el.getBoundingClientRect()
    offset = { x: press.startX - rect.left, y: press.startY - rect.top }
    originalOrder = analyticsCharts.value.map((c) => c.id)
    draggingId.value = press.chart.id
    ghost.value = { chart: press.chart, x: rect.left, y: rect.top, width: rect.width, height: rect.height, dropping: false }
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
    window.addEventListener('keydown', onKey)
    autoScroll()
  }

  function onMove(e) {
    pointer = { x: e.clientX, y: e.clientY }
    if (!draggingId.value) {
      if (Math.hypot(e.clientX - press.startX, e.clientY - press.startY) < DRAG_THRESHOLD) return
      begin()
    }
    ghost.value.x = e.clientX - offset.x
    ghost.value.y = e.clientY - offset.y
    reorder()
  }

  // Move the placeholder once the pointer passes a sibling's midpoint
  function reorder() {
    const grid = gridRef.value?.$el ?? gridRef.value
    if (!grid) return
    const slot = grid.querySelector(`[data-chart-id="${draggingId.value}"]`)
    if (!slot) return
    const slotRect = slot.getBoundingClientRect()
    const ids = analyticsCharts.value.map((c) => c.id)
    const from = ids.indexOf(draggingId.value)

    for (const el of grid.querySelectorAll('[data-chart-id]')) {
      const id = Number(el.dataset.chartId)
      if (id === draggingId.value) continue
      const r = el.getBoundingClientRect()
      if (pointer.x < r.left || pointer.x > r.right || pointer.y < r.top || pointer.y > r.bottom) continue

      const to = ids.indexOf(id)
      const sameRow = Math.abs(r.top - slotRect.top) < 8
      const forward = to > from
      const passed = sameRow
        ? (forward ? pointer.x > r.left + r.width / 2 : pointer.x < r.left + r.width / 2)
        : (forward ? pointer.y > r.top + r.height / 2 : pointer.y < r.top + r.height / 2)
      if (passed) moveTo(from, to)
      return
    }
  }

  function moveTo(from, to) {
    const list = [...analyticsCharts.value]
    list.splice(to, 0, list.splice(from, 1)[0])
    analyticsCharts.value = list
  }

  // Scroll the page while the pointer is held near its top or bottom edge
  function autoScroll() {
    const scroller = scrollRef.value
    if (scroller && draggingId.value) {
      const r = scroller.getBoundingClientRect()
      let dy = 0
      if (pointer.y < r.top + EDGE) dy = -Math.ceil((r.top + EDGE - pointer.y) / 6)
      else if (pointer.y > r.bottom - EDGE) dy = Math.ceil((pointer.y - (r.bottom - EDGE)) / 6)
      if (dy) { scroller.scrollTop += dy; reorder() }
    }
    if (draggingId.value) scrollRaf = requestAnimationFrame(autoScroll)
  }

  function onUp() {
    if (draggingId.value) drop()
    teardown()
  }

  function onCancel() {
    if (draggingId.value) cancel()
    teardown()
  }

  function onKey(e) {
    if (e.key === 'Escape') { cancel(); teardown() }
  }

  function cancel() {
    if (originalOrder) {
      const byId = new Map(analyticsCharts.value.map((c) => [c.id, c]))
      analyticsCharts.value = originalOrder.map((id) => byId.get(id)).filter(Boolean)
    }
    drop()
  }

  // Glide the ghost into the placeholder slot, then reveal the real card
  function drop() {
    const grid = gridRef.value?.$el ?? gridRef.value
    const slot = grid?.querySelector(`[data-chart-id="${draggingId.value}"]`)
    if (!slot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return }
    requestAnimationFrame(() => {
      const r = slot.getBoundingClientRect()
      Object.assign(ghost.value, { x: r.left, y: r.top, width: r.width, dropping: true })
      setTimeout(finish, DROP_MS)
    })
  }

  function finish() {
    draggingId.value = null
    ghost.value = null
  }

  function teardown() {
    press = null
    originalOrder = null
    cancelAnimationFrame(scrollRaf)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onCancel)
    window.removeEventListener('keydown', onKey)
  }

  // Keyboard: arrows on a focused drag handle move the chart one slot
  function onHandleKey(e, chart) {
    const delta = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key]
    if (!delta) return
    e.preventDefault()
    const ids = analyticsCharts.value.map((c) => c.id)
    const from = ids.indexOf(chart.id)
    const to = Math.min(Math.max(from + delta, 0), ids.length - 1)
    if (to !== from) moveTo(from, to)
  }

  onBeforeUnmount(teardown)

  return { draggingId, ghost, onGrab, onHandleKey, dropMs: DROP_MS }
}
