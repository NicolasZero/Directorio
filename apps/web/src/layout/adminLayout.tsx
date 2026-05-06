import { Outlet } from "react-router"
import Header from "@/components/header"
import AdminNavbar from "@/components/adminNavbar";

const AdminLayout = () => {
    return (
        <div className="h-screen flex flex-col justify-between">
            <Header />
            <AdminNavbar />
            <main className="flex-2">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout