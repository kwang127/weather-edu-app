import type { ClothingIcon } from '@/types/weather'

import tshirtIcon from '@/assets/clothing-icons/tshirt.svg'
import longsleeveIcon from '@/assets/clothing-icons/longsleeve.svg'
import jacketIcon from '@/assets/clothing-icons/jacket.svg'
import downCoatIcon from '@/assets/clothing-icons/down-coat.svg'
import umbrellaIcon from '@/assets/clothing-icons/umbrella.svg'

export interface ClothingIconOption {
  id: ClothingIcon
  label: string
  src: string
}

export const CLOTHING_ICONS: ClothingIconOption[] = [
  { id: 'tshirt', label: '短袖', src: tshirtIcon },
  { id: 'longsleeve', label: '长袖', src: longsleeveIcon },
  { id: 'jacket', label: '外套', src: jacketIcon },
  { id: 'down-coat', label: '羽绒服', src: downCoatIcon },
  { id: 'umbrella', label: '雨伞', src: umbrellaIcon },
]

export const CLOTHING_ICON_MAP: Record<ClothingIcon, string> = Object.fromEntries(
  CLOTHING_ICONS.map((i) => [i.id, i.src])
) as Record<ClothingIcon, string>
