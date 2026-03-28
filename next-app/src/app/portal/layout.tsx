"use client";
import React from "react";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/portal/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
