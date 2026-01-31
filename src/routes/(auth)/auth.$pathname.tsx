import { createFileRoute } from '@tanstack/react-router';
import { AuthView, authLocalization, authViewPaths, getViewByPath } from '@neondatabase/neon-js/auth/react/ui';

export const Route = createFileRoute('/(auth)/auth/$pathname')({
    component: Auth,
    head: (ctx) => ({
        meta: [{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            title: [ctx.matches.at(0)?.meta?.find(({ title }: any) => title)?.title, authLocalization[getViewByPath(authViewPaths, ctx.params.pathname) ?? "SIGN_IN"]].filter(Boolean).join(' | ')
        }]
    }),
});

function Auth() {
    const { pathname } = Route.useParams();
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <AuthView pathname={pathname} />
        </div>
    );
}