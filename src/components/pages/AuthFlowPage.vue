<template>
  <div class="relative flex h-screen w-full overflow-hidden bg-white" :class="isChoose ? 'stage-choose' : 'stage-login'">
    <!-- Left: login form (collapses away when the banner expands) -->
    <section class="auth-left relative h-full min-w-0 overflow-hidden bg-[#f8f9fc]">
      <div class="auth-form-holder absolute inset-0 flex items-center justify-center" :aria-hidden="isChoose">
        <form
          class="flex w-[400px] flex-col items-start gap-[24px] rounded-[8px] bg-white p-[32px]"
          style="box-shadow: 0px 3px 11px 0px rgba(38, 42, 50, 0.03);"
          @submit.prevent="login('password')"
        >
          <!-- Fields -->
          <div class="flex w-full flex-col items-start gap-[16px]">
            <div class="flex w-full flex-col items-start gap-[4px]">
              <div class="flex h-[20px] w-full items-center">
                <label for="login-email" class="text-[12px] font-medium leading-[1.5] text-[#61667c]">Email</label>
              </div>
              <div class="aba-control">
                <input
                  id="login-email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  class="aba-input"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div class="flex w-full flex-col items-start gap-[4px]">
              <div class="flex h-[20px] w-full items-center">
                <label for="login-password" class="text-[12px] font-medium leading-[1.5] text-[#61667c]">Password</label>
              </div>
              <div class="aba-control" style="gap: 8px;">
                <input
                  id="login-password"
                  v-model="password"
                  :type="passwordVisible ? 'text' : 'password'"
                  autocomplete="current-password"
                  class="aba-input"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  class="flex shrink-0 items-center justify-center pr-[8px]"
                  :style="{ opacity: passwordVisible ? 1 : 0.75 }"
                  aria-label="Toggle password visibility"
                  @click="passwordVisible = !passwordVisible"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.2 8S3.6 3.8 8 3.8 14.8 8 14.8 8 12.4 12.2 8 12.2 1.2 8 1.2 8z" stroke="#61667c" stroke-width="1.3" /><circle cx="8" cy="8" r="2" stroke="#61667c" stroke-width="1.3" /></svg>
                </button>
              </div>
            </div>

            <a href="#" class="w-full text-[12px] font-medium leading-[1.5] text-[#2465de]" @click.prevent>Forgot your password?</a>
          </div>

          <!-- Log in -->
          <button
            type="submit"
            class="flex h-[36px] w-full items-center justify-center gap-[8px] rounded-[8px] border border-[#2465de] px-[12px] transition-transform duration-100 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #4179e2, #1f5bcc); box-shadow: 0px 1.5px 0px 0px #1d5fd9;"
            :disabled="!!loggingIn"
            :aria-busy="loggingIn === 'password'"
          >
            <span v-if="loggingIn === 'password'" class="login-spinner login-spinner--light" aria-hidden="true"></span>
            <span v-else class="text-[14px] font-medium leading-[1.5] text-white" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.12);">Log in</span>
          </button>

          <!-- Separator -->
          <div class="flex w-full items-center justify-center gap-[18px]">
            <div class="h-px min-w-px flex-1 bg-[#e5e6ea]"></div>
            <span class="text-[12px] leading-[1.5] text-[#61667c]">Or</span>
            <div class="h-px min-w-px flex-1 bg-[#e5e6ea]"></div>
          </div>

          <!-- Log in with Google -->
          <button
            type="button"
            class="flex h-[36px] w-full items-center justify-center rounded-[8px] border border-[#f2f2f4] px-[12px] transition-transform duration-100 active:translate-y-[1px]"
            style="background: linear-gradient(to bottom, #ffffff, #f2f2f2); box-shadow: 0px 1.5px 0px 0px #e5e5e5;"
            :disabled="!!loggingIn"
            :aria-busy="loggingIn === 'google'"
            @click="login('google')"
          >
            <span v-if="loggingIn === 'google'" class="login-spinner login-spinner--dark" aria-hidden="true"></span>
            <span v-else class="flex items-center gap-[8px]">
              <span class="relative h-[18px] w-[14px] shrink-0">
                <img :src="googleIcon" alt="" class="absolute left-[-2px] top-0 size-[18px] max-w-none" />
              </span>
              <span class="text-[14px] font-medium leading-[1.5] text-[#61667c]" style="text-shadow: 0px 1px 1px rgba(0,0,0,0.08);">Log in with Google</span>
            </span>
          </button>

          <!-- Sign up -->
          <p class="w-full text-center text-[14px] leading-[1.5]">
            <span class="text-[#61667c]">Don&rsquo;t have account? Please </span><a href="#" class="text-[#2465de]" @click.prevent>sign up</a>
          </p>
        </form>
      </div>
    </section>

    <!-- Right: welcome banner — expands to full width for business selection -->
    <section class="auth-right relative h-full min-w-0 overflow-hidden bg-white">
      <!-- Blur decoration: percentage-sized so it scales with the panel
           (622px → 826px-wide blur, matching the login design; grows with the
           panel as it expands to full screen) -->
      <div
        class="pointer-events-none absolute top-0"
        style="left: -19.29%; width: 132.82%; aspect-ratio: 826.123 / 332.032; transform: translateY(-55.41%);"
      >
        <img :src="blurImage" alt="" class="absolute block max-w-none" style="left: -27.68%; top: -68.86%; width: 155.36%; height: 237.72%;" />
      </div>

      <!-- Banner layer (login stage) -->
      <div class="auth-banner absolute inset-0" :aria-hidden="isChoose">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="flex items-end" style="gap: 14.39px;">
            <img :src="logogram" alt="" style="width: 43.908px; height: 43.851px;" />
            <img :src="logotext" alt="HitPay" style="width: 121.702px; height: 37.271px;" />
          </div>
        </div>

        <div class="absolute bottom-0 left-0 h-[154px] w-full border-t border-[#e5e6ea] bg-white">
          <div class="absolute bottom-[64px] left-1/2 flex w-max -translate-x-1/2 items-center gap-[80px]">
            <div class="flex shrink-0 flex-col items-center gap-[8px]">
              <p class="whitespace-nowrap text-[28px] font-semibold leading-none text-[#03102f]">15,000+</p>
              <p class="text-[14px] font-medium leading-[1.5] text-[#9295a5]">Businesses</p>
            </div>
            <div class="flex shrink-0 flex-col items-center justify-center gap-[8px]">
              <div class="flex h-[28px] items-center gap-[4px]">
                <span class="relative h-[20px] w-[19px] shrink-0 overflow-hidden">
                  <img :src="trustpilotStars" alt="" class="absolute max-w-none" style="left: 0; top: 5%; width: 102.63%; height: 90%;" />
                </span>
                <p class="whitespace-nowrap text-[28px] font-semibold leading-none text-[#03102f]">4.7</p>
              </div>
              <img :src="trustpilotLogo" alt="Trustpilot" class="max-w-none" style="width: 88px; height: 22px;" />
            </div>
            <div class="flex shrink-0 flex-col items-center justify-center gap-[8px]">
              <p class="flex h-[28px] items-center whitespace-nowrap text-[14px] font-medium leading-[1.5] text-[#9295a5]">Backed by</p>
              <img :src="ycLogo" alt="Y Combinator" class="max-w-none" style="width: 113.204px; height: 22px;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Business selection layer (choose stage) -->
      <div class="auth-business absolute inset-0" :aria-hidden="!isChoose">
        <div class="absolute left-1/2 top-[120px] flex w-max -translate-x-1/2 flex-col items-center gap-[24px]">
          <!-- Logo -->
          <div class="flex items-end" style="gap: 7.995px;">
            <img :src="logogram" alt="" style="width: 24.393px; height: 24.362px;" />
            <img :src="logotext" alt="HitPay" style="width: 67.612px; height: 20.706px;" />
          </div>

          <!-- Modal card -->
          <div class="flex w-[480px] flex-col overflow-hidden rounded-[16px] bg-white pb-[28px]" style="box-shadow: 0px 3px 22px 0px rgba(38, 42, 50, 0.09);">
            <!-- Title + account -->
            <div class="flex w-full items-center gap-[16px] px-[24px] pb-[24px] pt-[16px]">
              <h1 class="min-w-px flex-1 text-[18px] font-medium leading-[1.35] text-[#03102f]">Choose business</h1>
              <div class="flex shrink-0 items-center gap-[8px] rounded-[8px] border border-[#e5e6ea] bg-white px-[12px] py-[8px]">
                <span class="flex size-[32px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#cbcdd4] bg-[#343848]">
                  <span class="text-[14px] font-bold leading-[20px] tracking-[0.15px] text-white" style="text-shadow: 0px 0.5px 0.5px rgba(0,0,0,0.06);">A</span>
                </span>
                <span class="flex flex-col items-start">
                  <span class="text-[14px] font-medium leading-[1.5] text-[#03102f]">Alex Turner</span>
                  <span class="text-[12px] font-medium leading-[1.5] text-[#61667c]">alex@arcticmonkey.io</span>
                </span>
              </div>
            </div>

            <!-- Businesses -->
            <div class="flex w-full flex-col items-center gap-[12px] px-[24px]">
              <button
                type="button"
                class="biz-card flex w-full items-center gap-[12px] rounded-[12px] border border-[#e5e6ea] bg-white px-[20px] py-[16px] text-left"
                :tabindex="isChoose ? 0 : -1"
                @click="choose"
              >
                <span class="size-[40px] shrink-0 overflow-hidden rounded-full border border-[#cbcdd4]">
                  <img :src="avatarGadgetBean" alt="" class="size-full object-cover" />
                </span>
                <span class="min-w-px flex-1 text-[16px] font-medium leading-[1.4] text-[#03102f]">Gadget Bean</span>
              </button>

              <div class="flex w-full cursor-default flex-col gap-[12px] rounded-[12px] border border-[#f4b840] bg-[#fff9ec] px-[20px] py-[16px]">
                <div class="flex w-full items-center gap-[12px]">
                  <span class="flex size-[40px] shrink-0 items-center justify-center rounded-full border border-[#cbcdd4] bg-[#002771]">
                    <span class="text-[16px] font-bold leading-[24px] text-white" style="text-shadow: 0px 0.625px 0.625px rgba(0,0,0,0.06);">H</span>
                  </span>
                  <span class="min-w-px flex-1 text-[16px] font-medium leading-[1.4] text-[#03102f]">Hay Dairies</span>
                  <span class="shrink-0 text-[12px] leading-[1.5] text-[#61667c]">Payment are disabled</span>
                </div>
                <div class="flex w-full items-center justify-center rounded-[8px] border border-[#ffe0a2] p-[4px]" style="background: rgba(244, 184, 64, 0.1);">
                  <p class="min-w-px flex-1 text-center text-[12px] leading-[1.5] text-[#03102f]">This business is currently dormant due to inactivity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Help button -->
        <button
          type="button"
          class="absolute bottom-[32px] right-[32px] flex rounded-full bg-[#03102f] p-[4px] transition-opacity duration-150 hover:opacity-90"
          aria-label="Help"
          :tabindex="isChoose ? 0 : -1"
        >
          <img :src="questionIcon" alt="" class="size-[32px]" />
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'
import googleIcon from '../../assets/icons/icon-google.svg'
import logogram from '../../assets/images/login/logogram.svg'
import logotext from '../../assets/images/login/logotext.svg'
import blurImage from '../../assets/images/login/blur.svg'
import trustpilotStars from '../../assets/images/login/trustpilot-stars.svg'
import trustpilotLogo from '../../assets/images/login/trustpilot-logo.svg'
import ycLogo from '../../assets/images/login/y-combinator.svg'
import avatarGadgetBean from '../../assets/images/login/avatar-gadget-bean.jpg'
import questionIcon from '../../assets/images/login/icon-question.svg'

