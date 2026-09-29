<template>
  <!-- Full-bleed page; with the AI Sidekick open it becomes a floating 20px card
       beside the Sidekick on the page background (Figma 4846:57811: 8px pad + gap) -->
  <div
    class="av-shell fixed inset-0 z-50 flex overflow-hidden"
    :class="{ 'av-shell--ai': aiOpen }"
  >
  <div class="av-page flex flex-col flex-1 min-w-0 bg-white overflow-hidden">
    <!-- Top bar -->
    <div class="flex items-stretch shrink-0" style="height: 64px; border-bottom: 1px solid #e5e6ea;">
      <div class="flex items-center flex-1 min-w-0" style="padding: 16px 24px; gap: 12px;">
        <img :src="logoIcon" alt="HitPay" width="32" height="31.9585" class="shrink-0" />
        <span class="shrink-0" style="width: 1px; height: 20px; background: #e5e6ea;"></span>
        <span class="text-[16px] font-medium text-[#03102f] whitespace-nowrap" style="line-height: 1.4;">Account Verification</span>
      </div>
      <button
        class="flex items-center justify-center hover:bg-[#f8f9fc] transition-colors duration-150"
        style="border-left: 1px solid #e5e6ea; padding: 8px 24px; gap: 8px;"
        @click="$emit('close')"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9 10.0608L13.2426 14.3035C13.5355 14.5964 14.0104 14.5964 14.3033 14.3035C14.5961 14.0105 14.5961 13.5357 14.3033 13.2427L10.0607 9.00015L14.3033 4.75751C14.5961 4.46462 14.5961 3.98974 14.3033 3.69685C14.0104 3.40396 13.5355 3.40396 13.2426 3.69685L9 7.9395L4.75732 3.69684C4.46443 3.40395 3.98955 3.40395 3.69666 3.69684C3.40377 3.98974 3.40377 4.46461 3.69666 4.7575L7.93928 9.00015L3.69666 13.2428C3.40377 13.5357 3.40377 14.0105 3.69666 14.3035C3.98955 14.5964 4.46443 14.5964 4.75732 14.3035L9 10.0608Z" fill="#61667C"/>
        </svg>
        <span class="text-[14px] font-medium text-[#61667c]" style="line-height: 1.5;">Close</span>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 min-h-0 overflow-hidden relative">
      <div class="flex h-full" style="padding: 24px; gap: 40px;">

        <!-- Stepper sidebar (Figma: Sidebar/SubSubmenu) -->
        <div class="flex flex-col shrink-0 bg-white" style="width: 280px; gap: 4px;">
          <div class="flex flex-col flex-1 min-h-0">
            <div
              v-for="(step, i) in steps"
              :key="step.label"
              class="step-row flex items-start rounded-[8px]"
              :class="{ 'step-row--link': step.reachable && !step.active }"
              :style="{ padding: '0 8px', gap: '12px', marginBottom: i < steps.length - 1 ? '-4px' : '0' }"
              @click="step.reachable && goTo(i)"
            >
              <!-- Status circle + connector -->
              <div class="flex flex-col items-center self-stretch shrink-0" style="padding-top: 4px;">
                <span
                  class="step-dot shrink-0 flex items-center justify-center rounded-full text-[12px] font-medium"
                  :class="step.done ? 'step-dot--done' : step.active ? 'step-dot--active' : ''"
                >
                  <Transition name="dot-swap" mode="out-in">
                    <svg v-if="step.done" key="check" width="12" height="12" viewBox="0 0 7.5 7.5" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.62253 1.70767C6.74456 1.82971 6.74456 2.02757 6.62253 2.14961L3.10909 5.66306C2.97485 5.79728 2.7572 5.79728 2.62295 5.66306L0.877284 3.91737C0.755247 3.79534 0.755247 3.59747 0.877284 3.47544C0.999322 3.35341 1.19719 3.35341 1.31922 3.47544L2.86602 5.02222L6.18059 1.70767C6.30263 1.58563 6.5005 1.58563 6.62253 1.70767Z" fill="white"/>
                    </svg>
                    <span v-else key="num" style="line-height: 1.5;">{{ i + 1 }}</span>
                  </Transition>
                </span>
                <!-- Connector: grey track, blue fill grows downward once the step is done -->
                <span v-if="i < steps.length - 1" class="step-line shrink-0">
                  <span class="step-line-fill" :class="{ 'step-line-fill--on': step.done }"></span>
                </span>
              </div>

              <!-- Label + description -->
              <div class="flex flex-col flex-1 min-w-0" style="padding: 4px 0 12px; gap: 2px;">
                <span
                  class="step-label text-[14px]"
                  :class="step.active ? 'font-medium text-[#03102f]' : 'text-[#61667c]'"
                  style="line-height: 1.5;"
                >{{ step.label }}</span>
                <span class="text-[13px] text-[#61667c]" style="line-height: 1.5;">{{ step.description }}</span>
              </div>
            </div>
          </div>

          <!-- Need help? → AI Assistant (hidden while the Sidekick is open) -->
          <Transition name="help-fade">
          <div v-if="!aiOpen" class="relative shrink-0 w-full">
            <div class="ai-help-glow absolute rounded-[16px]"></div>
            <button
              class="ai-help relative flex items-start w-full bg-white rounded-[8px] text-left"
              style="border: 2px solid rgba(0,0,0,0.05); padding: 8px 12px; gap: 12px;"
              @click="openAssistant"
            >
              <span class="flex items-center shrink-0" style="padding: 2px 0;">
                <img :src="aiChatIcon" alt="" width="18" height="18" />
              </span>
              <span class="flex flex-col min-w-0" style="line-height: 1.5;">
                <span class="text-[14px] font-medium text-[#03102f]">Need help?</span>
                <span class="text-[12px] text-[#61667c]">Ask our AI Assistant</span>
              </span>
            </button>
          </div>
          </Transition>
        </div>

        <!-- Step content — reserves room under the card for the docked setup guide (77px + 16px gap).
             With the Sidekick open the column narrows (Figma: 24px left pad, card fills to 664px) -->
        <div
          class="flex flex-1 justify-center items-start min-w-0 min-h-0"
          :style="{
            paddingBottom: setupGuideVisible ? '93px' : '0',
            paddingLeft: aiOpen ? '24px' : '0',
            transition: 'padding 280ms cubic-bezier(0.4, 0, 0.2, 1)',
          }"
        >
          <!-- One card shell per step; direction-aware slide + fade between steps -->
          <Transition :name="stepTransition" mode="out-in">
          <div
            :key="currentStep"
            class="flex flex-col rounded-[12px] min-h-0"
            style="width: 100%; max-width: 764px; max-height: 100%; background: #f8f9fc; padding: 4px;"
          >
            <!-- Title -->
            <div class="flex flex-col justify-center shrink-0" style="padding: 16px; gap: 2px;">
              <span class="text-[16px] font-medium text-[#03102f]" style="line-height: 1.4;">{{ stepMeta.title }}</span>
              <span class="text-[12px] text-[#61667c]" style="line-height: 1.5;">{{ stepMeta.subtitle }}</span>
            </div>

            <!-- Fields card -->
            <div
              class="flex flex-col min-h-0 bg-white rounded-[8px] w-full"
              :class="{ 'flex-1': currentStep === REVIEW }"
              style="box-shadow: 0px 1px 2px rgba(0,0,0,0.06), 0px 1px 0.5px rgba(0,0,0,0.06);"
            >
              <div
                class="flex flex-col flex-1 min-h-0 overflow-y-auto"
                :style="{ padding: currentStep === REVIEW ? '16px' : '16px 16px 24px', gap: '16px' }"
              >
              <!-- Business details (Figma 4840:57162) -->
              <template v-if="currentStep === BUSINESS_DETAILS">
                <!-- AI-prefilled fields: purple until the merchant edits them -->
                <label
                  v-for="field in aiFields"
                  :key="field.key"
                  class="flex flex-col w-full"
                  style="gap: 4px;"
                >
                  <span class="flex items-center" style="height: 20px; gap: 8px;">
                    <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5;">{{ field.label }}</span>
                    <img
                      v-if="field.ai"
                      :src="sparkleIcon"
                      alt="Filled by AI"
                      title="Filled by AI from your documents"
                      width="16"
                      height="16"
                    />
                  </span>
                  <input
                    v-model="details[field.key]"
                    class="field-input"
                    :class="{ 'field-input--ai': field.ai }"
                    type="text"
                    @input="field.ai = false"
                  />
                </label>

                <!-- Phone + email -->
                <div class="flex w-full" style="gap: 16px;">
                  <label class="flex flex-col flex-1 min-w-0" style="gap: 4px;">
                    <span class="flex items-center text-[12px] font-medium text-[#61667c]" style="height: 20px; line-height: 1.5;">Phone number</span>
                    <div class="field-input field-input--group flex items-center">
                      <button
                        type="button"
                        class="flex items-center shrink-0 h-full"
                        style="gap: 4px; padding-right: 8px; border-right: 1px solid #e5e6ea;"
                      >
                        <span
                          class="shrink-0 overflow-hidden rounded-[2px] flex items-center justify-center"
                          style="width: 22px; height: 14.667px; box-shadow: 0px 1px 1.5px rgba(16,24,40,0.1), 0px 1px 1px rgba(16,24,40,0.06);"
                        >
                          <img :src="flagSgIcon" alt="Singapore" width="24" height="16" class="max-w-none" />
                        </span>
                        <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5;">+65</span>
                        <img :src="chevronDownIcon" alt="" width="16" height="16" />
                      </button>
                      <input
                        v-model="details.phone"
                        class="flex-1 min-w-0 h-full bg-transparent outline-none text-[14px] text-[#03102f] placeholder:text-[#9295a5]"
                        style="padding-left: 8px;"
                        type="tel"
                        inputmode="numeric"
                        placeholder="98288399"
                      />
                    </div>
                  </label>
                  <label class="flex flex-col flex-1 min-w-0" style="gap: 4px;">
                    <span class="flex items-center text-[12px] font-medium text-[#61667c]" style="height: 20px; line-height: 1.5;">Email address</span>
                    <input
                      v-model="details.email"
                      class="field-input"
                      type="email"
                      placeholder="email@website.com"
                    />
                  </label>
                </div>
              </template>

              <!-- Identity verification (dummy) -->
              <template v-else-if="currentStep === IDENTITY">
                <button
                  v-for="method in idMethods"
                  :key="method.key"
                  class="option-card flex items-start w-full text-left rounded-[8px]"
                  :class="{ 'option-card--selected': idMethod === method.key }"
                  style="padding: 12px 16px; gap: 12px;"
                  @click="idMethod = method.key"
                >
                  <span class="radio shrink-0" :class="{ 'radio--on': idMethod === method.key }" style="margin-top: 3px;"></span>
                  <span class="flex flex-col flex-1 min-w-0" style="gap: 2px;">
                    <span class="flex items-center" style="gap: 8px;">
                      <span class="text-[14px] font-medium text-[#03102f]" style="line-height: 1.5;">{{ method.title }}</span>
                      <span
                        v-if="method.badge"
                        class="text-[12px] font-medium rounded-[24px]"
                        style="padding: 0 8px; line-height: 20px; background: #eaf6ef; color: #238b5b;"
                      >{{ method.badge }}</span>
                    </span>
                    <span class="text-[13px] text-[#61667c]" style="line-height: 1.5;">{{ method.description }}</span>
                  </span>
                  <span class="shrink-0 text-[12px] text-[#9295a5]" style="line-height: 1.5; margin-top: 2px;">{{ method.eta }}</span>
                </button>

                <div
                  class="flex items-start w-full rounded-[8px]"
                  style="background: #fcfcfd; border: 1px solid #e5e6ea; padding: 12px 16px; gap: 12px;"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="shrink-0" style="margin-top: 2px;">
                    <path d="M8 1.33334C11.6819 1.33334 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33334 11.6819 1.33334 8C1.33334 4.3181 4.3181 1.33334 8 1.33334ZM8 7.00001C7.63181 7.00001 7.33334 7.29848 7.33334 7.66667V10.6667C7.33334 11.0349 7.63181 11.3333 8 11.3333C8.36819 11.3333 8.66667 11.0349 8.66667 10.6667V7.66667C8.66667 7.29848 8.36819 7.00001 8 7.00001ZM8 4.66667C7.63181 4.66667 7.33334 4.96515 7.33334 5.33334C7.33334 5.70153 7.63181 6.00001 8 6.00001C8.36819 6.00001 8.66667 5.70153 8.66667 5.33334C8.66667 4.96515 8.36819 4.66667 8 4.66667Z" fill="#9295A5"/>
                  </svg>
                  <p class="flex-1 min-w-0 text-[13px] text-[#61667c]" style="line-height: 1.5;">
                    We only use your ID to confirm who you are. Your data is encrypted and never shared with third parties.
                  </p>
                </div>
              </template>

              <!-- Personnel (dummy) -->
              <template v-else-if="currentStep === PERSONNEL">
                <div
                  v-for="(person, i) in personnel"
                  :key="person.id"
                  class="flex items-center w-full rounded-[8px]"
                  style="border: 1px solid #e5e6ea; padding: 12px 16px; gap: 12px;"
                >
                  <span
                    class="shrink-0 flex items-center justify-center rounded-full text-[13px] font-medium"
                    :style="{ width: '36px', height: '36px', background: avatarTints[i % avatarTints.length].bg, color: avatarTints[i % avatarTints.length].fg }"
                  >{{ initials(person.name) }}</span>
                  <span class="flex flex-col flex-1 min-w-0">
                    <span class="text-[14px] font-medium text-[#03102f] truncate" style="line-height: 1.5;">{{ person.name }}</span>
                    <span class="text-[13px] text-[#61667c] truncate" style="line-height: 1.5;">{{ person.role }}</span>
                  </span>
                  <span class="flex flex-col items-end shrink-0">
                    <span class="text-[14px] font-medium text-[#03102f]" style="line-height: 1.5;">{{ person.ownership }}%</span>
                    <span class="text-[12px] text-[#9295a5]" style="line-height: 1.5;">Ownership</span>
                  </span>
                </div>

                <button
                  class="add-person flex items-center justify-center w-full rounded-[8px] text-[14px] font-medium text-[#2465de]"
                  style="height: 44px; gap: 6px;"
                  @click="addPerson"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="#2465DE" stroke-width="1.33333" stroke-linecap="round"/>
                  </svg>
                  Add shareholder or director
                </button>

                <div class="flex items-center justify-between w-full text-[13px]" style="line-height: 1.5;">
                  <span class="text-[#61667c]">Total ownership</span>
                  <span class="font-medium" :class="totalOwnership === 100 ? 'text-[#238b5b]' : 'text-[#c4320a]'">{{ totalOwnership }}%</span>
                </div>
              </template>

              <!-- Review & submit -->
              <template v-else>
                <!-- Recap sections -->
                <div
                  v-for="section in sections"
                  :key="section.title"
                  class="recap-card flex flex-col shrink-0 w-full bg-white overflow-hidden rounded-[8px]"
                  style="border: 1px solid #e5e6ea;"
                >
                  <!-- Section head -->
                  <div
                    class="flex items-center w-full"
                    style="background: #fcfcfd; border-bottom: 1px solid #e5e6ea; min-height: 44px; padding: 12px 20px; gap: 24px;"
                  >
                    <span class="flex-1 min-w-0 text-[14px] font-medium text-[#03102f]" style="line-height: 1.5;">{{ section.title }}</span>

                    <!-- Edit (revealed on hover) -->
                    <button
                      class="recap-edit flex items-center justify-center rounded-[8px] hover:bg-[#f2f2f4]"
                      style="height: 28px; padding: 8px; gap: 6px;"
                      @click="section.step != null && goTo(section.step)"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10.6903 2.00978C11.44 1.25997 12.6371 1.22998 13.4227 1.9198L13.5187 2.00978L13.9901 2.48118C14.7399 3.23099 14.7699 4.42803 14.08 5.21361L13.9901 5.30961L6.51521 12.7845C6.40919 12.8905 6.28104 12.971 6.14051 13.0205L6.03295 13.0517L3.06302 13.7371C2.60783 13.8422 2.19729 13.4612 2.24964 13.0123L2.26272 12.9369L2.94809 9.96687C2.9818 9.82079 3.04782 9.68465 3.14073 9.56818L3.21537 9.48467L10.6903 2.00978ZM10.2188 4.36684L4.22578 10.3599L3.80151 12.1983L5.63999 11.7741L11.633 5.78105L10.2188 4.36684ZM12.5759 2.95259C12.3356 2.71227 11.9574 2.69378 11.6959 2.89713L11.6331 2.95259L11.1616 3.42403L12.5758 4.83825L13.0473 4.3668C13.2876 4.12648 13.3061 3.74832 13.1027 3.4868L13.0473 3.42399L12.5759 2.95259Z" fill="#61667C"/>
                      </svg>
                      <span class="text-[12px] font-medium text-[#61667c]" style="line-height: 1.5;">Edit</span>
                    </button>

                    <!-- Completed check -->
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="shrink-0">
                      <path d="M10 1.66667C14.6023 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6023 14.6023 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6023 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667ZM12.9462 6.98447L8.82133 11.1093L7.05359 9.3415C6.72816 9.01608 6.20053 9.01608 5.87508 9.3415C5.54965 9.66692 5.54965 10.1946 5.87508 10.52L8.17318 12.8181C8.53117 13.1761 9.11158 13.1761 9.46958 12.8181L14.1247 8.16298C14.4501 7.83754 14.4501 7.3099 14.1247 6.98447C13.7993 6.65903 13.2716 6.65903 12.9462 6.98447Z" fill="#2BC37D"/>
                    </svg>
                  </div>

                  <!-- Detail items (2-column grid) -->
                  <div class="grid items-start" style="grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 12px 20px 20px; gap: 16px 12px;">
                    <div
                      v-for="(item, idx) in section.items"
                      :key="idx"
                      class="flex flex-col min-w-0"
                      style="gap: 2px;"
                    >
                      <span class="text-[14px] text-[#61667c]" style="line-height: 1.5;">{{ item.label }}</span>
                      <ul v-if="Array.isArray(item.value)" class="list-disc text-[14px] text-[#03102f]" style="line-height: 1.5; padding-left: 21px;">
                        <li v-for="v in item.value" :key="v">{{ v }}</li>
                      </ul>
                      <span v-else class="text-[14px] text-[#03102f]" style="line-height: 1.5;">{{ item.value }}</span>
                    </div>
                  </div>
                </div>

                <!-- Attestation -->
                <div
                  class="flex items-start shrink-0 w-full rounded-[8px] cursor-pointer"
                  style="background: #fcfcfd; border: 1px solid #2465de; padding: 8px 12px; gap: 12px;"
                  @click="attested = !attested"
                >
                  <div class="flex items-center shrink-0" style="padding-top: 4px;">
                    <span
                      class="flex items-center justify-center rounded-[4px]"
                      :style="{
                        width: '16px',
                        height: '16px',
                        background: attested ? '#2465de' : '#ffffff',
                        border: attested ? '1px solid #2465de' : '1px solid #cbcdd4',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.04), 0px 1.5px 1.5px rgba(0,0,0,0.09)',
                        transition: 'background 150ms ease, border-color 150ms ease',
                      }"
                    >
                      <svg v-if="attested" width="12" height="12" viewBox="0 0 7.5 7.5" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.62253 1.70767C6.74456 1.82971 6.74456 2.02757 6.62253 2.14961L3.10909 5.66306C2.97485 5.79728 2.7572 5.79728 2.62295 5.66306L0.877284 3.91737C0.755247 3.79534 0.755247 3.59747 0.877284 3.47544C0.999322 3.35341 1.19719 3.35341 1.31922 3.47544L2.86602 5.02222L6.18059 1.70767C6.30263 1.58563 6.5005 1.58563 6.62253 1.70767Z" fill="white"/>
                      </svg>
                    </span>
                  </div>
                  <p class="flex-1 min-w-0 text-[14px] text-[#03102f]" style="line-height: 1.5;">
                    I hereby attest that all information provided is true, accurate, and complete to the best of my knowledge. I understand that providing false information may result in account suspension or legal action.
                  </p>
                </div>
              </template>
              </div>

              <!-- Button group (pinned to the card bottom while content scrolls) -->
              <div class="flex items-center justify-between w-full shrink-0" style="border-top: 1px solid #e5e6ea; padding: 16px;">
                <button
                  class="btn-secondary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-[#61667c]"
                  style="height: 36px; min-width: 100px; padding: 8px 12px;"
                  @click="back"
                >Back</button>
                <button
                  class="btn-primary flex items-center justify-center rounded-[8px] text-[14px] font-medium text-white"
                  style="height: 36px; min-width: 100px; padding: 8px 12px;"
                  @click="currentStep === REVIEW ? $emit('close') : next()"
                >{{ currentStep === REVIEW ? 'Submit verification' : 'Next' }}</button>
              </div>
            </div>
          </div>
          </Transition>
        </div>
      </div>

      <!-- Setup guide (minimized), docked bottom-right -->
      <Transition name="setup-dock">
        <SetupGuideCard
          v-if="setupGuideVisible"
          standalone
          current-step="Account verification"
          class="absolute"
          style="right: 24px; bottom: 24px; z-index: 10;"
          @dismiss="setupGuideVisible = false"
        />
      </Transition>
    </div>
  </div>

  <!-- AI Sidekick (Figma 4846:161206): 360px card, slides in from the right -->
  <div class="av-sidekick-slot shrink-0 h-full">
    <div class="av-sidekick h-full bg-white overflow-hidden">
      <AskAgentPanel @close="aiOpen = false" />
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import SetupGuideCard from './SetupGuideCard.vue'
import AskAgentPanel from '../content/AskAgentPanel.vue'
import logoIcon from '../../assets/icons/logo-hitpay-logogram.svg'
import aiChatIcon from '../../assets/icons/icon-ai-chat.svg'
import sparkleIcon from '../../assets/icons/icon-sparkle-ai.svg'
import flagSgIcon from '../../assets/icons/flag-sg.svg'
import chevronDownIcon from '../../assets/icons/icon-chevron-down-sm.svg'

