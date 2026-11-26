import { Outlet } from "react-router"
import Header from "@/components/header"
import Navbar from "@/components/navbar";

const AdminLayout = () => {
    return (
        <div className="h-screen flex flex-col justify-between">
            <Header />
            <Navbar />
            <main className="flex-2 pb-3">
                <Outlet />
            </main>
            <footer className="p-4 bg-violet-700 dark:bg-violet-950">
                <p className="text-center text-violet-50 dark:text-violet-100">© Copyright {new Date().getFullYear()} Inamujer. Oficina de Sistema y Tecnología de la Información</p>
            </footer>
        </div>
    )
}

export default AdminLayout