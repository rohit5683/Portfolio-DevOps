"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/components/common/SmoothScroll";
import CustomCursor from "@/components/common/CustomCursor";
import SplashScreen from "@/components/common/SplashScreen";
import NavigationLoader from "@/components/common/NavigationLoader";
import { AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationHandler({ showSplash, isMounted }: { showSplash: boolean, isMounted: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const prevPathname = React.useRef(pathname);

  // Detect route change
  React.useEffect(() => {
    if (!showSplash && isMounted) {
      if (prevPathname.current !== pathname) {
        setIsNavigating(true);
        const timeout = setTimeout(() => setIsNavigating(false), 2000); 
        prevPathname.current = pathname;
        return () => clearTimeout(timeout);
      }
    } else {
      prevPathname.current = pathname;
    }
  }, [pathname, searchParams, showSplash, isMounted]);

  return <NavigationLoader isVisible={!showSplash && isNavigating} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AnimatePresence mode="wait">
        {showSplash && isMounted && (
          <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <React.Suspense fallback={null}>
        <NavigationHandler showSplash={showSplash} isMounted={isMounted} />
      </React.Suspense>

      <SmoothScroll>
        <CustomCursor />
        <AuthProvider>
          {children}
        </AuthProvider>
      </SmoothScroll>
    </ThemeProvider>
  );
}
