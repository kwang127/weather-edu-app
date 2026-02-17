import type { WeatherType } from '@/types/weather'

export const WEATHER_LABELS: Record<WeatherType, string> = {
  sunny: '晴',
  cloudy: '多云',
  overcast: '阴',
  'light-rain': '小雨',
  'heavy-rain': '大雨',
  thunderstorm: '雷阵雨',
  snow: '雪',
  fog: '雾',
}

export const WEATHER_TYPES: WeatherType[] = [
  'sunny',
  'cloudy',
  'overcast',
  'light-rain',
  'heavy-rain',
  'thunderstorm',
  'snow',
  'fog',
]

interface GradientConfig {
  day: string
  night: string
}

export const WEATHER_GRADIENTS: Record<WeatherType, GradientConfig> = {
  sunny: {
    day: 'linear-gradient(180deg, #4A90D9 0%, #74B9FF 50%, #A8D8EA 100%)',
    night: 'linear-gradient(180deg, #0F1B3D 0%, #1A2980 50%, #26305C 100%)',
  },
  cloudy: {
    day: 'linear-gradient(180deg, #5B7FA5 0%, #8EAEC0 50%, #B0C4D8 100%)',
    night: 'linear-gradient(180deg, #1A2540 0%, #2C3E6B 50%, #3D4F7C 100%)',
  },
  overcast: {
    day: 'linear-gradient(180deg, #6B7B8D 0%, #8E9EAF 50%, #A8B5C2 100%)',
    night: 'linear-gradient(180deg, #1C2333 0%, #2D3548 50%, #3E475A 100%)',
  },
  'light-rain': {
    day: 'linear-gradient(180deg, #4A6178 0%, #607D8B 50%, #78909C 100%)',
    night: 'linear-gradient(180deg, #151D2B 0%, #1E2A3A 50%, #283848 100%)',
  },
  'heavy-rain': {
    day: 'linear-gradient(180deg, #37474F 0%, #455A64 50%, #546E7A 100%)',
    night: 'linear-gradient(180deg, #0D1117 0%, #161D27 50%, #1F2937 100%)',
  },
  thunderstorm: {
    day: 'linear-gradient(180deg, #37364A 0%, #4A4868 50%, #5D5B7A 100%)',
    night: 'linear-gradient(180deg, #0D0D1A 0%, #1A1A2E 50%, #2D2B55 100%)',
  },
  snow: {
    day: 'linear-gradient(180deg, #B0BEC5 0%, #CFD8DC 50%, #ECEFF1 100%)',
    night: 'linear-gradient(180deg, #263238 0%, #37474F 50%, #455A64 100%)',
  },
  fog: {
    day: 'linear-gradient(180deg, #90A4AE 0%, #B0BEC5 50%, #CFD8DC 100%)',
    night: 'linear-gradient(180deg, #1C2833 0%, #2C3E50 50%, #3D5266 100%)',
  },
}

export function getWeatherGradient(type: WeatherType, timeOfDay: 'day' | 'night'): string {
  return WEATHER_GRADIENTS[type][timeOfDay]
}
