<template>
  <div class="flex flex-1 flex-col gap-[24px] min-w-0">

    <!-- Section header -->
    <div class="flex items-center justify-between gap-[16px] w-full">
      <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Approval rules</p>
      <button
        v-if="rules.length"
        type="button"
        class="flex items-center justify-center gap-[6px] h-[36px] px-[12px] rounded-[8px] border border-[#f2f2f4] shrink-0 transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
        style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
        @click="openAdd"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
        <span class="text-[14px] font-medium text-[#61667c] leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Add rule</span>
      </button>
    </div>

    <!-- Rules list -->
    <div v-if="rules.length" class="flex flex-col gap-[12px] w-full">
      <div
        v-for="rule in rules"
        :key="rule.id"
        class="flex flex-col gap-[4px] justify-center w-full rounded-[8px] border border-[#e5e6ea] p-[16px]"
      >
        <div class="flex items-center gap-[24px] w-full">
          <p class="flex-1 min-w-px text-[14px] font-medium leading-[1.5]">
            <template v-for="(part, pi) in ruleTitle(rule)" :key="pi">
              <span :class="part.dark ? 'text-[#03102f]' : 'text-[#61667c]'">{{ part.t }}</span>
            </template>
          </p>
          <div class="relative shrink-0">
            <button
              type="button"
              class="flex items-center justify-center p-[2px] rounded-[8px] transition-colors duration-150 hover:bg-[#f0f1f5]"
              aria-label="Rule actions"
              @click.stop="menuRuleId = menuRuleId === rule.id ? null : rule.id"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="5.2" cy="11" r="1.5" fill="#61667c" /><circle cx="11" cy="11" r="1.5" fill="#61667c" /><circle cx="16.8" cy="11" r="1.5" fill="#61667c" /></svg>
            </button>
            <!-- Edit / Delete menu -->
            <Transition name="rule-menu">
              <div
                v-if="menuRuleId === rule.id"
                class="absolute right-0 top-[30px] z-30 w-[162px] rounded-[8px] bg-white overflow-hidden"
                style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.1), 0px 3px 22px 0px rgba(38,42,50,0.09);"
              >
                <div class="flex flex-col p-[4px] w-full">
                  <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100" @click="openEdit(rule)">
                    <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.2 2.6a1.4 1.4 0 012 2L5.4 12.4l-2.7.7.7-2.7 7.8-7.8z" stroke="#03102f" stroke-width="1.2" stroke-linejoin="round" /></svg>
                    <span class="flex-1 text-[12px] font-normal text-[#03102f] leading-[1.5]">Edit</span>
                  </button>
                  <button type="button" class="flex items-center gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#fdf2f3] transition-colors duration-100" @click="askDelete(rule)">
                    <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.8 4.3h10.4" stroke="#dc3545" stroke-width="1.2" stroke-linecap="round" /><path d="M5.7 4.3V3.1a.9.9 0 01.9-.9h2.8a.9.9 0 01.9.9v1.2" stroke="#dc3545" stroke-width="1.2" /><path d="M4.2 4.3l.5 8.2a1.2 1.2 0 001.2 1.1h4.2a1.2 1.2 0 001.2-1.1l.5-8.2" stroke="#dc3545" stroke-width="1.2" stroke-linecap="round" /></svg>
                    <span class="flex-1 text-[12px] font-normal text-[#dc3545] leading-[1.5]">Delete</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <div class="flex flex-col gap-[4px] w-full">
          <div v-for="(step, si) in rule.steps" :key="si" class="flex items-center gap-[4px] px-[4px] w-full">
            <svg class="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 2.5v3.2a3.3 3.3 0 003.3 3.3h4" stroke="#9295a5" stroke-width="1.2" stroke-linecap="round" /><path d="M8.7 6.9l2.3 2.1-2.3 2.1" stroke="#9295a5" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <p class="text-[13px] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">
              <span class="font-normal text-[#61667c]">Require approval from </span>
              <template v-for="(name, ni) in step" :key="ni">
                <span v-if="ni > 0" class="font-normal text-[#61667c]"> Or </span>
                <span class="font-medium text-[#03102f]">{{ name }}</span>
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center gap-[24px] py-[24px] w-full">
      <div class="relative flex items-start p-[16px] rounded-[60px] bg-[#fcfcfd] border border-[#f2f2f4]">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M8 4.5h10.5L25 11v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 017 26V6a1.5 1.5 0 011-1.5z" stroke="#9295a5" stroke-width="1.8" stroke-linejoin="round" /><path d="M18.5 4.8V11H25" stroke="#9295a5" stroke-width="1.8" stroke-linejoin="round" /><path d="M11.5 16h9M11.5 20.5h6" stroke="#9295a5" stroke-width="1.8" stroke-linecap="round" /></svg>
        <span class="absolute right-[-1px] top-[1px] flex items-center justify-center size-[20px] rounded-full bg-[#9295a5] border border-[#f2f2f4]">
          <span class="text-[12px] font-medium text-white leading-none">!</span>
        </span>
      </div>
      <div class="flex flex-col items-center gap-[8px] text-center w-full">
        <p class="text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">No approval rules</p>
        <p class="text-[14px] font-normal text-[#61667c] leading-[1.5]">Add new one to apply approval rules</p>
      </div>
      <button
        type="button"
        class="flex items-center justify-center gap-[6px] h-[28px] p-[8px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
        style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
        @click="openAdd"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5v9M3.5 8h9" stroke="#fff" stroke-width="1.4" stroke-linecap="round" /></svg>
        <span class="text-[12px] font-medium text-white leading-[1.5] whitespace-nowrap" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Add rule</span>
      </button>
    </div>

    <!-- Add / Edit rule modal -->
    <Teleport to="body">
      <Transition name="rule-modal">
        <div v-if="modalOpen" class="fixed inset-0 z-[70] flex items-start justify-center pt-[96px]" style="background: rgba(3, 16, 47, 0.32);" @click.self="closeModal">
          <div
            class="rule-modal__card w-[640px] max-w-[calc(100vw-48px)] bg-white rounded-[16px] flex flex-col"
            style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.09));"
          >
            <!-- header -->
            <div class="flex items-start gap-[16px] p-[16px] border-b border-[#e5e6ea] w-full">
              <p class="flex-1 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Add new approval rule</p>
              <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" @click="closeModal">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
              </button>
            </div>

            <!-- content -->
            <div class="flex flex-col gap-[12px] p-[24px] w-full">

              <!-- amounts -->
              <div class="flex flex-col gap-[8px] justify-center w-full rounded-[8px] border border-[#e5e6ea] px-[12px] py-[8px]">
                <p class="text-[14px] font-medium text-[#03102f] leading-[1.5]">If amount</p>
                <div class="flex items-center gap-[8px] w-full">
                  <p class="w-[160px] shrink-0 text-[14px] font-normal text-[#61667c] leading-[1.5]">is greater or equal to</p>
                  <div class="flex flex-1 flex-col gap-[4px] min-w-px">
                    <div class="amount-input" :class="{ 'amount-input--error': overlapError }">
                      <span class="flex items-center h-full pr-[8px] border-r border-[#e5e6ea] text-[12px] font-medium text-[#61667c] leading-[1.5] shrink-0">SGD</span>
                      <input v-model="form.min" type="text" inputmode="decimal" placeholder="0.00" @input="overlapError = false" />
                    </div>
                    <p v-if="overlapError" class="text-[12px] font-normal text-[#dc3545] leading-[1.5]">This overlap with other rule</p>
                  </div>
                </div>
                <div class="flex items-center gap-[8px] w-full">
                  <p class="w-[160px] shrink-0 text-[14px] font-normal text-[#61667c] leading-[1.5]">and less than</p>
                  <div class="amount-input flex-1">
                    <span class="flex items-center h-full pr-[8px] border-r border-[#e5e6ea] text-[12px] font-medium text-[#61667c] leading-[1.5] shrink-0">SGD</span>
                    <input v-model="form.max" type="text" inputmode="decimal" placeholder="No limit" />
                  </div>
                </div>
              </div>

              <!-- approval steps -->
              <div class="flex flex-col gap-[8px] w-full">
                <div v-for="(step, si) in form.steps" :key="si" class="flex items-center gap-[4px] pl-[4px] w-full">
                  <div class="flex items-start self-stretch pt-[2px] shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 2.5v3.2a3.3 3.3 0 003.3 3.3h4" stroke="#9295a5" stroke-width="1.2" stroke-linecap="round" /><path d="M8.7 6.9l2.3 2.1-2.3 2.1" stroke="#9295a5" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  </div>
                  <div class="flex flex-col justify-center shrink-0 whitespace-nowrap">
                    <p class="text-[10px] font-medium uppercase tracking-[0.3px] leading-[18px] text-[#61667c]">Step {{ si + 1 }}</p>
                    <p class="text-[14px] font-normal text-[#03102f] leading-[1.5]">Require approval from</p>
                  </div>
                  <div class="relative flex flex-1 flex-col min-w-px pl-[8px]">
                    <!-- selector field -->
                    <button
                      type="button"
                      class="approver-field"
                      @click="openStep = openStep === si ? null : si"
                    >
                      <template v-if="step.selected.length === 0">
                        <span class="flex-1 min-w-px text-left text-[14px] font-normal text-[#9295a5] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">Select users</span>
                      </template>
                      <template v-else-if="isAnyOption(step.selected[0])">
                        <span class="flex-1 min-w-px text-left text-[14px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap overflow-hidden text-ellipsis">{{ step.selected[0] }}</span>
                      </template>
                      <template v-else>
                        <span class="flex flex-1 flex-wrap items-center gap-[4px] min-w-px">
                          <template v-for="(name, ni) in step.selected" :key="name">
                            <span v-if="ni > 0" class="text-[12px] font-normal text-[#61667c] leading-[1.5]">Or</span>
                            <span class="flex items-center gap-[4px] min-h-[24px] px-[8px] py-[2px] rounded-[24px] bg-[#e5eeff]">
                              <span class="text-[12px] font-medium text-[#2465de] leading-[1.5] whitespace-nowrap">{{ name }}</span>
                              <span class="flex items-center justify-center shrink-0 cursor-pointer" @click.stop="toggleApprover(step, name)">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" fill="#2465de" /><path d="M6.7 6.7l4.6 4.6M11.3 6.7l-4.6 4.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round" /></svg>
                              </span>
                            </span>
                          </template>
                        </span>
                      </template>
                      <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </button>

                    <!-- users dropdown -->
                    <div
                      v-if="openStep === si"
                      class="approver-pop absolute left-[8px] right-0 top-[calc(100%+4px)] z-40 flex flex-col gap-[4px] p-[8px] rounded-[8px] bg-white border border-[#e5e6ea]"
                      style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.09));"
                    >
                      <div class="flex items-center gap-[8px] h-[36px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white" style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);">
                        <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="#61667c" stroke-width="1.4" /><path d="M10.5 10.5L14 14" stroke="#61667c" stroke-width="1.4" stroke-linecap="round" /></svg>
                        <input v-model="userSearch" type="text" placeholder="Search" class="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-[14px] font-normal text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]" />
                      </div>
                      <div class="flex flex-col gap-[4px] pb-[8px] max-h-[264px] overflow-y-auto">
                        <button
                          v-for="opt in filteredApprovers"
                          :key="opt.name"
                          type="button"
                          class="flex items-start gap-[8px] p-[8px] rounded-[4px] w-full text-left hover:bg-[#f5f6f9] transition-colors duration-100"
                          @click="toggleApprover(step, opt.name)"
                        >
                          <span class="flex items-center pt-[4px] shrink-0">
                            <span
                              class="flex items-center justify-center size-[16px] rounded-[4px] border transition-colors duration-100"
                              :class="step.selected.includes(opt.name) ? 'bg-[#2465de] border-[#2465de]' : 'bg-white border-[#e5e6ea]'"
                              style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);"
                            >
                              <svg v-if="step.selected.includes(opt.name)" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.2l2.4 2.4L9.5 3.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
                            </span>
                          </span>
                          <span class="flex-1 min-w-px text-[14px] font-normal text-[#03102f] leading-[1.5]">{{ opt.name }}</span>
                          <span
                            v-if="opt.role"
                            class="flex items-center justify-center min-h-[24px] min-w-[32px] px-[8px] py-[2px] rounded-[24px] shrink-0"
                            :style="{ background: roleChip(opt.role).bg }"
                          >
                            <span class="text-[12px] font-medium leading-[20px] text-center whitespace-nowrap" :style="{ color: roleChip(opt.role).text }">{{ opt.role }}</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- add another approver -->
                <button type="button" class="flex items-center gap-[4px] pl-[4px] pt-[8px] w-fit cursor-pointer group" @click="addStep">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="#61667c" stroke-width="1.3" stroke-linecap="round" /></svg>
                  <span class="text-[14px] font-normal text-[#61667c] leading-[1.5] underline group-hover:text-[#03102f] transition-colors duration-150">Add another approver</span>
                </button>
              </div>
            </div>

            <!-- footer -->
            <div class="flex items-center justify-end gap-[12px] px-[16px] py-[20px] border-t border-[#e5e6ea] w-full">
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="closeModal"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#2465de] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
                @click="saveRule"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Save</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <Transition name="rule-modal">
        <div v-if="deleteRule" class="fixed inset-0 z-[70] flex items-center justify-center" style="background: rgba(3, 16, 47, 0.32);" @click.self="deleteRule = null">
          <div class="rule-modal__card w-[320px] bg-white rounded-[16px] flex flex-col pb-[8px]" style="filter: drop-shadow(0px 3px 11px rgba(38,42,50,0.09));">
            <div class="flex items-start gap-[16px] p-[16px] w-full">
              <p class="flex-1 pt-[2px] text-[16px] font-medium text-[#03102f] leading-[1.4] whitespace-nowrap">Are you sure?</p>
              <button class="flex items-center justify-center size-[32px] rounded-[4px] shrink-0 transition-colors duration-150 hover:bg-[#f0f1f5]" @click="deleteRule = null">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#61667c" stroke-width="1.6" stroke-linecap="round" /></svg>
              </button>
            </div>
            <div class="flex flex-col items-center justify-center gap-[12px] p-[16px] w-full">
              <div class="flex items-start p-[12px] rounded-[100px]" style="background: rgba(196, 32, 33, 0.1);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.2 6.5h15.6" stroke="#dc3545" stroke-width="1.6" stroke-linecap="round" /><path d="M8.6 6.5V4.7a1.3 1.3 0 011.3-1.3h4.2a1.3 1.3 0 011.3 1.3v1.8" stroke="#dc3545" stroke-width="1.6" /><path d="M6.3 6.5l.75 12.3a1.8 1.8 0 001.8 1.7h6.3a1.8 1.8 0 001.8-1.7l.75-12.3" stroke="#dc3545" stroke-width="1.6" stroke-linecap="round" /><path d="M10 10.5v6M14 10.5v6" stroke="#dc3545" stroke-width="1.6" stroke-linecap="round" /></svg>
              </div>
              <p class="text-[14px] font-normal text-[#03102f] leading-[1.5] text-center w-full">Do you want to delete this rule? The action can't be undo.</p>
              <div class="flex flex-col gap-[4px] w-full">
                <div class="h-[20px]" />
                <div class="flex items-center gap-[8px] h-[36px] px-[8px] rounded-[8px] border border-[#e5e6ea] bg-white" style="box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);">
                  <input
                    v-model="deletePassword"
                    :type="deletePasswordVisible ? 'text' : 'password'"
                    placeholder="Enter HitPay password"
                    class="flex-1 min-w-0 h-full bg-transparent border-none outline-none text-[14px] font-normal text-[#03102f] leading-[1.5] placeholder:text-[#9295a5]"
                  />
                  <button type="button" class="flex items-center justify-center shrink-0 transition-opacity duration-150" :style="{ opacity: deletePasswordVisible ? 1 : 0.75 }" @click="deletePasswordVisible = !deletePasswordVisible">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.8 8s2.2-4.2 6.2-4.2S14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8z" stroke="#61667c" stroke-width="1.2" stroke-linejoin="round" /><circle cx="8" cy="8" r="1.9" stroke="#61667c" stroke-width="1.2" /></svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center gap-[12px] px-[16px] py-[20px] w-full">
              <button
                type="button"
                class="flex flex-1 items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#f2f2f4] transition-[filter] duration-150 hover:brightness-95 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
                @click="deleteRule = null"
              >
                <span class="text-[14px] font-medium text-[#61667c] leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Cancel</span>
              </button>
              <button
                type="button"
                class="flex flex-1 items-center justify-center h-[36px] min-w-[112px] px-[12px] rounded-[8px] border border-[#dc3545] transition-[filter] duration-150 hover:brightness-105 active:translate-y-[1px]"
                style="background: linear-gradient(to bottom, #e25563, #cc2436); box-shadow: 0px 1.5px 0px 0px #c8303f;"
                @click="confirmDelete"
              >
                <span class="text-[14px] font-medium text-white leading-[1.5]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Success snackbar -->
    <Teleport to="body">
      <div class="fixed top-[20px] inset-x-0 z-[80] flex justify-center pointer-events-none">
        <Transition name="snackbar">
          <div
            v-if="toast"
            class="flex items-center gap-[4px] pl-[8px] pr-[12px] py-[8px] rounded-[8px] bg-[#e6f9f0] border border-[#b3eed2] pointer-events-auto"
            style="filter: drop-shadow(0px 8px 6px rgba(42,50,82,0.04));"
          >
            <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#238b5b" /><path d="M4.8 8.2l2.2 2.2 4.2-4.6" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            <span class="text-[12px] font-normal text-[#03102f] leading-[1.5] whitespace-nowrap">{{ toast }}</span>
          </div>
        </Transition>
      </div>
    </Teleport>

    <!-- Click-outside backdrop for the row menu -->
    <Teleport to="body">
      <div v-if="menuRuleId !== null" class="fixed inset-0 z-20" @click="menuRuleId = null" />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onUnmounted } from 'vue'

