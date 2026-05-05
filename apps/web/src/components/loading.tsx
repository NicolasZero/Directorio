import { Loader2 } from "lucide-react"

function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-100 dark:from-rose-950/50 via-white dark:via-black to-rose-100/50 dark:to-rose-950/50 px-4">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-rose-600">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-lg font-medium">Un momento, preparando el sitio...</span>
                </div>

                <div className="rounded-3xl bg-rose-100 dark:bg-background px-4 py-3 text-sm font-medium text-rose-700">
                    Cargando módulos y recursos
                </div>
            </div>

        </div>
    )
}

export default Loading
