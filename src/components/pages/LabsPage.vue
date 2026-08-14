<template>
  <!-- HitPay Labs — app directory (Figma: HitPay-Labs 1:11620) -->
  <!-- Full-page wash: cool blue → warm cream → white (Figma: 15:24638) -->
  <div
    class="relative flex flex-col h-full w-full overflow-y-auto overflow-x-hidden"
    style="background: linear-gradient(180deg, #f0f6f8 0%, #fbfaf2 36%, #ffffff 100%);"
  >
    <!-- 2-apps preview: Submit yours moves up here since the Labs sidebar is hidden (Figma: 1:17127) -->
    <button
      v-if="labsFewApps"
      type="button"
      class="absolute top-[16px] right-[24px] z-10 flex items-center gap-[6px] h-[32px] px-[8px] rounded-[8px] transition-colors duration-150 hover:bg-[rgba(36,101,222,0.06)]"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.2v9.6M3.2 8h9.6" stroke="#2465de" stroke-width="1.4" stroke-linecap="round" /></svg>
      <span class="text-[14px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">Submit yours</span>
    </button>
    <div class="flex flex-1 flex-col items-start w-full">

      <!-- Page title — centered hero (Figma: 15:19071) -->
      <div class="flex flex-col items-center justify-center gap-[8px] p-[24px] w-full shrink-0">
        <div
          class="flex items-center justify-center p-[8px] rounded-[8px] overflow-hidden"
          style="background: linear-gradient(to bottom, #ffffff, #f8f8fb); box-shadow: 0px 3px 22px 0px rgba(38,42,50,0.09);"
        >
          <div class="flex items-center justify-center size-[39px]">
            <img :src="flaskIcon" width="32" height="32" alt="" style="transform: rotate(15deg);" />
          </div>
        </div>
        <div class="flex flex-col items-center gap-[8px] w-full">
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] text-center whitespace-nowrap">HitPay Labs</p>
          <p class="text-[13px] font-normal text-[#61667c] leading-[1.5] text-center">Free tools to help you run your business better. Curated by the HitPay team.</p>
        </div>

        <!-- Search — full directory only (Figma: 15:24642) -->
        <div v-if="!labsFewApps" class="pt-[12px]">
          <div class="labs-search flex items-center gap-[8px] w-[320px] h-[36px] px-[8px] bg-white rounded-[8px]">
            <img :src="searchIcon" width="16" height="16" alt="" class="shrink-0" />
            <input
              v-model="query"
              type="text"
              placeholder="Search app"
              class="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-[14px] text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
            />
            <img :src="arrowRightGreyIcon" width="16" height="16" alt="" class="shrink-0" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col gap-[40px] w-full px-[24px] pt-[8px] pb-[24px]">

        <!-- Featured apps -->
        <div v-if="visibleFeatured.length" class="flex items-start gap-[24px] w-full">
          <div
            v-for="app in visibleFeatured"
            :key="app.name"
            class="relative isolate flex-1 min-w-0 h-[250px] rounded-[8px] border border-[#e5e6ea] overflow-hidden cursor-pointer group"
            @click="openApp(app)"
          >
            <img :src="app.image" alt="" class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]" />
            <!-- rounded-b + own overflow clip: Safari's backdrop-filter ignores the
                 ancestor's rounded overflow-hidden, poking square corners out -->
            <div
              class="absolute inset-x-0 bottom-0 flex items-center gap-[8px] h-[64px] px-[16px] py-[8px] rounded-b-[7px] overflow-hidden"
              style="background: rgba(255,255,255,0.88); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
            >
              <div class="flex flex-1 min-w-0 flex-col gap-[4px]">
                <div class="flex items-center gap-[8px] w-full">
                  <p class="text-[14px] font-medium text-[#03102f] leading-[1.5] whitespace-nowrap">{{ app.name }}</p>
                  <img v-if="app.starred" :src="starFilledIcon" width="16" height="16" alt="Starred" class="shrink-0" />
                </div>
                <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] w-full whitespace-nowrap overflow-hidden text-ellipsis">{{ app.desc }}</p>
              </div>
              <div class="relative shrink-0 size-[40px] rounded-[10px] overflow-hidden">
                <img :src="appIconImg" alt="" class="absolute max-w-none" style="width: 133.33%; height: 129.73%; left: -16.67%; top: -13.51%;" />
              </div>
            </div>
          </div>
        </div>

        <!-- App sections — hidden in the 2-apps preview (Figma: 1:17127) -->
        <Transition name="labs-fade">
        <div v-if="!labsFewApps" class="flex flex-col gap-[40px] w-full">
        <div v-for="section in visibleSections" :key="section.title" class="flex flex-col w-full">
          <div class="flex items-center justify-between h-[40px] w-full">
            <p class="text-[16px] font-medium text-[#03102f] leading-[1.4]">{{ section.title }}</p>
            <button
              type="button"
              class="flex items-center gap-[6px] h-[28px] px-[8px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f4fd]"
              @click="openCategory(section)"
            >
              <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">View all</span>
              <img :src="arrowRightBlueIcon" width="16" height="16" alt="" class="shrink-0" />
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-[24px] gap-y-[12px] w-full pt-[8px]">
            <div
              v-for="(app, i) in section.apps"
              :key="i"
              class="flex items-center gap-[8px] h-[40px] w-full rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#fcfcfd]"
            >
              <!-- The icon asset carries transparent padding; the design crops it by
                   scaling to 133.33% inside the box (Figma: 1:11881) -->
              <div class="relative shrink-0 size-[40px] rounded-[10px] overflow-hidden">
                <img :src="appIconImg" alt="" class="absolute max-w-none" style="width: 133.33%; height: 129.73%; left: -16.67%; top: -13.51%;" />
              </div>
              <div class="flex flex-1 min-w-0 flex-col">
                <p class="flex items-center h-[20px] text-[13px] font-medium text-[#03102f] leading-[1.5] w-full whitespace-nowrap overflow-hidden text-ellipsis">{{ app.name }}</p>
                <p class="flex items-center h-[20px] text-[10px] font-medium uppercase text-[#61667c] tracking-[0.3px] w-full whitespace-nowrap overflow-hidden text-ellipsis" style="line-height: 18px;">By {{ app.author }}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
        </Transition>

      </div>
    </div>

    <!-- Floating preview switcher — same recipe as BillsPage -->
    <div
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-[4px] p-[4px] rounded-full bg-white border border-[#e5e6ea]"
      style="box-shadow: 0px 8px 24px rgba(3,16,47,0.16);"
    >
      <span class="px-[8px] text-[11px] font-medium text-[#8093b8] select-none">Preview</span>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="!labsFewApps ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="setFewApps(false)"
      >Full directory</button>
      <button
        type="button"
        class="px-[12px] h-[28px] rounded-full text-[12px] font-medium transition-colors duration-150"
        :class="labsFewApps ? 'bg-[#2465de] text-white' : 'text-[#61667c] hover:bg-[#f0f1f5]'"
        @click="setFewApps(true)"
      >2 apps</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { activeItems } from '../../composables/useSidebarActiveItem.js'
import { labsFewApps } from '../../composables/useLabsPreview.js'
import starFilledIcon from '../../assets/icons/icon-star-filled.svg'
import flaskIcon from '../../assets/icons/icon-flask-fill.svg'
import arrowRightBlueIcon from '../../assets/icons/icon-arrow-right-blue.svg'
import searchIcon from '../../assets/icons/icon-search-input.svg'
import arrowRightGreyIcon from '../../assets/icons/icon-arrow-right-grey.svg'
import appIconImg from '../../assets/images/labs-app-icon.png'
import featuredTodoImg from '../../assets/images/labs-featured-todo.png'
import featuredBlogImg from '../../assets/images/labs-featured-blog.png'

const featured = [
  {
    name: 'To-do list',
    desc: 'Help you organize your everyday tasks. No stress, all checked!',
    image: featuredTodoImg,
    starred: true,
  },
  {
    name: 'Blog generator',
    desc: 'Help you organize your everyday tasks. No stress, all checked!',
    image: featuredBlogImg,
    starred: false,
  },
]

const placeholderApps = Array.from({ length: 6 }, () => ({ name: 'App name here', author: 'Raymond Handoko' }))

const sections = [
  { title: 'Recently added apps', slug: 'recently-added', apps: placeholderApps },
  { title: 'Productivity apps', slug: 'productivity', sidebarItem: 'Productivity', apps: placeholderApps },
]

const router = useRouter()

// Live search across the directory
const query = ref('')
const matches = (text) => text.toLowerCase().includes(query.value.trim().toLowerCase())

const visibleFeatured = computed(() =>
  query.value.trim() ? featured.filter((a) => matches(a.name) || matches(a.desc)) : featured,
)

const visibleSections = computed(() => {
  if (!query.value.trim()) return sections
  return sections
    .map((s) => ({ ...s, apps: s.apps.filter((a) => matches(a.name) || matches(a.author)) }))
    .filter((s) => s.apps.length)
})

function openApp(app) {
  // Only the To-do list has a real app page for now
  if (app.name === 'To-do list') {
    activeItems.labs.value = 'To-do list'
    router.push('/labs/app/to-do-list')
  }
}

function openCategory(section) {
  // Highlight the matching sidebar item when the category has one
  if (section.sidebarItem) activeItems.labs.value = section.sidebarItem
  router.push('/labs/' + section.slug)
}

// 2-apps preview keeps the Payments sidebar with Labs highlighted; the full
// directory swaps back to the Labs drill-down sidebar (Figma: 1:17127)
function setFewApps(on) {
  labsFewApps.value = on
  activeItems.payments.value = on ? 'Labs' : null
}
</script>

<style scoped>
/* Search input — standard recipe with focus ring on the wrapper */
.labs-search {
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.labs-search:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
}

/* Full directory ↔ 2-apps swap (same motion as the Bills preview switcher) */
.labs-fade-enter-active { transition: opacity 220ms ease-out, transform 220ms ease-out; }
.labs-fade-leave-active { transition: opacity 130ms ease-in, transform 130ms ease-in; }
.labs-fade-enter-from { opacity: 0; transform: translateY(8px); }
.labs-fade-leave-to { opacity: 0; transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) {
  .labs-fade-enter-active, .labs-fade-leave-active { transition: none; }
  .labs-fade-enter-from, .labs-fade-leave-to { transform: none; }
}
</style>
