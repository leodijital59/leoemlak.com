import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {IconLoader2, IconTrash} from "@tabler/icons-react";
import {MapPin} from "lucide-react";
import type { FieldValues, SubmitHandler } from "react-hook-form";
import type { ExistingImage, ImageItem } from "@/components/admin/ImageUpload";
import type {PropertyFormValues} from "@/lib/validations/property";
import {
    buildingAgeOptions,
    heatingTypeOptions,
    listingStatusOptions,
    listingTypeOptions,
    propertyFormSchema,
    propertyTypeOptions
} from "@/lib/validations/property";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Map, MapControls, MapMarker, MarkerContent } from "@/components/ui/map";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface PropertyFormInitialData extends PropertyFormValues {
    id: string;
    images: {
        id: string;
        url: string;
        isMainImage: boolean;
        order: number;
    }[];
}

interface PropertyFormProps {
    mode: "create" | "edit";
    initialData?: PropertyFormInitialData;
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    onDelete?: () => Promise<void>;
}

const defaultValues = {
    title: "",
    description: "",
    propertyType: undefined as string | undefined,
    listingType: undefined as string | undefined,
    listingStatus: "active",
    price: undefined as number | undefined,
    pricePerSqm: undefined as number | undefined,
    province: "",
    district: "",
    neighborhood: "",
    address: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    grossArea: undefined as number | undefined,
    netArea: undefined as number | undefined,
    landArea: undefined as number | undefined,
    rooms: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
    buildingAge: undefined as string | undefined,
    totalFloors: undefined as number | undefined,
    floorNumber: undefined as number | undefined,
    heatingType: undefined as string | undefined,
    hasBalconies: false,
    hasElevator: false,
    hasParking: false,
    hasSecurity: false,
    isFurnished: false,
    isWithinSite: false,
    videoUrl: "",
};

