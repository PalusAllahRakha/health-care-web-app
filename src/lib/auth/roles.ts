import type { UserRole } from "@/types";

export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case "provider":
      return "/provider/patients";
    case "admin":
      return "/admin/overview";
    default:
      return "/dashboard";
  }
}

export function getProfilePath(role: UserRole): string {
  switch (role) {
    case "provider":
      return "/provider/profile";
    case "admin":
      return "/admin/profile";
    default:
      return "/profile";
  }
}
