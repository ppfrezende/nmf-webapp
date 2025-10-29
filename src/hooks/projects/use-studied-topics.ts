import { api } from '@/services/api-client'

export type ApiStudySession = {
  id: string
  scanningReadingDurationSec?: number
  skimmingReadingDurationSec?: number
  pagesReaded?: number
  theoryStatus?: boolean
  rightQuestions?: number
  wrongQuestions?: number
  performancePercentage?: number
  questionsDurationSec?: number
  questionStatus?: boolean
  totalStudingDurationSec?: number
  notes?: string | null
  viewAt?: string | null
  studyMethod?: string | null
}

export type StudySessionForUpdate = {
  id: string
  scanningReadingDurationSec?: number
  skimmingReadingDurationSec?: number
  pagesReaded?: number
  theoryStatus?: boolean
  rightQuestions?: number
  wrongQuestions?: number
  performancePercentage?: number
  questionsDurationSec?: number
  questionStatus?: boolean
  totalStudingDurationSec?: number
  notes?: string | null
  viewAt?: string | null
  studyMethod?: string | null
  topic: {
    title: string
    discipline: {
      name: string
    }
  }
}

export type ApiTopic = {
  id: string
  title: string
  position: number
  notes: string | null
  discipline: {
    name: string
  }
  study_sessions: ApiStudySession[]
}

export type UiTopic = {
  id: string
  title: string
  position: number
  notes: string | null
  discipline: string
  study_sessions: ApiStudySession[]
}

export type TopicRow = {
  id: string
  title: string
  discipline: string
  study_sessions: number
  studySessionId: string
  skimmingReadingDurationSec: number
  scanningReadingDurationSec: number
  pagesReaded: number
  theoryStatus: boolean
  rightQuestions: number
  wrongQuestions: number
  questionsDurationSec: number
  totalStudingDurationSec: number
  questionStatus: boolean
  performancePercentage: number
  lastViewAt: Date | null
}

export type GetStudiedTopicsByCycleResponse = {
  studiedTopics: UiTopic[]
  unstudiedTopics: UiTopic[]
}

export async function getStudiedTopicsByCycle(
  projectId: string,
  cycleId: string
): Promise<GetStudiedTopicsByCycleResponse> {
  const { data } = await api.get(`/projects/${projectId}/cycles/${cycleId}/get`)

  return {
    studiedTopics: data.studiedTopics.map((studied_topic: ApiTopic) => ({
      id: studied_topic.id,
      title: studied_topic.title,
      position: studied_topic.position,
      notes: studied_topic.notes,
      discipline: studied_topic.discipline.name,
      study_sessions: studied_topic.study_sessions.map(
        (study_session: ApiStudySession) => ({
          id: study_session.id,
          scanningReadingDurationSec: study_session.scanningReadingDurationSec,
          skimmingReadingDurationSec: study_session.skimmingReadingDurationSec,
          pagesReaded: study_session.pagesReaded,
          theoryStatus: study_session.theoryStatus,
          rightQuestions: study_session.rightQuestions,
          wrongQuestions: study_session.wrongQuestions,
          performancePercentage: study_session.performancePercentage,
          questionsDurationSec: study_session.questionsDurationSec,
          questionStatus: study_session.questionStatus,
          totalStudingDurationSec: study_session.totalStudingDurationSec,
          notes: study_session.notes,
          viewAt: study_session.viewAt,
          studyMethod: study_session.studyMethod,
        })
      ),
    })),
    unstudiedTopics: data.unstudiedTopics.map((unstudied_topic: ApiTopic) => ({
      id: unstudied_topic.id,
      title: unstudied_topic.title,
      position: unstudied_topic.position,
      notes: unstudied_topic.notes,
      discipline: unstudied_topic.discipline.name,
    })),
  }
}

export async function getStudySession(
  projectId: string,
  studySessionId: string
): Promise<StudySessionForUpdate> {
  const { data } = await api.get(
    `/projects/${projectId}/study-session/${studySessionId}`
  )

  console.log(data)

  return {
    id: data.id,
    scanningReadingDurationSec: data.scanningReadingDurationSec,
    skimmingReadingDurationSec: data.skimmingReadingDurationSec,
    pagesReaded: data.pagesReaded,
    theoryStatus: data.theoryStatus,
    rightQuestions: data.rightQuestions,
    wrongQuestions: data.wrongQuestions,
    performancePercentage: data.performancePercentage,
    questionsDurationSec: data.questionsDurationSec,
    questionStatus: data.questionStatus,
    totalStudingDurationSec: data.totalStudingDurationSec,
    notes: data.notes,
    viewAt: data.viewAt,
    studyMethod: data.studyMethod,
    topic: data.topic.title,
  }
}
