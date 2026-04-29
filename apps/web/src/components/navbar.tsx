import { NavLink } from "react-router";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
    return (
        <nav className="bg-linear-to-r from-rose-800 dark:from-rose-950 dark:to-rose-600 to-rose-400 text-white px-2 py-1">
            <ul className="flex flex-wrap px-3">
                <li className="hover:bg-black/50 transition-colors duration-200">
                    <NavLink className="px-3 py-2 block" to="/">
                        Inicio
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200">
                    <NavLink className="px-3 py-2 block" to="/directorio">
                        Directorio
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200">
                    <NavLink className="px-3 py-2 block" to="/mapa">
                        Mapa
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200">
                    <NavLink className="px-3 py-2 block" to="/clases">
                        Aprendizaje
                    </NavLink>
                </li>
                <li className="hover:bg-black/50 transition-colors duration-200">
                    <NavLink className="px-3 py-2 block" to="/conocenos">
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