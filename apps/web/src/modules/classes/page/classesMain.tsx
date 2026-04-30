import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router"
import { Clock, User, BookOpen, ArrowRight, GraduationCap } from "lucide-react"

// Cursos por defecto (en el futuro vendrán de la base de datos)
const defaultCourses = [
	{
		id: 1,
		title: "Introducción a la Programación",
		description: "Aprende los fundamentos de la programación con Python. Ideal para principiantes que desean iniciar en el mundo del desarrollo de software.",
		instructor: "María García",
		duration: "40 horas",
		level: "Principiante",
		image: "/default.png"
	},
	{
		id: 2,
		title: "Desarrollo Web con React",
		description: "Domina React desde cero. Aprende a crear interfaces de usuario dinámicas y componentes reutilizables.",
		instructor: "Carlos López",
		duration: "60 horas",
		level: "Intermedio",
		image: "/default.png"
	},
	{
		id: 3,
		title: "Bases de Datos y SQL",
		description: "Aprende a diseñar y gestionar bases de datos relacionales. Domina SQL para consultas eficientes.",
		instructor: "Ana Martínez",
		duration: "35 horas",
		level: "Principiante",
		image: "/default.png"
	},
	{
		id: 4,
		title: "UX/UI Design Fundamentals",
		description: "Descubre los principios del diseño de experiencias de usuario. Crea interfaces intuitivas y atractivas.",
		instructor: "Sofia Rodríguez",
		duration: "45 horas",
		level: "Principiante",
		image: "/default.png"
	},
	{
		id: 5,
		title: "Cloud Computing con AWS",
		description: "Introducción a la computación en la nube. Aprende a desplegar y gestionar aplicaciones en AWS.",
		instructor: "Pedro Sánchez",
		duration: "50 horas",
		level: "Intermedio",
		image: "/default.png"
	},
	{
		id: 6,
		title: "Metodologías Ágiles",
		description: "Aprende Scrum y Kanban. Implementa metodologías ágiles en tus proyectos de desarrollo.",
		instructor: "Laura Fernández",
		duration: "25 horas",
		level: "Principiante",
		image: "/default.png"
	}
]

function ClassesMain() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-10 px-4">

				<div className="container mx-auto text-center max-w-2xl">
					<Badge variant="secondary" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
						<GraduationCap className="w-3 h-3 mr-1" />
						Educación
					</Badge>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
						Cursos <span className="text-rose-600">en Línea</span>
					</h1>
					<p className="text-lg text-muted-foreground mb-6">
						Explora nuestra oferta de cursos diseñados para impulsar tu desarrollo profesional.
						Aprende a tu propio ritmo con contenido de calidad.
					</p>

					{/* Stats */}
					<div className="flex justify-center gap-8 md:gap-12">
						<div className="text-center">
							<div className="text-3xl font-bold text-rose-600">{defaultCourses.length}</div>
							<div className="text-sm text-muted-foreground">Cursos</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-rose-600">
								{defaultCourses.reduce((acc, c) => acc + parseInt(c.duration), 0)}
							</div>
							<div className="text-sm text-muted-foreground">Horas Totales</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-rose-600">
								{new Set(defaultCourses.map(c => c.level)).size}
							</div>
							<div className="text-sm text-muted-foreground">Niveles</div>
						</div>
					</div>
				</div>

			</section>

			{/* Cursos Grid */}
			<section className="py-12 px-4">
				<div className="container mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{defaultCourses.map((course) => (
							<Card
								key={course.id}
								className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
							>
								<div className="aspect-video relative overflow-hidden">
									<img
										src={course.image}
										alt={course.title}
										className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between mb-2">
										<Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
											{course.level}
										</Badge>
										<span className="text-xs text-muted-foreground flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{course.duration}
										</span>
									</div>
									<CardTitle className="line-clamp-2 text-lg">
										{course.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="grow">
									<CardDescription className="line-clamp-3 text-base">
										{course.description}
									</CardDescription>
									<div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
										<User className="w-4 h-4 text-rose-500" />
										<span>{course.instructor}</span>
									</div>
								</CardContent>
								<div className="p-4 pt-0">
									<Button
										asChild
										className="w-full bg-rose-600 hover:bg-rose-700"
									>
										<Link to={`/clases/curso/${course.id}`}>
											Ver Curso
											<ArrowRight className="w-4 h-4 ml-2" />
										</Link>
									</Button>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-12 px-4 bg-muted/30">
				<div className="container mx-auto">
					<Card className="bg-rose-600 text-white">
						<CardContent className="p-8 md:p-12 text-center">
							<BookOpen className="w-12 h-12 mx-auto mb-4 opacity-80" />
							<h2 className="text-2xl font-bold mb-3">¿No encuentras lo que buscas?</h2>
							<p className="text-rose-100 max-w-xl mx-auto mb-6">
								Estamos constantemente agregando nuevos cursos. Contáctanos para sugerencias。
							</p>
							<Button variant="secondary" size="lg">
								Contactar Soporte
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	)
}

export default ClassesMain