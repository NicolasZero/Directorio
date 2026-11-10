import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { formatNewsDate, type NewsEntry } from '../types/news'

const PAGE_SIZE = 10

export default function NewsAdminList() {
  const [news, setNews] = useState<NewsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [newsToDelete, setNewsToDelete] = useState<NewsEntry | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
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
    if (!query) return news
    return news.filter((item) =>
      [item.title, item.summary, item.category].join(' ').toLowerCase().includes(query)
    )
  }, [news, search])

  const pageCount = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const currentItems = filteredNews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

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
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 mb-6 px-4 py-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
            Noticias
          </Badge>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Gestión de noticias</h1>
          <p className="text-lg text-muted-foreground">Crea, revisa y actualiza las noticias publicadas.</p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="mb-4 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Total de noticias</p>
            <p className="text-3xl font-bold text-rose-600">{news.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredNews.length} resultado{filteredNews.length !== 1 ? 's' : ''} encontrados
            </p>
          </div>
          <Button asChild size="lg" className="bg-rose-600 text-base font-bold hover:bg-rose-700">
            <Link to="/admin/noticias/nuevo">Agregar noticia <Plus className="h-4 w-4" /></Link>
          </Button>
          <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
            <label className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Buscar noticia"
                className="pl-9"
              />
            </label>
            <Button variant="outline" size="sm" onClick={() => { setSearch(''); setPage(1) }}>
              Limpiar
            </Button>
          </div>
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
          <Card><CardContent className="py-10 text-center">Aún no hay noticias publicadas.</CardContent></Card>
        ) : filteredNews.length === 0 ? (
          <Card><CardContent className="py-10 text-center">No se encontraron noticias.</CardContent></Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="overflow-hidden p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatNewsDate(item.published_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" aria-label={`Opciones para ${item.title}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Link to={`/noticias/${item.id}`}><Eye className="mr-2 h-4 w-4" />Ver</Link>
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
