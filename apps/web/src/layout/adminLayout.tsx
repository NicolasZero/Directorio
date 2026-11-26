import { Outlet } from "react-router"
import Header from "@/components/header"
import Navbar from "@/components/navbar";

const AdminLayout = () => {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <Navbar />
            <main className="w-full flex-1 pb-3">
                <Outlet />
            </main>
            <footer className="p-4 bg-violet-700 dark:bg-violet-950">
                <p className="text-center text-violet-50 dark:text-violet-100">© Copyright {new Date().getFullYear()} Inamujer. Oficina de Sistema y Tecnología de la Información</p>
            </footer>
        </div>
    )
}

export default AdminLayout