const route = useRoute()
const router = useRouter()
const { loggedIn } = useAuth()

// /login and /choose-business both render this component (same key in App.vue),
// so switching stages animates in place instead of swapping pages.
const isChoose = computed(() => route.name === 'choose-business')

const email = ref('alexblake@babibu.com')
const password = ref('')
const passwordVisible = ref(false)

// Which button is showing its loading spinner: null | 'password' | 'google'
const loggingIn = ref(null)

function login(source = 'password') {
  if (loggingIn.value) return
  loggingIn.value = source
  // Fake auth round-trip before moving on to business selection
  setTimeout(() => {
    loggedIn.value = true
    loggingIn.value = null
    router.push({ name: 'choose-business' })
  }, 900)
}

function choose() {
  router.push({ name: 'overview' })
}
</script>

<style scoped>
/* ── Stage choreography (see /motion) ───────────────────────────────────────
   Login → choose: the form and banner fade out fast while the right panel
   expands on an accelerate curve (eases in, arrives fast). Once the panel is
   full screen, the business content rises in from the bottom on the hero
   curve (ease-out-expo).
   Choose → login: the reverse, with the same fast-out / slow-in weighting. */

.auth-left {
  flex: 1 1 0px;
  transition: flex-grow 450ms cubic-bezier(0.32, 0, 0.67, 0);
}
.stage-choose .auth-left { flex-grow: 0; }

