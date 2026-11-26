import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ExternalLink,
    House,
    Image as ImageIcon,
    MapPin,
    RefreshCw,
    Search,
    Star,
    X,
} from 'lucide-react'
import BackArrowButton from '@/components/backArrowButton'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch'
import Map from '@/modules/map/components/map'
import type { MapCenter, MapFeatureProperties } from '@/modules/map/components/map'
import '@/modules/map/assets/style.css'

interface ApiResponse {
    status?: string
    data?: unknown
    count?: number
    error?: string
}

type ZoomToElement = (node: string, scale?: number, animationTime?: number) => void

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const parseDefensoras = (value: unknown): MapCenter['defensoras'] => {
    if (!Array.isArray(value)) {
        throw new Error('La API devolvió defensoras con formato inválido.')
    }

    return value.map((defensora): MapCenter['defensoras'][number] => {
        if (!isRecord(defensora) || typeof defensora.id !== 'number' || typeof defensora.nombre !== 'string') {
            throw new Error('La API devolvió una defensora con datos inválidos.')
        }
        return { id: defensora.id, nombre: defensora.nombre }
    })
}

const parseCenter = (value: unknown): MapCenter => {
    if (!isRecord(value)) {
        throw new Error('La API devolvió una sede con formato inválido.')
    }

    const {
        id,
        nombre,
        descripcion,
        organismo,
        tipo_organismo,
        direccion,
        parroquia,
        defensoras: rawDefensoras,
        municipio,
        estado,
        latitud,
        longitud,
        calificacion,
    } = value

    const defensoras = parseDefensoras(rawDefensoras)

    if (
        typeof id !== 'number' ||
        typeof nombre !== 'string' ||
        !(typeof descripcion === 'string' || descripcion === null) ||
        typeof organismo !== 'string' ||
        (tipo_organismo !== 'INAMUJER' && tipo_organismo !== 'MINISTERIO' && tipo_organismo !== 'OTRA') ||
        typeof direccion !== 'string' ||
        typeof parroquia !== 'string' ||
        typeof municipio !== 'string' ||
        typeof estado !== 'string' ||
        typeof latitud !== 'number' ||
        typeof longitud !== 'number' ||
        !(typeof calificacion === 'number' || calificacion === null)
    ) {
        throw new Error('La API devolvió datos de sede incompletos o inválidos.')
    }

    return {
        id,
        nombre,
        descripcion,
        organismo,
        tipo_organismo,
        direccion,
        parroquia,
        defensoras,
        municipio,
        estado,
        latitud,
        longitud,
        calificacion,
    }
}

const normalize = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase()

