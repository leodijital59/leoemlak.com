import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import type {PropertyFormInitialData} from "@/components/admin/PropertyForm";
import { deleteProperty, getPropertyById, updateProperty } from "@/lib/server/property";
import { getCategories } from "@/lib/server/category";
import { getFeatures } from "@/lib/server/feature";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/admin/properties/$propertyId/edit")({
    component: EditPropertyPage,
    loader: async ({ params }) => {
        const [{ property, images, features }, categories, allFeatures] = await Promise.all([
            getPropertyById({ data: params.propertyId }),
            getCategories(),
            getFeatures(),
        ]);
        return { property, images, features, categories, allFeatures };
    },
});

function EditPropertyPage() {
    const navigate = useNavigate();
    const { property, images, features, categories, allFeatures } = Route.useLoaderData();

    // Transform database property to form initial data
    const initialData: PropertyFormInitialData = {
        id: property.id,
        title: property.title,
        description: property.description,
        categoryId: property.categoryId,
        listingType: property.listingType,
        listingStatus: property.listingStatus,
        price: parseFloat(property.price),
        pricePerSqm: property.pricePerSqm ? parseFloat(property.pricePerSqm) : null,
        province: property.province,
        district: property.district,
        neighborhood: property.neighborhood,
        latitude: property.latitude ? parseFloat(property.latitude) : null,
        longitude: property.longitude ? parseFloat(property.longitude) : null,
        grossArea: property.grossArea ?? null,
        netArea: property.netArea ?? null,
        landArea: property.landArea ?? null,
        rooms: property.rooms ?? null,
        bathrooms: property.bathrooms ?? null,
        buildingAge: property.buildingAge ?? null,
        totalFloors: property.totalFloors ?? null,
        floorNumber: property.floorNumber ?? null,
        heatingType: property.heatingType ?? null,
        hasBalconies: property.hasBalconies ?? false,
        hasElevator: property.hasElevator ?? false,
        hasParking: property.hasParking ?? false,
        hasSecurity: property.hasSecurity ?? false,
        isFurnished: property.isFurnished ?? false,
        isWithinSite: property.isWithinSite ?? false,
        videoUrl: property.videoUrl ?? undefined,
        images: images.map((img) => ({
            id: img.id,
            url: img.url,
            isMainImage: img.isMainImage,
            order: img.order,
        })),
        propertyFeatures: features.map((f) => ({
            featureId: f.featureId,
            value: f.value,
        })),
    };

    const handleSubmit = async (formData: FormData) => {
        try {
            await updateProperty({ data: formData });
            toast.success("İlan başarıyla güncellendi!");
            navigate({ to: "/admin/properties" });
        } catch (error) {
            console.error("Error updating property:", error);
            toast.error("İlan güncellenirken bir hata oluştu.");
            throw error;
        }
    };

    const handleCancel = () => {
        navigate({ to: "/admin/properties" });
    };

    const handleDelete = async () => {
        try {
            await deleteProperty({ data: property.id });
            toast.success("İlan başarıyla silindi!");
            navigate({ to: "/admin/properties" });
        } catch (error) {
            console.error("Error deleting property:", error);
            toast.error("İlan silinirken bir hata oluştu.");
            throw error;
        }
    };

    return (
        <PropertyForm
            mode="edit"
            initialData={initialData}
            categories={categories}
            features={allFeatures}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onDelete={handleDelete}
        />
    );
}
