import {
  Shirt,
  Umbrella,
  Glasses,
  Snowflake,
  Sun,
  CloudRainWind,
  Wind,
  Thermometer,
  Footprints,
} from 'lucide-vue-next'
import type { ClothingIcon } from '@/types/weather'
import type { Component } from 'vue'

export interface ClothingIconOption {
  id: ClothingIcon
  label: string
  component: Component
}

export const CLOTHING_ICONS: ClothingIconOption[] = [
  { id: 'shirt', label: '短袖', component: Shirt },
  { id: 'jacket', label: '外套', component: Shirt },
  { id: 'umbrella', label: '雨伞', component: Umbrella },
  { id: 'glasses', label: '太阳镜', component: Glasses },
  { id: 'snowflake', label: '保暖', component: Snowflake },
  { id: 'sun', label: '防晒', component: Sun },
  { id: 'cloud-rain-wind', label: '风雨', component: CloudRainWind },
  { id: 'wind', label: '防风', component: Wind },
  { id: 'thermometer', label: '温度', component: Thermometer },
  { id: 'footprints', label: '鞋靴', component: Footprints },
]

export const CLOTHING_ICON_MAP: Record<ClothingIcon, Component> = Object.fromEntries(
  CLOTHING_ICONS.map((i) => [i.id, i.component])
) as Record<ClothingIcon, Component>
