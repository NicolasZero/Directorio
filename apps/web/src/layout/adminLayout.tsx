import { Outlet } from "react-router"
import Header from "@/components/header"
import Navbar from "@/components/navbar";

const AdminLayout = () => {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <Navbar />
            <main className="w-full flex-1">
                <Outlet />
            </main>
            <footer className="p-4 bg-rose-700 dark:bg-rose-950">
                <p className="text-center text-rose-50 dark:text-rose-100">© Copyright {new Date().getFullYear()} Inamujer. Oficina de Sistema y Tecnología de la Información</p>
            </footer>
        </div>
    )
}

export default AdminLayout