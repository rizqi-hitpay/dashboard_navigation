<template>
  <div class="bg-white flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
    <!-- HitPay Labs — app page (Figma: HitPay-Labs 1:16941). The design's image
         placeholder is replaced with a working to-do app built on our tokens. -->
    <div class="flex flex-1 flex-col items-start w-full pt-[4px]">

      <!-- Page title + actions -->
      <div class="flex items-center justify-between gap-[32px] px-[24px] py-[12px] w-full shrink-0">
        <div class="flex flex-col gap-[4px] min-w-0">
          <p class="font-medium text-[18px] text-[#03102f] leading-[1.35] whitespace-nowrap">To-do list</p>
          <p class="text-[12px] font-normal text-[#61667c] leading-[1.5] whitespace-nowrap">By Raymond Handoko</p>
        </div>
        <div class="flex items-center gap-[8px] shrink-0">
          <!-- Star: secondary button when unstarred → ghost with amber star when starred (Figma: 1:17562) -->
          <button
            v-if="!starred"
            type="button"
            class="flex items-center justify-center gap-[6px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            @click="starred = true"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.9l1.85 3.75 4.14.6-3 2.92.71 4.13L8 11.35l-3.7 1.95.71-4.13-3-2.92 4.14-.6L8 1.9z" stroke="#61667c" stroke-width="1.3" stroke-linejoin="round" />
            </svg>
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Star</span>
          </button>
          <button
            v-else
            type="button"
            class="flex items-center justify-center gap-[6px] h-[36px] px-[12px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f1f5]"
            @click="starred = false"
          >
            <img :src="starFilledIcon" width="18" height="18" alt="" class="shrink-0" />
            <span class="text-[14px] font-medium text-[#484d61] leading-[1.5] whitespace-nowrap">Starred</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-[6px] h-[36px] px-[12px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f1f5]"
            @click="close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8m0-8l-8 8" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
            <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap">Close</span>
          </button>
        </div>
      </div>

      <!-- App stage — replaces the design's image placeholder -->
      <div class="flex flex-1 w-full px-[24px] pb-[24px] min-h-0">
        <div class="flex flex-1 items-center justify-center min-h-[520px] rounded-[8px] border border-[#e5e6ea] bg-[#f8f9fc] p-[24px] overflow-hidden">

          <!-- The to-do app window -->
          <div
            class="todo-window flex w-full max-w-[820px] h-[480px] bg-white rounded-[8px] border border-[#e5e6ea] overflow-hidden"
            style="box-shadow: 0px 3px 22px 0px rgba(37,41,49,0.08);"
          >
            <!-- Lists rail -->
            <div class="flex flex-col w-[190px] shrink-0 bg-[#fcfcfd] border-r border-[#f2f2f4] py-[12px] px-[8px] gap-[2px]">
              <button
                v-for="list in lists"
                :key="list.name"
                type="button"
                class="flex items-center gap-[8px] px-[8px] py-[4px] rounded-[4px] w-full text-left transition-colors duration-150"
                :class="activeList === list.name ? 'bg-[rgba(0,39,113,0.04)]' : 'hover:bg-[rgba(0,39,113,0.04)]'"
                @click="activeList = list.name"
              >
                <svg v-if="list.kind === 'folder'" class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.8 4.2c0-.9.7-1.6 1.6-1.6h2l1.2 1.3h4c.9 0 1.6.7 1.6 1.6v4.3c0 .9-.7 1.6-1.6 1.6H3.4c-.9 0-1.6-.7-1.6-1.6V4.2z" stroke="#8093b8" stroke-width="1.1" /></svg>
                <svg v-else class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4.6 3.9h7M4.6 7h7M4.6 10.1h7" stroke="#8093b8" stroke-width="1.1" stroke-linecap="round" /><circle cx="2.4" cy="3.9" r="0.8" fill="#8093b8" /><circle cx="2.4" cy="7" r="0.8" fill="#8093b8" /><circle cx="2.4" cy="10.1" r="0.8" fill="#8093b8" /></svg>
                <span
                  class="flex-1 min-w-0 text-[13px] leading-[1.5] truncate"
                  :style="{ color: activeList === list.name ? '#03102f' : '#61667c', fontWeight: activeList === list.name ? 500 : 400 }"
                >{{ list.name }}</span>
              </button>
            </div>

            <!-- Tasks pane -->
            <div class="flex flex-1 min-w-0 flex-col px-[24px] py-[20px] overflow-y-auto">
              <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] pb-[12px]">{{ activeList }}</p>

              <div class="relative flex flex-col w-full">
                <TransitionGroup name="todo">
                  <div
                    v-for="task in tasks"
                    :key="task.id"
                    class="todo-row group flex items-center gap-[10px] w-full py-[6px]"
                  >
                    <button
                      type="button"
                      class="todo-check flex items-center justify-center shrink-0 size-[16px] rounded-full border"
                      :class="task.done ? 'todo-check--done bg-[#2465de] border-[#2465de]' : 'border-[#cbcdd4] hover:border-[#2465de] bg-white'"
                      @click="task.done = !task.done"
                    >
                      <svg v-if="task.done" width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.6 4.7l2 2 3.8-4.4" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </button>
                    <span
                      class="flex-1 min-w-0 text-[13px] leading-[1.5] truncate transition-colors duration-200"
                      :class="task.done ? 'line-through text-[#9295a5]' : 'text-[#03102f]'"
                    >{{ task.label }}</span>
                    <button
                      type="button"
                      class="flex items-center justify-center shrink-0 size-[18px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-[#f0f1f5]"
                      aria-label="Remove task"
                      @click="removeTask(task.id)"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6m0-6l-6 6" stroke="#9295a5" stroke-width="1.2" stroke-linecap="round" /></svg>
                    </button>
                  </div>
                </TransitionGroup>

                <!-- Add task -->
                <div class="flex items-center gap-[10px] w-full py-[6px]">
                  <span class="shrink-0 size-[16px] rounded-full border border-dashed border-[#cbcdd4]" />
                  <input
                    v-model="draft"
                    type="text"
                    placeholder="Add a task or press 'space' to activate the Autopilot..."
                    class="flex-1 min-w-0 bg-transparent border-none outline-none text-[13px] text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
                    @keyup.enter="addTask"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { activeItems } from '../../composables/useSidebarActiveItem.js'
