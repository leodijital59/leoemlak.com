import type {
  BanUserFormData,
  CreateUserFormData,
  UpdateUserFormData,
} from "../validations/user";
import { authClient } from "@/auth";

// User data structure from Better Auth
export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// List users response
export interface ListUsersResponse {
  users: BetterAuthUser[];
  total: number;
}

// List users options
export interface ListUsersOptions {
  search?: string;
  role?: string;
  limit?: number;
  offset?: number;
}

// List all users
export async function listUsers(
  options: ListUsersOptions = {}
): Promise<ListUsersResponse> {
  try {
    const query: Record<string, any> = {};

    // Add search filter
    if (options.search) {
      query.search = options.search;
    }

    // Add role filter
    if (options.role && options.role !== "all") {
      query.role = options.role;
    }

    // Add pagination
    if (options.limit) {
      query.limit = options.limit;
    }
    if (options.offset) {
      query.offset = options.offset;
    }

    const result = await authClient.admin.listUsers({
      query,
    });

    return {
      users: (result.data?.users || []) as BetterAuthUser[],
      total: result.data?.total || 0,
    };
  } catch (error) {
    console.error("List users error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kullanıcılar yüklenemedi"
    );
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<BetterAuthUser> {
  try {
    const result = await authClient.admin.getUser({
      query: {
        id: userId,
      },
    });

    if (!result.data) {
      throw new Error("Kullanıcı bulunamadı");
    }

    return result.data as unknown as BetterAuthUser;
  } catch (error) {
    console.error("Get user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kullanıcı yüklenemedi"
    );
  }
}

// Create new user
export async function createUser(data: CreateUserFormData) {
  try {
    const result = await authClient.admin.createUser({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    });

    if (result.error) {
      throw new Error(result.error.message || "Kullanıcı oluşturulamadı");
    }

    return result.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kullanıcı oluşturulamadı"
    );
  }
}

// Update user
export async function updateUser(data: UpdateUserFormData) {
  try {
    // Update name
    await authClient.admin.updateUser({
      userId: data.userId,
      data: {
        name: data.name,
      },
    });

    // Update role
    const roleResult = await authClient.admin.setRole({
      userId: data.userId,
      role: data.role,
    });

    if (roleResult.error) {
      throw new Error(roleResult.error.message || "Rol güncellenemedi");
    }

    return roleResult.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kullanıcı güncellenemedi"
    );
  }
}

// Ban user
export async function banUser(data: BanUserFormData) {
  try {
    const result = await authClient.admin.banUser({
      userId: data.userId,
      banReason: data.banReason,
      banExpiresIn: data.banExpiresIn,
    });

    if (result.error) {
      throw new Error(result.error.message || "Kullanıcı yasaklanamadı");
    }

    return result.data;
  } catch (error) {
    console.error("Ban user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kullanıcı yasaklanamadı"
    );
  }
}

// Unban user
export async function unbanUser(userId: string) {
  try {
    const result = await authClient.admin.unbanUser({
      userId,
    });

    if (result.error) {
      throw new Error(result.error.message || "Yasak kaldırılamadı");
    }

    return result.data;
  } catch (error) {
    console.error("Unban user error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Yasak kaldırılamadı"
    );
  }
}