const toImageSlug = (value: string) =>
    normalize(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

const getCenterImageDirectory = (center: MapCenter) =>
    `/img_sede/${toImageSlug(`${center.nombre}-${center.estado}-${center.municipio}`)}`

function CenterImage({ src, alt }: { src: string; alt: string }) {
    const [failed, setFailed] = useState(false)

    return (
        <div className="map-center-photo">
            {failed ? (
                <div className="map-photo-placeholder" role="img" aria-label={`${alt}: imagen pendiente`}>
                    <ImageIcon aria-hidden="true" />
                    <span>Imagen próximamente</span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onError={() => setFailed(true)}
                />
            )}
        </div>
    )
}

const MapaInteractivo = () => {
    const [centers, setCenters] = useState<MapCenter[]>([])
    const [selectedState, setSelectedState] = useState<MapFeatureProperties | null>(null)
    const [selectedRegionElementId, setSelectedRegionElementId] = useState<string | null>(null)
    const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null)
    const [loadingCenters, setLoadingCenters] = useState(true)
    const [refreshingCenters, setRefreshingCenters] = useState(false)
    const [isClosingPanel, setIsClosingPanel] = useState(false)
    const [mapZoomScale, setMapZoomScale] = useState(1)
    const [maxMapZoom, setMaxMapZoom] = useState(20)
    const [mapFrameHeight, setMapFrameHeight] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [mapError, setMapError] = useState<string | null>(null)
    const transformRef = useRef<ReactZoomPanPinchContentRef | null>(null)
    const mapFrameRef = useRef<HTMLDivElement | null>(null)
    const mapSectionRef = useRef<HTMLElement | null>(null)
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const centerRequestRef = useRef<AbortController | null>(null)

    const fetchCenters = useCallback(async (initialLoad = false) => {
        centerRequestRef.current?.abort()
        const controller = new AbortController()
        centerRequestRef.current = controller
        if (initialLoad) setLoadingCenters(true)
        else setRefreshingCenters(true)

        try {
            const response = await fetch('/api/map/centers', {
                signal: controller.signal,
                cache: 'no-store',
            })
            const payload: ApiResponse = await response.json()

            if (!response.ok) {
                throw new Error(payload.error || 'No se pudieron cargar las sedes.')
            }
            if (!Array.isArray(payload.data)) {
                throw new Error('La respuesta de sedes no tiene el formato esperado.')
            }

            setCenters(payload.data.map(parseCenter))
            setError(null)
        } catch (fetchError) {
            if (controller.signal.aborted) return
            console.error(fetchError)
            setError('No se pudieron cargar las sedes. Verifica la base de datos e inténtalo de nuevo.')
        } finally {
            if (!controller.signal.aborted) {
                setLoadingCenters(false)
                setRefreshingCenters(false)
                centerRequestRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        const initialRequest = window.setTimeout(() => {
            void fetchCenters(true)
        }, 0)

        const refreshWhenVisible = () => {
            if (!document.hidden) void fetchCenters()
        }

        window.addEventListener('focus', refreshWhenVisible)
        document.addEventListener('visibilitychange', refreshWhenVisible)
        return () => {
            window.clearTimeout(initialRequest)
            window.removeEventListener('focus', refreshWhenVisible)
            document.removeEventListener('visibilitychange', refreshWhenVisible)
            centerRequestRef.current?.abort()
        }
    }, [fetchCenters])

    useEffect(() => {
        const frame = mapFrameRef.current
        if (!frame) return

        const resizeObserver = new ResizeObserver(([entry]) => {
            const nextHeight = Math.round(entry.contentRect.height)
            setMapFrameHeight((currentHeight) => currentHeight === nextHeight ? currentHeight : nextHeight)
        })
        resizeObserver.observe(frame)

        return () => resizeObserver.disconnect()
    }, [])

    useEffect(
        () => () => {
            if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
        },
        [],
    )

    const selectedRegionKey = selectedState?.databaseName ?? selectedState?.mapName ?? null
    const filteredCenters = selectedState?.databaseName
        ? centers.filter((center) => normalize(center.estado) === normalize(selectedState.databaseName!))
        : []
    const selectedCenter = centers.find((center) => center.id === selectedCenterId) ?? null
    const mapCenters = selectedState ? filteredCenters : centers

    const scheduleMapFocus = (
        elementId: string,
        zoomToElement: ZoomToElement,
        fixedScale?: number,
        delay = 460,
    ) => {
        if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
        animationTimerRef.current = setTimeout(() => {
            const target = document.getElementById(elementId)
            const frame = mapFrameRef.current
            if (!(target instanceof SVGGraphicsElement) || !frame) return

            const svg = target.ownerSVGElement
            const viewBox = svg?.viewBox.baseVal
            if (!svg || !viewBox || viewBox.width === 0 || viewBox.height === 0) return

            let scale = fixedScale ?? 6
            if (fixedScale === undefined) {
                const bounds = target.getBBox()
                const rect = svg.getBoundingClientRect()
                const svgScale = Math.min(rect.width / viewBox.width, rect.height / viewBox.height)
                const width = bounds.width * svgScale
                const height = bounds.height * svgScale
                if (width > 0 && height > 0) {
                    scale = Math.min(
                        (frame.clientWidth * 0.82) / width,
                        (frame.clientHeight * 0.78) / height,
                        8,
                    )
                    scale = Math.max(2.2, scale)
                }
            }

            setMaxMapZoom(scale)
            zoomToElement(elementId, scale, 650)
            animationTimerRef.current = null
        }, delay)
    }

    const handleFeatureSelect = (
        feature: MapFeatureProperties,
        elementId: string,
        zoomToElement: ZoomToElement,
    ) => {
        setIsClosingPanel(false)
        setSelectedState(feature)
        setSelectedRegionElementId(elementId)
        setSelectedCenterId(null)
        setMaxMapZoom(20)
        mapSectionRef.current?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start',
        })
        scheduleMapFocus(elementId, zoomToElement)
    }

    const handleCenterSelect = (
        center: MapCenter,
        region: MapFeatureProperties | null,
        regionElementId: string | null,
        zoomToElement: ZoomToElement,
    ) => {
        setIsClosingPanel(false)
        if (region) setSelectedState(region)
        if (regionElementId) setSelectedRegionElementId(regionElementId)
        setSelectedCenterId(center.id)
        scheduleMapFocus(`center-${center.id}`, zoomToElement, 5)
    }

    const handleCenterCardSelect = (center: MapCenter, zoomToElement: ZoomToElement) => {
        setSelectedCenterId(center.id)
        scheduleMapFocus(`center-${center.id}`, zoomToElement, 5, 80)
    }

    const handleCenterKeyDown = (
        event: KeyboardEvent<HTMLElement>,
        center: MapCenter,
        zoomToElement: ZoomToElement,
    ) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleCenterCardSelect(center, zoomToElement)
        }
    }

    const closeStatePanel = (resetTransform: (animationTime?: number) => void) => {
        if (!selectedState) {
            setSelectedCenterId(null)
            setMaxMapZoom(20)
            resetTransform(450)
            return
        }

        if (animationTimerRef.current) clearTimeout(animationTimerRef.current)
        setIsClosingPanel(true)
        animationTimerRef.current = setTimeout(() => {
            setSelectedCenterId(null)
            setSelectedState(null)
            setSelectedRegionElementId(null)
            setIsClosingPanel(false)
            setMaxMapZoom(20)
            resetTransform(500)
            animationTimerRef.current = null
        }, 260)
    }

    const goBackToCenters = (zoomToElement: ZoomToElement) => {
        setSelectedCenterId(null)
        if (selectedRegionElementId) {
            scheduleMapFocus(selectedRegionElementId, zoomToElement, undefined, 80)
        }
    }

    const googleMapsUrl = selectedCenter
        ? `https://www.google.com/maps/search/?api=1&query=${selectedCenter.latitud},${selectedCenter.longitud}`
        : null
    const imageDirectory = selectedCenter ? getCenterImageDirectory(selectedCenter) : null
    const directoryReturnQuery = selectedCenter
        ? new URLSearchParams({ estado: selectedCenter.estado, nombre: selectedCenter.estado }).toString()
        : ''

    return (
        <main className="min-h-screen">
            <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 px-4 py-6 md:py-8">
                <div className="container mx-auto max-w-3xl text-center">
                    <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
                        <MapPin className="mr-1 h-3 w-3" />
                        Mapa interactivo
                    </Badge>
                    <h1 className="mb-3 text-3xl font-bold md:text-4xl">
                        Explora los <span className="text-rose-600">Centros de Atención</span>
                    </h1>
                    <p className="text-muted-foreground">
                        Selecciona un estado para ver sus sedes y abre cualquier centro para consultar sus detalles.
                    </p>
                    <div className="mt-4">
                        <span className="text-3xl font-bold text-rose-600">
                            {loadingCenters ? '…' : centers.length}
                        </span>
                        <p className="text-sm text-muted-foreground">Sedes georreferenciadas</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => void fetchCenters()}
                        disabled={loadingCenters || refreshingCenters}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4${refreshingCenters ? ' animate-spin' : ''}`} aria-hidden="true" />
                        {refreshingCenters ? 'Actualizando…' : 'Actualizar mapa'}
                    </Button>
                </div>
            </section>

            {(error || mapError) && (
                <section className="px-4 pt-5">
                    <Card className="mx-auto max-w-3xl border-rose-200 bg-rose-50 text-rose-700">
                        <CardContent className="p-4">
                            {error && <p>{error}</p>}
                            {mapError && <p>{mapError}</p>}
                        </CardContent>
                    </Card>
                </section>
            )}

            <section ref={mapSectionRef} className="w-full scroll-mt-20 px-2 py-4 sm:px-4 lg:px-6">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {selectedState
                                ? `Sedes en ${selectedState.mapName ?? selectedState.name}`
                                : 'Mapa de Venezuela'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {selectedState
                                ? `${filteredCenters.length} sede${filteredCenters.length === 1 ? '' : 's'} en esta región`
                                : 'Haz clic en un estado para acercarte y consultar sus centros.'}
                        </p>
                    </div>
                </div>

                <TransformWrapper
                    ref={transformRef}
                    initialScale={1}
                    minScale={1}
                    maxScale={maxMapZoom}
                    onTransform={(_, state) => {
                        if (!Number.isFinite(state.scale) || state.scale <= 0) return
                        setMapZoomScale((currentScale) =>
                            Math.abs(currentScale - state.scale) < 0.01 ? currentScale : state.scale,
                        )
                    }}
                >
                    {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
                        <>
                            <div
                                className={`map-explorer${selectedState ? ' has-panel' : ''}${selectedCenter ? ' showing-center' : ''}`}
                            >
                                <div
                                    ref={mapFrameRef}
                                    className="map-container relative overflow-hidden rounded-xl border shadow-lg"
                                >
                                    <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                                        <Button
                                            aria-label="Acercar mapa"
                                            onClick={() => zoomIn()}
                                            disabled={mapZoomScale >= maxMapZoom - 0.01}
                                        >
                                            +
                                        </Button>
                                        <Button aria-label="Alejar mapa" onClick={() => zoomOut()} disabled={mapZoomScale <= 1.01}>−</Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => closeStatePanel(resetTransform)}
                                        >
                                            Restablecer
                                        </Button>
                                    </div>
                                    <TransformComponent
                                        wrapperStyle={{ width: '100%', height: '100%' }}
                                        contentStyle={{ width: '100%', height: '100%' }}
                                    >
                                        <Map
                                            centers={mapCenters}
                                            selectedRegionKey={selectedRegionKey}
                                            selectedCenterId={selectedCenterId}
                                            zoomScale={mapZoomScale}
                                            onFeatureSelect={(feature, elementId) =>
                                                handleFeatureSelect(feature, elementId, zoomToElement)
                                            }
                                            onCenterSelect={(center, region, regionElementId) =>
                                                handleCenterSelect(center, region, regionElementId, zoomToElement)
                                            }
                                            onLoadError={setMapError}
                                        />
                                    </TransformComponent>
                                </div>

                                {selectedState && (
                                    <aside
                                        className={`map-side-panel${isClosingPanel ? ' is-closing' : ''}`}
                                        aria-label={selectedCenter ? 'Detalles de la sede' : 'Sedes del estado'}
                                        aria-live="polite"
                                        style={{
                                            '--map-frame-height': mapFrameHeight > 0 ? `${mapFrameHeight}px` : 'auto',
                                        } as CSSProperties}
                                    >
                                        <div className="map-panel-heading">
                                            {selectedCenter ? (
                                                <BackArrowButton
                                                    ariaLabel="Volver a las sedes del estado"
                                                    onClick={() => goBackToCenters(zoomToElement)}
                                                    className="h-10 w-28"
                                                />
                                            ) : (
                                                <span className="map-panel-heading-spacer" />
                                            )}
                                            <span className="min-w-0 flex-1 truncate font-semibold">
                                                {selectedCenter ? 'Información de la sede' : 'Centros en la región'}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Cerrar y mostrar todas las sedes"
                                                onClick={() => closeStatePanel(resetTransform)}
                                                disabled={isClosingPanel}
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        {selectedCenter && imageDirectory ? (
                                            <article key={selectedCenter.id} className="map-center-details">
                                                <div className="map-center-gallery">
                                                    <CenterImage
                                                        src={`${imageDirectory}/img1.jpg`}
                                                        alt={`${selectedCenter.nombre}, fotografía 1`}
                                                    />
                                                    <CenterImage
                                                        src={`${imageDirectory}/img2.jpg`}
                                                        alt={`${selectedCenter.nombre}, fotografía 2`}
                                                    />
                                                </div>
                                                <div className="map-detail-content">
                                                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                                                        <div>
                                                            <h3 className="text-xl font-bold">{selectedCenter.nombre}</h3>
                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {selectedCenter.organismo}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline">{selectedCenter.tipo_organismo}</Badge>
                                                    </div>

                                                    <section className="map-detail-section">
                                                        <h4>Ubicación completa</h4>
                                                        <p>{selectedCenter.direccion}</p>
                                                        <p>
                                                            {selectedCenter.parroquia === 'No indicada'
                                                                ? 'Parroquia no indicada'
                                                                : `Parroquia ${selectedCenter.parroquia}`}, municipio {selectedCenter.municipio},
                                                            {' '}{selectedCenter.estado}.
                                                        </p>
                                                        {selectedCenter.parroquia === 'No indicada' && (
                                                            <p className="map-coordinates">
                                                                Esta sede aún no tiene una parroquia vinculada en la base de datos.
                                                            </p>
                                                        )}
                                                    </section>

                                                    <section className="map-detail-section">
                                                        <h4>Defensoras asignadas ({selectedCenter.defensoras.length})</h4>
                                                        {selectedCenter.defensoras.length > 0 ? (
                                                            <div className="grid gap-2">
                                                                {selectedCenter.defensoras.map((defensora, index) => (
                                                                    <Button
                                                                        key={defensora.id}
                                                                        asChild
                                                                        variant="outline"
                                                                        className="map-defensora-button w-full justify-start"
                                                                    >
                                                                        <Link
                                                                            to={`/directorio/${defensora.id}${directoryReturnQuery ? `?${directoryReturnQuery}` : ''}`}
                                                                            onClick={() => window.scrollTo(0, 0)}
                                                                            aria-label={`Ver el perfil de la defensora ${index + 1} en el directorio`}
                                                                        >
                                                                            <House className="mr-2 h-4 w-4 text-rose-600" aria-hidden="true" />
                                                                            Defensora {index + 1}
                                                                        </Link>
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p>No hay defensoras asociadas a esta sede.</p>
                                                        )}
                                                    </section>

                                                    <section className="map-detail-section">
                                                        <h4>Acerca del centro</h4>
                                                        <p>
                                                            {selectedCenter.descripcion ||
                                                                'Centro de atención a mujeres. Para más información, contacta directamente con la institución.'}
                                                        </p>
                                                    </section>

                                                    {selectedCenter.calificacion !== null && (
                                                        <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                            Calificación {selectedCenter.calificacion.toFixed(1)} / 5
                                                        </p>
                                                    )}

                                                    {googleMapsUrl && (
                                                        <Button asChild className="w-full">
                                                            <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                                                                <MapPin className="mr-2 h-4 w-4" />
                                                                Ver en Google Maps
                                                                <ExternalLink className="ml-auto h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </article>
                                        ) : (
                                            <div className="map-center-list">
                                                {filteredCenters.length > 0 ? (
                                                    filteredCenters.map((center, index) => (
                                                        <Card
                                                            key={center.id}
                                                            tabIndex={0}
                                                            role="button"
                                                            aria-pressed={selectedCenterId === center.id}
                                                            className={`map-center-card ${selectedCenterId === center.id ? 'is-selected' : ''}`}
                                                            style={{ animationDelay: `${Math.min(index * 45, 270)}ms` }}
                                                            onClick={() => handleCenterCardSelect(center, zoomToElement)}
                                                            onKeyDown={(event) =>
                                                                handleCenterKeyDown(event, center, zoomToElement)
                                                            }
                                                        >
                                                            <CardHeader className="pb-2">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <CardTitle className="text-base">{center.nombre}</CardTitle>
                                                                    <Badge variant="outline">{center.tipo_organismo}</Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{center.organismo}</p>
                                                            </CardHeader>
                                                            <CardContent className="space-y-2 pb-4 text-sm">
                                                                <p className="font-medium">
                                                                    {center.parroquia}, {center.municipio}
                                                                </p>
                                                                <p className="line-clamp-2 text-muted-foreground">
                                                                    {center.direccion}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <Card className="map-empty-centers">
                                                        <CardContent className="p-6 text-center">
                                                            <Search className="mx-auto mb-3 h-7 w-7 text-rose-600" />
                                                            <h3 className="mb-2 font-semibold">
                                                                No hay sedes registradas en esta región
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Las sedes disponibles se muestran al elegir otro estado.
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>
                                        )}
                                    </aside>
                                )}
                            </div>

                            <div className="map-legend" aria-label="Leyenda de tipos de sede">
                                <span><House aria-hidden="true" className="map-legend-icon map-legend-icon--inamujer" />INAMUJER</span>
                                <span><House aria-hidden="true" className="map-legend-icon map-legend-icon--ministerio" />Ministerio</span>
                                <span><House aria-hidden="true" className="map-legend-icon map-legend-icon--otra" />Otras sedes</span>
                            </div>
                        </>
                    )}
                </TransformWrapper>
            </section>
        </main>
    )
}

export default MapaInteractivo
