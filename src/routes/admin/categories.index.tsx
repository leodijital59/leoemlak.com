import { Link, createFileRoute } from "@tanstack/react-router";
import {
    IconChevronRight,
    IconEdit,
    IconPlus,
} from "@tabler/icons-react";

import type {CategoryTreeItem} from "@/lib/server/category";
import {  getCategoryTree } from "@/lib/server/category";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/categories/")({
    component: CategoriesListPage,
    staticData: {
        title: "Kategoriler",
    },
    loader: async () => {
        return await getCategoryTree();
    },
});

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

function CategoryRow({
    category,
    level = 0,
}: {
    category: CategoryTreeItem;
    level?: number;
}) {
    return (
        <>
            <TableRow>
                <TableCell>
                    <Link
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${level * 24}px` }}
                        to="/admin/categories/$categoryId/edit"
                        params={{ categoryId: category.id }}
                    >
                        {level > 0 && (
                            <IconChevronRight className="size-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">{category.name}</span>
                    </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                    {formatDate(new Date(category.createdAt))}
                </TableCell>
                <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                        <Link
                            to="/admin/categories/$categoryId/edit"
                            params={{ categoryId: category.id }}
                        >
                            <IconEdit className="size-4" />
                            Düzenle
                        </Link>
                    </Button>
                </TableCell>
            </TableRow>
            {category.children.map((child) => (
                <CategoryRow key={child.id} category={child} level={level + 1} />
            ))}
        </>
    );
}

function CategoriesListPage() {
    const categories = Route.useLoaderData();

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Kategoriler</h1>
                    <p className="text-muted-foreground">
                        Emlak kategorilerini görüntüleyin ve yönetin.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/admin/categories/create">
                        <IconPlus className="size-4" />
                        Kategori Ekle
                    </Link>
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kategori Adı</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Henüz kategori bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <CategoryRow key={category.id} category={category} />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
