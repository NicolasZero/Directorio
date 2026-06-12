export type UserEntry = {
    id: string
    cedula: number
    nombre: string
    apellido: string
    email: string
    telefono: string
    username: string
    rol: string
    status: string
}

export type UserForm = {
    id: string
    cedula: string
    nombre: string
    email: string
    username: string
    password: string
    password_confirmation: string
    rol: string
    status: string
}