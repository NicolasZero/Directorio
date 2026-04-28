import type { ReactNode, FC } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    children: ReactNode
    selectedState: string | undefined
    handleSelectState: (value: string) => void
    selectedMunicipality: string | undefined
    handleSelectMunicipality: (value: string) => void
}

const states = {
    Caracas: [
        "Libertador"
    ],
    Miranda: [
        "Cristobal Rojas",
        "Chacao"
    ]
}

export const DirectoryLayout: FC<Props> = ({ children, selectedState, handleSelectState, selectedMunicipality, handleSelectMunicipality }) => {
    return (
        <>
            <h1 className="text-2xl font-bold text-center my-2">Directorio de Inamujer</h1>
            <div className="flex flex-wrap justify-center gap-2 my-2">

                <Select value={selectedState} onValueChange={handleSelectState}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Seleccione un Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Estados</SelectLabel>
                            <SelectItem value="Caracas">Caracas</SelectItem>
                            <SelectItem value="Miranda">Miranda</SelectItem>
                            <SelectItem value="Aragua">Aragua</SelectItem>
                            <SelectItem value="Bolívar">Bolívar</SelectItem>
                            <SelectItem value="Trujillo">Trujillo</SelectItem>
                            <SelectItem value="Zulia">Zulia</SelectItem>
                            <SelectItem value="Falcón">Falcón</SelectItem>
                            <SelectItem value="Mérida">Mérida</SelectItem>
                            <SelectItem value="Apure">Apure</SelectItem>
                            <SelectItem value="Táchira">Táchira</SelectItem>
                            <SelectItem value="Anzoátegui">Anzoátegui</SelectItem>
                            <SelectItem value="Barinas">Barinas</SelectItem>
                            <SelectItem value="Cojedes">Cojedes</SelectItem>
                            <SelectItem value="Delta Amacuro">Delta Amacuro</SelectItem>
                            <SelectItem value="Guárico">Guárico</SelectItem>
                            <SelectItem value="Lara">Lara</SelectItem>
                            <SelectItem value="Monagas">Monagas</SelectItem>
                            <SelectItem value="Portuguesa">Portuguesa</SelectItem>
                            <SelectItem value="Sucre">Sucre</SelectItem>
                            <SelectItem value="Yaracuy">Yaracuy</SelectItem>
                            <SelectItem value="Amazonas">Amazonas</SelectItem>
                            <SelectItem value="Nueva Esparta">Nueva Esparta</SelectItem>
                            <SelectItem value="Dependencias Federales">Dependencias Federales</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={selectedMunicipality} onValueChange={handleSelectMunicipality} disabled={!selectedState}>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Seleccione un municipio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Municipios</SelectLabel>
                            {
                                selectedState && states[selectedState] &&
                                states[selectedState].map((municipality: string) => (
                                    <SelectItem key={municipality} value={municipality}>
                                        {municipality}
                                    </SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {children}
        </>
    )
}