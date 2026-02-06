import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { createProperty } from "@/lib/server/property";
import { getCategories } from "@/lib/server/category";
import { getFeatures } from "@/lib/server/feature";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/admin/properties/create")({
    component: CreatePropertyPage,
    staticData: {
        title: "İlan Ekle"
    },
    loader: async () => {
        const [categories, features] = await Promise.all([
            getCategories(),
            getFeatures(),
        ]);
        return { categories, features };
    },
});

function CreatePropertyPage() {
    const navigate = useNavigate();
    const { categories, features } = Route.useLoaderData();

    const handleSubmit = async (formData: FormData) => {
        try {
            await createProperty({ data: formData });
            toast.success("İlan başarıyla eklendi!");
            navigate({ to: "/admin/properties" });
        } catch (error) {
            console.error("Error creating property:", error);
            toast.error("İlan eklenirken bir hata oluştu.");
            throw error;
        }
    };

    const handleCancel = () => {
        navigate({ to: "/admin/properties" });
    };

    return (
        <PropertyForm
            mode="create"
            categories={categories}
            features={features}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
