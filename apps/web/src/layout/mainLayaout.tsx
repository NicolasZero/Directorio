import { Outlet } from "react-router"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar";

const MainLayout = () => {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />
            <Navbar />
            <main className="w-full flex-1 pb-3">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout