import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect, useMemo, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CommandPalette from "@/components/CommandPalette";
import MobileFAB from "@/components/MobileFAB";
import { preloadImages, getProjectThumbnails } from "@/lib/imagePreloader";
import Preloader from "@/components/Preloader";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <CommandPalette />
      <MobileFAB />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const isDesktopChrome = useMemo(() => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    const isChromeLike = /(Chrome|CriOS)/.test(ua) && !/(Edg|OPR|Opera)/.test(ua);
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    return isChromeLike && !isMobileUA;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent || "";
    const isChromeLike = /(Chrome|CriOS)/.test(ua) && !/(Edg|OPR|Opera)/.test(ua);
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    if (isChromeLike) {
      document.body.classList.add("chrome-safe");
      if (!isMobileUA) {
        document.body.classList.add("chrome-desktop-safe");
      }
    }
    return () => {
      document.body.classList.remove("chrome-safe");
      document.body.classList.remove("chrome-desktop-safe");
    };
  }, []);

  useEffect(() => {
    // Defer non-critical thumbnail preloading to idle time to improve initial paint/LCP.
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const startPreload = () => {
      const thumbnails = getProjectThumbnails();
      preloadImages(thumbnails);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number }).requestIdleCallback(
        () => startPreload(),
        { timeout: 2000 }
      );
    } else {
      timeoutId = window.setTimeout(startPreload, 1200);
    }

    return () => {
      if (idleId !== null && typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showPreloader && (
          <Preloader
            onDone={() => setShowPreloader(false)}
            enterDurationMs={isDesktopChrome ? 520 : 400}
            exitAfterMs={isDesktopChrome ? 900 : undefined}
            exitDurationMs={isDesktopChrome ? 320 : 250}
          />
        )}
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
};
    

export default App;