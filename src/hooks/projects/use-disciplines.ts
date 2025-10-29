import { api } from '@/services/api-client'

export type TotalDisciplinesStats = {
  disciplineId: string
  disciplineName: string
  disciplineNotes: string | null
  topics: {
    id: string
    title: string
    notes: string | null
  }[]
  topicsCount: number
  rank?: string
  pagesReaded: number
  rightQuestions: number
  wrongQuestions: number
  skimmingReadingDurationSec: number
  scanningReadingDurationSec: number
  questionsDurationSec: number
  performancePercentage: string | null
  avarageSecondsPerPage: number | null
  avarageSecondsPerQuestion: number | null
}
export type DisciplinesStats = {
  disciplineId: string
  disciplineName: string
  topicsCount: number
  pagesReaded: number
  rightQuestions: number
  wrongQuestions: number
  skimmingReadingDurationSec: number
  scanningReadingDurationSec: number
  questionsDurationSec: number
  performancePercentage: string | null
  avarageSecondsPerPage: number | null
  avarageSecondsPerQuestion: number | null
}

export async function getDisciplinesStatsByCycle(
  projectId: string,
  cycleId: string
): Promise<DisciplinesStats[]> {
  const { data } = await api.post(
    `/projects/${projectId}/cycles/${cycleId}/discipline-stats`
  )

  return data.map((discipline: DisciplinesStats) => ({
    disciplineId: discipline.disciplineId,
    disciplineName: discipline.disciplineName,
    topicsCount: discipline.topicsCount,
    pagesReaded: discipline.pagesReaded,
    rightQuestions: discipline.rightQuestions,
    wrongQuestions: discipline.wrongQuestions,
    skimmingReadingDurationSec: discipline.skimmingReadingDurationSec,
    scanningReadingDurationSec: discipline.scanningReadingDurationSec,
    questionsDurationSec: discipline.questionsDurationSec,
    performancePercentage: discipline.performancePercentage,
    avarageSecondsPerPage: discipline.avarageSecondsPerPage,
    avarageSecondsPerQuestion: discipline.avarageSecondsPerQuestion,
  }))
}

export async function getTotalDisciplinesStats(
  projectId: string
): Promise<TotalDisciplinesStats[]> {
  const { data } = await api.post(
    `/projects/${projectId}/total-discipline-stats`
  )

  return data.map((discipline: TotalDisciplinesStats) => ({
    disciplineId: discipline.disciplineId,
    disciplineName: discipline.disciplineName,
    topics: discipline.topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      notes: topic.notes,
    })),
    topicsCount: discipline.topicsCount,
    pagesReaded: discipline.pagesReaded,
    rightQuestions: discipline.rightQuestions,
    wrongQuestions: discipline.wrongQuestions,
    skimmingReadingDurationSec: discipline.skimmingReadingDurationSec,
    scanningReadingDurationSec: discipline.scanningReadingDurationSec,
    questionsDurationSec: discipline.questionsDurationSec,
    performancePercentage: discipline.performancePercentage,
    avarageSecondsPerPage: discipline.avarageSecondsPerPage,
    avarageSecondsPerQuestion: discipline.avarageSecondsPerQuestion,
  }))
}
