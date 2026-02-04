import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconTrash } from "@tabler/icons-react";
import type { CategoryFormValues } from "@/lib/validations/category";
import { categoryFormSchema } from "@/lib/validations/category";
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

export interface CategoryFormInitialData extends CategoryFormValues {
    id: string;
}

interface CategoryOption {
    id: string;
    name: string;
    parentId: string | null;
}

interface CategoryFormProps {
    mode: "create" | "edit";
    initialData?: CategoryFormInitialData;
    categories: CategoryOption[];
    onSubmit: (data: CategoryFormValues) => Promise<void>;
    onCancel: () => void;
    onDelete?: () => Promise<void>;
}

interface CategorySelectItemsProps {
    categories: CategoryOption[];
    parentId?: string | null;
    depth?: number;
}

function SelectCategorySubItems({ categories, parentId = null, depth = 0 }: CategorySelectItemsProps) {
    const children = categories.filter(c => c.parentId === parentId);
    if (children.length === 0) return null;

    return children.map((category) => {
        const hasChild = categories.some(c => c.parentId === category.id);
        const indent = "\u00A0\u00A0".repeat(depth);

        return (
            <React.Fragment key={category.id}>
                <SelectItem
                    value={category.id}
                    className={hasChild ? "font-semibold" : ""}
                    style={{ paddingLeft: `${(depth * 12) + 8}px` }}
                >
                    {indent}{category.name}
                </SelectItem>
                <SelectCategorySubItems
                    categories={categories}
                    parentId={category.id}
                    depth={depth + 1}
                />
            </React.Fragment>
        );
    });
}

export function CategoryForm({
    mode,
    initialData,
    categories,
    onSubmit,
    onCancel,
    onDelete,
}: CategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Filter out current category and its descendants from parent options (to prevent circular references)
    const availableParents = React.useMemo(() => {
        if (mode === "create" || !initialData) {
            // For create, show all categories
            return categories;
        }
        // For edit, exclude current category and its descendants
        const getDescendantIds = (parentId: string): string[] => {
            const children = categories.filter((cat) => cat.parentId === parentId);
            return children.flatMap((child) => [child.id, ...getDescendantIds(child.id)]);
        };
        const excludeIds = new Set([initialData.id, ...getDescendantIds(initialData.id)]);
        return categories.filter((cat) => !excludeIds.has(cat.id));
    }, [categories, mode, initialData]);

    const form = useForm<CategoryFormValues>({
        // @ts-expect-error - Zod v4 type compatibility issue with @hookform/resolvers
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            parentId: initialData?.parentId ?? null,
        },
    });

    const handleFormSubmit = async (data: CategoryFormValues) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
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

    const pageTitle = mode === "create" ? "Kategori Ekle" : "Kategori Düzenle";
    const submitButtonText =
        mode === "create"
            ? isSubmitting
                ? "Kaydediliyor..."
                : "Kategori Ekle"
            : isSubmitting
                ? "Kaydediliyor..."
                : "Değişiklikleri Kaydet";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{pageTitle}</h1>
                </div>
                {mode === "edit" && onDelete && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                <IconTrash className="size-4" />
                                {isDeleting ? "Siliniyor..." : "Kategoriyi Sil"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Bu kategoriyi silmek istediğinizden emin misiniz? Alt kategorileri
                                    olan kategoriler silinemez.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>
                                    İptal
                                </AlertDialogCancel>
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
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Kategori Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori Adı *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: Daire" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="parentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kategori</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value === "none" ? null : value)
                                            }
                                            value={field.value ?? "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Üst kategori seçin (opsiyonel)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">Ana Kategori</SelectItem>
                                                <SelectCategorySubItems categories={availableParents} />
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
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
