import {Outlet, createFileRoute, useLocation} from '@tanstack/react-router'
import Header from "@/components/home/home-v2/Header.tsx";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/common/default-footer";
import css from '@/styles/main.scss?url';
import {cn} from "@/lib/utils";

export const Route = createFileRoute('/(app)')({
    component: AppLayoutComponent,
    head: () => ({
        links: [
            { rel: 'stylesheet', href: css }
        ]
    })
})

function AppLayoutComponent() {
    const pathname = useLocation({
        select: state => state.pathname
    })

    return (
        <div className="wrapper ovh">
            <Header/>

            <MobileMenu/>

            <Outlet />

            <section className={cn("footer-style1 at-home2 pb-0", {
                "homepage": pathname === "/"
            })}>
                <Footer/>
            </section>
        </div>
    )
}
