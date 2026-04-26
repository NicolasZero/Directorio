import { NavLink } from "react-router";

const Navbar = () => {
    return (
        <nav className="bg-linear-to-r from-primary to-secondary text-white p-2">
            {/* <div className="container mx-auto"> */}
                <ul className="flex flex-wrap gap-4">
                    <li>
                        <NavLink to="/" className="hover:underline">
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/directorio" className="hover:underline">
                            Directorio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className="hover:underline">
                            Mapa
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/clases" className="hover:underline">
                            Aprendisaje
                        </NavLink>
                    </li>
                    
                    <li>
                        <NavLink to="/about" className="hover:underline">
                            Conocenos
                        </NavLink>
                    </li>
                    <span className="">
                        [Cambiar tema]
                    </span>
                </ul>
            {/* </div> */}
        </nav>
    )
}

export default Navbar