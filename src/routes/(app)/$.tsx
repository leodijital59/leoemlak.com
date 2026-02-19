import { createFileRoute } from '@tanstack/react-router'
import NotFound from "@/components/NotFound.tsx";

export const Route = createFileRoute('/(app)/$')({
    staticData: {
        title: 'Sayfa Bulunamadı',
        description: 'Aradığınız sayfa bulunamadı. Ana sayfaya dönmek için aşağıdaki bağlantıya tıklayın.',
    },
    head: () => ({
        meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    }),
    component: NotFound,
})
