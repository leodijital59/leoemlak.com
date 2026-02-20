import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  IconLoader2,
  IconUserCheck,
  IconUserOff,
} from "@tabler/icons-react";
import type { BetterAuthUser } from "@/lib/client/user";
import type {CreateUserFormData, UpdateUserFormData} from "@/lib/validations/user";
import {createUserFormSchema, updateUserFormSchema} from "@/lib/validations/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

interface CreateUserFormProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  onCancel: () => void;
}

export function CreateUserForm({
  onSubmit,
  onCancel,
}: CreateUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateUserFormData>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "user",
    },
  });

  const handleSubmit = async (data: CreateUserFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="kullanici@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Şifre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="En az 8 karakter"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İsim</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Kullanıcı adı" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Rol seçiniz" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Kullanıcı</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && (
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Kullanıcı Oluştur
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            İptal
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface EditUserFormProps {
  initialData: BetterAuthUser;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  onCancel: () => void;
  onBan: (userId: string, reason: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
}

export function EditUserForm({
  initialData,
  onSubmit,
  onCancel,
  onBan,
  onUnban,
}: EditUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [banReason, setBanReason] = useState("");

  const form = useForm<UpdateUserFormData>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      userId: initialData.id,
      name: initialData.name,
      role: initialData.role as "user" | "admin",
    },
  });

  const handleSubmit = async (data: UpdateUserFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBan = async () => {
    if (!banReason.trim()) return;

    setIsBanning(true);
    try {
      await onBan(initialData.id, banReason);
      setShowBanDialog(false);
    } finally {
      setIsBanning(false);
    }
  };

  const handleUnban = async () => {
    setIsUnbanning(true);
    try {
      await onUnban(initialData.id);
      setShowUnbanDialog(false);
    } finally {
      setIsUnbanning(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Email Field (Read-only) */}
          <div className="space-y-2">
            <FormLabel>E-posta</FormLabel>
            <Input value={initialData.email} disabled />
          </div>

          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İsim</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Kullanıcı adı" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role Field */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Rol seçiniz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">Kullanıcı</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* User Status */}
          <div className="space-y-2">
            <FormLabel>Durum</FormLabel>
            <div className="flex items-center gap-2">
              <Badge variant={initialData.banned ? "destructive" : "default"}>
                {initialData.banned ? "Yasaklı" : "Aktif"}
              </Badge>
              {initialData.banned && initialData.banReason && (
                <span className="text-sm text-muted-foreground">
                  Neden: {initialData.banReason}
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Değişiklikleri Kaydet
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              İptal
            </Button>
          </div>

          {/* Ban/Unban Actions */}
          <div className="pt-4 border-t">
            {!initialData.banned ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowBanDialog(true)}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <IconUserOff className="mr-2 h-4 w-4" />
                Kullanıcıyı Yasakla
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUnbanDialog(true)}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <IconUserCheck className="mr-2 h-4 w-4" />
                Yasağı Kaldır
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Ban Confirmation Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Yasakla</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kullanıcıyı yasaklamak istediğinizden emin misiniz? Kullanıcı
              sistemde oturum açamayacak.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Yasaklama Nedeni
            </label>
            <Textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Yasaklama nedenini giriniz..."
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBanning}>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBan}
              disabled={isBanning || !banReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBanning && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yasakla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unban Confirmation Dialog */}
      <AlertDialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yasağı Kaldır</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kullanıcının yasağını kaldırmak istediğinizden emin misiniz?
              Kullanıcı tekrar sistemde oturum açabilecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnbanning}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnban} disabled={isUnbanning}>
              {isUnbanning && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yasağı Kaldır
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
