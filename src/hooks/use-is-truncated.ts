import { DependencyList, RefObject, useLayoutEffect, useRef, useState } from "react";

const TRUNCATION_TOLERANCE_PX = 1;

type ObserveTarget = HTMLElement | null;

export default function useIsTruncated(
  ref: RefObject<HTMLElement>,
  deps: DependencyList = [],
  observeTarget?: RefObject<HTMLElement>
): boolean {
  const [isTruncated, setIsTruncated] = useState(false);
  const truncationRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const target: ObserveTarget = observeTarget?.current ?? element;

    if (!element || !target) {
      truncationRef.current = false;
      setIsTruncated(false);
      return;
    }

    const measure = () => {
      if (!ref.current) return;
      const { scrollHeight, clientHeight } = ref.current;
      const nextValue = scrollHeight - clientHeight > TRUNCATION_TOLERANCE_PX;

      if (truncationRef.current !== nextValue) {
        truncationRef.current = nextValue;
        setIsTruncated(nextValue);
      }
    };

    const scheduleMeasurement = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        measure();
      });
    };

    scheduleMeasurement();

    const resizeObserver = new ResizeObserver(scheduleMeasurement);
    resizeObserver.observe(target);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [ref, observeTarget, ...deps]);

  return isTruncated;
}
