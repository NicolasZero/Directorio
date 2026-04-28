import { useState } from 'react'
import { DirectoryLayout } from '../directoryLayout.tsx'

function Directory() {
	const [selectedState, setSelectedState] = useState<string>('')

	const handleSelectState = (value: string) => {
		setSelectedState(value)
		setSelectedMunicipality("")
	}

	const [selectedMunicipality, setSelectedMunicipality] = useState<string>('')

	const handleSelectMunicipality = (value: string) => {
		setSelectedMunicipality(value)
	}

	return (
		<>
			<DirectoryLayout selectedState={selectedState} handleSelectState={handleSelectState} selectedMunicipality={selectedMunicipality} handleSelectMunicipality={handleSelectMunicipality}>
				<div className='text-center'>

					{selectedState ? (
						<>
							<p>Estado seleccionado: {selectedState}</p>
							{selectedMunicipality && (
								<p>Municipio seleccionado: {selectedMunicipality}</p>
							)}
						</>

					) : (
						<p className='text-lg'>Selecciona un estado para ver información</p>
					)}
				</div>
			</DirectoryLayout>
		</>
	)
}

export default Directory