import { createFileRoute } from '@tanstack/react-router';
import { AccountView } from '@neondatabase/neon-js/auth/react/ui';

export const Route = createFileRoute('/admin/account/$pathname')({
    component: Account,
});

function Account() {
    const { pathname } = Route.useParams();
    return (
        <div className="p-4 lg:p-6">
            <AccountView pathname={pathname} />
        </div>
    );
}