import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LocateFixed, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import './locationPicker.css'
import L from 'leaflet'

// Icono propio dibujado con CSS (evita los assets PNG de Leaflet,
// que fallan al empaquetarse con Vite)
const pinIcon = L.divIcon({
    className: 'location-picker-pin',
    html: '<span class="location-picker-pin-dot"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
})

interface LocationPickerProps {
    latitud: string
    longitud: string
    onPick: (lat: number, lng: number) => void
}

const VENEZUELA_CENTER: [number, number] = [8.0, -66.0]
const DEFAULT_ZOOM = 6

export default function LocationPicker({ latitud, longitud, onPick }: LocationPickerProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<L.Map | null>(null)
    const markerRef = useRef<L.Marker | null>(null)
    const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null)

    // Crear el mapa una sola vez
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return

        const hasCoords = Number.isFinite(Number(latitud)) && Number.isFinite(Number(longitud)) &&
            latitud.trim() !== '' && longitud.trim() !== ''

        const startCenter: [number, number] = hasCoords
            ? [Number(latitud), Number(longitud)]
            : VENEZUELA_CENTER

        const map = L.map(containerRef.current, {
            center: startCenter,
            zoom: hasCoords ? 16 : DEFAULT_ZOOM,
        })
        // Garantiza el centro cuando el contenedor cambió de tamaño después
        // de crear el mapa (bug conocido de Leaflet con layouts dinámicos).
        map.setView(startCenter, hasCoords ? 16 : DEFAULT_ZOOM)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map)

        // Marcador arrastrable: clic en el mapa lo reubica
        const marker = L.marker(
            hasCoords ? [Number(latitud), Number(longitud)] : VENEZUELA_CENTER,
            { draggable: true, icon: pinIcon },
        ).addTo(map)
        marker.on('dragend', () => {
            const position = marker.getLatLng()
            setPending({ lat: position.lat, lng: position.lng })
        })
        map.on('click', (event: L.LeafletMouseEvent) => {
            marker.setLatLng(event.latlng)
            setPending({ lat: event.latlng.lat, lng: event.latlng.lng })
        })

        mapRef.current = map
        markerRef.current = marker

        // El contenedor puede cambiar de tamaño al montarse en el layout;
        // Leaflet calcula mal el centro si el div estaba en 0 al iniciar.
        setTimeout(() => map.invalidateSize(), 150)
        setTimeout(() => map.invalidateSize(), 600)

        return () => {
            map.remove()
            mapRef.current = null
            markerRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Si cambian las coordenadas manualmente (o se guardan), mover el marcador
    useEffect(() => {
        const map = mapRef.current
        const marker = markerRef.current
        if (!map || !marker) return

        if (latitud.trim() === '' || longitud.trim() === '') return

        const lat = Number(latitud)
        const lng = Number(longitud)
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            marker.setLatLng([lat, lng])
            map.setView([lat, lng], Math.max(map.getZoom(), 16))
        }
    }, [latitud, longitud])

    const aplicarCoordenadas = useCallback(() => {
        if (!pending) return
        onPick(Number(pending.lat.toFixed(6)), Number(pending.lng.toFixed(6)))
        setPending(null)
    }, [pending, onPick])

    return (
        <div className="overflow-hidden rounded-2xl border bg-background">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/60 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-rose-600" />
                    Ubicar centro en el mapa
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs ${pending ? 'font-medium text-rose-700 dark:text-rose-300' : 'text-muted-foreground'}`}
                        role="status"
                        aria-live="polite"
                    >
                        {pending
                            ? `Marcador en ${pending.lat.toFixed(5)}, ${pending.lng.toFixed(5)}`
                            : 'Haz clic en el mapa para colocar el marcador'}
                    </span>
                    <Button
                        type="button"
                        size="sm"
                        onClick={aplicarCoordenadas}
                        disabled={!pending}
                    >
                        <LocateFixed className="mr-1 h-4 w-4" />
                        Colocar coordenadas
                    </Button>
                </div>
            </div>
            <div ref={containerRef} className="h-80 w-full" aria-label="Mapa para ubicar el centro" />
            <p className="px-4 py-3 text-xs text-muted-foreground">
                Haz clic en el mapa o arrastra el marcador a la ubicación exacta del centro y presiona
                «Colocar coordenadas» para llenar latitud y longitud.
            </p>
        </div>
    )
}