// ── Rules data: [min, max) ranges in SGD; steps are ordered approver groups ──
let nextId = 4
const rules = reactive([
  { id: 1, min: null, max: 100, steps: [['Any user']] },
  { id: 2, min: 100, max: 250, steps: [['Any user'], ['Jessica Jones', 'Martini Jane']] },
  { id: 3, min: 250, max: 500, steps: [['Alonzo Suarez']] },
])

const approvers = [
  { name: 'Any user' },
  { name: 'Any admin' },
  { name: 'Mason Reed', role: 'Owner' },
  { name: 'Riley Morgan', role: 'Admin' },
  { name: 'Avery Brooks', role: 'Manager' },
  { name: 'Casey Quinn', role: 'Cashier' },
  { name: 'Alex Morgan' },
  { name: 'Jordan Lee' },
  { name: 'Jessica Jones', role: 'Manager' },
  { name: 'Martini Jane' },
  { name: 'Alonzo Suarez' },
]

function roleChip(role) {
  const map = {
    Owner: { bg: '#e5eeff', text: '#2465de' },
    Admin: { bg: '#f7edfd', text: '#7d1ab7' },
    Manager: { bg: '#f5f6f9', text: '#002771' },
    Cashier: { bg: '#e6f9f0', text: '#238b5b' },
  }
  return map[role] ?? { bg: '#f2f2f4', text: '#484d61' }
}

