import {Outlet, createFileRoute, useRouterState} from '@tanstack/react-router'
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

const Loading = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100dvh' }}>
            <div className="spinner-border" style={{ color: "var(--primary-color)" }} role="status">
                <span className="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    )
}

function AppLayoutComponent() {
    const isLoading = useRouterState({ select: (s) => s.isLoading })

    return (
        <div className="wrapper ovh">
            <Header/>

            <MobileMenu/>

            {isLoading ? <Loading /> : <Outlet />}

            <section className="footer-style1 pt60 pb-0">
                <Footer/>
            </section>
        </div>
    )
}
