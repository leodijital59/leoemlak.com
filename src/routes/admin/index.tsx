import { Link, createFileRoute } from '@tanstack/react-router'
import { CategoryChart } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { getDashboardStats } from "@/lib/server/property"
import { listingStatusOptions } from "@/lib/validations/property"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const Route = createFileRoute('/admin/')({
  component: AdminDashboardPage,
  ssr: "data-only",
  staticData: {
    title: "Giriş",
  },
  loader: async () => {
    return await getDashboardStats();
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

function AdminDashboardPage() {
  const stats = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards
        totalProperties={stats.totalProperties}
        activeProperties={stats.activeProperties}
        totalCategories={stats.totalCategories}
        totalFeatures={stats.totalFeatures}
      />
      <div className="px-4 lg:px-6">
        <CategoryChart data={stats.byCategory} />
      </div>
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Son Eklenen İlanlar</h2>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Fotoğraf</TableHead>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Konum</TableHead>
                  <TableHead>Fiyat</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Henüz ilan bulunmuyor.
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <Link
                          className="block size-10 overflow-hidden rounded-md bg-muted"
                          to="/admin/properties/$propertyId/edit"
                          params={{ propertyId: property.id }}
                        >
                          {property.imageUrl ? (
                            <img
                              src={property.imageUrl}
                              alt={property.title}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                              -
                            </div>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <Link
                          className="line-clamp-1 hover:underline"
                          title={property.title}
                          to="/admin/properties/$propertyId/edit"
                          params={{ propertyId: property.id }}
                        >
                          {property.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {property.categoryName ?? "-"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {property.province}, {property.district}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(property.price)}
                      </TableCell>
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
                      <TableCell className="text-muted-foreground">
                        {formatDate(new Date(property.createdAt))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
