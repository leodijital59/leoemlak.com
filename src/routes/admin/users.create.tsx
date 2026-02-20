import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { CreateUserFormData } from "@/lib/validations/user";
import { CreateUserForm } from "@/components/admin/UserForm";
import { createUser } from "@/lib/client/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/admin/users/create")({
  component: CreateUserPage,
  staticData: {
    title: "Kullanıcı Ekle",
  },
});

function CreateUserPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateUserFormData) => {
    try {
      await createUser(data);
      toast.success("Kullanıcı başarıyla oluşturuldu");
      navigate({ to: "/admin/users" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Kullanıcı oluşturulurken bir hata oluştu"
      );
      throw error;
    }
  };

  const handleCancel = () => {
    navigate({ to: "/admin/users" });
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yeni Kullanıcı</h1>
        <p className="text-muted-foreground">
          Sisteme yeni bir kullanıcı ekleyin
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Kullanıcı Bilgileri</CardTitle>
          <CardDescription>
            Yeni kullanıcının e-posta, şifre ve rol bilgilerini giriniz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