.auth-right {
  flex: 0 0 622px;
  transition: flex-grow 450ms cubic-bezier(0.32, 0, 0.67, 0);
}
.stage-choose .auth-right { flex-grow: 1; }

.auth-form-holder { opacity: 1; transition: opacity 300ms cubic-bezier(0.32, 0.72, 0, 1) 200ms; }
.stage-choose .auth-form-holder { opacity: 0; pointer-events: none; transition: opacity 130ms ease; }

.auth-banner { opacity: 1; transition: opacity 300ms cubic-bezier(0.32, 0.72, 0, 1) 200ms; }
.stage-choose .auth-banner { opacity: 0; pointer-events: none; transition: opacity 150ms ease; }

/* Hidden below its resting spot; waits for the expansion (450ms) to finish,
   then rises bottom → up */
.auth-business { opacity: 0; transform: translateY(48px); pointer-events: none; transition: opacity 120ms ease, transform 120ms ease; }
.stage-choose .auth-business {
  opacity: 1; transform: none; pointer-events: auto;
  transition: opacity 400ms cubic-bezier(0.32, 0.72, 0, 1) 450ms, transform 720ms cubic-bezier(0.16, 1, 0.3, 1) 450ms;
}

@media (prefers-reduced-motion: reduce) {
  .auth-left, .auth-right, .auth-form-holder, .auth-banner, .auth-business { transition: none; }
  .auth-business { transform: none; }
}

