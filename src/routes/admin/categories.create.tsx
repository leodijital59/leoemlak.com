import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { CategoryFormValues } from "@/lib/validations/category";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategory, getCategories } from "@/lib/server/category";

export const Route = createFileRoute("/admin/categories/create")({
    component: CreateCategoryPage,
    staticData: {
        title: "Kategori Ekle",
    },
    loader: async () => {
        return await getCategories();
    },
});

function CreateCategoryPage() {
    const navigate = useNavigate();
    const categories = Route.useLoaderData();

    const handleSubmit = async (data: CategoryFormValues) => {
        await createCategory({ data });
        navigate({ to: "/admin/categories" });
    };

    const handleCancel = () => {
        navigate({ to: "/admin/categories" });
    };

    return (
        <CategoryForm
            mode="create"
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
