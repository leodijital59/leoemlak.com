import {Link, Outlet, createFileRoute, useNavigate} from '@tanstack/react-router'
import React from "react";
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { RedirectToSignIn, SignedIn, SignedOut } from '@neondatabase/neon-js/auth/react/ui';
import {IconLoader2} from "@tabler/icons-react";
import { authClient } from '@/auth';
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {SiteHeader} from "@/components/site-header";
import css from '@/styles/admin.css?url';

export const Route = createFileRoute('/admin')({
    component: RouteComponent,
    ssr: false,
    head: () => ({
        links: [
            { rel: 'stylesheet', href: css }
        ]
    })
})

function RouteComponent() {
    const navigate = useNavigate();
    const { isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <NeonAuthUIProvider
            authClient={authClient}
            credentials={{ forgotPassword: true }}
            navigate={href => navigate({ to: href })}
            replace={href => navigate({ to: href, replace: true, reloadDocument: true })}
            account={{
                basePath: "/admin/account"
            }}
            Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
            <SignedIn>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 64)",
                            "--header-height": "calc(var(--spacing) * 12 + 1px)",
                        } as React.CSSProperties
                    }
                >
                    <AppSidebar variant="sidebar" />
                    <SidebarInset>
                        <SiteHeader />
                        <div className="flex flex-1 flex-col">
                            <div className="@container/main flex flex-1 flex-col gap-2">
                                <Outlet />
                            </div>
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </NeonAuthUIProvider>
    )
}