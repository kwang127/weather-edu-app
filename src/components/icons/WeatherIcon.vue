<template>
  <svg :width="size" :height="size" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Sunny -->
    <template v-if="type === 'sunny'">
      <circle cx="32" cy="32" r="12" fill="#FFD93D" />
      <g stroke="#FFD93D" stroke-width="2.5" stroke-linecap="round">
        <line x1="32" y1="6" x2="32" y2="14" />
        <line x1="32" y1="50" x2="32" y2="58" />
        <line x1="6" y1="32" x2="14" y2="32" />
        <line x1="50" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="19.3" y2="19.3" />
        <line x1="44.7" y1="44.7" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="19.3" y2="44.7" />
        <line x1="44.7" y1="19.3" x2="50.4" y2="13.6" />
      </g>
    </template>

    <!-- Cloudy -->
    <template v-else-if="type === 'cloudy'">
      <circle cx="22" cy="28" r="8" fill="#FFD93D" />
      <g stroke="#FFD93D" stroke-width="2" stroke-linecap="round">
        <line x1="22" y1="14" x2="22" y2="18" />
        <line x1="10" y1="28" x2="14" y2="28" />
        <line x1="12" y1="18" x2="14.8" y2="20.8" />
      </g>
      <path d="M20 44 C20 44 20 36 28 36 C28 30 36 28 40 32 C44 28 52 30 52 36 C56 36 58 40 56 44 Z"
        fill="rgba(255,255,255,0.9)" />
    </template>

    <!-- Overcast -->
    <template v-else-if="type === 'overcast'">
      <path d="M14 46 C14 46 14 36 24 36 C24 28 34 26 38 30 C42 26 52 28 52 36 C58 36 60 40 58 44 C58 46 56 46 56 46 Z"
        fill="rgba(255,255,255,0.7)" />
      <path d="M8 52 C8 52 8 44 16 44 C16 38 24 36 28 39 C31 36 38 37 38 42 C42 42 44 45 42 48 C42 52 40 52 40 52 Z"
        fill="rgba(255,255,255,0.85)" />
    </template>

    <!-- Light Rain -->
    <template v-else-if="type === 'light-rain'">
      <path d="M14 36 C14 36 14 28 22 28 C22 22 30 20 34 22 C38 18 46 20 46 28 C50 28 52 32 50 36 Z"
        fill="rgba(255,255,255,0.8)" />
      <line x1="20" y1="40" x2="18" y2="48" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" />
      <line x1="32" y1="40" x2="30" y2="48" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" />
      <line x1="44" y1="40" x2="42" y2="48" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Heavy Rain -->
    <template v-else-if="type === 'heavy-rain'">
      <path d="M12 32 C12 32 12 24 20 24 C20 18 28 16 32 18 C36 14 44 16 44 24 C48 24 50 28 48 32 Z"
        fill="rgba(255,255,255,0.75)" />
      <line x1="16" y1="36" x2="12" y2="48" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round" />
      <line x1="24" y1="36" x2="20" y2="48" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round" />
      <line x1="32" y1="36" x2="28" y2="48" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round" />
      <line x1="40" y1="36" x2="36" y2="48" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round" />
      <line x1="48" y1="36" x2="44" y2="48" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" stroke-linecap="round" />
    </template>

    <!-- Thunderstorm -->
    <template v-else-if="type === 'thunderstorm'">
      <path d="M12 30 C12 30 12 22 20 22 C20 16 28 14 32 16 C36 12 44 14 44 22 C48 22 50 26 48 30 Z"
        fill="rgba(255,255,255,0.7)" />
      <polygon points="30,32 26,42 32,42 28,54 38,40 32,40 36,32" fill="#FFD93D" />
      <line x1="18" y1="34" x2="15" y2="44" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" />
      <line x1="44" y1="34" x2="41" y2="44" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" />
    </template>

    <!-- Snow -->
    <template v-else-if="type === 'snow'">
      <path d="M14 34 C14 34 14 26 22 26 C22 20 30 18 34 20 C38 16 46 18 46 26 C50 26 52 30 50 34 Z"
        fill="rgba(255,255,255,0.8)" />
      <circle cx="20" cy="42" r="2.5" fill="rgba(255,255,255,0.8)" />
      <circle cx="32" cy="44" r="2.5" fill="rgba(255,255,255,0.8)" />
      <circle cx="44" cy="42" r="2.5" fill="rgba(255,255,255,0.8)" />
      <circle cx="26" cy="50" r="2" fill="rgba(255,255,255,0.6)" />
      <circle cx="38" cy="52" r="2" fill="rgba(255,255,255,0.6)" />
    </template>

    <!-- Fog -->
    <template v-else-if="type === 'fog'">
      <line x1="10" y1="22" x2="54" y2="22" stroke="rgba(255,255,255,0.5)" stroke-width="3" stroke-linecap="round" />
      <line x1="6" y1="32" x2="58" y2="32" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round" />
      <line x1="10" y1="42" x2="54" y2="42" stroke="rgba(255,255,255,0.5)" stroke-width="3" stroke-linecap="round" />
      <line x1="14" y1="52" x2="50" y2="52" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-linecap="round" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import type { WeatherType } from '@/types/weather'

withDefaults(defineProps<{
  type: WeatherType
  size?: number
}>(), {
  size: 64,
})

const viewBox = '0 0 64 64'
</script>
