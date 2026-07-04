import { useCallback, useEffect, useRef } from "react";

/**
 * useTiltCard — a single, rAF-throttled 3D parallax tilt + mouse-tracking
 * spotlight interaction. Shared by every premium glass-card so the effect is
 * consistent and performant (one transform write per animation frame, no React
 * re-renders on mouse move).
 *
 * Pair with the `.glass-card` + `.card-spotlight` CSS in index.css.
 * The effect auto-disables on touch / coarse pointers and when the user
 * prefers reduced motion.
 */
export function useTiltCard(maxTilt = 8) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const spotRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const enabled = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      enabled.current = fine.matches && !reduced.matches;
    };
    update();
    fine.addEventListener?.("change", update);
    reduced.addEventListener?.("change", update);
    return () => {
      fine.removeEventListener?.("change", update);
      reduced.removeEventListener?.("change", update);
    };
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card || !enabled.current) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        if (spotRef.current) spotRef.current.style.opacity = "1";
      });
    },
    [maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    if (spotRef.current) spotRef.current.style.opacity = "0";
  }, []);

  return { cardRef, spotRef, onMouseMove, onMouseLeave };
}

export default useTiltCard;
