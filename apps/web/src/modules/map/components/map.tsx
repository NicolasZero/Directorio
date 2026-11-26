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
const HEIGHT = 1100
const PADDING = 42

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
        const isEsequibo = feature.id === 'VEN-GUY-ESEQUIBO-CLAIM'

        return {
            type: 'Feature',
            id: feature.id,
            properties: {
                name: isEsequibo ? 'Esequibo' : properties.name,
                mapName: isEsequibo
                    ? 'Esequibo'
                    : typeof properties.mapName === 'string'
                        ? properties.mapName
                        : null,
                databaseName: typeof properties.databaseName === 'string' ? properties.databaseName : null,
                ...(properties.kind === 'neighbor' ? { kind: 'neighbor' as const } : {}),
                ...(!isEsequibo && typeof properties.status === 'string' ? { status: properties.status } : {}),
                ...(!isEsequibo && typeof properties.claimedBy === 'string' ? { claimedBy: properties.claimedBy } : {}),
                ...(!isEsequibo && typeof properties.administeredBy === 'string' ? { administeredBy: properties.administeredBy } : {}),
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

    const projectedPoints = features.flatMap((feature) =>
        getPolygons(feature.geometry).flatMap((polygon) =>
            polygon.flatMap((ring) => ring.map(projectGeographic)),
        ),
    )
    const xValues = projectedPoints.map(([x]) => x)
    const yValues = projectedPoints.map(([, y]) => y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)
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

interface LabelPlacement {
    feature: MapFeature
    title: string
    anchor: Position
    position: Position
}

interface LabelCandidate {
    feature: MapFeature
    title: string
    anchor: Position
    area: number
}

const labelOffsets: Position[] = [
    [0, 0],
    [0, -22],
    [0, 22],
    [-32, 0],
    [32, 0],
    [0, -42],
    [0, 42],
    [-38, -22],
    [38, -22],
    [-38, 22],
    [38, 22],
    [-56, 0],
    [56, 0],
]

const getLabelCandidates = (
    features: MapFeature[],
    project: Projection['point'],
): LabelCandidate[] =>
    features
        .filter((feature) => feature.properties.kind !== 'neighbor')
        .flatMap((feature) => {
            const labelAnchor = getLabelAnchor(feature.geometry, project)
            if (!labelAnchor || labelAnchor.area < 1400) return []

            return [{
                feature,
                title: feature.properties.mapName ?? feature.properties.name,
                anchor: labelAnchor.position,
                area: labelAnchor.area,
            }]
        })

const getLabelPlacements = (
    candidates: LabelCandidate[],
    selectedRegionKey: string | null,
    zoomScale: number,
): LabelPlacement[] => {
    const orderedCandidates = candidates
        .filter((feature) => {
            if (!selectedRegionKey) return true
            return (feature.feature.properties.databaseName ?? feature.feature.properties.mapName) === selectedRegionKey
        })
        .sort((first, second) => second.area - first.area)

    const placed: Array<LabelPlacement & { width: number; height: number }> = []
    const scale = Math.max(1, zoomScale)

    for (const candidate of orderedCandidates) {
        const width = Math.max(34, candidate.title.length * 8.5 + 8)
        const height = 22
        const [anchorX, anchorY] = candidate.anchor
        const position = labelOffsets
            .map(([offsetX, offsetY]) => [
                anchorX + offsetX / scale,
                anchorY + offsetY / scale,
            ] as Position)
            .find(([x, y]) =>
                placed.every((other) =>
                    Math.abs(x - other.position[0]) * scale >= (width + other.width) / 2 + 5 ||
                    Math.abs(y - other.position[1]) * scale >= (height + other.height) / 2 + 5
                )
            )

        if (position) {
            placed.push({
                feature: candidate.feature,
                title: candidate.title,
                anchor: candidate.anchor,
                position,
                width,
                height,
            })
        }
    }

    return placed
}

const keepScreenSizeTransform = ([x, y]: Position, zoomScale: number) =>
    `translate(${x} ${y}) scale(${1 / zoomScale}) translate(${-x} ${-y})`

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
                const boundariesResponse = await fetch(
                    new URL('../assets/venezuela-estados.geojson', import.meta.url),
                )
                if (!boundariesResponse.ok) {
                    throw new Error(`Error HTTP ${boundariesResponse.status}`)
                }

                const boundaries = await boundariesResponse.json().then(parseFeatureCollection)
                if (cancelled) return

                setFeatures(boundaries)
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
    const labelCandidates = useMemo(
        () => projection ? getLabelCandidates(features, projection.point) : [],
        [features, projection],
    )
    const labelPlacements = useMemo(
        () => getLabelPlacements(labelCandidates, selectedRegionKey, zoomScale),
        [labelCandidates, selectedRegionKey, zoomScale],
    )

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
            aria-label="Mapa interactivo de Venezuela"
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
                    <stop offset="0%" stopColor="#8056b2" />
                    <stop offset="48%" stopColor="#694395" />
                    <stop offset="100%" stopColor="#4f3478" />
                </linearGradient>
            </defs>
            <g className={`map-regions${selectedRegionKey ? ' is-focused' : ''}`} clipPath="url(#map-geography-clip)">
                {features.map((feature) => {
                    const key = feature.properties.databaseName ?? feature.properties.mapName
                    const isSelected = key !== null && key === selectedRegionKey
                    const id = featureElementId(feature.id)
                    const title = feature.properties.mapName ?? feature.properties.name

                    return (
                        <path
                            key={feature.id}
                            id={id}
                            className={`map-region${isSelected ? ' is-selected' : ''}`}
                            d={projection.path(feature.geometry)}
                            style={{
                                strokeWidth: `${(isSelected ? 2 : 1) / zoomScale}px`,
                            }}
                            fillRule="evenodd"
                            data-name={feature.properties.mapName ?? feature.properties.name}
                            data-database-name={feature.properties.databaseName ?? ''}
                            role="button"
                            tabIndex={0}
                            aria-label={title}
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
                    )
                })}
                {labelPlacements.map(({ feature, title, anchor, position }) => (
                    <g
                        key={`label-${feature.id}`}
                        className="map-region-label-group"
                        transform={keepScreenSizeTransform(position, zoomScale)}
                        aria-hidden="true"
                    >
                        {(anchor[0] !== position[0] || anchor[1] !== position[1]) && (
                            <line
                                className="map-label-leader"
                                x1={anchor[0]}
                                y1={anchor[1]}
                                x2={position[0]}
                                y2={position[1]}
                            />
                        )}
                        <text className="map-region-label" x={position[0]} y={position[1]}>
                            {title}
                        </text>
                    </g>
                ))}
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
                            <path className="map-center-icon" d="M-8 -1 0 -7.5 8 -1 6.5 0.8 6.5 7 -6.5 7 -6.5 0.8 -8 -1Z M-1.6 7V2H1.6V7Z" fillRule="evenodd" />
                            <title>{label}</title>
                        </g>
                    )
                })}
            </g>
        </svg>
    )
}
