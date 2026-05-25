import { Outlet } from "react-router"
import Header from "@/components/header"
import Navbar from "@/components/navbar";

const AdminLayout = () => {
    return (
        <div className="h-screen flex flex-col justify-between">
            <Header />
            <Navbar isAdmin />
            <main className="flex-2">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout