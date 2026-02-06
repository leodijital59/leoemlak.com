import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { FeatureFormValues } from "@/lib/validations/feature";
import { FeatureForm } from "@/components/admin/FeatureForm";
import {
    deleteFeature,
    getFeatureById,
    getFeatureUsageCount,
    updateFeature,
} from "@/lib/server/feature";

export const Route = createFileRoute("/admin/features/$featureId/edit")({
    component: EditFeaturePage,
    staticData: {
        title: "Özellik Düzenle",
    },
    loader: async ({ params }) => {
        const [feature, usageCount] = await Promise.all([
            getFeatureById({ data: params.featureId }),
            getFeatureUsageCount({ data: params.featureId }),
        ]);
        return { feature, usageCount };
    },
});

function EditFeaturePage() {
    const navigate = useNavigate();
    const { feature, usageCount } = Route.useLoaderData();
    const { featureId } = Route.useParams();

    const handleSubmit = async (data: FeatureFormValues) => {
        try {
            await updateFeature({ data: { id: featureId, ...data } });
            toast.success("Özellik başarıyla güncellendi");
            navigate({ to: "/admin/features" });
        } catch (error: any) {
            toast.error(error.message || "Özellik güncellenirken bir hata oluştu");
            throw error;
        }
    };

    const handleCancel = () => {
        navigate({ to: "/admin/features" });
    };

    const handleDelete = async () => {
        try {
            await deleteFeature({ data: featureId });
            toast.success("Özellik başarıyla silindi");
            navigate({ to: "/admin/features" });
        } catch (error: any) {
            toast.error(error.message || "Özellik silinirken bir hata oluştu");
            throw error;
        }
    };

    return (
        <FeatureForm
            mode="edit"
            initialData={{
                id: feature.id,
                name: feature.name,
            }}
            usageCount={usageCount}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
        />
    );
}
