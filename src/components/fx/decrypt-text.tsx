import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./use-fine-pointer";

const GLYPHS = "0x8A#@!%$&*<>/\\{}[]01ABCDEF+=~^";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div" | "p";
  /** ms between decoded characters */
  speed?: number;
  start?: boolean;
};

/** Scrambles into existence: random glyphs rapidly decode into the real text. */
export function DecryptText({ text, className, as = "span", speed = 26, start }: Props) {
  const Tag = as;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [output, setOutput] = useState(reduced ? text : "");
  const [active, setActive] = useState(Boolean(start));

  useEffect(() => {
    if (start !== undefined) { setActive(start); return; }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [start]);

  useEffect(() => {
    if (!active) return;
    if (reduced) { setOutput(text); return; }
    let revealed = 0;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame % 2 === 0) revealed += 1;
      if (revealed > text.length) { setOutput(text); window.clearInterval(id); return; }
      const scrambled = text
        .split("")
        .map((char, index) => {
          if (index < revealed || char === " ") return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      setOutput(scrambled);
    }, speed);
    return () => window.clearInterval(id);
  }, [active, reduced, speed, text]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden="true">{output || text.replace(/[^ ]/g, "\u00A0")}</span>
    </Tag>
  );
}
