import { NavLink } from "react-router";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
    return (
        <nav className="bg-linear-to-r from-inm-primary to-inm-secondary text-white px-2 py-1">
            <ul className="flex flex-wrap px-3">
                <li className="hover:bg-black/50 transition-colors duration-200 px-3 py-2">
                    <NavLink to="/">
                        Inicio
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200 px-3 py-2">
                    <NavLink to="/directorio">
                        Directorio
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200 px-3 py-2">
                    <NavLink to="/mapa">
                        Mapa
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200 px-3 py-2">
                    <NavLink to="/clases">
                        Aprendizaje
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200 px-3 py-2">
                    <NavLink to="/conocenos">
                        Conócenos
                    </NavLink>
                </li>

                <li className="ml-auto my-auto">
                    <ModeToggle />
                </li>

            </ul>
        </nav>
    )
}

export default Navbar