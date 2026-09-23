import { useEffect, useRef, type ReactNode } from "react";

import { useFinePointer } from "./use-fine-pointer";

/**
 * Snapshot trail: moving the cursor across the area drops rapid-fire tiles that
 * follow the pointer and fade out. Cursor also drives a liquid ripple via CSS vars.
 */
export function ImageTrail({ labels, children, className }: { labels: string[]; children: ReactNode; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const enabled = useFinePointer();

  useEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    if (!host) return;
    let last = { x: 0, y: 0 };
    let index = 0;
    let seeded = false;

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      host.style.setProperty("--trail-x", `${x}px`);
      host.style.setProperty("--trail-y", `${y}px`);
      if (!seeded) { last = { x, y }; seeded = true; }
      if (Math.hypot(x - last.x, y - last.y) < 70) return;
      last = { x, y };

      const tile = document.createElement("span");
      tile.className = "trail-tile";
      tile.textContent = labels[index % labels.length] ?? "";
      index += 1;
      tile.style.left = `${x}px`;
      tile.style.top = `${y}px`;
      tile.style.setProperty("--tilt", `${(Math.random() - 0.5) * 22}deg`);
      host.appendChild(tile);
      window.setTimeout(() => tile.remove(), 900);
    };

    host.addEventListener("pointermove", onMove);
    return () => { host.removeEventListener("pointermove", onMove); };
  }, [enabled, labels]);

  return (
    <div ref={hostRef} className={`relative ${className ?? ""}`}>
      {children}
    </div>
  );
}
