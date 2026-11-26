import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Building2, ArrowRight } from "lucide-react"
import { Link } from 'react-router'
import type { DirectoryEntry } from '../schemes/directory'


function DirectoryCard({ directorio }: { directorio: DirectoryEntry }) {
	return (
		<Card
			className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
		>
			<CardHeader className="pb-3">
				<div className="flex items-start gap-4">
					{directorio.foto ? (
						<img
							src={directorio.foto}
							alt={directorio.nombre}
							className="w-16 h-16 rounded-xl object-cover border-2 border-violet-100"
						/>
					) : (
						<div className="w-16 h-16 rounded-xl bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
							<Building2 className="w-8 h-8 text-violet-600 dark:text-violet-100" />
						</div>
					)}
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg leading-tight mb-2">
							{directorio.nombre}
						</CardTitle>
						<div className="flex items-center gap-2 flex-wrap">
							<Badge variant="outline" className="bg-violet-50 text-violet-700 dark:bg-violet-900 dark:text-violet-100 text-xs">
								{directorio.estado}
							</Badge>
							<span className="text-xs text-muted-foreground">
								{directorio.municipio}
							</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					<div className="flex items-start gap-2 text-sm">
						<MapPin className="w-4 h-4 mt-0.5 text-violet-500 shrink-0" />
						<span className="text-muted-foreground">
							{directorio.direccion}
						</span>
					</div>
					<div className="flex items-center text-violet-500 gap-2 text-sm">
						<Phone className="w-4 h-4 shrink-0" />
						<a
							href={`tel:${directorio.telefono}`}
							className="font-medium"
						>
							{directorio.telefono}
						</a>
					</div>
				</div>
				<div className="mt-4 pt-3 border-t">
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-between text-violet-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
						asChild
					>
						<Link to={`/directorio/${directorio.id}`}>
							Ver detalles
							<ArrowRight className="w-4 h-4" />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default DirectoryCard