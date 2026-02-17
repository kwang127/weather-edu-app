<template>
  <div class="admin-page">
    <header class="admin-header">
      <button class="back-btn" @click="$emit('back')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        返回
      </button>
      <h1 class="admin-title">管理设置</h1>
      <button class="preview-btn" @click="showPreview = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
        预览
      </button>
    </header>

    <!-- Tab navigation -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </div>

    <div class="admin-body">
      <!-- Cities Tab -->
      <div v-if="activeTab === 'cities'" class="tab-content">
        <div class="section-header">
          <span>城市列表</span>
          <button class="add-btn" @click="showAddCity = true">+ 添加城市</button>
        </div>

        <div
          v-for="c in store.cities"
          :key="c.id"
          class="city-item"
          :class="{ selected: selectedCityId === c.id }"
          @click="selectedCityId = c.id"
        >
          <div class="city-item-info">
            <span class="city-item-name">{{ c.name }}</span>
            <span class="city-item-weather">{{ weatherLabels[c.weatherType] }} {{ c.temperature }}°</span>
          </div>
          <button
            v-if="store.cities.length > 1"
            class="delete-btn"
            @click.stop="deleteCity(c.id)"
          >删除</button>
        </div>

        <!-- City editor -->
        <template v-if="selectedCity">
          <div class="editor-section">
            <h3 class="editor-title">编辑：{{ selectedCity.name }}</h3>

            <label class="field-label">城市名称</label>
            <input v-model="selectedCity.name" class="field-input" />

            <label class="field-label">天气类型</label>
            <select v-model="selectedCity.weatherType" class="field-input">
              <option v-for="wt in weatherTypes" :key="wt" :value="wt">{{ weatherLabels[wt] }}</option>
            </select>

            <label class="field-label">当前温度</label>
            <input v-model.number="selectedCity.temperature" type="number" min="-50" max="50" class="field-input" @input="validateTemp('temperature')" />
            <div v-if="tempErrors.temperature" class="field-error">{{ tempErrors.temperature }}</div>

            <label class="field-label">最高温度</label>
            <input v-model.number="selectedCity.high" type="number" min="-50" max="50" class="field-input" @input="validateTemp('high')" />
            <div v-if="tempErrors.high" class="field-error">{{ tempErrors.high }}</div>

            <label class="field-label">最低温度</label>
            <input v-model.number="selectedCity.low" type="number" min="-50" max="50" class="field-input" @input="validateTemp('low')" />
            <div v-if="tempErrors.low" class="field-error">{{ tempErrors.low }}</div>

            <label class="field-label">穿着推荐</label>
            <input v-model="selectedCity.clothingTip" class="field-input" />

            <label class="field-label">穿着图标</label>
            <div class="icon-picker">
              <button
                v-for="icon in clothingIcons"
                :key="icon.id"
                class="icon-pick-btn"
                :class="{ active: selectedCity.clothingIcon === icon.id }"
                @click="selectedCity!.clothingIcon = icon.id"
                :title="icon.label"
              >
                <img :src="icon.src" :alt="icon.label" width="28" height="28" />
                <span class="icon-pick-label">{{ icon.label }}</span>
              </button>
            </div>

            <!-- Forecast editor -->
            <div class="forecast-editor">
              <div class="section-header">
                <span>未来天气预报</span>
                <button class="add-btn" @click="addForecastDay">+ 添加</button>
              </div>
              <div v-for="(day, idx) in selectedCity.forecast" :key="idx" class="forecast-edit-item">
                <div class="forecast-edit-top">
                  <input v-model="day.dayLabel" class="field-input" placeholder="日期" style="flex:1" />
                  <select v-model="day.weatherType" class="field-input" style="flex:1.5">
                    <option v-for="wt in weatherTypes" :key="wt" :value="wt">{{ weatherLabels[wt] }}</option>
                  </select>
                  <button class="delete-btn small" @click="selectedCity!.forecast.splice(idx, 1)">×</button>
                </div>
                <div class="forecast-edit-bottom">
                  <label class="inline-label">最高</label>
                  <input v-model.number="day.high" type="number" class="field-input tiny" />
                  <label class="inline-label">最低</label>
                  <input v-model.number="day.low" type="number" class="field-input tiny" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Presets Tab -->
      <div v-if="activeTab === 'presets'" class="tab-content">
        <div class="section-header">
          <span>预设场景</span>
          <button class="add-btn" @click="showCreatePreset = true">+ 新建预设</button>
        </div>

        <div v-if="selectedCity" class="preset-hint">当前城市：{{ selectedCity.name }}</div>

        <div v-for="preset in store.presets" :key="preset.id" class="preset-item" :class="{ 'preset-applied': selectedCity && selectedCity.appliedPresetId === preset.id }">
          <div class="preset-info">
            <span class="preset-name">
              {{ preset.name }}
              <span v-if="selectedCity && selectedCity.appliedPresetId === preset.id" class="preset-applied-tag">当前</span>
            </span>
            <span class="preset-badge" v-if="preset.builtIn">内置</span>
            <span class="preset-detail">{{ weatherLabels[preset.weatherType] }} {{ preset.temperature }}°</span>
          </div>
          <div class="preset-actions">
            <button class="action-btn" @click="applyPresetToCity(preset.id)" :disabled="!selectedCity">应用</button>
            <button v-if="!preset.builtIn" class="delete-btn small" @click="doRemovePreset(preset.id)">删除</button>
          </div>
        </div>

        <!-- Create preset dialog -->
        <div v-if="showCreatePreset" class="modal-overlay" @click.self="showCreatePreset = false">
          <div class="modal-box wide">
            <div class="modal-title">新建预设</div>
            <label class="field-label">预设名称</label>
            <input v-model="newPreset.name" class="modal-input" placeholder="如：暴风雨天" />
            <label class="field-label">天气类型</label>
            <select v-model="newPreset.weatherType" class="field-input">
              <option v-for="wt in weatherTypes" :key="wt" :value="wt">{{ weatherLabels[wt] }}</option>
            </select>
            <label class="field-label">温度</label>
            <input v-model.number="newPreset.temperature" type="number" class="modal-input" />
            <label class="field-label">最高温</label>
            <input v-model.number="newPreset.high" type="number" class="modal-input" />
            <label class="field-label">最低温</label>
            <input v-model.number="newPreset.low" type="number" class="modal-input" />
            <label class="field-label">穿着推荐</label>
            <input v-model="newPreset.clothingTip" class="modal-input" />
            <label class="field-label">穿着图标</label>
            <div class="icon-picker">
              <button
                v-for="icon in clothingIcons"
                :key="icon.id"
                class="icon-pick-btn"
                :class="{ active: newPreset.clothingIcon === icon.id }"
                @click="newPreset.clothingIcon = icon.id"
                :title="icon.label"
              >
                <img :src="icon.src" :alt="icon.label" width="28" height="28" />
                <span class="icon-pick-label">{{ icon.label }}</span>
              </button>
            </div>
            <div class="modal-actions">
              <button class="modal-btn cancel" @click="showCreatePreset = false">取消</button>
              <button class="modal-btn confirm" @click="doCreatePreset">创建</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Display Tab -->
      <div v-if="activeTab === 'display'" class="tab-content">
        <h3 class="editor-title">模块显示控制</h3>
        <div class="toggle-row" v-for="item in displayToggles" :key="item.key">
          <span>{{ item.label }}</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="store.displaySettings[item.key]" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </Transition>

    <!-- Add city dialog -->
    <div v-if="showAddCity" class="modal-overlay" @click.self="showAddCity = false">
      <div class="modal-box">
        <div class="modal-title">添加城市</div>
        <input v-model="newCityName" class="modal-input" placeholder="输入城市名称" @keyup.enter="doAddCity" />
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showAddCity = false">取消</button>
          <button class="modal-btn confirm" @click="doAddCity">添加</button>
        </div>
      </div>
    </div>

    <!-- Preview overlay -->
    <Transition name="preview">
      <div v-if="showPreview" class="preview-overlay">
        <div class="preview-header">
          <span class="preview-title">学生界面预览</span>
          <button class="preview-close-btn" @click="showPreview = false">关闭</button>
        </div>
        <div class="preview-frame">
          <WeatherPage @enter-admin="() => {}" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { store, addCity, removeCity, applyPreset, addPreset, removePreset } from '@/store'