/* Shared form-field control — same pattern as BillDetailsPage / HitPayPasswordModal */
.aba-control {
  position: relative; display: flex; align-items: center; width: 100%; height: 36px;
  background: white; border: 1px solid #e5e6ea; border-radius: 8px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1.5px 1.5px 0px rgba(0,0,0,0.09);
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.aba-control:focus-within { border-color: #2465de; box-shadow: 0px 0px 0px 3px #b3cdfe, inset 0px 2px 4px 0px rgba(0,0,0,0.24); }
.aba-input { flex: 1; min-width: 0; height: 100%; background: transparent; border: none; outline: none; padding: 0 8px; font-size: 14px; line-height: 1.5; color: #03102f; }
.aba-input::placeholder { color: #9295a5; }

/* Button loading spinner */
.login-spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid; border-color: currentColor;
  animation: login-spin 600ms linear infinite;
}
.login-spinner--light { border-color: rgba(255,255,255,0.35); border-top-color: #ffffff; }
.login-spinner--dark { border-color: rgba(97,102,124,0.25); border-top-color: #61667c; }
@keyframes login-spin { to { transform: rotate(360deg); } }

/* Business card hover/press — quick colour shift + press feedback per /motion */
.biz-card { transition: border-color 150ms ease, box-shadow 150ms ease, transform 100ms ease; }
.biz-card:hover { border-color: #cbcdd4; box-shadow: 0px 3px 11px 0px rgba(38, 42, 50, 0.06); }
.biz-card:active { transform: translateY(1px); }
@media (prefers-reduced-motion: reduce) {
  .biz-card { transition: none; }
  .biz-card:active { transform: none; }
}
</style>
