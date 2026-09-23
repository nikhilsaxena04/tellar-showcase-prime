import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { useFinePointer } from "./use-fine-pointer";

/**
 * Pins the viewport and converts vertical scroll into a smooth sideways glide
 * through the slides, then releases back to normal vertical scrolling.
 * Falls back to a plain vertical stack on touch / narrow / reduced-motion.
 */
export function HorizontalGallery({ slides, header }: { slides: ReactNode[]; header: ReactNode }) {
  const enabled = useFinePointer();

  if (!enabled) {
    return (
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {header}
        <div className="mt-12 grid gap-5 md:grid-cols-2">{slides}</div>
      </div>
    );
  }
  return <PinnedTrack slides={slides} header={header} />;
}

function PinnedTrack({ slides, header }: { slides: ReactNode[]; header: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 40));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [slides.length]);

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progress = useTransform(smooth, [0, 1], ["0%", "100%"]);

  return (
    <div ref={wrapperRef} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">{header}</div>
        <motion.div ref={trackRef} style={{ x }} className="mt-10 flex w-max items-stretch gap-6 pl-5 lg:pl-8">
          {slides.map((slide, index) => (
            <div key={index} className="w-[26rem] shrink-0 xl:w-[30rem]">{slide}</div>
          ))}
          <div className="flex w-[20rem] shrink-0 items-center pr-10 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            end of gallery — keep scrolling
          </div>
        </motion.div>
        <div className="mx-auto mt-10 h-px w-[calc(100%-2.5rem)] max-w-7xl bg-border">
          <motion.div style={{ width: progress }} className="h-px bg-primary" />
        </div>
      </div>
    </div>
  );
}
