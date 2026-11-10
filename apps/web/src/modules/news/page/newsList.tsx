import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Newspaper } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNewsDate, type NewsEntry } from '../types/news'

export default function NewsList() {
  const [news, setNews] = useState<NewsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.error || 'No se pudieron cargar las noticias.')
        }

        if (!cancelled) setNews(result.data ?? [])
      } catch (fetchError) {
        console.error(fetchError)
        if (!cancelled) setError('No se pudieron cargar las noticias. Intenta de nuevo más tarde.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchNews()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-10 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
            <Newspaper className="mr-1 h-3 w-3" />
            Actualidad
          </Badge>
          <h1 className="text-3xl font-bold md:text-5xl">Noticias</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Conoce las últimas novedades y actividades de INAMUJER.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {loading ? (
          <p className="py-10 text-center text-muted-foreground">Cargando noticias...</p>
        ) : error ? (
          <p role="alert" className="py-10 text-center text-muted-foreground">{error}</p>
        ) : news.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">Aún no hay noticias publicadas.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                {item.image && (
                  <img src={item.image} alt="" className="aspect-video w-full object-cover" />
                )}
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
                      {item.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{formatNewsDate(item.published_at)}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 text-base">{item.summary}</CardDescription>
                  <Button asChild variant="link" className="mt-3 px-0 text-rose-600">
                    <Link to={`/noticias/${item.id}`}>
                      Leer noticia <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
