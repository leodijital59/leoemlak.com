import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { FeatureFormValues } from "@/lib/validations/feature";
import { FeatureForm } from "@/components/admin/FeatureForm";
import { createFeature } from "@/lib/server/feature";

export const Route = createFileRoute("/admin/features/create")({
    component: CreateFeaturePage,
    staticData: {
        title: "Özellik Ekle",
    },
});

function CreateFeaturePage() {
    const navigate = useNavigate();

    const handleSubmit = async (data: FeatureFormValues) => {
        try {
            await createFeature({ data });
            toast.success("Özellik başarıyla oluşturuldu");
            navigate({ to: "/admin/features" });
        } catch (error: any) {
            toast.error(error.message || "Özellik oluşturulurken bir hata oluştu");
            throw error;
        }
    };

    const handleCancel = () => {
        navigate({ to: "/admin/features" });
    };

    return (
        <FeatureForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
