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
			<button className="bg-primary text-white px-3 py-1 rounded hover:bg-secondary" onClick={handleClick}>Click</button>
		</>
	)
}

export default Home