import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { createProperty } from "@/lib/server/property";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/admin/properties/create")({
    component: CreatePropertyPage,
    staticData: {
        title: "İlan Ekle"
    }
});

function CreatePropertyPage() {
    const navigate = useNavigate();

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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
