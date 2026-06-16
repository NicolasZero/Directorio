export interface Institution {
    nombre: string
    nombre_corto: string
    fecha_creacion: string
    ley_creacion: string
    descripcion: string
    vision: string
    mision: string
    valores: { icono: string; titulo: string; descripcion: string }[]
    logros: { numero: string; titulo: string; descripcion: string }[]
    aliados: { nombre: string; tipo: string }[]
    contacto: { direccion: string; telefono: string; correo: string; horario: string }
    redesSociales: { nombre: string; url: string }[]
}