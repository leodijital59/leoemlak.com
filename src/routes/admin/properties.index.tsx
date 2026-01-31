import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import * as React from "react";
import { toast } from "sonner";
import {
    IconDotsVertical,
    IconEdit,
    IconTrash,
    IconPlus,
    IconSearch,
} from "@tabler/icons-react";

import { getProperties, deleteProperty } from "@/lib/server/property";
import {
    propertyTypeOptions,
    listingStatusOptions,
} from "@/lib/validations/property";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/properties/")({
    component: PropertiesListPage,
    loader: async () => {
        return await getProperties();
    },
});

function formatPrice(price: string | null): string {
    if (!price) return "-";
    const num = parseFloat(price);
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0,
    }).format(num);
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function getPropertyTypeLabel(value: string): string {
    const option = propertyTypeOptions.find((opt) => opt.value === value);
    return option?.label ?? value;
}

function getStatusLabel(value: string): string {
    const option = listingStatusOptions.find((opt) => opt.value === value);
    return option?.label ?? value;
}

function PropertiesListPage() {
    const properties = Route.useLoaderData();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [propertyToDelete, setPropertyToDelete] = React.useState<number | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Filter properties by search query
    const filteredProperties = React.useMemo(() => {
        if (!searchQuery.trim()) return properties;
        const query = searchQuery.toLowerCase();
        return properties.filter(({ property }) =>
            property.title.toLowerCase().includes(query)
        );
    }, [properties, searchQuery]);

    const handleDeleteClick = (propertyId: number) => {
        setPropertyToDelete(propertyId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!propertyToDelete) return;

        setIsDeleting(true);
        try {
            await deleteProperty({ data: propertyToDelete });
            toast.success("İlan başarıyla silindi.");
            router.invalidate();
        } catch (error) {
            console.error("Error deleting property:", error);
            toast.error("İlan silinirken bir hata oluştu.");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setPropertyToDelete(null);
        }
    };

    const getMainImage = (images: typeof properties[0]["images"]): string | null => {
        const mainImage = images.find((img) => img.isMainImage);
        if (mainImage) return mainImage.url;
        if (images.length > 0) return images[0].url;
        return null;
    };

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">İlanlar</h1>
                    <p className="text-muted-foreground">
                        Tüm emlak ilanlarını görüntüleyin ve yönetin.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/admin/properties/add">
                        <IconPlus className="size-4" />
                        Yeni İlan Ekle
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="İlan ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Fotoğraf</TableHead>
                            <TableHead>Başlık</TableHead>
                            <TableHead>Tip</TableHead>
                            <TableHead>Konum</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="w-[80px]">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProperties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    {searchQuery
                                        ? "Arama kriterlerine uygun ilan bulunamadı."
                                        : "Henüz ilan bulunmuyor."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProperties.map(({ property, images }) => {
                                const mainImage = getMainImage(images);
                                return (
                                    <TableRow key={property.id}>
                                        {/* Thumbnail */}
                                        <TableCell>
                                            <div className="size-12 overflow-hidden rounded-md bg-muted">
                                                {mainImage ? (
                                                    <img
                                                        src={mainImage}
                                                        alt={property.title}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                                                        Yok
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Title */}
                                        <TableCell className="font-medium max-w-[200px]">
                                            <span className="line-clamp-2" title={property.title}>
                                                {property.title}
                                            </span>
                                        </TableCell>

                                        {/* Property Type */}
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {getPropertyTypeLabel(property.propertyType)}
                                            </Badge>
                                        </TableCell>

                                        {/* Location */}
                                        <TableCell>
                                            {property.province}, {property.district}
                                        </TableCell>

                                        {/* Price */}
                                        <TableCell className="font-medium">
                                            {formatPrice(property.price)}
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    property.listingStatus === "active"
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {getStatusLabel(property.listingStatus)}
                                            </Badge>
                                        </TableCell>

                                        {/* Date */}
                                        <TableCell className="text-muted-foreground">
                                            {formatDate(new Date(property.createdAt))}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon-sm">
                                                        <IconDotsVertical className="size-4" />
                                                        <span className="sr-only">İşlemler</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            toast.info("Düzenleme sayfası yakında eklenecek.");
                                                        }}
                                                    >
                                                        <IconEdit className="size-4" />
                                                        Düzenle
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        onClick={() => handleDeleteClick(property.id)}
                                                    >
                                                        <IconTrash className="size-4" />
                                                        Sil
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isDeleting ? "Siliniyor..." : "Sil"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
