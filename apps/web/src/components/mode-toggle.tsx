import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <Button className="bg-rose-700 hover:bg-rose-900 dark:bg-rose-300 dark:text-rose-800 dark:hover:bg-rose-100" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Cambiar tema</span>
        </Button>
    )
}