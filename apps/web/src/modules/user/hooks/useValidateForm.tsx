import { type UserForm } from "../schemes/userSchemes";

export const validateForm = (userForm: UserForm, isEditing: boolean) => {
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

    if (isEditing && userForm.password.trim()) {
        if (!userForm.password_confirmation.trim()) {
            return 'Ingresa la confirmación de la nueva contraseña.'
        }

        if (userForm.password.trim() !== userForm.password_confirmation.trim()) {
            return 'Las contraseñas no coinciden.'
        }
    }

    return null
}
