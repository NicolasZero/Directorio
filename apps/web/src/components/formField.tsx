import { cn } from '@/lib/utils'

export default function FormField({ label, htmlFor, children, className }: { label: string; htmlFor?: string; children: React.ReactNode, className?: string }) {
    return (
        <fieldset className={cn('space-y-2', className)}>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
                {label}
            </label>
            {children}
        </fieldset>
    )
}