export function PropertyForm({ mode, initialData, onSubmit, onCancel, onDelete }: PropertyFormProps) {
    const [images, setImages] = React.useState<ImageItem[]>([]);
    const [imagesToDelete, setImagesToDelete] = React.useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Initialize marker position from initialData or default
    const initialLat = initialData?.latitude ?? 39.925533;
    const initialLng = initialData?.longitude ?? 32.866287;
    const [markerPosition, setMarkerPosition] = React.useState<{ lat: number; lng: number }>({
        lat: initialLat,
        lng: initialLng,
    });

    // Initialize form with default or initial values
    const formDefaultValues = React.useMemo(() => {
        if (!initialData) return defaultValues;

        return {
            title: initialData.title,
            description: initialData.description,
            propertyType: initialData.propertyType,
            listingType: initialData.listingType,
            listingStatus: initialData.listingStatus,
            price: initialData.price,
            pricePerSqm: initialData.pricePerSqm ?? undefined,
            province: initialData.province,
            district: initialData.district,
            neighborhood: initialData.neighborhood ?? "",
            address: initialData.address ?? "",
            latitude: initialData.latitude ?? undefined,
            longitude: initialData.longitude ?? undefined,
            grossArea: initialData.grossArea ?? undefined,
            netArea: initialData.netArea ?? undefined,
            landArea: initialData.landArea ?? undefined,
            rooms: initialData.rooms ?? undefined,
            bathrooms: initialData.bathrooms ?? undefined,
            buildingAge: initialData.buildingAge ?? undefined,
            totalFloors: initialData.totalFloors ?? undefined,
            floorNumber: initialData.floorNumber ?? undefined,
            heatingType: initialData.heatingType ?? undefined,
            hasBalconies: initialData.hasBalconies,
            hasElevator: initialData.hasElevator,
            hasParking: initialData.hasParking,
            hasSecurity: initialData.hasSecurity,
            isFurnished: initialData.isFurnished,
            isWithinSite: initialData.isWithinSite,
            videoUrl: initialData.videoUrl ?? "",
        };
    }, [initialData]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm<any>({
        // @ts-expect-error - Zod v4 type compatibility issue with @hookform/resolvers
        resolver: zodResolver(propertyFormSchema),
        defaultValues: formDefaultValues,
    });

    // Initialize images from initialData in edit mode
    React.useEffect(() => {
        if (mode === "edit" && initialData?.images) {
            const existingImages: ExistingImage[] = initialData.images.map((img) => ({
                id: img.id,
                url: img.url,
                isMain: img.isMainImage,
                order: img.order,
                type: "existing" as const,
            }));
            setImages(existingImages);
        }
    }, [mode, initialData]);

    // Update marker position when initialData changes
    React.useEffect(() => {
        if (initialData?.latitude && initialData.longitude) {
            setMarkerPosition({
                lat: initialData.latitude,
                lng: initialData.longitude,
            });
        }
    }, [initialData?.latitude, initialData?.longitude]);

    const handleDeleteExistingImage = (id: string) => {
        setImagesToDelete((prev) => [...prev, id]);
    };

    const handleFormSubmit: SubmitHandler<FieldValues> = async (formData) => {
        setIsSubmitting(true);

        try {
            // FormData oluştur
            const submitData = new FormData();

            // Property ID for edit mode
            if (mode === "edit" && initialData?.id) {
                submitData.append("propertyId", initialData.id);
            }

            // Property verilerini JSON olarak ekle
            submitData.append("property", JSON.stringify(formData));

            // Separate new and existing images
            const newImages = images.filter((img) => img.type === "new");
            const existingImages = images.filter((img) => img.type === "existing");

            // Image metadata'larını ekle (extension ve isMain) for new images
            const imageMeta = newImages.map((img) => ({
                extension: img.type === "new" ? img.file.name.split(".").pop() || "jpg" : "",
                isMain: img.isMain,
            }));
            submitData.append("imageMeta", JSON.stringify(imageMeta));

            // Existing images metadata (with updated order and isMain)
            const existingImagesMeta = existingImages.map((img) => ({
                id: img.id,
                isMain: img.isMain,
                order: images.indexOf(img), // Use actual order in the combined array
            }));
            submitData.append("existingImages", JSON.stringify(existingImagesMeta));

            // Images to delete
            submitData.append("imagesToDelete", JSON.stringify(imagesToDelete));

            // New image files
            newImages.forEach((img) => {
                if (img.type === "new") {
                    submitData.append("images", img.file);
                }
            });

            await onSubmit(submitData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete();
        } finally {
            setIsDeleting(false);
        }
    };

    const submitButtonText = mode === "create"
        ? (isSubmitting ? "Kaydediliyor..." : "İlanı Kaydet")
        : (isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet");

    const pageTitle = mode === "create" ? "İlan Ekle" : "İlanı Düzenle";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{pageTitle}</h1>
                </div>
                {(mode === "edit" && onDelete) && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isDeleting}>
                                <IconTrash className="size-4"/>
                                {isDeleting ? "Siliniyor..." : "İlanı Sil"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm görsellerle birlikte ilan kalıcı olarak silinecektir.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Siliniyor..." : "Sil"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Temel Bilgiler */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Temel Bilgiler</CardTitle>
                            <CardDescription>
                                İlanın başlığı, açıklaması ve türü hakkında bilgiler.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>İlan Başlığı *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: Deniz Manzaralı 3+1 Daire" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Açıklama *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="İlan hakkında detaylı açıklama yazın..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="propertyType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Emlak Tipi *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {propertyTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="listingType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>İlan Türü *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {listingTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="listingStatus"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>İlan Durumu</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {listingStatusOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fiyat */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fiyat Bilgileri</CardTitle>
                            <CardDescription>
                                İlanın fiyatı ve m² fiyatı.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fiyat (₺) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pricePerSqm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>m² Fiyatı (₺)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Konum */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Konum Bilgileri</CardTitle>
                            <CardDescription>
                                Emlakın bulunduğu konum bilgileri.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>İl *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Örn: İstanbul" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>İlçe *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Örn: Kadıköy" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="neighborhood"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mahalle</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Örn: Caferağa" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adres</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Detaylı adres bilgisi..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Harita ile Konum Seçimi */}
                            <div className="space-y-2">
                                <FormLabel>Konum</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Haritada marker'ı sürükleyerek veya "Konumumu Bul" butonunu kullanarak lokasyon seçebilirsiniz.
                                </p>
                                <div className="h-[400px] w-full rounded-lg border overflow-hidden">
                                    <Map
                                        center={[markerPosition.lng, markerPosition.lat]}
                                        zoom={14}
                                    >
                                        <MapMarker
                                            longitude={markerPosition.lng}
                                            latitude={markerPosition.lat}
                                            draggable
                                            onDragEnd={(lngLat) => {
                                                setMarkerPosition({ lat: lngLat.lat, lng: lngLat.lng });
                                                form.setValue('latitude', lngLat.lat);
                                                form.setValue('longitude', lngLat.lng);
                                            }}
                                        >
                                            <MarkerContent>
                                                <div className="cursor-move">
                                                    <MapPin
                                                        className="fill-black stroke-white dark:fill-white"
                                                        size={28}
                                                    />
                                                </div>
                                            </MarkerContent>
                                        </MapMarker>
                                        <MapControls
                                            position="top-right"
                                            showZoom
                                            showLocate
                                            onLocate={(coords) => {
                                                setMarkerPosition({ lat: coords.latitude, lng: coords.longitude });
                                                form.setValue('latitude', coords.latitude);
                                                form.setValue('longitude', coords.longitude);
                                            }}
                                        />
                                    </Map>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Özellikler */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Emlak Özellikleri</CardTitle>
                            <CardDescription>
                                Metrekare, oda sayısı ve bina bilgileri.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <FormField
                                    control={form.control}
                                    name="grossArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brüt m²</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="netArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Net m²</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="landArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Arsa m²</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="rooms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Oda Sayısı</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bathrooms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Banyo Sayısı</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FormField
                                    control={form.control}
                                    name="buildingAge"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bina Yaşı</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {buildingAgeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="totalFloors"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Toplam Kat</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="floorNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bulunduğu Kat</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="heatingType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Isıtma Tipi</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seçiniz" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {heatingTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ek Özellikler */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ek Özellikler</CardTitle>
                            <CardDescription>
                                Emlakın sahip olduğu ek özellikler.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <FormField
                                    control={form.control}
                                    name="hasBalconies"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Balkon
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hasElevator"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Asansör
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hasParking"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Otopark
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="hasSecurity"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Güvenlik
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isFurnished"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Eşyalı
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isWithinSite"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                                Site İçinde
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medya */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medya</CardTitle>
                            <CardDescription>
                                Fotoğraflar ve video bağlantısı ekleyin.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <FormLabel className="mb-2 block">Fotoğraflar</FormLabel>
                                <ImageUpload
                                    value={images}
                                    onChange={setImages}
                                    maxFiles={20}
                                    onDeleteExisting={handleDeleteExistingImage}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://youtube.com/watch?v=..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            İptal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <IconLoader2 className="mr-2 size-4 animate-spin" />
                            )}
                            {submitButtonText}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
