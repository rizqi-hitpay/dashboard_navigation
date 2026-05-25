# HitPay Dashboard Navigation — Claude Guide

## Project overview

A Vue 3 prototype of the redesigned HitPay dashboard navigation. It demonstrates a collapsible sidebar, multi-product nav rail (Payments / Commerce / Finance), quick-action `+` menus, an AI Agent panel, and an animated intro modal that plays a pre-recorded WebM walkthrough.

The app is a **pure frontend prototype** — no backend, no auth, no real data. All state is held in composables; content components render hardcoded mock data.

---

## Commands

```bash
npm run dev        # dev server → http://localhost:5173 (or 5174 if port busy)
npm run build      # production build → dist/
npm run preview    # preview the build locally

node scripts/record-intro.cjs   # record intro-animation.html → public/intro-video.webm (22 s)
```

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vue 3 (`<script setup>`, Composition API) |
| Build | Vite 6 |
| Styling | Tailwind CSS 3 + scoped `<style>` blocks |
| Font | Inter (all UI) · JetBrains Mono (Agent panel numbers) |
| Video recording | Playwright (headless Chrome, `scripts/record-intro.cjs`) |
| Deployment | Vercel |

---

## Directory structure

```
src/
├── App.vue                          # Root — mounts DashboardLayout
├── main.js
├── intro-animation.html             # Standalone animation recorded to WebM
│
├── assets/
│   ├── main.css                     # Tailwind base imports
│   ├── icons/                       # 63 SVG icons (imported as URLs in components)
│   └── images/                      # promo-invoice.webp, promo-payment-links.webp
│
├── components/
│   ├── layout/
│   │   └── DashboardLayout.vue      # Top-level shell: NavRail + sidebar + content + Agent panel
│   │
│   ├── navigation/
│   │   ├── NavRail.vue              # 81 px left rail — product switcher + utilities
│   │   ├── NavRailItem.vue          # Single rail icon button
│   │   ├── Sidebar.vue              # Payments sidebar menu
│   │   ├── CommerceSidebar.vue      # Commerce sidebar menu
│   │   ├── FinanceSidebar.vue       # Finance sidebar menu
│   │   ├── SettingsSidebar.vue      # Settings drill-down sidebar
│   │   ├── SidebarMenuItem.vue      # Reusable menu row (icon + label + optional submenu)
│   │   ├── SidebarAccountWidget.vue # Bottom-of-sidebar account row
│   │   ├── PlusMenu.vue             # Floating quick-action dropdown (anchored to + button)
│   │   ├── NavBadge.vue             # Notification badge chip
│   │   └── AccountMenu.vue          # Account popover
│   │
│   ├── content/
│   │   ├── OverviewContent.vue      # Main content area — stats, charts, tables
│   │   ├── OverviewCard.vue         # Single KPI stat card
│   │   ├── DonutChart.vue           # SVG donut chart
│   │   ├── DonutChartCard.vue       # Donut chart wrapped in a card
│   │   ├── SalesBarChart.vue        # SVG bar chart
│   │   ├── RecentTransactionsTable.vue
│   │   ├── RecentPayoutsTable.vue
│   │   └── AskAgentPanel.vue        # AI Agent side panel (360 px, slides in from right)
│   │
│   └── modals/
│       └── VideoIntroModal.vue      # "What's new" modal — plays intro-video.webm
│
└── composables/
    ├── useNav.js                    # activeProduct (0=Payments, 1=Commerce, 2=Finance)
    ├── useSidebarCollapsed.js       # sidebarCollapsed, sidebarHovered, sidebarPinned, sidebarExpanded
    ├── useSidebarActiveItem.js      # activeItems.{payments,commerce,finance,settings}
    ├── useAgentPanel.js             # agentPanelOpen (boolean ref)
    ├── useSettingsPanel.js          # settingsOpen (boolean ref)
    └── useIntroModal.js             # introModalOpen (boolean ref, starts true)

scripts/
└── record-intro.cjs                 # Playwright recorder for the intro animation

public/
└── intro-video.webm                 # Pre-recorded 22 s animation (1280×720 @2x)
```

---

## State architecture

All shared state lives in composables as module-level `ref`s — no Pinia/Vuex. Composables are imported directly where needed.

```
useNav            → activeProduct          → NavRail reads/writes; DashboardLayout picks sidebar component
useSidebarCollapsed → sidebarCollapsed      → DashboardLayout width transition; Sidebar reads sidebarExpanded
                    → sidebarHovered        → DashboardLayout hover overlay visibility
                    → sidebarPinned         → Keeps overlay open while PlusMenu is open
                    → sidebarExpanded       → Computed: !collapsed || hovered || pinned
useSidebarActiveItem → activeItems          → Per-product active menu item refs
useAgentPanel     → agentPanelOpen          → DashboardLayout shows/hides Agent card
useSettingsPanel  → settingsOpen            → DashboardLayout switches to SettingsSidebar
useIntroModal     → introModalOpen          → VideoIntroModal v-model
```

