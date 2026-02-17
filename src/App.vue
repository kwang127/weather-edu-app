<template>
  <WeatherPage v-if="!showAdmin" @enter-admin="showAdmin = true" />
  <AdminPanel v-else @back="showAdmin = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WeatherPage from '@/components/weather/WeatherPage.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'

const showAdmin = ref(false)
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: #000;
}

#app {
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