function fmt(n) {
  return 'SGD ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Title as grey/ink parts, e.g. "If amount is greater or equal than · SGD 100.00 · and less than · SGD 250.00"
function ruleTitle(rule) {
  if (rule.min == null || rule.min === 0) {
    return [
      { t: 'If amount is less than', dark: false },
      { t: ` ${fmt(rule.max)}`, dark: true },
    ]
  }
  const parts = [
    { t: 'If amount is greater or equal than', dark: false },
    { t: ` ${fmt(rule.min)}`, dark: true },
  ]
  if (rule.max != null) {
    parts.push({ t: ' and less than ', dark: false }, { t: fmt(rule.max), dark: true })
  }
  return parts
}

// ── Row menu ──
const menuRuleId = ref(null)

// ── Add / Edit modal ──
const modalOpen = ref(false)
const editingId = ref(null)
const overlapError = ref(false)
const openStep = ref(null)
const userSearch = ref('')
const form = reactive({ min: '', max: '', steps: [] })

// Close the users dropdown on any click outside it (the field itself toggles)
function onDocMousedown(e) {
  if (!e.target.closest('.approver-pop, .approver-field')) openStep.value = null
}
watch(openStep, (open) => {
  if (open !== null) document.addEventListener('mousedown', onDocMousedown)
  else document.removeEventListener('mousedown', onDocMousedown)
})
onUnmounted(() => document.removeEventListener('mousedown', onDocMousedown))

const filteredApprovers = computed(() => {
  const q = userSearch.value.trim().toLowerCase()
  if (!q) return approvers
  return approvers.filter((a) => a.name.toLowerCase().includes(q))
})

function openAdd() {
  editingId.value = null
  form.min = ''
  form.max = ''
  form.steps = [{ selected: [] }]
  overlapError.value = false
  openStep.value = null
  userSearch.value = ''
  modalOpen.value = true
}

function openEdit(rule) {
  menuRuleId.value = null
  editingId.value = rule.id
  form.min = rule.min == null ? '' : String(rule.min)
  form.max = rule.max == null ? '' : String(rule.max)
  form.steps = rule.steps.map((s) => ({ selected: [...s] }))
  overlapError.value = false
  openStep.value = null
  userSearch.value = ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  openStep.value = null
}

function addStep() {
  form.steps.push({ selected: [] })
  openStep.value = form.steps.length - 1
}

// "Any user"/"Any admin" are exclusive; named approvers combine with Or
function isAnyOption(name) {
  return name === 'Any user' || name === 'Any admin'
}

function toggleApprover(step, name) {
  if (isAnyOption(name)) {
    step.selected = [name]
    openStep.value = null
    return
  }
  step.selected = step.selected.filter((n) => n !== 'Any user' && n !== 'Any admin')
  if (step.selected.includes(name)) {
    step.selected = step.selected.filter((n) => n !== name)
  } else {
    step.selected = [...step.selected, name]
  }
}

function saveRule() {
  const min = form.min.trim() === '' ? null : parseFloat(form.min.replace(/,/g, '')) || 0
  const max = form.max.trim() === '' ? null : parseFloat(form.max.replace(/,/g, '')) || 0

  // Overlap check against the other rules: [min,max) ranges intersect
  const lo = min ?? 0
  const hi = max ?? Infinity
  const overlaps = rules.some((r) => {
    if (r.id === editingId.value) return false
    const rLo = r.min ?? 0
    const rHi = r.max ?? Infinity
    return lo < rHi && rLo < hi
  })
  if (overlaps) {
    overlapError.value = true
    return
  }

  const steps = form.steps.filter((s) => s.selected.length > 0).map((s) => [...s.selected])
  if (editingId.value != null) {
    const rule = rules.find((r) => r.id === editingId.value)
    Object.assign(rule, { min, max, steps: steps.length ? steps : rule.steps })
    showToast('Rule successfully updated')
  } else {
    rules.push({ id: nextId++, min, max, steps: steps.length ? steps : [['Any user']] })
  }
  closeModal()
}

// ── Delete flow ──
const deleteRule = ref(null)
const deletePassword = ref('')
const deletePasswordVisible = ref(false)

function askDelete(rule) {
  menuRuleId.value = null
  deletePassword.value = ''
  deletePasswordVisible.value = false
  deleteRule.value = rule
}

function confirmDelete() {
  const i = rules.findIndex((r) => r.id === deleteRule.value?.id)
  if (i !== -1) rules.splice(i, 1)
  deleteRule.value = null
  showToast('Rule successfully deleted')
}

// ── Snackbar ──
const toast = ref('')
let toastTimer = null
function showToast(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 2500)
}
</script>

