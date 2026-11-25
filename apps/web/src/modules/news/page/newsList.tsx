import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Calendar, Newspaper, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatNewsDate, type NewsEntry } from '../types/news'

const PAGE_SIZE = 6

export default function NewsList() {
  const [news, setNews] = useState<NewsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE)

  const observer = useRef<IntersectionObserver | null>(null)

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

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase()

    return news.filter((item) => {
      const matchesTitle = !query || item.title.toLowerCase().includes(query)
      const matchesDate = !selectedDate || (item.published_at && item.published_at.slice(0, 10) === selectedDate)

      return matchesTitle && matchesDate
    })
  }, [news, search, selectedDate])

  // Reset pagination count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [search, selectedDate])

  const visibleNews = useMemo(() => {
    return filteredNews.slice(0, visibleCount)
  }, [filteredNews, visibleCount])

  const hasMore = visibleCount < filteredNews.length

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + PAGE_SIZE)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const handleClearFilters = () => {
    setSearch('')
    setSelectedDate('')
  }

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
            Conoce las últimas novedades.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {/* Barra de filtros y contadores */}
        <div className="grid gap-4 md:grid-cols-1 md:items-end mb-8">
          {/* <div>
            <p className="text-sm text-muted-foreground">Total de noticias</p>
            <p className="text-3xl font-bold text-rose-600">{news.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredNews.length} resultado{filteredNews.length !== 1 ? 's' : ''} encontrado{filteredNews.length !== 1 ? 's' : ''}
            </p>
          </div> */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Filtro por título */}
            <label className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por título"
                className="pl-9"
              />
            </label>

            {/* Filtro por fecha */}
            <label className="relative w-full sm:w-48">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="pl-9"
                title="Filtrar por fecha de publicación"
              />
            </label>

            {(search || selectedDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="py-10 text-center text-muted-foreground">Cargando noticias...</p>
        ) : error ? (
          <p role="alert" className="py-10 text-center text-muted-foreground">{error}</p>
        ) : filteredNews.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center text-muted-foreground">
              {news.length === 0
                ? 'Aún no hay noticias publicadas.'
                : 'No se encontraron noticias con los filtros aplicados.'}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleNews.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col justify-between">
                  <div>
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
                    </CardContent>
                  </div>
                  <div className="px-6 pb-6 pt-0">
                    <Button asChild variant="link" className="px-0 text-rose-600">
                      <Link to={`/noticias/${item.id}`}>
                        Leer noticia <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Elemento disparador de scroll infinito */}
            <div ref={lastElementRef} className="h-10 w-full flex justify-center items-center mt-6">
              {hasMore && (
                <p className="text-sm text-muted-foreground animate-pulse">Cargando más noticias...</p>
              )}
            </div>
          </>
        )}
      </section>
    </>
  )
}
