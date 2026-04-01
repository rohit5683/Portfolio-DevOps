"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/portal/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
