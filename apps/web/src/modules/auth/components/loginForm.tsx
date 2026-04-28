function login() {
  return (
    <>
      <label htmlFor="username">Usuario:</label>
      <input type="text" id="username" />
      <label htmlFor="password">Contraseña:</label>
      <input type="password" id="password" />
      <button type="submit">Iniciar sesión</button>
    </>
  )
}

export default login