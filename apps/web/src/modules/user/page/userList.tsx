import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { type UserEntry, type UserForm } from '../schemes/userSchemes'
import AddUserModal from '../components/addUserModal'

const PAGE_SIZE = 10

const initialFormState: UserForm = {
  id: '',
  cedula: '',
  nombre: '',
  email: '',
  username: '',
  password: '',
  rol: '',
}

export default function UserList() {
  const [users, setUsers] = useState<UserEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string>('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userForm, setUserForm] = useState<UserForm>(initialFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserEntry | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    setMessage('')

    try {
      const response = await fetch('/api/user')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al cargar usuarios')
      }

      console.log();


      setUsers(data?.data || [])
    } catch (fetchError) {
      console.error(fetchError)
      setError('No se pudieron cargar los usuarios. Intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users

    return users.filter((user) =>
      [user.nombre, user.username, user.email, user.rol, String(user.cedula)]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [users, search])

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE))
  const currentPage = page > pageCount ? pageCount : page

  const currentPageUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetForm = () => {
    setUserForm(initialFormState)
    setFormError(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsEditing(false)
    setShowFormDialog(true)
  }

  const openEditDialog = (user: UserEntry) => {
    setUserForm({
      id: user.id,
      cedula: String(user.cedula),
      nombre: user.nombre,
      email: user.email,
      username: user.username,
      password: '',
      rol: user.rol,
    })
    setIsEditing(true)
    setFormError(null)
    setShowFormDialog(true)
  }

  const closeFormDialog = () => {
    setShowFormDialog(false)
    setFormError(null)
  }

  const openDeleteDialog = (user: UserEntry) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
    setError(null)
    setMessage('')
  }

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setUserToDelete(null)
  }

  const validateForm = () => {
    const cedula = Number(userForm.cedula)

    if (!userForm.cedula || Number.isNaN(cedula) || cedula <= 0) {
      return 'Ingresa una cédula válida.'
    }

    if (!userForm.nombre.trim()) {
      return 'Ingresa el nombre del usuario.'
    }

    if (!userForm.email.trim()) {
      return 'Ingresa el correo electrónico.'
    }

    if (!userForm.username.trim()) {
      return 'Ingresa el nombre de usuario.'
    }

    if (!userForm.rol.trim()) {
      return 'Ingresa el rol del usuario.'
    }

    if (!isEditing && !userForm.password.trim()) {
      return 'Ingresa una contraseña para el nuevo usuario.'
    }

    return null
  }

  const handleFormSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    setSubmitting(true)
    setFormError(null)
    setError(null)
    setMessage('')

    const payload: Record<string, unknown> = {
      cedula: Number(userForm.cedula),
      nombre: userForm.nombre.trim(),
      email: userForm.email.trim(),
      username: userForm.username.trim(),
      rol: userForm.rol.trim(),
    }

    if (userForm.password.trim()) {
      payload.password = userForm.password.trim()
    }

    if (isEditing) {
      payload.id = userForm.id
    }

    try {
      const response = await fetch('/api/user', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al guardar el usuario')
      }

      const savedUser = data?.data
      if (savedUser) {
        if (isEditing) {
          setUsers((current) => current.map((user) => (user.id === savedUser.id ? savedUser : user)))
          setMessage('Usuario actualizado correctamente.')
        } else {
          setUsers((current) => [savedUser, ...current])
          setMessage('Usuario creado correctamente.')
        }
      } else {
        await loadUsers()
        setMessage(isEditing ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.')
      }

      setShowFormDialog(false)
      resetForm()
    } catch (submitError) {
      console.error(submitError)
      setFormError('No se pudo guardar el usuario. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    setShowDeleteDialog(false)
    setDeletingUserId(userToDelete.id)
    setError(null)
    setMessage('')

    try {
      const response = await fetch(`/api/user/${userToDelete.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Error al eliminar el usuario')
      }

      setUsers((current) => current.filter((user) => user.id !== userToDelete.id))
      setMessage('Usuario eliminado correctamente.')
    } catch (deleteError) {
      console.error(deleteError)
      setError('No se pudo eliminar el usuario. Intenta de nuevo más tarde.')
    } finally {
      setDeletingUserId(null)
      setUserToDelete(null)
    }
  }

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-6 px-4 mb-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
            Usuarios
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Gestión de usuarios
          </h1>
          <p className="text-lg text-muted-foreground">
            Administra cuentas de usuario y roles de acceso.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total de usuarios</p>
            <p className="text-3xl font-bold text-rose-600">{users.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''} encontrados
            </p>
          </div>
          <div>
            <Button size="lg" className="text-base font-bold bg-rose-600 hover:bg-rose-700" onClick={openCreateDialog}>
              Agregar usuario
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-end">
            <label className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                name="search"
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Buscar"
                className="pl-9"
                title="Buscar por nombre, usuario, correo o rol"
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

        <AddUserModal
          showFormDialog={showFormDialog}
          isEditing={isEditing}
          closeFormDialog={closeFormDialog}
          handleFormSubmit={handleFormSubmit}
          formError={formError}
          submitting={submitting}
          userForm={userForm}
          setUserForm={setUserForm}
        />

        <Dialog
          open={showDeleteDialog}
          title="Eliminar usuario"
          description={userToDelete ? `¿Estás seguro de eliminar al usuario “${userToDelete.username}”?` : ''}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          loading={deletingUserId !== null}
        />

        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">Cargando usuarios...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="text-foreground font-medium">{error}</p>
            </CardContent>
          </Card>
        ) : users.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="text-center py-10">
              <p className="font-medium">No hay usuarios disponibles.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Opciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nombre}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-100 hover:bg-rose-50">
                          {user.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="gap-0"
                              onClick={() => openEditDialog(user)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-0"
                              onClick={() => openDeleteDialog(user)}
                              disabled={deletingUserId === user.id}
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
                Mostrando {currentPageUsers.length} de {filteredUsers.length} resultados
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
    </div>
  )
}
