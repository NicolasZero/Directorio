import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'

type Position = [number, number]
type PolygonCoordinates = Position[][]

type Geometry =
    | { type: 'Polygon'; coordinates: PolygonCoordinates }
    | { type: 'MultiPolygon'; coordinates: PolygonCoordinates[] }

export interface MapFeatureProperties {
    name: string
    mapName: string | null
    databaseName: string | null
    kind?: 'neighbor'
    status?: string
    claimedBy?: string
    administeredBy?: string
}

interface MapFeature {
    type: 'Feature'
    id: string
    properties: MapFeatureProperties
    geometry: Geometry
}

export interface MapCenter {
    id: number
    nombre: string
    descripcion: string | null
    organismo: string
    tipo_organismo: 'INAMUJER' | 'MINISTERIO' | 'OTRA'
    direccion: string
    parroquia: string
    municipio: string
    estado: string
    latitud: number
    longitud: number
    calificacion: number | null
}

interface MapProps {
    centers: MapCenter[]
    selectedRegionKey: string | null
    selectedCenterId: number | null
    zoomScale: number
    onFeatureSelect: (feature: MapFeatureProperties, elementId: string) => void
    onCenterSelect: (
        center: MapCenter,
        region: MapFeatureProperties | null,
        regionElementId: string | null,
    ) => void
    onLoadError: (message: string | null) => void
}

interface Projection {
    point: (position: Position) => Position
    path: (geometry: Geometry) => string
}

const WIDTH = 1400
const HEIGHT = 800
const PADDING = 24
const MAP_BOUNDS = { west: -79.6, east: -53, south: -0.5, north: 14.7 }

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const parseRing = (value: unknown): Position[] => {
    if (!Array.isArray(value) || value.length < 4) {
        throw new Error('El GeoJSON contiene un anillo geográfico inválido.')
    }

    return value.map((coordinate) => {
        if (
            !Array.isArray(coordinate) ||
            coordinate.length < 2 ||
            typeof coordinate[0] !== 'number' ||
            typeof coordinate[1] !== 'number'
        ) {
            throw new Error('El GeoJSON contiene una coordenada inválida.')
        }
        return [coordinate[0], coordinate[1]]
    })
}

const parseGeometry = (value: unknown): Geometry => {
    if (!isRecord(value) || !Array.isArray(value.coordinates)) {
        throw new Error('El GeoJSON contiene una geometría inválida.')
    }

    if (value.type === 'Polygon') {
        return {
            type: 'Polygon',
            coordinates: value.coordinates.map(parseRing),
        }
    }

    if (value.type === 'MultiPolygon') {
        return {
            type: 'MultiPolygon',
            coordinates: value.coordinates.map((polygon) => {
                if (!Array.isArray(polygon)) {
                    throw new Error('El GeoJSON contiene un polígono inválido.')
                }
                return polygon.map(parseRing)
            }),
        }
    }

    throw new Error('El GeoJSON contiene un tipo de geometría no compatible.')
}

const parseFeatureCollection = (value: unknown): MapFeature[] => {
    if (!isRecord(value) || value.type !== 'FeatureCollection' || !Array.isArray(value.features)) {
        throw new Error('El archivo cartográfico no tiene formato FeatureCollection.')
    }

    return value.features.map((feature): MapFeature => {
        if (
            !isRecord(feature) ||
            feature.type !== 'Feature' ||
            typeof feature.id !== 'string' ||
            !isRecord(feature.properties)
        ) {
            throw new Error('El archivo cartográfico contiene una entidad inválida.')
        }

        const properties = feature.properties
        if (typeof properties.name !== 'string') {
            throw new Error('Hay una región sin nombre en el archivo cartográfico.')
        }

        return {
            type: 'Feature',
            id: feature.id,
            properties: {
                name: properties.name,
                mapName: typeof properties.mapName === 'string' ? properties.mapName : null,
                databaseName: typeof properties.databaseName === 'string' ? properties.databaseName : null,
                ...(properties.kind === 'neighbor' ? { kind: 'neighbor' as const } : {}),
                ...(typeof properties.status === 'string' ? { status: properties.status } : {}),
                ...(typeof properties.claimedBy === 'string' ? { claimedBy: properties.claimedBy } : {}),
                ...(typeof properties.administeredBy === 'string' ? { administeredBy: properties.administeredBy } : {}),
            },
            geometry: parseGeometry(feature.geometry),
        }
    })
}

const getPolygons = (geometry: Geometry): PolygonCoordinates[] =>
    geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates

