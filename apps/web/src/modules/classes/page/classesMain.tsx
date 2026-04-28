import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router"

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
		<div className="container mx-auto p-4">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">Cursos en Línea</h1>
				<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
					Explora nuestra oferta de cursos diseñados para impulsar tu desarrollo profesional.
					Aprende a tu propio ritmo con contenido de calidad.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{defaultCourses.map((course) => (
					<Card key={course.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
						<div className="aspect-video relative overflow-hidden">
							<img
								src={course.image}
								alt={course.title}
								className="object-cover w-full h-full"
							/>
						</div>
						<CardHeader>
							<div className="flex items-center justify-between mb-2">
								<span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
									{course.level}
								</span>
								<span className="text-xs text-muted-foreground">
									{course.duration}
								</span>
							</div>
							<CardTitle className="line-clamp-2">{course.title}</CardTitle>
						</CardHeader>
						<CardContent className="grow">
							<CardDescription className="line-clamp-3">
								{course.description}
							</CardDescription>
							<p className="text-sm text-muted-foreground mt-4">
								<strong>Instructor:</strong> {course.instructor}
							</p>
						</CardContent>
						<CardFooter>
							<Button asChild className="w-full">
								<Link to={`/clases/curso/${course.id}`}>Ver Curso</Link>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	)
}

export default ClassesMain