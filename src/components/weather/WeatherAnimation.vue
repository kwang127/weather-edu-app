<template>
  <div class="weather-animation" aria-hidden="true">
    <!-- Rain -->
    <template v-if="type === 'light-rain' || type === 'heavy-rain'">
      <div
        v-for="i in dropCount"
        :key="'rain-' + i"
        class="raindrop"
        :style="rainStyle(i)"
      />
    </template>

    <!-- Snow -->
    <template v-if="type === 'snow'">
      <div
        v-for="i in 40"
        :key="'snow-' + i"
        class="snowflake"
        :style="snowStyle(i)"
      />
    </template>

    <!-- Sunny glow -->
    <template v-if="type === 'sunny'">
      <div class="sun-glow" />
    </template>

    <!-- Thunderstorm lightning -->
    <template v-if="type === 'thunderstorm'">
      <div
        v-for="i in dropCount"
        :key="'train-' + i"
        class="raindrop"
        :style="rainStyle(i)"
      />
      <div class="lightning" :style="{ animationDelay: '2s' }" />
      <div class="lightning lightning-2" :style="{ animationDelay: '5s' }" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherType } from '@/types/weather'

const props = defineProps<{
  type: WeatherType
}>()

const dropCount = computed(() =>
  props.type === 'heavy-rain' || props.type === 'thunderstorm' ? 60 : 30
)

function rainStyle(_i: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 2
  const duration = 0.6 + Math.random() * 0.4
  const opacity = 0.3 + Math.random() * 0.4
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    opacity,
  }
}

function snowStyle(_i: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 5
  const duration = 3 + Math.random() * 4
  const size = 3 + Math.random() * 5
  const opacity = 0.4 + Math.random() * 0.5
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity,
  }
}
</script>

<style scoped>
.weather-animation {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

/* Rain */
.raindrop {
  position: absolute;
  top: -20px;
  width: 2px;
  height: 18px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.4));
  border-radius: 0 0 2px 2px;
  animation: rain-fall linear infinite;
}

@keyframes rain-fall {
  0% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(100vh);
  }
}

/* Snow */
.snowflake {
  position: absolute;
  top: -10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: snow-fall linear infinite;
}

@keyframes snow-fall {
  0% {
    transform: translateY(-10px) translateX(0) rotate(0deg);
  }
  50% {
    transform: translateY(50vh) translateX(20px) rotate(180deg);
  }
  100% {
    transform: translateY(100vh) translateX(-10px) rotate(360deg);
  }
}

/* Sun glow */
.sun-glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 240px;
  height: 240px;
  background: radial-gradient(
    circle,
    rgba(255, 217, 61, 0.25) 0%,
    rgba(255, 217, 61, 0.08) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: glow-pulse 4s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

/* Lightning */
.lightning {
  position: absolute;
  top: 0;
  left: 30%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
  animation: lightning-flash 7s infinite;
}

.lightning-2 {
  left: 60%;
}

@keyframes lightning-flash {
  0%, 100% {
    background: transparent;
  }
  1% {
    background: rgba(255, 255, 255, 0.2);
  }
  2% {
    background: transparent;
  }
  3% {
    background: rgba(255, 255, 255, 0.15);
  }
  4% {
    background: transparent;
  }
}
</style>
