import { useEffect, useState } from "react";

/** True only for hover-capable, wide, non-reduced-motion devices. */
export function useFinePointer() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(query.matches && !reduced.matches);
    update();
    query.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);
  return ok;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
