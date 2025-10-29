import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dirtyValues = (
  dirtyFields: false | { [x: string]: unknown },
  allValues: { [x: string]: unknown }
): { [x: string]: unknown } => {
  if (!dirtyFields || Array.isArray(dirtyFields)) {
    return allValues
  }

  return Object.fromEntries(
    Object.entries(dirtyFields)
      .filter(([, value]) => value !== false)
      .map(([key]) => [
        key,
        typeof allValues[key] === 'object' &&
        allValues[key] !== null &&
        !(allValues[key] instanceof Date)
          ? dirtyValues(
              dirtyFields[key] as { [x: string]: unknown },
              allValues[key] as { [x: string]: unknown }
            )
          : allValues[key],
      ])
  )
}

export const convertSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  return `${minutes} min`
}

export const emojis = {
  excelent: '🎉',
  good: '👏',
  atention: '⚠️',
  bad: '🆘',
  not_yet: '⏳',
}

export const formatSecondsToHhMm = (totalSec: number) => {
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  return `${h}h${m.toString().padStart(2, '0')}min`
}

export const fmtMin = (sec: number) => {
  const minutes = Math.floor(sec / 60)
  return `${minutes} min`
}
