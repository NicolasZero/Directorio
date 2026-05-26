import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type DirectoryEntry } from '../schemes/directory'
import { Link } from 'react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const PAGE_SIZE = 10

export default function EditDirectory() {
  const [directories, setDirectories] = useState<DirectoryEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [directoryToDelete, setDirectoryToDelete] = useState<DirectoryEntry | null>(null)
  const [deletingDirectoryId, setDeletingDirectoryId] = useState<number | null>(null)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    const fetchDirectories = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/directory')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'Error al cargar directorios')
        }

        setDirectories(data?.data || [])
      } catch (fetchError) {
        console.error(fetchError)
        setError('No se pudieron cargar los directorios. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchDirectories()
  }, [])

  const filteredDirectories = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return directories

    return directories.filter((directorio) =>
      [directorio.nombre, directorio.direccion, directorio.estado, directorio.municipio]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [directories, search])

  const pageCount = Math.max(1, Math.ceil(filteredDirectories.length / PAGE_SIZE))

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const currentPageDirectories = filteredDirectories.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  )

  const openDeleteDialog = (directorio: DirectoryEntry) => {
    setDirectoryToDelete(directorio)
    setShowDeleteDialog(true)
    setError(null)
    setMessage('')
  }

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setDirectoryToDelete(null)
  }

  const handleDelete = async () => {
    if (!directoryToDelete) return

    setShowDeleteDialog(false)
    setDeletingDirectoryId(directoryToDelete.id)
    setError(null)
    setMessage('')

    try {
      const response = await fetch(`/api/directory/${directoryToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al eliminar el directorio')
      }

      setDirectories((current) => current.filter((item) => item.id !== directoryToDelete.id))
      setMessage('Directorio eliminado correctamente.')
    } catch (deleteError) {
      console.error(deleteError)
      setError('No se pudo eliminar el directorio. Intenta de nuevo más tarde.')
    } finally {
      setDeletingDirectoryId(null)
      setDirectoryToDelete(null)
    }
  }

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-6 px-4 mb-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
            Directorio
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Gestión de directorios
          </h1>
          <p className="text-lg text-muted-foreground">
            Aquí puede administrar los directorios
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total de directorios</p>
            <p className="text-3xl font-bold text-rose-600">{directories.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredDirectories.length} resultado{filteredDirectories.length !== 1 ? 's' : ''} encontrados
            </p>
          </div>
          <div>
            <Link to="/admin/directorio/nuevo" className="block w-full">
              <Button size="lg" className="text-base font-bold bg-rose-600 hover:bg-rose-700">
                Agregar directorio
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
            <label className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                name='search'
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Buscar"
                className="pl-9"
                title='Buscar por nombre, dirección o estado'
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
          title="Eliminar directorio"
          description={directoryToDelete ? `¿Estás seguro de eliminar el directorio “${directoryToDelete.nombre}”?` : ''}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          loading={deletingDirectoryId !== null}
        />
        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">Cargando directorios...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="text-foreground font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : directories.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">No hay directorios disponibles.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageDirectories.map((directorio) => (
                    <TableRow key={directorio.id}>
                      <TableCell>{directorio.nombre}</TableCell>
                      <TableCell>{directorio.direccion}</TableCell>
                      <TableCell>
                        <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
                          {directorio.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* <div className="flex flex-wrap gap-2">
                          <Link to={`/directorio/${directorio.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />Ver
                            </Button>
                          </Link>
                          <Link to={`/admin/directorio/editar/${directorio.id}`}>
                            <Button variant="secondary" size="sm">
                              <Pencil className="mr-2 h-4 w-4" />Editar
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(directorio)}
                            disabled={deletingDirectoryId === directorio.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {deletingDirectoryId === directorio.id ? 'Eliminando...' : 'Eliminar'}
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
                              <Link className="w-full h-full flex items-center" to={`/directorio/${directorio.id}`}>
                                <Eye className="mr-2 h-4 w-4" />Ver
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link className="w-full h-full flex items-center" to={`/admin/directorio/editar/${directorio.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='gap-0'
                              onClick={() => openDeleteDialog(directorio)}
                              disabled={deletingDirectoryId === directorio.id}>
                              <Trash2 className="mr-2 h-4 w-4" />Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* <TableCaption>
                Listado de directorios cargados desde la API.
              </TableCaption> */}
            </CardContent>
            <div className="flex flex-col gap-3 border-t bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {currentPageDirectories.length} de {filteredDirectories.length} resultados
              </p>
              <div className="inline-flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Anterior
                </Button>
                {Array.from({ length: pageCount }, (_, index) => (
                  <Button
                    key={index}
                    variant={page === index + 1 ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pageCount}
                  onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}