import { WEATHER_LABELS, WEATHER_TYPES } from '@/utils/weather-config'
import { CLOTHING_ICONS } from '@/utils/clothing-icons'
import WeatherPage from '@/components/weather/WeatherPage.vue'
import type { DisplaySettings, ClothingIcon } from '@/types/weather'

defineEmits<{ (e: 'back'): void }>()

const weatherLabels = WEATHER_LABELS
const weatherTypes = WEATHER_TYPES
const clothingIcons = CLOTHING_ICONS

const activeTab = ref<'cities' | 'presets' | 'display'>('cities')
const tabs = [
  { id: 'cities' as const, label: '城市管理' },
  { id: 'presets' as const, label: '预设场景' },
  { id: 'display' as const, label: '显示设置' },
]

// City management
const selectedCityId = ref(store.cities[0]?.id || '')
const selectedCity = computed(() => store.cities.find((c) => c.id === selectedCityId.value))

const showAddCity = ref(false)
const newCityName = ref('')
const showPreview = ref(false)

function doAddCity() {
  const name = newCityName.value.trim()
  if (!name) return
  const city = addCity(name)
  selectedCityId.value = city.id
  newCityName.value = ''
  showAddCity.value = false
}

function deleteCity(id: string) {
  removeCity(id)
  if (selectedCityId.value === id) {
    selectedCityId.value = store.cities[0]?.id || ''
  }
}

function addForecastDay() {
  if (!selectedCity.value) return
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const existingCount = selectedCity.value.forecast.length
  const date = new Date()
  date.setDate(date.getDate() + existingCount + 1)
  const label = existingCount === 0 ? '明天' : existingCount === 1 ? '后天' : weekdays[date.getDay()]
  selectedCity.value.forecast.push({
    dayLabel: label,
    weatherType: 'sunny',
    high: 25,
    low: 15,
  })
}

// Presets
const showCreatePreset = ref(false)
const newPreset = reactive({
  name: '',
  weatherType: 'sunny' as const,
  timeOfDay: 'day' as const,
  temperature: 25,
  high: 30,
  low: 18,
  clothingTip: '',
  clothingIcon: 'tshirt' as ClothingIcon,
  forecast: [] as any[],
})

let isApplyingPreset = false

function applyPresetToCity(presetId: string) {
  if (!selectedCity.value) return
  const preset = store.presets.find((p) => p.id === presetId)
  isApplyingPreset = true
  applyPreset(selectedCity.value.id, presetId)
  showToast(`已应用「${preset?.name || '预设'}」`)
  // Reset flag after Vue reactivity flushes
  setTimeout(() => { isApplyingPreset = false }, 0)
}

function doCreatePreset() {
  if (!newPreset.name.trim()) return
  addPreset({ ...newPreset, forecast: [] })
  showCreatePreset.value = false
  newPreset.name = ''
  newPreset.temperature = 25
  newPreset.high = 30
  newPreset.low = 18
  newPreset.clothingTip = ''
  newPreset.clothingIcon = 'tshirt'
}

function doRemovePreset(id: string) {
  removePreset(id)
}

// Temperature validation
const tempErrors = reactive<Record<string, string>>({
  temperature: '',
  high: '',
  low: '',
})

function validateTemp(field: 'temperature' | 'high' | 'low') {
  if (!selectedCity.value) return
  const val = selectedCity.value[field]
  if (typeof val !== 'number' || isNaN(val)) {
    tempErrors[field] = '请输入有效数字'
  } else if (val < -50 || val > 50) {
    tempErrors[field] = '温度范围：-50 到 50'
    selectedCity.value[field] = Math.max(-50, Math.min(50, val))
  } else {
    tempErrors[field] = ''
  }
}

// Display toggles
const displayToggles: { key: keyof DisplaySettings; label: string }[] = [
  { key: 'showDate', label: '日期和星期' },
  { key: 'showTempRange', label: '最高/最低温度' },
  { key: 'showForecast', label: '未来天气预报' },
  { key: 'showClothing', label: '穿着推荐' },
]

// Toast notification
const toastMsg = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string) {
  toastMsg.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 1500)
}

// Auto-save toast (debounced) + clear preset status on manual edit
let saveTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => selectedCity.value ? JSON.stringify(selectedCity.value) : '',
  () => {
    if (!selectedCity.value) return
    if (!isApplyingPreset && selectedCity.value.appliedPresetId) {
      selectedCity.value.appliedPresetId = undefined
    }
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => showToast('已自动保存'), 800)
  },
)
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: #0f0f1a;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top, 0));
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #4A90D9;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  min-height: 44px;
}
.admin-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding: 0 16px;
}
.tab-btn {
  flex: 1;
  padding: 12px 8px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(255,255,255,0.5);
  font-size: 14px;
  cursor: pointer;
  min-height: 44px;
}
.tab-btn.active {
  color: #4A90D9;
  border-bottom-color: #4A90D9;
}

