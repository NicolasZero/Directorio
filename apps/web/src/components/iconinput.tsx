import { Input } from '@/components/ui/input'

export default function IconInput({ icon: Icon, ...props }: React.ComponentProps<typeof Input> & { icon: React.ElementType }) {
    return (
        <div className="relative">
            <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
            <Input {...props} className="w-full rounded-3xl pl-11 pr-4" />
        </div>
    )
}