const emit = defineEmits(['close'])

const attested = ref(true)
const setupGuideVisible = ref(true)

// AI Sidekick opens beside the flow so the merchant keeps their progress
const aiOpen = ref(false)
function openAssistant() {
  aiOpen.value = true
}

const stepDefs = [
  { label: 'Business type',         description: 'Tell us about your company'  },
  { label: 'Documents',             description: 'Upload business documents'   },
  { label: 'Business details',      description: 'Name, address and contacts'   },
  { label: 'Identity verification', description: 'Verify it’s really you'       },
  { label: 'Personnel',             description: 'Shareholders and directors'   },
  { label: 'Review & submit',       description: 'Check everything and submit' },
]
const BUSINESS_DETAILS = 2
const IDENTITY = 3
const PERSONNEL = 4
const REVIEW = 5

const stepCopy = {
  [BUSINESS_DETAILS]: { title: 'Business details',      subtitle: 'Choose your preferred verification method' },
  [IDENTITY]:         { title: 'Identity verification', subtitle: 'Choose how you’d like to verify your identity' },
  [PERSONNEL]:        { title: 'Personnel',             subtitle: 'Add everyone who owns 25% or more, and all directors' },
  [REVIEW]:           { title: 'Review & submit',       subtitle: 'Review all information before submitting your verification' },
}

