function login() {
  // const handleClick = async () => {
	// 	console.log('Click')
	// 	const response = await fetch('/api')
	// 	const data = await response.json()
	// 	console.log(data)
	// }
  return (
    <>
      <label htmlFor="username">Usuario:</label>
      <input type="text" id="username" />
      <label htmlFor="password">Contraseña:</label>
      <input type="password" id="password" />
      <button type="submit">Iniciar sesión</button>
			{/* <Button className="bg-inm-primary hover:bg-inm-secondary" variant="default" onClick={handleClick}>Click</Button> */}

    </>
  )
}

export default login