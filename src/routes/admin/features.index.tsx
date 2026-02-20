import { Link, createFileRoute } from "@tanstack/react-router";
import {
    IconEdit,
    IconPlus,
} from "@tabler/icons-react";
import { HeaderActionsSlot } from "@/components/header-actions";

import { getFeatures } from "@/lib/server/feature";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/features/")({
    component: FeaturesListPage,
    staticData: {
        title: "Özellikler",
    },
    loader: async () => {
        return await getFeatures();
    },
});

function FeaturesListPage() {
    const features = Route.useLoaderData();

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <HeaderActionsSlot>
                <Button asChild size="sm">
                    <Link to="/admin/features/create">
                        <IconPlus className="size-4" />
                        Özellik Ekle
                    </Link>
                </Button>
            </HeaderActionsSlot>

            {/* Table */}
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Özellik Adı</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {features.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    Henüz özellik bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            features.map((feature) => (
                                <TableRow key={feature.id}>
                                    <TableCell>
                                        <Link
                                            className="flex items-center gap-2"
                                            to="/admin/features/$featureId/edit"
                                            params={{ featureId: feature.id }}
                                        >
                                            <span className="font-medium">{feature.name}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link
                                                to="/admin/features/$featureId/edit"
                                                params={{ featureId: feature.id }}
                                            >
                                                <IconEdit className="size-4" />
                                                Düzenle
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