// Prototype enters on Business details (steps 1–2 already done)
const currentStep = ref(BUSINESS_DETAILS)
const maxReached = ref(BUSINESS_DETAILS)
const stepTransition = ref('step-fwd')
const stepMeta = computed(() => stepCopy[currentStep.value])

const steps = computed(() => stepDefs.map((s, i) => ({
  ...s,
  done: i < currentStep.value,
  active: i === currentStep.value,
  reachable: i >= BUSINESS_DETAILS && i <= maxReached.value,
})))

function goTo(i) {
  if (i === currentStep.value) return
  stepTransition.value = i > currentStep.value ? 'step-fwd' : 'step-back'
  currentStep.value = i
  maxReached.value = Math.max(maxReached.value, i)
}
function next() { goTo(Math.min(currentStep.value + 1, REVIEW)) }
function back() {
  if (currentStep.value === BUSINESS_DETAILS) emit('close')
  else goTo(currentStep.value - 1)
}

// Identity verification (dummy)
const idMethods = [
  { key: 'myinfo', title: 'Singpass MyInfo', badge: 'Recommended', description: 'Retrieve your verified details from Singpass in one tap', eta: '~1 min' },
  { key: 'selfie', title: 'Selfie + photo ID', description: 'Take a quick selfie and upload your NRIC or passport', eta: '~3 min' },
  { key: 'manual', title: 'Manual review', description: 'Upload documents for our team to review by hand', eta: '1–2 days' },
]
const idMethod = ref('myinfo')

