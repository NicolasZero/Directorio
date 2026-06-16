import { Heart, Shield, Scale, Hammer, Handshake, Handbag, User, FileText } from "lucide-react"

export default function getIconComponent(icono: string): React.ReactNode {
    if (!icono) return null
    if (icono === 'Heart') return <Heart size={20} />
    if (icono === 'Shield') return <Shield size={20} />
    if (icono === 'Scale') return <Scale size={20} />
    if (icono === 'Hammer') return <Hammer size={20} />
    if (icono === 'Handshake') return <Handshake size={20} />
    if (icono === 'Handbag') return <Handbag size={20} />
    if (icono === 'User') return <User size={20} />
    return <FileText size={20} />
}