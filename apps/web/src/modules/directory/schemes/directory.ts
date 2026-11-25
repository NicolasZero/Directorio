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
  latitud: number | null
  longitud: number | null
  servicios?: string[]
  responsables?: Responsable[]
  redes?: RedSocial[]
  requisitos?: string[]
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

export const getCoordinateValidationError = (latitude: string, longitude: string) => {
  const hasLatitude = latitude.trim() !== ''
  const hasLongitude = longitude.trim() !== ''

  if (!hasLatitude && !hasLongitude) return null
  if (!hasLatitude || !hasLongitude) return 'Ingresa latitud y longitud, o deja ambos campos vacíos.'

  const latitudeValue = Number(latitude)
  const longitudeValue = Number(longitude)

  if (
    !Number.isFinite(latitudeValue) ||
    !Number.isFinite(longitudeValue) ||
    latitudeValue < -90 ||
    latitudeValue > 90 ||
    longitudeValue < -180 ||
    longitudeValue > 180
  ) {
    return 'Las coordenadas deben estar dentro de los rangos geográficos válidos.'
  }

  return null
}