import { Outlet } from "react-router"
import Header from "./components/header"
import Footer from "./components/footer"
import Navbar from "./components/navbar";

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col justify-between bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <Navbar />
            <main className="flex-2">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout