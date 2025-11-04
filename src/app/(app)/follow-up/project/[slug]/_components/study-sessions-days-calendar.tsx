'use client'

import { useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import type { ApiStudySession } from '@/hooks/projects/use-studied-topics'

interface StudyCalendarProps {
  sessions: ApiStudySession[]
  initialMonth?: Date
  timeZone?: string // default 'America/Sao_Paulo'
}

/** Normaliza um Date para a chave yyyy-MM-dd no fuso informado */
function dayKey(date: Date, timeZone: string) {
  const zoned = toZonedTime(date, timeZone)
  return format(zoned, 'yyyy-MM-dd')
}

export function StudyCalendar({
  sessions,
  initialMonth,
  timeZone = 'America/Sao_Paulo',
}: StudyCalendarProps) {
  /**
   * Mapa: 'yyyy-MM-dd' -> quantidade de sessões
   */
  const countByDay = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of sessions) {
      const date = new Date(s.viewAt)
      const key = dayKey(date, timeZone)
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return map
  }, [sessions, timeZone])

  /** Matcher para dizer ao calendar quais dias foram estudados */
  const studiedMatcher = (date: Date) => countByDay.has(dayKey(date, timeZone))

  /** Buckets visuais por “intensidade” (nº de sessões no dia) */
  const lightMatcher = (d: Date) =>
    (countByDay.get(dayKey(d, timeZone)) ?? 0) === 1
  const mediumMatcher = (d: Date) =>
    (countByDay.get(dayKey(d, timeZone)) ?? 0) === 2
  const hardMatcher = (d: Date) =>
    (countByDay.get(dayKey(d, timeZone)) ?? 0) === 3
  const beastMatcher = (d: Date) =>
    (countByDay.get(dayKey(d, timeZone)) ?? 0) >= 4

  const modifiers = {
    studied: studiedMatcher,
    light: lightMatcher,
    medium: mediumMatcher,
    hard: hardMatcher,
    beast: beastMatcher,
  }

  const modifiersClassNames = {
    // ajuste de cores
    studied: 'bg-emerald-200 text-emerald-900', // fallback
    light:
      'bg-emerald-200 text-emerald-900 hover:bg-emerald-300 focus:bg-emerald-300',
    medium:
      'bg-emerald-300 text-emerald-950 hover:bg-emerald-400 focus:bg-emerald-400',
    hard: 'bg-emerald-400 text-emerald-950 hover:bg-emerald-500 focus:bg-emerald-500',
    beast:
      'bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-emerald-600 font-medium',
  }

  const month = initialMonth ?? new Date()

  return (
    <div className="space-y-2">
      <Calendar
        className="flex items-center justify-center rounded-xl border bg-card p-3 dark:border-muted"
        month={month}
        mode="single"
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        components={{
          // Renderiza o conteúdo do dia (dentro do botão padrão do shadcn)
          DayContent: (props) => {
            const key = dayKey(props.date, timeZone)
            const count = countByDay.get(key) ?? 0

            return (
              <div
                className="relative flex items-center justify-center"
                title={
                  count > 0
                    ? `${count} sessão estudada`
                    : count > 1
                      ? `${count} sessões estudadas`
                      : format(props.date, 'dd/MM/yyyy')
                }
              >
                <span>{props.date.getDate()}</span>
                {count > 0 && (
                  <span
                    className="absolute -bottom-1 right-2 h-4 min-w-4 rounded-full bg-emerald-700 text-[8px] leading-4 text-white"
                    aria-hidden
                  >
                    {count}
                  </span>
                )}
              </div>
            )
          },
        }}
      />
      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <LegendDot className={modifiersClassNames.light} label="1 sessão" />
        <LegendDot className={modifiersClassNames.medium} label="2 sessões" />
        <LegendDot className={modifiersClassNames.hard} label="3 sessões" />
        <LegendDot className={modifiersClassNames.beast} label="4+ sessões" />
      </div>
    </div>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block size-4 rounded ${className}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  )
}
