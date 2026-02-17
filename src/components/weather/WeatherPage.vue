<template>
  <div
    class="weather-page"
    :style="{ background: backgroundGradient }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <WeatherAnimation :type="city.weatherType" />

    <Transition :name="slideDirection" mode="out-in">
      <div class="weather-content" :key="city.id">
      <!-- City name (long press to enter admin) -->
      <div
        class="city-name"
        @touchstart.stop="startLongPress"
        @touchend.stop="cancelLongPress"
        @mousedown="startLongPress"
        @mouseup="cancelLongPress"
        @mouseleave="cancelLongPress"
      >
        {{ city.name }}
      </div>

      <!-- Date -->
      <div v-if="displaySettings.showDate" class="date-text">
        {{ formattedDate }}
      </div>

      <!-- Hero: icon (primary) + description + temperature (secondary) -->
      <div class="hero-section">
        <WeatherIcon :type="city.weatherType" :size="120" />
        <div class="weather-desc">{{ weatherLabel }}</div>
        <div class="temperature">{{ city.temperature }}°</div>
      </div>

      <!-- High / Low -->
      <div v-if="displaySettings.showTempRange" class="temp-range">
        最高 {{ city.high }}° &nbsp; 最低 {{ city.low }}°
      </div>

      <!-- Forecast -->
      <div v-if="displaySettings.showForecast && city.forecast.length > 0" class="glass-card forecast-card">
        <div class="card-title">未来天气</div>
        <div
          v-for="(day, idx) in city.forecast"
          :key="idx"
          class="forecast-row"
        >
          <span class="forecast-day">{{ day.dayLabel }}</span>
          <WeatherIcon :type="day.weatherType" :size="28" />
          <span class="forecast-temps">
            <span class="forecast-high">{{ day.high }}°</span>
            <span class="forecast-low">{{ day.low }}°</span>
          </span>
        </div>
      </div>

      <!-- Clothing tip -->
      <div v-if="displaySettings.showClothing && city.clothingTip" class="glass-card clothing-card">
        <div class="card-title">穿着建议</div>
        <div class="clothing-content">
          <component :is="clothingIconComponent" :size="32" class="clothing-icon" />
          <span>{{ city.clothingTip }}</span>
        </div>
      </div>

      <!-- TTS button -->
      <button class="tts-button glass-card" @click="speak" aria-label="语音播报天气">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M11 5L6 9H2v6h4l5 4V5z" fill="rgba(255,255,255,0.9)"/>
          <path d="M15.54 8.46a5 5 0 010 7.07" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M19.07 4.93a10 10 0 010 14.14" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span>语音播报</span>
      </button>
    </div>
    </Transition>

    <!-- City dots indicator -->
    <div v-if="cities.length > 1" class="city-dots">
      <span
        v-for="(c, idx) in cities"
        :key="c.id"
        class="dot"
        :class="{ active: idx === activeCityIndex }"
      />
    </div>

    <!-- Password dialog -->
    <div v-if="showPasswordDialog" class="modal-overlay" @click.self="showPasswordDialog = false">
      <div class="modal-box">
        <div class="modal-title">输入管理密码</div>
        <input
          v-model="passwordInput"
          type="password"
          class="modal-input"
          placeholder="请输入密码"
          maxlength="10"
          @keyup.enter="checkPassword"
        />
        <div v-if="passwordError" class="modal-error">密码错误</div>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showPasswordDialog = false">取消</button>
          <button class="modal-btn confirm" @click="checkPassword">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { store } from '@/store'
import { WEATHER_LABELS, getWeatherGradient } from '@/utils/weather-config'
import { CLOTHING_ICON_MAP } from '@/utils/clothing-icons'
import WeatherIcon from '@/components/icons/WeatherIcon.vue'
import WeatherAnimation from './WeatherAnimation.vue'

const emit = defineEmits<{
  (e: 'enter-admin'): void
}>()

const cities = computed(() => store.cities)
const activeCityIndex = computed(() => store.activeCityIndex)
const city = computed(() => store.cities[store.activeCityIndex])
const displaySettings = computed(() => store.displaySettings)

const backgroundGradient = computed(() =>
  getWeatherGradient(city.value.weatherType, city.value.timeOfDay)
)

const weatherLabel = computed(() => WEATHER_LABELS[city.value.weatherType])

const formattedDate = computed(() => {
  const now = new Date()
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`
})

const clothingIconComponent = computed(() =>
  CLOTHING_ICON_MAP[city.value.clothingIcon] || CLOTHING_ICON_MAP['shirt']
)

// Swipe handling
const slideDirection = ref('slide-left')
let touchStartX = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}
function onTouchEnd(e: TouchEvent) {
  const diff = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(diff) < 50) return
  if (diff < 0 && store.activeCityIndex < store.cities.length - 1) {
    slideDirection.value = 'slide-left'
    store.activeCityIndex++
  } else if (diff > 0 && store.activeCityIndex > 0) {
    slideDirection.value = 'slide-right'
    store.activeCityIndex--
  }
}

// Long press for admin
let longPressTimer: ReturnType<typeof setTimeout> | null = null
const showPasswordDialog = ref(false)
const passwordInput = ref('')
const passwordError = ref(false)

function startLongPress() {
  longPressTimer = setTimeout(() => {
    showPasswordDialog.value = true
    passwordInput.value = ''
    passwordError.value = false
  }, 3000)
}
function cancelLongPress() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}
function checkPassword() {
  if (passwordInput.value === store.password) {
    showPasswordDialog.value = false
    emit('enter-admin')
  } else {
    passwordError.value = true
  }
}

// TTS
function speak() {
  const text = `${city.value.name}，今天${weatherLabel.value}，当前温度${city.value.temperature}度，最高${city.value.high}度，最低${city.value.low}度。${city.value.clothingTip || ''}`
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.85
  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}
</script>

<style scoped>
.weather-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition: background 0.8s ease;
  overflow-x: hidden;
}

.weather-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 24px 120px;
  padding-top: calc(60px + env(safe-area-inset-top, 0));
  max-width: 428px;
  margin: 0 auto;
}

.city-name {
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 1px;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
}

.date-text {
  font-size: 14px;
  font-weight: 300;
  opacity: 0.75;
  margin-top: 4px;
}

.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}

.weather-desc {
  font-size: 20px;
  font-weight: 400;
  margin-top: 8px;
  opacity: 0.9;
}

.temperature {
  font-size: 64px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -2px;
  margin-top: 4px;
  opacity: 0.9;
}

.temp-range {
  font-size: 16px;
  font-weight: 300;
  opacity: 0.7;
  margin-top: 8px;
}

/* Glass card */
.glass-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
}

.card-title {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
  margin-bottom: 12px;
}

/* Forecast */
.forecast-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.forecast-row:last-child {
  border-bottom: none;
}
.forecast-day {
  flex: 1;
  font-size: 16px;
  font-weight: 400;
}
.forecast-temps {
  display: flex;
  gap: 16px;
  font-size: 16px;
  margin-left: 12px;
}
.forecast-high {
  font-weight: 400;
}
.forecast-low {
  font-weight: 300;
  opacity: 0.6;
}

/* Clothing */
.clothing-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 300;
}
.clothing-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

/* TTS button */
.tts-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 15px;
  font-weight: 400;
  cursor: pointer;
  border: none;
  min-height: 48px;
}
.tts-button:active {
  background: rgba(255, 255, 255, 0.25);
}

/* City dots */
.city-dots {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: background 0.3s, transform 0.3s;
}
.dot.active {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-box {
  background: #1c1c2e;
  border-radius: 16px;
  padding: 24px;
  width: 300px;
  text-align: center;
}
.modal-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #fff;
}
.modal-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 18px;
  text-align: center;
  outline: none;
  box-sizing: border-box;
}
.modal-input:focus {
  border-color: rgba(255, 255, 255, 0.5);
}
.modal-error {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.modal-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.modal-btn.confirm {
  background: #4A90D9;
  color: #fff;
}

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-left-enter-from {
  transform: translateX(60px);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-60px);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translateX(-60px);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(60px);
  opacity: 0;
}
</style>