---

## Layout mechanics

### Sidebar collapse
`DashboardLayout` controls a persistent 56 px icon-strip sidebar and an absolute 220 px hover overlay:
- Collapsed: strip shows icons only (56 px), overlay slides in on hover
- Expanded: strip is 220 px, no overlay
- `sidebarPinned` keeps overlay open when PlusMenu is showing

### Agent panel
Slides in as a **separate card** to the right of the main card, animated by `width` transition (`0 → 360 px`). The main card shrinks because the parent flex container distributes space.

### Product switching
`NavRail` writes `activeProduct`. `DashboardLayout` picks the sidebar component with a `computed` + `<component :is>`. A direction-aware `<Transition>` (`sidebar` vs `settings` named transitions) handles the slide animation.

---

## Tailwind conventions

Custom HitPay color tokens (defined in `tailwind.config.js`):

| Token | Hex | Usage |
|---|---|---|
| `hp-primary` | `#03102f` | Text, headings, dark backgrounds |
| `hp-blue` | `#2364dd` | Active states, CTAs, links |
| `hp-brand` | `#002771` | Nav rail background |
| `hp-secondary` | `#61667c` | Secondary text |
| `hp-section` | `#8093b8` | Section header labels |
| `hp-section-alt` | `#a6b3cd` | Lighter section labels |
| `hp-bg` | `#f8f9fc` | Page background |
| `hp-sidebar` | `#fcfcfd` | Sidebar background |
| `hp-muted` | `#4c689c` | Muted nav text |

Use Tailwind utilities for layout/spacing. Use inline `style` for precise values not in the Tailwind scale (box-shadows, specific pixel dimensions, brand colors in SVG context).

---

## Intro animation & video

`src/intro-animation.html` is a **self-contained HTML file** (no Vue, no build step). It runs in a browser directly and is recorded by Playwright.

### Animation sequence (22 s total)
| Time | Event |
|---|---|
| 0–5 s | Payments sidebar visible; cursor clicks `+`, dropdown opens, hovers items |
| 5–10 s | Commerce sidebar switches in |
| 10–13 s | Finance sidebar switches in |
| 13 s+ | Agent panel slides in; chat message + stat boxes appear |

### Re-recording the video
After editing `intro-animation.html`, run:
```bash
node scripts/record-intro.cjs
```
Output: `public/intro-video.webm` (overwrites in place). The recorder waits 1500 ms for Google Fonts (Inter + JetBrains Mono) to load before recording starts.

### Key coordinates inside the animation (nav-panel-relative, 520×580)
- Nav-rail width: 81 px (sidebar content starts at x=81)
- Plus button center: `(492, 24)`
- Plus dropdown item rows: `(396, 64)` / `(396, 94)`
- Agent nav-util center: `(40, 446)`

---

## Component patterns

### Icons
Icons are imported as URL strings and used in `<img>`:
```vue
import plusIcon from '../../assets/icons/icon-plus.svg'
<img :src="plusIcon" width="16" height="16" />
```
SVG icons inside the nav rail / animation are inlined directly.

### SidebarMenuItem
Accepts: `icon` (URL), `label`, `active`, `expandable`, `submenuItems[]`.
Active state and click are managed by `activeItems` composable — the sidebar passes the ref in, SidebarMenuItem emits `click`.

### PlusMenu
Floating dropdown anchored to a `ref` element. Uses `v-if` + `Teleport to="body"` pattern. Receives `items[]` with `{ label, shortcut: [key, key] }`. Parent sets `sidebarPinned` while the menu is open.

### VideoIntroModal
- `v-model` bound to `introModalOpen`
- Video autoplays/pauses/resets via `watch(modelValue)`
- Falls back to an animated placeholder when `videoSrc` is empty
- `featureItems` array drives the 4-row feature list (icon SVG inline via `v-html`)

---

## Design tokens (raw values used in inline styles)

```
Shadows (card):   0px 3px 22px 0px rgba(37,41,49,0.08)
Shadows (modal):  0px 24px 48px -8px rgba(3,16,47,0.28), 0px 0px 0px 1px rgba(3,16,47,0.06)
Backdrop blur:    blur(6px)
Border radius:    8px (cards), 12px (modal), 16px (animation cards)
Sidebar width:    220px expanded · 56px collapsed
Nav rail width:   81px
Agent panel:      360px
Transition:       250ms cubic-bezier(0.4, 0, 0.2, 1) (sidebar width)
                  280ms cubic-bezier(0.4, 0, 0.2, 1) (agent panel width)
```

---

## Git

Branch: `main`. Commit directly to main for this prototype — no PR workflow required.
