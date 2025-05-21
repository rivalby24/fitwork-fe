import FooterDashboard from "@/components/FooterDashboard"
import NavbarDashboard from "@/components/NavbarDashboard"
import { Outlet } from "react-router-dom"

function Layout() {
  return (
    <>
        <div className="w-full bg-neutral-50 min-h-screen">
            <NavbarDashboard />
            <Outlet />
            <FooterDashboard />
        </div>
    </>
  )
}

export default Layout