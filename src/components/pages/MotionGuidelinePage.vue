<template>
  <div class="min-h-screen w-full overflow-y-auto bg-[#f8f9fc] motion-page">
   <div class="mx-auto w-full max-w-[1040px]" style="padding: 24px 32px 96px;">

    <!-- ── Back to home ─────────────────────────────────────── -->
    <RouterLink to="/" class="back-home">
      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      Back to home
    </RouterLink>

    <!-- ── Header ───────────────────────────────────────────── -->
    <header class="text-center mb-14 mt-2">
      <div class="flex items-center justify-center gap-2 mb-3">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium" style="background:#eef2ff;color:#2364dd;">
          <span class="w-1.5 h-1.5 rounded-full bg-[#2364dd] motion-pulse" /> Foundations
        </span>
        <span class="text-[11px] text-[#8093b8]">Updated Jun 2026</span>
      </div>
      <h1 class="text-[32px] leading-tight font-semibold text-[#03102f] mb-3">Motion</h1>
      <p class="text-[15px] leading-relaxed text-[#61667c] max-w-[640px] mx-auto">
        How movement behaves across the HitPay dashboard — the easing curves, timing scale and
        interaction patterns we use to make the interface feel responsive, calm and physical.
        Built on the motion principles from
        <a href="https://animations.dev/" target="_blank" rel="noopener"
           class="text-[#2364dd] font-medium hover:underline">animations.dev</a>,
        and documented straight from the components shipping today.
      </p>
    </header>

    <!-- ── Principles ───────────────────────────────────────── -->
    <section class="mb-12">
      <h2 class="section-title">Principles</h2>
      <p class="section-sub">Six rules every animation in the product should pass.</p>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 max-w-[1000px] mx-auto">
        <article v-for="p in principles" :key="p.title" class="principle-card">
          <div class="principle-icon" v-html="p.icon" />
          <h3 class="text-[14px] font-medium text-[#03102f] mb-1">{{ p.title }}</h3>
          <p class="text-[12.5px] leading-relaxed text-[#61667c]">{{ p.body }}</p>
        </article>
      </div>
    </section>

    <!-- ── Easing ───────────────────────────────────────────── -->
    <section class="mb-12">
      <h2 class="section-title">Easing</h2>
      <p class="section-sub">
        Click any curve to replay the motion. Natural UI motion never moves at a constant speed —
        it accelerates and decelerates. We standardise on four curves plus the CSS keywords.
      </p>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[1000px] mx-auto">
        <article
          v-for="(e, i) in easings"
          :key="e.name"
          class="easing-card"
          @click="playEasing(i)"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-[13px] font-medium text-[#03102f]">{{ e.name }}</h3>
              <code class="text-[11px] text-[#8093b8]">{{ e.value }}</code>
            </div>
            <span class="text-[10px] text-[#a6b3cd] font-medium">{{ e.duration }}ms</span>
          </div>

          <!-- Bezier plot -->
          <div class="bezier-wrap">
            <svg viewBox="-6 -30 112 142" class="bezier-svg">
              <line x1="0" y1="100" x2="100" y2="100" class="bezier-axis" />
              <line x1="0" y1="100" x2="0" y2="0" class="bezier-axis" />
              <line x1="0" y1="0" x2="100" y2="0" class="bezier-grid" />
              <path :d="bezierPath(e.curve)" class="bezier-curve" />
              <circle cx="0" cy="100" :r="2.5" class="bezier-anchor" />
              <circle cx="100" cy="0" :r="2.5" class="bezier-anchor" />
            </svg>
          </div>

          <!-- Live travelling dot -->
          <div class="ease-track">
            <span
              class="ease-dot"
              :style="{
                left: e.pos ? 'calc(100% - 12px)' : '0px',
                transition: `left ${e.duration}ms ${e.value}`,
              }"
            />
          </div>

          <p class="text-[11.5px] leading-snug text-[#61667c] mt-3">{{ e.use }}</p>
        </article>
      </div>
    </section>

    <!-- ── Duration scale ───────────────────────────────────── -->
    <section class="mb-12">
      <h2 class="section-title">Duration scale</h2>
      <p class="section-sub">
        Smaller elements and shorter distances need less time. Exits run faster than entrances —
        users want to dismiss things quickly. Hover a row to sweep it.
      </p>
      <div class="duration-table max-w-[820px] mx-auto">
        <div class="duration-head">
          <span>Token</span><span>Time</span><span class="dur-bar-col">Relative</span><span>When to use</span>
        </div>
        <div v-for="d in durations" :key="d.token" class="duration-row group">
          <code class="text-[12px] text-[#03102f] font-medium">{{ d.token }}</code>
          <span class="text-[12px] text-[#61667c]">{{ d.ms }}ms</span>
          <span class="dur-bar-col">
            <span class="dur-bar" :style="{ width: (d.ms / 720 * 100) + '%' }">
              <span class="dur-sweep" />
            </span>
          </span>
          <span class="text-[12px] text-[#61667c]">{{ d.use }}</span>
        </div>
      </div>
    </section>

    <!-- ── Patterns ─────────────────────────────────────────── -->
    <section>
      <h2 class="section-title">Patterns</h2>
      <p class="section-sub">
        The reusable motions in the dashboard today. Each shows a live demo, the spec, and the
        exact CSS. Trigger every demo to feel the timing.
      </p>

      <div class="flex flex-col gap-4 max-w-[1000px] mx-auto">

        <!-- 1 · Directional view swap -->
        <PatternCard
          title="Directional view swap"
          source="DashboardLayout · sidebar / settings transition"
          desc="When one panel replaces another, the outgoing view leaves toward where it came from while the new one slides in from the opposite side — so direction encodes hierarchy. Enter is slower (180ms) than leave (130ms)."
          :spec="[
            ['Properties', 'opacity, transform: translateX(±14px)'],
            ['Enter', '180ms ease-out'],
            ['Leave', '130ms ease'],
            ['Mode', 'out-in (no overlap)'],
          ]"
          :code="codeSwap"
        >
          <div class="demo-stage">
            <Transition name="demo-swap" mode="out-in">
              <div :key="swapKey" class="demo-swap-panel">
                <span class="text-[12px] font-medium text-[#03102f]">{{ swapKey === 0 ? 'Payments' : 'Finance' }}</span>
                <span class="text-[11px] text-[#8093b8]">view {{ swapKey + 1 }}</span>
              </div>
            </Transition>
            <button class="demo-btn" @click="swapKey = swapKey === 0 ? 1 : 0">Swap view</button>
          </div>
        </PatternCard>

        <!-- 2 · Origin-aware menu -->
        <PatternCard
          title="Origin-aware menu"
          source="PlusMenu · AccountMenu"
          desc="Pop-overs grow from the corner they're anchored to using transform-origin, so they appear to emerge from their trigger rather than just fading in. They scale from 0.95 and nudge in, then snap back faster on close."
          :spec="[
            ['Properties', 'opacity, transform: scale(.95) translateY'],
            ['Enter', '170ms ease-out'],
            ['Leave', '120ms ease-in'],
            ['Origin', 'top right (anchored corner)'],
          ]"
          :code="codeMenu"
        >
          <div class="demo-stage" style="align-items:flex-start;">
            <div class="relative">
              <button ref="menuAnchor" class="demo-btn" @click="menuOpen = !menuOpen">
                + New
              </button>
              <Transition name="demo-menu">
                <div v-if="menuOpen" class="demo-menu">
                  <div v-for="it in ['Invoice','Payment link','Product']" :key="it" class="demo-menu-item">{{ it }}</div>
                </div>
              </Transition>
            </div>
          </div>
        </PatternCard>

        <!-- 3 · Tooltip -->
        <PatternCard
          title="Hint tooltip"
          source="NavTooltip · collapsed sidebar"
          desc="A small label that slides 4px toward the pointer as it fades in. Fast in (140ms), even faster out (100ms, opacity only) — tooltips should never linger."
          :spec="[
            ['Properties', 'opacity, transform: translateX(-4px)'],
            ['Enter', '140ms ease-out'],
            ['Leave', '100ms ease-in (fade only)'],
          ]"
          :code="codeTooltip"
        >
          <div class="demo-stage">
            <div class="relative inline-flex" @mouseenter="tipOn = true" @mouseleave="tipOn = false">
              <div class="demo-icon-btn" v-html="icons.bolt" />
              <Transition name="demo-tip">
                <span v-if="tipOn" class="demo-tip">Hover me</span>
              </Transition>
            </div>
            <span class="text-[11px] text-[#8093b8]">Hover the icon →</span>
          </div>
        </PatternCard>

        <!-- 4 · Accordion reveal -->
        <PatternCard
          title="Accordion reveal"
          source="SidebarMenuItem · submenu"
          desc="Expanding rows animate grid-template-rows from 0fr to 1fr — a height transition with zero layout-thrash and no magic pixel numbers. The chevron rotates 90° in lockstep."
          :spec="[
            ['Property', 'grid-template-rows: 0fr → 1fr'],
            ['Duration', '200ms ease-out'],
            ['Chevron', 'transform: rotate(90deg) 200ms'],
          ]"
          :code="codeAccordion"
        >
          <div class="demo-stage" style="align-items:stretch;flex-direction:column;gap:0;">
            <button class="demo-row" @click="accOpen = !accOpen">
              <span class="text-[12px] font-medium text-[#03102f]">Bill Pay</span>
              <span class="demo-chev" :style="{ transform: accOpen ? 'rotate(90deg)' : 'rotate(0)' }" v-html="icons.chevron" />
            </button>
            <div class="demo-acc" :style="{ gridTemplateRows: accOpen ? '1fr' : '0fr' }">
              <div style="overflow:hidden;">
                <div class="demo-sub" v-for="s in ['Bills','Vendors','Settings']" :key="s">{{ s }}</div>
              </div>
            </div>
          </div>
        </PatternCard>

        <!-- 5 · Content reveal -->
        <PatternCard
          title="Content reveal"
          source="OverviewContent · intro reveal"
          desc="A one-time onboarding reveal that grows content into place over a long, deeply-decelerating curve. The slow settle reads as 'arriving', not 'snapping'."
          :spec="[
            ['Property', 'grid-template-rows: 0fr → 1fr'],
            ['Duration', '600ms'],
            ['Easing', 'cubic-bezier(0.32, 0.72, 0, 1)'],
          ]"
          :code="codeReveal"
        >
          <div class="demo-stage" style="flex-direction:column;align-items:stretch;">
            <button class="demo-btn self-start mb-1" @click="revealOn = !revealOn">{{ revealOn ? 'Collapse' : 'Reveal' }}</button>
            <div class="demo-reveal" :class="{ 'demo-reveal--open': revealOn }">
              <div style="overflow:hidden;min-height:0;">
                <div class="demo-reveal-inner">
                  <div class="demo-stat" v-for="n in 3" :key="n">
                    <span class="text-[10px] text-[#8093b8]">Metric {{ n }}</span>
                    <span class="text-[15px] font-semibold text-[#03102f]">SGD {{ n }}.2k</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PatternCard>

        <!-- 6 · Modal entrance -->
        <PatternCard
          title="Modal entrance"
          source="VideoIntroModal"
          desc="The backdrop fades while the panel scales up with a gentle overshoot — a back-out curve crests just past 1.0 then settles. The tiny bounce signals importance without feeling springy."
          :spec="[
            ['Backdrop', 'opacity 220ms ease-out'],
            ['Panel enter', '240ms cubic-bezier(0.34, 1.3, 0.64, 1)'],
            ['Panel leave', '160ms ease-in'],
            ['Transform', 'scale(0.96) → 1, translateY'],
          ]"
          :code="codeModal"
        >
          <div class="demo-stage demo-modal-stage">
            <button class="demo-btn" @click="modalOn = true">Open modal</button>
            <Transition name="demo-mb">
              <div v-if="modalOn" class="demo-backdrop" @click="modalOn = false" />
            </Transition>
            <Transition name="demo-mp">
              <div v-if="modalOn" class="demo-modal">
                <span class="text-[12px] font-medium text-[#03102f]">What's new</span>
                <span class="text-[11px] text-[#8093b8]">Click anywhere to close</span>
              </div>
            </Transition>
          </div>
        </PatternCard>

        <!-- 7 · Panel push -->
        <PatternCard
          title="Layout push"
          source="DashboardLayout · agent panel"
          desc="The agent panel slides in by animating width 0 → 360px. Because it lives in a flex row, the main card smoothly gives up space — one width transition drives two elements with the standard curve."
          :spec="[
            ['Property', 'width: 0 → 360px'],
            ['Duration', '280ms'],
            ['Easing', 'cubic-bezier(0.4, 0, 0.2, 1)'],
          ]"
          :code="codePanel"
        >
          <div class="demo-stage" style="align-items:stretch;">
            <div class="demo-push-row">
              <div class="demo-push-main">Main content</div>
              <div class="demo-push-side" :style="{ width: panelOn ? '120px' : '0px' }">
                <span class="text-[11px] font-medium text-white whitespace-nowrap">Agent</span>
              </div>
            </div>
            <button class="demo-btn mt-2 self-start" @click="panelOn = !panelOn">{{ panelOn ? 'Close' : 'Open' }} panel</button>
          </div>
        </PatternCard>

        <!-- 8 · Rise-in entrance -->
        <PatternCard
          title="Rise-in entrance"
          source="AgentChatInput · ProductIntroCarousel"
          desc="A hero element floats up from 12px below while widening from 85% — a long expo curve makes it feel weightless. Used sparingly for first-paint focal points only."
          :spec="[
            ['Keyframe', 'translateY(12px) scaleX(.85) → 0 / 1'],
            ['Duration', '720ms'],
            ['Easing', 'cubic-bezier(0.16, 1, 0.3, 1)'],
          ]"
          :code="codeRise"
        >
          <div class="demo-stage" style="flex-direction:column;align-items:stretch;">
            <button class="demo-btn self-start mb-2" @click="replayRise">Replay</button>
            <div :key="riseKey" class="demo-rise">Ask the agent anything…</div>
          </div>
        </PatternCard>

      </div>
    </section>

    <p class="text-[11px] text-[#a6b3cd] mt-12 max-w-[1000px] mx-auto text-center">
      Every animation honours <code>prefers-reduced-motion</code> — when a user opts out, transitions
      collapse to instant. Animate only <code>transform</code> and <code>opacity</code> where possible;
      they run on the compositor and never trigger layout.
    </p>
   </div>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'

/* ── Inline pattern card (kept local to this guideline page) ─────────── */
const PatternCard = {
  props: { title: String, source: String, desc: String, spec: Array, code: String },
  setup(props, { slots }) {
    const showCode = ref(false)
    return () =>
      h('article', { class: 'pattern-card' }, [
        h('div', { class: 'pattern-head' }, [
          h('div', {}, [
            h('h3', { class: 'text-[15px] font-medium text-[#03102f]' }, props.title),
            h('code', { class: 'text-[11px] text-[#8093b8]' }, props.source),
          ]),
          h('button', {
            class: 'code-toggle',
            onClick: () => (showCode.value = !showCode.value),
          }, showCode.value ? 'Hide CSS' : 'View CSS'),
        ]),
        h('p', { class: 'text-[13px] leading-relaxed text-[#61667c] mt-2 mb-4' }, props.desc),
        h('div', { class: 'pattern-body' }, [
          h('div', { class: 'pattern-demo' }, slots.default ? slots.default() : []),
          h('div', { class: 'pattern-spec' },
            props.spec.map((row) =>
              h('div', { class: 'spec-row', key: row[0] }, [
                h('span', { class: 'spec-key' }, row[0]),
                h('span', { class: 'spec-val' }, row[1]),
              ]),
            ),
          ),
        ]),
        showCode.value
          ? h('pre', { class: 'code-block' }, h('code', {}, props.code))
          : null,
      ])
  },
}

