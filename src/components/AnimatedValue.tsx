import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

export function useSpringValue(target: number, duration = 350, enabled = true) {
  const reduced = usePrefersReducedMotion();
  const active = enabled && !reduced;
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const fromRef = useRef<number>(target);

  useEffect(() => {
    if (!active) {
      setDisplay(target);
      return;
    }
    fromRef.current = display;
    startRef.current = performance.now();
    const d = Math.max(80, duration);

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / d, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (target - fromRef.current) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, active]);

  return display;
}

export function AnimatedNumber({
  value,
  format,
  duration,
  enabled,
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
  enabled?: boolean;
}) {
  const smooth = useSpringValue(value, duration, enabled);
  return <>{format(smooth)}</>;
}
