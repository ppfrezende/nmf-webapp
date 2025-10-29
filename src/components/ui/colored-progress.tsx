import clsx from 'clsx'

export default function ColoredProgress({ value }: { value: number }) {
  const barColor = clsx(
    'h-4 rounded-full transition-all',
    value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  )

  return (
    <div className="relative w-full">
      <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-muted">
        <div className={barColor} style={{ width: `${value}%` }} />
      </div>
      {Number.isNaN(value) ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="p-2 text-xs font-medium">0%</p>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="p-2 text-xs font-medium">{value.toFixed(0)}%</p>
        </div>
      )}
    </div>
  )
}
