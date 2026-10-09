import { Y_AXIS, Y_MAX } from './chartAxis.js'

const DEFAULT_TABLE_COLUMNS = [
  { key: 'date', label: 'Date', mono: true },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount', mono: true },
]

// ── Rendering ─────────────────────────────────────────────────────────

const S = 2 // render at 2× for crisp output
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const today = () => new Date().toISOString().slice(0, 10)

function chartSize(chart) {
  return { W: 640, H: chart.type === 'table' ? 72 + 34 + chart.rows.length * 40 + 24 : 400 }
}

// Draws one chart spec onto a fresh 2× canvas
function renderChartCanvas(chart) {
  const { W, H } = chartSize(chart)
  const canvas = document.createElement('canvas')
  canvas.width = W * S
  canvas.height = H * S
  const ctx = canvas.getContext('2d')
  ctx.scale(S, S)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#03102f'
  ctx.font = '500 16px Inter, sans-serif'
  ctx.fillText(chart.title, 24, 36)
  const draw = { bar: drawXY, line: drawXY, donut: drawDonut, table: drawTable }[chart.type]
  draw(ctx, chart, W, H)
  return canvas
}

function download(href, filename) {
  const a = document.createElement('a')
  a.download = filename
  a.href = href
  a.click()
}

// Single chart → PNG (chart toolbar "Download chart")
export function downloadChartPng(chart) {
  download(renderChartCanvas(chart).toDataURL('image/png'), `${slug(chart.title)}.png`)
}

// ── Page export (Export ▸ Download PNG / PDF) ────────────────────────

// Every chart stacked into one image under an "Analytics" heading
export function exportDashboardPng(charts) {
  const W = 640, HEAD = 64, GAP = 16
  const canvases = charts.map(renderChartCanvas)
  const H = HEAD + canvases.reduce((sum, c) => sum + c.height / S + GAP, 0)
  const out = document.createElement('canvas')
  out.width = W * S
  out.height = H * S
  const ctx = out.getContext('2d')
  ctx.scale(S, S)
  ctx.fillStyle = '#f8f9fc'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#03102f'
  ctx.font = '500 18px Inter, sans-serif'
  ctx.fillText('Analytics', 24, 36)
  ctx.fillStyle = '#61667c'
  ctx.font = '400 12px Inter, sans-serif'
  ctx.fillText(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), 24, 54)
  let y = HEAD
  for (const c of canvases) {
    ctx.drawImage(c, 0, y, c.width / S, c.height / S)
    y += c.height / S + GAP
  }
  download(out.toDataURL('image/png'), `analytics-${today()}.png`)
}

// One PDF page per chart, each page sized to its chart
export function exportDashboardPdf(charts) {
  const pages = charts.map((chart) => {
    const canvas = renderChartCanvas(chart)
    const { W, H } = chartSize(chart)
    const b64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1]
    return { jpeg: Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0)), w: W, h: H, pxW: canvas.width, pxH: canvas.height }
  })
  const url = URL.createObjectURL(new Blob([buildPdf(pages)], { type: 'application/pdf' }))
  download(url, `analytics-${today()}.pdf`)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Minimal PDF 1.4 writer: each page shows one full-bleed JPEG (DCTDecode)
function buildPdf(pages) {
  const enc = new TextEncoder()
  const chunks = []
  const offsets = []
  let length = 0
  const push = (part) => {
    const bytes = typeof part === 'string' ? enc.encode(part) : part
    chunks.push(bytes)
    length += bytes.length
  }
  const obj = (id, body) => { offsets[id] = length; push(`${id} 0 obj\n`); body(); push('\nendobj\n') }

  const pageIds = pages.map((_, i) => 3 + i * 3)
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'))
  obj(2, () => push(`<< /Type /Pages /Count ${pages.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`))
  pages.forEach((pg, i) => {
    const [pageId, contentId, imageId] = [pageIds[i], pageIds[i] + 1, pageIds[i] + 2]
    const content = `q ${pg.w} 0 0 ${pg.h} 0 0 cm /Im0 Do Q`
    obj(pageId, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pg.w} ${pg.h}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`))
    obj(contentId, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`))
    obj(imageId, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${pg.pxW} /Height ${pg.pxH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pg.jpeg.length} >>\nstream\n`)
      push(pg.jpeg)
      push('\nendstream')
    })
  })
  const count = 3 + pages.length * 3
  const xrefAt = length
  push(`xref\n0 ${count}\n0000000000 65535 f \n`)
  for (let id = 1; id < count; id++) push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`)

  const out = new Uint8Array(length)
  let at = 0
  for (const c of chunks) { out.set(c, at); at += c.length }
  return out
}