const createProjection = (features: MapFeature[]): Projection | null => {
    const projectGeographic = ([longitude, latitude]: Position): Position => {
        const radians = (Math.max(-85, Math.min(85, latitude)) * Math.PI) / 180
        return [
            (longitude * Math.PI) / 180,
            Math.log(Math.tan(Math.PI / 4 + radians / 2)),
        ]
    }

    if (features.length === 0) return null

    const [minX, maxY] = projectGeographic([MAP_BOUNDS.west, MAP_BOUNDS.north])
    const [maxX, minY] = projectGeographic([MAP_BOUNDS.east, MAP_BOUNDS.south])
    const rangeX = maxX - minX
    const rangeY = maxY - minY
    if (rangeX === 0 || rangeY === 0) return null

    const scale = Math.min((WIDTH - PADDING * 2) / rangeX, (HEIGHT - PADDING * 2) / rangeY)
    const offsetX = (WIDTH - rangeX * scale) / 2
    const offsetY = (HEIGHT - rangeY * scale) / 2
    const point = (position: Position): Position => {
        const [x, y] = projectGeographic(position)
        return [
            offsetX + (x - minX) * scale,
            offsetY + (maxY - y) * scale,
        ]
    }

    const path = (geometry: Geometry): string =>
        getPolygons(geometry)
            .flatMap((polygon) =>
                polygon.map((ring) => {
                    const [first, ...rest] = ring.map(point)
                    return `M ${first[0]} ${first[1]} ${rest.map(([x, y]) => `L ${x} ${y}`).join(' ')} Z`
                })
            )
            .join(' ')

    return { point, path }
}

const featureElementId = (id: string) => `region-${id.replace(/[^a-zA-Z0-9_-]/g, '-')}`
const normalize = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase()

const getLabelAnchor = (
    geometry: Geometry,
    project: Projection['point'],
): { position: Position; area: number } | null => {
    let largest: { position: Position; area: number } | null = null

    for (const polygon of getPolygons(geometry)) {
        const ring = polygon[0]
        if (!ring?.length) continue

        const points = ring.map(project)
        let doubleArea = 0
        let xTotal = 0
        let yTotal = 0

        for (let index = 0; index < points.length - 1; index += 1) {
            const [x1, y1] = points[index]
            const [x2, y2] = points[index + 1]
            const cross = x1 * y2 - x2 * y1
            doubleArea += cross
            xTotal += (x1 + x2) * cross
            yTotal += (y1 + y2) * cross
        }

        const area = Math.abs(doubleArea / 2)
        if (area > (largest?.area ?? 0) && doubleArea !== 0) {
            largest = {
                position: [xTotal / (3 * doubleArea), yTotal / (3 * doubleArea)],
                area,
            }
        }
    }

    return largest
}

