import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Eye, Pencil, Trash2, MoreHorizontal, Filter, RotateCcw } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Link } from 'react-router'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const PAGE_SIZE = 10

interface AdminCenter {
  id: number
  nombre: string
  organismo: string
  direccion: string
  estado: string
  municipio: string
  parroquia: string | null
  defensoras: { id: number; correo: string | null; telefono: string | null }[]
}

interface FilterOptions {
  estados: string[]
  municipios: string[]
  parroquias: string[]
}

export default function EditDirectory() {
  const [centers, setCenters] = useState<AdminCenter[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [centerToDelete, setCenterToDelete] = useState<AdminCenter | null>(null)
  const [deletingCenterId, setDeletingCenterId] = useState<number | null>(null)

  // Filtros encadenados: estado -> municipio -> parroquia
  const [estadoFilter, setEstadoFilter] = useState<string>('')
  const [municipioFilter, setMunicipioFilter] = useState<string>('')
  const [parroquiaFilter, setParroquiaFilter] = useState<string>('')
  const [filters, setFilters] = useState<FilterOptions>({ estados: [], municipios: [], parroquias: [] })
  const [total, setTotal] = useState<number>(0)

  const [page, setPage] = useState<number>(1)
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const buildQuery = (pageNumber: number) => {
    const query = new URLSearchParams({ page: String(pageNumber), limit: String(PAGE_SIZE) })
    if (estadoFilter) query.set('estado', estadoFilter)
    if (municipioFilter) query.set('municipio', municipioFilter)
    if (parroquiaFilter) query.set('parroquia', parroquiaFilter)
    return query.toString()
  }

  const fetchCenters = useCallback(async (pageNumber: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/directory/admin/centers?${buildQuery(pageNumber)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al cargar los centros')
      }

      setCenters(data?.data || [])
      setTotal(data?.count || 0)
    } catch (fetchError) {
      console.error(fetchError)
      setError('No se pudieron cargar los centros. Intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFilter, municipioFilter, parroquiaFilter])

  // Opciones de filtros encadenados
  useEffect(() => {
    const fetchFilters = async () => {
      const query = new URLSearchParams()
      if (estadoFilter) query.set('estado', estadoFilter)
      if (municipioFilter) query.set('municipio', municipioFilter)

      try {
        const response = await fetch(`/api/directory/admin/filters?${query}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'Error al cargar los filtros')
        }

        setFilters({
          estados: data?.data?.estados || [],
          municipios: data?.data?.municipios || [],
          parroquias: data?.data?.parroquias || [],
        })
      } catch (fetchError) {
        console.error(fetchError)
      }
    }

    void fetchFilters()
  }, [estadoFilter, municipioFilter])

  useEffect(() => {
    void fetchCenters(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFilter, municipioFilter, parroquiaFilter, page])

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount)
    }
  }, [page, pageCount])

  const clearFilters = () => {
    setEstadoFilter('')
    setMunicipioFilter('')
    setParroquiaFilter('')
    setPage(1)
  }

  const openDeleteDialog = (center: AdminCenter) => {
    setCenterToDelete(center)
    setShowDeleteDialog(true)
    setError(null)
    setMessage('')
  }

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setCenterToDelete(null)
  }

  const handleDelete = async () => {
    if (!centerToDelete) return

    setShowDeleteDialog(false)
    setDeletingCenterId(centerToDelete.id)
    setError(null)
    setMessage('')

    try {
      const response = await fetch(`/api/directory/admin/centers/${centerToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al bloquear el centro')
      }

      setCenters((current) => current.filter((item) => item.id !== centerToDelete.id))
      setTotal((current) => Math.max(0, current - 1))
      setMessage('El centro fue bloqueado y quedará registrado con su fecha de eliminación.')
    } catch (deleteError) {
      console.error(deleteError)
      setError('No se pudo bloquear el centro. Intenta de nuevo más tarde.')
    } finally {
      setDeletingCenterId(null)
      setCenterToDelete(null)
    }
  }

  const hasActiveFilters = Boolean(estadoFilter || municipioFilter || parroquiaFilter)

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-6 px-4 mb-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
            Directorio
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Gestión de centros
          </h1>
          <p className="text-lg text-muted-foreground">
            Centros agrupados por organismo con sus defensoras registradas
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-end mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total de centros</p>
            <p className="text-3xl font-bold text-rose-600">{total}</p>
          </div>

          {/* Filtros encadenados */}
          <div className="grid gap-3 sm:grid-cols-3 md:justify-self-center w-full">
            <Select
              value={estadoFilter || undefined}
              onValueChange={(value) => {
                setEstadoFilter(value === estadoFilter ? '' : value)
                setMunicipioFilter('')
                setParroquiaFilter('')
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados con centros</SelectLabel>
                  {filters.estados.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={municipioFilter || undefined}
              onValueChange={(value) => {
                setMunicipioFilter(value === municipioFilter ? '' : value)
                setParroquiaFilter('')
                setPage(1)
              }}
              disabled={!estadoFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={estadoFilter ? 'Municipio' : 'Elige un estado'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Municipios con centros</SelectLabel>
                  {filters.municipios.map((municipio) => (
                    <SelectItem key={municipio} value={municipio}>
                      {municipio}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={parroquiaFilter || undefined}
              onValueChange={(value) => {
                setParroquiaFilter(value === parroquiaFilter ? '' : value)
                setPage(1)
              }}
              disabled={!municipioFilter}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={municipioFilter ? 'Parroquia' : 'Elige un municipio'} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Parroquias con centros</SelectLabel>
                  {filters.parroquias.map((parroquia) => (
                    <SelectItem key={parroquia} value={parroquia}>
                      {parroquia}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              title="Volver a mostrar todos los centros"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
            <Link to="/admin/directorio/nuevo" className="block">
              <Button size="sm" className="font-bold bg-rose-600 hover:bg-rose-700">
                Agregar centro
                <Plus className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {hasActiveFilters && (
          <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filtros activos: {[
              estadoFilter && `Estado: ${estadoFilter}`,
              municipioFilter && `Municipio: ${municipioFilter}`,
              parroquiaFilter && `Parroquia: ${parroquiaFilter}`,
            ].filter(Boolean).join(' · ')}
          </p>
        )}

        {message && (
          <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        <Dialog
          open={showDeleteDialog}
          title="Bloquear centro"
          description={
            centerToDelete
              ? `¿Bloquear “${centerToDelete.organismo}”? El centro quedará registrado en la base de datos con la fecha de bloqueo, pero no se mostrará en el directorio ni en el mapa.`
              : ''
          }
          confirmText="Bloquear"
          cancelText="Cancelar"
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          loading={deletingCenterId !== null}
        />

        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">Cargando centros...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="text-foreground font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : centers.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">
                {hasActiveFilters
                  ? 'No hay centros con los filtros seleccionados.'
                  : 'No hay centros disponibles.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Organismo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Defensoras</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {centers.map((center) => (
                    <TableRow key={center.id}>
                      <TableCell className="max-w-[16rem]">
                        <p className="font-medium truncate">{center.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">{center.direccion}</p>
                      </TableCell>
                      <TableCell className="max-w-[14rem]">
                        <p className="truncate font-medium text-rose-700 dark:text-rose-300">
                          {center.organismo}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-[16rem]">
                        <p className="text-sm truncate">{center.parroquia ?? '—'}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {center.municipio}, {center.estado}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
                          {center.defensoras?.length ?? 0} defensora{(center.defensoras?.length ?? 0) === 1 ? '' : 's'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" aria-label={`Opciones de ${center.organismo}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-200">
                            <DropdownMenuItem asChild>
                              <Link className="w-full cursor-pointer" to={`/directorio/${center.id}`}>
                                <Eye className="mr-2 h-4 w-4" />Ver
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link className="w-full cursor-pointer" to={`/admin/directorio/editar/${center.id}`}>
                                <Pencil className="mr-2 h-4 w-4" />Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(center)}
                              disabled={deletingCenterId === center.id}
                              className="cursor-pointer text-red-600 focus:text-red-700"
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
                Mostrando {centers.length} de {total} centros · Página {page} de {pageCount}
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
