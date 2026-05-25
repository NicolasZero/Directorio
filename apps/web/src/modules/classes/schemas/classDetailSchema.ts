export type ClassDetailType = {
  id: number
  title: string
  description: string
  full_description?: string
  instructor: string
  instructor_bio?: string
  duration?: string
  level?: string
  image?: string
  start_date?: string | null
  modules?: { id: number; title: string; duration: string }[]
  requirements?: { id: number, order: number, requirement: string }[]
  outcomes?: { id: number, order: number, outcome: string }[]
}