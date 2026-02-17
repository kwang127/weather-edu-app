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
      <div class="lightning-glow lightning-glow-1" />
      <div class="lightning-glow lightning-glow-2" />
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

// Simple seeded pseudo-random based on index for stable animations
function seeded(i: number, offset: number): number {
  const x = Math.sin(i * 9301 + offset * 49297) * 49297
  return x - Math.floor(x)
}

function rainStyle(i: number) {
  return {
    left: `${seeded(i, 1) * 100}%`,
    animationDelay: `${seeded(i, 2) * 2}s`,
    animationDuration: `${0.6 + seeded(i, 3) * 0.4}s`,
    opacity: 0.3 + seeded(i, 4) * 0.4,
  }
}

function snowStyle(i: number) {
  const size = 3 + seeded(i, 5) * 5
  return {
    left: `${seeded(i, 1) * 100}%`,
    animationDelay: `${seeded(i, 2) * 5}s`,
    animationDuration: `${3 + seeded(i, 3) * 4}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: 0.4 + seeded(i, 4) * 0.5,
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

/* Lightning — soft radial glow flashes from sky */
.lightning-glow {
  position: absolute;
  top: -30%;
  width: 140%;
  height: 80%;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
}

.lightning-glow-1 {
  left: -20%;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(200, 210, 255, 0.45) 0%,
    rgba(180, 200, 255, 0.15) 30%,
    transparent 70%
  );
  animation: flash-1 8s ease-in-out infinite;
}

.lightning-glow-2 {
  left: 10%;
  background: radial-gradient(
    ellipse at 60% 0%,
    rgba(220, 220, 255, 0.35) 0%,
    rgba(190, 200, 255, 0.1) 35%,
    transparent 65%
  );
  animation: flash-2 8s ease-in-out 3.5s infinite;
}

@keyframes flash-1 {
  0%, 100% { opacity: 0; }
  /* first flicker */
  10% { opacity: 0; }
  10.5% { opacity: 1; }
  11% { opacity: 0.15; }
  11.5% { opacity: 0.85; }
  12.5% { opacity: 0; }
  /* brief afterglow */
  13% { opacity: 0.2; }
  14% { opacity: 0; }
}

@keyframes flash-2 {
  0%, 100% { opacity: 0; }
  15% { opacity: 0; }
  15.3% { opacity: 0.9; }
  15.8% { opacity: 0.1; }
  16.3% { opacity: 0.7; }
  17% { opacity: 0.05; }
  17.5% { opacity: 0.5; }
  18.5% { opacity: 0; }
}
</style>
