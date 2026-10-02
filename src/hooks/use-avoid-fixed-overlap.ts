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

const rectsOverlap = (a: Rect, b: Rect): boolean =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const getFixedCandidates = (el: HTMLElement): Rect[] => {
  const candidates: Rect[] = [];

  for (const candidate of Array.from(document.body.querySelectorAll("*"))) {
    if (!(candidate instanceof HTMLElement)) continue;
    if (candidate === el || candidate.contains(el) || el.contains(candidate)) continue;

    const style = window.getComputedStyle(candidate);
    if (style.position !== "fixed" || !isVisible(style)) continue;

    const rect = candidate.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    candidates.push(rect);
  }

  return candidates;
};

const MAX_ITERATIONS = 8;

const computeOverlapOffset = (el: HTMLElement): number => {
  const natural = getNaturalRect(el);
  if (natural.width === 0 || natural.height === 0) return 0;

  const candidates = getFixedCandidates(el);

  let offset = 0;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const hypothetical: Rect = { ...natural, top: natural.top - offset, bottom: natural.bottom - offset };
    let required = offset;
    for (const candidateRect of candidates) {
      if (!rectsOverlap(hypothetical, candidateRect)) continue;
      required = Math.max(required, natural.bottom - candidateRect.top + GAP_PX);
    }
    if (required <= offset) break;
    offset = required;
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
