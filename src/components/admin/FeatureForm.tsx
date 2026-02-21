import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconTrash } from "@tabler/icons-react";
import type { FeatureFormValues } from "@/lib/validations/feature";
import { featureFormSchema } from "@/lib/validations/feature";
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
import { HeaderActionsSlot } from "@/components/header-actions";

export interface FeatureFormInitialData extends FeatureFormValues {
    id: string;
}

interface FeatureFormProps {
    mode: "create" | "edit";
    initialData?: FeatureFormInitialData;
    usageCount?: number;
    onSubmit: (data: FeatureFormValues) => Promise<void>;
    onCancel: () => void;
    onDelete?: () => Promise<void>;
}

export function FeatureForm({
    mode,
    initialData,
    usageCount = 0,
    onSubmit,
    onCancel,
    onDelete,
}: FeatureFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const form = useForm<FeatureFormValues>({
        resolver: zodResolver(featureFormSchema),
        defaultValues: {
            name: initialData?.name ?? "",
        },
    });

    const handleFormSubmit = async (data: FeatureFormValues) => {
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

    const submitButtonText =
        mode === "create"
            ? isSubmitting
                ? "Kaydediliyor..."
                : "Özellik Ekle"
            : isSubmitting
                ? "Kaydediliyor..."
                : "Değişiklikleri Kaydet";

    return (
        <div className="flex flex-col gap-6 p-4 md:p-6">
            <HeaderActionsSlot>
                {(mode === "edit" && onDelete) && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" disabled={isDeleting}>
                                <IconTrash className="size-4" />
                                {isDeleting ? "Siliniyor..." : "Özelliği Sil"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Özelliği Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {usageCount > 0 ? (
                                        <>
                                            Bu özellik <strong>{usageCount} ilana</strong> bağlı.
                                            Silmek istediğinizden emin misiniz? Bu işlem özelliği
                                            tüm ilanlardan kaldıracaktır.
                                        </>
                                    ) : (
                                        "Bu özelliği silmek istediğinizden emin misiniz?"
                                    )}
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
            </HeaderActionsSlot>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Özellik Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Özellik Adı *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Örn: Balkon" {...field} />
                                        </FormControl>
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