import starFilledIcon from '../../assets/icons/icon-star-filled.svg'

const router = useRouter()
const starred = ref(true)

function close() {
  activeItems.labs.value = 'All apps'
  router.push('/labs')
}

// ── The to-do app ──
const lists = [
  { name: 'Priority', kind: 'folder' },
  { name: 'Projects', kind: 'folder' },
  { name: 'Personal', kind: 'folder' },
  { name: 'Work', kind: 'folder' },
  { name: 'Today', kind: 'list' },
  { name: 'Next Week', kind: 'list' },
  { name: 'New brand Identity', kind: 'list' },
  { name: 'Share your work', kind: 'list' },
]

const activeList = ref('Today')

let nextId = 4
const tasksByList = reactive({
  Today: [
    { id: 1, label: 'Master the art of speaking llama language.', done: false },
    { id: 2, label: 'Conquer Mount Everest using a pogo stick.', done: false },
    { id: 3, label: 'Bake a cake made entirely of rainbows and unicorns.', done: false },
  ],
})

const tasks = computed(() => {
  if (!tasksByList[activeList.value]) tasksByList[activeList.value] = []
  return tasksByList[activeList.value]
})

const draft = ref('')

function addTask() {
  const label = draft.value.trim()
  if (!label) return
  tasks.value.push({ id: nextId++, label, done: false })
  draft.value = ''
}

function removeTask(id) {
  const list = tasks.value
  const i = list.findIndex((t) => t.id === id)
  if (i !== -1) list.splice(i, 1)
}
</script>

<style scoped>
/* Check bubble pops on completion — same back-out feel as the card motion */
.todo-check {
  transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.todo-check--done {
  animation: todo-pop 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes todo-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.18); }
  100% { transform: scale(1); }
}

/* Task list motion — enter rises in, leave fades, siblings glide (motion guide timings) */
.todo-enter-active { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.todo-leave-active { transition: opacity 130ms ease-in; position: absolute; width: 100%; }
.todo-enter-from { opacity: 0; transform: translateY(4px); }
.todo-leave-to { opacity: 0; }
.todo-move { transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1); }

@media (prefers-reduced-motion: reduce) {
  .todo-check,
  .todo-enter-active, .todo-leave-active, .todo-move { transition: none; }
  .todo-check--done { animation: none; }
  .todo-enter-from { transform: none; }
}
</style>
