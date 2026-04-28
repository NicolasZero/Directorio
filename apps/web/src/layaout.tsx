import { Outlet } from "react-router"
import Header from "./components/header"
import Footer from "./components/footer"
import Navbar from "./components/navbar";
import { ThemeProvider } from "@/components/theme-provider"

const MainLayout = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="h-screen flex flex-col justify-between">
                <Header />
                <Navbar />
                <main className="flex-2">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    )
}

export default MainLayout