.admin-body {
  padding: 16px;
  padding-bottom: 40px;
  max-width: 500px;
  margin: 0 auto;
  overflow-y: auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
}
.add-btn {
  background: #4A90D9;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  min-height: 36px;
}

.city-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  border: 2px solid transparent;
}
.city-item.selected {
  border-color: #4A90D9;
}
.city-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.city-item-name {
  font-size: 16px;
  font-weight: 500;
}
.city-item-weather {
  font-size: 13px;
  opacity: 0.5;
}

.delete-btn {
  background: rgba(255,80,80,0.2);
  color: #ff6b6b;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 13px;
  cursor: pointer;
  min-height: 36px;
}
.delete-btn.small {
  padding: 4px 8px;
  min-height: 28px;
  font-size: 16px;
}

.editor-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.editor-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px;
}

.field-label {
  display: block;
  font-size: 13px;
  opacity: 0.6;
  margin: 12px 0 4px;
}
.field-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
}
.field-input:focus {
  border-color: #4A90D9;
}
.field-error {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 2px;
}
.field-input.small {
  width: auto;
  flex: 1;
  min-width: 0;
}
.field-input.tiny {
  width: 70px;
  flex: none;
  text-align: center;
}

/* Icon picker */
.icon-picker {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-top: 4px;
}
.icon-pick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  background: rgba(255,255,255,0.06);
  border: 2px solid transparent;
  border-radius: 10px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  min-height: 56px;
}
.icon-pick-btn.active {
  border-color: #4A90D9;
  color: #fff;
  background: rgba(74,144,217,0.15);
}
.icon-pick-label {
  font-size: 11px;
}

select.field-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
  color-scheme: dark;
}
select.field-input option {
  background: #1c1c2e;
  color: #fff;
}

/* Forecast editor */
.forecast-editor {
  margin-top: 16px;
}
.forecast-edit-item {
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
}
.forecast-edit-top {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.forecast-edit-bottom {
  display: flex;
  gap: 8px;
  align-items: center;
}
.inline-label {
  font-size: 13px;
  opacity: 0.6;
  white-space: nowrap;
}

/* Presets */
.preset-hint {
  font-size: 13px;
  opacity: 0.5;
  margin-bottom: 12px;
}
.preset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  margin-bottom: 8px;
  border: 2px solid transparent;
}
.preset-item.preset-applied {
  border-color: #4A90D9;
  background: rgba(74,144,217,0.08);
}
.preset-applied-tag {
  display: inline-block;
  font-size: 11px;
  background: #4A90D9;
  color: #fff;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
  vertical-align: middle;
}
.preset-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.preset-name {
  font-size: 15px;
  font-weight: 500;
}
.preset-badge {
  display: inline-block;
  font-size: 11px;
  background: rgba(74,144,217,0.2);
  color: #4A90D9;
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
}
.preset-detail {
  font-size: 13px;
  opacity: 0.5;
}
.preset-actions {
  display: flex;
  gap: 6px;
}
.action-btn {
  background: #4A90D9;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  min-height: 36px;
}
.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Toggle switch */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 16px;
}
.toggle-switch {
  position: relative;
  width: 50px;
  height: 28px;
  display: inline-block;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.15);
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.3s;
}
.toggle-slider::before {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}
.toggle-switch input:checked + .toggle-slider {
  background: #4A90D9;
}
.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
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
}
.modal-box.wide {
  width: 340px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  text-align: center;
}
.modal-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 8px;
}
.modal-input:focus {
  border-color: #4A90D9;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.modal-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  min-height: 44px;
}
.modal-btn.cancel {
  background: rgba(255,255,255,0.15);
  color: #fff;
}
.modal-btn.confirm {
  background: #4A90D9;
  color: #fff;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #fff;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 200;
  pointer-events: none;
}
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* Preview button */
.preview-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #4A90D9;
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
  min-height: 44px;
}

/* Preview overlay */
.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: #000;
  display: flex;
  flex-direction: column;
}
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(12px + env(safe-area-inset-top, 0));
  background: rgba(15, 15, 26, 0.95);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  flex-shrink: 0;
}
.preview-title {
  font-size: 15px;
  color: rgba(255,255,255,0.7);
}
.preview-close-btn {
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
  min-height: 36px;
}
.preview-frame {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* Preview transitions */
.preview-enter-active,
.preview-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.preview-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.preview-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