// Personnel (dummy)
const personnel = reactive([
  { id: 1, name: 'John Maeda Luu', role: 'Director · Shareholder', ownership: 60 },
  { id: 2, name: 'Daren Fletcher', role: 'Shareholder',            ownership: 40 },
])
const avatarTints = [
  { bg: '#e9f0fc', fg: '#2465de' },
  { bg: '#f7edfd', fg: '#9b4dca' },
  { bg: '#eaf6ef', fg: '#238b5b' },
]
const totalOwnership = computed(() => personnel.reduce((sum, p) => sum + p.ownership, 0))
function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}
function addPerson() {
  personnel.push({ id: Date.now(), name: 'New director', role: 'Director', ownership: 0 })
}

// Prefilled from the uploaded documents (AI) — flag clears once edited
const details = reactive({
  name: 'Acme Corporation Pte Ltd',
  registration: '202301234A',
  address: '123 Business Street, #05-67, Singapore 123456',
  phone: '',
  email: '',
})
const aiFields = reactive([
  { key: 'name',         label: 'Business name',       ai: true },
  { key: 'registration', label: 'Registration number', ai: true },
  { key: 'address',      label: 'Business address',    ai: true },
])

const sections = computed(() => [
  {
    title: 'Business type',
    items: [
      { label: 'Type',        value: 'Sole-proprietorship' },
      { label: 'Payment',     value: 'Physical' },
      { label: 'Category',    value: 'Retail' },
      { label: 'Description', value: 'I sell handmade goods' },
      { label: 'Website',     value: 'https//handmade.co' },
    ],
  },
  {
    title: 'Documents',
    items: [
      { label: 'Type', value: 'Manual upload' },
      {
        label: 'Document uploaded (100%)',
        value: ['business-registration-certificate.pdf', 'electricity-bill.jpg', 'alex-id.jpg'],
      },
    ],
  },
  {
    title: 'Business details',
    step: BUSINESS_DETAILS,
    items: [
      { label: 'Business name',       value: details.name || '—' },
      { label: 'Registration number', value: details.registration || '—' },
      { label: 'Business address',    value: details.address || '—' },
      { label: 'Phone number',        value: details.phone ? `+65 ${details.phone}` : '—' },
      { label: 'Email address',       value: details.email || '—' },
    ],
  },
  {
    title: 'Identity verification',
    step: IDENTITY,
    items: [
      { label: 'Method', value: idMethods.find((m) => m.key === idMethod.value).title },
      { label: 'Status', value: 'Completed' },
    ],
  },
  {
    title: 'Shareholders & personnel',
    step: PERSONNEL,
    items: personnel.flatMap((p, i) => [
      { label: `Member ${i + 1}`, value: p.name },
      { label: 'Ownership', value: `${p.ownership}%` },
    ]),
  },
])

