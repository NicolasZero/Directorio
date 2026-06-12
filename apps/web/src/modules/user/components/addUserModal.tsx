import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { STATUS } from "../consts/consts"

type Props = {
    showFormDialog: boolean
    isEditing: boolean
    closeFormDialog: () => void
    handleFormSubmit: () => void
    formError: string | null
    submitting: boolean
    userForm: any
    setUserForm: (user: any) => void
}

export default function AddUserModal({ showFormDialog, isEditing, closeFormDialog, handleFormSubmit, formError, submitting, userForm, setUserForm }: Props) {
    const [roles, setRoles] = useState([])
    useEffect(() => {
        const fetchRoles = async () => {
            const res = await fetch('/api/user/roles').then((res) => res.json())
            if (res.status == 'ok') {
                setRoles(res.data)
            }
        }
        fetchRoles()
    }, [])

    useEffect(() => {
        console.log(userForm);
    }, [userForm])
    return (
        <Dialog
            open={showFormDialog}
            title={isEditing ? 'Editar usuario' : 'Nuevo usuario'}
            description={isEditing ? 'Modifica los datos del usuario.' : 'Registra un nuevo usuario.'}
            confirmText={isEditing ? 'Actualizar' : 'Crear'}
            cancelText="Cancelar"
            onClose={closeFormDialog}
            onConfirm={handleFormSubmit}
            loading={submitting}
        >
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    handleFormSubmit()
                }}
                className="space-y-4"
            >
                {formError && (
                    <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {formError}
                    </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Cédula</span>
                        <Input
                            type="number"
                            value={userForm.cedula}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, cedula: event.target.value }))}
                            placeholder="Cédula"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Teléfono</span>
                        <Input
                            type="number"
                            value={userForm.telefono}
                            maxLength={11}
                            minLength={11}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, telefono: event.target.value }))}
                            placeholder="Teléfono"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Nombre</span>
                        <Input
                            type="text"
                            value={userForm.nombre}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, nombre: event.target.value }))}
                            placeholder="Nombre completo"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Apellido</span>
                        <Input
                            type="text"
                            value={userForm.apellido}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, apellido: event.target.value }))}
                            placeholder="Apellido completo"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Correo</span>
                        <Input
                            type="email"
                            value={userForm.email}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, email: event.target.value }))}
                            placeholder="correo@dominio.com"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Usuario</span>
                        <Input
                            type="text"
                            value={userForm.username}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, username: event.target.value }))}
                            placeholder="Nombre de usuario"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Rol</span>
                        <Select
                            value={userForm.rol}
                            onValueChange={(value) => setUserForm((prev: any) => ({ ...prev, rol: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role: { id: string, nombre: string }) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Status</span>
                        <Select
                            value={userForm.status}
                            onValueChange={(value) => setUserForm((prev: any) => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS.map((status) => (
                                    <SelectItem key={status.id} value={status.id}>
                                        {status.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-medium text-foreground">{isEditing ? 'Nueva contraseña' : 'Contraseña'}</span>
                        <Input
                            type="password"
                            value={userForm.password}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, password: event.target.value }))}
                            placeholder={isEditing ? 'Dejar vacío para mantener la contraseña actual' : 'Contraseña'}
                        />
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-medium text-foreground">{isEditing ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'}</span>
                        <Input
                            type="password"
                            value={userForm.password_confirmation}
                            onChange={(event) => setUserForm((prev: any) => ({ ...prev, password_confirmation: event.target.value }))}
                            placeholder="Confirmar contraseña"
                        />
                    </label>
                </div>
                <button type="submit" className="hidden" />
            </form>
        </Dialog>
    )
}