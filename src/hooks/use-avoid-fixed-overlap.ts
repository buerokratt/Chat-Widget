import { RefObject, useEffect, useRef, useState } from "react";

const GAP_PX = 12;

const isVisible = (style: CSSStyleDeclaration): boolean =>
  style.display !== "none" &&
  style.visibility !== "hidden" &&
  parseFloat(style.opacity || "1") > 0;

const computeOverlapOffset = (el: HTMLElement, currentOffset: number): number => {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return 0;

  const naturalTop = rect.top + currentOffset;
  const naturalBottom = rect.bottom + currentOffset;

  let offset = 0;

  for (const candidate of Array.from(document.body.children)) {
    if (!(candidate instanceof HTMLElement)) continue;
    if (candidate === el || candidate.contains(el) || el.contains(candidate)) continue;

    const style = window.getComputedStyle(candidate);
    if (style.position !== "fixed" || !isVisible(style)) continue;

    const candidateRect = candidate.getBoundingClientRect();
    if (candidateRect.width === 0 || candidateRect.height === 0) continue;

    const horizontalOverlap = candidateRect.left < rect.right && candidateRect.right > rect.left;
    const verticalOverlap = candidateRect.top < naturalBottom && candidateRect.bottom > naturalTop;
    if (!horizontalOverlap || !verticalOverlap) continue;

    offset = Math.max(offset, naturalBottom - candidateRect.top + GAP_PX);
  }

  return offset;
};

export const useAvoidFixedOverlap = (ref: RefObject<HTMLElement>, enabled = true): number => {
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      offsetRef.current = 0;
      setOffset(0);
      return;
    }

    let rafId: number | null = null;
    const recompute = () => {
      rafId = null;
      if (!ref.current) return;
      const next = computeOverlapOffset(ref.current, offsetRef.current);
      if (next !== offsetRef.current) {
        offsetRef.current = next;
        setOffset(next);
      }
    };
    const scheduleRecompute = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(recompute);
    };

    scheduleRecompute();

    window.addEventListener("scroll", scheduleRecompute, { passive: true, capture: true });
    window.addEventListener("resize", scheduleRecompute);

    const mutationObserver = new MutationObserver(scheduleRecompute);
    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: true,
      childList: true,
    });

    const resizeObserver = ref.current ? new ResizeObserver(scheduleRecompute) : null;
    if (ref.current && resizeObserver) resizeObserver.observe(ref.current);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleRecompute, { capture: true });
      window.removeEventListener("resize", scheduleRecompute);
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, [ref, enabled]);

  return offset;
};

export default useAvoidFixedOverlap;
