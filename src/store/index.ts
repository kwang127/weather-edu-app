import { reactive, watch } from 'vue'
import type { AppState, CityWeather, Preset } from '@/types/weather'

const STORAGE_KEY = 'weather-edu-app-state'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function createDefaultCity(): CityWeather {
  return {
    id: generateId(),
    name: '北京',
    weatherType: 'sunny',
    timeOfDay: 'day',
    temperature: 26,
    high: 30,
    low: 18,
    clothingTip: '天气晴朗，建议穿短袖',
    clothingIcon: 'tshirt',
    forecast: [
      { dayLabel: '明天', weatherType: 'sunny', high: 31, low: 19 },
      { dayLabel: '后天', weatherType: 'cloudy', high: 28, low: 17 },
    ],
  }
}

function createBuiltInPresets(): Preset[] {
  return [
    {
      id: 'preset-summer-sunny',
      name: '夏日晴天',
      builtIn: true,
      weatherType: 'sunny',
      timeOfDay: 'day',
      temperature: 35,
      high: 38,
      low: 26,
      clothingTip: '天气炎热，建议穿短袖短裤，注意防晒',
      clothingIcon: 'tshirt',
      forecast: [
        { dayLabel: '明天', weatherType: 'sunny', high: 37, low: 27 },
        { dayLabel: '后天', weatherType: 'sunny', high: 36, low: 25 },
        { dayLabel: '第三天', weatherType: 'cloudy', high: 34, low: 24 },
      ],
    },
    {
      id: 'preset-spring-rain',
      name: '春天下雨',
      builtIn: true,
      weatherType: 'light-rain',
      timeOfDay: 'day',
      temperature: 16,
      high: 20,
      low: 12,
      clothingTip: '下雨天，记得带伞，穿外套',
      clothingIcon: 'umbrella',
      forecast: [
        { dayLabel: '明天', weatherType: 'light-rain', high: 18, low: 11 },
        { dayLabel: '后天', weatherType: 'cloudy', high: 22, low: 13 },
        { dayLabel: '第三天', weatherType: 'sunny', high: 24, low: 14 },
      ],
    },
    {
      id: 'preset-winter-snow',
      name: '冬天下雪',
      builtIn: true,
      weatherType: 'snow',
      timeOfDay: 'day',
      temperature: -5,
      high: -2,
      low: -10,
      clothingTip: '下雪天很冷，要穿羽绒服、戴帽子和手套',
      clothingIcon: 'down-coat',
      forecast: [
        { dayLabel: '明天', weatherType: 'snow', high: -1, low: -8 },
        { dayLabel: '后天', weatherType: 'overcast', high: 0, low: -6 },
        { dayLabel: '第三天', weatherType: 'sunny', high: 3, low: -4 },
      ],
    },
    {
      id: 'preset-autumn-cloudy',
      name: '秋天多云',
      builtIn: true,
      weatherType: 'cloudy',
      timeOfDay: 'day',
      temperature: 18,
      high: 22,
      low: 12,
      clothingTip: '天气凉爽，建议穿长袖外套',
      clothingIcon: 'jacket',
      forecast: [
        { dayLabel: '明天', weatherType: 'cloudy', high: 20, low: 11 },
        { dayLabel: '后天', weatherType: 'overcast', high: 18, low: 10 },
        { dayLabel: '第三天', weatherType: 'light-rain', high: 16, low: 9 },
      ],
    },
  ]
}

function createDefaultState(): AppState {
  return {
    cities: [createDefaultCity()],
    activeCityIndex: 0,
    displaySettings: {
      showDate: true,
      showTempRange: true,
      showForecast: true,
      showClothing: true,
      showTTS: true,
    },
    presets: createBuiltInPresets(),
    password: '1234',
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.cities && parsed.cities.length > 0) {
        // Migrate: fix clothingIcon to valid values
        const validIcons = ['tshirt', 'longsleeve', 'jacket', 'down-coat', 'umbrella']
        for (const city of parsed.cities) {
          if (!city.clothingIcon || !validIcons.includes(city.clothingIcon)) city.clothingIcon = 'tshirt'
        }
        for (const preset of parsed.presets) {
          if (!preset.clothingIcon || !validIcons.includes(preset.clothingIcon)) preset.clothingIcon = 'tshirt'
        }
        // Ensure built-in presets always exist
        const existingBuiltInIds = parsed.presets
          .filter((p) => p.builtIn)
          .map((p) => p.id)
        const missingPresets = createBuiltInPresets().filter(
          (p) => !existingBuiltInIds.includes(p.id)
        )
        parsed.presets = [...missingPresets, ...parsed.presets]
        // Migrate: add showTTS if missing
        if (parsed.displaySettings.showTTS === undefined) {
          parsed.displaySettings.showTTS = true
        }
        return parsed
      }
    }
  } catch {
    // Corrupted data, reset
  }
  return createDefaultState()
}

function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const store = reactive(loadState())

// Auto-save on any change
watch(
  () => store,
  (newState) => {
    saveState(newState as AppState)
  },
  { deep: true }
)

// Actions
export function addCity(name: string): CityWeather {
  const city: CityWeather = {
    ...createDefaultCity(),
    id: generateId(),
    name,
  }
  store.cities.push(city)
  return city
}

export function removeCity(id: string): boolean {
  if (store.cities.length <= 1) return false
  const index = store.cities.findIndex((c) => c.id === id)
  if (index === -1) return false
  store.cities.splice(index, 1)
  if (store.activeCityIndex >= store.cities.length) {
    store.activeCityIndex = store.cities.length - 1
  }
  return true
}

export function updateCity(id: string, updates: Partial<CityWeather>): void {
  const city = store.cities.find((c) => c.id === id)
  if (city) {
    Object.assign(city, updates)
  }
}

export function applyPreset(cityId: string, presetId: string): void {
  const preset = store.presets.find((p) => p.id === presetId)
  const city = store.cities.find((c) => c.id === cityId)
  if (preset && city) {
    city.weatherType = preset.weatherType
    city.timeOfDay = preset.timeOfDay
    city.temperature = preset.temperature
    city.high = preset.high
    city.low = preset.low
    city.clothingTip = preset.clothingTip
    city.clothingIcon = preset.clothingIcon
    city.forecast = JSON.parse(JSON.stringify(preset.forecast))
    city.appliedPresetId = presetId
  }
}

export function addPreset(preset: Omit<Preset, 'id' | 'builtIn'>): Preset {
  const newPreset: Preset = {
    ...preset,
    id: generateId(),
    builtIn: false,
  }
  store.presets.push(newPreset)
  return newPreset
}

export function removePreset(id: string): boolean {
  const preset = store.presets.find((p) => p.id === id)
  if (!preset || preset.builtIn) return false
  const index = store.presets.indexOf(preset)
  store.presets.splice(index, 1)
  return true
}

export function updatePreset(id: string, updates: Partial<Preset>): void {
  const preset = store.presets.find((p) => p.id === id)
  if (preset && !preset.builtIn) {
    Object.assign(preset, updates)
  }
}

export { generateId }