function drawXY(ctx, chart, W, H) {
  const top = 72, bottom = H - 48, left = 72, right = W - 24
  const plotH = bottom - top
  ctx.font = '500 10px Inter, sans-serif'
  ctx.fillStyle = '#9295a5'
  ctx.textAlign = 'right'
  Y_AXIS.forEach((label, i) => ctx.fillText(label, left - 16, top + (plotH * i) / (Y_AXIS.length - 1) + 4))

  const n = chart.values.length
  const step = (right - left) / n
  const y = (v) => bottom - (v / Y_MAX) * plotH
  const maxI = chart.values.indexOf(Math.max(...chart.values))

  if (chart.type === 'bar') {
    chart.values.forEach((v, i) => {
      ctx.fillStyle = i === maxI ? '#4c8afd' : '#ccdefe'
      ctx.beginPath()
      ctx.roundRect(left + i * step + 2, y(v), step - 4, bottom - y(v), [4, 4, 0, 0])
      ctx.fill()
    })
  } else {
    const pts = chart.values.map((v, i) => [left + i * step + step / 2, y(v)])
    const grad = ctx.createLinearGradient(0, top, 0, bottom)
    grad.addColorStop(0, '#ccdefe')
    grad.addColorStop(1, '#ffffff')
    ctx.beginPath()
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
    ctx.lineTo(pts.at(-1)[0], bottom)
    ctx.lineTo(pts[0][0], bottom)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()
    ctx.beginPath()
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
    ctx.strokeStyle = '#4c8afd'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  ctx.fillStyle = '#9295a5'
  ctx.textAlign = 'center'
  chart.labels.forEach((label, i) => ctx.fillText(label.toUpperCase(), left + i * step + step / 2, bottom + 20))
  ctx.strokeStyle = '#f2f2f4'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, bottom + 0.5)
  ctx.lineTo(right, bottom + 0.5)
  ctx.stroke()
}

function drawDonut(ctx, chart, W) {
  const cx = W / 2, cy = 200, outer = 105, inner = 84
  const total = chart.segments.reduce((s, x) => s + x.pct, 0)
  let a = -Math.PI / 2
  chart.segments.forEach((seg) => {
    const sweep = (seg.pct / total) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx, cy, outer, a + 0.015, a + sweep - 0.015)
    ctx.arc(cx, cy, inner, a + sweep - 0.015, a + 0.015, true)
    ctx.closePath()
    ctx.fillStyle = seg.color
    ctx.fill()
    a += sweep
  })
  ctx.textAlign = 'center'
  ctx.fillStyle = '#61667c'
  ctx.font = '400 14px Inter, sans-serif'
  ctx.fillText('Total', cx, cy - 6)
  ctx.fillStyle = '#03102f'
  ctx.font = '500 16px "Reddit Mono", monospace'
  ctx.fillText(`SGD ${chart.total.toLocaleString('en-US')}`, cx, cy + 16)

  ctx.font = '400 12px Inter, sans-serif'
  const widths = chart.segments.map((s) => ctx.measureText(s.label).width + 14)
  let x = cx - (widths.reduce((s, w) => s + w, 0) + 8 * (widths.length - 1)) / 2
  chart.segments.forEach((seg, i) => {
    ctx.fillStyle = seg.color
    ctx.beginPath()
    ctx.arc(x + 4, 344, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#03102f'
    ctx.textAlign = 'left'
    ctx.fillText(seg.label, x + 12, 348)
    x += widths[i] + 8
  })
}

function drawTable(ctx, chart, W) {
  const cols = chart.columns || DEFAULT_TABLE_COLUMNS
  const left = 24, top = 60, width = W - 48
  const colW = width / cols.length
  ctx.fillStyle = '#fcfcfd'
  ctx.fillRect(left, top, width, 34)
  ctx.font = '500 10px Inter, sans-serif'
  ctx.fillStyle = '#03102f'
  ctx.textAlign = 'left'
  cols.forEach((c, i) => ctx.fillText(c.label.toUpperCase(), left + i * colW + 12, top + 21))
  chart.rows.forEach((row, r) => {
    const y = top + 34 + r * 40
    ctx.strokeStyle = '#e5e6ea'
    ctx.beginPath()
    ctx.moveTo(left, y + 0.5)
    ctx.lineTo(left + width, y + 0.5)
    ctx.stroke()
    cols.forEach((c, i) => {
      ctx.font = c.mono ? `${c.strong ? 600 : 400} 12px "Reddit Mono", monospace` : '400 13px Inter, sans-serif'
      ctx.fillText(String(row[c.key]), left + i * colW + 12, y + 25, colW - 20)
    })
  })
}
