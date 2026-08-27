import { RefObject, useEffect, useRef, useState } from "react";

const GAP_PX = 12;

const isVisible = (style: CSSStyleDeclaration): boolean =>
  style.display !== "none" &&
  style.visibility !== "hidden" &&
  parseFloat(style.opacity || "1") > 0;

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

const getNaturalRect = (el: HTMLElement): Rect => {
  const style = window.getComputedStyle(el);
  const marginRight = parseFloat(style.marginRight) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  const right = window.innerWidth - marginRight;
  const bottom = window.innerHeight - marginBottom;
  return { top: bottom - height, bottom, left: right - width, right, width, height };
};

const computeOverlapOffset = (el: HTMLElement): number => {
  const rect = getNaturalRect(el);
  if (rect.width === 0 || rect.height === 0) return 0;

  const points: Array<[number, number]> = [
    [rect.left + 1, rect.top + 1],
    [rect.right - 1, rect.top + 1],
    [rect.left + 1, rect.bottom - 1],
    [rect.right - 1, rect.bottom - 1],
    [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2],
  ];

  let offset = 0;
  const checked = new Set<Element>();

  for (const [x, y] of points) {
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;

    for (const candidate of document.elementsFromPoint(x, y)) {
      if (checked.has(candidate) || !(candidate instanceof HTMLElement)) continue;
      checked.add(candidate);
      if (candidate === el || candidate.contains(el) || el.contains(candidate)) continue;

      const style = window.getComputedStyle(candidate);
      if (style.position !== "fixed" || !isVisible(style)) continue;

      const candidateRect = candidate.getBoundingClientRect();
      if (candidateRect.width === 0 || candidateRect.height === 0) continue;

      offset = Math.max(offset, rect.bottom - candidateRect.top + GAP_PX);
    }
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
      const next = computeOverlapOffset(ref.current);
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
