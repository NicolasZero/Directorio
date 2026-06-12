import { type UserEntry } from '@/modules/user/schemes/userSchemes'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react'

type Props = {
    // users: UserEntry[]
    openEditDialog: (user: UserEntry) => void
    openDeleteDialog: (user: UserEntry) => void
    deletingUserId: string | null
    currentPageUsers: UserEntry[]
}

export default function UserTable({ openEditDialog, openDeleteDialog, deletingUserId, currentPageUsers }: Props) {
    return (
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
    )
}
