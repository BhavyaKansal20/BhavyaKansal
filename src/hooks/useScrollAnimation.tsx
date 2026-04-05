import { useEffect, useRef, useState } from "react";

export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const ua = typeof window !== "undefined" ? window.navigator.userAgent || "" : "";
    const isDesktopChrome =
      /(Chrome|CriOS)/.test(ua) &&
      !/(Edg|OPR|Opera)/.test(ua) &&
      window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;

    // On desktop Chrome, disable scroll-reveal choreography to avoid scroll-time jank/crashes.
    if (isDesktopChrome) {
      visibleRef.current = true;
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const markVisible = () => {
      if (visibleRef.current) return;
      visibleRef.current = true;
      setIsVisible(true);
    };

    // Fallback visibility check for browsers/situations where observer callbacks can be missed.
    const checkViewport = () => {
      if (visibleRef.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.92 && rect.bottom >= 0) {
        markVisible();
        observer?.disconnect();
        window.removeEventListener("scroll", checkViewport);
        window.removeEventListener("resize", checkViewport);
      }
    };

    checkViewport();

    let observer: IntersectionObserver | null = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            markVisible();
            observer?.disconnect();
            window.removeEventListener("scroll", checkViewport);
            window.removeEventListener("resize", checkViewport);
          }
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px",
        }
      );
      observer.observe(element);
    }

    window.addEventListener("scroll", checkViewport, { passive: true });
    window.addEventListener("resize", checkViewport);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", checkViewport);
      window.removeEventListener("resize", checkViewport);
    };
  }, []);

  return { ref, isVisible };
};
