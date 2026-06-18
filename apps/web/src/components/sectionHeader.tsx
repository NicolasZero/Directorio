import { cn } from '@/lib/utils'

export default function SectionHeader({ icon: Icon, title, description, className }: { icon: React.ElementType; title: string; description?: string, className?: string }) {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-rose-600 dark:text-rose-100" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
        </div>
    )
}