import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {IconLoader2} from "@tabler/icons-react";
import type {UpdateUserFormData} from "@/lib/validations/user";
import type {BetterAuthUser} from "@/lib/client/user";
import {EditUserForm} from "@/components/admin/UserForm";
import {banUser, getUserById, unbanUser, updateUser} from "@/lib/client/user";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export const Route = createFileRoute("/admin/users/$userId/edit")({
  component: EditUserPage,
  staticData: {
    title: "Kullanıcı Düzenle",
  },
});

function EditUserPage() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<BetterAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kullanıcı yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUser(data);
      toast.success("Kullanıcı başarıyla güncellendi");
      navigate({ to: "/admin/users" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Kullanıcı güncellenirken bir hata oluştu"
      );
      throw error;
    }
  };

  const handleBan = async (userId: string, reason: string) => {
    try {
      await banUser({
        userId,
        banReason: reason,
      });
      toast.success("Kullanıcı başarıyla yasaklandı");
      navigate({ to: "/admin/users" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Kullanıcı yasaklanırken bir hata oluştu"
      );
      throw error;
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      await unbanUser(userId);
      toast.success("Kullanıcı yasağı başarıyla kaldırıldı");
      navigate({ to: "/admin/users" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Yasak kaldırılırken bir hata oluştu"
      );
      throw error;
    }
  };

  const handleCancel = () => {
    navigate({ to: "/admin/users" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive">{error || "Kullanıcı bulunamadı"}</p>
        <Button onClick={loadUser}>Tekrar Dene</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Kullanıcı Bilgileri</CardTitle>
          <CardDescription>
            {user.email} kullanıcısının bilgilerini düzenleyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm
            initialData={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onBan={handleBan}
            onUnban={handleUnban}
          />
        </CardContent>
      </Card>
    </div>
  );
}
