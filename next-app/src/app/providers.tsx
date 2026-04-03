"use client";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/components/common/SmoothScroll";
import CustomCursor from "@/components/common/CustomCursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll>
        <CustomCursor />
        <AuthProvider>
          {children}
        </AuthProvider>
      </SmoothScroll>
    </>
  );
}
