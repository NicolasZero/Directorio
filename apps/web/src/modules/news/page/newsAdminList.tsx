import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil, Plus, Search, Send, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/authContext'
import { formatNewsDate, type NewsEntry } from '../types/news'

const PAGE_SIZE = 10
type NewsStatusFilter = 'Todas' | NewsEntry['status']

export default function NewsAdminList() {
  const { user } = useAuth()
  const [news, setNews] = useState<NewsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<NewsStatusFilter>('Todas')
  const [page, setPage] = useState(1)
  const [newsToDelete, setNewsToDelete] = useState<NewsEntry | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [publishingId, setPublishingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news/manage')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.error || 'No se pudieron cargar las noticias.')
        }

        setNews(result.data ?? [])
      } catch (fetchError) {
        console.error(fetchError)
        setError('No se pudieron cargar las noticias. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    void fetchNews()
  }, [])

  const filteredNews = useMemo(() => {
    const query = search.trim().toLowerCase()
    return news.filter((item) =>
      (statusFilter === 'Todas' || item.status === statusFilter) &&
      (!query || [item.title, item.summary, item.category].join(' ').toLowerCase().includes(query))
    )
  }, [news, search, statusFilter])

  const statusCounts = useMemo(() => ({
    Borrador: news.filter((item) => item.status === 'Borrador').length,
    Publicado: news.filter((item) => item.status === 'Publicado').length,
  }), [news])

  const pageCount = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const currentItems = filteredNews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handlePublish = async (item: NewsEntry) => {
    setPublishingId(item.id)
    setError(null)
    setMessage('')

    try {
      const response = await fetch(`/api/news/${item.id}/publish`, { method: 'PATCH' })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'No se pudo publicar la noticia.')
      }

      setNews((current) =>
        current.map((newsItem) =>
          newsItem.id === item.id ? { ...newsItem, status: 'Publicado' } : newsItem
        )
      )
      setMessage('Noticia publicada correctamente.')
    } catch (publishError) {
      console.error(publishError)
      setError(publishError instanceof Error
        ? publishError.message
        : 'No se pudo publicar la noticia. Intenta de nuevo más tarde.')
    } finally {
      setPublishingId(null)
    }
  }

  const handleDelete = async () => {
    if (!newsToDelete) return

    setDeletingId(newsToDelete.id)
    setError(null)
    setMessage('')

    try {
      const response = await fetch(`/api/news/${newsToDelete.id}`, { method: 'DELETE' })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'No se pudo eliminar la noticia.')
      }

      setNews((current) => current.filter((item) => item.id !== newsToDelete.id))
      setMessage('Noticia eliminada correctamente.')
    } catch (deleteError) {
      console.error(deleteError)
      setError('No se pudo eliminar la noticia. Intenta de nuevo más tarde.')
    } finally {
      setDeletingId(null)
      setNewsToDelete(null)
    }
  }

  return (
    <>
      <section className="bg-linear-to-br from-violet-100 dark:from-violet-950/80 via-white dark:via-black to-violet-100/50 dark:to-violet-950/30 mb-6 px-4 py-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-50">
            Noticias
          </Badge>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Gestión de noticias</h1>
          <p className="text-lg text-muted-foreground">Administra borradores y noticias publicadas desde un solo lugar.</p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground">Total de noticias</p>
                <p className="mt-1 text-2xl font-bold text-violet-600">{news.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground">Borradores</p>
                <p className="mt-1 text-2xl font-bold">{statusCounts.Borrador}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground">Publicadas</p>
                <p className="mt-1 text-2xl font-bold">{statusCounts.Publicado}</p>
              </CardContent>
            </Card>
          </div>
          <Button asChild size="lg" className="bg-violet-600 text-base font-bold hover:bg-violet-700!">
            <Link to="/admin/noticias/nuevo"><Plus className="mr-2 h-4 w-4" />Agregar noticia</Link>
          </Button>
        </div>

        <Card className="mb-4">
          <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end">
            <label className="flex-1 space-y-2 text-sm font-medium">
              Buscar
              <span className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Título, resumen o categoría"
                  aria-label="Buscar noticias"
                  className="pl-9"
                />
              </span>
            </label>
            <label className="space-y-2 text-sm font-medium">
              Estatus
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as NewsStatusFilter)
                  setPage(1)
                }}
              >
                <SelectTrigger aria-label="Filtrar por estatus" className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todos los estatus</SelectItem>
                  <SelectItem value="Borrador">Borradores</SelectItem>
                  <SelectItem value="Publicado">Publicadas</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <Button
              variant="outline"
              onClick={() => { setSearch(''); setStatusFilter('Todas'); setPage(1) }}
              disabled={!search && statusFilter === 'Todas'}
            >
              Limpiar
            </Button>
          </CardContent>
        </Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>{filteredNews.length} resultado{filteredNews.length !== 1 ? 's' : ''}</p>
          <p>Selecciona “Publicar” para hacer visible un borrador.</p>
        </div>

        {message && (
          <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        {error && (
          <Card className="mb-4 shadow-sm">
            <CardContent className="py-5 text-center text-foreground" role="alert">{error}</CardContent>
          </Card>
        )}
        <Dialog
          open={newsToDelete !== null}
          title="Eliminar noticia"
          description={newsToDelete ? `¿Estás seguro de eliminar “${newsToDelete.title}”?` : ''}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onClose={() => setNewsToDelete(null)}
          onConfirm={handleDelete}
          loading={deletingId !== null}
        />

        {loading ? (
          <Card><CardContent className="py-10 text-center">Cargando noticias...</CardContent></Card>
        ) : error && news.length === 0 ? (
          <Card><CardContent className="py-10 text-center" role="alert">{error}</CardContent></Card>
        ) : news.length === 0 ? (
          <Card><CardContent className="py-10 text-center">Aún no hay noticias. Crea una para comenzar.</CardContent></Card>
        ) : filteredNews.length === 0 ? (
          <Card><CardContent className="py-10 text-center">No se encontraron noticias.</CardContent></Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="overflow-hidden p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-64">Noticia</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de publicación</TableHead>
                    <TableHead><span className="sr-only">Opciones</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="max-w-md whitespace-normal">
                        <p className="font-semibold leading-snug">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-900 dark:text-violet-100">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === 'Publicado' ? 'default' : 'outline'}
                          className={item.status === 'Publicado'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-100'
                            : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-50'}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatNewsDate(item.published_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {item.status === 'Borrador' && user?.role === 'Administrador' && (
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700"
                              disabled={publishingId !== null}
                              onClick={() => void handlePublish(item)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              {publishingId === item.id ? 'Publicando...' : 'Publicar'}
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" aria-label={`Opciones para ${item.title}`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem asChild>
                                <Link to={`/noticias/${item.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {item.status === 'Publicado' ? 'Ver' : 'Vista previa'}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/noticias/editar/${item.id}`}><Pencil className="mr-2 h-4 w-4" />Editar</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-0"
                                disabled={deletingId === item.id}
                                onClick={() => setNewsToDelete(item)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <div className="flex flex-col gap-3 border-t bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {currentItems.length} de {filteredNews.length} resultados
              </p>
              <div className="inline-flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                  Anterior
                </Button>
                {Array.from({ length: pageCount }, (_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button variant="outline" size="sm" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>
        )}
      </section>
    </>
  )
}