/* ── Principles ─────────────────────────────────────────────────────── */
const principles = [
  {
    title: 'Purposeful',
    body: 'Motion guides attention or explains a change in state. If it does neither, remove it.',
    icon: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/></svg>',
  },
  {
    title: 'Easing matters',
    body: 'Real motion accelerates and decelerates. Linear timing feels mechanical — reserve it for loops.',
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 19C7 19 9 5 21 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  },
  {
    title: 'Quick exits',
    body: 'Things should leave faster than they arrive. Users have already decided to dismiss them.',
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M14 5l6 7-6 7M20 12H4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    title: 'Origin-aware',
    body: 'Elements grow from where they were triggered, anchoring cause to effect via transform-origin.',
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 5h6v6H5z" stroke="currentColor" stroke-width="1.6"/><path d="M11 11l8 8M19 14v5h-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    title: 'Compositor-only',
    body: 'Animate transform and opacity. They run off the main thread and never force a layout reflow.',
    icon: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M4 10h16M10 4v16" stroke="currentColor" stroke-width="1.2"/></svg>',
  },
  {
    title: 'Respect the user',
    body: 'Honour prefers-reduced-motion. Vestibular comfort beats delight — always provide an instant path.',
    icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  },
]

/* ── Easing curves (live) ───────────────────────────────────────────── */
const easings = reactive([
  { name: 'standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', curve: [0.4, 0, 0.2, 1], duration: 250, pos: false,
    use: 'Sidebar width, agent panel, tab pill. Symmetric, balanced motion for everyday UI.' },
  { name: 'decelerate', value: 'cubic-bezier(0.32, 0.72, 0, 1)', curve: [0.32, 0.72, 0, 1], duration: 600, pos: false,
    use: 'Overview reveal. A long, soft settle for content arriving into place.' },
  { name: 'ease-out-expo', value: 'cubic-bezier(0.16, 1, 0.3, 1)', curve: [0.16, 1, 0.3, 1], duration: 720, pos: false,
    use: 'Chat input & carousel rise-in. Fast start that floats to a weightless rest.' },
  { name: 'back-out', value: 'cubic-bezier(0.34, 1.3, 0.64, 1)', curve: [0.34, 1.3, 0.64, 1], duration: 240, pos: false,
    use: 'Video modal panel. A subtle overshoot adds delight on important moments.' },
])

