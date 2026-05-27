import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { STATUS } from "../consts/consts.js"

export default function AddUserModal({ showFormDialog, isEditing, closeFormDialog, handleFormSubmit, formError, submitting, userForm, setUserForm }) {
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
                            onChange={(event) => setUserForm((prev) => ({ ...prev, cedula: event.target.value }))}
                            placeholder="Cédula"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Nombre</span>
                        <Input
                            type="text"
                            value={userForm.nombre}
                            onChange={(event) => setUserForm((prev) => ({ ...prev, nombre: event.target.value }))}
                            placeholder="Nombre completo"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Correo</span>
                        <Input
                            type="email"
                            value={userForm.email}
                            onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
                            placeholder="correo@dominio.com"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-foreground">Usuario</span>
                        <Input
                            type="text"
                            value={userForm.username}
                            onChange={(event) => setUserForm((prev) => ({ ...prev, username: event.target.value }))}
                            placeholder="Nombre de usuario"
                        />
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-medium text-foreground">Rol</span>
                        <Select
                            value={userForm.rol}
                            onValueChange={(value) => setUserForm((prev) => ({ ...prev, rol: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        {role.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-medium text-foreground">Status</span>
                        <Select
                            value={userForm.status}
                            onValueChange={(value) => setUserForm((prev) => ({ ...prev, status: value }))}
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
                        <span className="text-sm font-medium text-foreground">Contraseña</span>
                        <Input
                            type="password"
                            value={userForm.password}
                            onChange={(event) => setUserForm((prev) => ({ ...prev, password: event.target.value }))}
                            placeholder={isEditing ? 'Dejar vacío para mantener la contraseña actual' : 'Contraseña'}
                        />
                    </label>
                </div>
                <button type="submit" className="hidden" />
            </form>
        </Dialog>
    )
}