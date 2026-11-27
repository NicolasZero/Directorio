import { cn } from '@/lib/utils'

export default function FormField({ label, htmlFor, children, className, description }: { label: string; htmlFor?: string; children: React.ReactNode, className?: string, description?: string }) {
    return (
        <fieldset className={cn('space-y-2', className)}>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
                {label}
            </label>
            {children}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </fieldset>
    )
}