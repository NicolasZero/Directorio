export type NewsEntry = {
  id: number
  title: string
  summary: string
  content: string
  category: string
  image: string | null
  published_at: string | null
  created_at?: string
  updated_at?: string
}

export function formatNewsDate(value: string | null) {
  if (!value) return 'Fecha por definir'

  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'Fecha por definir'

  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
