import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {IconCheck, IconLoader2, IconTrash, IconX} from "@tabler/icons-react";
import {MapPin} from "lucide-react";
import {useEffect} from "react";
import type { SubmitHandler } from "react-hook-form";
import type { ExistingImage, ImageItem } from "@/components/admin/ImageUpload";
import type {PropertyFormValues} from "@/lib/validations/property";
import { createFeature } from "@/lib/server/feature";
import { getCategoryFeatures } from "@/lib/server/category";
import {
    heatingTypeOptions,
    listingStatusOptions,
    listingTypeOptions,
    propertyFormSchema,
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
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {Map as MapComp, MapControls, MapMarker, MarkerContent, useMap} from "@/components/ui/map";
import LocationSelect from "@/components/admin/location/LocationSelect";
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
import {EditorField} from "@/components/admin/EditorField.tsx";

export interface PropertyFormInitialData extends PropertyFormValues {
    id: string;
    images: {
        id: string;
        url: string;
        isMainImage: boolean;
        order: number;
    }[];
    propertyFeatures?: {
        featureId: string;
        value: boolean;
    }[];
}

export interface CategoryOption {
    id: string;
    name: string;
    parentId: string | null;
}

interface PropertyFormProps {
    mode: "create" | "edit";
    initialData?: PropertyFormInitialData;
    categories: CategoryOption[];
    features: { id: string; name: string }[];
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    onDelete?: () => Promise<void>;
}

interface CategorySelectItemsProps {
    categories: CategoryOption[];
    parentId?: string | null;
    depth?: number;
}

function CategorySelectItems({ categories, parentId = null, depth = 0 }: CategorySelectItemsProps) {
    const children = categories.filter(c => c.parentId === parentId);
    if (children.length === 0) return null;

    return (
        <>
            {children.map((category) => {
                const hasChildren = categories.some(c => c.parentId === category.id);
                const indent = "\u00A0\u00A0".repeat(depth);

                return (
                    <React.Fragment key={category.id}>
                        <SelectItem
                            value={category.id}
                            disabled={hasChildren}
                            className={hasChildren ? "font-semibold" : ""}
                            style={{ paddingLeft: `${(depth * 12) + 8}px` }}
                        >
                            {indent}{category.name}
                        </SelectItem>
                        <CategorySelectItems
                            categories={categories}
                            parentId={category.id}
                            depth={depth + 1}
                        />
                    </React.Fragment>
                );
            })}
        </>
    );
}

function MapEventListener({ onLocationClick } : { onLocationClick: (lngLat: {
    lat: number
    lng: number
}) => void }) {
    const { map, isLoaded } = useMap();

    useEffect(() => {
        if (!map || !isLoaded) return;

        const handleClick = ({ lngLat }: { lngLat: any }) => {
            onLocationClick(lngLat);
        };

        map.on("click", handleClick);
        return () => {
            map.off("click", handleClick)
        };
    }, [map, isLoaded]);

    return null;
}

const defaultValues = {
    title: "",
    description: [{ type: "p", children: [{ text: "" }] }],
    categoryId: undefined as string | undefined,
    listingType: undefined as string | undefined,
    listingStatus: "active",
    price: undefined as number | undefined,
    pricePerSqm: undefined as number | undefined,
    province: "",
    district: "",
    neighborhood: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    grossArea: undefined as number | undefined,
    netArea: undefined as number | undefined,
    landArea: undefined as number | undefined,
    rooms: undefined as number | undefined,
    bathrooms: undefined as number | undefined,
    buildingAge: undefined as number | undefined,
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

export function PropertyForm({ mode, initialData, categories, features, onSubmit, onCancel, onDelete }: PropertyFormProps) {
    const [images, setImages] = React.useState<ImageItem[]>([]);
    const [imagesToDelete, setImagesToDelete] = React.useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Dynamic features state
    const [availableFeatures, setAvailableFeatures] = React.useState(features);
    const [selectedFeatures, setSelectedFeatures] = React.useState<Map<string, boolean>>(new Map());
    const [categoryFeatureIds, setCategoryFeatureIds] = React.useState<Set<string>>(new Set());
    const [featureSearchQuery, setFeatureSearchQuery] = React.useState("");
    const [isCreatingFeature, setIsCreatingFeature] = React.useState(false);
    const [showFeatureDropdown, setShowFeatureDropdown] = React.useState(false);

    // Initialize marker position from initialData or default
    const [markerPosition, setMarkerPosition] = React.useState<{ lat: number; lng: number } | undefined>((initialData?.latitude && initialData.longitude) ? {
        lat: initialData.latitude,
        lng: initialData.longitude,
    } : undefined);
    const mapRef = React.useRef<any>(null);
    const isReverseGeocodingRef = React.useRef(false);

    // Initialize form with default or initial values
    const formDefaultValues = React.useMemo(() => {
        if (!initialData) return defaultValues;

        return {
            title: initialData.title,
            description: initialData.description ? JSON.parse(initialData.description) : defaultValues.description,
            categoryId: initialData.categoryId,
            listingType: initialData.listingType,
            listingStatus: initialData.listingStatus,
            price: initialData.price,
            pricePerSqm: initialData.pricePerSqm ?? undefined,
            province: initialData.province,
            district: initialData.district,
            neighborhood: initialData.neighborhood,
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
            videoUrl: initialData.videoUrl ?? undefined,
        };
    }, [initialData]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const form = useForm<any>({
        // @ts-expect-error - Zod v4 type compatibility issue with @hookform/resolvers
        resolver: zodResolver(propertyFormSchema),
        defaultValues: formDefaultValues,
    });

    // Geocode location and update map
    const handleLocationChange = React.useCallback(async (location: { province: string; district: string; neighborhood: string }) => {
        try {
            // Use Nominatim (OpenStreetMap) for geocoding
            const query = `${location.neighborhood}, ${location.district}, ${location.province}`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1&countrycodes=tr`,
                {
                    headers: {
                        'User-Agent': 'LeoEmlak Property Listing',
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const latitude = parseFloat(lat);
                    const longitude = parseFloat(lon);

                    // Update marker position
                    setMarkerPosition({ lat: latitude, lng: longitude });
                    form.setValue('latitude', latitude);
                    form.setValue('longitude', longitude);

                    // Fly to location with animation
                    if (mapRef.current) {
                        mapRef.current.flyTo({
                            center: [longitude, latitude],
                            zoom: 15,
                            duration: 2000,
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }, [form]);

    // Reverse geocode coordinates to location (coordinates -> address)
    const handleReverseGeocode = React.useCallback(async (lat: number, lng: number) => {
        try {
            isReverseGeocodingRef.current = true;

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'LeoEmlak Property Listing',
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data && data.address) {
                    const address = data.address;

                    // Turkish uppercase conversion (handles İ/I correctly)
                    const toTurkishUpper = (str: string) => {
                        return str
                            .replace(/i/g, 'İ')
                            .replace(/ı/g, 'I')
                            .toLocaleUpperCase('tr-TR');
                    };

                    // Extract location info from address and convert to uppercase
                    // Nominatim returns: city/town, county/district, state/province
                    const province = toTurkishUpper(address.province || address.state || address.city || '');
                    const district = toTurkishUpper(address.county || address.town || address.city_district || '');
                    const neighborhood = toTurkishUpper(address.suburb || address.neighbourhood || address.quarter || address.hamlet || '');

                    // Update form fields if values are found
                    if (province) {
                        form.setValue('province', province);
                    }
                    if (district) {
                        form.setValue('district', district);
                    }
                    if (neighborhood) {
                        form.setValue('neighborhood', neighborhood);
                    }
                }
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error);
        } finally {
            // Reset flag after a short delay to allow form updates to complete
            setTimeout(() => {
                isReverseGeocodingRef.current = false;
            }, 100);
        }
    }, [form]);

    // Initialize images from initialData in edit mode
    React.useEffect(() => {
        if (mode === "edit" && initialData?.images) {
            // Load images and get their dimensions
            const loadImagesWithDimensions = async () => {
                const imagePromises = initialData.images.map((img) => {
                    return new Promise<ExistingImage>((resolve) => {
                        const image = new Image();

                        image.onload = () => {
                            resolve({
                                id: img.id,
                                url: img.url,
                                isMain: img.isMainImage,
                                order: img.order,
                                type: "existing" as const,
                                width: image.naturalWidth,
                                height: image.naturalHeight,
                            });
                        };

                        image.onerror = () => {
                            // If image fails to load, add without dimensions
                            resolve({
                                id: img.id,
                                url: img.url,
                                isMain: img.isMainImage,
                                order: img.order,
                                type: "existing" as const,
                            });
                        };

                        image.src = img.url;
                    });
                });

                const loadedImages = await Promise.all(imagePromises);
                setImages(loadedImages);
            };

            loadImagesWithDimensions();
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

    // Initialize selected features from initialData in edit mode
    React.useEffect(() => {
        if (mode === "edit" && initialData?.propertyFeatures) {
            const featuresMap = new Map<string, boolean>();
            initialData.propertyFeatures.forEach(pf => {
                featuresMap.set(pf.featureId, pf.value);
            });
            setSelectedFeatures(featuresMap);
        }
    }, [mode, initialData?.propertyFeatures]);

    // Load category features in edit mode
    React.useEffect(() => {
        if (mode === "edit" && initialData?.categoryId) {
            getCategoryFeatures({ data: initialData.categoryId }).then((features) => {
                setCategoryFeatureIds(new Set(features.map(f => f.featureId)));
            });
        }
    }, [mode, initialData?.categoryId]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.feature-search-container')) {
                setShowFeatureDropdown(false);
            }
        };

        if (showFeatureDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showFeatureDropdown]);

    const handleDeleteExistingImage = (id: string) => {
        setImagesToDelete((prev) => [...prev, id]);
    };

    const handleAddFeature = async (featureName: string) => {
        if (!featureName.trim()) return;

        const trimmedName = featureName.trim();

        // Check if feature already exists
        const existingFeature = availableFeatures.find(
            f => f.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (existingFeature) {
            // Select existing feature
            setSelectedFeatures((prev) => new Map(prev).set(existingFeature.id, true));
            setFeatureSearchQuery("");
            setShowFeatureDropdown(false);
            return;
        }

        // Create new feature
        setIsCreatingFeature(true);
        try {
            const { feature } = await createFeature({ data: { name: trimmedName } });
            setAvailableFeatures((prev) => [...prev, { id: feature.id, name: feature.name }]);
            setSelectedFeatures((prev) => new Map(prev).set(feature.id, true));
            setFeatureSearchQuery("");
            setShowFeatureDropdown(false);
        } catch (error) {
            console.error("Failed to create feature:", error);
            alert("Özellik oluşturulamadı. Lütfen tekrar deneyin.");
        } finally {
            setIsCreatingFeature(false);
        }
    };

    const removeFeature = (featureId: string) => {
        // Prevent removing category features
        if (categoryFeatureIds.has(featureId)) {
            return;
        }

        setSelectedFeatures((prev) => {
            const newMap = new Map(prev);
            newMap.delete(featureId);
            return newMap;
        });
    };

    const toggleFeatureValue = (featureId: string) => {
        setSelectedFeatures((prev) => {
            const newMap = new Map(prev);
            const currentValue = newMap.get(featureId);
            if (currentValue !== undefined) {
                newMap.set(featureId, !currentValue);
            }
            return newMap;
        });
    };

    // Filter features based on search query
    const filteredFeatures = React.useMemo(() => {
        if (!featureSearchQuery.trim()) return [];

        const query = featureSearchQuery.toLowerCase();
        return availableFeatures
            .filter(f => !selectedFeatures.has(f.id)) // Exclude already selected
            .filter(f => f.name.toLowerCase().includes(query))
            .slice(0, 5); // Limit to 5 results
    }, [featureSearchQuery, availableFeatures, selectedFeatures]);

    // Check if there's an exact match
    const exactMatch = React.useMemo(() => {
        return filteredFeatures.some(
            f => f.name.toLowerCase() === featureSearchQuery.toLowerCase()
        );
    }, [filteredFeatures, featureSearchQuery]);

    // Get selected features with names and values
    const selectedFeaturesWithNames = React.useMemo(() => {
        const featuresWithNames = Array.from(selectedFeatures.entries())
            .map(([featureId, value]) => {
                const feature = availableFeatures.find(f => f.id === featureId);
                return feature ? { ...feature, value } : null;
            })
            .filter(Boolean) as { id: string; name: string; value: boolean }[];

        // Separate category features and manual features
        const categoryFeatures = featuresWithNames
            .filter(f => categoryFeatureIds.has(f.id))
            .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

        const manualFeatures = featuresWithNames
            .filter(f => !categoryFeatureIds.has(f.id))
            .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

        // Return category features first, then manual features
        return [...categoryFeatures, ...manualFeatures];
    }, [selectedFeatures, availableFeatures, categoryFeatureIds]);

    const handleFormSubmit: SubmitHandler<PropertyFormValues> = async (formData: PropertyFormValues) => {
        console.log(formData)
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

            // Features
            const featuresArray = Array.from(selectedFeatures.entries()).map(([featureId, value]) => ({
                featureId,
                value,
            }));
            submitData.append("features", JSON.stringify(featuresArray));

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{pageTitle}</h1>
                </div>
                {(mode === "edit" && onDelete) && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
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
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <Tabs defaultValue="basic" className="space-y-6">
                        <TabsList variant="line" className="w-full h-auto flex-wrap">
                            <TabsTrigger value="basic" className="flex-1 min-w-fit">Temel Bilgiler</TabsTrigger>
                            <TabsTrigger value="description" className="flex-1 min-w-fit">Açıklama</TabsTrigger>
                            <TabsTrigger value="location" className="flex-1 min-w-fit">Konum</TabsTrigger>
                            <TabsTrigger value="features" className="flex-1 min-w-fit">Özellikler</TabsTrigger>
                            <TabsTrigger value="extras" className="flex-1 min-w-fit">Ek Özellikler</TabsTrigger>
                            <TabsTrigger value="media" className="flex-1 min-w-fit">Medya</TabsTrigger>
                        </TabsList>

                        {/* Temel Bilgiler Tab */}
                        <TabsContent value="basic" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Temel Bilgiler</CardTitle>
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

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="categoryId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Kategori *</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value);

                                                            // Remove previous category features
                                                            setSelectedFeatures((prev) => {
                                                                const next = new Map(prev);
                                                                categoryFeatureIds.forEach((featureId) => {
                                                                    next.delete(featureId);
                                                                });
                                                                return next;
                                                            });

                                                            // Load and add new category features
                                                            if (value) {
                                                                getCategoryFeatures({ data: value }).then((features) => {
                                                                    const newCategoryFeatureIds = new Set(features.map(f => f.featureId));
                                                                    setCategoryFeatureIds(newCategoryFeatureIds);

                                                                    setSelectedFeatures((prev) => {
                                                                        const next = new Map(prev);
                                                                        features.forEach((feature) => {
                                                                            next.set(feature.featureId, false); // Default value: false
                                                                        });
                                                                        return next;
                                                                    });
                                                                });
                                                            } else {
                                                                setCategoryFeatureIds(new Set());
                                                            }
                                                        }}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Seçiniz" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <CategorySelectItems categories={categories} />
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

                            <Card>
                                <CardHeader>
                                    <CardTitle>Fiyat Bilgileri</CardTitle>
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
                        </TabsContent>

                        {/* Açıklama Tab */}
                        <TabsContent value="description">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Açıklama</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <EditorField
                                                        {...field}
                                                        placeholder="İlan hakkında detaylı açıklama yazın..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Konum Tab */}
                        <TabsContent value="location">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Konum Bilgileri</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <LocationSelect
                                        form={form}
                                        onLocationChange={handleLocationChange}
                                        isReverseGeocodingRef={isReverseGeocodingRef}
                                        isEditMode={mode === "edit"}
                                    />

                                    {/* Harita ile Konum Seçimi */}
                                    <div className="space-y-2">
                                        <FormLabel>Konum</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Haritada marker'ı sürükleyerek veya "Konumumu Bul" butonunu kullanarak lokasyon seçebilirsiniz.
                                        </p>
                                        <div className="h-[400px] w-full rounded-lg border overflow-hidden">
                                            <MapComp
                                                ref={mapRef}
                                                center={markerPosition ? [markerPosition.lng, markerPosition.lat] : [35,39.3]}
                                                zoom={markerPosition ? 14 : 5}
                                            >
                                                {markerPosition && <MapMarker
                                                    longitude={markerPosition.lng}
                                                    latitude={markerPosition.lat}
                                                    draggable
                                                    onDragEnd={(coords) => {
                                                        setMarkerPosition({ lat: coords.lat, lng: coords.lng });
                                                        form.setValue('latitude', coords.lat);
                                                        form.setValue('longitude', coords.lng);
                                                        // Reverse geocode to find location name
                                                        handleReverseGeocode(coords.lat, coords.lng);
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
                                                </MapMarker>}
                                                <MapControls
                                                    position="top-right"
                                                    showZoom
                                                    showLocate
                                                    onLocate={(coords) => {
                                                        setMarkerPosition({ lat: coords.latitude, lng: coords.longitude });
                                                        form.setValue('latitude', coords.latitude);
                                                        form.setValue('longitude', coords.longitude);
                                                        // Reverse geocode to find location name
                                                        handleReverseGeocode(coords.latitude, coords.longitude);
                                                    }}
                                                />
                                                <MapEventListener
                                                    onLocationClick={coords => {
                                                        setMarkerPosition(coords);
                                                        setTimeout(handleReverseGeocode, 2000, coords.lat, coords.lng);
                                                        if (mapRef.current) {
                                                            mapRef.current.flyTo({
                                                                center: [coords.lng, coords.lat],
                                                                duration: 2000,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </MapComp>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Özellikler Tab */}
                        <TabsContent value="features">
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
                        </TabsContent>

                        {/* Ek Özellikler Tab */}
                        <TabsContent value="extras">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ek Özellikler</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative feature-search-container">
                                        <Input
                                            placeholder="Özellik adı aratın veya oluşturun (örn: Jakuzi, Fiber vb)..."
                                            value={featureSearchQuery}
                                            onChange={(e) => {
                                                setFeatureSearchQuery(e.target.value);
                                                setShowFeatureDropdown(true);
                                            }}
                                            onFocus={() => setShowFeatureDropdown(true)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (featureSearchQuery.trim()) {
                                                        handleAddFeature(featureSearchQuery);
                                                    }
                                                } else if (e.key === "Escape") {
                                                    setShowFeatureDropdown(false);
                                                    setFeatureSearchQuery("");
                                                }
                                            }}
                                            disabled={isCreatingFeature}
                                        />

                                        {showFeatureDropdown && featureSearchQuery.trim() && (
                                            <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto">
                                                {filteredFeatures.map((feature) => (
                                                    <div
                                                        key={feature.id}
                                                        onClick={() => {
                                                            setSelectedFeatures((prev) => new Map(prev).set(feature.id, true));
                                                            setFeatureSearchQuery("");
                                                            setShowFeatureDropdown(false);
                                                        }}
                                                        className="px-4 py-2 hover:bg-muted cursor-pointer transition-colors text-sm"
                                                    >
                                                        {feature.name}
                                                    </div>
                                                ))}

                                                {!exactMatch && featureSearchQuery.length >= 2 && (
                                                    <div
                                                        onClick={() => handleAddFeature(featureSearchQuery)}
                                                        className="px-4 py-2 bg-accent hover:bg-accent/80 cursor-pointer border-t transition-colors text-sm"
                                                    >
                                                        {isCreatingFeature ? (
                                                            <span className="flex items-center gap-2">
                                                                <IconLoader2 className="size-4 animate-spin" />
                                                                Oluşturuluyor...
                                                            </span>
                                                        ) : (
                                                            <span>+ "{featureSearchQuery}" oluştur ve ekle</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {selectedFeaturesWithNames.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedFeaturesWithNames.map((feature) => {
                                                    const isCategoryFeature = categoryFeatureIds.has(feature.id);
                                                    return (
                                                        <Badge
                                                            key={feature.id}
                                                            variant={feature.value ? "default" : "outline"}
                                                            className="px-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() => toggleFeatureValue(feature.id)}
                                                        >
                                                            {feature.value && (
                                                                <IconCheck className="size-3 mr-1" />
                                                            )}
                                                            {feature.name}
                                                            {!isCategoryFeature && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeFeature(feature.id);
                                                                    }}
                                                                    className="ml-1 hover:bg-muted/50 rounded-sm p-0.5 transition-colors"
                                                                >
                                                                    <IconX className="size-3" />
                                                                </button>
                                                            )}
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Medya Tab */}
                        <TabsContent value="media">
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
                        </TabsContent>
                    </Tabs>

                    {/* Submit */}
                    <div className="flex justify-end gap-4 mt-6">
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