<style scoped>
/* Amount input: SGD prefix + value, design-system input shell */
.amount-input {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid #e5e6ea;
  background: white;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.amount-input:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
}
.amount-input--error,
.amount-input--error:focus-within {
  border-color: #dc3545;
  box-shadow: 0px 0px 0px 3px rgba(220, 53, 69, 0.18);
}
.amount-input input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
}
.amount-input input::placeholder {
  color: #9295a5;
}

/* Approver selector: single value looks like a select, multi shows chips */
.approver-field {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 36px;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #e5e6ea;
  background: white;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.approver-field:focus-visible {
  outline: none;
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px #b3cdfe;
}

/* Modal: backdrop fade + card rise, matching the app's modal motion */
.rule-modal-enter-active { transition: opacity 200ms ease-out; }
.rule-modal-leave-active { transition: opacity 150ms ease-in; }
.rule-modal-enter-from,
.rule-modal-leave-to { opacity: 0; }
.rule-modal-enter-active .rule-modal__card { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.rule-modal-enter-from .rule-modal__card { transform: translateY(12px); }

/* Row menu + snackbar motion */
.rule-menu-enter-active { transition: opacity 140ms ease-out, transform 140ms ease-out; transform-origin: top right; }
.rule-menu-leave-active { transition: opacity 100ms ease-in; }
.rule-menu-enter-from { opacity: 0; transform: scale(0.96) translateY(-2px); }
.rule-menu-leave-to { opacity: 0; }

.snackbar-enter-active { transition: opacity 200ms ease-out, transform 200ms ease-out; }
.snackbar-leave-active { transition: opacity 150ms ease-in, transform 150ms ease-in; }
.snackbar-enter-from,
.snackbar-leave-to { opacity: 0; transform: translateY(-16px); }

@media (prefers-reduced-motion: reduce) {
  .rule-modal-enter-active, .rule-modal-leave-active,
  .rule-menu-enter-active, .rule-menu-leave-active,
  .snackbar-enter-active, .snackbar-leave-active,
  .amount-input, .approver-field { transition: none; }
  .rule-modal-enter-from .rule-modal__card { transform: none; }
}
</style>