export default function Mapa({
    centers,
    selectedRegionKey,
    selectedCenterId,
    zoomScale,
    onFeatureSelect,
    onCenterSelect,
    onLoadError,
}: MapProps) {
    const [features, setFeatures] = useState<MapFeature[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const loadBoundaries = async () => {
            try {
                const [boundariesResponse, neighborsResponse] = await Promise.all([
                    fetch(new URL('../assets/venezuela-estados.geojson', import.meta.url)),
                    fetch(new URL('../assets/venezuela-paises-vecinos.geojson', import.meta.url)),
                ])
                if (!boundariesResponse.ok || !neighborsResponse.ok) {
                    throw new Error(
                        `Error HTTP ${!boundariesResponse.ok ? boundariesResponse.status : neighborsResponse.status}`
                    )
                }

                const [boundaries, neighbors] = await Promise.all([
                    boundariesResponse.json().then(parseFeatureCollection),
                    neighborsResponse.json().then(parseFeatureCollection),
                ])
                if (cancelled) return

                setFeatures([...neighbors, ...boundaries])
                onLoadError(null)
            } catch (error) {
                if (cancelled) return
                console.error(error)
                onLoadError('No se pudieron cargar los límites geográficos del mapa.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadBoundaries()
        return () => {
            cancelled = true
        }
    }, [onLoadError])

    const projection = useMemo(() => createProjection(features), [features])

    const selectCenter = (center: MapCenter) => {
        const matchingRegion = features.find(
            (feature) =>
                feature.properties.kind !== 'neighbor' &&
                feature.properties.databaseName &&
                normalize(feature.properties.databaseName) === normalize(center.estado)
        )
        onCenterSelect(
            center,
            matchingRegion?.properties ?? null,
            matchingRegion ? featureElementId(matchingRegion.id) : null,
        )
    }

    if (loading || !projection) {
        return (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground" role="status">
                {loading ? 'Cargando mapa…' : 'No hay geometrías para mostrar.'}
            </div>
        )
    }

    return (
        <svg
            className="estado-svg"
            width={WIDTH}
            height={HEIGHT}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label="Mapa interactivo de Venezuela y países limítrofes con zona en reclamación"
        >
            <defs>
                <clipPath id="map-geography-clip">
                    <rect
                        x={PADDING}
                        y={PADDING}
                        width={WIDTH - PADDING * 2}
                        height={HEIGHT - PADDING * 2}
                    />
                </clipPath>
                <linearGradient
                    id="map-vegetation-gradient"
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="0"
                    x2={WIDTH}
                    y2={HEIGHT}
                >
                    <stop offset="0%" stopColor="#24616a" />
                    <stop offset="48%" stopColor="#174b57" />
                    <stop offset="100%" stopColor="#103744" />
                </linearGradient>
            </defs>
            <text
                className={`map-water-label${selectedRegionKey ? ' is-hidden' : ''}`}
                x="700"
                y="54"
                aria-hidden="true"
                clipPath="url(#map-geography-clip)"
            >
                Mar Caribe
            </text>
            <g className={`map-regions${selectedRegionKey ? ' is-focused' : ''}`} clipPath="url(#map-geography-clip)">
                {features
                    .filter((feature) => feature.properties.kind === 'neighbor')
                    .map((feature) => (
                        <path
                            key={feature.id}
                            className="map-neighbor-country"
                            d={projection.path(feature.geometry)}
                            fillRule="evenodd"
                            aria-hidden="true"
                        >
                            <title>{feature.properties.name}</title>
                        </path>
                    ))}
                {features.filter((feature) => feature.properties.kind !== 'neighbor').map((feature) => {
                    const key = feature.properties.databaseName ?? feature.properties.mapName
                    const isSelected = key !== null && key === selectedRegionKey
                    const isClaim = feature.properties.status === 'disputed_claim'
                    const id = featureElementId(feature.id)
                    const title = feature.properties.mapName ?? feature.properties.name
                    const labelAnchor = getLabelAnchor(feature.geometry, projection.point)

                    return (
                        <g key={feature.id}>
                            <path
                                id={id}
                                className={`map-region${isSelected ? ' is-selected' : ''}${isClaim ? ' is-claim' : ''}`}
                                d={projection.path(feature.geometry)}
                                style={{
                                    strokeWidth: `${(isSelected ? 2 : isClaim ? 1.6 : 1) / zoomScale}px`,
                                }}
                                fillRule="evenodd"
                                data-name={feature.properties.mapName ?? feature.properties.name}
                                data-database-name={feature.properties.databaseName ?? ''}
                                role="button"
                                tabIndex={0}
                                aria-label={
                                    isClaim
                                        ? `${title}, zona reclamada por Venezuela y administrada por Guyana`
                                        : title
                                }
                                aria-pressed={isSelected}
                                onClick={() => onFeatureSelect(feature.properties, id)}
                                onKeyDown={(event: KeyboardEvent<SVGPathElement>) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault()
                                        onFeatureSelect(feature.properties, id)
                                    }
                                }}
                            >
                                <title>{title}</title>
                            </path>
                            {labelAnchor &&
                                labelAnchor.area >= 1400 &&
                                (!selectedRegionKey || isSelected) && (
                                <text
                                    className="map-region-label"
                                    x={labelAnchor.position[0]}
                                    y={labelAnchor.position[1]}
                                    aria-hidden="true"
                                >
                                    {title}
                                </text>
                            )}
                        </g>
                    )
                })}
                <text className="map-country-label" x={projection.point([-73.6, 5.2])[0]} y={projection.point([-73.6, 5.2])[1]}>
                    Colombia
                </text>
                <text className="map-country-label map-country-label--regional" x={projection.point([-85.4, 12.1])[0]} y={projection.point([-85.4, 12.1])[1]}>
                    Nicaragua
                </text>
                <text className="map-country-label map-country-label--regional" x={projection.point([-84.4, 9.5])[0]} y={projection.point([-84.4, 9.5])[1]}>
                    Costa Rica
                </text>
                <text className="map-country-label" x={projection.point([-62, 0.4])[0]} y={projection.point([-62, 0.4])[1]}>
                    Brasil
                </text>
                <text className="map-country-label map-country-label--guyana" x={projection.point([-57.4, 7.2])[0]} y={projection.point([-57.4, 7.2])[1]}>
                    Guyana
                </text>
                <text className="map-country-label" x={projection.point([-55.7, 4.3])[0]} y={projection.point([-55.7, 4.3])[1]}>
                    Suriname
                </text>
            </g>
            <g className="map-centers" clipPath="url(#map-geography-clip)">
                {centers.map((center) => {
                    const [x, y] = projection.point([center.longitud, center.latitud])
                    const isSelected = center.id === selectedCenterId
                    const label = `${center.nombre}, ${center.parroquia}, ${center.municipio}, ${center.estado}`

                    return (
                        <g
                            key={center.id}
                            id={`center-${center.id}`}
                            className={`map-center map-center--${center.tipo_organismo.toLowerCase()}${isSelected ? ' is-selected' : ''}`}
                            transform={`translate(${x} ${y}) scale(${1 / zoomScale})`}
                            role="button"
                            tabIndex={0}
                            aria-label={label}
                            aria-pressed={isSelected}
                            onClick={(event: MouseEvent<SVGGElement>) => {
                                event.stopPropagation()
                                selectCenter(center)
                            }}
                            onKeyDown={(event: KeyboardEvent<SVGGElement>) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    selectCenter(center)
                                }
                            }}
                        >
                            <circle className="map-center-hit-area" r="11" />
                            <circle className="map-center-dot" r={isSelected ? 6 : 4.5} />
                            <title>{label}</title>
                        </g>
                    )
                })}
            </g>
        </svg>
    )
}
