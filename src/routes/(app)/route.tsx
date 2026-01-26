import {Outlet, createFileRoute} from '@tanstack/react-router'
import Header from "@/components/home/home-v1/Header.tsx";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/common/default-footer";
import css from '@/styles/main.scss?url';

export const Route = createFileRoute('/(app)')({
    component: AppLayoutComponent,
    head: () => ({
        links: [
            { rel: 'stylesheet', href: css }
        ]
    })
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
