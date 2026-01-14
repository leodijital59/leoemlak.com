import {Outlet, createFileRoute} from '@tanstack/react-router'
import Header from "@/components/home/home-v1/Header.tsx";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/common/default-footer";

export const Route = createFileRoute('/(app)')({
    component: AppLayoutComponent,
})

function AppLayoutComponent() {
    return (
        <div className="wrapper ovh">
            <Header/>

            <MobileMenu/>

            <Outlet />

            <section className="footer-style1 pt60 pb-0">
                <Footer/>
            </section>
        </div>
    )
}