function playEasing(i) {
  easings[i].pos = !easings[i].pos
}

/* Map cubic-bezier control points to an SVG path in a 0–100 box (y inverted). */
function bezierPath([x1, y1, x2, y2]) {
  const c1x = (x1 * 100).toFixed(1)
  const c1y = (100 - y1 * 100).toFixed(1)
  const c2x = (x2 * 100).toFixed(1)
  const c2y = (100 - y2 * 100).toFixed(1)
  return `M0,100 C${c1x},${c1y} ${c2x},${c2y} 100,0`
}

/* ── Duration scale ─────────────────────────────────────────────────── */
const durations = [
  { token: 'instant', ms: 100, use: 'Tooltip fade-out, hover colour shifts.' },
  { token: 'quick', ms: 150, use: 'Colour / background hover states (transition-colors).' },
  { token: 'leave', ms: 130, use: 'Default exit for menus and view swaps.' },
  { token: 'base', ms: 200, use: 'Accordions, chevron rotation, icon flips.' },
  { token: 'standard', ms: 250, use: 'Sidebar width, tab pill slide.' },
  { token: 'panel', ms: 280, use: 'Agent panel push.' },
  { token: 'reveal', ms: 600, use: 'One-time content reveal.' },
  { token: 'hero', ms: 720, use: 'Rise-in entrance for focal elements.' },
]

/* ── Demo state ─────────────────────────────────────────────────────── */
const swapKey = ref(0)
const menuOpen = ref(false)
const menuAnchor = ref(null)
const tipOn = ref(false)
const accOpen = ref(false)
const revealOn = ref(false)
const modalOn = ref(false)
const panelOn = ref(false)
const riseKey = ref(0)

function replayRise() {
  riseKey.value++
}

/* ── Icons (inline) ─────────────────────────────────────────────────── */
const icons = {
  bolt: '<svg viewBox="0 0 24 24" fill="none"><path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke="#2364dd" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#4c689c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
}

/* ── Code snippets (real CSS from the components) ───────────────────── */
const codeSwap = `<Transition name="sidebar" mode="out-in">
  <component :is="view" :key="key" />
</Transition>

.sidebar-enter-active { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.sidebar-leave-active { transition: opacity 130ms ease, transform 130ms ease; }
.sidebar-enter-from { opacity: 0; transform: translateX(-14px); }
.sidebar-leave-to   { opacity: 0; transform: translateX(14px); }`

const codeMenu = `.plus-menu-enter-active {
  transition: opacity 170ms ease-out, transform 170ms ease-out;
  transform-origin: top right;
}
.plus-menu-leave-active {
  transition: opacity 120ms ease-in, transform 120ms ease-in;
  transform-origin: top right;
}
.plus-menu-enter-from,
.plus-menu-leave-to { opacity: 0; transform: scale(0.95) translateY(-6px); }`

const codeTooltip = `.nav-tooltip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.nav-tooltip-leave-active { transition: opacity 100ms ease-in; }
.nav-tooltip-enter-from { opacity: 0; transform: translateX(-4px); }
.nav-tooltip-leave-to   { opacity: 0; }`

const codeAccordion = `.submenu {
  display: grid;
  grid-template-rows: 0fr;          /* closed */
  transition: grid-template-rows 200ms ease-out;
}
.submenu--open { grid-template-rows: 1fr; }
.submenu > .inner { overflow: hidden; min-height: 0; }

/* chevron */
.chevron { transition: transform 200ms; }
.chevron--open { transform: rotate(90deg); }`

const codeReveal = `.intro-reveal {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 600ms cubic-bezier(0.32, 0.72, 0, 1);
}
.intro-reveal--open { grid-template-rows: 1fr; }
.intro-reveal__inner { min-height: 0; overflow: hidden; }

@media (prefers-reduced-motion: reduce) { .intro-reveal { transition: none; } }`

const codeModal = `.modal-backdrop-enter-active { transition: opacity 220ms ease-out; }
.modal-backdrop-leave-active { transition: opacity 160ms ease-in; }

.modal-panel-enter-active {
  transition: opacity 240ms ease-out,
              transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1);
}
.modal-panel-leave-active { transition: opacity 160ms ease-in, transform 160ms ease-in; }
.modal-panel-enter-from, .modal-panel-leave-to { opacity: 0; transform: scale(0.96) translateY(8px); }`

const codePanel = `<div :style="{
  width: open ? '360px' : '0px',
  transition: 'width 280ms cubic-bezier(0.4, 0, 0.2, 1)',
}">
  <AgentPanel />
</div>
<!-- the flex sibling (main card) reflows to fill the freed space -->`

const codeRise = `.chat-input.is-shown {
  animation: chat-rise 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes chat-rise {
  from { opacity: 0; transform: translateY(12px) scaleX(0.85); }
  to   { opacity: 1; transform: translateY(0)    scaleX(1);    }
}
@media (prefers-reduced-motion: reduce) { .chat-input.is-shown { animation: none; } }`
</script>

