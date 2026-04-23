import Clickme from '../components/hola.tsx'
import {DirectoryLayout} from '../layaout.tsx'

function Directory() {
	return (
		<>
			<DirectoryLayout>
				<form action="">
					<h1>Directory</h1>
					<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat repudiandae blanditiis corporis, ipsam tempora minima sunt recusandae, iste reiciendis libero earum velit mollitia, tempore dignissimos. Libero, laudantium? Minima, aut debitis!</p>
					<Clickme />
				</form>
			</DirectoryLayout>
		</>
	)
}

export default Directory