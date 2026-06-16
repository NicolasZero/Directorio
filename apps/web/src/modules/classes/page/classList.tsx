import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Plus, Search, Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from 'react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type ClassEntry = {
  id: number
  title: string
  description: string
  duration?: string
  level?: string
  start_date?: string | null
}

const PAGE_SIZE = 10

export default function EditClass() {
  const [classes, setClasses] = useState<ClassEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<ClassEntry | null>(null)
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true)
      setError(null)
      setMessage('')

      try {
        const response = await fetch('/api/class')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'Error al cargar clases')
        }

        setClasses(data?.data || [])
      } catch (fetchError) {
        console.error(fetchError)
        setError('No se pudieron cargar las clases. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return classes

    return classes.filter((course) =>
      [course.title, course.description, course.duration, course.level, course.start_date]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [classes, search])

  const pageCount = Math.max(1, Math.ceil(filteredClasses.length / PAGE_SIZE))
  const currentPage = page > pageCount ? pageCount : page

  const currentPageClasses = filteredClasses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openDeleteDialog = (course: ClassEntry) => {
    setCourseToDelete(course)
    setShowDeleteDialog(true)
    setError(null)
    setMessage('')
  }

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setCourseToDelete(null)
  }

  const handleDelete = async () => {
    if (!courseToDelete) return

    setShowDeleteDialog(false)
    setDeletingCourseId(courseToDelete.id)
    setError(null)
    setMessage('')

    try {
      const response = await fetch(`/api/class/${courseToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al eliminar el curso')
      }

      setClasses((current) => current.filter((course) => course.id !== courseToDelete.id))
      setMessage('Curso eliminado correctamente.')
    } catch (deleteError) {
      console.error(deleteError)
      setError('No se pudo eliminar el curso. Intenta de nuevo más tarde.')
    } finally {
      setDeletingCourseId(null)
      setCourseToDelete(null)
    }
  }

  return (
    <>
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-6 px-4 mb-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
            Clases
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Gestión de clases
          </h1>
          <p className="text-lg text-muted-foreground">
            Aca puedes gestionar las clases.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total de clases</p>
            <p className="text-3xl font-bold text-rose-600">{classes.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredClasses.length} resultado{filteredClasses.length !== 1 ? 's' : ''} encontrados
            </p>
          </div>
          <div>
            <Link to="/admin/clases/nuevo" className="block w-full">
              <Button size="lg" className="text-base font-bold bg-rose-600 hover:bg-rose-700">
                Agregar clase
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
            <label className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                name='search'
                placeholder="Buscar"
                className="pl-9"
                title="Buscar por título, descripción, nivel o duración"
              />
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('')
                setPage(1)
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        <Dialog
          open={showDeleteDialog}
          title="Eliminar curso"
          description={courseToDelete ? `¿Estás seguro de eliminar el curso “${courseToDelete.title}”?` : ''}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          loading={deletingCourseId !== null}
        />

        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">Cargando clases...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="text-foreground font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : classes.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">No hay clases disponibles.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageClasses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.duration ?? '—'}</TableCell>
                      <TableCell>
                        <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
                          {course.level ?? 'Sin nivel'}
                        </Badge>
                      </TableCell>
                      <TableCell>{course.start_date ? new Date(course.start_date).toLocaleDateString('es-ES') : '—'}</TableCell>
                      <TableCell>
                        {/* <div className="flex flex-wrap gap-2">
                          <Link to={`/clases/curso/${course.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />Ver
                            </Button>
                          </Link>
                          <Link to={`/admin/clases/editar/${course.id}`}>
                            <Button variant="secondary" size="sm">
                              <Pencil className="mr-2 h-4 w-4" />Editar
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(course)}
                            disabled={deletingCourseId === course.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingCourseId === course.id ? 'Eliminando...' : 'Eliminar'}
                          </Button>
                        </div> */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Link className="w-full h-full flex items-center" to={`/clases/curso/${course.id}`}>
                                <Eye className="mr-2 h-4 w-4" />Ver
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="w-full h-full flex items-center" to={`/admin/clases/editar/${course.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='gap-0'
                              onClick={() => openDeleteDialog(course)}
                              disabled={deletingCourseId === course.id}>
                              <Trash2 className="mr-2 h-4 w-4" />Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* <TableCaption>Listado de clases cargadas desde la API.</TableCaption> */}
            </CardContent>
            <div className="flex flex-col gap-3 border-t bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {currentPageClasses.length} de {filteredClasses.length} resultados
              </p>
              <div className="inline-flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
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
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= pageCount}
                  onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                >
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
