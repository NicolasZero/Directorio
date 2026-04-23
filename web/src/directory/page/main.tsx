import Clickme from '../components/hola.tsx'
import {DirectoryLayout} from '../layaout.tsx'

function Directory() {
	return (
		<>
			<DirectoryLayout>
				<h1>Directory</h1>
				<Clickme />
			</DirectoryLayout>
		</>
	)
}

export default Directory