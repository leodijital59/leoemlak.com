import { Link, createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
    IconEdit,
    IconPlus,
    IconSearch,
} from "@tabler/icons-react";

import { getProperties } from "@/lib/server/property";
import { listingStatusOptions } from "@/lib/validations/property";
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

export const Route = createFileRoute("/admin/properties/")({
    component: PropertiesListPage,
    staticData: {
        title: "İlanlar"
    },
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

function getStatusLabel(value: string): string {
    const option = listingStatusOptions.find((opt) => opt.value === value);
    return option?.label ?? value;
}

function PropertiesListPage() {
    const properties = Route.useLoaderData();
    const [searchQuery, setSearchQuery] = React.useState("");

    // Filter properties by search query
    const filteredProperties = React.useMemo(() => {
        if (!searchQuery.trim()) return properties;
        const query = searchQuery.toLowerCase();
        return properties.filter(({ property }) =>
            property.title.toLowerCase().includes(query)
        );
    }, [properties, searchQuery]);

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
                    <Link to="/admin/properties/create">
                        <IconPlus className="size-4" />
                        İlan Ekle
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
                            <TableHead>Kategori</TableHead>
                            <TableHead>Konum</TableHead>
                            <TableHead>Fiyat</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
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
                            filteredProperties.map(({ property, images, category }) => {
                                const mainImage = getMainImage(images);
                                return (
                                    <TableRow key={property.id}>
                                        {/* Thumbnail */}
                                        <TableCell>
                                            <Link className="block size-12 overflow-hidden rounded-md bg-muted" to="/admin/properties/$propertyId/edit" params={{ propertyId: property.id }}>
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
                                            </Link>
                                        </TableCell>

                                        {/* Title */}
                                        <TableCell className="font-medium max-w-[200px]">
                                            <Link className="line-clamp-2 hover:underline" title={property.title} to="/admin/properties/$propertyId/edit" params={{ propertyId: property.id }}>
                                                {property.title}
                                            </Link>
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {category?.name ?? "-"}
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
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link to="/admin/properties/$propertyId/edit" params={{ propertyId: property.id }}>
                                                    <IconEdit className="size-4" />
                                                    Düzenle
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}