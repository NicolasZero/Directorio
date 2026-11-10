import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatNewsDate, type NewsEntry } from '../types/news'

export default function NewsDetail() {
  const { id } = useParams()
  const [news, setNews] = useState<NewsEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchNewsItem = async () => {
      try {
        const response = await fetch(`/api/news/${id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.error || 'No se pudo cargar la noticia.')
        }

        if (!cancelled) setNews(result.data ?? null)
      } catch (fetchError) {
        console.error(fetchError)
        if (!cancelled) setError('No se pudo cargar la noticia. Intenta de nuevo más tarde.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchNewsItem()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return <p className="py-16 text-center text-muted-foreground">Cargando noticia...</p>
  }

  if (error || !news) {
    return (
      <section className="container mx-auto max-w-3xl px-4 py-16">
        <Card>
          <CardContent className="space-y-4 p-6 text-center">
            <p role={error ? 'alert' : undefined} className="text-muted-foreground">
              {error || 'No se encontró la noticia.'}
            </p>
            <Button asChild variant="outline"><Link to="/noticias">Volver a noticias</Link></Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6 text-rose-600">
        <Link to="/noticias">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a noticias
        </Link>
      </Button>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
            {news.category}
          </Badge>
          <span className="text-sm text-muted-foreground">{formatNewsDate(news.published_at)}</span>
        </div>
        <h1 className="text-3xl font-bold md:text-5xl">{news.title}</h1>
        <p className="text-xl text-muted-foreground">{news.summary}</p>
        {news.image && (
          <img src={news.image} alt="" className="max-h-[32rem] w-full rounded-2xl object-cover" />
        )}
        <div className="whitespace-pre-line text-base leading-8 text-foreground">{news.content}</div>
      </div>
    </article>
  )
}
