import { useEffect, useRef, useState } from "react";

/**
 * useScrollAnimation — reveals an element when it scrolls into view.
 *
 * Runs on ALL browsers (including desktop Chrome) using a single
 * IntersectionObserver. A safety timeout guarantees content is never left
 * hidden if the observer misfires, and reduced-motion users get instant reveal.
 */
export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    // Already in view on mount → reveal right away.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setIsVisible(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);

    // Safety net: never leave content invisible.
    const failSafe = window.setTimeout(reveal, 1600);

    return () => {
      observer.disconnect();
      window.clearTimeout(failSafe);
    };
  }, []);

  return { ref, isVisible };
};
