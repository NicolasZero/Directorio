import { Button } from "@/components/ui/button"

function Home() {

	const handleClick = async () => {
		console.log('Click')
		const response = await fetch('/api')
		const data = await response.json()
		console.log(data)
	}
	return (
		<>
			<h1>Home</h1>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi suscipit error fuga ipsa iure, doloremque aperiam corporis natus. Veniam explicabo, unde nobis fuga eveniet soluta consequuntur iusto doloremque eos officia!</p>
			<Button className="bg-inm-primary hover:bg-inm-secondary" variant="default" onClick={handleClick}>Click</Button>
		</>
	)
}

export default Home