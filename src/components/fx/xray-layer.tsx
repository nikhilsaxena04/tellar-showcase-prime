import { useEffect, useRef, type ReactNode } from "react";

import { useFinePointer } from "./use-fine-pointer";

type Props = { children: ReactNode; radius?: number };

/**
 * Flashlight reveal: renders a hidden vibrant layer that is only visible inside a
 * soft circular mask following the cursor across the nearest positioned ancestor.
 */
export function XRayLayer({ children, radius = 190 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer();

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    const host = node?.parentElement;
    if (!node || !host) return;
    let raf = 0;

    const apply = (x: number, y: number) => {
      const mask = `radial-gradient(${radius}px circle at ${x}px ${y}px, #000 0%, rgba(0,0,0,0.75) 45%, transparent 72%)`;
      node.style.setProperty("mask-image", mask);
    };
    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { node.style.opacity = "1"; apply(x, y); });
    };
    const onLeave = () => { node.style.opacity = "0"; };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, radius]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
      style={{ maskImage: "radial-gradient(0px circle at 50% 50%, #000, transparent)" }}
    >
      {children}
    </div>
  );
}