<style scoped>
.motion-page { color: #03102f; }

/* Back to home */
.back-home {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #61667c;
  padding: 6px 4px;
  border-radius: 6px;
  transition: color 150ms ease, transform 150ms ease;
}
.back-home:hover { color: #2364dd; transform: translateX(-2px); }

/* Section scaffolding — centered */
.section-title { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #8093b8; margin-bottom: 4px; text-align: center; }
.section-sub { font-size: 13.5px; line-height: 1.55; color: #61667c; max-width: 640px; margin: 0 auto 22px; text-align: center; }

/* Principles */
.principle-card {
  background: #fcfcfd;
  border: 1px solid #eef0f4;
  border-radius: 12px;
  padding: 16px;
  transition: box-shadow 200ms ease-out, transform 200ms ease-out;
}
.principle-card:hover {
  box-shadow: 0px 3px 22px 0px rgba(37, 41, 49, 0.06);
  transform: translateY(-2px);
}
.principle-icon { width: 28px; height: 28px; color: #2364dd; margin-bottom: 10px; }
.principle-icon :deep(svg) { width: 100%; height: 100%; }

/* Easing cards */
.easing-card {
  background: #fff;
  border: 1px solid #e9ebf0;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 200ms ease-out;
}
.easing-card:hover { border-color: #cdd5e4; box-shadow: 0px 3px 22px 0px rgba(37, 41, 49, 0.05); }

.bezier-wrap { background: #f8f9fc; border-radius: 8px; padding: 10px; }
.bezier-svg { width: 100%; height: 78px; overflow: visible; display: block; }
.bezier-axis { stroke: #d6dbe6; stroke-width: 1; }
.bezier-grid { stroke: #e8ebf2; stroke-width: 1; stroke-dasharray: 2 3; }
.bezier-curve { fill: none; stroke: #2364dd; stroke-width: 2.5; stroke-linecap: round; }
.bezier-anchor { fill: #2364dd; }

.ease-track {
  position: relative;
  height: 12px;
  margin-top: 12px;
  background: #f0f1f5;
  border-radius: 999px;
}
.ease-dot {
  position: absolute;
  top: 1px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #2364dd;
  box-shadow: 0 1px 3px rgba(35, 100, 221, 0.5);
}

/* Duration table */
.duration-table { border: 1px solid #e9ebf0; border-radius: 12px; overflow: hidden; }
.duration-head, .duration-row {
  display: grid;
  grid-template-columns: 96px 64px 1fr 2fr;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
}
.duration-head {
  background: #f8f9fc;
  font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #8093b8;
  border-bottom: 1px solid #eef0f4;
}
.duration-row { border-bottom: 1px solid #f3f4f7; }
.duration-row:last-child { border-bottom: 0; }
.duration-row:hover { background: #fbfcfe; }
.dur-bar-col { display: flex; }
.dur-bar {
  position: relative;
  height: 6px;
  background: #dbe3f5;
  border-radius: 999px;
  overflow: hidden;
}
.dur-sweep {
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg, transparent, #2364dd, transparent);
  transform: translateX(-120%);
}
.duration-row:hover .dur-sweep { animation: dur-sweep 0.9s ease-out; }
@keyframes dur-sweep { to { transform: translateX(280%); } }

/* NOTE: PatternCard styling lives in the non-scoped block below — its DOM is
   built with h() in a render function, so scoped styles never reach it. */

/* ── Demo widgets ──────────────────────────────────────────── */
.demo-stage { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
.demo-btn {
  font-size: 12px; font-weight: 500; color: #fff;
  background: #2364dd; border-radius: 6px; padding: 6px 12px;
  transition: background 150ms ease;
}
.demo-btn:hover { background: #1c54bd; }

/* 1 swap */
.demo-swap-panel {
  width: 150px; height: 56px; border-radius: 8px;
  background: #fff; border: 1px solid #e5e6ea;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  box-shadow: 0px 1px 8px rgba(37, 41, 49, 0.06);
}
.demo-swap-enter-active { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.demo-swap-leave-active { transition: opacity 130ms ease, transform 130ms ease; }
.demo-swap-enter-from { opacity: 0; transform: translateX(-14px); }
.demo-swap-leave-to { opacity: 0; transform: translateX(14px); }

/* 2 menu */
.demo-menu {
  position: absolute; top: calc(100% + 6px); right: 0;
  width: 150px; background: #fff; border: 1px solid #e5e6ea; border-radius: 8px;
  padding: 4px; box-shadow: 0px 8px 24px rgba(3, 16, 47, 0.12); z-index: 5;
}
.demo-menu-item { font-size: 12px; color: #03102f; padding: 6px 8px; border-radius: 5px; }
.demo-menu-item:hover { background: rgba(0, 39, 113, 0.05); }
.demo-menu-enter-active { transition: opacity 170ms ease-out, transform 170ms ease-out; transform-origin: top right; }
.demo-menu-leave-active { transition: opacity 120ms ease-in, transform 120ms ease-in; transform-origin: top right; }
.demo-menu-enter-from, .demo-menu-leave-to { opacity: 0; transform: scale(0.95) translateY(-6px); }

/* 3 tooltip */
.demo-icon-btn {
  width: 36px; height: 36px; border-radius: 8px; background: #fff; border: 1px solid #e5e6ea;
  display: flex; align-items: center; justify-content: center;
}
.demo-icon-btn :deep(svg) { width: 20px; height: 20px; }
.demo-tip {
  position: absolute; left: calc(100% + 8px); top: 50%; transform: translateY(-50%);
  white-space: nowrap; font-size: 11px; color: #03102f;
  background: #fff; border: 1px solid #e5e6ea; border-radius: 6px; padding: 4px 8px;
  box-shadow: 0px 4px 12px rgba(3, 16, 47, 0.1);
}
.demo-tip-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; }
.demo-tip-leave-active { transition: opacity 100ms ease-in; }
.demo-tip-enter-from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
.demo-tip-leave-to { opacity: 0; }

/* 4 accordion */
.demo-row {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff; border: 1px solid #e5e6ea; border-radius: 8px; padding: 10px 12px; width: 200px;
}
.demo-chev { width: 16px; height: 16px; transition: transform 200ms; }
.demo-chev :deep(svg) { width: 100%; height: 100%; }
.demo-acc { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms ease-out; width: 200px; }
.demo-sub { font-size: 12px; color: #61667c; padding: 6px 12px 0; }

/* 5 reveal */
.demo-reveal { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 600ms cubic-bezier(0.32, 0.72, 0, 1); }
.demo-reveal--open { grid-template-rows: 1fr; }
.demo-reveal-inner { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding-top: 4px; }
.demo-stat {
  background: #fff; border: 1px solid #e5e6ea; border-radius: 8px; padding: 10px;
  display: flex; flex-direction: column; gap: 2px;
}

/* 6 modal */
.demo-modal-stage { position: relative; overflow: hidden; min-height: 150px; }
.demo-backdrop { position: absolute; inset: 0; background: rgba(3, 16, 47, 0.28); backdrop-filter: blur(2px); z-index: 1; }
.demo-modal {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 180px; padding: 16px; border-radius: 12px; background: #fff; z-index: 2;
  display: flex; flex-direction: column; gap: 3px; align-items: center;
  box-shadow: 0px 24px 48px -8px rgba(3, 16, 47, 0.28);
}
.demo-mb-enter-active { transition: opacity 220ms ease-out; }
.demo-mb-leave-active { transition: opacity 160ms ease-in; }
.demo-mb-enter-from, .demo-mb-leave-to { opacity: 0; }
.demo-mp-enter-active { transition: opacity 240ms ease-out, transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1); }
.demo-mp-leave-active { transition: opacity 160ms ease-in, transform 160ms ease-in; }
.demo-mp-enter-from, .demo-mp-leave-to { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }

/* 7 panel push */
.demo-push-row { display: flex; gap: 4px; height: 70px; }
.demo-push-main { flex: 1; background: #fff; border: 1px solid #e5e6ea; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #61667c; }
.demo-push-side {
  background: #002771; border-radius: 8px; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* 8 rise */
.demo-rise {
  font-size: 13px; color: #61667c;
  background: #fff; border: 1px solid #e5e6ea; border-radius: 12px; padding: 12px 16px;
  animation: demo-rise 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
  transform-origin: center;
}
@keyframes demo-rise {
  from { opacity: 0; transform: translateY(12px) scaleX(0.85); }
  to { opacity: 1; transform: translateY(0) scaleX(1); }
}

/* header pulse */
.motion-pulse { animation: motion-pulse 1.8s ease-in-out infinite; }
@keyframes motion-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

@media (prefers-reduced-motion: reduce) {
  .demo-rise, .motion-pulse, .dur-sweep { animation: none !important; }
  .demo-reveal, .demo-acc, .demo-push-side, .ease-dot { transition: none !important; }
}
</style>

<!-- Non-scoped: PatternCard is a render-function component, so its h()-built
     DOM doesn't receive this file's scoped attribute. Namespaced under
     .motion-page so the rules stay contained to this page. -->
<style>
.motion-page .pattern-card {
  background: #fff;
  border: 1px solid #e9ebf0;
  border-radius: 12px;
  padding: 18px 20px;
}
.motion-page .pattern-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.motion-page .code-toggle {
  font-size: 11px; font-weight: 500;
  color: #2364dd;
  padding: 4px 10px;
  border: 1px solid #dbe3f5;
  border-radius: 6px;
  white-space: nowrap;
  transition: background 150ms ease;
}
.motion-page .code-toggle:hover { background: #eef2ff; }

.motion-page .pattern-body { display: grid; grid-template-columns: 1fr 300px; gap: 20px; margin-top: 4px; }
@media (max-width: 760px) { .motion-page .pattern-body { grid-template-columns: 1fr; } }

.motion-page .pattern-demo {
  background: #f8f9fc;
  border: 1px solid #eef0f4;
  border-radius: 10px;
  min-height: 140px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.motion-page .pattern-spec {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-self: start;
  background: #fbfcfe;
  border: 1px solid #eef0f4;
  border-radius: 10px;
  padding: 4px 14px;
}
.motion-page .spec-row {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 16px;
  align-items: baseline;
  padding: 9px 0;
  border-bottom: 1px solid #eef0f4;
}
.motion-page .spec-row:last-child { border-bottom: 0; }
.motion-page .spec-key {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8093b8;
}
.motion-page .spec-val {
  font-size: 12px;
  color: #03102f;
  font-family: 'Reddit Mono', ui-monospace, monospace;
  line-height: 1.5;
  word-break: break-word;
}

.motion-page .code-block {
  margin-top: 16px;
  background: #03102f;
  color: #cdd9f5;
  border-radius: 10px;
  padding: 16px;
  font-size: 11.5px;
  line-height: 1.6;
  font-family: 'Reddit Mono', ui-monospace, monospace;
  overflow-x: auto;
  white-space: pre;
}
</style>
