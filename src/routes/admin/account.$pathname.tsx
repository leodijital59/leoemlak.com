import { createFileRoute } from '@tanstack/react-router';
import {AccountView, accountViewPaths, authLocalization, getViewByPath} from '@neondatabase/neon-js/auth/react/ui';
import css from '@/styles/auth.css?url';

export const Route = createFileRoute('/admin/account/$pathname')({
    component: Account,
    head: (ctx) => ({
        meta: [{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            title: [ctx.matches.at(0)?.meta?.find(({ title }: any) => title)?.title, authLocalization[getViewByPath(accountViewPaths, ctx.params.pathname) ?? "SIGN_IN"]].filter(Boolean).join(' | ')
        }],
        links: [{ rel: 'stylesheet', href: css }]
    }),
});

function Account() {
    const { pathname } = Route.useParams();
    return (
        <div className="p-4 lg:p-6">
            <AccountView pathname={pathname} />
        </div>
    );
}