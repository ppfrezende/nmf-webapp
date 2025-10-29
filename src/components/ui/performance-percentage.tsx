import { emojis } from '@/lib/utils'
import { ChartNoAxesCombined } from 'lucide-react'

type PerformanceProps = {
  value?: number
  size?: 'text-xs' | 'text-sm' | 'text-xl'
  useIcon?: boolean
}

export function PerformanceBadge({
  value,
  size = 'text-xl',
  useIcon = true,
}: PerformanceProps) {
  let color = 'text-foreground'
  let emoji = emojis.not_yet

  if (value) {
    if (value >= 90) {
      color = 'text-green-700'
      emoji = emojis.excelent
    } else if (value >= 80) {
      color = 'text-green-500'
      emoji = emojis.good
    } else if (value >= 65) {
      color = 'text-yellow-500'
      emoji = emojis.atention
    } else if (value > 0) {
      color = 'text-red-500'
      emoji = emojis.bad
    }
  }

  return (
    <div
      className={`font-medium ${color} flex items-center justify-between gap-2 ${size}`}
    >
      {useIcon && <ChartNoAxesCombined />}

      <span className={`font-medium ${color}`}>
        {value ? `${value.toFixed(0)}% ${emoji}` : `0%`}
      </span>
    </div>
  )
}
