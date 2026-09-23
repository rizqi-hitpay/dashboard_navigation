// Particle stream — bursts a rectangle into fine dust that then flows along
// swirling curves into a target point. Runs on a transient full-screen canvas
// (pointer-events: none) that removes itself when the last grain lands.
//
//   streamParticles({ from: DOMRect, to: { x, y }, onArrive })
//
// Two phases per grain: a small explosion (flung outward from the box centre,
// decelerating to a hang), then a glide into the target. Grains trail smoke via
// a per-frame partial clear and shrink away as they converge. `onArrive` fires
// once ~60% of the grains have landed.

// Left → right across the source box (green at the target end, purple at the far end)
const STOPS = [
  [184, 236, 150], // #b8ec96
  [144, 242, 250], // #90f2fa
  [152, 170, 249], // #98aaf9
  [160,  98, 247], // #a062f7
]

function colorAt(t) {
  const x = Math.min(Math.max(t, 0), 1) * (STOPS.length - 1)
  const i = Math.min(Math.floor(x), STOPS.length - 2)
  const f = x - i
  const a = STOPS[i], b = STOPS[i + 1]
  return `${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)}`
}

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const bezier = (p0, p1, p2, p3, t) => {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

// How long the source box takes to pop away (ms) — callers sync to this
export const BURST_MS = 280

export function streamParticles({ from, to, onArrive }) {
  return new Promise((resolve) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = window.innerWidth, H = window.innerHeight
    const canvas = document.createElement('canvas')
    canvas.width = W * dpr
    canvas.height = H * dpr
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: W + 'px', height: H + 'px',
      pointerEvents: 'none', zIndex: '9999',
    })
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    // Density: ~1 grain per 16px² of the source — airy, with visible gaps
    const count = Math.min(2000, Math.round((from.width * from.height) / 16))
    const cx = from.left + from.width / 2
    const cy = from.top + from.height / 2
    const grains = []
    for (let i = 0; i < count; i++) {
      const ox = from.left + Math.random() * from.width
      const oy = from.top + Math.random() * from.height
      const t = (ox - from.left) / from.width
      // Burst direction: away from the box centre (normalised to the box's
      // half-extents so a wide, short box still blows out vertically too)
      const nx = (ox - cx) / (from.width / 2)
      const ny = (oy - cy) / (from.height / 2)
      const mag = Math.hypot(nx, ny) || 1
      const dx = nx / mag + (Math.random() - 0.5) * 0.6
      const dy = ny / mag + (Math.random() - 0.5) * 0.6
      const force = (18 + Math.random() * 56) * (0.5 + 0.5 * Math.min(mag, 1))
      const bx = ox + dx * force * 1.3
      const by = oy + dy * force
      const dist = Math.hypot(bx - to.x, by - to.y)
      grains.push({
        p0x: ox, p0y: oy,
        // Phase 1 — explosion end point
        bx, by,
        burst: 320 + Math.random() * 160,
        // Phase 2 — glide: first handle keeps the burst's momentum, second
        // swings in horizontally from the right of the target
        p1x: bx + dx * (30 + Math.random() * 50), p1y: by + dy * (30 + Math.random() * 50),
        p2x: to.x + dist * (0.25 + Math.random() * 0.25), p2y: to.y + (Math.random() - 0.5) * 190,
        p3x: to.x + (Math.random() - 0.5) * 10, p3y: to.y + (Math.random() - 0.5) * 10,
        // Shockwave: the centre goes first, the ends a beat later
        delay: Math.abs(nx) * 70 + Math.random() * 60,
        dur: 950 + Math.random() * 500,
        size: 0.6 + Math.random() * 1.3,
        alpha: 0.15 + Math.random() * 0.3,
        swirl: 6 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        rgb: colorAt(t + (Math.random() - 0.5) * 0.12),
        haze: false,
        done: false,
      })
    }
    // Haze: a sparse layer of large, faint puffs riding the same paths — gives
    // the dust a soft cloud body instead of reading as isolated specks
    for (let i = 0; i < Math.round(count / 14); i++) {
      const g = { ...grains[Math.floor(Math.random() * count)] }
      g.haze = true
      g.size = 6 + Math.random() * 12
      g.alpha = 0.02 + Math.random() * 0.035
      g.swirl *= 1.6
      g.delay += Math.random() * 80
      grains.push(g)
    }
    const total = grains.length

    const t0 = performance.now()
    let arrived = 0
    let fired = false

    function frame(now) {
      const el = now - t0
      // Smoke trail: erase only part of last frame
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'

      let live = 0
      for (const g of grains) {
        if (g.done) continue
        const local = el - g.delay
        if (local < 0) { live++; continue }
        let x, y, fadeIn = 1, land = 1
        if (local < g.burst) {
          // Phase 1 — flung outward, decelerating to a brief hang
          const b = easeOutCubic(local / g.burst)
          x = g.p0x + (g.bx - g.p0x) * b
          y = g.p0y + (g.by - g.p0y) * b
          fadeIn = Math.min(local / 60, 1)
        } else {
          // Phase 2 — pulled into the target
          const raw = (local - g.burst) / g.dur
          if (raw >= 1) {
            g.done = true
            arrived++
            continue
          }
          const t = easeInOutCubic(raw)
          x = bezier(g.bx, g.p1x, g.p2x, g.p3x, t)
          y = bezier(g.by, g.p1y, g.p2y, g.p3y, t)
          // Turbulence, strongest mid-flight, gone at both ends
          const w = Math.sin(raw * Math.PI)
          x += Math.cos(g.phase + raw * 9) * g.swirl * w
          y += Math.sin(g.phase + raw * 7) * g.swirl * w
          // Shrink + fade as it lands
          land = raw > 0.8 ? 1 - (raw - 0.8) / 0.2 : 1
        }
        live++
        ctx.fillStyle = `rgba(${g.rgb},${g.alpha * fadeIn * land})`
        const s = g.size * (0.4 + 0.6 * land)
        if (g.haze) {
          ctx.beginPath()
          ctx.arc(x, y, s, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(x, y, s, s)
        }
      }

      if (!fired && arrived / total > 0.6) { fired = true; onArrive?.() }
      if (live > 0) requestAnimationFrame(frame)
      else {
        if (!fired) onArrive?.()
        canvas.remove()
        resolve()
      }
    }
    requestAnimationFrame(frame)
  })
}
