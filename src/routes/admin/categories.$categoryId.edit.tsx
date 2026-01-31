import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { CategoryFormValues } from "@/lib/validations/category";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory,
} from "@/lib/server/category";

export const Route = createFileRoute("/admin/categories/$categoryId/edit")({
    component: EditCategoryPage,
    staticData: {
        title: "Kategori Düzenle",
    },
    loader: async ({ params }) => {
        const [category, categories] = await Promise.all([
            getCategoryById({ data: params.categoryId }),
            getCategories(),
        ]);
        return { category, categories };
    },
});

function EditCategoryPage() {
    const navigate = useNavigate();
    const { category, categories } = Route.useLoaderData();
    const { categoryId } = Route.useParams();

    const handleSubmit = async (data: CategoryFormValues) => {
        await updateCategory({ data: { id: categoryId, ...data } });
        navigate({ to: "/admin/categories" });
    };

    const handleCancel = () => {
        navigate({ to: "/admin/categories" });
    };

    const handleDelete = async () => {
        await deleteCategory({ data: categoryId });
        navigate({ to: "/admin/categories" });
    };

    return (
        <CategoryForm
            mode="edit"
            initialData={{
                id: category.id,
                name: category.name,
                parentId: category.parentId,
            }}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
        />
    );
}
