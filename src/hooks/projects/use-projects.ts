import { api } from '@/services/api-client'

export type Topic = {
  id: string
  title: string
  notes: string | null
}

export type Cycle = {
  id: string
  title: string
  status: string
  notes: string | null
  projectId: string
  createdAt: string
  updatedAt: string
}

export type Discipline = {
  id: string
  name: string
  position: number
  readingDurationSec: number
  rightQuestions: number
  wrongQuestions: number
  pagesReaded: number
  notes: string
  createdAt: string
  updatedAt: string
  projectId: string
  topics: Topic[]
}

export type Project = {
  id: string
  title: string
  board?: string
  examDate?: Date
  status: string
  createdAt: string

  disciplines: Discipline[]
  cycles: Cycle[]
}

export type TotalProjectStats = {
  topicsCount: number
  pagesReaded: number
  rightQuestions: number
  wrongQuestions: number
  performancePercentage: number
}

export type GetProjectsResponse = {
  total_count: number
  registersPerPage: number
  projects: Project[]
}

export const getProjects = async (
  page: number,
  searchTerm?: string
): Promise<GetProjectsResponse> => {
  const endpoint = searchTerm ? '/projects/search' : '/projects'

  const { data, headers } = await api.get(endpoint, {
    params: {
      page,
      q: searchTerm || undefined,
    },
  })

  const total_count = Number(headers['x-total-count'])
  const registersPerPage = Number(headers['x-page-count'])

  const projects = await data.projects.map((project: Project) => {
    return {
      id: project.id,
      title: project.title,
      board: project.board,
      examDate: project.examDate,
      status: project.status,
      createdAt: project.createdAt,
    }
  })

  return {
    projects,
    registersPerPage,
    total_count,
  }
}

export async function getProject(id: string): Promise<Project> {
  const { data } = await api.get(`/projects/${id}`)

  return {
    id: data.project.id,
    title: data.project.title,
    board: data.project.board,
    examDate: data.project.examDate,
    status: data.project.status,
    disciplines: data.project.disciplines.map((discipline: Discipline) => ({
      id: discipline.id,
      name: discipline.name,
      position: discipline.position,
      readingDurationSec: discipline.readingDurationSec,
      pagesReaded: discipline.pagesReaded,
      rightQuestions: discipline.rightQuestions,
      wrongQuestions: discipline.wrongQuestions,
      updatedAt: discipline.updatedAt,
      projectId: discipline.projectId,
      topics: discipline.topics.map((topic: Topic) => ({
        id: topic.id,
        title: topic.title,
      })),
    })),
    cycles: data.project.cycles.map((cycle: Cycle) => ({
      id: cycle.id,
      title: cycle.title,
      status: cycle.status,
      notes: cycle.notes,
      projectId: cycle.projectId,
    })),
    createdAt: data.project.createdAt,
  }
}

export async function getCycle(
  cycleId: string,
  projectId: string
): Promise<Cycle> {
  const { data } = await api.get(`/projects/${projectId}/cycles/${cycleId}`)

  return {
    id: data.id,
    title: data.title,
    status: data.status,
    notes: data.notes,
    projectId: data.projectId,
    updatedAt: data.updatedAt,
    createdAt: data.createdAt,
  }
}

export async function getTotalProjectStats(
  projectId: string
): Promise<TotalProjectStats> {
  const { data } = await api.post(`/projects/${projectId}/total-project-stats`)

  return {
    topicsCount: data.topicsCount,
    pagesReaded: data.pagesReaded,
    rightQuestions: data.rightQuestions,
    wrongQuestions: data.wrongQuestions,
    performancePercentage: data.performancePercentage,
  }
}