function onKeydown(e) {
  if (e.key !== 'Escape') return
  // Close the Sidekick first, then the flow
  if (aiOpen.value) aiOpen.value = false
  else emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* Edit button + lifted shadow reveal on section hover (Figma hover state) */
.recap-card {
  transition: box-shadow 200ms ease;
}
.recap-card:hover {
  box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.09);
}
.recap-edit {
  opacity: 0;
  transition: opacity 150ms ease-out, background-color 150ms ease;
}
.recap-card:hover .recap-edit {
  opacity: 1;
}

/* Figma: Button/Secondary */
.btn-secondary {
  background: linear-gradient(to bottom, #ffffff, #f2f2f2);
  border: 1px solid #f2f2f4;
  box-shadow: 0px 1.5px 0px 0px #e5e5e5;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-secondary:hover { filter: brightness(0.98); }
.btn-secondary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #e5e5e5;
}

/* Figma: Button/Primary */
.btn-primary {
  background: linear-gradient(to bottom, #4179e2, #1f5bcc);
  border: 1px solid #2465de;
  box-shadow: 0px 1.5px 0px 0px #1d5fd9;
  text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.12);
  transition: filter 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}
.btn-primary:hover { filter: brightness(1.05); }
.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0px 0.5px 0px 0px #1d5fd9;
}

