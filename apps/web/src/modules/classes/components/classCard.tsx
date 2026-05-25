import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { ArrowRight } from "lucide-react";

type CourseEntry = {
    id: number
    title: string
    description: string
    instructor: string
    duration: string
    level: string
    image: string
}

export default function ClassCard({ course, status }: { course: CourseEntry, status: string }) {
    return (
        <Card
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
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 dark:bg-rose-900 dark:text-rose-100 border-rose-200 dark:border-0">
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
            <div className="p-4 pt-0 space-y-3">
                <Button
                    asChild
                    className="w-full bg-rose-600 hover:bg-rose-700! dark:bg-rose-900 dark:hover:bg-rose-800 dark:text-rose-100"
                >
                    <Link to={`/clases/curso/${course.id}`}>
                        Ver Curso
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
                {status === 'authenticated' && (
                    <Button
                        asChild
                        variant="outline"
                        className="w-full"
                    >
                        <Link to="/admin/clases">Editar Curso</Link>
                    </Button>
                )}
            </div>
        </Card>
    )
}