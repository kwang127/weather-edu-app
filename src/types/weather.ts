export type WeatherType =
  | 'sunny'
  | 'cloudy'
  | 'overcast'
  | 'light-rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'fog'

export type TimeOfDay = 'day' | 'night'

export interface ForecastDay {
  dayLabel: string
  weatherType: WeatherType
  high: number
  low: number
}

export type ClothingIcon =
  | 'tshirt'
  | 'longsleeve'
  | 'jacket'
  | 'down-coat'
  | 'umbrella'

export interface CityWeather {
  id: string
  name: string
  weatherType: WeatherType
  timeOfDay: TimeOfDay
  temperature: number
  high: number
  low: number
  clothingTip: string
  clothingIcon: ClothingIcon
  forecast: ForecastDay[]
}

export interface DisplaySettings {
  showDate: boolean
  showTempRange: boolean
  showForecast: boolean
  showClothing: boolean
}

export interface Preset {
  id: string
  name: string
  builtIn: boolean
  weatherType: WeatherType
  timeOfDay: TimeOfDay
  temperature: number
  high: number
  low: number
  clothingTip: string
  clothingIcon: ClothingIcon
  forecast: ForecastDay[]
}

export interface AppState {
  cities: CityWeather[]
  activeCityIndex: number
  displaySettings: DisplaySettings
  presets: Preset[]
  password: string
}
