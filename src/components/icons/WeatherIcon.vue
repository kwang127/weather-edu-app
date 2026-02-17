<template>
  <img
    :src="iconSrc"
    :width="size"
    :height="size"
    :alt="type"
    class="weather-icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherType } from '@/types/weather'

import sunnyIcon from '@/assets/weather-icons/clear-day.svg'
import cloudyIcon from '@/assets/weather-icons/partly-cloudy-day.svg'
import overcastIcon from '@/assets/weather-icons/overcast.svg'
import lightRainIcon from '@/assets/weather-icons/drizzle.svg'
import heavyRainIcon from '@/assets/weather-icons/rain.svg'
import thunderstormIcon from '@/assets/weather-icons/thunderstorms.svg'
import snowIcon from '@/assets/weather-icons/snow.svg'
import fogIcon from '@/assets/weather-icons/fog.svg'

const iconMap: Record<WeatherType, string> = {
  sunny: sunnyIcon,
  cloudy: cloudyIcon,
  overcast: overcastIcon,
  'light-rain': lightRainIcon,
  'heavy-rain': heavyRainIcon,
  thunderstorm: thunderstormIcon,
  snow: snowIcon,
  fog: fogIcon,
}

const props = withDefaults(defineProps<{
  type: WeatherType
  size?: number
}>(), {
  size: 64,
})

const iconSrc = computed(() => iconMap[props.type])
</script>

<style scoped>
.weather-icon {
  display: block;
}
</style>
