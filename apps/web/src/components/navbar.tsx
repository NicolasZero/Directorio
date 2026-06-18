import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, LogOut, ChevronDownIcon } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/context/authContext";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    const { logout, user, status } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/auth/login");
    };

    const publicLinks = [
        { name: "Inicio", path: "/" },
        { name: "Directorio", path: "/directorio" },
        { name: "Mapa", path: "/mapa" },
        { name: "Aprendizaje", path: "/clases" },
        { name: "Conócenos", path: "/conocenos" },
    ];

    const adminLinks = [
        { name: "Panel principal", path: "/admin/inicio" },
        { name: "Directorio", path: "/admin/directorio" },
        { name: "Usuarios", path: "/admin/usuarios" },
        { name: "Aprendizaje", path: "/admin/clases" },
        { name: "Descripción", path: "/admin/about" }
    ];

    const isAdmin = status === 'authenticated' ? true : false;

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
                    {publicLinks.map((link) => (
                        <li key={link.path} className="rounded-md overflow-hidden">
                            <NavLink
                                className={({ isActive }) =>
                                    `px-4 py-2 block transition-colors duration-200 hover:bg-black/20 ${isActive ? "bg-black/20 font-medium" : ""}`
                                }
                                to={link.path}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                    {isAdmin && (

                        <li>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="px-4 py-2 transition-colors duration-200 hover:bg-black/20 rounded-md">
                                    <button className="flex items-center gap-1 focus:outline-none">
                                        Administrar <ChevronDownIcon className="w-4 h-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {adminLinks.map((link) => (
                                        <DropdownMenuItem key={link.path} asChild>
                                            <NavLink to={link.path}>{link.name}</NavLink>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                    )}
                </ul>

                {/* Right section: theme toggle + admin actions */}
                <div className="ml-auto flex items-center gap-2">
                    {isAdmin && (
                        <p className="text-white text-sm hidden md:block">
                            Hola, {user?.nombre}
                        </p>
                    )}
                    <ModeToggle />
                    {isAdmin && (
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="text-accent-foreground border-none"
                            title="Cerrar sesión"
                        >
                            <LogOut />
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-rose-700 dark:bg-rose-900 shadow-xl border-t border-white/10 flex flex-col">
                    <ul className="flex flex-col">
                        {publicLinks.map((link) => (
                            <li key={link.path} className="px-3">
                                <NavLink
                                    className={({ isActive }) =>
                                        `px-6 py-4 block transition-colors duration-200 hover:bg-black/20 rounded-xl ${isActive ? "bg-black/20 font-medium" : ""}`
                                    }
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                        {isAdmin && (
                            <li className="px-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild className="px-4 py-2 transition-colors duration-200 hover:bg-black/20 rounded-md">
                                        <button className="flex items-center gap-1 focus:outline-none">
                                            Administrar <ChevronDownIcon className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {adminLinks.map((link) => (
                                            <DropdownMenuItem key={link.path} onClick={() => setIsOpen(false)}>
                                                <NavLink to={link.path}>{link.name}</NavLink>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