/* ── Step card transitions: forward slides in from the right, back from the left ── */
.step-fwd-enter-active,
.step-back-enter-active {
  transition: opacity 260ms ease-out, transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
}
.step-fwd-leave-active,
.step-back-leave-active {
  transition: opacity 140ms ease-in, transform 140ms ease-in;
}
.step-fwd-enter-from  { opacity: 0; transform: translateX(24px); }
.step-fwd-leave-to    { opacity: 0; transform: translateX(-12px); }
.step-back-enter-from { opacity: 0; transform: translateX(-24px); }
.step-back-leave-to   { opacity: 0; transform: translateX(12px); }

/* ── Stepper ── */
.step-row--link { cursor: pointer; }
.step-row--link:hover .step-label { color: #03102f; }
.step-label { transition: color 150ms ease; }

.step-dot {
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 1.2px solid #cbcdd4;
  color: #9295a5;
  transition: background-color 220ms ease, border-color 220ms ease, color 220ms ease, box-shadow 220ms ease;
}
/* Active ring lights up once the connector above has finished filling */
.step-dot--active {
  border-color: #2465de;
  color: #03102f;
  box-shadow: 0px 0px 0px 3px rgba(36, 101, 222, 0.12);
  transition-delay: 180ms;
}
.step-dot--done {
  background: #2465de;
  border-color: #2465de;
  color: #ffffff;
}

.dot-swap-enter-active { transition: opacity 160ms ease-out, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.dot-swap-leave-active { transition: opacity 90ms ease, transform 90ms ease; }
.dot-swap-enter-from,
.dot-swap-leave-to { opacity: 0; transform: scale(0.4); }

.step-line {
  position: relative;
  width: 1.5px;
  height: 31px;
  background: #cbcdd4;
  overflow: hidden;
}
.step-line-fill {
  position: absolute;
  inset: 0;
  background: #2465de;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
}
.step-line-fill--on { transform: scaleY(1); }

/* ── Identity: selectable method cards ── */
.option-card {
  border: 1px solid #e5e6ea;
  background: #ffffff;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}
.option-card:hover { border-color: #cbcdd4; }
.option-card--selected,
.option-card--selected:hover {
  border-color: #2465de;
  background: #fcfcfd;
  box-shadow: 0px 0px 0px 3px rgba(36, 101, 222, 0.08);
}
.radio {
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  border: 1px solid #cbcdd4;
  background: #ffffff;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px rgba(0, 0, 0, 0.09);
  transition: border-width 150ms ease, border-color 150ms ease;
}
.radio--on {
  border: 5px solid #2465de;
}

/* ── Personnel: add row ── */
.add-person {
  border: 1px dashed #cbcdd4;
  transition: background-color 150ms ease, border-color 150ms ease;
}
.add-person:hover {
  background: #f8f9fc;
  border-color: #2465de;
}

/* Figma: Input — State=Default / State=AI */
.field-input {
  width: 100%;
  height: 36px;
  padding: 0 8px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e6ea;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04), 0px 1.5px 1.5px 0px rgba(0, 0, 0, 0.09);
  font-size: 14px;
  line-height: 1.5;
  color: #03102f;
  outline: none;
  transition: border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}
.field-input::placeholder { color: #9295a5; }
.field-input:focus,
.field-input--group:focus-within {
  border-color: #2465de;
  box-shadow: 0px 0px 0px 3px rgba(36, 101, 222, 0.12);
}
.field-input--ai {
  background: #f7edfd;
  border-color: #d8a4f6;
  box-shadow: none;
}
.field-input--ai:focus {
  border-color: #c880f2;
  box-shadow: 0px 0px 0px 3px rgba(200, 128, 242, 0.16);
}

/* ── Shell: full-bleed ⇄ floating card + Sidekick (Figma 4846:57811) ── */
.av-shell {
  background: #f8f9fc;
  padding: 0;
  transition: padding 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.av-shell--ai { padding: 8px; }

.av-page {
  position: relative;
  border-radius: 0;
  transition: border-radius 280ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms ease;
}
.av-shell--ai .av-page {
  border-radius: 20px;
  box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.08), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);
}
/* Figma strokes sit inside the frame without taking layout space — draw them as an overlay */
.av-page::after,
.av-sidekick::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid #f2f2f4;
  border-radius: inherit;
  pointer-events: none;
  z-index: 20;
}
.av-page::after {
  opacity: 0;
  transition: opacity 280ms ease;
}
.av-shell--ai .av-page::after { opacity: 1; }

/* Slot animates 0 → 368px (8px gap + 360px card); the card itself slides in */
.av-sidekick-slot {
  width: 0;
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
.av-shell--ai .av-sidekick-slot { width: 368px; }

.av-sidekick {
  position: relative;
  width: 360px;
  margin-left: 8px;
  border-radius: 20px;
  box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.08), 0px 1px 1px 0px rgba(0, 0, 0, 0.08);
  opacity: 0;
  transform: translateX(24px);
  transition: opacity 200ms ease, transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
}
.av-shell--ai .av-sidekick {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 60ms;
}

.help-fade-enter-active,
.help-fade-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.help-fade-enter-from,
.help-fade-leave-to { opacity: 0; transform: translateY(6px); }

/* Figma: "Need help?" soft AI gradient glow behind the card */
.ai-help-glow {
  inset: 8px 0.5px 8px -0.5px;
  filter: blur(18px);
  opacity: 0.6;
  background: radial-gradient(ellipse 60% 140% at 20% 20%, #a062f7 0%, #9c86f8 25%, #98aaf9 50%, #90f2fa 100%);
  pointer-events: none;
}
.ai-help {
  transition: box-shadow 150ms ease, transform 150ms ease;
}
.ai-help:hover { box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.09); }
.ai-help:active { transform: translateY(1px); }

/* Setup guide dismiss */
.setup-dock-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.setup-dock-leave-to { opacity: 0; transform: translateY(8px); }

@media (prefers-reduced-motion: reduce) {
  .recap-card,
  .recap-edit,
  .btn-secondary,
  .btn-primary,
  .ai-help,
  .field-input,
  .setup-dock-leave-active,
  .step-dot,
  .step-line-fill,
  .step-label,
  .option-card,
  .radio,
  .add-person,
  .dot-swap-enter-active,
  .dot-swap-leave-active,
  .av-shell,
  .av-page,
  .av-sidekick-slot,
  .av-sidekick,
  .help-fade-enter-active,
  .help-fade-leave-active { transition: none; }
  /* Keep a gentle crossfade between steps, drop the movement */
  .step-fwd-enter-active, .step-back-enter-active,
  .step-fwd-leave-active, .step-back-leave-active { transition: opacity 150ms ease; }
  .step-fwd-enter-from, .step-fwd-leave-to,
  .step-back-enter-from, .step-back-leave-to { transform: none; }
}
</style>
