import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 🔁 Kembalikan user ke dashboard sesuai perannya
export const getDashboardPath = (userRole: "candidate" | "company_admin" | null) => {
  if (userRole === "candidate") return "/app/u/dashboard";
  if (userRole === "company_admin") return "/app/c/dashboard";
  return "/";
};
