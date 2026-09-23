import { useEffect, useRef } from "react";

import { useReducedMotion } from "./use-fine-pointer";

type Body = {
  el: HTMLSpanElement;
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; r: number;
  dragging: boolean; px: number; py: number;
};

/**
 * Draggable, colliding, floating tech tags. Pure rAF physics (circle bodies) so
 * there is no heavyweight engine — mouse pushes tags away, tags bounce off each
 * other and the walls, and dragging throws them with real momentum.
 */
export function PhysicsTags({ tags }: { tags: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll<HTMLSpanElement>("[data-tag]"));
    let width = container.clientWidth;
    let height = container.clientHeight;

    const bodies: Body[] = nodes.map((el, i) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const cols = Math.max(1, Math.floor(width / (w + 24)));
      return {
        el, w, h, r: Math.max(w, h) / 2,
        x: 20 + (i % cols) * (w + 24) + w / 2,
        y: 40 + Math.floor(i / cols) * (h + 26) + h / 2,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        dragging: false, px: 0, py: 0,
      };
    });

    const mouse = { x: -9999, y: -9999 };
    let dragged: Body | null = null;

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      if (dragged) {
        dragged.px = dragged.x; dragged.py = dragged.y;
        dragged.x = mouse.x; dragged.y = mouse.y;
      }
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onDown = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest("[data-tag]");
      const body = bodies.find((b) => b.el === target);
      if (!body) return;
      body.dragging = true; dragged = body;
      body.el.setPointerCapture?.(event.pointerId);
      body.el.style.cursor = "grabbing";
    };
    const onUp = () => {
      if (!dragged) return;
      dragged.vx = (dragged.x - dragged.px) * 0.8;
      dragged.vy = (dragged.y - dragged.py) * 0.8;
      dragged.dragging = false;
      dragged.el.style.cursor = "grab";
      dragged = null;
    };

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const resize = () => { width = container.clientWidth; height = container.clientHeight; };
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let raf = 0;
    const step = () => {
      for (const body of bodies) {
        if (!body.dragging) {
          // cursor repulsion
          const dx = body.x - mouse.x;
          const dy = body.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0.01) {
            const force = (1 - dist / 120) * 2.4;
            body.vx += (dx / dist) * force;
            body.vy += (dy / dist) * force;
          }
          body.vx *= 0.975;
          body.vy *= 0.975;
          // gentle drift so they never fully settle
          body.vx += (Math.random() - 0.5) * 0.05;
          body.vy += (Math.random() - 0.5) * 0.05;
          const max = 14;
          body.vx = Math.max(-max, Math.min(max, body.vx));
          body.vy = Math.max(-max, Math.min(max, body.vy));
          body.x += body.vx;
          body.y += body.vy;
        }

        // walls
        const hw = body.w / 2;
        const hh = body.h / 2;
        if (body.x < hw) { body.x = hw; body.vx = Math.abs(body.vx) * 0.7; }
        if (body.x > width - hw) { body.x = width - hw; body.vx = -Math.abs(body.vx) * 0.7; }
        if (body.y < hh) { body.y = hh; body.vy = Math.abs(body.vy) * 0.7; }
        if (body.y > height - hh) { body.y = height - hh; body.vy = -Math.abs(body.vy) * 0.7; }
      }

      // pairwise elastic collisions
      for (let i = 0; i < bodies.length; i += 1) {
        for (let j = i + 1; j < bodies.length; j += 1) {
          const a = bodies[i]!;
          const b = bodies[j]!;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.01;
          const min = a.r + b.r;
          if (dist >= min) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = (min - dist) / 2;
          if (!a.dragging) { a.x -= nx * overlap; a.y -= ny * overlap; }
          if (!b.dragging) { b.x += nx * overlap; b.y += ny * overlap; }
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel > 0) continue;
          const impulse = rel * 0.9;
          if (!a.dragging) { a.vx += impulse * nx; a.vy += impulse * ny; }
          if (!b.dragging) { b.vx -= impulse * nx; b.vy -= impulse * ny; }
        }
      }

      for (const body of bodies) {
        const rot = Math.max(-14, Math.min(14, body.vx * 1.6));
        body.el.style.transform = `translate3d(${body.x - body.w / 2}px, ${body.y - body.h / 2}px, 0) rotate(${rot}deg)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reduced, tags]);

  if (reduced) {
    return (
      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-background/70 px-4 py-2 font-mono text-xs">{tag}</span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="glass-panel relative h-[26rem] touch-none overflow-hidden rounded-xl sm:h-[30rem]"
    >
      <div className="grid-texture pointer-events-none absolute inset-0 opacity-60" />
      <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        drag the tags · they push back
      </p>
      {tags.map((tag) => (
        <span
          key={tag}
          data-tag
          className="absolute left-0 top-0 cursor-grab select-none rounded-full border border-primary/35 bg-background/80 px-4 py-2 font-mono text-xs text-foreground shadow-lg backdrop-blur-md will-change-transform active:border-primary"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
