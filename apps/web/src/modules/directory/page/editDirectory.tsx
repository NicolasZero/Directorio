import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type DirectoryEntry } from '../schemas/directory'

const PAGE_SIZE = 10

export default function EditDirectory() {
  const [directories, setDirectories] = useState<DirectoryEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
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

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-6 px-4 mb-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
            Directorio
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Editar directorios
          </h1>
          <p className="text-lg text-muted-foreground">
            Revisa y administra los directorios cargados desde la API.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total de directorios</p>
            <p className="text-3xl font-bold text-rose-600">{directories.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredDirectories.length} resultado{filteredDirectories.length !== 1 ? 's' : ''} encontrados
            </p>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TableCaption>
                Listado de directorios cargados desde la API.
              </TableCaption>
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
