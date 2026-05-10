interface Responsable {
  nombre: string
  cargo: string
}

interface RedSocial {
  nombre: string
  url: string
  icono: string
}

export interface DirectoryDetailData {
  id: number
  nombre: string
  descripcion: string
  direccion: string
  telefono: string
  correo: string
  municipio: string
  estado: string
  horario: string
  servicios?: string[]
  responsables?: Responsable[]
  redes?: RedSocial[]
}

export interface DirectoryEntry {
  id: number
  nombre: string
  direccion: string
  telefono: string
  foto?: string
  municipio: string
  estado: string
}