import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import BackArrowButton from '@/components/backArrowButton'
import { MapPin, Search } from 'lucide-react'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import DirectoryCard from '../components/directoryCard'
import StateDirectoryGrid from '../components/stateDirectoryGrid'
import { type DirectoryEntry } from '../schemes/directory'

function Directory() {
	const [directories, setDirectories] = useState<DirectoryEntry[]>([])
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchParams, setSearchParams] = useSearchParams()
	const selectedState = searchParams.get('estado') ?? ''
	const selectedStateName = searchParams.get('nombre') || selectedState
	const [municipalityFilter, setMunicipalityFilter] = useState<{ estado: string; municipio: string } | null>(null)
	const selectedMunicipality = municipalityFilter?.estado === selectedState ? municipalityFilter.municipio : ''
	const [directoryMunicipalities, setDirectoryMunicipalities] = useState<{ estado: string; municipios: string[] } | null>(null)
	const [loadingMunicipalities, setLoadingMunicipalities] = useState(Boolean(selectedState))
	const [municipalityError, setMunicipalityError] = useState<string | null>(null)
	const directoryReturnQuery = selectedState
		? new URLSearchParams({ estado: selectedState, nombre: selectedStateName }).toString()
		: ''
	const municipalitiesForState = directoryMunicipalities?.estado === selectedState
		? directoryMunicipalities.municipios
		: []
	const municipalityOptionsLoading = Boolean(selectedState) &&
		(loadingMunicipalities || directoryMunicipalities?.estado !== selectedState)
	const [count, setCount] = useState<{ total_defensoras: number; total_centros: number; total_estados: number; total_municipios: number; estado: string | null } | null>(null)
	const currentCount = count?.estado === (selectedState || null) ? count : null
	const observer = useRef<IntersectionObserver | null>(null)

	const handleSelectMunicipality = (value: string) => {
		setPage(1)
		setHasMore(true)
		setMunicipalityFilter({ estado: selectedState, municipio: value })
	}

	const handleFetchAllDirectories = () => {
		setPage(1)
		setHasMore(true)
		setSearchParams({})
		setMunicipalityFilter(null)
	}

	const handleClearMunicipality = () => {
		setPage(1)
		setHasMore(true)
		setMunicipalityFilter(null)
	}

	useEffect(() => {
		const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
		window.scrollTo({ top: 0, behavior })
	}, [selectedState])

	useEffect(() => {
		const controller = new AbortController()
		const fetchCount = async () => {
			try {
				const query = new URLSearchParams()
				if (selectedState) query.set('estado', selectedState)
				const response = await fetch(`/api/directory/count?${query}`, { signal: controller.signal })
				const data = await response.json()

				if (!response.ok) throw new Error(data?.error || 'Error al cargar las estadísticas')
				setCount({ ...data.data, estado: selectedState || null })
			} catch (fetchError) {
				if (controller.signal.aborted) return
				console.error(fetchError)
			}
		}

		void fetchCount()
		return () => controller.abort()
	}, [selectedState])

	useEffect(() => {
		if (!selectedState) return

		const controller = new AbortController()
		const fetchMunicipalities = async () => {
			setLoadingMunicipalities(true)
			setMunicipalityError(null)

			try {
				const query = new URLSearchParams({ estado: selectedState })
				const response = await fetch(`/api/directory/municipalities?${query}`, {
					signal: controller.signal,
					cache: 'no-store',
				})
				const payload = await response.json() as { data?: unknown; error?: string }

				if (!response.ok) {
					throw new Error(payload.error || 'No se pudieron cargar los municipios.')
				}
				if (
					!Array.isArray(payload.data) ||
					!payload.data.every((municipality): municipality is string => typeof municipality === 'string')
				) {
					throw new Error('La respuesta de municipios tiene un formato inválido.')
				}

				setDirectoryMunicipalities({ estado: selectedState, municipios: payload.data })
			} catch (fetchError) {
				if (controller.signal.aborted) return
				console.error(fetchError)
				setMunicipalityError('No se pudieron cargar los municipios con centros. Intenta nuevamente.')
			} finally {
				if (!controller.signal.aborted) setLoadingMunicipalities(false)
			}
		}

		void fetchMunicipalities()
		return () => controller.abort()
	}, [selectedState])

	const fetchDirectories = useCallback(async (pageNumber: number, resetList = false) => {
		if (pageNumber === 1) {
			setLoading(true)
		} else {
			setLoadingMore(true)
		}
		setError(null)

		try {
			const queryParams = new URLSearchParams()
			queryParams.append('estado', selectedState)
			if (selectedMunicipality) queryParams.append('municipio', selectedMunicipality)
			queryParams.append('page', pageNumber.toString())
			queryParams.append('limit', '9')

			const response = await fetch(`/api/directory?${queryParams.toString()}`)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data?.error || 'Error al cargar directorios')
			}

			const newDirectories = data?.data || []
			setHasMore(newDirectories.length === 9)
			setDirectories((previous) => {
				if (resetList) return newDirectories
				const existingIds = new Set(previous.map((directory) => directory.id))
				return [...previous, ...newDirectories.filter((directory: DirectoryEntry) => !existingIds.has(directory.id))]
			})
		} catch (fetchError) {
			console.error(fetchError)
			setError('No se pudieron cargar los directorios. Intenta de nuevo más tarde.')
		} finally {
			setLoading(false)
			setLoadingMore(false)
		}
	}, [selectedState, selectedMunicipality])

	useEffect(() => {
		if (!selectedState) {
			return
		}

		// The async request resolves after the effect and updates the fetched results.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchDirectories(page, page === 1)
	}, [page, fetchDirectories, selectedState])

	const lastElementRef = useCallback((node: HTMLDivElement | null) => {
		if (loading || loadingMore) return
		if (observer.current) observer.current.disconnect()

		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				setPage((previousPage) => previousPage + 1)
			}
		})

		if (node) observer.current.observe(node)
	}, [loading, loadingMore, hasMore])

	const statistics = selectedState
		? [
			{ label: 'Defensoras', value: currentCount?.total_defensoras ?? '—' },
			{ label: 'Centros', value: currentCount?.total_centros ?? '—' },
			{ label: 'Municipios', value: currentCount?.total_municipios ?? '—' },
		]
		: [
			{ label: 'Centros', value: currentCount?.total_centros ?? '—' },
			{ label: 'Estados', value: currentCount?.total_estados ?? '—' },
			{ label: 'Municipios', value: currentCount?.total_municipios ?? '—' },
			{ label: 'Defensoras', value: currentCount?.total_defensoras ?? '—' },
		]

	return (
		<div className="min-h-screen">
			<section className={`relative bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 px-4 ${selectedState ? 'pb-8 pt-16 md:py-12' : 'py-8 md:py-12'}`}>
				{selectedState && (
					<BackArrowButton
						onClick={handleFetchAllDirectories}
						ariaLabel="Volver a estados"
						className="absolute left-4 top-2 md:left-8 md:top-4"
					/>
				)}
				<div className="container mx-auto max-w-3xl text-center">
					<Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
						<Search className="mr-1 h-3 w-3" />
						Directorio
					</Badge>
					<h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
						Encuentra <span className="text-rose-600">Centros de Atención</span>
					</h1>
					<p className="mb-6 text-lg text-muted-foreground">
						Explora los centros de atención disponibles en todo el país.
					</p>

					<div
						key={`${selectedState || 'nacional'}:${Boolean(currentCount)}`}
						className={`grid justify-center${selectedState ? ' grid-cols-3 gap-4 md:gap-12' : ' grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 md:gap-8'}${currentCount ? ' directory-statistics-enter' : ''}`}
					>
						{statistics.map(({ label, value }) => (
							<div key={label} className="text-center">
								<p className="text-3xl font-bold text-rose-600">{value}</p>
								<h2 className="text-sm text-muted-foreground">{label}</h2>
							</div>
						))}
					</div>
				</div>
			</section>

			{selectedState ? (
				<>
					<section className="border-y border-[#c2addc]/30 bg-gradient-to-r from-[#f5f0fa] via-background to-[#eee5f7] px-4 py-5 dark:from-[#241d32] dark:via-background dark:to-[#302341] md:px-8">
						<div className="container mx-auto max-w-5xl">
							<div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-end">
								<div className="w-full sm:max-w-64">
									<p className="mb-2 text-sm font-medium text-muted-foreground">Estado</p>
									<div className="flex min-h-11 items-center gap-2 rounded-xl border border-[#c2addc]/50 bg-background/80 px-3.5 shadow-sm">
										<MapPin className="h-4 w-4 shrink-0 text-[#8969b3]" aria-hidden="true" />
										<span className="truncate font-semibold">{selectedStateName}</span>
									</div>
								</div>

								<div className="w-full sm:max-w-64">
									<label htmlFor="municipality-filter" className="mb-2 block text-sm font-medium text-muted-foreground">
										Filtrar por municipio
									</label>
									<Select
										value={selectedMunicipality}
										onValueChange={handleSelectMunicipality}
										disabled={municipalityOptionsLoading || municipalitiesForState.length === 0}
									>
										<SelectTrigger
											id="municipality-filter"
											className="h-11 w-full rounded-xl border-[#c2addc]/50 bg-background/80 shadow-sm transition-all hover:border-[#8969b3]/60 hover:shadow-md focus-visible:border-[#8969b3] focus-visible:ring-[#8969b3]/30"
										>
											<span className="flex min-w-0 items-center gap-2">
												<MapPin className="h-4 w-4 shrink-0 text-[#8969b3]" aria-hidden="true" />
												<SelectValue
													placeholder={
														municipalityOptionsLoading
															? 'Buscando municipios con centros...'
															: municipalityError
																? 'No se pudieron cargar municipios'
																: municipalitiesForState.length > 0
																	? 'Todos los municipios'
																	: 'No hay centros registrados'
													}
												/>
											</span>
										</SelectTrigger>
										<SelectContent
											className="municipality-select-content"
											style={{
												'--municipality-exit-duration': `${Math.max(170, municipalitiesForState.length * 22 + 140)}ms`,
											} as CSSProperties}
										>
											<SelectGroup>
												<SelectLabel>Municipios de {selectedStateName}</SelectLabel>
												{municipalitiesForState.map((municipality, index, municipalities) => (
													<SelectItem
														key={municipality}
														value={municipality}
														className="municipality-select-item"
														style={{
															'--municipality-enter-delay': `${index * 28}ms`,
															'--municipality-exit-delay': `${(municipalities.length - index - 1) * 20}ms`,
														} as CSSProperties}
													>
														{municipality}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
									{municipalityError && (
										<p className="mt-2 text-sm text-destructive" role="alert">
											{municipalityError}
										</p>
									)}
								</div>
							</div>
						</div>
					</section>

					<section className="p-4 md:px-8">
						<header className="mb-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
							<div>
								<h2 className="text-2xl font-bold">
									Directorios en {selectedStateName}{selectedMunicipality ? ` - ${selectedMunicipality}` : ''}
								</h2>
								<p className="mt-1 text-muted-foreground">
									{directories.length} resultado{directories.length !== 1 ? 's' : ''} cargado{directories.length !== 1 ? 's' : ''}
								</p>
							</div>
							{selectedMunicipality && (
								<Button variant="outline" size="sm" onClick={handleClearMunicipality}>
									Ver todos los municipios
								</Button>
							)}
						</header>

						{loading ? (
							<p className="py-10 text-center text-lg font-medium">Cargando directorios...</p>
						) : error ? (
							<Card className="mx-auto mb-6 w-fit">
								<CardContent className="p-6 text-center">
									<p className="font-medium text-foreground">{error}</p>
								</CardContent>
							</Card>
						) : directories.length > 0 ? (
							<>
								<main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									{directories.map((directory, index) => (
										<DirectoryCard
											key={directory.id}
											directorio={directory}
											animationIndex={index}
											returnQuery={directoryReturnQuery}
										/>
									))}
								</main>
								<div ref={lastElementRef} className="mt-6 flex h-10 w-full items-center justify-center">
									{loadingMore && <p className="animate-pulse text-sm text-muted-foreground">Cargando más centros...</p>}
								</div>
							</>
						) : (
							<Card className="mx-auto max-w-md">
								<CardContent className="p-8 text-center">
									<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
										<Search className="h-8 w-8 text-rose-600 dark:text-rose-100" />
									</div>
									<h3 className="mb-2 text-lg font-semibold">No se encontraron directorios</h3>
									<p className="mb-4 text-muted-foreground">
										Intenta seleccionar otro municipio o volver a la lista de estados.
									</p>
								</CardContent>
							</Card>
						)}
					</section>
				</>
			) : (
				<StateDirectoryGrid />
			)}
		</div>
	)
}

export default Directory
