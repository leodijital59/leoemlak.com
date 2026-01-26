import {Outlet, createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { SignedOut } from '@neondatabase/neon-js/auth/react/ui';
import { authClient } from '@/auth';
import css from '@/styles/admin.css?url';

export const Route = createFileRoute('/(auth)')({
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
    return (
        <NeonAuthUIProvider
            authClient={authClient}
            credentials={{ forgotPassword: true }}
            navigate={href => navigate({ to: href })}
            replace={href => navigate({ to: href, replace: true })}
            onSessionChange={() => navigate({ reloadDocument: true })}
            account={{
                basePath: "/admin/account"
            }}
            Link={Link}
        >
            <SignedOut>
                <Outlet />
            </SignedOut>
        </NeonAuthUIProvider>
    )
}
