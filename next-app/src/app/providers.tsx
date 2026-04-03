"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/components/common/SmoothScroll";
import CustomCursor from "@/components/common/CustomCursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SmoothScroll>
        <CustomCursor />
        <AuthProvider>
          {children}
        </AuthProvider>
      </SmoothScroll>
    </ThemeProvider>
  );
}
