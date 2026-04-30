import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "Inicio", path: "/" },
        { name: "Directorio", path: "/directorio" },
        { name: "Mapa", path: "/mapa" },
        { name: "Aprendizaje", path: "/clases" },
        { name: "Conócenos", path: "/conocenos" },
    ];

    return (
        <nav className="bg-linear-to-r from-rose-800 dark:from-rose-950 dark:to-rose-600 to-rose-400 text-white px-4 py-2 relative z-50">
            <div className="flex justify-between items-center w-full">
                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 -ml-2 rounded-md hover:bg-black/20 focus:outline-none transition-colors"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <ul className="hidden md:flex flex-row items-center gap-1">
                    {navLinks.map((link) => (
                        <li key={link.path} className="rounded-md overflow-hidden">
                            <NavLink 
                                className={({isActive}) => `px-4 py-2 block transition-colors duration-200 hover:bg-black/20 ${isActive ? 'bg-black/20 font-medium' : ''}`}
                                to={link.path}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Theme Toggle */}
                <div className="ml-auto">
                    <ModeToggle />
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-rose-700 dark:bg-rose-900 shadow-xl border-t border-white/10 flex flex-col">
                    <ul className="flex flex-col">
                        {navLinks.map((link) => (
                            <li key={link.path} className="border-b border-rose-800/20 dark:border-rose-950/30 last:border-none">
                                <NavLink 
                                    className={({isActive}) => `px-6 py-4 block transition-colors duration-200 hover:bg-black/20 ${isActive ? 'bg-black/20 font-medium' : ''}`}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;