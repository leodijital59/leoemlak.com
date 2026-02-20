import {Link, Outlet, createFileRoute, useLayoutEffect, useLocation, useNavigate} from '@tanstack/react-router'
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import {SignedOut} from "@neondatabase/neon-js/auth/react/ui";
import {IconLoader2} from "@tabler/icons-react";
import css from '@/styles/auth.css?url';
import { authClient } from '@/auth';

export const Route = createFileRoute('/(auth)')({
    component: RouteComponent,
    ssr: false,
    head: () => ({
        meta: [{ name: 'robots', content: 'noindex, nofollow' }],
        links: [{ rel: 'stylesheet', href: css }]
    })
})

function RouteComponent() {
    const navigate = useNavigate();
    const redirectTo = useLocation({
        select: (location) => location.search.redirectTo || "/admin",
    });
    const { data, isPending } = authClient.useSession();

    useLayoutEffect(() => {
        if (data) {
            navigate({ to: redirectTo, replace: true });
        }
    }, [data, redirectTo])

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
            <SignedOut>
                <Outlet />
            </SignedOut>
        </NeonAuthUIProvider>
    )
}